"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Package, Loader2, ShoppingBag } from "lucide-react";

interface OrderSummary {
  id: string;
  status: string;
  totalCentavos: number;
  paymentMethod: string;
  createdAt: string;
  configJson: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  processing: "Em producao",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refused: "Recusado",
  refunded: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  paid: "bg-blue-50 text-blue-700",
  processing: "bg-primary-light text-primary",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  refused: "bg-red-50 text-red-700",
  refunded: "bg-gray-50 text-gray-700",
};

export default function MeusPedidosPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
          <ShoppingBag size={24} />
          Meus Pedidos
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <Package size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-muted mb-4">Voce ainda nao fez nenhum pedido.</p>
            <Link
              href="/#configurador"
              className="inline-block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Configurar Wind Banner
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              let config: { modelo?: string; tamanho?: string } = {};
              try {
                config = JSON.parse(order.configJson);
              } catch {}

              return (
                <Link
                  key={order.id}
                  href={`/pedido/${order.id}`}
                  className="block bg-white border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-text">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-text-muted mt-1">
                        Wind Banner {config.modelo ?? ""} {config.tamanho?.toUpperCase() ?? ""}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-text">
                        {formatCurrency(order.totalCentavos)}
                      </span>
                      <span
                        className={`block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-text-muted hover:underline">
            Voltar a loja
          </Link>
        </div>
      </div>
    </main>
  );
}
