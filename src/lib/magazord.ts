import type { ConfiguracaoSelecionada } from "@/types";
import { magazordIds } from "@/data/magazord-mapping";

const MAGAZORD_BASE_URL = "https://www.wearsublimacoes.com.br";

/**
 * Monta a chave de mapeamento para buscar o ID do Magazord
 */
function getChaveMapeamento(config: ConfiguracaoSelecionada): string | null {
  const { modelo, tamanho, tecido, base } = config;
  if (!modelo || !tamanho || !tecido || !base) return null;
  return `${modelo}-${tamanho}-${tecido}-${base}`;
}

/**
 * Gera a URL de checkout do Magazord com o produto no carrinho
 * Opção A (redirect com link de carrinho) do PRD
 */
export function gerarUrlCheckout(config: ConfiguracaoSelecionada): string | null {
  const chave = getChaveMapeamento(config);
  if (!chave) return null;

  const productId = magazordIds[chave];
  if (!productId) {
    // Fallback: redireciona para a página do produto
    return `${MAGAZORD_BASE_URL}/bandeira-para-wind-banner-somente-tecido-escolha-o-tema-aqui`;
  }

  // TODO: validar formato exato da URL com suporte Magazord
  return `${MAGAZORD_BASE_URL}/checkout?add=${productId}&qty=${config.quantidade}`;
}
