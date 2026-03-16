# TODO — Wind Banner LP | Wear Sublimações

## Concluído

### Setup do Projeto
- [x] Projeto Next.js 16 com App Router, TypeScript strict, Tailwind CSS
- [x] Design tokens configurados (cores, tipografia) via `@theme` no globals.css
- [x] Arquivo `docs/design-tokens.json` com tokens completos
- [x] CLAUDE.md com instruções para o Claude Code
- [x] Repositório git inicializado com commits

### Tipos e Dados
- [x] Tipos TypeScript (`src/types/index.ts`): ModeloId, TamanhoId, TecidoId, BaseId, ExtraId, ConfiguracaoSelecionada
- [x] Catálogo de produtos (`src/data/products.ts`): 4 modelos, 4 tamanhos, 2 tecidos, 3 bases, 2 extras, descontos progressivos
- [x] Mapa de preços (`src/data/prices.ts`): estrutura pronta com preços placeholder da Printi (aguardando dados reais)
- [x] Mapeamento Magazord (`src/data/magazord-mapping.ts`): estrutura pronta, IDs vazios

### Lógica de Negócio
- [x] Calculadora de preço (`src/lib/price-calculator.ts`): preço base + base + extras + desconto por quantidade
- [x] Formatação de moeda (`src/lib/utils.ts`): `formatCurrency()` e `formatInstallment()`
- [x] Geração de URL de checkout Magazord (`src/lib/magazord.ts`)
- [x] Hook do configurador (`src/hooks/useConfigurator.ts`): state management completo
- [x] Hook de frete (`src/hooks/useFreight.ts`): estrutura com placeholder

### Layout
- [x] TopBar escura (frete, atendimento, WhatsApp)
- [x] Header sticky com logo Wear + nav + botão Comprar
- [x] Footer com 4 colunas (sobre, produtos, institucional, contato)

### Seções da LP
- [x] Hero section (mockup do produto, preço placeholder, rating, CTA)
- [x] Trust bar (envio 48h, 6x sem juros, 100% seguro, troca garantida)
- [x] Configurador de produto com 6 steps (Modelo, Tamanho, Tecido, Base, Extras, Quantidade)
- [x] Sidebar sticky com resumo do pedido, preço, frete e botão Comprar
- [x] Seção de gabaritos para download
- [x] Especificações técnicas (accordion)
- [x] Avaliações de clientes (6 reviews fake)
- [x] FAQ (8 perguntas, accordion)
- [x] WhatsApp floating button

### Assets
- [x] Logo Wear preto (`public/logos/logo-wear-black.png`)
- [x] Logo Wear branco (`public/logos/logo-wear-white.png`)
- [x] Mockup Wind Banner (`public/products/mockup_windbanner_wear.png`)

### Imagens Placeholder (Printi CDN — temporário para apresentação)
- [x] Imagens dos 4 modelos (Asa/Pena, Blade/Faca, Gota, Vela)
- [x] Imagens dos 4 tamanhos (1m PP, 2m P, 3m M, 4m G)
- [x] Imagens dos 2 tecidos (Oxford, Oxford Blecaute)
- [x] Imagens das 3 bases (Sem base, Padrão Preto, Premium Preto)
- [x] Imagens dos extras (bandeira reserva, capa)
- [x] Preços placeholder baseados na Printi (R$ 433–519/unid) em `src/data/prices.ts`
- [x] `next.config.ts` configurado para permitir imagens do CDN da Printi

---

## Pendente — Banco de Dados (Neon Postgres)

### Schema
- [ ] Tabela `modelos` (id, nome, descricao, imagem_url, ativo)
- [ ] Tabela `tamanhos` (id, nome, largura, altura, ativo)
- [ ] Tabela `tecidos` (id, nome, descricao, ativo)
- [ ] Tabela `bases` (id, nome, descricao, preco_centavos, ativo)
- [ ] Tabela `extras` (id, nome, descricao, preco_centavos, ativo)
- [ ] Tabela `precos` (modelo_id, tamanho_id, tecido_id, preco_centavos)
- [ ] Tabela `descontos` (quantidade_minima, percentual)
- [ ] Tabela `magazord_mapping` (modelo_id, tamanho_id, tecido_id, base_id, magazord_product_id)
- [ ] Tabela `avaliacoes` (id, nome, cidade, estado, nota, texto, created_at)
- [ ] Tabela `pedidos_lead` (id, config_json, preco_total, cep, created_at)

