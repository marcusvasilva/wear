import { ShieldCheck, CreditCard } from "lucide-react";

export function CheckoutFooter() {
  return (
    <footer className="bg-header-bg text-gray-400 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 Wear Sublimacoes. Todos os direitos reservados.</p>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary" />
            Site Seguro SSL
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CreditCard size={14} />
            Visa · Master · Elo · PIX · Boleto
          </span>
        </div>
      </div>
    </footer>
  );
}
