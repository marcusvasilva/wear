-- Adiciona controle de envio do lembrete de pagamento (PIX/boleto)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_reminder_sent_at" timestamp;
