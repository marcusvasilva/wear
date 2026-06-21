// Envia UM unico email de teste (Confirmacao de pedido) para validar antes do resto.
// Uso: node --env-file=.env.local .email-previews/send-one.mjs [email-destino]

import { Resend } from "resend";

const TO = process.argv[2] ?? "mvassis.311@gmail.com";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("❌ RESEND_API_KEY não encontrada. Rode com: node --env-file=.env.local ...");
  process.exit(1);
}
const resend = new Resend(apiKey);

const FROM_EMAIL = "Wear Sublimações <nao-responda@send.wearsublimacoes.com.br>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://wb.wearsublimacoes.com.br";
const orderUrl = (id) => `${APP_URL}/pedido/${id}`;
const shortId = (id) => id.slice(0, 8);

function layout(heading, bodyHtml) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #1B1B1B; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Wear Sublimações</h1>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #2ECC40;">${heading}</h2>
        ${bodyHtml}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Dúvidas? Entre em contato pelo WhatsApp: (18) 99807-4936
        </p>
      </div>
    </div>
  `;
}
const card = (i) => `<div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">${i}</div>`;
const button = (href, label) => `<a href="${href}" style="display:inline-block;background:#2ECC40;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:8px;margin:8px 0;">${label}</a>`;

const orderId = "a1b2c3d4-5678-90ef-ghij-klmnopqrstuv";
const name = "Maria Silva";

const subject = `Pedido recebido #${shortId(orderId)}`;
const html = layout("Pedido confirmado!", `
        <p>Olá ${name},</p>
        <p>Recebemos seu pedido e estamos preparando tudo para você.</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Pedido:</strong> #${shortId(orderId)}</p>
          <p style="margin: 4px 0;"><strong>Produto:</strong> Wind Banner Pena 2,8m - Tecido Premium</p>
          <p style="margin: 4px 0;"><strong>Total:</strong> R$ 489,90</p>
          <p style="margin: 4px 0;"><strong>Pagamento:</strong> PIX</p>
          <p style="margin: 4px 0;"><strong>Envio:</strong> Sedex (3 a 5 dias úteis)</p>
        `)}
        <p>Você pode acompanhar o status do seu pedido a qualquer momento.</p>
        ${button(orderUrl(orderId), "Acompanhar pedido")}`);

console.log(`\n📧 Enviando 1 email de teste (Confirmação de pedido) para: ${TO}\n`);

const { data, error } = await resend.emails.send({ from: FROM_EMAIL, to: TO, subject, html });

if (error) {
  console.error(`❌ ERRO: ${JSON.stringify(error)}\n`);
  process.exit(1);
}
console.log(`✅ Enviado com sucesso! (id: ${data?.id})\n`);
