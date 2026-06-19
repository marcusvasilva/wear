import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin";
import { db } from "@/lib/db";
import {
  catalogModels,
  catalogSizes,
  catalogBases,
  catalogExtras,
  catalogDiscounts,
  catalogModelSize,
  catalogSkus,
  catalogSettings,
} from "@/lib/schema";

const slug = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen");
const centavos = z.number().int().min(0);

// ─── GET: catálogo completo (inclui itens inativos) para o admin ───
export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [models, sizes, bases, extras, discounts, modelSize, skus, settings] =
    await Promise.all([
      db.select().from(catalogModels).orderBy(asc(catalogModels.sort)),
      db.select().from(catalogSizes).orderBy(asc(catalogSizes.sort)),
      db.select().from(catalogBases).orderBy(asc(catalogBases.sort)),
      db.select().from(catalogExtras).orderBy(asc(catalogExtras.sort)),
      db.select().from(catalogDiscounts).orderBy(asc(catalogDiscounts.minQty)),
      db.select().from(catalogModelSize),
      db.select().from(catalogSkus),
      db.select().from(catalogSettings),
    ]);

  return NextResponse.json({
    models,
    sizes,
    bases,
    extras,
    discounts,
    modelSize,
    skus,
    settings,
  });
}

// ─── POST: mutações (action discriminator) ───
const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("upsertModel"),
    slug,
    nome: z.string().min(1),
    descricao: z.string().default(""),
    ativo: z.boolean().default(true),
    sort: z.number().int().default(0),
  }),
  z.object({ action: z.literal("deleteModel"), slug }),
  z.object({
    action: z.literal("upsertSize"),
    slug,
    nome: z.string().min(1),
    dimensoes: z.string().default(""),
    ativo: z.boolean().default(true),
    sort: z.number().int().default(0),
  }),
  z.object({ action: z.literal("deleteSize"), slug }),
  z.object({
    action: z.literal("upsertBase"),
    slug,
    nome: z.string().min(1),
    descricao: z.string().default(""),
    precoAdicionalCentavos: centavos,
    ativo: z.boolean().default(true),
    sort: z.number().int().default(0),
  }),
  z.object({ action: z.literal("deleteBase"), slug }),
  z.object({
    action: z.literal("upsertExtra"),
    slug,
    nome: z.string().min(1),
    precoCentavos: centavos,
    ativo: z.boolean().default(true),
    sort: z.number().int().default(0),
  }),
  z.object({ action: z.literal("deleteExtra"), slug }),
  z.object({
    action: z.literal("setDiscounts"),
    discounts: z
      .array(z.object({ minQty: z.number().int().min(1), percentual: z.number().int().min(0).max(100) }))
      .max(20),
  }),
  z.object({
    action: z.literal("setModelSize"),
    modelSlug: slug,
    sizeSlug: slug,
    basePriceCentavos: centavos,
    gabaritoUrl: z.string().max(500).nullable().default(null),
  }),
  z.object({
    action: z.literal("setSku"),
    modelSlug: slug,
    sizeSlug: slug,
    baseSlug: slug,
    tinySku: z.string().max(60).nullable().default(null),
  }),
  z.object({
    action: z.literal("setSetting"),
    key: z.enum(["preco_arte_wear", "dias_adicionais_arte_wear"]),
    valueInt: z.number().int().min(0),
  }),
]);

