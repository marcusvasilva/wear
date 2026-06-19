/**
 * Seed do catálogo a partir dos arquivos estáticos atuais (src/data/*).
 * Garante paridade exata com o comportamento de hoje.
 *
 * Uso: npx tsx scripts/seed-catalog.ts
 * Requer DATABASE_URL no .env.local (carregado via dotenv).
 * Idempotente: pode rodar várias vezes (onConflictDoUpdate / replace).
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/schema";
import { modelos, tamanhos, bases, extras, descontos } from "../src/data/products";
import { precos, PRECO_ARTE_WEAR, DIAS_ADICIONAIS_ARTE_WEAR } from "../src/data/prices";
import { skuMapping } from "../src/data/sku-mapping";

// Carrega as variáveis do .env.local (o projeto não usa .env)
config({ path: ".env.local" });

const {
  catalogModels,
  catalogSizes,
  catalogBases,
  catalogExtras,
  catalogDiscounts,
  catalogModelSize,
  catalogSkus,
  catalogSettings,
} = schema;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não encontrada (.env.local)");
  }
  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  console.log("Seeding catálogo...");

  // Modelos
  for (const [i, m] of modelos.entries()) {
    await db
      .insert(catalogModels)
      .values({ slug: m.id, nome: m.nome, descricao: m.descricao, ativo: true, sort: i })
      .onConflictDoUpdate({
        target: catalogModels.slug,
        set: { nome: m.nome, descricao: m.descricao, sort: i },
      });
  }
  console.log(`  ${modelos.length} modelos`);

  // Tamanhos
  for (const [i, t] of tamanhos.entries()) {
    await db
      .insert(catalogSizes)
      .values({ slug: t.id, nome: t.nome, dimensoes: t.dimensoes, ativo: true, sort: i })
      .onConflictDoUpdate({
        target: catalogSizes.slug,
        set: { nome: t.nome, dimensoes: t.dimensoes, sort: i },
      });
  }
  console.log(`  ${tamanhos.length} tamanhos`);

  // Bases
  for (const [i, b] of bases.entries()) {
    await db
      .insert(catalogBases)
      .values({
        slug: b.id,
        nome: b.nome,
        descricao: b.descricao,
        precoAdicionalCentavos: b.precoAdicional,
        ativo: true,
        sort: i,
      })
      .onConflictDoUpdate({
        target: catalogBases.slug,
        set: { nome: b.nome, descricao: b.descricao, precoAdicionalCentavos: b.precoAdicional, sort: i },
      });
  }
  console.log(`  ${bases.length} bases`);

  // Extras
  for (const [i, e] of extras.entries()) {
    await db
      .insert(catalogExtras)
      .values({ slug: e.id, nome: e.nome, precoCentavos: e.preco, ativo: true, sort: i })
      .onConflictDoUpdate({
        target: catalogExtras.slug,
        set: { nome: e.nome, precoCentavos: e.preco, sort: i },
      });
  }
  console.log(`  ${extras.length} extras`);

  // Descontos (replace completo — não há chave natural estável)
  await db.delete(catalogDiscounts);
  if (descontos.length > 0) {
    await db.insert(catalogDiscounts).values(
      descontos.map((d) => ({ minQty: d.minQty, percentual: d.descontoPercentual }))
    );
  }
  console.log(`  ${descontos.length} descontos`);

  // Preço base + gabarito por modelo × tamanho
  let msCount = 0;
  for (const m of modelos) {
    for (const t of tamanhos) {
      const basePriceCentavos = precos[`${m.id}-${t.id}-bora`] ?? 0;
      const gabaritoUrl = m.gabaritos[t.id] ?? null;
      await db
        .insert(catalogModelSize)
        .values({ modelSlug: m.id, sizeSlug: t.id, basePriceCentavos, gabaritoUrl })
        .onConflictDoUpdate({
          target: [catalogModelSize.modelSlug, catalogModelSize.sizeSlug],
          set: { basePriceCentavos, gabaritoUrl },
        });
      msCount++;
    }
  }
  console.log(`  ${msCount} preços/gabaritos (modelo × tamanho)`);

  // SKUs por modelo × tamanho × base
  let skuCount = 0;
  for (const m of modelos) {
    for (const t of tamanhos) {
      for (const b of bases) {
        const tinySku = skuMapping[`${m.id}-${t.id}-${b.id}`] ?? null;
        await db
          .insert(catalogSkus)
          .values({ modelSlug: m.id, sizeSlug: t.id, baseSlug: b.id, tinySku })
          .onConflictDoUpdate({
            target: [catalogSkus.modelSlug, catalogSkus.sizeSlug, catalogSkus.baseSlug],
            set: { tinySku },
          });
        skuCount++;
      }
    }
  }
  console.log(`  ${skuCount} SKUs (modelo × tamanho × base)`);

  // Configurações
  const settings = [
    { key: "preco_arte_wear", valueInt: PRECO_ARTE_WEAR, valueText: null },
    { key: "dias_adicionais_arte_wear", valueInt: DIAS_ADICIONAIS_ARTE_WEAR, valueText: null },
  ];
  for (const s of settings) {
    await db
      .insert(catalogSettings)
      .values(s)
      .onConflictDoUpdate({
        target: catalogSettings.key,
        set: { valueInt: s.valueInt, valueText: s.valueText },
      });
  }
  console.log(`  ${settings.length} configurações`);

  console.log("Catálogo populado com sucesso.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Falha no seed:", err);
    process.exit(1);
  });
