"use client";

import { Paintbrush, Sun, CloudRain, Wrench, Clock } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

const objections = [
  {
    icon: Paintbrush,
    question: "Não tenho a arte pronta!",
    answer:
      "Sem problema. Nós criamos a arte do seu Wind Banner do zero, incluso no serviço.",
  },
  {
    icon: Sun,
    question: "Vai desbotar?",
    answer:
      "Não. Usamos impressão por sublimação de alta qualidade, resistente ao sol e à exposição prolongada.",
  },
  {
    icon: CloudRain,
    question: "Aguenta vento e chuva?",
    answer:
      "Sim. Estruturas e tecidos são feitos para uso externo, resistentes a intempéries.",
  },
  {
    icon: Wrench,
    question: "Preciso comprar base e haste junto?",
    answer:
      "Se você já tem sua estrutura, pode comprar só o tecido. Mas também oferecemos haste e base separadamente.",
  },
  {
    icon: Clock,
    question: "Qual o prazo de produção?",
    answer:
      "Com a arte pronta e aprovada, produzimos e enviamos em até 48 horas úteis. Se precisar, também criamos a arte nesse prazo.",
  },
];

export function ObjectionsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <AnimateIn>
          <h2 className="text-2xl lg:text-3xl font-bold text-text text-center mb-12">
            Tire suas dúvidas antes de comprar
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {objections.map((item, index) => (
            <AnimateIn key={item.question} delay={index * 100}>
              <div className="flex gap-4 p-5 bg-gray-50 rounded-xl h-full">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-text text-sm mb-1">
                    {item.question}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