export async function POST(request: Request) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const a = parsed.data;

  switch (a.action) {
    case "upsertModel":
      await db
        .insert(catalogModels)
        .values({ slug: a.slug, nome: a.nome, descricao: a.descricao, ativo: a.ativo, sort: a.sort })
        .onConflictDoUpdate({
          target: catalogModels.slug,
          set: { nome: a.nome, descricao: a.descricao, ativo: a.ativo, sort: a.sort },
        });
      break;
    case "deleteModel":
      await db.delete(catalogModelSize).where(eq(catalogModelSize.modelSlug, a.slug));
      await db.delete(catalogSkus).where(eq(catalogSkus.modelSlug, a.slug));
      await db.delete(catalogModels).where(eq(catalogModels.slug, a.slug));
      break;
    case "upsertSize":
      await db
        .insert(catalogSizes)
        .values({ slug: a.slug, nome: a.nome, dimensoes: a.dimensoes, ativo: a.ativo, sort: a.sort })
        .onConflictDoUpdate({
          target: catalogSizes.slug,
          set: { nome: a.nome, dimensoes: a.dimensoes, ativo: a.ativo, sort: a.sort },
        });
      break;
    case "deleteSize":
      await db.delete(catalogModelSize).where(eq(catalogModelSize.sizeSlug, a.slug));
      await db.delete(catalogSkus).where(eq(catalogSkus.sizeSlug, a.slug));
      await db.delete(catalogSizes).where(eq(catalogSizes.slug, a.slug));
      break;
    case "upsertBase":
      await db
        .insert(catalogBases)
        .values({
          slug: a.slug,
          nome: a.nome,
          descricao: a.descricao,
          precoAdicionalCentavos: a.precoAdicionalCentavos,
          ativo: a.ativo,
          sort: a.sort,
        })
        .onConflictDoUpdate({
          target: catalogBases.slug,
          set: {
            nome: a.nome,
            descricao: a.descricao,
            precoAdicionalCentavos: a.precoAdicionalCentavos,
            ativo: a.ativo,
            sort: a.sort,
          },
        });
      break;
    case "deleteBase":
      await db.delete(catalogSkus).where(eq(catalogSkus.baseSlug, a.slug));
      await db.delete(catalogBases).where(eq(catalogBases.slug, a.slug));
      break;
    case "upsertExtra":
      await db
        .insert(catalogExtras)
        .values({ slug: a.slug, nome: a.nome, precoCentavos: a.precoCentavos, ativo: a.ativo, sort: a.sort })
        .onConflictDoUpdate({
          target: catalogExtras.slug,
          set: { nome: a.nome, precoCentavos: a.precoCentavos, ativo: a.ativo, sort: a.sort },
        });
      break;
    case "deleteExtra":
      await db.delete(catalogExtras).where(eq(catalogExtras.slug, a.slug));
      break;
    case "setDiscounts":
      await db.delete(catalogDiscounts);
      if (a.discounts.length > 0) {
        await db.insert(catalogDiscounts).values(a.discounts);
      }
      break;
    case "setModelSize":
      await db
        .insert(catalogModelSize)
        .values({
          modelSlug: a.modelSlug,
          sizeSlug: a.sizeSlug,
          basePriceCentavos: a.basePriceCentavos,
          gabaritoUrl: a.gabaritoUrl,
        })
        .onConflictDoUpdate({
          target: [catalogModelSize.modelSlug, catalogModelSize.sizeSlug],
          set: { basePriceCentavos: a.basePriceCentavos, gabaritoUrl: a.gabaritoUrl },
        });
      break;
    case "setSku":
      await db
        .insert(catalogSkus)
        .values({
          modelSlug: a.modelSlug,
          sizeSlug: a.sizeSlug,
          baseSlug: a.baseSlug,
          tinySku: a.tinySku,
        })
        .onConflictDoUpdate({
          target: [catalogSkus.modelSlug, catalogSkus.sizeSlug, catalogSkus.baseSlug],
          set: { tinySku: a.tinySku },
        });
      break;
    case "setSetting":
      await db
        .insert(catalogSettings)
        .values({ key: a.key, valueInt: a.valueInt, valueText: null })
        .onConflictDoUpdate({ target: catalogSettings.key, set: { valueInt: a.valueInt } });
      break;
  }

  // Atualiza o catálogo público (landing + checkout)
  revalidatePath("/");
  revalidatePath("/checkout");

  return NextResponse.json({ ok: true });
}
