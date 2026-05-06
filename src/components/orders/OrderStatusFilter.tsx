"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type StatusFilterValue =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered";

const FILTERS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Aguardando pagamento" },
  { value: "processing", label: "Em producao" },
  { value: "shipped", label: "Enviados" },
  { value: "delivered", label: "Concluidos" },
];

export function matchesFilter(status: string, filter: StatusFilterValue): boolean {
  if (filter === "all") return true;
  if (filter === "processing") return status === "paid" || status === "processing";
  return status === filter;
}

export function readFilter(value: string | null): StatusFilterValue {
  switch (value) {
    case "pending":
    case "processing":
    case "shipped":
    case "delivered":
      return value;
    default:
      return "all";
  }
}

interface OrderStatusFilterProps {
  active: StatusFilterValue;
}

export function OrderStatusFilter({ active }: OrderStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = (value: StatusFilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("status");
    else params.set("status", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="border-b border-border overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {FILTERS.map((f) => {
          const isActive = f.value === active;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
