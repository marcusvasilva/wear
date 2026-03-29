import type { BaseId, TamanhoId, ShippingOption } from "@/types";

const MELHOR_ENVIO_BASE_URL = "https://melhorenvio.com.br/api/v2";
const ORIGIN_CEP = "16204281"; // Birigui-SP

interface PackageDimensions {
  weight: number; // kg
  width: number; // cm
  height: number; // cm
  length: number; // cm
}

// Dimensoes base por tipo de base e tamanho
const DIMENSIONS_MAP: Record<BaseId, Record<TamanhoId, PackageDimensions>> = {
  "sem-base": {
    p: { weight: 0.25, width: 25, height: 5, length: 20 },
    m: { weight: 0.3, width: 30, height: 5, length: 20 },
    g: { weight: 0.4, width: 30, height: 6, length: 25 },
    gg: { weight: 0.5, width: 35, height: 8, length: 25 },
  },
  "haste-tecido": {
    p: { weight: 1.0, width: 15, height: 15, length: 100 },
    m: { weight: 1.3, width: 15, height: 15, length: 110 },
    g: { weight: 1.6, width: 15, height: 15, length: 120 },
    gg: { weight: 2.0, width: 15, height: 15, length: 130 },
  },
  "base-haste-tecido": {
    p: { weight: 3.0, width: 25, height: 25, length: 100 },
    m: { weight: 3.5, width: 25, height: 25, length: 110 },
    g: { weight: 4.0, width: 25, height: 25, length: 120 },
    gg: { weight: 5.0, width: 25, height: 25, length: 130 },
  },
};

/**
 * Calcula dimensoes do pacote com base no tipo de base, tamanho e quantidade.
 * Peso multiplica pela quantidade; altura cresce proporcionalmente.
 */
export function getPackageDimensions(
  base: BaseId,
  tamanho: TamanhoId,
  quantidade: number,
): PackageDimensions {
  const baseDims = DIMENSIONS_MAP[base][tamanho];
  return {
    weight: Number((baseDims.weight * quantidade).toFixed(2)),
    width: baseDims.width,
    height: Math.ceil(baseDims.height * quantidade),
    length: baseDims.length,
  };
}

function getHeaders(): HeadersInit {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  if (!token) {
    throw new Error("MELHOR_ENVIO_TOKEN nao configurado");
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "WearLP (contato.wear.artefatos@gmail.com)",
  };
}

interface MelhorEnvioShipmentOption {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  discount?: string;
  currency?: string;
  delivery_time?: number;
  delivery_range?: { min: number; max: number };
  company?: { id: number; name: string; picture?: string };
  error?: string;
}

/**
 * Calcula frete via Melhor Envio API.
 * Retorna array de opcoes de envio validas (sem erros).
 */
export async function calcularFrete(
  cepDestino: string,
  base: BaseId,
  tamanho: TamanhoId,
  quantidade: number,
): Promise<ShippingOption[]> {
  const dims = getPackageDimensions(base, tamanho, quantidade);

  const body = {
    from: { postal_code: ORIGIN_CEP },
    to: { postal_code: cepDestino },
    products: [
      {
        id: "windbanner",
        width: dims.width,
        height: dims.height,
        length: dims.length,
        weight: dims.weight,
        quantity: 1,
      },
    ],
  };

  const response = await fetch(`${MELHOR_ENVIO_BASE_URL}/me/shipment/calculate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Melhor Envio API error (${response.status}): ${errorText}`);
  }

  const data: MelhorEnvioShipmentOption[] = await response.json();

  return data
    .filter((option) => !option.error && option.price)
    .map((option) => {
      const priceFloat = parseFloat(option.custom_price || option.price || "0");
      const deliveryMin = option.delivery_range?.min ?? option.delivery_time ?? 0;
      const deliveryMax = option.delivery_range?.max ?? option.delivery_time ?? 0;

      const deliveryEstimate =
        deliveryMin === deliveryMax
          ? `${deliveryMin} dias uteis`
          : `${deliveryMin} a ${deliveryMax} dias uteis`;

      return {
        id: option.id,
        name: option.name,
        company: option.company?.name ?? "Transportadora",
        price: Math.round(priceFloat * 100), // converte reais para centavos
        deliveryDays: deliveryMax,
        deliveryEstimate,
      };
    })
    .sort((a, b) => a.price - b.price);
}

/**
 * Adiciona itens ao carrinho do Melhor Envio (criar etiqueta).
 * Usado no fluxo pos-pagamento.
 */
export async function criarEtiqueta(data: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${MELHOR_ENVIO_BASE_URL}/me/cart`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao criar etiqueta (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Paga etiquetas no Melhor Envio.
 */
export async function pagarEtiqueta(orderIds: string[]): Promise<unknown> {
  const response = await fetch(`${MELHOR_ENVIO_BASE_URL}/me/shipment/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ orders: orderIds }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao pagar etiqueta (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Gera etiquetas para impressao no Melhor Envio.
 */
export async function gerarEtiqueta(orderIds: string[]): Promise<unknown> {
  const response = await fetch(`${MELHOR_ENVIO_BASE_URL}/me/shipment/generate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ orders: orderIds }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao gerar etiqueta (${response.status}): ${errorText}`);
  }

  return response.json();
}
