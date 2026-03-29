import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod/v4";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email invalido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  cpf: z.string().min(11, "CPF invalido").max(14),
  phone: z.string().min(10, "Telefone invalido").max(15),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, cpf, phone } = result.data;

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ja esta cadastrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      name,
      email,
      passwordHash,
      cpf,
      phone,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
