"use client";

import { ImageIcon, CheckCircle, ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function HeroSection() {
  return (
    <section className="bg-header-bg text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Copy comercial */}
          <AnimateIn className="flex flex-col gap-6 order-2 lg:order-1">
            <span className="inline-flex items-center self-start bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              Solução completa em Wind Banner
            </span>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              Produzimos a arte do seu Wind Banner em até 48 horas
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed">
              Ofertamos a solução completa pra você: fazemos a arte do seu Wind
              Banner, produzimos e enviamos com Haste e Base.
            </p>

            <ul className="space-y-2.5">
              {[
                "Impressão premium com cores que não desbotam",
                "Tecido e estrutura resistentes a intempéries",
                "Produção e envio em até 48h úteis",
                "Atendimento humano via WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="#configurador"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-3.5 rounded-lg transition-colors"
              >
                Configurar meu Wind Banner
                <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/5518998074936?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20Wind%20Banner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-400 text-white font-medium text-sm px-6 py-3.5 rounded-lg transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>
          </AnimateIn>

          {/* Placeholder imagem hero */}
          <AnimateIn className="order-1 lg:order-2" delay={200}>
            <div className="relative aspect-[4/3] bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-8 text-center">
              <ImageIcon size={48} className="text-gray-500 mb-4" />
              <p className="text-sm text-gray-400 font-medium">
                Imagem principal do Wind Banner aqui
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Banner hero com produto em destaque
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
