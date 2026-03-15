import type { Modelo, Tamanho, Tecido, Base, Extra, DescontoQuantidade } from "@/types";

export const modelos: Modelo[] = [
  {
    id: "pena",
    nome: "Pena",
    descricao: "Formato clássico curvo",
    imagem: "/products/modelo-pena.png",
    gabaritoUrl: "/gabaritos/gabarito-pena.pdf",
  },
  {
    id: "faca",
    nome: "Faca",
    descricao: "Formato retangular/reto",
    imagem: "/products/modelo-faca.png",
    gabaritoUrl: "/gabaritos/gabarito-faca.pdf",
  },
  {
    id: "gota",
    nome: "Gota",
    descricao: "Formato arredondado",
    imagem: "/products/modelo-gota.png",
    gabaritoUrl: "/gabaritos/gabarito-gota.pdf",
  },
  {
    id: "vela",
    nome: "Vela",
    descricao: "Formato pontiagudo",
    imagem: "/products/modelo-vela.png",
    gabaritoUrl: "/gabaritos/gabarito-vela.pdf",
  },
];

export const tamanhos: Tamanho[] = [
  {
    id: "p",
    nome: "Pequeno",
    dimensoes: "0,65m × 1,50m",
    imagem: "/products/tamanho-p.png",
  },
  {
    id: "m",
    nome: "Médio",
    dimensoes: "0,65m × 2,00m",
    imagem: "/products/tamanho-m.png",
  },
  {
    id: "g",
    nome: "Grande",
    dimensoes: "0,65m × 2,50m",
    imagem: "/products/tamanho-g.png",
  },
  {
    id: "gg",
    nome: "Extra Grande",
    dimensoes: "0,65m × 3,00m",
    imagem: "/products/tamanho-gg.png",
  },
];

export const tecidos: Tecido[] = [
  {
    id: "bora",
    nome: "Tecido Bora",
    descricao: "Sublimação com alta resolução, tipo veste fácil",
    imagem: "/products/tecido-bora.png",
  },
  {
    id: "oxford",
    nome: "Oxford Blecaute",
    descricao: "Mais grosso, não transparece",
    imagem: "/products/tecido-oxford.png",
  },
];

export const bases: Base[] = [
  {
    id: "sem-base",
    nome: "Sem base (somente tecido)",
    descricao: "Apenas a bandeira",
    precoAdicional: 0,
    imagem: "/products/base-sem.png",
  },
  {
    id: "kit-padrao",
    nome: "Kit Haste + Base Padrão",
    descricao: "Alumínio + base plástica preta",
    precoAdicional: 0, // TODO: preencher com preço real
    imagem: "/products/base-padrao.png",
  },
  {
    id: "kit-premium",
    nome: "Kit Premium",
    descricao: "Alumínio + base premium",
    precoAdicional: 0, // TODO: preencher com preço real
    imagem: "/products/base-premium.png",
  },
];

export const extras: Extra[] = [
  {
    id: "bandeira-reserva",
    nome: "Bandeira Reserva",
    preco: 0, // TODO: preencher com preço real
    imagem: "/products/extra-bandeira.png",
  },
  {
    id: "capa-protetora",
    nome: "Capa Protetora",
    preco: 0, // TODO: preencher com preço real
    imagem: "/products/extra-capa.png",
  },
];

export const descontos: DescontoQuantidade[] = [
  { minQty: 5, descontoPercentual: 5 },
  { minQty: 10, descontoPercentual: 10 },
  { minQty: 20, descontoPercentual: 15 },
  { minQty: 50, descontoPercentual: 20 },
];
