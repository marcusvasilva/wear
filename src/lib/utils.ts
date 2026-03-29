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

// ─── Input Masks ───

/** 000.000.000-00 */
export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** (00) 00000-0000 or (00) 0000-0000 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/** 00000-000 */
export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

/** 0000 0000 0000 0000 */
export function maskCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** MM/AA */
export function maskExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.replace(/(\d{2})(\d)/, "$1/$2");
}

/** Extract only digits from a masked value */
export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}
