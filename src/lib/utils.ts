/**
 * Formata valor em centavos para moeda brasileira (R$ X.XXX,XX)
 */
export function formatCurrency(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

/**
 * Formata valor da parcela (6x sem juros)
 */
export function formatInstallment(centavos: number, parcelas = 6): string {
  const valorParcela = Math.ceil(centavos / parcelas);
  return `${parcelas}x de ${formatCurrency(valorParcela)} sem juros`;
}
