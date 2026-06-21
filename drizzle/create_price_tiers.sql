-- Faixa de preço por quantidade, por combinação modelo × base.
-- Preço unitário em centavos (base inclusa). minQty=1 é o preço cheio.
-- Quando há faixas, esta tabela é a fonte da verdade do preço (substitui
-- catalog_model_size.base_price + catalog_bases.preco_adicional + catalog_discounts).

CREATE TABLE IF NOT EXISTS "catalog_price_tiers" (
  "model_slug" text NOT NULL,
  "base_slug" text NOT NULL,
  "min_qty" integer NOT NULL,
  "preco_centavos" integer NOT NULL DEFAULT 0,
  CONSTRAINT "catalog_price_tiers_pk" PRIMARY KEY ("model_slug", "base_slug", "min_qty")
);
