"use client";

import { Download, FileText, Minus, Plus, Upload, Sparkles, AlertCircle } from "lucide-react";
import { modelos } from "@/data/products";
import { PRECO_ARTE_WEAR, DIAS_ADICIONAIS_ARTE_WEAR } from "@/data/prices";
import { formatCurrency } from "@/lib/utils";
import type { ArteId } from "@/types";

interface ArteStepProps {
  arte: ArteId | null;
  quantidadeArtes: number;
  onChangeArte: (arte: ArteId) => void;
  onChangeQuantidadeArtes: (qty: number) => void;
}

export function ArteStep({
  arte,
  quantidadeArtes,
  onChangeArte,
  onChangeQuantidadeArtes,
}: ArteStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ArteOptionCard
          icon={Upload}
          titulo="Vou enviar minha arte"
          descricao="Baixe o gabarito e envie depois por e-mail ou WhatsApp"
          selected={arte === "enviar-arte"}
          onClick={() => onChangeArte("enviar-arte")}
        />
        <ArteOptionCard
          icon={Sparkles}
          titulo="Quero que vocês criem"
          descricao={`Nossa equipe cria a arte • ${formatCurrency(PRECO_ARTE_WEAR)}/arte`}
          selected={arte === "wear-cria-arte"}
          onClick={() => onChangeArte("wear-cria-arte")}
        />
      </div>

      {arte === "enviar-arte" && (
        <div className="p-4 bg-white border border-border rounded-xl space-y-3">
          <p className="text-sm font-semibold text-text">
            Baixe o gabarito do modelo escolhido
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {modelos.map((modelo) => (
              <a
                key={modelo.id}
                href={modelo.gabaritoUrl}
                download
                className="flex items-center gap-2 p-2.5 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center">
                  <FileText size={14} className="text-text-muted group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text truncate">
                    {modelo.nome}
                  </p>
                  <p className="text-[10px] text-text-muted">PDF</p>
                </div>
                <Download size={12} className="text-text-muted group-hover:text-primary" />
              </a>
            ))}
          </div>
          <p className="text-xs text-text-muted">
            A arte pode ser enviada após a compra por e-mail ou WhatsApp.
          </p>
        </div>
      )}

      {arte === "wear-cria-arte" && (
        <div className="p-4 bg-white border border-border rounded-xl space-y-4">
          <div>
            <p className="text-sm font-semibold text-text mb-1">
              Quantas artes diferentes você quer?
            </p>
            <p className="text-xs text-text-muted">
              Uma arte pode ser usada em vários Wind Banners. Cobramos {formatCurrency(PRECO_ARTE_WEAR)} por arte criada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeQuantidadeArtes(quantidadeArtes - 1)}
              disabled={quantidadeArtes <= 1}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuir quantidade de artes"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min={1}
              value={quantidadeArtes}
              onChange={(e) => onChangeQuantidadeArtes(parseInt(e.target.value) || 1)}
              className="w-16 h-10 text-center border border-border rounded-lg text-sm font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantidade de artes"
            />
            <button
              type="button"
              onClick={() => onChangeQuantidadeArtes(quantidadeArtes + 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Aumentar quantidade de artes"
            >
              <Plus size={16} />
            </button>
            <span className="text-sm text-text-muted ml-2">
              {formatCurrency(quantidadeArtes * PRECO_ARTE_WEAR)} no total
            </span>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue/5 border border-blue/20 rounded-lg">
            <AlertCircle size={16} className="text-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text">
              <span className="font-semibold">Prazo:</span> acrescente {DIAS_ADICIONAIS_ARTE_WEAR} dias úteis
              ao prazo de envio para desenvolvimento da arte.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ArteOptionCardProps {
  icon: typeof Upload;
  titulo: string;
  descricao: string;
  selected: boolean;
  onClick: () => void;
}

function ArteOptionCard({ icon: Icon, titulo, descricao, selected, onClick }: ArteOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left w-full ${
        selected
          ? "border-primary bg-primary-light shadow-sm"
          : "border-border bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          selected ? "bg-primary/15 text-primary" : "bg-gray-100 text-text-muted"
        }`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-text"}`}>
          {titulo}
        </p>
        <p className="text-xs text-text-muted mt-1">{descricao}</p>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  );
}
