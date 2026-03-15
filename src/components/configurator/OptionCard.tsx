"use client";

import Image from "next/image";

interface OptionCardProps {
  nome: string;
  descricao?: string;
  imagem?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ nome, descricao, imagem, selected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-left w-full ${
        selected
          ? "border-primary bg-primary-light shadow-sm"
          : "border-border bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {imagem && (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={imagem}
            alt={nome}
            fill
            className="object-contain p-2"
            sizes="120px"
          />
        </div>
      )}
      <div className="text-center">
        <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-text"}`}>
          {nome}
        </p>
        {descricao && (
          <p className="text-xs text-text-muted mt-0.5">{descricao}</p>
        )}
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  );
}
