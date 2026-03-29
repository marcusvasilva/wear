// Mapeamento de configuracao -> SKU do Tiny ERP
// Chave: "modelo-tamanho-base"
// Valor: codigo SKU no Tiny (ex: "WB-001")
// TODO: preencher com os SKUs reais do Tiny ERP
// Os SKUs WB-001 a WB-075+ estao cadastrados no Tiny como "Bandeira Para Wind Banner ... Somente Tecido 0,75x2,00"
export const skuMapping: Record<string, string> = {
  // Pena
  "pena-p-sem-base": "WB-001",
  "pena-m-sem-base": "WB-002",
  "pena-g-sem-base": "WB-003",
  "pena-gg-sem-base": "WB-004",
  "pena-p-haste-tecido": "WB-005",
  "pena-m-haste-tecido": "WB-006",
  "pena-g-haste-tecido": "WB-007",
  "pena-gg-haste-tecido": "WB-008",
  "pena-p-base-haste-tecido": "WB-009",
  "pena-m-base-haste-tecido": "WB-010",
  "pena-g-base-haste-tecido": "WB-011",
  "pena-gg-base-haste-tecido": "WB-012",

  // Faca
  "faca-p-sem-base": "WB-013",
  "faca-m-sem-base": "WB-014",
  "faca-g-sem-base": "WB-015",
  "faca-gg-sem-base": "WB-016",
  "faca-p-haste-tecido": "WB-017",
  "faca-m-haste-tecido": "WB-018",
  "faca-g-haste-tecido": "WB-019",
  "faca-gg-haste-tecido": "WB-020",
  "faca-p-base-haste-tecido": "WB-021",
  "faca-m-base-haste-tecido": "WB-022",
  "faca-g-base-haste-tecido": "WB-023",
  "faca-gg-base-haste-tecido": "WB-024",

  // Gota
  "gota-p-sem-base": "WB-025",
  "gota-m-sem-base": "WB-026",
  "gota-g-sem-base": "WB-027",
  "gota-gg-sem-base": "WB-028",
  "gota-p-haste-tecido": "WB-029",
  "gota-m-haste-tecido": "WB-030",
  "gota-g-haste-tecido": "WB-031",
  "gota-gg-haste-tecido": "WB-032",
  "gota-p-base-haste-tecido": "WB-033",
  "gota-m-base-haste-tecido": "WB-034",
  "gota-g-base-haste-tecido": "WB-035",
  "gota-gg-base-haste-tecido": "WB-036",

  // Vela
  "vela-p-sem-base": "WB-037",
  "vela-m-sem-base": "WB-038",
  "vela-g-sem-base": "WB-039",
  "vela-gg-sem-base": "WB-040",
  "vela-p-haste-tecido": "WB-041",
  "vela-m-haste-tecido": "WB-042",
  "vela-g-haste-tecido": "WB-043",
  "vela-gg-haste-tecido": "WB-044",
  "vela-p-base-haste-tecido": "WB-045",
  "vela-m-base-haste-tecido": "WB-046",
  "vela-g-base-haste-tecido": "WB-047",
  "vela-gg-base-haste-tecido": "WB-048",
};

export function getSku(modelo: string, tamanho: string, base: string): string | null {
  return skuMapping[`${modelo}-${tamanho}-${base}`] ?? null;
}
