import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus } from "@/types";

export interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const STATUS_MAP: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Aguardando pagamento",
    color: "text-yellow-700 bg-yellow-50",
    icon: Clock,
  },
  paid: { label: "Pago", color: "text-blue-700 bg-blue-50", icon: CheckCircle2 },
  processing: {
    label: "Em producao",
    color: "text-primary bg-primary-light",
    icon: Package,
  },
  shipped: {
    label: "Enviado",
    color: "text-purple-700 bg-purple-50",
    icon: Truck,
  },
  delivered: {
    label: "Entregue",
    color: "text-green-700 bg-green-50",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-700 bg-red-50",
    icon: XCircle,
  },
  refused: { label: "Recusado", color: "text-red-700 bg-red-50", icon: XCircle },
  refunded: {
    label: "Reembolsado",
    color: "text-gray-700 bg-gray-100",
    icon: XCircle,
  },
};

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const config = STATUS_MAP[status as OrderStatus] ?? STATUS_MAP.pending;
  const Icon = config.icon;

  const sizeClass =
    size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClass}`}
    >
      <Icon size={size === "md" ? 14 : 12} />
      {config.label}
    </span>
  );
}
