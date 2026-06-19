import { NextResponse } from "next/server";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { sendPaymentReminder } from "@/lib/email";

export const dynamic = "force-dynamic";

// Janela (em horas) antes do vencimento em que o lembrete e disparado.
const REMINDER_WINDOW_HOURS = 24;

function parseExpiration(
  paymentMethod: string,
  pixExpirationDate: Date | null,
  boletoExpirationDate: string | null
): Date | null {
  if (paymentMethod === "pix") return pixExpirationDate ?? null;
  if (paymentMethod === "boleto" && boletoExpirationDate) {
    const parsed = new Date(boletoExpirationDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function formatExpiration(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

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

  const now = Date.now();
  const windowMs = REMINDER_WINDOW_HOURS * 60 * 60 * 1000;

  const pending = await db
    .select({
      id: orders.id,
      paymentMethod: orders.paymentMethod,
      pixExpirationDate: orders.pixExpirationDate,
      boletoExpirationDate: orders.boletoExpirationDate,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(
      and(
        eq(orders.status, "pending"),
        isNull(orders.paymentReminderSentAt),
        inArray(orders.paymentMethod, ["pix", "boleto"])
      )
    );

  let sent = 0;
  const failures: string[] = [];

  for (const order of pending) {
    const expiresAt = parseExpiration(
      order.paymentMethod,
      order.pixExpirationDate,
      order.boletoExpirationDate
    );

    // Sem data valida, ja vencido, ou ainda fora da janela -> ignora
    if (!expiresAt) continue;
    const msUntil = expiresAt.getTime() - now;
    if (msUntil <= 0 || msUntil > windowMs) continue;
    if (!order.customerEmail) continue;

    try {
      await sendPaymentReminder({
        customerName: order.customerName ?? "Cliente",
        customerEmail: order.customerEmail,
        orderId: order.id,
        paymentMethod: order.paymentMethod,
        expiresAtLabel: formatExpiration(expiresAt),
      });

      await db
        .update(orders)
        .set({ paymentReminderSentAt: new Date(), updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      sent++;
    } catch (err) {
      failures.push(`${order.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (failures.length > 0) {
    console.error("Falhas ao enviar lembretes de pagamento:", failures);
  }

  return NextResponse.json({
    ok: true,
    checked: pending.length,
    sent,
    failed: failures.length,
  });
}
