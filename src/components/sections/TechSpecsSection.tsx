import { Accordion } from "@/components/ui/Accordion";

const specs = [
  {
    titulo: "Modelos e Dimensões",
    conteudo:
      "Disponível nos modelos Pena, Faca, Gota e Vela. Tamanhos de 1,50m a 3,00m de altura, com largura padrão de 0,65m. Cada modelo possui um formato único de silhueta para máxima visibilidade.",
  },
  {
    titulo: "Base e Estrutura",
    conteudo:
      "Haste em alumínio leve e resistente com sistema de encaixe rápido. Base disponível nos modelos padrão (plástico com preenchimento de água/areia) e premium (metal reforçado). A bandeira utiliza o sistema veste fácil, que encaixa diretamente na haste.",
  },
  {
    titulo: "Personalização",
    conteudo:
      "Impressão por sublimação em alta resolução com cores vibrantes e resistentes ao sol e chuva. Aceita qualquer arte, logo ou imagem em alta resolução. Gabaritos disponíveis para download em PDF.",
  },
  {
    titulo: "Material e Acabamento",
    conteudo:
      "Tecido Bora: leve, com excelente absorção de tinta para sublimação, ideal para ambientes externos. Oxford Blecaute: mais encorpado, não transparece, perfeito para uso frente e verso. Acabamento com costura em overlock nas laterais.",
  },
  {
    titulo: "Extras",
    conteudo:
      "Bandeira reserva: tenha uma segunda bandeira para alternar promoções ou manter sempre uma em uso. Capa protetora: bolsa de transporte para armazenar e transportar seu wind banner com segurança.",
  },
];

export function TechSpecsSection() {
  return (
    <section id="especificacoes" className="bg-gray-50 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          Especificações Técnicas
        </h2>
        <p className="text-sm text-text-muted mb-8">
          Tudo o que você precisa saber sobre o Wind Banner
        </p>
        <div className="max-w-3xl">
          <Accordion items={specs} />
        </div>
      </div>
    </section>
  );
}
