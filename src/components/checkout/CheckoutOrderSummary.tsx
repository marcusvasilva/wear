"use client";

import { modelos, tamanhos, bases } from "@/data/products";
import { DIAS_ADICIONAIS_ARTE_WEAR } from "@/data/prices";
import { formatCurrency, formatInstallment } from "@/lib/utils";
import type { ConfiguracaoSelecionada, ShippingOption } from "@/types";
import { Loader2, ShieldCheck, Clock } from "lucide-react";

interface CheckoutOrderSummaryProps {
  config: ConfiguracaoSelecionada;
  preco: {
    precoBase: number;
    precoAdicionalBase: number;
    precoExtras: number;
    precoArtes: number;
    subtotal: number;
    descontoPercentual: number;
    descontoValor: number;
    total: number;
  };
  shipping: ShippingOption | null;
  canSubmit: boolean;
  loading: boolean;
  onSubmit: () => void;
}

export function CheckoutOrderSummary({
  config,
  preco,
  shipping,
  canSubmit,
  loading,
  onSubmit,
}: CheckoutOrderSummaryProps) {
  const modeloNome = modelos.find((m) => m.id === config.modelo)?.nome;
  const tamanhoInfo = tamanhos.find((t) => t.id === config.tamanho);
  const baseNome = bases.find((b) => b.id === config.base)?.nome;
  const totalComFrete = preco.total + (shipping?.price ?? 0);

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-text text-base">Resumo do Pedido</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Produto</span>
          <span className="font-medium text-text text-right">Wind Banner {modeloNome}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Tamanho</span>
          <span className="font-medium text-text">{tamanhoInfo?.nome}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Base</span>
          <span className="font-medium text-text">{baseNome}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Arte</span>
          <span className="font-medium text-text">
            {config.arte === "enviar-arte"
              ? "Cliente envia"
              : `Wear cria (${config.quantidadeArtes}x)`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Quantidade</span>
          <span className="font-medium text-text">{config.quantidade}</span>
        </div>
      </div>

      <hr className="border-border" />

      <div className="space-y-1.5 text-sm">
        {preco.descontoPercentual > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-muted line-through">{formatCurrency(preco.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary">Desconto ({preco.descontoPercentual}%)</span>
              <span className="text-primary">-{formatCurrency(preco.descontoValor)}</span>
            </div>
          </>
        )}
        {preco.precoArtes > 0 && (
          <div className="flex justify-between">
            <span className="text-text-muted">Arte ({config.quantidadeArtes}x)</span>
            <span className="text-text">+{formatCurrency(preco.precoArtes)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text-muted">Produtos</span>
          <span className="text-text">{formatCurrency(preco.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Frete</span>
          <span className="text-text">
            {shipping ? formatCurrency(shipping.price) : "\u2014"}
          </span>
        </div>
        {config.arte === "wear-cria-arte" && (
          <div className="flex items-start gap-1.5 mt-2 p-2 bg-blue/5 border border-blue/20 rounded-lg">
            <Clock size={12} className="text-blue flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-text leading-snug">
              +{DIAS_ADICIONAIS_ARTE_WEAR} dias \u00fateis no prazo para desenvolvimento da arte
            </p>
          </div>
        )}
      </div>

      <hr className="border-border" />

      <div className="flex justify-between items-baseline">
        <span className="font-semibold text-text">Total</span>
        <span className="text-2xl font-bold text-price-red">
          {formatCurrency(totalComFrete)}
        </span>
      </div>
      <p className="text-xs text-text-muted text-right">
        {formatInstallment(totalComFrete)}
      </p>

      <button
        onClick={onSubmit}
        disabled={!canSubmit || loading}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processando...
          </>
        ) : (
          "Finalizar Pedido"
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <ShieldCheck size={14} />
        Pagamento seguro via Pagar.me
      </div>
    </div>
  );
}
