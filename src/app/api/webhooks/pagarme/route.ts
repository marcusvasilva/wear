import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { validatePostbackSignature } from "@/lib/pagarme";
import { processPayment } from "@/lib/order-processor";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature") ?? "";

  // Validar assinatura do postback
  try {
    if (signature && !validatePostbackSignature(body, signature)) {
      return NextResponse.json({ error: "Assinatura invalida" }, { status: 401 });
    }
  } catch {
    // Se falhar a validacao, log mas continua (em dev pode nao ter assinatura)
    console.warn("Falha na validacao de assinatura do postback");
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
    await db
      .update(orders)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    // Processar pos-pagamento (Tiny + Melhor Envio + Email)
    // Executa de forma assincrona para nao atrasar o response
    processPayment(order.id).catch((err) => {
      console.error(`Erro no processamento pos-pagamento do pedido ${order.id}:`, err);
    });
  } else if (currentStatus === "refused") {
    await db
      .update(orders)
      .set({ status: "refused", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  } else if (currentStatus === "refunded") {
    await db
      .update(orders)
      .set({ status: "refunded", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  }

  return NextResponse.json({ ok: true });
}
