import type { Modelo, Tamanho, Tecido, Base, Extra, DescontoQuantidade } from "@/types";

// TODO: substituir por imagens reais da Wear
const CDN = "https://d1br4h274rc9sc.cloudfront.net/content";

export const modelos: Modelo[] = [
  {
    id: "pena",
    nome: "Pena",
    descricao: "Formato clássico curvo",
    imagem: `${CDN}/Asa_0d60aa1657.png`,
    gabaritoUrl: "/gabaritos/gabarito-pena.pdf",
  },
  {
    id: "faca",
    nome: "Faca",
    descricao: "Formato retangular/reto",
    imagem: `${CDN}/Blade_917282dbe3.png`,
    gabaritoUrl: "/gabaritos/gabarito-faca.pdf",
  },
  {
    id: "gota",
    nome: "Gota",
    descricao: "Formato arredondado",
    imagem: `${CDN}/gota_5aa5759d4e.png`,
    gabaritoUrl: "/gabaritos/gabarito-gota.pdf",
  },
  {
    id: "vela",
    nome: "Vela",
    descricao: "Formato pontiagudo",
    imagem: `${CDN}/Vela_9b1f33907f.png`,
    gabaritoUrl: "/gabaritos/gabarito-vela.pdf",
  },
];

export const tamanhos: Tamanho[] = [
  {
    id: "p",
    nome: "Pequeno",
    dimensoes: "0,65m × 1,50m",
    imagem: `${CDN}/Display_1_Metro_PP_7c541c21ca.png`,
  },
  {
    id: "m",
    nome: "Médio",
    dimensoes: "0,65m × 2,00m",
    imagem: `${CDN}/Display_2_Metros_P_40ff5c2ec8.png`,
  },
  {
    id: "g",
    nome: "Grande",
    dimensoes: "0,65m × 2,50m",
    imagem: `${CDN}/Display_3_Metros_M_6acad4dc0d.png`,
  },
  {
    id: "gg",
    nome: "Extra Grande",
    dimensoes: "0,65m × 3,00m",
    imagem: `${CDN}/Display_4_Metros_G_319d962fcd.png`,
  },
];

export const tecidos: Tecido[] = [
  {
    id: "bora",
    nome: "Tecido Bora",
    descricao: "Sublimação com alta resolução, tipo veste fácil",
    imagem: `${CDN}/Tecido_Oxford_d2e5b38d5a.png`,
  },
  {
    id: "oxford",
    nome: "Oxford Blecaute",
    descricao: "Mais grosso, não transparece",
    imagem: `${CDN}/Tecido_Oxford_Blecaute_c9a961e9a0.png`,
  },
];

export const bases: Base[] = [
  {
    id: "sem-base",
    nome: "Sem base (somente tecido)",
    descricao: "Apenas a bandeira",
    precoAdicional: 0,
    imagem: `${CDN}/Sem_base_e_estrutura_7fbbeee037.png`,
  },
  {
    id: "kit-padrao",
    nome: "Kit Haste + Base Padrão",
    descricao: "Alumínio + base plástica preta",
    precoAdicional: 0, // TODO: preencher com preço real
    imagem: `${CDN}/Base_Padrao_Preto_1ff153c0ee.png`,
  },
  {
    id: "kit-premium",
    nome: "Kit Premium",
    descricao: "Alumínio + base premium",
    precoAdicional: 0, // TODO: preencher com preço real
    imagem: `${CDN}/Base_Premium_Preto_5d855cd95d.png`,
  },
];

export const extras: Extra[] = [
  {
    id: "bandeira-reserva",
    nome: "Bandeira Reserva",
    preco: 0, // TODO: preencher com preço real
    imagem: `${CDN}/Sem_personalizacao_c7a1d4e9b7.png`,
  },
  {
    id: "capa-protetora",
    nome: "Capa Protetora",
    preco: 0, // TODO: preencher com preço real
    imagem: `${CDN}/Pequena_ou_Grande_Enobrecimento_da_capa_4_cores_8b1a44e6e3.png`,
  },
];

export const descontos: DescontoQuantidade[] = [
  { minQty: 5, descontoPercentual: 5 },
  { minQty: 10, descontoPercentual: 10 },
  { minQty: 20, descontoPercentual: 15 },
  { minQty: 50, descontoPercentual: 20 },
];
