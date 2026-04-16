import type { Modelo, Tamanho, Tecido, Base, Extra, DescontoQuantidade } from "@/types";

export const modelos: Modelo[] = [
  {
    id: "pena",
    nome: "Pena",
    descricao: "Formato classico curvo",
    imagem: "/images/modelos/pena.jpg",
    gabaritoUrl: "/gabaritos/gabarito-pena.pdf",
  },
  {
    id: "faca",
    nome: "Faca",
    descricao: "Formato retangular/reto",
    imagem: "/images/modelos/faca.jpg",
    gabaritoUrl: "/gabaritos/gabarito-faca.pdf",
  },
  {
    id: "gota",
    nome: "Gota",
    descricao: "Formato arredondado",
    imagem: "/images/modelos/gota.jpg",
    gabaritoUrl: "/gabaritos/gabarito-gota.pdf",
  },
  {
    id: "vela",
    nome: "Vela",
    descricao: "Formato pontiagudo",
    imagem: "/images/modelos/vela.jpg",
    gabaritoUrl: "/gabaritos/gabarito-vela.pdf",
  },
];

export const tamanhos: Tamanho[] = [
  {
    id: "p",
    nome: "Pequeno",
    dimensoes: "0,65m x 1,50m",
    imagem: "/images/tamanhos/p-150.jpg",
  },
  {
    id: "m",
    nome: "Medio",
    dimensoes: "0,65m x 2,00m",
    imagem: "/images/tamanhos/m-200.jpg",
  },
  {
    id: "g",
    nome: "Grande",
    dimensoes: "0,65m x 2,50m",
    imagem: "/images/tamanhos/g-250.jpg",
  },
  {
    id: "gg",
    nome: "Extra Grande",
    dimensoes: "0,65m x 3,00m",
    imagem: "/images/tamanhos/gg-300.jpg",
  },
];

// CDN legado para itens que ainda não possuem imagem local
const CDN_LEGADO = "https://d1br4h274rc9sc.cloudfront.net/content";

export const tecidos: Tecido[] = [
  {
    id: "bora",
    nome: "Tecido Bora",
    descricao: "Sublimacao com alta resolucao, tipo veste facil",
    imagem: `${CDN_LEGADO}/Tecido_Oxford_d2e5b38d5a.png`,
  },
];

export const bases: Base[] = [
  {
    id: "sem-base",
    nome: "Somente Tecido",
    descricao: "Apenas a bandeira, sem estrutura",
    precoAdicional: 0,
    imagem: "/images/modelos/pena.jpg",
    imagensPorModelo: {
      pena: "/images/modelos/pena.jpg",
      faca: "/images/modelos/faca.jpg",
      gota: "/images/modelos/gota.jpg",
      vela: "/images/modelos/vela.jpg",
    },
  },
  {
    id: "haste-tecido",
    nome: "Haste + Tecido",
    descricao: "Haste de aluminio + bandeira",
    precoAdicional: 4500, // TODO: preencher com preco real
    imagem: "/images/bases/haste-pena.jpg",
    imagensPorModelo: {
      pena: "/images/bases/haste-pena.jpg",
      faca: "/images/bases/haste-faca.jpg",
      gota: "/images/bases/haste-gota.jpg",
      vela: "/images/bases/haste-vela.jpg",
    },
  },
  {
    id: "base-haste-tecido",
    nome: "Base + Haste + Tecido",
    descricao: "Kit completo: base + haste + bandeira",
    precoAdicional: 8900, // TODO: preencher com preco real
    imagem: "/images/bases/completa-pena.jpg",
    imagensPorModelo: {
      pena: "/images/bases/completa-pena.jpg",
      faca: "/images/bases/completa-faca.jpg",
      gota: "/images/bases/completa-gota.jpg",
      vela: "/images/bases/completa-vela.jpg",
    },
  },
];

export const extras: Extra[] = [
  {
    id: "bandeira-reserva",
    nome: "Bandeira Reserva",
    preco: 0, // TODO: preencher com preco real
    imagem: `${CDN_LEGADO}/Sem_personalizacao_c7a1d4e9b7.png`,
  },
  {
    id: "capa-protetora",
    nome: "Capa Protetora",
    preco: 0, // TODO: preencher com preco real
    imagem: `${CDN_LEGADO}/Pequena_ou_Grande_Enobrecimento_da_capa_4_cores_8b1a44e6e3.png`,
  },
];

export const descontos: DescontoQuantidade[] = [
  { minQty: 5, descontoPercentual: 5 },
  { minQty: 10, descontoPercentual: 10 },
  { minQty: 20, descontoPercentual: 15 },
  { minQty: 50, descontoPercentual: 20 },
];
