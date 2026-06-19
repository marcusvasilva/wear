import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { validatePostbackSignature } from "@/lib/pagarme";
import { processPayment } from "@/lib/order-processor";
import { sendPaymentFailed } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature") ?? "";

  // Validar assinatura do postback. Em producao a assinatura e obrigatoria
  // e qualquer falha rejeita a requisicao (evita webhooks forjados).
  const isProd = process.env.NODE_ENV === "production";
  try {
    if (isProd && !signature) {
      return NextResponse.json({ error: "Assinatura ausente" }, { status: 401 });
    }
    if (signature && !validatePostbackSignature(body, signature)) {
      return NextResponse.json({ error: "Assinatura invalida" }, { status: 401 });
    }
  } catch (err) {
    console.error("Falha na validacao de assinatura do postback:", err);
    if (isProd) {
      return NextResponse.json({ error: "Assinatura invalida" }, { status: 401 });
    }
  }

  const data = JSON.parse(body);
  const transactionId = String(data.transaction?.id ?? data.id ?? "");
  const currentStatus = data.current_status ?? data.status ?? "";

  if (!transactionId) {
    return NextResponse.json({ error: "Transaction ID ausente" }, { status: 400 });
  }

  // Buscar pedido pela transacao
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.pagarmeTransactionId, transactionId))
    .limit(1);

  if (!order) {
    return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
  }

  // Atualizar status do Pagar.me
  await db
    .update(orders)
    .set({
      pagarmeStatus: currentStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  // Processar conforme status
  if (currentStatus === "paid") {
    // Idempotencia: o Pagar.me reenvia webhooks. So processa se o pedido
    // ainda nao estava pago, evitando duplicar pedido no Tiny/etiqueta/email.
    const alreadyPaid = order.status === "paid";

    await db
      .update(orders)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    if (!alreadyPaid) {
      // Processar pos-pagamento (Tiny + Melhor Envio + Email)
      // Executa de forma assincrona para nao atrasar o response
      processPayment(order.id).catch((err) => {
        console.error(`Erro no processamento pos-pagamento do pedido ${order.id}:`, err);
      });
    }
  } else if (currentStatus === "refused") {
    // So envia o email na primeira vez que o pedido vira "refused"
    const wasRefused = order.status === "refused";
    await db
      .update(orders)
      .set({ status: "refused", updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    if (!wasRefused) {
      const [user] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, order.userId))
        .limit(1);

      if (user) {
        sendPaymentFailed({
          customerName: user.name ?? "Cliente",
          customerEmail: user.email,
          orderId: order.id,
        }).catch((err) => {
          console.error(`Falha ao enviar email de pagamento recusado (${order.id}):`, err);
        });
      }
    }
  } else if (currentStatus === "refunded") {
    await db
      .update(orders)
      .set({ status: "refunded", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  }

  return NextResponse.json({ ok: true });
}
