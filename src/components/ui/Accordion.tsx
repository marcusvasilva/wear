"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  titulo: string;
  conteudo: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-text hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            {item.titulo}
            <ChevronDown
              size={18}
              className={`text-text-muted transition-transform ${openIndex === index ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-sm text-text-muted leading-relaxed">
              {item.conteudo}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
