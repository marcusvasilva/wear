// Imagens do catálogo resolvidas por SLUG (decisão: imagens continuam em código).
// Itens novos criados pelo painel sem slug mapeado aqui caem no placeholder
// até um dev adicionar o mapeamento.

const CDN_LEGADO = "https://d1br4h274rc9sc.cloudfront.net/content";

// Placeholder para slugs ainda não mapeados (aponta para um asset existente
// para evitar 404; troque por uma imagem genérica quando houver).
export const PLACEHOLDER_IMAGE = "/images/modelos/pena.jpg";

const modeloImages: Record<string, string> = {
  pena: "/images/modelos/pena.jpg",
  faca: "/images/modelos/faca.jpg",
  gota: "/images/modelos/gota.jpg",
  vela: "/images/modelos/vela.jpg",
};

const tamanhoImages: Record<string, string> = {
  p: "/images/tamanhos/p-150.jpg",
  m: "/images/tamanhos/m-200.jpg",
  g: "/images/tamanhos/g-250.jpg",
  gg: "/images/tamanhos/gg-300.jpg",
};

const tecidoImages: Record<string, string> = {
  bora: `${CDN_LEGADO}/Tecido_Oxford_d2e5b38d5a.png`,
};

const baseImages: Record<string, string> = {
  "sem-base": "/images/modelos/pena.jpg",
  "haste-tecido": "/images/bases/haste-pena.jpg",
  "base-haste-tecido": "/images/bases/completa-pena.jpg",
};

// Imagem da base variando por modelo: baseImagesPorModelo[baseSlug][modeloSlug]
const baseImagesPorModelo: Record<string, Record<string, string>> = {
  "sem-base": {
    pena: "/images/modelos/pena.jpg",
    faca: "/images/modelos/faca.jpg",
    gota: "/images/modelos/gota.jpg",
    vela: "/images/modelos/vela.jpg",
  },
  "haste-tecido": {
    pena: "/images/bases/haste-pena.jpg",
    faca: "/images/bases/haste-faca.jpg",
    gota: "/images/bases/haste-gota.jpg",
    vela: "/images/bases/haste-vela.jpg",
  },
  "base-haste-tecido": {
    pena: "/images/bases/completa-pena.jpg",
    faca: "/images/bases/completa-faca.jpg",
    gota: "/images/bases/completa-gota.jpg",
    vela: "/images/bases/completa-vela.jpg",
  },
};

const extraImages: Record<string, string> = {
  "bandeira-reserva": `${CDN_LEGADO}/Sem_personalizacao_c7a1d4e9b7.png`,
  "capa-protetora": `${CDN_LEGADO}/Pequena_ou_Grande_Enobrecimento_da_capa_4_cores_8b1a44e6e3.png`,
};

export function modeloImage(slug: string): string {
  return modeloImages[slug] ?? PLACEHOLDER_IMAGE;
}

export function tamanhoImage(slug: string): string {
  return tamanhoImages[slug] ?? PLACEHOLDER_IMAGE;
}

export function tecidoImage(slug: string): string {
  return tecidoImages[slug] ?? PLACEHOLDER_IMAGE;
}

export function baseImage(slug: string): string {
  return baseImages[slug] ?? PLACEHOLDER_IMAGE;
}

export function baseImagensPorModelo(
  baseSlug: string,
  modeloSlugs: string[]
): Record<string, string> | undefined {
  const map = baseImagesPorModelo[baseSlug];
  if (!map) return undefined;
  // Garante uma entrada para cada modelo ativo (fallback para a imagem base).
  return Object.fromEntries(
    modeloSlugs.map((m) => [m, map[m] ?? baseImage(baseSlug)])
  );
}

export function extraImage(slug: string): string {
  return extraImages[slug] ?? PLACEHOLDER_IMAGE;
}
