# PRD — Landing Page Wind Banner | Wear Sublimações

## 1. Visão Geral do Projeto

**Projeto:** Landing Page de venda de Wind Banner personalizado para a Wear Sublimações.

**Objetivo:** Criar uma LP dedicada à venda de Wind Banners com configurador de produto visual (inspirado na UX do Printi windisplay), seguindo o design system do e-commerce atual da Wear (Magazord), e finalizando o pedido no checkout nativo do Magazord.

**Referências principais:**
- Design system: https://www.wearsublimacoes.com.br (plataforma Magazord)
- UX do configurador: https://www.printi.com.br/windisplay/
- API do e-commerce: https://docs.api.magazord.com.br/
- Produto atual: https://www.wearsublimacoes.com.br/bandeira-para-wind-banner-somente-tecido-escolha-o-tema-aqui

---

## 2. Análise do Site Atual (Wear Sublimações)

### 2.1 Design System Identificado

**Paleta de cores:**
- Header/top bar: `#1B1B1B` (preto escuro) com textos brancos
- Barra de navegação: `#FFFFFF` fundo branco, textos `#333333`
- Cor de destaque / CTA principal: `#2ECC40` (verde vibrante — presente no logo e em botões)
- Cor secundária: `#1A73E8` (azul — links e ícones informativos)
- Background geral: `#FFFFFF`
- Textos de preço: `#E53935` (vermelho) para preço promocional, `#999999` para preço riscado
- Tags de desconto: badges vermelhos/laranjas

**Tipografia:**
- Font principal do site Magazord: Inter / sistema sans-serif
- Títulos de seção: bold, uppercase em alguns casos
- Preços: bold, tamanho grande

**Componentes visuais:**
- Header com: logo WEAR (tipografia customizada bold), barra de busca centralizada, ícones de conta/carrinho/favoritos
- Top bar fina escura com links de atendimento e frete
- Cards de produto com: imagem, título, preço De/Por, avaliação (estrelas), badge de desconto
- Banners full-width com CTAs
- Seção de categorias com ícones circulares
- Footer com logo Magazord, selos de segurança, formas de pagamento, links institucionais
- WhatsApp floating button

**Trust signals:**
- "Envios Nacionais e Internacionais"
- "Parcelamento em até 6x sem juros"
- "Compre com 100% de segurança"
- Cashback 3%
- Selos Google, formas de pagamento (Visa, Master, etc.)

### 2.2 Produto Atual — Wind Banner

**Produto analisado:** Bandeira Para Wind Banner Somente Tecido "Escolha o Tema Aqui"
- Material: Tecido Bora
- Acabamento: Costura em Overlock nas laterais
- Impressão: Sublimada com alta resolução
- Medida padrão: 0,75m largura × 2,00m altura
- Tipo: Veste fácil (encaixa na haste)
- NÃO acompanha suporte (haste e base)
- Efeitos 3D e Glitter nos fundos com brilho
- Envio em até 48h úteis

---

## 3. Análise da Referência (Printi Windisplay)

### 3.1 Fluxo de Configuração (a ser adaptado)

O Printi usa um configurador step-by-step com cards visuais para cada opção:

1. **Modelo** — Vela, Asa, Gota (cards com imagem de silhueta)
2. **Formato/Tamanho** — PP (1m), P (2m), M (3m), G (4m), GG (5m) — cards com ilustração proporcional
3. **Tecido** — Tipo de material (ex: Oxford Blecaute)
4. **Base e Estrutura** — Sem base, Padrão (Preto), Premium (Preto)
5. **Extras** — Sem extras, acessórios adicionais
6. **Quantidade** — Seletor com desconto progressivo

### 3.2 Elementos de UX a Replicar
- Cards visuais com thumbnail + nome para cada opção
- "Ver mais opções" expansível
- Resumo lateral fixo (sticky) com: quantidade, preço unitário, total, simulação de frete, botão Comprar
- Seção de Gabaritos para download
- Trust signals (garantia, upload de arte posterior)
- Vídeo demonstrativo do produto

---

## 4. Integração com Magazord

### 4.1 Estratégia de Integração

