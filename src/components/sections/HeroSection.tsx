"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function HeroSection() {
  return (
    <section className="relative h-screen text-white overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/cenarios/cenario-1.png"
      >
        <source src="/images/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradiente: escuro na esquerda, semi-transparente na direita */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:py-24 flex items-center h-screen">
        <AnimateIn className="flex flex-col gap-6 max-w-xl">
          <span className="inline-flex items-center self-start bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide backdrop-blur-sm">
            Solução completa em Wind Banner
          </span>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight drop-shadow-lg">
            Seu Wind Banner com a sua marca, pronto em 48h, direto da fábrica.
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed drop-shadow-md">
            Ofertamos a solução completa pra você: fazemos a arte do seu Wind
            Banner, produzimos e enviamos com Haste e Base.
          </p>

          <ul className="space-y-2.5">
            {[
              "Impressão premium com cores que não desbotam",
              "Tecido e estrutura resistentes",
              "Produção e envio em até 48h úteis",
              "Atendimento humano via WhatsApp",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-200">
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
              Comprar meu Wind Banner
              <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/5518998074936?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20Wind%20Banner"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 backdrop-blur-sm text-white font-medium text-sm px-6 py-3.5 rounded-lg transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
