"use client";

import { useState } from "react";
import { CreditCard, QrCode, FileText } from "lucide-react";
import { formatCurrency, maskCardNumber, maskExpiry } from "@/lib/utils";

type PaymentMethod = "credit_card" | "pix" | "boleto";

interface PaymentStepProps {
  totalComFrete: number;
  onChange: (data: {
    paymentMethod: PaymentMethod;
    cardData: { number: string; name: string; expiry: string; cvv: string };
    installments: number;
  }) => void;
}

export function PaymentStep({ totalComFrete, onChange }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [installments, setInstallments] = useState(1);

  const updatePayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    onChange({ paymentMethod: method, cardData, installments });
  };

  const updateCard = (data: typeof cardData) => {
    setCardData(data);
    onChange({ paymentMethod, cardData: data, installments });
  };

  const updateInstallments = (n: number) => {
    setInstallments(n);
    onChange({ paymentMethod, cardData, installments: n });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "pix" as const, label: "PIX", icon: QrCode },
          { id: "credit_card" as const, label: "Cartao", icon: CreditCard },
          { id: "boleto" as const, label: "Boleto", icon: FileText },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => updatePayment(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border transition-colors ${
              paymentMethod === id
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-text-muted hover:border-primary/50"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {paymentMethod === "pix" && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-text-muted">
          <p className="font-medium text-text mb-1">Pagamento via PIX</p>
          <p>O QR Code sera gerado apos confirmar o pedido. Valido por 30 minutos.</p>
          <p className="mt-2 text-primary font-medium">5% de desconto no PIX</p>
        </div>
      )}

      {paymentMethod === "credit_card" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Numero do cartao</label>
            <input
              type="text"
              value={maskCardNumber(cardData.number)}
              onChange={(e) => updateCard({ ...cardData, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Nome no cartao</label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => updateCard({ ...cardData, name: e.target.value.toUpperCase() })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Validade</label>
              <input
                type="text"
                value={maskExpiry(cardData.expiry)}
                onChange={(e) => updateCard({ ...cardData, expiry: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="MM/AA"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">CVV</label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => updateCard({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Parcelas</label>
            <select
              value={installments}
              onChange={(e) => updateInstallments(parseInt(e.target.value))}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}x de {formatCurrency(Math.ceil(totalComFrete / n))} sem juros
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {paymentMethod === "boleto" && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-text-muted">
          <p className="font-medium text-text mb-1">Pagamento via Boleto</p>
          <p>O boleto sera gerado apos confirmar o pedido. Vencimento em 3 dias uteis.</p>
          <p className="mt-1">A producao inicia apos a confirmacao do pagamento.</p>
        </div>
      )}
    </div>
  );
}
