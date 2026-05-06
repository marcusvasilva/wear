-- Adiciona campos de PIX e boleto na tabela orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "pix_qr_code" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "pix_expiration_date" timestamp;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "boleto_url" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "boleto_barcode" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "boleto_expiration_date" text;
