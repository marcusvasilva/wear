"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  ConfiguracaoSelecionada,
  ModeloId,
  TamanhoId,
  TecidoId,
  BaseId,
  ExtraId,
} from "@/types";
import { calcularPreco } from "@/lib/price-calculator";

const INITIAL_STATE: ConfiguracaoSelecionada = {
  modelo: null,
  tamanho: null,
  tecido: null,
  base: null,
  extras: [],
  quantidade: 1,
};

export function useConfigurator() {
  const [config, setConfig] = useState<ConfiguracaoSelecionada>(INITIAL_STATE);

  const setModelo = useCallback((modelo: ModeloId) => {
    setConfig((prev) => ({ ...prev, modelo }));
  }, []);

  const setTamanho = useCallback((tamanho: TamanhoId) => {
    setConfig((prev) => ({ ...prev, tamanho }));
  }, []);

  const setTecido = useCallback((tecido: TecidoId) => {
    setConfig((prev) => ({ ...prev, tecido }));
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

  const reset = useCallback(() => {
    setConfig(INITIAL_STATE);
  }, []);

  const preco = useMemo(() => calcularPreco(config), [config]);

  const isComplete =
    config.modelo !== null &&
    config.tamanho !== null &&
    config.tecido !== null &&
    config.base !== null;

  return {
    config,
    preco,
    isComplete,
    setModelo,
    setTamanho,
    setTecido,
    setBase,
    toggleExtra,
    setQuantidade,
    reset,
  };
}
