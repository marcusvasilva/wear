"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { OrderCard, type OrderCardData } from "@/components/orders/OrderCard";
import {
  OrderStatusFilter,
  matchesFilter,
  readFilter,
} from "@/components/orders/OrderStatusFilter";

function MeusPedidosContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const filter = readFilter(searchParams.get("status"));

  const [orders, setOrders] = useState<OrderCardData[]>([]);
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

  const filtered = useMemo(
    () => orders.filter((o) => matchesFilter(o.status, filter)),
    [orders, filter]
  );

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="mb-4">
        <Breadcrumb items={[{ label: "Meus Pedidos" }]} />
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text flex items-center gap-2">
          <ShoppingBag size={26} />
          {firstName ? `Ola, ${firstName}` : "Meus Pedidos"}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Acompanhe e gerencie seus pedidos abaixo.
        </p>
      </div>

      <div className="mb-6">
        <OrderStatusFilter active={filter} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted mb-4">
            Voce ainda nao fez nenhum pedido.
          </p>
          <Link
            href="/#configurador"
            className="inline-block bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Configurar Wind Banner
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted mb-4">
            Nenhum pedido encontrado neste filtro.
          </p>
          <Link
            href="/meus-pedidos"
            className="inline-block text-primary font-medium hover:underline"
          >
            Ver todos os pedidos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MeusPedidosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      }
    >
      <MeusPedidosContent />
    </Suspense>
  );
}
