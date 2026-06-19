import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import { addresses, orderItems, orders, users } from "@/lib/schema";
import { sendShippingNotification, sendDeliveryConfirmation } from "@/lib/email";
import type { OrderStatus } from "@/types";

const VALID_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refused",
  "refunded",
];

interface PatchBody {
  status?: string;
  trackingCode?: string | null;
  shippingService?: string | null;
  adminNotes?: string | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const [row] = await db
    .select({
      order: orders,
      customer: {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        cpf: users.cpf,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  const [address] = row.order.addressId
    ? await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, row.order.addressId))
        .limit(1)
    : [null];

  return NextResponse.json({
    order: row.order,
    customer: row.customer,
    items,
    address,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as PatchBody;

  const [previous] = await db
    .select({ status: orders.status })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const updates: Partial<typeof orders.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status as OrderStatus)) {
      return NextResponse.json(
        { error: "Status invalido" },
        { status: 400 }
      );
    }
    updates.status = body.status;
  }

  if (body.trackingCode !== undefined) {
    updates.trackingCode = body.trackingCode || null;
  }
  if (body.shippingService !== undefined) {
    updates.shippingService = body.shippingService || null;
  }
  if (body.adminNotes !== undefined) {
    updates.adminNotes = body.adminNotes || null;
  }

  const [updated] = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
  }

  // Notificacoes por email apenas na transicao de status
  const statusChanged =
    body.status !== undefined && previous?.status !== updated.status;

  if (statusChanged && (updated.status === "shipped" || updated.status === "delivered")) {
    const [customer] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, updated.userId))
      .limit(1);

    if (customer) {
      const payload = {
        customerName: customer.name ?? "Cliente",
        customerEmail: customer.email,
        orderId: updated.id,
      };

      const send =
        updated.status === "shipped"
          ? sendShippingNotification({
              ...payload,
              trackingCode: updated.trackingCode ?? "A definir",
              shippingService: updated.shippingService ?? "A definir",
            })
          : sendDeliveryConfirmation(payload);

      send.catch((err) => {
        console.error(`Falha ao enviar email de status (${updated.id}):`, err);
      });
    }
  }

  return NextResponse.json({ order: updated });
}
