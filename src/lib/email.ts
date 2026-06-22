import { Resend } from "resend";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY nao configurada");
  return new Resend(apiKey);
}

const FROM_EMAIL = "Wear Sublimações <nao-responda@send.wearsublimacoes.com.br>";
// Links apontam para paginas DESTE app (a LP /pedido/[id], etc.), nao para o ecommerce.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://wb.wearsublimacoes.com.br";

function orderUrl(orderId: string): string {
  return `${APP_URL}/pedido/${orderId}`;
}

function shortId(orderId: string): string {
  return orderId.slice(0, 8);
}

// ─── Building blocks ───

function layout(heading: string, bodyHtml: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #1B1B1B; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Wear Sublimações</h1>
      </div>
      <div style="padding: 30px 20px;">
        <h2 style="color: #2ECC40;">${heading}</h2>
        ${bodyHtml}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Dúvidas? Entre em contato pelo WhatsApp: (18) 99781-0521
        </p>
      </div>
    </div>
  `;
}

function card(innerHtml: string): string {
  return `<div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">${innerHtml}</div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#2ECC40;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:8px;margin:8px 0;">${label}</a>`;
}

function paymentLabel(method: string): string {
  return method === "credit_card"
    ? "Cartão de Crédito"
    : method === "pix"
    ? "PIX"
    : "Boleto";
}

// ─── Confirmacao de pedido ───

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: string;
  total: string;
  paymentMethod: string;
  shippingService: string;
  shippingDeadline: string;
}

export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Pedido recebido #${shortId(data.orderId)}`,
    html: layout(
      "Pedido confirmado!",
      `
        <p>Olá ${data.customerName},</p>
        <p>Recebemos seu pedido e estamos preparando tudo para você.</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Pedido:</strong> #${shortId(data.orderId)}</p>
          <p style="margin: 4px 0;"><strong>Produto:</strong> ${data.items}</p>
          <p style="margin: 4px 0;"><strong>Total:</strong> ${data.total}</p>
          <p style="margin: 4px 0;"><strong>Pagamento:</strong> ${paymentLabel(data.paymentMethod)}</p>
          <p style="margin: 4px 0;"><strong>Envio:</strong> ${data.shippingService} (${data.shippingDeadline})</p>
        `)}
        <p>Você pode acompanhar o status do seu pedido a qualquer momento.</p>
        ${button(orderUrl(data.orderId), "Acompanhar pedido")}
      `
    ),
  });
}

// ─── Pedido enviado ───

interface ShippingEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  trackingCode: string;
  shippingService: string;
}

export async function sendShippingNotification(data: ShippingEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Seu pedido foi enviado! #${shortId(data.orderId)}`,
    html: layout(
      "Pedido enviado!",
      `
        <p>Olá ${data.customerName},</p>
        <p>Seu pedido #${shortId(data.orderId)} foi despachado!</p>
        ${card(`
          <p style="margin: 4px 0;"><strong>Transportadora:</strong> ${data.shippingService}</p>
          <p style="margin: 4px 0;"><strong>Código de rastreamento:</strong> ${data.trackingCode}</p>
        `)}
        ${button(orderUrl(data.orderId), "Acompanhar pedido")}
      `
    ),
  });
}

// ─── Pedido entregue ───

interface DeliveryEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
}

export async function sendDeliveryConfirmation(data: DeliveryEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Seu pedido foi entregue! #${shortId(data.orderId)}`,
    html: layout(
      "Pedido entregue!",
      `
        <p>Olá ${data.customerName},</p>
        <p>Seu pedido #${shortId(data.orderId)} foi entregue. Esperamos que você ame o resultado!</p>
        <p>Se algo não saiu como esperado, fale com a gente pelo WhatsApp que resolvemos rapidinho.</p>
        ${button(orderUrl(data.orderId), "Ver pedido")}
      `
    ),
  });
}

// ─── Boas-vindas ───

interface WelcomeEmailData {
  customerName: string;
  customerEmail: string;
}

export async function sendWelcome(data: WelcomeEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: "Bem-vindo à Wear Sublimações!",
    html: layout(
      "Conta criada com sucesso!",
      `
        <p>Olá ${data.customerName},</p>
        <p>Sua conta na Wear Sublimações foi criada. Agora você pode montar seu Wind Banner personalizado e acompanhar seus pedidos por aqui.</p>
        ${button(APP_URL, "Criar meu Wind Banner")}
      `
    ),
  });
}

// ─── Pagamento recusado ───

interface PaymentFailedEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
}

export async function sendPaymentFailed(data: PaymentFailedEmailData): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Não conseguimos confirmar seu pagamento #${shortId(data.orderId)}`,
    html: layout(
      "Pagamento não aprovado",
      `
        <p>Olá ${data.customerName},</p>
        <p>Infelizmente o pagamento do seu pedido #${shortId(data.orderId)} não foi aprovado.</p>
        <p>Você pode tentar novamente com outro cartão ou escolher PIX/boleto. Seus dados do pedido continuam salvos.</p>
        ${button(orderUrl(data.orderId), "Tentar novamente")}
      `
    ),
  });
}

// ─── Lembrete de pagamento (PIX/boleto vencendo) ───

interface PaymentReminderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  paymentMethod: string;
  expiresAtLabel: string;
}

export async function sendPaymentReminder(data: PaymentReminderEmailData): Promise<void> {
  const resend = getResend();

  const method = paymentLabel(data.paymentMethod);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Seu ${method} está prestes a vencer #${shortId(data.orderId)}`,
    html: layout(
      "Não perca o prazo!",
      `
        <p>Olá ${data.customerName},</p>
        <p>O pagamento via ${method} do seu pedido #${shortId(data.orderId)} ainda não foi confirmado e vence em <strong>${data.expiresAtLabel}</strong>.</p>
        <p>Pague antes do prazo para garantir seu Wind Banner. Após o vencimento será necessário refazer o pedido.</p>
        ${button(orderUrl(data.orderId), "Pagar agora")}
      `
    ),
  });
}