A API do Magazord (docs.api.magazord.com.br) oferece endpoints para:
- Consulta de produtos e variações
- Gerenciamento de carrinho (listagem, itens)
- Consulta de pedidos

**Abordagem recomendada (do mais simples ao mais complexo):**

#### Opção A — Redirect com Link de Carrinho (RECOMENDADA para MVP)
O Magazord permite **gerar links de carrinho** que adicionam produtos automaticamente. O fluxo seria:
1. Usuário configura o wind banner na LP
2. Ao clicar "Comprar", a LP gera a URL do Magazord com o produto/variação correta
3. Redirect para `wearsublimacoes.com.br/checkout` com item no carrinho
4. Checkout completo acontece no Magazord nativo

**Formato provável do link:**
```
https://www.wearsublimacoes.com.br/checkout?add=PRODUCT_ID&qty=QUANTIDADE
```

> ⚠️ **AÇÃO NECESSÁRIA:** Validar com suporte Magazord o formato exato da URL de add-to-cart. Alternativas: usar a funcionalidade "Gerar Link de Carrinho" do painel, ou utilizar a API de carrinho.

#### Opção B — API de Carrinho
Usar a API para criar um carrinho programaticamente:
- `POST` para criar carrinho com itens
- Redirect para checkout com ID do carrinho

**Endpoints relevantes:**
- `GET /carrinho` — Listar carrinhos
- `GET /carrinho/{id}/itens` — Detalhes do carrinho
- Endpoints de criação dependem de autenticação via API Key + Password

> ⚠️ **AÇÃO NECESSÁRIA:** Solicitar credenciais de API ao suporte Magazord (ApiKey + Password) para o endpoint `https://wearsublimacoes.painel.magazord.com.br`

### 4.2 Mapeamento de Produtos/Variações

Será necessário mapear no Magazord:
- Cada combinação de configuração (modelo × tamanho × tecido × base) como uma **variação de produto** ou **produto individual**
- Obter os IDs de cada variação para usar nos links de carrinho

> ⚠️ **AÇÃO NECESSÁRIA:** Levantar no painel Magazord todos os IDs de produtos/variações de Wind Banner, ou criar novos se necessário.

---

## 5. Especificação da Landing Page

### 5.1 Stack Técnica

```
Framework:    Next.js 14+ (App Router)
Estilização:  Tailwind CSS
Linguagem:    TypeScript
Deploy:       Vercel (ou servidor próprio)
Domínio:      wearsublimacoes.com.br/windbanner (subpath) ou windbanner.wearsublimacoes.com.br (subdomínio)
```

### 5.2 Estrutura de Seções da LP

```
┌─────────────────────────────────────────────┐
│  TOP BAR (frete, atendimento, links)        │
├─────────────────────────────────────────────┤
│  HEADER (logo Wear + nav simplificada)      │
├─────────────────────────────────────────────┤
│  HERO SECTION                               │
│  - Headline: "Wind Banner Personalizado"    │
│  - Subheadline + proposta de valor          │
│  - Vídeo/imagem hero do produto             │
│  - CTA âncora para o configurador           │
├─────────────────────────────────────────────┤
│  TRUST BAR                                  │
│  - Envio em 48h, Parcelamento 6x, etc.     │
├─────────────────────────────────────────────┤
│  GALERIA DE MODELOS                         │
│  - Fotos/renders dos 4 modelos em uso       │
│  - Carrossel ou grid                        │
├─────────────────────────────────────────────┤
│  CONFIGURADOR DE PRODUTO (seção principal)  │
│  ┌──────────────────────┬──────────────────┐│
│  │  Steps de config     │  Resumo sticky   ││
│  │  1. Modelo           │  - Preview       ││
│  │  2. Tamanho          │  - Preço unit.   ││
│  │  3. Tecido           │  - Qty selector  ││
│  │  4. Base/Estrutura   │  - Total         ││
│  │  5. Extras           │  - Frete (CEP)   ││
│  │  6. Quantidade       │  - BTN Comprar   ││
│  └──────────────────────┴──────────────────┘│
├─────────────────────────────────────────────┤
│  GABARITOS / ENVIO DE ARTE                  │
│  - Download de gabaritos por modelo/tamanho │
│  - Info: arte pode ser enviada depois       │
├─────────────────────────────────────────────┤
│  FICHA TÉCNICA                              │
│  - Material, impressão, acabamento, etc.    │
├─────────────────────────────────────────────┤
│  SOCIAL PROOF                               │
│  - Avaliações de clientes                   │
│  - Fotos de clientes com wind banners       │
├─────────────────────────────────────────────┤
│  FAQ                                        │
│  - Accordion com perguntas frequentes       │
├─────────────────────────────────────────────┤
│  FOOTER (mesma identidade do site Wear)     │
│  - Links, CNPJ, selos, pagamento, Magazord │
└─────────────────────────────────────────────┘
```

