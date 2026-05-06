import Link from "next/link";
import { Package, ChevronRight, CreditCard, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrderCardData {
  id: string;
  status: string;
  totalCentavos: number;
  paymentMethod: string;
  createdAt: string;
  configJson: string;
  trackingCode?: string | null;
}

interface OrderCardProps {
  order: OrderCardData;
}

export function OrderCard({ order }: OrderCardProps) {
  let config: { modelo?: string; tamanho?: string; quantidade?: number } = {};
  try {
    config = JSON.parse(order.configJson);
  } catch {
    // ignore parse errors
  }

  const isPending = order.status === "pending";
  const isShipped = order.status === "shipped";
  const showPayCta =
    isPending &&
    (order.paymentMethod === "pix" || order.paymentMethod === "boleto");
  const showTrackCta = isShipped && order.trackingCode;

  return (
    <Link
      href={`/pedido/${order.id}`}
      className="block bg-white border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="hidden sm:flex w-14 h-14 rounded-xl bg-primary-light items-center justify-center shrink-0">
          <Package className="w-7 h-7 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-text">
              Pedido #{order.id.slice(0, 8)}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-text-muted">
            Wind Banner {config.modelo ?? ""}{" "}
            {config.tamanho?.toUpperCase() ?? ""}
            {config.quantidade ? ` · ${config.quantidade}x` : ""}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Realizado em{" "}
            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-1 sm:text-right">
          <span className="text-lg font-bold text-text">
            {formatCurrency(order.totalCentavos)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {showPayCta ? (
              <>
                <CreditCard size={14} /> Pagar agora
              </>
            ) : showTrackCta ? (
              <>
                <Truck size={14} /> Rastrear
              </>
            ) : (
              <>
                Ver detalhes
                <ChevronRight size={14} />
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
