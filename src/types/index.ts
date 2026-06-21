// Os IDs de catálogo agora são dinâmicos (gerenciados no banco/admin),
// por isso são `string`. Tecido e Arte continuam fixos por regra de negócio.
export type ModeloId = string;
export type TamanhoId = string;
export type TecidoId = "bora";
export type BaseId = string;
export type ExtraId = string;
export type ArteId = "enviar-arte" | "wear-cria-arte";

export interface Modelo {
  id: ModeloId;
  nome: string;
  descricao: string;
  imagem: string;
  gabaritos: Record<TamanhoId, string>;
}

export interface Tamanho {
  id: TamanhoId;
  nome: string;
  dimensoes: string;
  imagem: string;
}

export interface Tecido {
  id: TecidoId;
  nome: string;
  descricao: string;
  imagem: string;
}

export interface Base {
  id: BaseId;
  nome: string;
  descricao: string;
  precoAdicional: number; // centavos
  imagem: string;
  imagensPorModelo?: Record<ModeloId, string>;
}

export interface Extra {
  id: ExtraId;
  nome: string;
  preco: number; // centavos
  imagem: string;
}

export interface DescontoQuantidade {
  minQty: number;
  descontoPercentual: number;
}

// Faixa de preço por quantidade: preço unitário (em centavos) já com a base
// inclusa. A faixa com minQty=1 é o preço cheio (sem desconto por quantidade).
export interface PriceTier {
  minQty: number;
  precoCentavos: number;
}

export interface ConfiguracaoSelecionada {
  modelo: ModeloId | null;
  tamanho: TamanhoId | null;
  tecido: TecidoId;
  base: BaseId | null;
  extras: ExtraId[];
  arte: ArteId | null;
  quantidadeArtes: number;
  quantidade: number;
}

// Catálogo completo, montado a partir do banco (com fallback para os
// defaults de código). É serializável para passar de Server -> Client Component.
export interface Catalog {
  modelos: Modelo[];
  tamanhos: Tamanho[];
  tecidos: Tecido[];
  bases: Base[];
  extras: Extra[];
  descontos: DescontoQuantidade[];
  // Chave "modelo-tamanho-tecido" -> preço base em centavos (mesma chave do calculador)
  precosBase: Record<string, number>;
  // Chave "modelo-base" -> faixas de preço por quantidade (preço unitário, base inclusa).
  // Quando presente, é a fonte da verdade do preço (substitui precosBase + adicional + desconto%).
  precoTiers: Record<string, PriceTier[]>;
  // Chave "modelo-tamanho-base" -> SKU do Tiny
  skus: Record<string, string>;
  precoArteWear: number;
  diasAdicionaisArteWear: number;
}

// Checkout types
export interface ShippingOption {
  id: number;
  name: string;
  company: string;
  price: number; // centavos
  deliveryDays: number;
  deliveryEstimate: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refused"
  | "refunded";
