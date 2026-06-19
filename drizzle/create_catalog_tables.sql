-- Catálogo de produtos gerenciável pelo admin.
-- Imagens NAO ficam no banco: sao resolvidas por slug em src/data/catalog-images.ts.

CREATE TABLE IF NOT EXISTS "catalog_models" (
  "slug" text PRIMARY KEY,
  "nome" text NOT NULL,
  "descricao" text NOT NULL DEFAULT '',
  "ativo" boolean NOT NULL DEFAULT true,
  "sort" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "catalog_sizes" (
  "slug" text PRIMARY KEY,
  "nome" text NOT NULL,
  "dimensoes" text NOT NULL DEFAULT '',
  "ativo" boolean NOT NULL DEFAULT true,
  "sort" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "catalog_bases" (
  "slug" text PRIMARY KEY,
  "nome" text NOT NULL,
  "descricao" text NOT NULL DEFAULT '',
  "preco_adicional_centavos" integer NOT NULL DEFAULT 0,
  "ativo" boolean NOT NULL DEFAULT true,
  "sort" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "catalog_extras" (
  "slug" text PRIMARY KEY,
  "nome" text NOT NULL,
  "preco_centavos" integer NOT NULL DEFAULT 0,
  "ativo" boolean NOT NULL DEFAULT true,
  "sort" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "catalog_discounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "min_qty" integer NOT NULL,
  "percentual" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "catalog_model_size" (
  "model_slug" text NOT NULL,
  "size_slug" text NOT NULL,
  "base_price_centavos" integer NOT NULL DEFAULT 0,
  "gabarito_url" text,
  CONSTRAINT "catalog_model_size_pk" PRIMARY KEY ("model_slug", "size_slug")
);

CREATE TABLE IF NOT EXISTS "catalog_skus" (
  "model_slug" text NOT NULL,
  "size_slug" text NOT NULL,
  "base_slug" text NOT NULL,
  "tiny_sku" text,
  CONSTRAINT "catalog_skus_pk" PRIMARY KEY ("model_slug", "size_slug", "base_slug")
);

CREATE TABLE IF NOT EXISTS "catalog_settings" (
  "key" text PRIMARY KEY,
  "value_int" integer,
  "value_text" text
);
