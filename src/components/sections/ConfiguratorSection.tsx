"use client";

import { useConfigurator } from "@/hooks/useConfigurator";
import { modelos, tamanhos, bases } from "@/data/products";
import { StepSelector } from "@/components/configurator/StepSelector";
import { OptionCard } from "@/components/configurator/OptionCard";
import { QuantitySelector } from "@/components/configurator/QuantitySelector";
import { ArteStep } from "@/components/configurator/ArteStep";
import { OrderSummary } from "@/components/configurator/OrderSummary";
import type { ModeloId, TamanhoId, BaseId } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ConfiguratorSection() {
  const {
    config,
    preco,
    isComplete,
    setModelo,
    setTamanho,
    setBase,
    setArte,
    setQuantidadeArtes,
    setQuantidade,
  } = useConfigurator();

  return (
    <section id="configurador" className="bg-gray-50 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-2">Monte seu Wind Banner</h2>
        <p className="text-sm text-text-muted mb-8">
          Configure e compre seu Wind Banner em poucos passos
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Modelo */}
            <StepSelector numero={1} titulo="Modelo" descricao="Escolha o formato do seu Wind Banner">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {modelos.map((modelo) => (
                  <OptionCard
                    key={modelo.id}
                    nome={modelo.nome}
                    descricao={modelo.descricao}
                    imagem={modelo.imagem}
                    selected={config.modelo === modelo.id}
                    onClick={() => setModelo(modelo.id as ModeloId)}
                  />
                ))}
              </div>
            </StepSelector>

            {/* Step 2: Tamanho */}
            <StepSelector numero={2} titulo="Tamanho" descricao="Selecione o tamanho ideal">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tamanhos.map((tamanho) => (
                  <OptionCard
                    key={tamanho.id}
                    nome={tamanho.nome}
                    descricao={tamanho.dimensoes}
                    imagem={tamanho.imagem}
                    selected={config.tamanho === tamanho.id}
                    onClick={() => setTamanho(tamanho.id as TamanhoId)}
                  />
                ))}
              </div>
            </StepSelector>

            {/* Step 3: Base e Estrutura */}
            <StepSelector numero={3} titulo="Base e Estrutura" descricao="Escolha como montar seu Wind Banner">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bases.map((base) => {
                  const imagemBase =
                    config.modelo && base.imagensPorModelo
                      ? base.imagensPorModelo[config.modelo]
                      : base.imagem;
                  return (
                    <OptionCard
                      key={base.id}
                      nome={base.nome}
                      descricao={
                        base.precoAdicional > 0
                          ? `${base.descricao} (+${formatCurrency(base.precoAdicional)})`
                          : base.descricao
                      }
                      imagem={imagemBase}
                      selected={config.base === base.id}
                      onClick={() => setBase(base.id as BaseId)}
                    />
                  );
                })}
              </div>
            </StepSelector>

            {/* Step 4: Arte e Personalizacao */}
            <StepSelector
              numero={4}
              titulo="Arte e Personalização"
              descricao="Você envia a arte ou a gente cria pra você"
            >
              <ArteStep
                arte={config.arte}
                quantidadeArtes={config.quantidadeArtes}
                onChangeArte={setArte}
                onChangeQuantidadeArtes={setQuantidadeArtes}
              />
            </StepSelector>

            {/* Step 5: Quantidade */}
            <StepSelector numero={5} titulo="Quantidade" descricao="Quantidade maior = desconto maior">
              <QuantitySelector
                quantidade={config.quantidade}
                precoUnitario={preco.precoBase + preco.precoAdicionalBase + preco.precoExtras}
                onChange={setQuantidade}
              />
            </StepSelector>
          </div>

          {/* Sidebar sticky */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <OrderSummary config={config} preco={preco} isComplete={isComplete} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