### 5.3 Configurador — Opções Detalhadas

#### Step 1: Modelo
| Opção | Imagem | Descrição |
|-------|--------|-----------|
| Pena | silhueta pena | Formato clássico curvo |
| Faca | silhueta faca | Formato retangular/reto |
| Gota | silhueta gota | Formato arredondado |
| Vela | silhueta vela | Formato pontiagudo |

#### Step 2: Tamanho
| Tamanho | Dimensões aprox. | Label |
|---------|-----------------|-------|
| P | 0,65m × 1,50m | Pequeno |
| M | 0,65m × 2,00m | Médio |
| G | 0,65m × 2,50m | Grande |
| GG | 0,65m × 3,00m | Extra Grande |

> ⚠️ **AÇÃO NECESSÁRIA:** Confirmar com a Wear quais tamanhos exatos estão disponíveis e quais são produzidos.

#### Step 3: Tecido
| Opção | Descrição |
|-------|-----------|
| Tecido Bora (padrão) | Sublimação, alta resolução, tipo veste fácil |
| Oxford Blecaute | Mais grosso, não transparece (se disponível) |

> ⚠️ **AÇÃO NECESSÁRIA:** Confirmar com a Wear quais tecidos estão disponíveis.

#### Step 4: Base e Estrutura
| Opção | Descrição | Preço adicional |
|-------|-----------|----------------|
| Sem base (somente tecido) | Apenas a bandeira | R$ 0 |
| Kit Haste + Base padrão | Alumínio + base plástica preta | R$ XX |
| Kit Premium | Alumínio + base premium | R$ XX |

> ⚠️ **AÇÃO NECESSÁRIA:** Confirmar preços de kits com a Wear.

#### Step 5: Extras
| Opção | Descrição |
|-------|-----------|
| Sem extras | — |
| Bandeira reserva | +1 tecido adicional |
| Capa protetora | Bolsa de transporte |

> ⚠️ **AÇÃO NECESSÁRIA:** Confirmar quais extras a Wear oferece.

#### Step 6: Quantidade
- Seletor numérico (1-50+)
- Exibir tabela de desconto progressivo (se houver)

### 5.4 Resumo / Sidebar Sticky

```
┌─────────────────────────────────────┐
│  🖼️ Preview visual do wind banner  │
│     (imagem muda conforme seleção)  │
│                                     │
│  Modelo: Pena                       │
│  Tamanho: M (0,65 × 2,00m)         │
│  Tecido: Bora                       │
│  Base: Kit Padrão                   │
│  Extras: Nenhum                     │
│                                     │
│  Quantidade: 2                      │
│  Preço unitário: R$ XX,XX           │
│  ─────────────────────              │
│  TOTAL: R$ XXX,XX                   │
│  ou 6x de R$ XX,XX s/ juros        │
│                                     │
│  📦 Simular frete: [CEP___] [OK]   │
│                                     │
│  [ 🛒 COMPRAR AGORA ]              │
│  (redireciona para checkout Wear)   │
│                                     │
│  💬 Dúvidas? Fale no WhatsApp      │
└─────────────────────────────────────┘
```

### 5.5 Responsividade

- **Desktop:** Layout 2 colunas (configurador + resumo sticky)
- **Tablet:** Layout 1 coluna, resumo fixo no bottom
- **Mobile:** Layout 1 coluna, resumo como bottom sheet fixo com preço e botão "Comprar"

---

## 6. Dados e Preços

### 6.1 Tabela de Preços (exemplo — preencher com dados reais)

