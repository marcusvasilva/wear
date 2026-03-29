import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addresses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { addressSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .orderBy(addresses.createdAt);

  return NextResponse.json(userAddresses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = addressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [newAddress] = await db
    .insert(addresses)
    .values({
      userId: session.user.id,
      cep: parsed.data.cep,
      logradouro: parsed.data.logradouro,
      numero: parsed.data.numero,
      complemento: parsed.data.complemento ?? null,
      bairro: parsed.data.bairro,
      cidade: parsed.data.cidade,
      estado: parsed.data.estado.toUpperCase(),
    })
    .returning();

  return NextResponse.json(newAddress, { status: 201 });
}
