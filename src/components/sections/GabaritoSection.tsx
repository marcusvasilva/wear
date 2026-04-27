"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { modelos, tamanhos } from "@/data/products";
import type { ModeloId } from "@/types";

export function GabaritoSection() {
  const [modeloAtivo, setModeloAtivo] = useState<ModeloId>(modelos[0].id);
  const modelo = modelos.find((m) => m.id === modeloAtivo) ?? modelos[0];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Gabaritos</h2>
        <p className="text-sm text-text-muted mb-8">
          Escolha o modelo do seu Wind Banner e baixe o gabarito do tamanho que você vai pedir.
        </p>

        {/* Tabs de modelo */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          role="tablist"
          aria-label="Selecione o modelo"
        >
          {modelos.map((m) => {
            const ativo = m.id === modeloAtivo;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={ativo}
                onClick={() => setModeloAtivo(m.id)}
                className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  ativo
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-white text-text hover:border-gray-300"
                }`}
              >
                {m.nome}
              </button>
            );
          })}
        </div>

        {/* Painel do modelo ativo */}
        <div
          className="border border-border rounded-xl p-5"
          role="tabpanel"
          aria-label={`Gabaritos ${modelo.nome}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-text">Gabaritos {modelo.nome}</p>
              <p className="text-xs text-text-muted">{modelo.descricao}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tamanhos.map((tamanho) => (
              <a
                key={tamanho.id}
                href={modelo.gabaritos[tamanho.id]}
                download
                className="flex items-center justify-between gap-2 p-2.5 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all group"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text truncate">{tamanho.nome}</p>
                  <p className="text-[10px] text-text-muted truncate">{tamanho.dimensoes}</p>
                </div>
                <Download size={12} className="text-text-muted group-hover:text-primary flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue/5 border border-blue/20 rounded-xl">
          <p className="text-sm text-text">
            <span className="font-semibold">Dica:</span> A arte pode ser enviada após a compra por e-mail ou WhatsApp.
            Não se preocupe em ter a arte pronta agora!
          </p>
        </div>
      </div>
    </section>
  );
}
