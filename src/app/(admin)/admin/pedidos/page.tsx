"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  matchesFilter,
  type StatusFilterValue,
} from "@/components/orders/OrderStatusFilter";

interface AdminOrderRow {
  id: string;
  status: string;
  paymentMethod: string;
  pagarmeStatus: string | null;
  totalCentavos: number;
  trackingCode: string | null;
  shippingService: string | null;
  createdAt: string;
  configJson: string;
  customerName: string | null;
  customerEmail: string | null;
}

const FILTERS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Aguardando pagamento" },
  { value: "processing", label: "Em producao" },
  { value: "shipped", label: "Enviados" },
  { value: "delivered", label: "Concluidos" },
];

const PAYMENT_LABELS: Record<string, string> = {
  pix: "PIX",
  boleto: "Boleto",
  credit_card: "Cartao",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilterValue>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => matchesFilter(o.status, filter))
      .filter((o) => {
        if (!q) return true;
        return (
          o.id.toLowerCase().includes(q) ||
          (o.customerName ?? "").toLowerCase().includes(q) ||
          (o.customerEmail ?? "").toLowerCase().includes(q) ||
          (o.trackingCode ?? "").toLowerCase().includes(q)
        );
      });
  }, [orders, filter, search]);

  const counts = useMemo(() => {
    const result: Record<StatusFilterValue, number> = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };
    for (const o of orders) {
      if (matchesFilter(o.status, "pending")) result.pending++;
      if (matchesFilter(o.status, "processing")) result.processing++;
      if (matchesFilter(o.status, "shipped")) result.shipped++;
      if (matchesFilter(o.status, "delivered")) result.delivered++;
    }
    return result;
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-end gap-4 justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Pedidos</h1>
          <p className="text-sm text-text-muted mt-1">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} no
            total
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, cliente ou rastreio..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="border-b border-border overflow-x-auto mb-4">
        <div className="flex items-center gap-1 min-w-max">
          {FILTERS.map((f) => {
            const isActive = f.value === filter;
            const count = counts[f.value];
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors inline-flex items-center gap-2 ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {f.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-primary-light" : "bg-gray-100"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-text-muted">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-text-muted text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Pedido</th>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium">Produto</th>
                  <th className="text-left px-4 py-3 font-medium">Pagamento</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  let cfg: { modelo?: string; tamanho?: string } = {};
                  try {
                    cfg = JSON.parse(o.configJson);
                  } catch {
                    // ignore
                  }
                  return (
                    <tr
                      key={o.id}
                      className="border-t border-border hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        #{o.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text truncate max-w-[180px]">
                          {o.customerName ?? "-"}
                        </p>
                        <p className="text-xs text-text-muted truncate max-w-[180px]">
                          {o.customerEmail ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-text">
                        {cfg.modelo ?? "-"}{" "}
                        {cfg.tamanho?.toUpperCase() ?? ""}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {PAYMENT_LABELS[o.paymentMethod] ?? o.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(o.totalCentavos)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/pedidos/${o.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium text-sm"
                        >
                          Editar
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((o) => {
              let cfg: { modelo?: string; tamanho?: string } = {};
              try {
                cfg = JSON.parse(o.configJson);
              } catch {
                // ignore
              }
              return (
                <Link
                  key={o.id}
                  href={`/admin/pedidos/${o.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-text-muted">
                        #{o.id.slice(0, 8)}
                      </p>
                      <p className="font-semibold text-text truncate">
                        {o.customerName ?? "-"}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {o.customerEmail ?? ""}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      {cfg.modelo} {cfg.tamanho?.toUpperCase()} ·{" "}
                      {PAYMENT_LABELS[o.paymentMethod] ?? o.paymentMethod}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(o.totalCentavos)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
