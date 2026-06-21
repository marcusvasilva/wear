// Envia os 6 emails transacionais reais (mesmos templates de src/lib/email.ts)
// para um email de teste, com intervalo entre cada envio para evitar spam.
//
// Uso:
//   node --env-file=.env.local .email-previews/send-tests.mjs [email-destino]
//
// Ex.: node --env-file=.env.local .email-previews/send-tests.mjs mvassis.311@gmail.com
//
// Precisa de RESEND_API_KEY no .env.local.

import { Resend } from "resend";

const TO = process.argv[2] ?? "mvassis.311@gmail.com";
const DELAY_MS = 10000; // 10s entre cada envio (anti-spam / rate limit)

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("❌ RESEND_API_KEY não encontrada. Rode com: node --env-file=.env.local .email-previews/send-tests.mjs");
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
const paymentLabel = (m) => (m === "credit_card" ? "Cartão de Crédito" : m === "pix" ? "PIX" : "Boleto");

const orderId = "a1b2c3d4-5678-90ef-ghij-klmnopqrstuv";
const name = "Maria Silva";

const emails = [
  {
    label: "1. Confirmação de pedido",
    subject: `Pedido recebido #${shortId(orderId)}`,
    html: layout("Pedido confirmado!", `
        <p>Olá ${name},</p>
        <p>Recebemos seu pedido e estamos preparando tudo para você.</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Pedido:</strong> #${shortId(orderId)}</p>
          <p style="margin: 4px 0;"><strong>Produto:</strong> Wind Banner Pena 2,8m - Tecido Premium</p>
          <p style="margin: 4px 0;"><strong>Total:</strong> R$ 489,90</p>
          <p style="margin: 4px 0;"><strong>Pagamento:</strong> ${paymentLabel("pix")}</p>
          <p style="margin: 4px 0;"><strong>Envio:</strong> Sedex (3 a 5 dias úteis)</p>
        `)}
        <p>Você pode acompanhar o status do seu pedido a qualquer momento.</p>
        ${button(orderUrl(orderId), "Acompanhar pedido")}`),
  },
  {
    label: "2. Pedido enviado",
    subject: `Seu pedido foi enviado! #${shortId(orderId)}`,
    html: layout("Pedido enviado!", `
        <p>Olá ${name},</p>
        <p>Seu pedido #${shortId(orderId)} foi despachado!</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Transportadora:</strong> Sedex</p>
          <p style="margin: 4px 0;"><strong>Código de rastreamento:</strong> BR123456789BR</p>
        `)}
        ${button(orderUrl(orderId), "Acompanhar pedido")}`),
  },
  {
    label: "3. Pedido entregue",
    subject: `Seu pedido foi entregue! #${shortId(orderId)}`,
    html: layout("Pedido entregue!", `
        <p>Olá ${name},</p>
        <p>Seu pedido #${shortId(orderId)} foi entregue. Esperamos que você ame o resultado!</p>
        <p>Se algo não saiu como esperado, fale com a gente pelo WhatsApp que resolvemos rapidinho.</p>
        ${button(orderUrl(orderId), "Ver pedido")}`),
  },
  {
    label: "4. Boas-vindas (cadastro)",
    subject: "Bem-vindo à Wear Sublimações!",
    html: layout("Conta criada com sucesso!", `
        <p>Olá ${name},</p>
        <p>Sua conta na Wear Sublimações foi criada. Agora você pode montar seu Wind Banner personalizado e acompanhar seus pedidos por aqui.</p>
        ${button(APP_URL, "Criar meu Wind Banner")}`),
  },
  {
    label: "5. Pagamento recusado",
    subject: `Não conseguimos confirmar seu pagamento #${shortId(orderId)}`,
    html: layout("Pagamento não aprovado", `
        <p>Olá ${name},</p>
        <p>Infelizmente o pagamento do seu pedido #${shortId(orderId)} não foi aprovado.</p>
        <p>Você pode tentar novamente com outro cartão ou escolher PIX/boleto. Seus dados do pedido continuam salvos.</p>
        ${button(orderUrl(orderId), "Tentar novamente")}`),
  },
  {
    label: "6. Lembrete de pagamento (PIX/boleto vencendo)",
    subject: `Seu PIX está prestes a vencer #${shortId(orderId)}`,
    html: layout("Não perca o prazo!", `
        <p>Olá ${name},</p>
        <p>O pagamento via PIX do seu pedido #${shortId(orderId)} ainda não foi confirmado e vence em <strong>21/06 às 18h</strong>.</p>
        <p>Pague antes do prazo para garantir seu Wind Banner. Após o vencimento será necessário refazer o pedido.</p>
        ${button(orderUrl(orderId), "Pagar agora")}`),
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(`\n📧 Enviando ${emails.length} emails de teste para: ${TO}`);
console.log(`   Remetente: ${FROM_EMAIL}`);
console.log(`   Intervalo: ${DELAY_MS / 1000}s entre cada\n`);

let ok = 0;
for (let i = 0; i < emails.length; i++) {
  const e = emails[i];
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO,
      subject: e.subject,
      html: e.html,
    });
    if (error) {
      console.error(`   ❌ ${e.label} — ERRO: ${JSON.stringify(error)}`);
    } else {
      ok++;
      console.log(`   ✅ ${e.label} — enviado (id: ${data?.id})`);
    }
  } catch (err) {
    console.error(`   ❌ ${e.label} — EXCEÇÃO: ${err.message}`);
  }
  if (i < emails.length - 1) await sleep(DELAY_MS);
}

console.log(`\n✨ Concluído: ${ok}/${emails.length} enviados com sucesso.\n`);