```typescript
// Estrutura de dados sugerida
interface WindBannerConfig {
  modelos: {
    id: string;        // "pena" | "faca" | "gota" | "vela"
    nome: string;
    imagem: string;
    gabarito_url: string;
  }[];
  
  tamanhos: {
    id: string;        // "p" | "m" | "g" | "gg"
    nome: string;
    dimensoes: string; // "0,65m × 2,00m"
    imagem: string;
  }[];
  
  tecidos: {
    id: string;
    nome: string;
    descricao: string;
    imagem: string;
  }[];
  
  bases: {
    id: string;
    nome: string;
    descricao: string;
    preco_adicional: number; // em centavos
    imagem: string;
  }[];
  
  extras: {
    id: string;
    nome: string;
    preco: number;
    imagem: string;
  }[];
  
  // Mapa de preços: modelo × tamanho × tecido → preço base
  precos: Record<string, number>; // key: "pena-m-bora" → valor em centavos
  
  // Mapa para IDs do Magazord
  magazord_ids: Record<string, string>; // key da combinação → product_id ou variation_id
  
  // Descontos por quantidade
  descontos: {
    min_qty: number;
    desconto_percentual: number;
  }[];
}
```

> ⚠️ **AÇÃO NECESSÁRIA:** Montar esta tabela com os preços reais de cada combinação e mapear os IDs do Magazord.

---

## 7. Fluxo do Usuário (User Journey)

```
1. Usuário acessa a LP (via anúncio, link bio, QR code, etc.)
2. Vê o hero com vídeo/foto do wind banner
3. Rola até o configurador
4. Seleciona: Modelo → Tamanho → Tecido → Base → Extras → Quantidade
5. Vê o resumo atualizar em tempo real (preço, preview)
6. (Opcional) Simula frete pelo CEP
7. Clica em "Comprar Agora"
8. LP monta a URL com o produto/variação correta no Magazord
9. Redirect para checkout do Magazord (wearsublimacoes.com.br/checkout)
10. Cliente finaliza pagamento no Magazord
11. Após checkout, recebe instrução para enviar a arte (email ou WhatsApp)
```

---

## 8. O que Precisa Ser Feito (Checklist)

### 8.1 Antes de Codar (com a Wear)

- [ ] **Definir catálogo completo:** Quais modelos, tamanhos, tecidos, bases e extras serão vendidos
- [ ] **Tabela de preços:** Preço de cada combinação
- [ ] **Fotografias/renders:** Imagens de cada modelo de wind banner (frente, em uso, detalhe)
- [ ] **Gabaritos:** Arquivos de gabarito para download (PDF/AI/PSD) por modelo e tamanho
- [ ] **Logos da Wear:** SVG do logo principal + versões (branco, colorido, monocromático)
- [ ] **Credenciais Magazord:** Solicitar API Key + Password ao suporte Magazord
- [ ] **IDs dos produtos no Magazord:** Mapear cada variação de wind banner (ou criar novos)
- [ ] **Validar URL de add-to-cart:** Confirmar com Magazord o formato exato para adicionar itens ao carrinho via URL
- [ ] **Domínio/subdomínio:** Decidir se será `/windbanner` (subpath via proxy) ou `windbanner.wearsublimacoes.com.br` (subdomínio)
- [ ] **Textos de FAQ:** Coletar as dúvidas mais frequentes
- [ ] **Depoimentos/fotos de clientes:** Para seção de social proof

### 8.2 Setup do Projeto (Claude Code)

```bash
# 1. Criar a pasta do projeto
mkdir lp-windbanner-wear
cd lp-windbanner-wear

# 2. Inicializar o Claude Code
claude /init

# 3. Claude Code vai criar o CLAUDE.md — completar com as instruções abaixo
```

### 8.3 Estrutura de Pastas Sugerida

