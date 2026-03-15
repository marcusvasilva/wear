# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page de venda de Wind Banner personalizado para a Wear Sublimações. Funciona como um configurador de produto visual (referência UX: Printi windisplay) que redireciona para o checkout do e-commerce da Wear (plataforma Magazord).

## Commands

```bash
npm run dev       # Dev server (porta 3000)
npm run build     # Build de produção
npm run start     # Produção local
npm run lint      # ESLint
```

## Architecture

- **Framework:** Next.js 14+ (App Router, src/ directory), TypeScript strict, Tailwind CSS
- **Deploy:** Vercel
- **Configurador:** Step-by-step (Modelo → Tamanho → Tecido → Base → Extras → Quantidade) com sidebar sticky de resumo
- **State:** Hook `useConfigurator` (src/hooks/useConfigurator.ts) gerencia toda a seleção e cálculo de preço
- **Preços:** Armazenados em centavos em src/data/prices.ts, formatados com `formatCurrency()` de src/lib/utils.ts
- **Checkout:** Redireciona para Magazord via URL montada em src/lib/magazord.ts. IDs mapeados em src/data/magazord-mapping.ts
- **PRD completo:** docs/PRD.md

## Design System (Wear Sublimações)

Design tokens definidos em docs/design-tokens.json e configurados no Tailwind via src/app/globals.css (@theme).

### Cores principais
- `primary` (#2ECC40) — verde Wear, todos os CTAs e destaques
- `header-bg` (#1B1B1B) — header/top bar/footer escuros
- `price-red` (#E53935) — preços e badges de desconto
- `text` (#333333), `text-muted` (#999999), `border` (#E0E0E0)

### Componentes visuais
- Cards: borda border, border-radius 12px, shadow suave. Selecionado: borda primary, fundo primary-light (#E8F8EA)
- Botão primário: bg primary, texto branco, bold, rounded-lg
- Header escuro com logo branco + WhatsApp floating button no canto inferior direito

### Tipografia
- Inter (via next/font/google). Pesos: 400 body, 500 labels, 600 subtítulos, 700 títulos/CTAs/preços

## Code Rules

- Componentes funcionais com TypeScript tipado (types em src/types/index.ts)
- PascalCase (componentes), camelCase (funções/variáveis)
- Hooks customizados com prefixo "use" em src/hooks/
- Mobile-first responsive (sm → md → lg → xl)
- Imagens: next/image com sizes e placeholder="blur" quando possível
- Preços: centavos internamente, `formatCurrency()` para exibição
- Não usar em dash (—) em textos de ads/captions
- Textos em português brasileiro
- Acessibilidade: aria-labels em botões de ação, alt em imagens

## Key References

- Design: https://www.wearsublimacoes.com.br
- UX configurador: https://www.printi.com.br/windisplay/
- API Magazord: https://docs.api.magazord.com.br/
- WhatsApp atendimento: (18) 99807-4936
