"use client";

import { Minus, Plus } from "lucide-react";
import { descontos } from "@/data/products";
import { formatCurrency } from "@/lib/utils";

interface QuantitySelectorProps {
  quantidade: number;
  precoUnitario: number;
  onChange: (qty: number) => void;
}

export function QuantitySelector({ quantidade, precoUnitario, onChange }: QuantitySelectorProps) {
  const tierAtivo = descontos.reduce<number | null>(
    (acc, d) => (quantidade >= d.minQty ? d.minQty : acc),
    null,
  );

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

      {/* Tabela de descontos */}
      {precoUnitario > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {descontos.map((d) => {
            const precoComDesconto = Math.round(precoUnitario * (1 - d.descontoPercentual / 100));
            const isAtivo = tierAtivo === d.minQty;
            return (
              <button
                key={d.minQty}
                onClick={() => onChange(d.minQty)}
                className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                  isAtivo
                    ? "border-primary bg-primary-light"
                    : "border-border hover:border-gray-300"
                }`}
              >
                <p className="text-xs font-semibold text-text">
                  {d.minQty} unidades
                </p>
                <p className="text-xs text-primary font-bold">
                  -{d.descontoPercentual}%
                </p>
                <p className="text-xs text-text-muted">
                  {formatCurrency(precoComDesconto)}/un
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
