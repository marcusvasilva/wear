import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const userOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalCentavos: orders.totalCentavos,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      configJson: orders.configJson,
    })
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  return NextResponse.json(userOrders);
}
