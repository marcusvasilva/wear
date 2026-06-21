"use client";

import { Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PriceTier } from "@/types";

interface QuantitySelectorProps {
  tiers: PriceTier[];
  quantidade: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({ tiers, quantidade, onChange }: QuantitySelectorProps) {
  const ordenadas = [...tiers].sort((a, b) => a.minQty - b.minQty);
  const precoCheio = ordenadas[0]?.precoCentavos ?? 0;
  const tierAtivo =
    ordenadas.filter((t) => quantidade >= t.minQty).pop()?.minQty ?? null;

  return (
    <div className="space-y-4">
      {/* Seletor */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(quantidade - 1)}
          disabled={quantidade <= 1}
          className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Diminuir quantidade"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => onChange(parseInt(e.target.value) || 1)}
          className="w-16 h-10 text-center border border-border rounded-lg text-sm font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(quantidade + 1)}
          className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Aumentar quantidade"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Tabela de faixas de preço */}
      {ordenadas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ordenadas
            .filter((t) => t.minQty > 1)
            .map((t) => {
              const descontoPct =
                precoCheio > 0
                  ? Math.round(((precoCheio - t.precoCentavos) / precoCheio) * 100)
                  : 0;
              const isAtivo = tierAtivo === t.minQty;
              return (
                <button
                  key={t.minQty}
                  onClick={() => onChange(t.minQty)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    isAtivo
                      ? "border-primary bg-primary-light"
                      : "border-border hover:border-gray-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-text">
                    {t.minQty}+ unidades
                  </p>
                  {descontoPct > 0 && (
                    <p className="text-xs text-primary font-bold">-{descontoPct}%</p>
                  )}
                  <p className="text-xs text-text-muted">
                    {formatCurrency(t.precoCentavos)}/un
                  </p>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
