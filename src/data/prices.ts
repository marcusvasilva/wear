// Precos em centavos
import type { PriceTier } from "@/types";

// R$ 25,00 por arte criada pela Wear (nao acumula com desconto de quantidade)
export const PRECO_ARTE_WEAR = 2500;

// Dias uteis adicionais quando a Wear cria a arte
export const DIAS_ADICIONAIS_ARTE_WEAR = 2;

// ─── Matriz de preço por quantidade (fonte da verdade) ───
// Planilha "Preços Wind Banner" (Wear Sublimações). Medida única 0,75m x 2,00m.
// Preço unitário em centavos, com a base já inclusa, por faixa de quantidade.
// A faixa minQty=1 é o preço cheio; faixas maiores são o preço/un com desconto.
// Os 4 modelos (pena, faca, gota, vela) compartilham a mesma tabela.

// Por configuração de base (mesma para todos os modelos):
const TIERS_SEM_BASE: PriceTier[] = [
  { minQty: 1, precoCentavos: 5990 },
  { minQty: 5, precoCentavos: 5890 },
  { minQty: 10, precoCentavos: 5790 },
  { minQty: 20, precoCentavos: 5690 },
  { minQty: 50, precoCentavos: 5590 },
];

const TIERS_HASTE_TECIDO: PriceTier[] = [
  { minQty: 1, precoCentavos: 15490 },
  { minQty: 5, precoCentavos: 15290 },
  { minQty: 10, precoCentavos: 15149 },
  { minQty: 20, precoCentavos: 14990 },
  { minQty: 50, precoCentavos: 14790 },
];

const TIERS_BASE_HASTE_TECIDO: PriceTier[] = [
  { minQty: 1, precoCentavos: 22990 },
  { minQty: 5, precoCentavos: 22790 },
  { minQty: 10, precoCentavos: 22590 },
  { minQty: 20, precoCentavos: 22390 },
  { minQty: 50, precoCentavos: 21990 },
];

const TIERS_POR_BASE: Record<string, PriceTier[]> = {
  "sem-base": TIERS_SEM_BASE,
  "haste-tecido": TIERS_HASTE_TECIDO,
  "base-haste-tecido": TIERS_BASE_HASTE_TECIDO,
};

const MODELOS = ["pena", "faca", "gota", "vela"] as const;

// Chave "modelo-base" -> faixas de preço.
export const precoTiers: Record<string, PriceTier[]> = Object.fromEntries(
  MODELOS.flatMap((modelo) =>
    Object.entries(TIERS_POR_BASE).map(([base, tiers]) => [`${modelo}-${base}`, tiers]),
  ),
);

// ─── Fallback legado (preço base por modelo×tamanho×tecido) ───
// Mantido apenas como fallback quando não há faixa na matriz acima.
// Valores do tamanho único "m" alinhados ao preço de entrada (só tecido, 1un).
export const precos: Record<string, number> = {
  "pena-m-bora": 5990,
  "faca-m-bora": 5990,
  "gota-m-bora": 5990,
  "vela-m-bora": 5990,
};
