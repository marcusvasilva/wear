-- Adiciona campo de notas internas do admin
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "admin_notes" text;
