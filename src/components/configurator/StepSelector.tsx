"use client";

import { Lock, Check } from "lucide-react";

interface StepSelectorProps {
  numero: number;
  titulo: string;
  descricao?: string;
  disabled?: boolean;
  completo?: boolean;
  mensagemBloqueio?: string;
  children: React.ReactNode;
}

export function StepSelector({
  numero,
  titulo,
  descricao,
  disabled = false,
  completo = false,
  mensagemBloqueio = "Complete o passo anterior para liberar",
  children,
}: StepSelectorProps) {
  const badgeClasses = disabled
    ? "bg-gray-200 text-gray-400"
    : completo
      ? "bg-primary text-white"
      : "bg-primary text-white";

  return (
    <div className={`space-y-4 ${disabled ? "opacity-50" : ""}`} aria-disabled={disabled}>
      <div>
        <h3
          className={`text-base font-bold flex items-center gap-2 ${
            disabled ? "text-text-muted" : "text-text"
          }`}
        >
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${badgeClasses}`}
          >
            {disabled ? <Lock size={12} /> : completo ? <Check size={14} /> : numero}
          </span>
          {titulo}
        </h3>
        {descricao && !disabled && (
          <p className="text-sm text-text-muted mt-1 ml-9">{descricao}</p>
        )}
        {disabled && (
          <p className="text-sm text-text-muted mt-1 ml-9">{mensagemBloqueio}</p>
        )}
      </div>
      {!disabled && <div className="ml-9">{children}</div>}
    </div>
  );
}
