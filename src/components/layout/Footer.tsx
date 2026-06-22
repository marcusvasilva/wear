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
                  href="https://wa.me/5518997810521"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: (18) 99781-0521
                </a>
              </li>
              <li>
                <a href="mailto:contato@wearsublimacoes.com.br" className="hover:text-white transition-colors">
                  contato@wearsublimacoes.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/wearsublimacoes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Wear Sublimações"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @wearsublimacoes
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
