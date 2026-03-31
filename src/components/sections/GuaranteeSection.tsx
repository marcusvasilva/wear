"use client";

import { Headphones, ShieldCheck, PackageCheck } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const guarantees = [
  {
    icon: Headphones,
    titulo: "Suporte no pós-venda",
    descricao: "Qualquer dúvida ou problema após a compra, estamos aqui pra resolver.",
  },
  {
    icon: ShieldCheck,
    titulo: "Compra 100% segura",
    descricao: "Checkout protegido com criptografia. Seus dados estão seguros.",
  },
  {
    icon: PackageCheck,
    titulo: "Produto revisado antes do envio",
    descricao: "Todo Wind Banner passa por conferência de qualidade antes de sair da produção.",
  },
];

export function GuaranteeSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guarantees.map((item, index) => (
            <AnimateIn
              key={item.titulo}
              delay={index * 150}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-4">
                <item.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-base font-bold text-text mb-1">
                {item.titulo}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {item.descricao}
              </p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
