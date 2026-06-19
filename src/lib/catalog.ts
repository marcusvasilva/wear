import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "./db";
import {
  catalogModels,
  catalogSizes,
  catalogBases,
  catalogExtras,
  catalogDiscounts,
  catalogModelSize,
  catalogSkus,
  catalogSettings,
} from "./schema";
import type { Catalog } from "@/types";

// Defaults de código (fallback quando o banco está vazio ou indisponível).
import {
  modelos as modelosSeed,
  tamanhos as tamanhosSeed,
  tecidos as tecidosSeed,
  bases as basesSeed,
  extras as extrasSeed,
  descontos as descontosSeed,
} from "@/data/products";
import {
  precos as precosSeed,
  PRECO_ARTE_WEAR,
  DIAS_ADICIONAIS_ARTE_WEAR,
} from "@/data/prices";
import { skuMapping as skuSeed } from "@/data/sku-mapping";
import {
  modeloImage,
  tamanhoImage,
  tecidoImage,
  baseImage,
  baseImagensPorModelo,
  extraImage,
} from "@/data/catalog-images";

/**
 * Catálogo a partir dos arquivos estáticos. Usado como fallback e como
 * fonte da verdade enquanto o banco não foi populado (paridade com hoje).
 */
function fallbackCatalog(): Catalog {
  return {
    modelos: modelosSeed,
    tamanhos: tamanhosSeed,
    tecidos: tecidosSeed,
    bases: basesSeed,
    extras: extrasSeed,
    descontos: descontosSeed,
    precosBase: { ...precosSeed },
    skus: { ...skuSeed },
    precoArteWear: PRECO_ARTE_WEAR,
    diasAdicionaisArteWear: DIAS_ADICIONAIS_ARTE_WEAR,
  };
}

async function buildFromDb(): Promise<Catalog | null> {
  const [
    modelRows,
    sizeRows,
    baseRows,
    extraRows,
    discountRows,
    msRows,
    skuRows,
    settingRows,
  ] = await Promise.all([
    db.select().from(catalogModels).where(eq(catalogModels.ativo, true)),
    db.select().from(catalogSizes).where(eq(catalogSizes.ativo, true)),
    db.select().from(catalogBases).where(eq(catalogBases.ativo, true)),
    db.select().from(catalogExtras).where(eq(catalogExtras.ativo, true)),
    db.select().from(catalogDiscounts),
    db.select().from(catalogModelSize),
    db.select().from(catalogSkus),
    db.select().from(catalogSettings),
  ]);

  // Banco ainda não populado → deixa o chamador usar o fallback.
  if (modelRows.length === 0) return null;

  const modelOrder = [...modelRows].sort((a, b) => a.sort - b.sort);
  const sizeOrder = [...sizeRows].sort((a, b) => a.sort - b.sort);
  const modelSlugs = modelOrder.map((m) => m.slug);

  // Gabaritos por modelo: { [sizeSlug]: url }
  const gabaritosPorModelo: Record<string, Record<string, string>> = {};
  const precosBase: Record<string, number> = {};
  for (const row of msRows) {
    if (row.gabaritoUrl) {
      (gabaritosPorModelo[row.modelSlug] ??= {})[row.sizeSlug] = row.gabaritoUrl;
    }
    precosBase[`${row.modelSlug}-${row.sizeSlug}-bora`] = row.basePriceCentavos;
  }

  const skus: Record<string, string> = {};
  for (const row of skuRows) {
    if (row.tinySku) {
      skus[`${row.modelSlug}-${row.sizeSlug}-${row.baseSlug}`] = row.tinySku;
    }
  }

  const settingsInt: Record<string, number> = {};
  for (const row of settingRows) {
    if (row.valueInt != null) settingsInt[row.key] = row.valueInt;
  }

  return {
    modelos: modelOrder.map((m) => ({
      id: m.slug,
      nome: m.nome,
      descricao: m.descricao,
      imagem: modeloImage(m.slug),
      gabaritos: gabaritosPorModelo[m.slug] ?? {},
    })),
    tamanhos: sizeOrder.map((s) => ({
      id: s.slug,
      nome: s.nome,
      dimensoes: s.dimensoes,
      imagem: tamanhoImage(s.slug),
    })),
    tecidos: [
      {
        id: "bora",
        nome: tecidosSeed[0]?.nome ?? "Tecido Bora",
        descricao: tecidosSeed[0]?.descricao ?? "",
        imagem: tecidoImage("bora"),
      },
    ],
    bases: [...baseRows]
      .sort((a, b) => a.sort - b.sort)
      .map((b) => ({
        id: b.slug,
        nome: b.nome,
        descricao: b.descricao,
        precoAdicional: b.precoAdicionalCentavos,
        imagem: baseImage(b.slug),
        imagensPorModelo: baseImagensPorModelo(b.slug, modelSlugs),
      })),
    extras: [...extraRows]
      .sort((a, b) => a.sort - b.sort)
      .map((e) => ({
        id: e.slug,
        nome: e.nome,
        preco: e.precoCentavos,
        imagem: extraImage(e.slug),
      })),
    descontos: [...discountRows]
      .sort((a, b) => a.minQty - b.minQty)
      .map((d) => ({ minQty: d.minQty, descontoPercentual: d.percentual })),
    precosBase,
    skus,
    precoArteWear: settingsInt["preco_arte_wear"] ?? PRECO_ARTE_WEAR,
    diasAdicionaisArteWear:
      settingsInt["dias_adicionais_arte_wear"] ?? DIAS_ADICIONAIS_ARTE_WEAR,
  };
}

/**
 * Retorna o catálogo completo. Lê do banco; se as tabelas estiverem vazias
 * ou indisponíveis (migração não aplicada), usa os defaults de código.
 * Memoizado por request via React cache().
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  try {
    const fromDb = await buildFromDb();
    return fromDb ?? fallbackCatalog();
  } catch (err) {
    // 42P01 = tabelas ainda não migradas: caso esperado antes do cutover,
    // não polui o log. O drizzle embrulha o erro, então o código vem em `cause`.
    const e = err as { code?: string; cause?: { code?: string } };
    const code = e?.code ?? e?.cause?.code;
    if (code !== "42P01") {
      console.error("[catalog] falha ao ler do banco, usando fallback de código:", err);
    }
    return fallbackCatalog();
  }
});

/** Busca o SKU do Tiny para uma combinação modelo × tamanho × base. */
export function getSkuFromCatalog(
  catalog: Catalog,
  modelo: string,
  tamanho: string,
  base: string
): string | null {
  return catalog.skus[`${modelo}-${tamanho}-${base}`] ?? null;
}
