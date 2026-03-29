import { NextResponse } from "next/server";
import { z } from "zod";
import { calcularFrete } from "@/lib/melhorenvio";

const FreightRequestSchema = z.object({
  cep: z.string().regex(/^\d{8}$/, "CEP deve conter 8 digitos"),
  base: z.enum(["sem-base", "haste-tecido", "base-haste-tecido"]),
  tamanho: z.enum(["p", "m", "g", "gg"]),
  quantidade: z.number().int().positive("Quantidade deve ser positiva"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = FreightRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { cep, base, tamanho, quantidade } = parsed.data;
    const opcoes = await calcularFrete(cep, base, tamanho, quantidade);

    return NextResponse.json(opcoes);
  } catch (error) {
    console.error("[freight] Erro ao calcular frete:", error);
    return NextResponse.json(
      { error: "Erro ao calcular frete. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
