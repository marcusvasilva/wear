"use client";

import { modelos, tamanhos, bases } from "@/data/products";
import { formatCurrency, formatInstallment } from "@/lib/utils";
import type { ConfiguracaoSelecionada, ShippingOption } from "@/types";
import { Loader2, ShieldCheck } from "lucide-react";

interface CheckoutOrderSummaryProps {
  config: ConfiguracaoSelecionada;
  preco: {
    precoBase: number;
    precoAdicionalBase: number;
    precoExtras: number;
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
