import { Accordion } from "@/components/ui/Accordion";

const faqItems = [
  {
    titulo: "Quanto tempo leva para receber meu Wind Banner?",
    conteudo:
      "A produção leva até 48 horas úteis após a aprovação da arte. O prazo de entrega depende da região e da transportadora escolhida, geralmente entre 3 a 10 dias úteis.",
  },
  {
    titulo: "Posso enviar minha arte depois de comprar?",
    conteudo:
      "Sim! Você pode finalizar a compra e enviar sua arte depois por e-mail ou WhatsApp. Nossa equipe vai conferir e aprovar a arte antes da produção.",
  },
  {
    titulo: "Qual a diferença entre os tecidos Bora e Oxford?",
    conteudo:
      "O Tecido Bora é mais leve e ideal para sublimação com cores vibrantes. O Oxford Blecaute é mais grosso e não transparece, sendo ideal para uso frente e verso com artes diferentes.",
  },
  {
    titulo: "O Wind Banner resiste a chuva e sol?",
    conteudo:
      "Sim! A impressão por sublimação é resistente a raios UV e água. As cores não desbotam com exposição ao sol. Recomendamos recolher o banner em caso de ventos muito fortes.",
  },
  {
    titulo: "Preciso comprar a base junto com a bandeira?",
    conteudo:
      "Não necessariamente. Se você já possui uma haste compatível, pode comprar apenas o tecido (bandeira). Caso contrário, recomendamos adquirir o kit com haste e base.",
  },
  {
    titulo: "Vocês fazem para todo o Brasil?",
    conteudo:
      "Sim! Fazemos envios para todo o Brasil e também internacionalmente. O frete é calculado por CEP no momento da compra.",
  },
  {
    titulo: "Como funciona o desconto por quantidade?",
    conteudo:
      "Oferecemos descontos progressivos: 5% a partir de 5 unidades, 10% a partir de 10, 15% a partir de 20 e 20% a partir de 50 unidades. Ideal para empresas e eventos.",
  },
  {
    titulo: "Em quais formatos posso enviar minha arte?",
    conteudo:
      "Aceitamos arquivos em PDF, AI, PSD, PNG ou JPG em alta resolução (mínimo 150 DPI). Disponibilizamos gabaritos para download em cada modelo e tamanho.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-gray-50 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          Perguntas Frequentes
        </h2>
        <p className="text-sm text-text-muted mb-8">
          Tire suas dúvidas sobre Wind Banners
        </p>
        <div className="max-w-3xl">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
