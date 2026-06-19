"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  ConfiguracaoSelecionada,
  ModeloId,
  BaseId,
  ExtraId,
  ArteId,
} from "@/types";
import { calcularPreco } from "@/lib/price-calculator";
import { TAMANHO_UNICO } from "@/data/products";

const INITIAL_STATE: ConfiguracaoSelecionada = {
  modelo: null,
  tamanho: TAMANHO_UNICO,
  tecido: "bora",
  base: null,
  extras: [],
  arte: null,
  quantidadeArtes: 1,
  quantidade: 1,
};

export function useConfigurator() {
  const [config, setConfig] = useState<ConfiguracaoSelecionada>(INITIAL_STATE);

  const setModelo = useCallback((modelo: ModeloId) => {
    setConfig((prev) => ({ ...prev, modelo }));
  }, []);

  const setBase = useCallback((base: BaseId) => {
    setConfig((prev) => ({ ...prev, base }));
  }, []);

  const toggleExtra = useCallback((extraId: ExtraId) => {
    setConfig((prev) => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter((e) => e !== extraId)
        : [...prev.extras, extraId],
    }));
  }, []);

  const setQuantidade = useCallback((quantidade: number) => {
    setConfig((prev) => ({ ...prev, quantidade: Math.max(1, quantidade) }));
  }, []);

  const setArte = useCallback((arte: ArteId) => {
    setConfig((prev) => ({ ...prev, arte }));
  }, []);

  const setQuantidadeArtes = useCallback((quantidadeArtes: number) => {
    setConfig((prev) => ({ ...prev, quantidadeArtes: Math.max(1, quantidadeArtes) }));
  }, []);

  const reset = useCallback(() => {
    setConfig(INITIAL_STATE);
  }, []);

  const preco = useMemo(() => calcularPreco(config), [config]);

  const isComplete =
    config.modelo !== null &&
    config.base !== null &&
    config.arte !== null;

  return {
    config,
    preco,
    isComplete,
    setModelo,
    setBase,
    toggleExtra,
    setArte,
    setQuantidadeArtes,
    setQuantidade,
    reset,
  };
}