```
lp-windbanner-wear/
├── CLAUDE.md                    # Instruções para o Claude Code
├── docs/
│   ├── PRD.md                   # Este documento
│   ├── design-tokens.json       # Cores, fontes, espaçamentos
│   └── product-data.json        # Catálogo de opções e preços
├── public/
│   ├── logos/
│   │   ├── wear-logo.svg
│   │   ├── wear-logo-white.svg
│   │   └── wear-icon.svg
│   ├── products/
│   │   ├── modelo-pena.png
│   │   ├── modelo-faca.png
│   │   ├── modelo-gota.png
│   │   ├── modelo-vela.png
│   │   ├── tamanho-p.png
│   │   ├── tamanho-m.png
│   │   ├── tamanho-g.png
│   │   ├── tamanho-gg.png
│   │   ├── base-sem.png
│   │   ├── base-padrao.png
│   │   └── base-premium.png
│   ├── gabaritos/
│   │   └── (PDFs de gabarito por modelo/tamanho)
│   ├── hero/
│   │   ├── hero-desktop.webp
│   │   ├── hero-mobile.webp
│   │   └── video-windbanner.mp4
│   └── social-proof/
│       └── (fotos de clientes)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # LP principal
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── ConfiguratorSection.tsx
│   │   │   ├── GabaritoSection.tsx
│   │   │   ├── TechSpecsSection.tsx
│   │   │   ├── SocialProofSection.tsx
│   │   │   └── FAQSection.tsx
│   │   ├── configurator/
│   │   │   ├── StepSelector.tsx      # Componente genérico de step
│   │   │   ├── OptionCard.tsx        # Card de seleção visual
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── OrderSummary.tsx      # Sidebar sticky
│   │   │   ├── FreightCalculator.tsx
│   │   │   └── BuyButton.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Accordion.tsx
│   │       └── WhatsAppFloat.tsx
│   ├── data/
│   │   ├── products.ts           # Catálogo de opções
│   │   ├── prices.ts             # Tabela de preços
│   │   └── magazord-mapping.ts   # IDs do Magazord
│   ├── hooks/
│   │   ├── useConfigurator.ts    # State management do configurador
│   │   └── useFreight.ts         # Cálculo de frete
│   ├── lib/
│   │   ├── magazord.ts           # Funções de integração Magazord
│   │   ├── price-calculator.ts   # Lógica de cálculo de preço
│   │   └── utils.ts
│   └── types/
│       └── index.ts              # Tipos TypeScript
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

### 8.4 Conteúdo do CLAUDE.md

```markdown
# Wind Banner LP — Wear Sublimações

## Sobre o Projeto
Landing page de venda de Wind Banner personalizado para a Wear Sublimações.
A LP funciona como um configurador de produto visual que redireciona
para o checkout do e-commerce da Wear (plataforma Magazord).

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS

## Design System
Seguir a identidade visual do site wearsublimacoes.com.br:
- Cor primária (CTA/botões): #2ECC40 (verde Wear)
- Cor de fundo: #FFFFFF
- Cor de texto: #333333
- Cor de preço: #E53935
- Cor do header: #1B1B1B
- Font: Inter (ou sistema sans-serif)
- Bordas arredondadas: rounded-lg (8px)
- Sombras suaves nos cards

