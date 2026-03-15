"use client";

import { useFreight } from "@/hooks/useFreight";
import { formatCurrency } from "@/lib/utils";
import { Truck, Loader2 } from "lucide-react";

export function FreightCalculator() {
  const { cep, setCep, resultado, loading, error, calcular } = useFreight();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-text flex items-center gap-1.5">
        <Truck size={16} className="text-text-muted" />
        Calcular frete
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="00000-000"
          maxLength={9}
          className="flex-1 h-10 px-3 border border-border rounded-lg text-sm"
        />
        <button
          onClick={calcular}
          disabled={loading}
          className="h-10 px-4 bg-gray-100 hover:bg-gray-200 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "OK"}
        </button>
      </div>
      {error && <p className="text-xs text-price-red">{error}</p>}
      {resultado && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">{resultado.tipo} - {resultado.prazo}</span>
            <span className="font-semibold text-text">{formatCurrency(resultado.valor)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
