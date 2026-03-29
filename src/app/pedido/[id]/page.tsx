"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface OrderData {
  order: {
    id: string;
    status: string;
    subtotalCentavos: number;
    descontoCentavos: number;
    freteCentavos: number;
    totalCentavos: number;
    paymentMethod: string;
    pagarmeStatus: string | null;
    trackingCode: string | null;
    shippingService: string | null;
    shippingDeadline: string | null;
    createdAt: string;
  };
  items: Array<{
    modelo: string;
    tamanho: string;
    base: string;
    quantidade: number;
    precoUnitarioCentavos: number;
    precoTotalCentavos: number;
  }>;
  address: {
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  } | null;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Aguardando pagamento", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  paid: { label: "Pago", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 },
  processing: { label: "Em producao", color: "text-primary bg-primary-light", icon: Package },
  shipped: { label: "Enviado", color: "text-purple-600 bg-purple-50", icon: Truck },
  delivered: { label: "Entregue", color: "text-green-700 bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "text-red-600 bg-red-50", icon: XCircle },
  refused: { label: "Recusado", color: "text-red-600 bg-red-50", icon: XCircle },
  refunded: { label: "Reembolsado", color: "text-gray-600 bg-gray-50", icon: XCircle },
};

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Pedido nao encontrado");
        return r.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">{error ?? "Pedido nao encontrado"}</p>
          <Link href="/" className="text-primary hover:underline">Voltar a loja</Link>
        </div>
      </main>
    );
  }

  const { order, items, address } = data;
  const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const StatusIcon = status.icon;

  const paymentLabel =
    order.paymentMethod === "credit_card"
      ? "Cartao de Credito"
      : order.paymentMethod === "pix"
      ? "PIX"
      : "Boleto";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Pedido #{order.id.slice(0, 8)}</h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon size={16} />
            {status.label}
          </span>
        </div>

        <div className="space-y-6">
          {/* Itens */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-text flex items-center gap-2 mb-4">
              <Package size={18} />
              Itens do Pedido
            </h2>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-text">
                    Wind Banner {item.modelo} - {item.tamanho.toUpperCase()}
                  </p>
                  <p className="text-sm text-text-muted">
                    Base: {item.base} | Qtd: {item.quantidade}
                  </p>
                </div>
                <span className="font-semibold text-text">{formatCurrency(item.precoTotalCentavos)}</span>
              </div>
            ))}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatCurrency(order.subtotalCentavos)}</span>
              </div>
              {order.descontoCentavos > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Desconto</span>
                  <span>-{formatCurrency(order.descontoCentavos)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Frete</span>
                <span>{formatCurrency(order.freteCentavos)}</span>
              </div>
              <hr className="border-border my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-price-red">{formatCurrency(order.totalCentavos)}</span>
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-text flex items-center gap-2 mb-3">
              <CreditCard size={18} />
              Pagamento
            </h2>
            <p className="text-sm text-text">{paymentLabel}</p>
            {order.pagarmeStatus && (
              <p className="text-sm text-text-muted mt-1">Status: {order.pagarmeStatus}</p>
            )}
          </section>

          {/* Envio */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-text flex items-center gap-2 mb-3">
              <Truck size={18} />
              Envio
            </h2>
            {order.shippingService && (
              <p className="text-sm text-text">{order.shippingService}</p>
            )}
            {order.shippingDeadline && (
              <p className="text-sm text-text-muted">Prazo: {order.shippingDeadline}</p>
            )}
            {order.trackingCode && (
              <p className="text-sm mt-2">
                <span className="text-text-muted">Rastreamento: </span>
                <span className="font-mono font-medium text-primary">{order.trackingCode}</span>
              </p>
            )}
          </section>

          {/* Endereco */}
          {address && (
            <section className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-text flex items-center gap-2 mb-3">
                <MapPin size={18} />
                Endereco de Entrega
              </h2>
              <p className="text-sm text-text">
                {address.logradouro}, {address.numero}
                {address.complemento ? ` - ${address.complemento}` : ""}
              </p>
              <p className="text-sm text-text-muted">
                {address.bairro}, {address.cidade}/{address.estado} - CEP {address.cep}
              </p>
            </section>
          )}

          <div className="flex gap-4 justify-center">
            <Link href="/meus-pedidos" className="text-sm text-primary hover:underline">
              Ver todos os pedidos
            </Link>
            <Link href="/" className="text-sm text-text-muted hover:underline">
              Voltar a loja
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
