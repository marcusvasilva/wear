// Mapeamento de configuracao -> SKU do Tiny ERP
// Chave: "modelo-tamanho-base"
// Valor: codigo SKU no Tiny
// SKUs da planilha "Preços Wind Banner" (medida única). Como há um único
// tamanho, o SKU depende apenas de modelo + base; o mesmo código vale para
// qualquer tamanho.
//
// Padrão de SKU:
//   WB{MODELO}            -> Base + Haste + Tecido  (base-haste-tecido)
//   WB{MODELO}-AS         -> Haste + Tecido          (haste-tecido)
//   WB{MODELO}-AS-BA      -> Somente Tecido          (sem-base)
// Códigos de modelo: F=Faca, V=Vela, PE=Pena, G=Gota.

const SKU_POR_MODELO_BASE: Record<string, Record<string, string>> = {
  pena: {
    "sem-base": "WBPE-AS-BA",
    "haste-tecido": "WBPE-AS",
    "base-haste-tecido": "WBPE",
  },
  faca: {
    "sem-base": "WBF-AS-BA",
    "haste-tecido": "WBF-AS",
    "base-haste-tecido": "WBF",
  },
  gota: {
    "sem-base": "WBG-AS-BA",
    "haste-tecido": "WBG-AS",
    "base-haste-tecido": "WBG",
  },
  vela: {
    "sem-base": "WBV-AS-BA",
    "haste-tecido": "WBV-AS",
    "base-haste-tecido": "WBV",
  },
};

const TAMANHOS = ["p", "m", "g", "gg"];

// Expande para todas as combinações modelo×tamanho×base usando o mesmo SKU
// (independente do tamanho, pois o produto tem medida única).
export const skuMapping: Record<string, string> = Object.fromEntries(
  Object.entries(SKU_POR_MODELO_BASE).flatMap(([modelo, porBase]) =>
    Object.entries(porBase).flatMap(([base, sku]) =>
      TAMANHOS.map((tamanho) => [`${modelo}-${tamanho}-${base}`, sku]),
    ),
  ),
);

export function getSku(modelo: string, tamanho: string, base: string): string | null {
  return skuMapping[`${modelo}-${tamanho}-${base}`] ?? null;
}
