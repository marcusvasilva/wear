import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-header-bg text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/logos/logo-wear-white.png"
              alt="Wear Sublimações"
              width={140}
              height={40}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed">
              Sublimação de alta qualidade para Wind Banners. Produção própria, impressão premium e envio rápido.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre a Wear</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Troca</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/5518998074936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: (18) 99807-4936
                </a>
              </li>
              <li>
                <a href="mailto:contato@wearsublimacoes.com.br" className="hover:text-white transition-colors">
                  contato@wearsublimacoes.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Wear Sublimações. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Política de Privacidade</span>
            <span>Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
