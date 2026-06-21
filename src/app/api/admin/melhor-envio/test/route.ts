import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { calcularFrete } from "@/lib/melhorenvio";
import { processPayment } from "@/lib/order-processor";

/**
 * Diagnostico da integracao com o Melhor Envio (somente admin).
 *
 * GET  -> teste de conectividade: faz uma cotacao de exemplo e confirma que
 *         o token esta valido e que apenas Correios aparece. NAO gera etiqueta
 *         (nao consome saldo).
 *
 * POST { orderId } -> reprocessa o pos-pagamento de um pedido (cria etiqueta
 *         no Melhor Envio se ainda nao existir). Util para destravar pedidos
 *         pagos cuja etiqueta falhou. E idempotente: nao duplica etiqueta.
 */
export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tokenConfigured = Boolean(process.env.MELHOR_ENVIO_TOKEN);
  if (!tokenConfigured) {
    return NextResponse.json(
      { ok: false, tokenConfigured: false, error: "MELHOR_ENVIO_TOKEN nao configurado" },
      { status: 500 },
    );
  }

  try {
    // Cotacao de exemplo: CEP de Sao Paulo, produto sem base tamanho M, 1 un.
    const opcoes = await calcularFrete("01310100", "sem-base", "m", 1);

    return NextResponse.json({
      ok: true,
      tokenConfigured: true,
      message:
        opcoes.length > 0
          ? "Conectividade OK. Token valido e cotacao retornando Correios."
          : "Token valido, mas nenhuma opcao dos Correios retornou para o CEP de teste.",
      totalOpcoes: opcoes.length,
      opcoes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        tokenConfigured: true,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let orderId: string | undefined;
  try {
    const body = (await request.json()) as { orderId?: string };
    orderId = body.orderId;
  } catch {
    // body invalido tratado abaixo
  }

  if (!orderId) {
    return NextResponse.json({ error: "orderId obrigatorio" }, { status: 400 });
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
  }

  try {
    await processPayment(orderId);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 502 },
    );
  }

  // Le o resultado apos o reprocessamento para confirmar o que foi criado.
  const [updated] = await db
    .select({
      status: orders.status,
      melhorenvioShipmentId: orders.melhorenvioShipmentId,
      trackingCode: orders.trackingCode,
      tinyPedidoId: orders.tinyPedidoId,
      tinyNfeId: orders.tinyNfeId,
      processingErrors: orders.processingErrors,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  return NextResponse.json({ ok: true, order: updated });
}
