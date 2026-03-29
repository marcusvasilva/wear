import type { ConfiguracaoSelecionada } from "@/types";

const STORAGE_KEY = "wear:checkout-config";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredConfig {
  config: ConfiguracaoSelecionada;
  timestamp: number;
}

export function saveCheckoutConfig(config: ConfiguracaoSelecionada): void {
  try {
    const data: StoredConfig = { config, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadCheckoutConfig(): ConfiguracaoSelecionada | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: StoredConfig = JSON.parse(raw);
    if (Date.now() - data.timestamp > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data.config;
  } catch {
    return null;
  }
}

export function clearCheckoutConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
