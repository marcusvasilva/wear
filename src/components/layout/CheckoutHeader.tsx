import Image from "next/image";
import Link from "next/link";
import { Lock, Phone } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="bg-header-bg border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-[72px]">
        <Link href="/" aria-label="Voltar para a pagina inicial">
          <Image
            src="/logos/logo-wear-white.png"
            alt="Wear Sublimacoes"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 text-white">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium">
            <Lock size={16} className="text-primary" />
            Compra Segura
          </span>

          <a
            href="https://wa.me/5518998074936"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
            aria-label="Atendimento WhatsApp"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">(18) 99807-4936</span>
            <span className="sm:hidden">Ajuda</span>
          </a>
        </div>
      </div>
    </header>
  );
}
