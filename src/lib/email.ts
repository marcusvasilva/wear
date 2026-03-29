import { Resend } from "resend";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY nao configurada");
  return new Resend(apiKey);
}

const FROM_EMAIL = "Wear Sublimacoes <onboarding@resend.dev>"; // TODO: trocar para dominio verificado

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

  const paymentLabel =
    data.paymentMethod === "credit_card"
      ? "Cartao de Credito"
      : data.paymentMethod === "pix"
      ? "PIX"
      : "Boleto";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Pedido recebido #${data.orderId.slice(0, 8)}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #1B1B1B; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">Wear Sublimacoes</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #2ECC40;">Pedido confirmado!</h2>
          <p>Ola ${data.customerName},</p>
          <p>Recebemos seu pedido e estamos preparando tudo para voce.</p>

          <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Pedido:</strong> #${data.orderId.slice(0, 8)}</p>
            <p style="margin: 4px 0;"><strong>Produto:</strong> ${data.items}</p>
            <p style="margin: 4px 0;"><strong>Total:</strong> ${data.total}</p>
            <p style="margin: 4px 0;"><strong>Pagamento:</strong> ${paymentLabel}</p>
            <p style="margin: 4px 0;"><strong>Envio:</strong> ${data.shippingService} (${data.shippingDeadline})</p>
          </div>

          <p>Voce pode acompanhar o status do seu pedido a qualquer momento.</p>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Duvidas? Entre em contato pelo WhatsApp: (18) 99807-4936
          </p>
        </div>
      </div>
    `,
  });
}

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
    subject: `Seu pedido foi enviado! #${data.orderId.slice(0, 8)}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #1B1B1B; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">Wear Sublimacoes</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #2ECC40;">Pedido enviado!</h2>
          <p>Ola ${data.customerName},</p>
          <p>Seu pedido #${data.orderId.slice(0, 8)} foi despachado!</p>

          <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Transportadora:</strong> ${data.shippingService}</p>
            <p style="margin: 4px 0;"><strong>Codigo de rastreamento:</strong> ${data.trackingCode}</p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Duvidas? Entre em contato pelo WhatsApp: (18) 99807-4936
          </p>
        </div>
      </div>
    `,
  });
}
