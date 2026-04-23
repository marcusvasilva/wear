"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadCheckoutConfig, clearCheckoutConfig } from "@/lib/checkout-storage";
import { calcularPreco } from "@/lib/price-calculator";
import type { ConfiguracaoSelecionada, ShippingOption } from "@/types";
import { StepIndicator } from "./StepIndicator";
import { AccountStep } from "./steps/AccountStep";
import { AddressShippingStep } from "./steps/AddressShippingStep";
import { PaymentStep } from "./steps/PaymentStep";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "credit_card" | "pix" | "boleto";

interface AddressData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export function CheckoutStepper() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [config, setConfig] = useState<ConfiguracaoSelecionada | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 output
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Step 2 output
  const [address, setAddress] = useState<AddressData | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [customerCpf, setCustomerCpf] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Step 3 output
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [installments, setInstallments] = useState(1);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load config from localStorage on mount
  useEffect(() => {
    const stored = loadCheckoutConfig();
    setConfig(stored);
  }, []);

  // Auto-advance step 1 if already logged in
  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      setUserName(session.user.name ?? "");
      setUserEmail(session.user.email ?? "");
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  }, [sessionStatus, session, currentStep]);

  const preco = config ? calcularPreco(config) : null;
  const totalComFrete = (preco?.total ?? 0) + (selectedShipping?.price ?? 0);

  const handleAccountComplete = useCallback((user: { name: string; email: string }) => {
    setUserName(user.name);
    setUserEmail(user.email);
    setCurrentStep(2);
  }, []);

  const handleAddressComplete = useCallback((data: {
    address: AddressData;
    addressId: string | null;
    shipping: ShippingOption;
    customerCpf: string;
    customerPhone: string;
  }) => {
    setAddress(data.address);
    setAddressId(data.addressId);
    setSelectedShipping(data.shipping);
    setCustomerCpf(data.customerCpf);
    setCustomerPhone(data.customerPhone);
    setCurrentStep(3);
  }, []);

  const handlePaymentChange = useCallback((data: {
    paymentMethod: PaymentMethod;
    cardData: { number: string; name: string; expiry: string; cvv: string };
    installments: number;
  }) => {
    setPaymentMethod(data.paymentMethod);
    setCardData(data.cardData);
    setInstallments(data.installments);
  }, []);

  const canSubmit =
    currentStep === 3 &&
    sessionStatus === "authenticated" &&
    address !== null &&
    selectedShipping !== null &&
    customerCpf.length === 11 &&
    customerPhone.length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit || !config || !address || !selectedShipping) return;
    setError(null);
    setLoading(true);

    try {
      // Save address if new
      let finalAddressId = addressId;
      if (!finalAddressId) {
        const r = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        });
        const newAddr = await r.json();
        if (!r.ok) throw new Error(newAddr.error || "Erro ao salvar endereco");
        finalAddressId = newAddr.id;
      }

      let cardHash: string | undefined;
      if (paymentMethod === "credit_card") {
        // TODO: integrate pagarme.js for PCI compliance
        cardHash = btoa(JSON.stringify(cardData));
      }

      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo: config.modelo,
          tamanho: config.tamanho,
          base: config.base,
          extras: config.extras,
          arte: config.arte,
          quantidadeArtes: config.quantidadeArtes,
          quantidade: config.quantidade,
          addressId: finalAddressId,
          shippingOptionId: selectedShipping.id,
          shippingPrice: selectedShipping.price,
          shippingService: selectedShipping.name,
          shippingDeadline: selectedShipping.deliveryEstimate,
          paymentMethod,
          cardHash,
          installments,
          customerName: userName,
          customerEmail: userEmail,
          customerCpf,
          customerPhone,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erro ao processar pedido");

      clearCheckoutConfig();
      router.push(`/pedido/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    }
    setLoading(false);
  };

  // Config not loaded yet
  if (config === null) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted mb-4">Configuracao nao encontrada. Volte e selecione seu produto.</p>
        <Link href="/#configurador" className="text-primary font-medium hover:underline">
          Voltar ao configurador
        </Link>
      </div>
    );
  }

  if (!config.modelo || !config.tamanho || !config.base || !config.arte) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted mb-4">Configuracao incompleta. Selecione todas as opcoes.</p>
        <Link href="/#configurador" className="text-primary font-medium hover:underline">
          Voltar ao configurador
        </Link>
      </div>
    );
  }

  const step1Summary = sessionStatus === "authenticated" ? `${userName || userEmail}` : undefined;
  const step2Summary = address && selectedShipping
    ? `${address.cidade}/${address.estado} - ${selectedShipping.name} ${selectedShipping.deliveryEstimate}`
    : undefined;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/#configurador" className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
          <ChevronLeft size={16} /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-text">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step 1: Conta */}
          <StepIndicator
            stepNumber={1}
            title="Conta"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
            summary={step1Summary}
            onEdit={() => setCurrentStep(1)}
          >
            <AccountStep onComplete={handleAccountComplete} />
          </StepIndicator>

          {/* Step 2: Endereco e Frete */}
          <StepIndicator
            stepNumber={2}
            title="Endereco e Frete"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
            summary={step2Summary}
            onEdit={() => setCurrentStep(2)}
          >
            {config.base && config.tamanho && (
              <AddressShippingStep
                base={config.base}
                tamanho={config.tamanho}
                quantidade={config.quantidade}
                onComplete={handleAddressComplete}
                initialCpf={customerCpf}
                initialPhone={customerPhone}
              />
            )}
          </StepIndicator>

          {/* Step 3: Pagamento */}
          <StepIndicator
            stepNumber={3}
            title="Pagamento"
            isActive={currentStep === 3}
            isCompleted={false}
          >
            <PaymentStep
              totalComFrete={totalComFrete}
              onChange={handlePaymentChange}
            />
          </StepIndicator>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            {preco && (
              <CheckoutOrderSummary
                config={config}
                preco={preco}
                shipping={selectedShipping}
                canSubmit={canSubmit}
                loading={loading}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
