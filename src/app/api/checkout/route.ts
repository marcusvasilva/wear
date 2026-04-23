import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, addresses, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { checkoutSchema } from "@/lib/validations";
import { calcularPreco } from "@/lib/price-calculator";
import { createTransaction } from "@/lib/pagarme";
import { getSku } from "@/data/sku-mapping";
import type { ConfiguracaoSelecionada } from "@/types";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // Verificar que o endereco pertence ao usuario
  const [address] = await db
    .select()
    .from(addresses)
    .where(eq(addresses.id, input.addressId))
    .limit(1);

  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Endereco nao encontrado" }, { status: 400 });
  }

  // Recalcular preco server-side (nunca confiar no client)
  const config: ConfiguracaoSelecionada = {
    modelo: input.modelo,
    tamanho: input.tamanho,
    tecido: "bora",
    base: input.base,
    extras: input.extras,
    arte: input.arte,
    quantidadeArtes: input.quantidadeArtes,
    quantidade: input.quantidade,
  };

  const preco = calcularPreco(config);
  const totalComFrete = preco.total + input.shippingPrice;

  // Criar pedido no banco
  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      addressId: input.addressId,
      status: "pending",
      subtotalCentavos: preco.subtotal,
      descontoCentavos: preco.descontoValor,
      freteCentavos: input.shippingPrice,
      totalCentavos: totalComFrete,
      paymentMethod: input.paymentMethod,
      shippingService: input.shippingService,
      shippingDeadline: input.shippingDeadline,
      configJson: JSON.stringify(config),
    })
    .returning();

  // Criar itens do pedido
  const sku = getSku(input.modelo, input.tamanho, input.base);

  await db.insert(orderItems).values({
    orderId: order.id,
    modelo: input.modelo,
    tamanho: input.tamanho,
    tecido: "bora",
    base: input.base,
    quantidade: input.quantidade,
    precoUnitarioCentavos: preco.precoBase + preco.precoAdicionalBase + preco.precoExtras,
    precoTotalCentavos: preco.total,
    tinySku: sku,
  });

  // Criar transacao no Pagar.me v4
  try {
    const phone = `+55${input.customerPhone}`;

    const transaction = await createTransaction({
      amount: totalComFrete,
      paymentMethod: input.paymentMethod,
      customer: {
        external_id: session.user.id,
        name: input.customerName,
        email: input.customerEmail,
        type: "individual",
        country: "br",
        documents: [{ type: "cpf", number: input.customerCpf }],
        phone_numbers: [phone],
      },
      billing: {
        name: input.customerName,
        address: {
          street: address.logradouro,
          street_number: address.numero,
          complementary: address.complemento ?? undefined,
          neighborhood: address.bairro,
          city: address.cidade,
          state: address.estado,
          zipcode: address.cep,
          country: "br",
        },
      },
      shipping: {
        name: input.customerName,
        fee: input.shippingPrice,
        address: {
          street: address.logradouro,
          street_number: address.numero,
          complementary: address.complemento ?? undefined,
          neighborhood: address.bairro,
          city: address.cidade,
          state: address.estado,
          zipcode: address.cep,
          country: "br",
        },
      },
      items: [
        {
          id: sku ?? `${input.modelo}-${input.tamanho}-${input.base}`,
          title: `Wind Banner ${input.modelo} ${input.tamanho} - ${input.base}`,
          unit_price: preco.precoBase + preco.precoAdicionalBase,
          quantity: input.quantidade,
          tangible: true,
        },
      ],
      cardHash: input.cardHash,
      installments: input.installments,
      orderId: order.id,
    });

    // Atualizar pedido com dados da transacao
    await db
      .update(orders)
      .set({
        pagarmeTransactionId: String(transaction.id),
        pagarmeStatus: transaction.status,
        status: transaction.status === "paid" ? "paid" : "pending",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    // Atualizar CPF/phone do usuario se nao tiver
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user && (!user.cpf || !user.phone)) {
      await db
        .update(users)
        .set({
          cpf: user.cpf || input.customerCpf,
          phone: user.phone || input.customerPhone,
        })
        .where(eq(users.id, session.user.id));
    }

    return NextResponse.json({
      orderId: order.id,
      status: transaction.status,
      pixQrCode: transaction.pix_qr_code,
      pixExpirationDate: transaction.pix_expiration_date,
      boletoUrl: transaction.boleto_url,
      boletoBarcode: transaction.boleto_barcode,
      boletoExpirationDate: transaction.boleto_expiration_date,
    });
  } catch (error) {
    // Marcar pedido como falho
    await db
      .update(orders)
      .set({
        status: "refused",
        processingErrors: error instanceof Error ? error.message : "Erro desconhecido",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    return NextResponse.json(
      { error: "Erro ao processar pagamento", orderId: order.id },
      { status: 500 }
    );
  }
}
