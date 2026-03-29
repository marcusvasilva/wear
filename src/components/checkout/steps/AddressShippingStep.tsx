"use client";

import { useState, useEffect, useCallback } from "react";
import type { BaseId, TamanhoId, ShippingOption } from "@/types";
import { formatCurrency, maskCpf, maskPhone, maskCep, unmask } from "@/lib/utils";
import { Loader2, MapPin } from "lucide-react";

interface AddressData {
  id?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressShippingStepProps {
  base: BaseId;
  tamanho: TamanhoId;
  quantidade: number;
  onComplete: (data: {
    address: AddressData;
    addressId: string | null;
    shipping: ShippingOption;
    customerCpf: string;
    customerPhone: string;
  }) => void;
  initialCpf?: string;
  initialPhone?: string;
}

export function AddressShippingStep({
  base,
  tamanho,
  quantidade,
  onComplete,
  initialCpf = "",
  initialPhone = "",
}: AddressShippingStepProps) {
  const [address, setAddress] = useState<AddressData>({
    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
  });
  const [savedAddresses, setSavedAddresses] = useState<(AddressData & { id: string })[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [customerCpf, setCustomerCpf] = useState(initialCpf);
  const [customerPhone, setCustomerPhone] = useState(initialPhone);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingFreight, setLoadingFreight] = useState(false);

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSavedAddresses(data); })
      .catch(() => {});
  }, []);

  const lookupCep = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await r.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch {}
    setLoadingCep(false);
  }, []);

  const calcularFrete = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    setLoadingFreight(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const r = await fetch("/api/freight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, base, tamanho, quantidade }),
      });
      const data = await r.json();
      if (Array.isArray(data)) {
        setShippingOptions(data);
      }
    } catch {}
    setLoadingFreight(false);
  }, [base, tamanho, quantidade]);

  const handleCepChange = (value: string) => {
    const digits = unmask(value).slice(0, 8);
    setAddress((prev) => ({ ...prev, cep: digits }));
    setSelectedAddressId(null);
    if (digits.length === 8) {
      lookupCep(digits);
      calcularFrete(digits);
    }
  };

  const selectSavedAddress = (addr: AddressData & { id: string }) => {
    setSelectedAddressId(addr.id);
    setAddress(addr);
    calcularFrete(addr.cep);
  };

  const canContinue =
    selectedShipping &&
    address.logradouro &&
    address.numero &&
    address.bairro &&
    address.cidade &&
    address.estado &&
    unmask(address.cep).length === 8 &&
    unmask(customerCpf).length === 11 &&
    unmask(customerPhone).length >= 10;

  const handleContinue = () => {
    if (!canContinue || !selectedShipping) return;
    onComplete({
      address,
      addressId: selectedAddressId,
      shipping: selectedShipping,
      customerCpf: unmask(customerCpf),
      customerPhone: unmask(customerPhone),
    });
  };

  return (
    <div className="space-y-5">
      {/* CPF + Telefone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text mb-1">CPF</label>
          <input
            type="text"
            value={customerCpf}
            onChange={(e) => setCustomerCpf(maskCpf(e.target.value))}
            placeholder="000.000.000-00"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Telefone</label>
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(maskPhone(e.target.value))}
            placeholder="(18) 99999-9999"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Enderecos salvos */}
      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text flex items-center gap-1.5">
            <MapPin size={14} />
            Enderecos salvos
          </p>
          {savedAddresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => selectSavedAddress(addr)}
              className={`w-full text-left border rounded-lg p-3 text-sm transition-colors ${
                selectedAddressId === addr.id
                  ? "border-primary bg-primary-light"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {addr.logradouro}, {addr.numero} - {addr.bairro}, {addr.cidade}/{addr.estado}
            </button>
          ))}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-text-muted">ou novo endereco</span></div>
          </div>
        </div>
      )}

      {/* Novo endereco */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-text mb-1">CEP</label>
          <div className="relative">
            <input
              type="text"
              value={maskCep(address.cep)}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="00000-000"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {loadingCep && <Loader2 size={16} className="absolute right-3 top-3 animate-spin text-text-muted" />}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text mb-1">Logradouro</label>
          <input type="text" value={address.logradouro} onChange={(e) => setAddress((p) => ({ ...p, logradouro: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Numero</label>
          <input type="text" value={address.numero} onChange={(e) => setAddress((p) => ({ ...p, numero: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Complemento</label>
          <input type="text" value={address.complemento} onChange={(e) => setAddress((p) => ({ ...p, complemento: e.target.value }))} placeholder="Apto, sala..."
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Bairro</label>
          <input type="text" value={address.bairro} onChange={(e) => setAddress((p) => ({ ...p, bairro: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Cidade</label>
          <input type="text" value={address.cidade} onChange={(e) => setAddress((p) => ({ ...p, cidade: e.target.value }))}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Estado</label>
          <input type="text" value={address.estado} onChange={(e) => setAddress((p) => ({ ...p, estado: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="SP" maxLength={2}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      </div>

      {/* Frete */}
      {loadingFreight ? (
        <div className="flex items-center gap-2 text-sm text-text-muted py-3">
          <Loader2 size={16} className="animate-spin" /> Calculando frete...
        </div>
      ) : shippingOptions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text">Opcoes de envio</p>
          {shippingOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedShipping(opt)}
              className={`w-full flex items-center justify-between border rounded-lg p-3 text-sm transition-colors ${
                selectedShipping?.id === opt.id
                  ? "border-primary bg-primary-light"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div>
                <span className="font-medium text-text">{opt.company} - {opt.name}</span>
                <span className="text-text-muted ml-2">{opt.deliveryEstimate}</span>
              </div>
              <span className="font-semibold text-text">{formatCurrency(opt.price)}</span>
            </button>
          ))}
        </div>
      ) : address.cep.length === 8 && !loadingCep ? (
        <p className="text-sm text-text-muted">Nenhuma opcao de frete disponivel para este CEP</p>
      ) : null}

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors"
      >
        Continuar para Pagamento
      </button>
    </div>
  );
}
