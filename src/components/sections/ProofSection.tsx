"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";

const comparacoes = [
  {
    antes: "/images/antes-depois/antes-1.jpg",
    depois: "/images/antes-depois/depois-1.jpg",
    caption: "Fachada comercial",
  },
  {
    antes: "/images/antes-depois/antes-2.jpg",
    depois: "/images/antes-depois/depois-2.jpg",
    caption: "Eventos e corridas",
  },
  {
    antes: "/images/antes-depois/antes-3.jpg",
    depois: "/images/antes-depois/depois-3.png",
    caption: "Frente de restaurante",
  },
];

function BeforeAfterSlider({
  antes,
  depois,
  caption,
}: {
  antes: string;
  depois: string;
  caption: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-col-resize select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Imagem DEPOIS (fundo completo) */}
        <Image
          src={depois}
          alt={`${caption} - com Wind Banner`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Imagem ANTES (cortada pelo slider via clip-path para manter imagem fixa) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={antes}
            alt={`${caption} - sem Wind Banner`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Linha divisória */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-gray-700"
            >
              <path
                d="M6 10L2 10M2 10L4.5 7.5M2 10L4.5 12.5M14 10L18 10M18 10L15.5 7.5M18 10L15.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
          Antes
        </span>
        <span className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
          Depois
        </span>
      </div>
      <p className="text-sm font-semibold text-text text-center">{caption}</p>
    </div>
  );
}

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
          {comparacoes.map((item, index) => (
            <AnimateIn key={item.caption} delay={index * 150}>
              <BeforeAfterSlider
                antes={item.antes}
                depois={item.depois}
                caption={item.caption}
              />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
