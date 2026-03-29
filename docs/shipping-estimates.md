# Estimativas de Frete — Wind Banner

> **IMPORTANTE**: Os valores abaixo sao ESTIMATIVAS. Substitua pelos valores reais medidos/pesados.
> Apos ajustar, os novos valores serao usados automaticamente no calculo de frete do Melhor Envio.

## CEP de Origem

| Campo | Valor |
|-------|-------|
| CEP | 16204-281 |
| Cidade | Birigui |
| Estado | SP |

## Somente Tecido (sem-base)

| Tamanho | Peso (kg) | Comprimento (cm) | Largura (cm) | Altura (cm) | Obs |
|---------|-----------|-------------------|--------------|-------------|-----|
| P (0,65x1,50m) | 0.25 | 25 | 20 | 5 | Tecido dobrado em saco plastico |
| M (0,65x2,00m) | 0.30 | 30 | 20 | 5 | Tecido dobrado em saco plastico |
| G (0,65x2,50m) | 0.40 | 30 | 25 | 6 | Tecido dobrado em saco plastico |
| GG (0,65x3,00m) | 0.50 | 35 | 25 | 8 | Tecido dobrado em saco plastico |

## Haste + Tecido (haste-tecido)

| Tamanho | Peso (kg) | Comprimento (cm) | Largura (cm) | Altura (cm) | Obs |
|---------|-----------|-------------------|--------------|-------------|-----|
| P (0,65x1,50m) | 1.00 | 100 | 15 | 15 | Haste de aluminio + tecido |
| M (0,65x2,00m) | 1.30 | 110 | 15 | 15 | Haste de aluminio + tecido |
| G (0,65x2,50m) | 1.60 | 120 | 15 | 15 | Haste de aluminio + tecido |
| GG (0,65x3,00m) | 2.00 | 130 | 15 | 15 | Haste de aluminio + tecido |

## Base + Haste + Tecido (base-haste-tecido)

| Tamanho | Peso (kg) | Comprimento (cm) | Largura (cm) | Altura (cm) | Obs |
|---------|-----------|-------------------|--------------|-------------|-----|
| P (0,65x1,50m) | 3.00 | 100 | 25 | 25 | Kit completo com base plastica |
| M (0,65x2,00m) | 3.50 | 110 | 25 | 25 | Kit completo com base plastica |
| G (0,65x2,50m) | 4.00 | 120 | 25 | 25 | Kit completo com base plastica |
| GG (0,65x3,00m) | 5.00 | 130 | 25 | 25 | Kit completo com base plastica |

## Como Atualizar

1. Edite os valores na tabela acima
2. Os mesmos valores estao mapeados em `src/lib/melhorenvio.ts` na funcao `getPackageDimensions()`
3. Apos editar aqui, atualize tambem o codigo correspondente
