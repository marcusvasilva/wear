"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Package,
  CreditCard,
  MapPin,
  Truck,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

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
    pixQrCode: string | null;
    pixExpirationDate: string | null;
    boletoUrl: string | null;
    boletoBarcode: string | null;
    boletoExpirationDate: string | null;
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

const STATUS_MESSAGES: Record<string, string> = {
  pending:
    "Estamos aguardando a confirmacao do seu pagamento. Voce recebera um e-mail assim que for aprovado.",
  paid:
    "Pagamento confirmado. Em breve seu pedido entra em producao.",
  processing:
    "Seu pedido esta sendo produzido com cuidado pela nossa equipe.",
  shipped:
    "Seu pedido ja foi enviado. Use o codigo de rastreio para acompanhar.",
  delivered: "Pedido entregue. Esperamos que voce tenha amado!",
  cancelled: "Este pedido foi cancelado.",
  refused:
    "O pagamento foi recusado. Voce pode tentar novamente ou usar outro metodo.",
  refunded: "O valor foi reembolsado para o seu metodo de pagamento.",
};

function formatCountdown(target: Date, now: number): string {
  const diff = target.getTime() - now;
  if (diff <= 0) return "Expirado";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Pedido nao encontrado");
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const isPending = data?.order.status === "pending";
    const isAwaitingMethod =
      data?.order.paymentMethod === "pix" ||
      data?.order.paymentMethod === "boleto";
    if (!isPending || !isAwaitingMethod) return;

    const tick = setInterval(() => {
      setNow(Date.now());
      fetch(`/api/orders/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d) setData(d);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(tick);
  }, [id, data?.order.status, data?.order.paymentMethod]);

  const copyToClipboard = async (text: string, target: "pix" | "boleto") => {
    try {
      await navigator.clipboard.writeText(text);
      if (target === "pix") {
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 2500);
      } else {
        setCopiedBoleto(true);
        setTimeout(() => setCopiedBoleto(false), 2500);
      }
    } catch {
      // ignore
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
        <Link href="/meus-pedidos" className="text-primary hover:underline">
          Ver meus pedidos
        </Link>
      </div>
    );
  }

  const { order, items, address } = data;
  const shortId = order.id.slice(0, 8);

  const paymentLabel =
    order.paymentMethod === "credit_card"
      ? "Cartao de Credito"
      : order.paymentMethod === "pix"
        ? "PIX"
        : "Boleto";

  const statusMessage = STATUS_MESSAGES[order.status] ?? STATUS_MESSAGES.pending;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Meus Pedidos", href: "/meus-pedidos" },
            { label: `Pedido #${shortId}` },
          ]}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Pedido #{shortId}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Realizado em{" "}
            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      <div className="mb-6">
        <OrderTimeline status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens */}
          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
            <h2 className="font-semibold text-text flex items-center gap-2 mb-4">
              <Package size={18} />
              Itens do Pedido
            </h2>
            {items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-text">
                    Wind Banner {item.modelo} - {item.tamanho.toUpperCase()}
                  </p>
                  <p className="text-sm text-text-muted">
                    Base: {item.base} | Qtd: {item.quantidade}
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

          {/* Pagamento */}
          <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
            <h2 className="font-semibold text-text flex items-center gap-2 mb-3">
              <CreditCard size={18} />
              Pagamento
            </h2>
            <p className="text-sm text-text">{paymentLabel}</p>
            {order.pagarmeStatus && (
              <p className="text-sm text-text-muted mt-1">
                Status: {order.pagarmeStatus}
              </p>
            )}

            {/* PIX QR Code */}
            {order.paymentMethod === "pix" &&
              order.pixQrCode &&
              order.status !== "paid" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 border border-border rounded-xl">
                      <QRCodeSVG
                        value={order.pixQrCode}
                        size={220}
                        level="M"
                        marginSize={0}
                      />
                    </div>

                    {order.pixExpirationDate && (
                      <p className="text-sm text-text-muted">
                        Expira em{" "}
                        <span className="font-semibold text-text">
                          {formatCountdown(
                            new Date(order.pixExpirationDate),
                            now
                          )}
                        </span>
                      </p>
                    )}

                    <div className="w-full">
                      <p className="text-xs font-medium text-text-muted mb-2">
                        Codigo PIX (copia e cola)
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={order.pixQrCode}
                          className="flex-1 min-w-0 px-3 py-2 text-xs font-mono bg-gray-50 border border-border rounded-lg truncate"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(order.pixQrCode!, "pix")
                          }
                          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
                          aria-label="Copiar codigo PIX"
                        >
                          {copiedPix ? (
                            <>
                              <Check size={16} /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={16} /> Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-900">
                      Apos o pagamento, esta pagina sera atualizada
                      automaticamente em ate 2 minutos. Voce tambem recebera um
                      e-mail de confirmacao.
                    </div>
                  </div>
                </div>
              )}

            {/* Boleto */}
            {order.paymentMethod === "boleto" &&
              order.boletoUrl &&
              order.status !== "paid" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href={order.boletoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
                  >
                    <ExternalLink size={16} />
                    Visualizar boleto
                  </a>

                  {order.boletoBarcode && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-text-muted mb-2">
                        Linha digitavel
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={order.boletoBarcode}
                          className="flex-1 min-w-0 px-3 py-2 text-xs font-mono bg-gray-50 border border-border rounded-lg truncate"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(order.boletoBarcode!, "boleto")
                          }
                          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
                          aria-label="Copiar linha digitavel"
                        >
                          {copiedBoleto ? (
                            <>
                              <Check size={16} /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={16} /> Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {order.boletoExpirationDate && (
                    <p className="text-sm text-text-muted mt-3">
                      Vencimento:{" "}
                      <span className="font-semibold text-text">
                        {new Date(
                          order.boletoExpirationDate + "T12:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </span>
                    </p>
                  )}
                </div>
              )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-6 space-y-6">
            <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-text flex items-center gap-2 mb-3">
                <Info size={18} className="text-primary" />
                Status atual
              </h3>
              <p className="text-sm text-text leading-relaxed">
                {statusMessage}
              </p>
            </section>

            <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-text flex items-center gap-2 mb-3">
                <Truck size={18} />
                Envio
              </h3>
              {order.shippingService ? (
                <p className="text-sm text-text">{order.shippingService}</p>
              ) : (
                <p className="text-sm text-text-muted">A definir</p>
              )}
              {order.shippingDeadline && (
                <p className="text-sm text-text-muted mt-1">
                  Prazo: {order.shippingDeadline}
                </p>
              )}
              {order.trackingCode && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-muted">Codigo de rastreio</p>
                  <p className="font-mono text-sm font-semibold text-primary mt-0.5 break-all">
                    {order.trackingCode}
                  </p>
                </div>
              )}
            </section>

            {address && (
              <section className="bg-white border border-border rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-text flex items-center gap-2 mb-3">
                  <MapPin size={18} />
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

            <a
              href="https://wa.me/5518997810521?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20meu%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary-light hover:bg-primary-light/70 text-primary font-semibold rounded-2xl p-5 transition-colors"
            >
              <MessageCircle size={18} />
              Precisa de ajuda? Fale conosco
            </a>
          </div>
        </aside>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/meus-pedidos"
          className="text-sm text-text-muted hover:text-text"
        >
          Voltar para meus pedidos
        </Link>
      </div>
    </div>
  );
}
