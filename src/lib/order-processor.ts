import { db } from "./db";
import { orders, orderItems, addresses, users } from "./schema";
import { eq } from "drizzle-orm";
import { incluirPedido, gerarNotaFiscal } from "./tiny";
import { criarEtiqueta, pagarEtiqueta, gerarEtiqueta, getPackageDimensions } from "./melhorenvio";
import { sendOrderConfirmation } from "./email";
import { formatCurrency } from "./utils";
import type { BaseId, TamanhoId } from "@/types";

/**
 * Processa um pedido apos confirmacao de pagamento.
 * 1. Cria pedido no Tiny ERP
 * 2. Gera NF-e
 * 3. Cria etiqueta de envio no Melhor Envio
 * 4. Envia email de confirmacao
 */
export async function processPayment(orderId: string): Promise<void> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new Error(`Pedido ${orderId} nao encontrado`);

  const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
  if (!user) throw new Error(`Usuario do pedido nao encontrado`);

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  const [address] = order.addressId
    ? await db.select().from(addresses).where(eq(addresses.id, order.addressId)).limit(1)
    : [null];

  const errors: string[] = [];

  // 1. Criar pedido no Tiny ERP
  let tinyPedidoId: string | null = null;
  try {
    if (address) {
      tinyPedidoId = await incluirPedido({
        orderId: order.id,
        customerName: user.name ?? "Cliente",
        customerCpf: user.cpf ?? "",
        customerEmail: user.email,
        customerPhone: user.phone ?? "",
        address: {
          logradouro: address.logradouro,
          numero: address.numero,
          complemento: address.complemento,
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado,
          cep: address.cep,
        },
        items: items.map((item) => ({
          sku: item.tinySku ?? `${item.modelo}-${item.tamanho}-${item.base}`,
          descricao: `Wind Banner ${item.modelo} ${item.tamanho} - ${item.base}`,
          quantidade: item.quantidade,
          valorUnitario: item.precoUnitarioCentavos / 100,
        })),
        valorFrete: order.freteCentavos / 100,
        valorDesconto: order.descontoCentavos / 100,
        paymentMethod: order.paymentMethod,
      });

      await db
        .update(orders)
        .set({ tinyPedidoId, updatedAt: new Date() })
        .where(eq(orders.id, orderId));
    }
  } catch (err) {
    errors.push(`Tiny pedido: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Gerar NF-e no Tiny
  let tinyNfeId: string | null = null;
  try {
    if (tinyPedidoId) {
      tinyNfeId = await gerarNotaFiscal(tinyPedidoId);
      await db
        .update(orders)
        .set({ tinyNfeId, updatedAt: new Date() })
        .where(eq(orders.id, orderId));
    }
  } catch (err) {
    errors.push(`Tiny NF-e: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 3. Criar etiqueta de envio no Melhor Envio
  try {
    if (address && items.length > 0) {
      const item = items[0];
      const dims = getPackageDimensions(
        item.base as BaseId,
        item.tamanho as TamanhoId,
        item.quantidade
      );

      const etiqueta = await criarEtiqueta({
        service: order.shippingService ? parseInt(order.shippingService) || 1 : 1,
        from: {
          name: "Wear Sublimacoes",
          phone: "18998074936",
          email: "contato.wear.artefatos@gmail.com",
          document: "34616422000108",
          company_document: "34616422000108",
          state_register: "",
          address: "Avenida Euclides Miragaia",
          number: "51",
          complement: "SN",
          district: "Residencial Capuano",
          city: "Birigui",
          state_abbr: "SP",
          country_id: "BR",
          postal_code: "16204281",
        },
        to: {
          name: user.name ?? "Cliente",
          phone: user.phone ?? "",
          email: user.email,
          document: user.cpf ?? "",
          address: address.logradouro,
          number: address.numero,
          complement: address.complemento ?? "",
          district: address.bairro,
          city: address.cidade,
          state_abbr: address.estado,
          country_id: "BR",
          postal_code: address.cep,
        },
        products: [
          {
            name: `Wind Banner ${item.modelo} ${item.tamanho}`,
            quantity: item.quantidade,
            unitary_value: item.precoUnitarioCentavos / 100,
          },
        ],
        volumes: [
          {
            height: dims.height,
            width: dims.width,
            length: dims.length,
            weight: dims.weight,
          },
        ],
        options: {
          insurance_value: order.totalCentavos / 100,
          receipt: false,
          own_hand: false,
        },
      });

      const shipmentId =
        typeof etiqueta === "object" && etiqueta !== null && "id" in etiqueta
          ? String((etiqueta as { id: string }).id)
          : null;

      if (shipmentId) {
        // Pagar e gerar a etiqueta
        const checkout = await pagarEtiqueta([shipmentId]);
        await gerarEtiqueta([shipmentId]);

        // Extrair tracking code do checkout
        let trackingCode: string | null = null;
        if (
          typeof checkout === "object" &&
          checkout !== null &&
          "purchase" in checkout
        ) {
          const purchase = (checkout as { purchase: { orders?: Array<{ tracking?: string }> } }).purchase;
          trackingCode = purchase?.orders?.[0]?.tracking ?? null;
        }

        await db
          .update(orders)
          .set({
            melhorenvioShipmentId: shipmentId,
            trackingCode,
            status: "processing",
            updatedAt: new Date(),
          })
          .where(eq(orders.id, orderId));
      }
    }
  } catch (err) {
    errors.push(`Melhor Envio: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 4. Enviar email de confirmacao
  try {
    const item = items[0];
    await sendOrderConfirmation({
      customerName: user.name ?? "Cliente",
      customerEmail: user.email,
      orderId: order.id,
      items: item
        ? `Wind Banner ${item.modelo} ${item.tamanho} - ${item.base} (x${item.quantidade})`
        : "Wind Banner",
      total: formatCurrency(order.totalCentavos),
      paymentMethod: order.paymentMethod,
      shippingService: order.shippingService ?? "A definir",
      shippingDeadline: order.shippingDeadline ?? "A definir",
    });
  } catch (err) {
    errors.push(`Email: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Salvar erros se houver
  if (errors.length > 0) {
    await db
      .update(orders)
      .set({
        processingErrors: errors.join(" | "),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  }

  // Atualizar status para processing se nao houve erro critico
  if (!errors.some((e) => e.startsWith("Tiny pedido:"))) {
    await db
      .update(orders)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  }
}
