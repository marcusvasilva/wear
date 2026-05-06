import { ShieldCheck, Lock, Truck, BadgeCheck, type LucideIcon } from "lucide-react";

interface Badge {
  icon: LucideIcon;
  label: string;
}

const BADGES: Badge[] = [
  { icon: ShieldCheck, label: "Compra Segura SSL" },
  { icon: Lock, label: "Pagamento Pagar.me" },
  { icon: Truck, label: "Frete Melhor Envio" },
  { icon: BadgeCheck, label: "Garantia 7 dias" },
];

interface TrustBadgesProps {
  variant?: "compact" | "stacked";
}

export function TrustBadges({ variant = "compact" }: TrustBadgesProps) {
  if (variant === "stacked") {
    return (
      <ul className="space-y-2">
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <li
              key={b.label}
              className="flex items-center gap-2 text-xs text-text-muted"
            >
              <Icon size={14} className="text-primary shrink-0" />
              {b.label}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-text-muted">
      {BADGES.map((b) => {
        const Icon = b.icon;
        return (
          <span key={b.label} className="inline-flex items-center gap-1.5">
            <Icon size={14} className="text-primary" />
            {b.label}
          </span>
        );
      })}
    </div>
  );
}
