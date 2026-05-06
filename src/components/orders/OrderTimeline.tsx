import { Check, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";

interface OrderTimelineProps {
  status: string;
}

const STEPS = [
  { key: "received", label: "Recebido" },
  { key: "paid", label: "Pago" },
  { key: "processing", label: "Em producao" },
  { key: "shipped", label: "Enviado" },
  { key: "delivered", label: "Entregue" },
] as const;

const NEGATIVE_STATES: Partial<Record<OrderStatus, string>> = {
  cancelled: "Pedido cancelado",
  refused: "Pagamento recusado",
  refunded: "Pedido reembolsado",
};

function currentStepIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "paid":
      return 1;
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const negativeLabel = NEGATIVE_STATES[status as OrderStatus];

  if (negativeLabel) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
        <XCircle className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <p className="font-semibold text-red-700">{negativeLabel}</p>
          <p className="text-sm text-red-600/80">
            Em caso de duvidas, entre em contato pelo WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = currentStepIndex(status);

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold text-text mb-5 text-sm sm:text-base">
        Acompanhe seu pedido
      </h3>

      {/* Desktop: horizontal */}
      <ol className="hidden sm:flex items-start justify-between">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <li
              key={step.key}
              className="flex-1 flex flex-col items-center relative"
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute top-3 right-1/2 w-full h-0.5 ${
                    isDone || isCurrent ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              <span
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary-light"
                      : "bg-border text-text-muted"
                }`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </span>
              <span
                className={`mt-2 text-xs text-center px-1 ${
                  isFuture ? "text-text-muted" : "text-text font-medium"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="sm:hidden space-y-1">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;
          const isLast = i === STEPS.length - 1;

          return (
            <li key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary-light"
                        : "bg-border text-text-muted"
                  }`}
                >
                  {isDone ? <Check size={14} /> : i + 1}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className={`w-0.5 h-6 ${
                      isDone ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm pt-0.5 ${
                  isFuture ? "text-text-muted" : "text-text font-medium"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
