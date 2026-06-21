import { NextResponse } from "next/server";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { consultarPedido, extrairTracking } from "@/lib/melhorenvio";

export const dynamic = "force-dynamic";

// Limite de pedidos processados por execucao, para nao estourar o tempo
// de funcao caso haja um acumulo grande.
const MAX_PER_RUN = 50;

/**
 * Backfill de codigo de rastreio.
 *
 * Recupera pedidos que ja tem etiqueta no Melhor Envio
 * (melhorenvioShipmentId preenchido) mas cujo trackingCode ainda esta vazio
 * — casos em que o codigo nao foi emitido a tempo no pos-pagamento.
 * Consulta o Melhor Envio e preenche o que estiver disponivel.
 */
export async function GET(request: Request) {
  // Protecao: Vercel Cron envia Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("CRON_SECRET nao configurada — rota de cron sem protecao");
  }

  const pending = await db
    .select({
      id: orders.id,
      shipmentId: orders.melhorenvioShipmentId,
    })
    .from(orders)
    .where(
      and(
        isNotNull(orders.melhorenvioShipmentId),
        isNull(orders.trackingCode)
      )
    )
    .limit(MAX_PER_RUN);

  let filled = 0;
  const failures: string[] = [];

  for (const order of pending) {
    if (!order.shipmentId) continue;

    try {
      const pedido = await consultarPedido(order.shipmentId);
      const trackingCode = extrairTracking(pedido, order.shipmentId);

      // Ainda sem codigo emitido — tenta de novo na proxima execucao.
      if (!trackingCode) continue;

      await db
        .update(orders)
        .set({ trackingCode, updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      filled++;
    } catch (err) {
      failures.push(`${order.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (failures.length > 0) {
    console.error("Falhas no backfill de rastreio:", failures);
  }

  return NextResponse.json({
    ok: true,
    checked: pending.length,
    filled,
    failed: failures.length,
  });
}
