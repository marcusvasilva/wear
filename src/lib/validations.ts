import { z } from "zod";

export const cepSchema = z
  .string()
  .regex(/^\d{8}$/, "CEP deve ter 8 digitos");

export const cpfSchema = z
  .string()
  .regex(/^\d{11}$/, "CPF deve ter 11 digitos")
  .refine((cpf) => {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(cpf[10]);
  }, "CPF invalido");

export const phoneSchema = z
  .string()
  .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 digitos");

export const addressSchema = z.object({
  cep: cepSchema,
  logradouro: z.string().min(1, "Logradouro obrigatorio"),
  numero: z.string().min(1, "Numero obrigatorio"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro obrigatorio"),
  cidade: z.string().min(1, "Cidade obrigatoria"),
  estado: z.string().length(2, "Estado deve ter 2 letras"),
});

export const checkoutSchema = z.object({
  // Product config
  modelo: z.enum(["pena", "faca", "gota", "vela"]),
  tamanho: z.enum(["p", "m", "g", "gg"]),
  base: z.enum(["sem-base", "haste-tecido", "base-haste-tecido"]),
  extras: z.array(z.enum(["bandeira-reserva", "capa-protetora"])).default([]),
  arte: z.enum(["enviar-arte", "wear-cria-arte"]),
  quantidadeArtes: z.number().int().min(1).max(1000).default(1),
  quantidade: z.number().int().min(1).max(1000),

  // Shipping
  addressId: z.string().uuid(),
  shippingOptionId: z.number().int(),
  shippingPrice: z.number().int().min(0),
  shippingService: z.string(),
  shippingDeadline: z.string(),

  // Payment
  paymentMethod: z.enum(["credit_card", "pix", "boleto"]),
  cardHash: z.string().optional(),
  installments: z.number().int().min(1).max(6).default(1),

  // Customer (for Pagar.me)
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerCpf: cpfSchema,
  customerPhone: phoneSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
