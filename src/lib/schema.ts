import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Auth.js Tables ───

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  cpf: text("cpf"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─── Application Tables ───

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").default("Casa"),
  cep: text("cep").notNull(),
  logradouro: text("logradouro").notNull(),
  numero: text("numero").notNull(),
  complemento: text("complemento"),
  bairro: text("bairro").notNull(),
  cidade: text("cidade").notNull(),
  estado: text("estado").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  addressId: uuid("address_id")
    .references(() => addresses.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  // Values in centavos
  subtotalCentavos: integer("subtotal_centavos").notNull(),
  descontoCentavos: integer("desconto_centavos").notNull().default(0),
  freteCentavos: integer("frete_centavos").notNull().default(0),
  totalCentavos: integer("total_centavos").notNull(),
  // Payment
  paymentMethod: text("payment_method").notNull(),
  pagarmeTransactionId: text("pagarme_transaction_id"),
  pagarmeStatus: text("pagarme_status"),
  // PIX
  pixQrCode: text("pix_qr_code"),
  pixExpirationDate: timestamp("pix_expiration_date", { mode: "date" }),
  // Boleto
  boletoUrl: text("boleto_url"),
  boletoBarcode: text("boleto_barcode"),
  boletoExpirationDate: text("boleto_expiration_date"),
  // Tiny ERP
  tinyPedidoId: text("tiny_pedido_id"),
  tinyNfeId: text("tiny_nfe_id"),
  // Melhor Envio
  melhorenvioShipmentId: text("melhorenvio_shipment_id"),
  trackingCode: text("tracking_code"),
  shippingService: text("shipping_service"),
  shippingDeadline: text("shipping_deadline"),
  // Config snapshot
  configJson: text("config_json").notNull(),
  // Errors during processing
  processingErrors: text("processing_errors"),
  // Internal notes (admin only)
  adminNotes: text("admin_notes"),
  // Lembrete de pagamento (PIX/boleto) enviado
  paymentReminderSentAt: timestamp("payment_reminder_sent_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  modelo: text("modelo").notNull(),
  tamanho: text("tamanho").notNull(),
  tecido: text("tecido").notNull().default("bora"),
  base: text("base").notNull(),
  quantidade: integer("quantidade").notNull(),
  precoUnitarioCentavos: integer("preco_unitario_centavos").notNull(),
  precoTotalCentavos: integer("preco_total_centavos").notNull(),
  tinySku: text("tiny_sku"),
});

// ─── Catálogo de produtos (gerenciável pelo admin) ───
// As imagens NAO ficam aqui: sao resolvidas por slug em src/data/catalog-images.ts.

export const catalogModels = pgTable("catalog_models", {
  slug: text("slug").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao").notNull().default(""),
  ativo: boolean("ativo").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const catalogSizes = pgTable("catalog_sizes", {
  slug: text("slug").primaryKey(),
  nome: text("nome").notNull(),
  dimensoes: text("dimensoes").notNull().default(""),
  ativo: boolean("ativo").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const catalogBases = pgTable("catalog_bases", {
  slug: text("slug").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao").notNull().default(""),
  precoAdicionalCentavos: integer("preco_adicional_centavos").notNull().default(0),
  ativo: boolean("ativo").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const catalogExtras = pgTable("catalog_extras", {
  slug: text("slug").primaryKey(),
  nome: text("nome").notNull(),
  precoCentavos: integer("preco_centavos").notNull().default(0),
  ativo: boolean("ativo").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const catalogDiscounts = pgTable("catalog_discounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  minQty: integer("min_qty").notNull(),
  percentual: integer("percentual").notNull(),
});

// Preço base e gabarito por combinação modelo × tamanho
export const catalogModelSize = pgTable(
  "catalog_model_size",
  {
    modelSlug: text("model_slug").notNull(),
    sizeSlug: text("size_slug").notNull(),
    basePriceCentavos: integer("base_price_centavos").notNull().default(0),
    gabaritoUrl: text("gabarito_url"),
  },
  (t) => [primaryKey({ columns: [t.modelSlug, t.sizeSlug] })]
);

// Faixa de preço por quantidade, por combinação modelo × base.
// Preço unitário em centavos (base inclusa). minQty=1 é o preço cheio.
export const catalogPriceTiers = pgTable(
  "catalog_price_tiers",
  {
    modelSlug: text("model_slug").notNull(),
    baseSlug: text("base_slug").notNull(),
    minQty: integer("min_qty").notNull(),
    precoCentavos: integer("preco_centavos").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.modelSlug, t.baseSlug, t.minQty] })]
);

// SKU do Tiny por combinação modelo × tamanho × base
export const catalogSkus = pgTable(
  "catalog_skus",
  {
    modelSlug: text("model_slug").notNull(),
    sizeSlug: text("size_slug").notNull(),
    baseSlug: text("base_slug").notNull(),
    tinySku: text("tiny_sku"),
  },
  (t) => [primaryKey({ columns: [t.modelSlug, t.sizeSlug, t.baseSlug] })]
);

// Configurações gerais (preço de arte, dias adicionais, etc.)
export const catalogSettings = pgTable("catalog_settings", {
  key: text("key").primaryKey(),
  valueInt: integer("value_int"),
  valueText: text("value_text"),
});
