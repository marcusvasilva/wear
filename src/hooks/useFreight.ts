"use client";

import { useState, useCallback } from "react";

interface FreightResult {
  valor: number; // centavos
  prazo: string;
  tipo: string;
}

interface UseFreightReturn {
  cep: string;
  setCep: (cep: string) => void;
  resultado: FreightResult | null;
  loading: boolean;
  error: string | null;
  calcular: () => Promise<void>;
}

export function useFreight(): UseFreightReturn {
  const [cep, setCep] = useState("");
  const [resultado, setResultado] = useState<FreightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcular = useCallback(async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setError("CEP inválido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: integrar com API de frete real (Magazord ou Correios)
      // Placeholder: simula cálculo de frete
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResultado({
        valor: 2990, // R$ 29,90
        prazo: "5 a 8 dias úteis",
        tipo: "PAC",
      });
    } catch {
      setError("Erro ao calcular frete. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [cep]);

  return { cep, setCep, resultado, loading, error, calcular };
}
