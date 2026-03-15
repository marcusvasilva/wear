import Image from "next/image";
import { Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Imagem do produto */}
          <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            <Image
              src="/products/mockup_windbanner_wear.png"
              alt="Wind Banner Personalizado Wear Sublimações"
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Info do produto */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Wear Sublimações
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-text leading-tight">
                Wind Banner Personalizado
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-text-muted">(47 avaliações)</span>
            </div>

            {/* Preço */}
            <div>
              <p className="text-sm text-text-muted line-through">R$ 189,90</p>
              <p className="text-3xl font-bold text-price-red">
                R$ 149,90
              </p>
              <p className="text-sm text-text-muted mt-0.5">
                ou 6x de R$ 24,98 sem juros
              </p>
            </div>

            {/* Descrição */}
            <div className="text-sm text-text-muted leading-relaxed space-y-2">
              <p>
                Wind Banner com sublimação em alta resolução, perfeito para divulgação do seu negócio.
                Tecido resistente, cores vibrantes e acabamento profissional.
              </p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Impressão sublimada de alta resolução
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Tecido resistente a intempéries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Envio em até 48h úteis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Sistema veste fácil (encaixa na haste)
                </li>
              </ul>
            </div>

            {/* CTA */}
            <a
              href="#configurador"
              className="mt-2 inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-3.5 rounded-lg transition-colors w-full sm:w-auto text-center"
            >
              Configure o seu agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
