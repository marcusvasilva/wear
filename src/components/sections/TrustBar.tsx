"use client";

import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const trustItems = [
  {
    icon: Truck,
    titulo: "Envio em 48h",
    descricao: "Produção rápida e envio ágil",
  },
  {
    icon: CreditCard,
    titulo: "6x sem juros",
    descricao: "Parcele no cartão de crédito",
  },
  {
    icon: ShieldCheck,
    titulo: "100% Seguro",
    descricao: "Checkout protegido e criptografado",
  },
  {
    icon: Headphones,
    titulo: "Suporte no pós-venda",
    descricao: "Atendimento real via WhatsApp",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map((item, index) => (
            <AnimateIn key={item.titulo} delay={index * 100}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{item.titulo}</p>
                  <p className="text-xs text-text-muted">{item.descricao}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
