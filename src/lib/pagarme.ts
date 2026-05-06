const PAGARME_BASE_URL = "https://api.pagar.me/1";

interface PagarmeCustomer {
  external_id: string;
  name: string;
  email: string;
  type: "individual";
  country: "br";
  documents: Array<{ type: "cpf"; number: string }>;
  phone_numbers: string[];
}

interface PagarmeBilling {
  name: string;
  address: {
    street: string;
    street_number: string;
    complementary?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    country: "br";
  };
}

interface PagarmeShipping {
  name: string;
  fee: number;
  address: PagarmeBilling["address"];
}

interface CreateTransactionParams {
  amount: number; // centavos
  paymentMethod: "credit_card" | "pix" | "boleto";
  customer: PagarmeCustomer;
  billing: PagarmeBilling;
  shipping: PagarmeShipping;
  items: Array<{
    id: string;
    title: string;
    unit_price: number;
    quantity: number;
    tangible: boolean;
  }>;
  cardHash?: string;
  installments?: number;
  orderId?: string;
  postbackUrl?: string;
  softDescriptor?: string;
}

interface PagarmeTransaction {
  id: number;
  status: string;
  amount: number;
  payment_method: string;
  boleto_url?: string;
  boleto_barcode?: string;
  boleto_expiration_date?: string;
  pix_qr_code?: string;
  pix_expiration_date?: string;
  refuse_reason?: string;
  card?: {
    brand: string;
    last_digits: string;
  };
}

function getApiKey(): string {
  const key = process.env.PAGARME_API_KEY;
  if (!key) throw new Error("PAGARME_API_KEY nao configurada");
  return key;
}

export async function createTransaction(
  params: CreateTransactionParams
): Promise<PagarmeTransaction> {
  const body: Record<string, unknown> = {
    api_key: getApiKey(),
    amount: params.amount,
    payment_method: params.paymentMethod,
    postback_url: params.postbackUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pagarme`,
    soft_descriptor: params.softDescriptor ?? "WEAR",
    customer: params.customer,
    billing: params.billing,
    shipping: params.shipping,
    items: params.items,
  };

  if (params.orderId) {
    body.metadata = { order_id: params.orderId };
  }

  if (params.paymentMethod === "credit_card") {
    if (!params.cardHash) {
      throw new Error("card_hash obrigatorio para cartao de credito");
    }
    body.card_hash = params.cardHash;
    body.installments = params.installments ?? 1;
    body.capture = true;
  }

  if (params.paymentMethod === "boleto") {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    body.boleto_expiration_date = dueDate.toISOString().split("T")[0];
    body.boleto_instructions = "Pagar ate o vencimento. Apos o vencimento, favor entrar em contato.";
  }

  const response = await fetch(`${PAGARME_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[pagarme] transaction failed", {
      status: response.status,
      response: data,
      requestSummary: {
        amount: params.amount,
        payment_method: params.paymentMethod,
        installments: body.installments,
        customer_doc: params.customer.documents[0]?.number?.slice(0, 3) + "***",
        billing_zipcode: params.billing.address.zipcode,
        items_count: params.items.length,
        has_card_hash: Boolean(body.card_hash),
      },
    });
    const errorMsg =
      data?.errors?.map((e: { message: string; parameter_name?: string }) =>
        e.parameter_name ? `${e.parameter_name}: ${e.message}` : e.message
      ).join(" | ") ?? JSON.stringify(data);
    throw new Error(`Pagar.me error (${response.status}): ${errorMsg}`);
  }

  return data as PagarmeTransaction;
}

export async function getTransaction(transactionId: number): Promise<PagarmeTransaction> {
  const response = await fetch(
    `${PAGARME_BASE_URL}/transactions/${transactionId}?api_key=${getApiKey()}`
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar transacao ${transactionId}`);
  }

  return response.json() as Promise<PagarmeTransaction>;
}

/**
 * Valida a assinatura do postback do Pagar.me v4.
 * O Pagar.me envia X-Hub-Signature com HMAC-SHA1 do body usando api_key.
 */
export function validatePostbackSignature(
  body: string,
  signature: string
): boolean {
  // Pagar.me v4 postback validation uses the raw body + api_key
  // The signature format is: sha1=HASH
  const crypto = require("crypto");
  const expectedSignature =
    "sha1=" +
    crypto
      .createHmac("sha1", getApiKey())
      .update(body)
      .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
