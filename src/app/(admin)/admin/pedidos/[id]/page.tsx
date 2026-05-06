"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User as UserIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge, STATUS_MAP } from "@/components/orders/OrderStatusBadge";
import type { OrderStatus } from "@/types";

interface AdminOrderDetail {
  order: {
    id: string;
    status: string;
    subtotalCentavos: number;
    descontoCentavos: number;
    freteCentavos: number;
    totalCentavos: number;
    paymentMethod: string;
    pagarmeStatus: string | null;
    pagarmeTransactionId: string | null;
    pixQrCode: string | null;
    boletoUrl: string | null;
    trackingCode: string | null;
    shippingService: string | null;
    shippingDeadline: string | null;
    adminNotes: string | null;
    configJson: string;
    createdAt: string;
    updatedAt: string;
  };
  customer: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    cpf: string | null;
  } | null;
  items: Array<{
    id: string;
    modelo: string;
    tamanho: string;
    base: string;
    quantidade: number;
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

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refused",
  "refunded",
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [trackingCode, setTrackingCode] = useState("");
  const [shippingService, setShippingService] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Pedido nao encontrado");
        return r.json();
      })
      .then((d: AdminOrderDetail) => {
        setData(d);
        setStatus((d.order.status as OrderStatus) ?? "pending");
        setTrackingCode(d.order.trackingCode ?? "");
        setShippingService(d.order.shippingService ?? "");
        setAdminNotes(d.order.adminNotes ?? "");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingCode: trackingCode || null,
          shippingService: shippingService || null,
          adminNotes: adminNotes || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar");

      setData((prev) => (prev ? { ...prev, order: { ...prev.order, ...json.order } } : prev));
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-text-muted mb-4">
          {error ?? "Pedido nao encontrado"}
        </p>
        <Link
          href="/admin/pedidos"
          className="text-primary hover:underline"
        >
          Voltar aos pedidos
        </Link>
      </div>
    );
  }

  const { order, customer, items, address } = data;
  let cfg: { modelo?: string; tamanho?: string; quantidade?: number } = {};
  try {
    cfg = JSON.parse(order.configJson);
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-4">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          <ChevronLeft size={16} /> Voltar aos pedidos
        </Link>
      </div>

      <div className="flex flex-wrap items-start gap-3 justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Pedido #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Realizado em{" "}
            {new Date(order.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda - dados do pedido */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
            <h2 className="font-semibold text-text mb-4">Itens</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-text">
                    Wind Banner {item.modelo} - {item.tamanho.toUpperCase()}
                  </p>
                  <p className="text-sm text-text-muted">
                    Base: {item.base} · Qtd: {item.quantidade}
                  </p>
                </div>
                <span className="font-semibold text-text whitespace-nowrap">
                  {formatCurrency(item.precoTotalCentavos)}
                </span>
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
                <span className="text-price-red">
                  {formatCurrency(order.totalCentavos)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
            <h2 className="font-semibold text-text mb-4">Pagamento</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-text-muted text-xs">Metodo</dt>
                <dd className="text-text font-medium uppercase">
                  {order.paymentMethod}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Status Pagar.me</dt>
                <dd className="text-text font-medium">
                  {order.pagarmeStatus ?? "-"}
                </dd>
              </div>
              {order.pagarmeTransactionId && (
                <div className="sm:col-span-2">
                  <dt className="text-text-muted text-xs">Transaction ID</dt>
                  <dd className="text-text font-mono text-xs break-all">
                    {order.pagarmeTransactionId}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <form
            onSubmit={handleSave}
            className="bg-white border border-border rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-text">Atualizar pedido</h2>
              {savedAt && Date.now() - savedAt < 5000 && (
                <span className="text-xs text-primary font-medium">
                  Salvo
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_MAP[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="shippingService"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  Servico de envio
                </label>
                <input
                  id="shippingService"
                  type="text"
                  value={shippingService}
                  onChange={(e) => setShippingService(e.target.value)}
                  placeholder="Ex: PAC, Sedex, Jadlog..."
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="trackingCode"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  Codigo de rastreio
                </label>
                <input
                  id="trackingCode"
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ex: BR123456789BR"
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="adminNotes"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Notas internas
                <span className="text-text-muted font-normal ml-1">
                  (nao visiveis ao cliente)
                </span>
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Anotacoes sobre o pedido..."
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Salvando..." : "Salvar alteracoes"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-text mb-3">Cliente</h3>
            {customer ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <UserIcon size={14} className="mt-0.5 text-text-muted shrink-0" />
                  <span className="text-text">{customer.name ?? "-"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 text-text-muted shrink-0" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {customer.email}
                  </a>
                </div>
                {customer.phone && (
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 text-text-muted shrink-0" />
                    <a
                      href={`https://wa.me/55${customer.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.cpf && (
                  <p className="text-xs text-text-muted pl-6">
                    CPF: {customer.cpf}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Cliente nao encontrado</p>
            )}
          </section>

          {address && (
            <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-text flex items-center gap-2 mb-3">
                <MapPin size={16} />
                Entrega
              </h3>
              <p className="text-sm text-text">
                {address.logradouro}, {address.numero}
                {address.complemento ? ` - ${address.complemento}` : ""}
              </p>
              <p className="text-sm text-text-muted">
                {address.bairro}, {address.cidade}/{address.estado}
              </p>
              <p className="text-sm text-text-muted">CEP {address.cep}</p>
            </section>
          )}

          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6 text-sm">
            <h3 className="font-semibold text-text mb-3">Configuracao</h3>
            <p className="text-text-muted">
              Modelo: <span className="text-text">{cfg.modelo ?? "-"}</span>
            </p>
            <p className="text-text-muted">
              Tamanho:{" "}
              <span className="text-text">
                {cfg.tamanho?.toUpperCase() ?? "-"}
              </span>
            </p>
            <p className="text-text-muted">
              Quantidade:{" "}
              <span className="text-text">{cfg.quantidade ?? "-"}</span>
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
