import { Truck, Phone, CreditCard } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-header-bg text-white text-xs">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Truck size={14} />
            Envios Nacionais e Internacionais
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <CreditCard size={14} />
            Até 6x sem juros
          </span>
        </div>
        <a
          href="https://wa.me/5518998074936"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <Phone size={14} />
          (18) 99807-4936
        </a>
      </div>
    </div>
  );
}
