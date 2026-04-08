"use client";

import { ImageIcon } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const placeholders = [
  {
    label: "Carrossel antes/depois: fachada de loja sem Wind Banner → com Wind Banner (scroll lateral com transição)",
    caption: "Antes e depois",
  },
  {
    label: "Mesma arte aplicada em cada formato de Wind Banner (Pena, Faca, Gota, Vela) para visualizar as opções",
    caption: "Modelos e formatos",
  },
  {
    label: "Carrossel antes/depois: evento de corrida sem Wind Banner → com Wind Banner na linha de chegada",
    caption: "Uso em eventos",
  },
];

export function ProofSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <AnimateIn className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-text leading-tight mb-4">
            Seu cliente pode estar passando na frente da sua loja todos os
            dias...
          </h2>
          <p className="text-lg text-text-muted">
            Mas sem algo que chame a atenção, ele nem percebe que você existe.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholders.map((item, index) => (
            <AnimateIn key={item.caption} delay={index * 150} className="flex flex-col gap-3">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center">
                <ImageIcon size={40} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 font-medium leading-snug">
                  {item.label}
                </p>
              </div>
              <p className="text-sm font-semibold text-text text-center">
                {item.caption}
              </p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
