import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-[72px]">
        <Link href="/">
          <Image
            src="/logos/logo-wear-black.png"
            alt="Wear Sublimações"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text">
          <a href="#configurador" className="hover:text-primary transition-colors">
            Configurador
          </a>
          <a href="#especificacoes" className="hover:text-primary transition-colors">
            Especificações
          </a>
          <a href="#avaliacoes" className="hover:text-primary transition-colors">
            Avaliações
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>
        <a
          href="#configurador"
          className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          Comprar
        </a>
      </div>
    </header>
  );
}
