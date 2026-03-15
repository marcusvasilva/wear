import { Star } from "lucide-react";

const avaliacoes = [
  {
    nome: "Carlos M.",
    nota: 5,
    data: "12/02/2026",
    texto:
      "Excelente qualidade! As cores ficaram vibrantes e o tecido é muito resistente. Chegou antes do prazo. Recomendo!",
  },
  {
    nome: "Ana Paula S.",
    nota: 5,
    data: "28/01/2026",
    texto:
      "Comprei para minha loja e ficou perfeito. O atendimento via WhatsApp foi super rápido e me ajudaram com a arte.",
  },
  {
    nome: "Roberto L.",
    nota: 4,
    data: "15/01/2026",
    texto:
      "Produto de qualidade. A montagem é fácil e a base fica bem firme. Só achei que poderia ter mais opções de tamanho.",
  },
  {
    nome: "Fernanda K.",
    nota: 5,
    data: "03/01/2026",
    texto:
      "Já é o terceiro wind banner que compro aqui. Sempre impecável! Uso para eventos e feiras, e o material aguenta sol e chuva sem desbotar.",
  },
  {
    nome: "João Pedro R.",
    nota: 5,
    data: "20/12/2025",
    texto:
      "Surpreendeu pela rapidez na entrega e pela qualidade da impressão. Meu wind banner ficou idêntico ao mockup que enviei.",
  },
  {
    nome: "Mariana T.",
    nota: 4,
    data: "10/12/2025",
    texto:
      "Muito bom! A haste é leve e fácil de transportar. A bandeira tem boa resistência ao vento. Recomendo para quem precisa de visibilidade.",
  },
];

export function SocialProofSection() {
  const mediaNota = (avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length).toFixed(1);

  return (
    <section id="avaliacoes" className="bg-white scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Avaliações</h2>

        {/* Resumo */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl font-bold text-text">{mediaNota}</span>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-text-muted mt-0.5">
              {avaliacoes.length} avaliações
            </p>
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-4 max-w-3xl">
          {avaliacoes.map((avaliacao, i) => (
            <div key={i} className="border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm font-bold text-primary">
                    {avaliacao.nome[0]}
                  </div>
                  <span className="text-sm font-semibold text-text">{avaliacao.nome}</span>
                </div>
                <span className="text-xs text-text-muted">{avaliacao.data}</span>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= avaliacao.nota ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{avaliacao.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
