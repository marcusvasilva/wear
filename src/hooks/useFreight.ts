"use client";

import { useState, useCallback } from "react";
import type { BaseId, TamanhoId, ShippingOption } from "@/types";

interface UseFreightParams {
  base: BaseId | null;
  tamanho: TamanhoId | null;
  quantidade: number;
}

interface UseFreightReturn {
  cep: string;
  setCep: (cep: string) => void;
  opcoes: ShippingOption[];
  selectedOption: ShippingOption | null;
  selectOption: (option: ShippingOption) => void;
  loading: boolean;
  error: string | null;
  calcular: () => Promise<void>;
}

export function useFreight({ base, tamanho, quantidade }: UseFreightParams): UseFreightReturn {
  const [cep, setCep] = useState("");
  const [opcoes, setOpcoes] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcular = useCallback(async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setError("CEP invalido. Digite 8 digitos.");
      return;
    }

    if (!base || !tamanho) {
      setError("Selecione o tamanho e a base antes de calcular o frete.");
      return;
    }

    setLoading(true);
    setError(null);
    setOpcoes([]);
    setSelectedOption(null);

    try {
      const response = await fetch("/api/freight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: cepLimpo,
          base,
          tamanho,
          quantidade,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Erro ao calcular frete");
      }

      const data: ShippingOption[] = await response.json();

      if (data.length === 0) {
        setError("Nenhuma opcao de frete disponivel para este CEP.");
        return;
      }

      setOpcoes(data);
      // Auto-seleciona a opcao mais barata
      setSelectedOption(data[0]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao calcular frete. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [cep, base, tamanho, quantidade]);

  return {
    cep,
    setCep,
    opcoes,
    selectedOption,
    selectOption: setSelectedOption,
    loading,
    error,
    calcular,
  };
}
