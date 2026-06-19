import type { ConfiguracaoSelecionada, Catalog } from "@/types";

/**
 * Calcula o preço total da configuração selecionada em centavos.
 * Recebe o catálogo (vindo do banco, com fallback de código) como fonte de preços.
 */
export function calcularPreco(
  config: ConfiguracaoSelecionada,
  catalog: Catalog
): {
  precoBase: number;
  precoAdicionalBase: number;
  precoExtras: number;
  precoArtes: number;
  subtotal: number;
  descontoPercentual: number;
  descontoValor: number;
  total: number;
} {
  const { precosBase: precos, bases, extras, descontos, precoArteWear } = catalog;
  const {
    modelo,
    tamanho,
    tecido,
    base,
    extras: extrasSelecionados,
    arte,
    quantidadeArtes,
    quantidade,
  } = config;

  if (!modelo || !tamanho) {
    return {
      precoBase: 0,
      precoAdicionalBase: 0,
      precoExtras: 0,
      precoArtes: 0,
      subtotal: 0,
      descontoPercentual: 0,
      descontoValor: 0,
      total: 0,
    };
  }

  const chavePreco = `${modelo}-${tamanho}-${tecido}`;
  const precoBase = precos[chavePreco] ?? 0;

  const baseSelecionada = bases.find((b) => b.id === base);
  const precoAdicionalBase = baseSelecionada?.precoAdicional ?? 0;

  const precoExtras = extrasSelecionados.reduce((acc, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return acc + (extra?.preco ?? 0);
  }, 0);

  const precoUnitario = precoBase + precoAdicionalBase + precoExtras;
  const subtotal = precoUnitario * quantidade;

  const descontoAplicavel = descontos
    .filter((d) => quantidade >= d.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0];

  const descontoPercentual = descontoAplicavel?.descontoPercentual ?? 0;
  const descontoValor = Math.round(subtotal * (descontoPercentual / 100));

  const precoArtes =
    arte === "wear-cria-arte" ? Math.max(1, quantidadeArtes) * precoArteWear : 0;

  const total = subtotal - descontoValor + precoArtes;

  return {
    precoBase,
    precoAdicionalBase,
    precoExtras,
    precoArtes,
    subtotal,
    descontoPercentual,
    descontoValor,
    total,
  };
}
