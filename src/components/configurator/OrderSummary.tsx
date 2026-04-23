"use client";

import type { ConfiguracaoSelecionada } from "@/types";
import { modelos, tamanhos, bases } from "@/data/products";
import { DIAS_ADICIONAIS_ARTE_WEAR } from "@/data/prices";
import { formatCurrency, formatInstallment } from "@/lib/utils";
import { saveCheckoutConfig } from "@/lib/checkout-storage";
import { FreightCalculator } from "./FreightCalculator";
import { ShoppingCart, Clock } from "lucide-react";

interface OrderSummaryProps {
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
  isComplete: boolean;
}

export function OrderSummary({ config, preco, isComplete }: OrderSummaryProps) {
  const modeloNome = modelos.find((m) => m.id === config.modelo)?.nome;
  const tamanhoInfo = tamanhos.find((t) => t.id === config.tamanho);
  const baseNome = bases.find((b) => b.id === config.base)?.nome;

  const handleComprar = () => {
    saveCheckoutConfig(config);
    window.location.href = "/checkout";
  };

  return (
    <div className="border border-border rounded-2xl bg-white p-5 space-y-4">
      <h3 className="font-bold text-text text-base">Resumo</h3>

      {/* Selecoes */}
      <div className="space-y-2 text-sm">
        <SummaryLine label="Modelo" value={modeloNome} />
        <SummaryLine
          label="Tamanho"
          value={tamanhoInfo ? `${tamanhoInfo.nome} (${tamanhoInfo.dimensoes})` : undefined}
        />
        <SummaryLine label="Base" value={baseNome} />
        {config.extras.length > 0 && (
          <SummaryLine label="Extras" value={`${config.extras.length} selecionado(s)`} />
        )}
        <SummaryLine
          label="Arte"
          value={
            config.arte === "enviar-arte"
              ? "Cliente envia"
              : config.arte === "wear-cria-arte"
                ? `Wear cria (${config.quantidadeArtes}x)`
                : undefined
          }
        />
        <SummaryLine label="Quantidade" value={String(config.quantidade)} />
      </div>

      <hr className="border-border" />

      {/* Precos */}
      {preco.total > 0 ? (
        <div className="space-y-1.5">
          {preco.descontoPercentual > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-muted line-through">{formatCurrency(preco.subtotal)}</span>
            </div>
          )}
          {preco.descontoPercentual > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-primary font-medium">Desconto ({preco.descontoPercentual}%)</span>
              <span className="text-primary font-medium">-{formatCurrency(preco.descontoValor)}</span>
            </div>
          )}
          {preco.precoArtes > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">
                Arte ({config.quantidadeArtes}x)
              </span>
              <span className="text-text">+{formatCurrency(preco.precoArtes)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-text">Total</span>
            <span className="text-2xl font-bold text-price-red">{formatCurrency(preco.total)}</span>
          </div>
          <p className="text-xs text-text-muted text-right">
            {formatInstallment(preco.total)}
          </p>
          {config.arte === "wear-cria-arte" && (
            <div className="flex items-start gap-1.5 mt-2 p-2 bg-blue/5 border border-blue/20 rounded-lg">
              <Clock size={12} className="text-blue flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-text leading-snug">
                +{DIAS_ADICIONAIS_ARTE_WEAR} dias úteis no prazo para desenvolvimento da arte
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-muted text-center py-2">
          Selecione as opcoes para ver o preco
        </p>
      )}

      <hr className="border-border" />

      {/* Frete */}
      <FreightCalculator
        base={config.base}
        tamanho={config.tamanho}
        quantidade={config.quantidade}
        arte={config.arte}
      />

      {/* Botao comprar */}
      <button
        onClick={handleComprar}
        disabled={!isComplete}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 rounded-lg transition-colors"
        aria-label="Comprar Wind Banner"
      >
        <ShoppingCart size={20} />
        Comprar Agora
      </button>

      {/* WhatsApp */}
      <a
        href="https://wa.me/5518998074936?text=Ol%C3%A1!%20Tenho%20interesse%20em%20Wind%20Banners"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-blue hover:underline"
      >
        Duvidas? Fale pelo WhatsApp
      </a>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text">{value ?? "\u2014"}</span>
    </div>
  );
}
