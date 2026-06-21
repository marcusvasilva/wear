// Gera um preview visual de todos os emails transacionais.
// Reproduz EXATAMENTE os mesmos blocos de src/lib/email.ts com dados de exemplo.
// Uso: node .email-previews/generate.mjs  ->  abre .email-previews/index.html

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const APP_URL = "https://wb.wearsublimacoes.com.br";
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

// ─── Dados de exemplo ───
const orderId = "a1b2c3d4-5678-90ef-ghij-klmnopqrstuv";
const name = "Maria Silva";

const emails = [
  {
    title: "1. Confirmacao de pedido",
    subject: `Pedido recebido #${shortId(orderId)}`,
    html: layout("Pedido confirmado!", `
        <p>Olá ${name},</p>
        <p>Recebemos seu pedido e estamos preparando tudo para você.</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Pedido:</strong> #${shortId(orderId)}</p>
          <p style="margin: 4px 0;"><strong>Produto:</strong> Wind Banner Pena 2,8m - Tecido Premium</p>
          <p style="margin: 4px 0;"><strong>Total:</strong> R$ 489,90</p>
          <p style="margin: 4px 0;"><strong>Pagamento:</strong> ${paymentLabel("pix")}</p>
          <p style="margin: 4px 0;"><strong>Envio:</strong> Sedex (3 a 5 dias uteis)</p>
        `)}
        <p>Você pode acompanhar o status do seu pedido a qualquer momento.</p>
        ${button(orderUrl(orderId), "Acompanhar pedido")}`),
  },
  {
    title: "2. Pedido enviado",
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
    title: "3. Pedido entregue",
    subject: `Seu pedido foi entregue! #${shortId(orderId)}`,
    html: layout("Pedido entregue!", `
        <p>Olá ${name},</p>
        <p>Seu pedido #${shortId(orderId)} foi entregue. Esperamos que você ame o resultado!</p>
        <p>Se algo não saiu como esperado, fale com a gente pelo WhatsApp que resolvemos rapidinho.</p>
        ${button(orderUrl(orderId), "Ver pedido")}`),
  },
  {
    title: "4. Boas-vindas (cadastro)",
    subject: "Bem-vindo à Wear Sublimações!",
    html: layout("Conta criada com sucesso!", `
        <p>Olá ${name},</p>
        <p>Sua conta na Wear Sublimações foi criada. Agora você pode montar seu Wind Banner personalizado e acompanhar seus pedidos por aqui.</p>
        ${button(APP_URL, "Criar meu Wind Banner")}`),
  },
  {
    title: "5. Pagamento recusado",
    subject: `Não conseguimos confirmar seu pagamento #${shortId(orderId)}`,
    html: layout("Pagamento não aprovado", `
        <p>Olá ${name},</p>
        <p>Infelizmente o pagamento do seu pedido #${shortId(orderId)} não foi aprovado.</p>
        <p>Você pode tentar novamente com outro cartão ou escolher PIX/boleto. Seus dados do pedido continuam salvos.</p>
        ${button(orderUrl(orderId), "Tentar novamente")}`),
  },
  {
    title: "6. Lembrete de pagamento (PIX/boleto vencendo)",
    subject: `Seu PIX está prestes a vencer #${shortId(orderId)}`,
    html: layout("Não perca o prazo!", `
        <p>Olá ${name},</p>
        <p>O pagamento via PIX do seu pedido #${shortId(orderId)} ainda não foi confirmado e vence em <strong>21/06 às 18h</strong>.</p>
        <p>Pague antes do prazo para garantir seu Wind Banner. Após o vencimento será necessário refazer o pedido.</p>
        ${button(orderUrl(orderId), "Pagar agora")}`),
  },
];

const page = `<!doctype html>
<html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preview - Emails transacionais Wear</title>
<style>
  body { margin:0; background:#ececec; font-family:'Inter',Arial,sans-serif; }
  .page-head { background:#2ECC40; color:#fff; padding:20px; text-align:center; }
  .page-head h1 { margin:0; font-size:18px; }
  .grid { max-width:1300px; margin:0 auto; padding:24px; display:grid; grid-template-columns:repeat(auto-fill,minmax(420px,1fr)); gap:24px; }
  .item { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
  .item-head { padding:14px 16px; border-bottom:1px solid #eee; }
  .item-head .t { font-weight:700; font-size:15px; color:#1B1B1B; }
  .item-head .s { font-size:12px; color:#888; margin-top:4px; }
  .item-head .s b { color:#444; font-weight:600; }
  .render { padding:16px; background:#fff; }
</style></head>
<body>
  <div class="page-head"><h1>Preview dos emails transacionais - Wear Sublimacoes (dados de exemplo)</h1></div>
  <div class="grid">
    ${emails.map((e) => `
      <div class="item">
        <div class="item-head">
          <div class="t">${e.title}</div>
          <div class="s">Assunto: <b>${e.subject}</b></div>
        </div>
        <div class="render">${e.html}</div>
      </div>`).join("")}
  </div>
</body></html>`;

const out = join(__dirname, "index.html");
writeFileSync(out, page, "utf8");
console.log("Preview gerado em:", out);