### API Routes (Next.js)
- [ ] `GET /api/products` — catálogo completo (modelos, tamanhos, tecidos, bases, extras)
- [ ] `GET /api/prices` — matriz de preços
- [ ] `POST /api/freight` — cálculo de frete real (proxy Correios/Magazord)
- [ ] `POST /api/checkout` — registra lead + retorna URL Magazord
- [ ] `GET /api/reviews` — avaliações do banco

### Migração de Dados
- [ ] Popular tabelas com dados atuais de `src/data/products.ts`
- [ ] Popular preços placeholder atuais de `src/data/prices.ts`
- [ ] Popular avaliações atuais de `SocialProofSection.tsx`
- [ ] Adaptar hooks/componentes para consumir API em vez de imports estáticos

---

## Pendente — Dados Reais (depende da Wear)

### Preços e Catálogo
- [ ] Substituir preços placeholder por valores reais em cada combinação modelo x tamanho x tecido
- [ ] Confirmar preços dos kits de base (padrão e premium)
- [ ] Confirmar preços dos extras (bandeira reserva, capa protetora)
- [ ] Confirmar quais modelos, tamanhos e tecidos estão de fato disponíveis
- [ ] Definir se há descontos progressivos e quais faixas

### Integração Magazord
- [ ] Obter credenciais de API (ApiKey + Password) com suporte Magazord
- [ ] Mapear IDs de produto/variação no Magazord para cada combinação em `magazord_mapping`
- [ ] Validar formato exato da URL de add-to-cart com o suporte Magazord
- [ ] Testar fluxo completo: LP -> carrinho -> checkout Magazord

### Imagens Reais (substituir placeholders da Printi)
- [ ] Fotos/renders de cada modelo (Pena, Faca, Gota, Vela)
- [ ] Fotos de cada tamanho com referência de proporção
- [ ] Fotos das bases (sem base, padrão, premium)
- [ ] Fotos dos tecidos (Bora, Oxford)
- [ ] Fotos dos extras
- [ ] Hero image/vídeo de alta qualidade para desktop e mobile
- [ ] Fotos reais de clientes usando wind banners (social proof)
- [ ] Logo Wear em SVG (preto e branco) para melhor qualidade
- [ ] Remover domínio Printi do `next.config.ts` após substituição

### Conteúdo
- [ ] Gabaritos reais em PDF por modelo e tamanho para download
- [ ] Depoimentos reais de clientes
- [ ] Textos finais de FAQ revisados pela Wear

---

## Pendente — Desenvolvimento

### Funcionalidades
- [ ] Integrar cálculo de frete real (API Correios ou Magazord) no `useFreight.ts`
- [ ] Bottom sheet mobile para o resumo do pedido (atualmente só sidebar desktop)
- [ ] Galeria de modelos (carrossel ou grid com fotos em uso) — seção entre TrustBar e Configurador
- [ ] Preview visual do wind banner no OrderSummary que muda conforme seleção

### SEO e Performance
- [ ] Meta tags otimizadas (Open Graph, Twitter Card)
- [ ] Schema.org structured data (Product, AggregateRating)
- [ ] Otimizar imagens com placeholder="blur" quando tiver imagens finais
- [ ] Lazy loading nas seções abaixo da fold

### Analytics e Tracking
- [ ] Google Tag Manager / GA4
- [ ] Eventos de funil: visualização de cada step, clique em Comprar, simulação de frete
- [ ] Pixel Meta Ads (se houver campanhas)
- [ ] Pixel Google Ads (se houver campanhas)

### Deploy
- [ ] Configurar projeto na Vercel
- [ ] Definir domínio: subpath (`/windbanner`) ou subdomínio (`windbanner.wearsublimacoes.com.br`)
- [ ] Configurar DNS/proxy conforme decisão de domínio
- [ ] Testar CORS se usar API Magazord client-side (pode precisar de API routes como proxy)
