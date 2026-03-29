export type ModeloId = "pena" | "faca" | "gota" | "vela";
export type TamanhoId = "p" | "m" | "g" | "gg";
export type TecidoId = "bora";
export type BaseId = "sem-base" | "haste-tecido" | "base-haste-tecido";
export type ExtraId = "bandeira-reserva" | "capa-protetora";

export interface Modelo {
  id: ModeloId;
  nome: string;
  descricao: string;
  imagem: string;
  gabaritoUrl: string;
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

export interface ConfiguracaoSelecionada {
  modelo: ModeloId | null;
  tamanho: TamanhoId | null;
  tecido: TecidoId;
  base: BaseId | null;
  extras: ExtraId[];
  quantidade: number;
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
