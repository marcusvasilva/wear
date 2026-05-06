import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      pagarmeStatus: orders.pagarmeStatus,
      totalCentavos: orders.totalCentavos,
      trackingCode: orders.trackingCode,
      shippingService: orders.shippingService,
      createdAt: orders.createdAt,
      configJson: orders.configJson,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return NextResponse.json(rows);
}
