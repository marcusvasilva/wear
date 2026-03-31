"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

const steps = [
  {
    numero: "1",
    titulo: "Escolha modelo e tamanho",
    descricao: "Selecione o formato e as dimensões ideais para o seu negócio.",
  },
  {
    numero: "2",
    titulo: "Defina se deseja com estrutura",
    descricao: "Escolha se quer só o tecido ou com haste e base inclusos.",
  },
  {
    numero: "3",
    titulo: "Selecione a quantidade",
    descricao: "Quanto mais unidades, maior o desconto por banner.",
  },
  {
    numero: "4",
    titulo: "Envie sua arte ou peça para criarmos",
    descricao: "Você pode enviar a arte pronta ou solicitar a criação.",
  },
  {
    numero: "5",
    titulo: "Depois disso, é com a gente",
    descricao: "Produzimos, revisamos e enviamos o seu Wind Banner.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <AnimateIn>
          <h2 className="text-2xl lg:text-3xl font-bold text-text text-center mb-12">
            Como funciona?
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <AnimateIn key={step.numero} delay={index * 120} className="relative text-center">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-border" />
              )}
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg mb-4">
                {step.numero}
              </div>
              <h3 className="text-sm font-bold text-text mb-1">
                {step.titulo}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {step.descricao}
              </p>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn className="text-center mt-10" delay={600}>
          <a
            href="#configurador"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-3.5 rounded-lg transition-colors"
          >
            Configurar agora
          </a>
        </AnimateIn>
      </div>
    </section>
  );
}
