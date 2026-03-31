"use client";

import { Factory, Palette, Shield, Zap, MessageCircle } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const benefits = [
  {
    icon: Factory,
    titulo: "Produção própria",
    descricao:
      "Fabricamos tudo internamente, garantindo mais qualidade e mais rapidez na entrega do seu Wind Banner.",
  },
  {
    icon: Palette,
    titulo: "Impressão premium",
    descricao:
      "Sublimação em alta resolução com cores vivas que não desbotam, mesmo com exposição ao sol.",
  },
  {
    icon: Shield,
    titulo: "Estrutura resistente",
    descricao:
      "Base e haste projetadas para aguentar vento e uso contínuo em ambientes externos.",
  },
  {
    icon: Zap,
    titulo: "Entrega rápida",
    descricao:
      "Produzimos seu Wind Banner em até 48 horas úteis após a aprovação da arte.",
  },
  {
    icon: MessageCircle,
    titulo: "Atendimento humano",
    descricao:
      "Suporte real via WhatsApp do início ao fim. Sem robôs, sem espera.",
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <AnimateIn>
          <h2 className="text-2xl lg:text-3xl font-bold text-text text-center mb-12">
            Por que escolher a Wear Sublimações pra produzir seu Wind Banner?
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, index) => (
            <AnimateIn key={item.titulo} delay={index * 100}>
              <div className="bg-white rounded-xl p-6 border border-border hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-base font-bold text-text mb-2">
                  {item.titulo}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
