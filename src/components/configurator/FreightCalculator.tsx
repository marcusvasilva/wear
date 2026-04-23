"use client";

import { useFreight } from "@/hooks/useFreight";
import { formatCurrency, maskCep } from "@/lib/utils";
import { DIAS_ADICIONAIS_ARTE_WEAR } from "@/data/prices";
import type { ArteId, BaseId, TamanhoId, ShippingOption } from "@/types";
import { Truck, Loader2, Package } from "lucide-react";

interface FreightCalculatorProps {
  base: BaseId | null;
  tamanho: TamanhoId | null;
  quantidade: number;
  arte?: ArteId | null;
}

export function FreightCalculator({ base, tamanho, quantidade, arte }: FreightCalculatorProps) {
  const {
    cep,
    setCep,
    opcoes,
    selectedOption,
    selectOption,
    loading,
    error,
    calcular,
  } = useFreight({ base, tamanho, quantidade });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calcular();
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-text flex items-center gap-1.5">
        <Truck size={16} className="text-text-muted" />
        Calcular frete
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={maskCep(cep)}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
          onKeyDown={handleKeyDown}
          placeholder="00000-000"
          maxLength={9}
          className="flex-1 h-10 px-3 border border-border rounded-lg text-sm"
          aria-label="CEP de destino"
        />
        <button
          onClick={calcular}
          disabled={loading}
          className="h-10 px-4 bg-gray-100 hover:bg-gray-200 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          aria-label="Calcular frete"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "OK"}
        </button>
      </div>

      {error && <p className="text-xs text-price-red">{error}</p>}

      {opcoes.length > 0 && (
        <div className="space-y-1.5">
          {opcoes.map((opcao) => (
            <ShippingOptionCard
              key={opcao.id}
              option={opcao}
              selected={selectedOption?.id === opcao.id}
              onSelect={() => selectOption(opcao)}
            />
          ))}
          {arte === "wear-cria-arte" && (
            <p className="text-[11px] text-text-muted leading-snug pt-1">
              + {DIAS_ADICIONAIS_ARTE_WEAR} dias úteis para desenvolvimento da arte
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface ShippingOptionCardProps {
  option: ShippingOption;
  selected: boolean;
  onSelect: () => void;
}

function ShippingOptionCard({ option, selected, onSelect }: ShippingOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 rounded-lg p-3 text-sm text-left transition-colors border ${
        selected
          ? "border-primary bg-primary-light"
          : "border-border bg-gray-50 hover:bg-gray-100"
      }`}
      aria-label={`Selecionar ${option.company} ${option.name}`}
    >
      <Package size={18} className="text-text-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text truncate">
          {option.company} - {option.name}
        </p>
        <p className="text-xs text-text-muted">{option.deliveryEstimate}</p>
      </div>
      <span className="font-semibold text-text whitespace-nowrap">
        {formatCurrency(option.price)}
      </span>
    </button>
  );
}