## Referência de UX
O configurador de produto segue a UX do Printi windisplay
(https://www.printi.com.br/windisplay/):
- Steps visuais com cards de seleção
- Resumo lateral sticky
- Cálculo de preço em tempo real

## Integração
A LP redireciona para o checkout Magazord ao final da compra.
Ver /docs/PRD.md para detalhes da integração.

## Arquivos Importantes
- /docs/PRD.md — Product Requirements Document completo
- /docs/design-tokens.json — Tokens de design
- /docs/product-data.json — Catálogo de produtos e preços
- /src/data/ — Dados estáticos (produtos, preços, mapeamento Magazord)

## Regras de Código
- Componentes funcionais com TypeScript
- Nomes de componentes em PascalCase
- Hooks customizados com prefixo "use"
- Mobile-first responsive design
- Imagens otimizadas com next/image
- Sem uso de em dash (—) em textos de ads/captions
- Preços sempre em centavos internamente, formatados com Intl.NumberFormat('pt-BR')

## Comandos
- `npm run dev` — Development server
- `npm run build` — Build de produção
- `npm run lint` — Lint do código
```

---

## 9. Arquivos que Você Precisa Providenciar

### OBRIGATÓRIOS (antes de começar o dev)
| Arquivo | Formato | Descrição |
|---------|---------|-----------|
| Logo Wear principal | SVG | Logo escuro (para fundo branco) |
| Logo Wear branco | SVG | Logo claro (para header escuro e footer) |
| Ícone/favicon Wear | SVG/PNG | Favicon do site |
| Fotos dos modelos | PNG/WebP | Pena, Faca, Gota, Vela — foto real ou render |
| Fotos de tamanhos | PNG/WebP | Ilustração com referência de proporção |
| Fotos de bases | PNG/WebP | Sem base, base padrão, base premium |
| Hero image/vídeo | WebP/MP4 | Foto principal ou vídeo do wind banner em uso |
| Tabela de preços | JSON/planilha | Preço de cada combinação modelo×tamanho×base |
| IDs Magazord | JSON/planilha | ID de produto/variação para cada combinação |
| Gabaritos | PDF | Arquivo de gabarito por modelo e tamanho |

### DESEJÁVEIS (podem vir depois)
| Arquivo | Formato | Descrição |
|---------|---------|-----------|
| Fotos de clientes | JPG/WebP | Wind banners em uso por clientes reais |
| Depoimentos | Texto | Reviews de clientes |
| Vídeo institucional | MP4 | Vídeo da produção/qualidade |
| Ícones de trust | SVG | Ícones customizados (frete, parcelamento, segurança) |

---

## 10. Passo a Passo para Iniciar no Claude Code

```bash
# 1. Crie a pasta e entre nela
mkdir lp-windbanner-wear && cd lp-windbanner-wear

# 2. Inicialize o Claude Code
claude

# 3. Peça para ele ler o PRD
> Leia o arquivo /docs/PRD.md e use como base para todo o projeto.

# 4. Peça para criar o CLAUDE.md
> Crie o CLAUDE.md com base nas instruções do PRD, seção 8.4

# 5. Peça para criar a estrutura do projeto
> Inicialize um projeto Next.js com TypeScript e Tailwind CSS
> seguindo a estrutura de pastas do PRD, seção 8.3

# 6. Peça para criar os design tokens
> Crie o arquivo design-tokens.json e configure o tailwind.config.ts
> com as cores e tokens do design system da Wear (seção 2.1 do PRD)

# 7. Peça para criar os componentes base
> Crie os componentes de layout (TopBar, Header, Footer) seguindo
> a identidade visual da Wear Sublimações

# 8. Peça para criar o configurador
> Crie o componente ConfiguratorSection com os steps de seleção,
> hook useConfigurator, e OrderSummary sticky

# 9. Depois, integre com Magazord
> Configure a integração com Magazord para redirecionar ao checkout
> com o produto correto selecionado
```

---

## 11. Pontos de Atenção

1. **Domínio:** A LP precisa estar no mesmo domínio ou subdomínio do Magazord para que cookies de sessão/carrinho funcionem. Se for domínio separado, a integração via API é obrigatória.

2. **CORS:** Se usar a API do Magazord client-side, pode haver bloqueio de CORS. Nesse caso, criar API routes no Next.js como proxy.

3. **SEO:** A LP deve ter meta tags otimizadas para "wind banner personalizado", "wind banner sublimado", "bandeira wind banner".

4. **Performance:** Usar next/image para otimização, lazy loading nas seções abaixo da fold, e fontes via next/font.

5. **Analytics:** Implementar GTM/GA4 com eventos de cada step do configurador (para funil de conversão).

6. **WhatsApp:** Manter o botão flutuante com link para atendimento — mesmmo padrão do site atual (18) 99807-4936.

7. **Pixel Meta/Google Ads:** Incluir pixels de conversão se a Wear tiver campanhas ativas.

---

## 12. Alternativa Simplificada (se API Magazord for complexa)

Se a integração via API for muito trabalhosa ou se o Magazord não permitir add-to-cart via URL externa facilmente:

**Opção de redirect simples:**
- A LP é apenas um "configurador visual" que mostra preços e opções
- O botão "Comprar" redireciona para a **página do produto no Magazord** (URL do produto específico)
- O cliente finaliza a seleção de variação e checkout diretamente no Magazord

**URL base:** `https://www.wearsublimacoes.com.br/bandeira-para-wind-banner-somente-tecido-escolha-o-tema-aqui`

Nesse caso a LP serve como funil de vendas/educação e o checkout é 100% no Magazord. Essa é a opção mais segura para começar.