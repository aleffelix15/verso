---
description: "Construir as 8 seções da home conforme o mockup, extraindo componentes modulares em src/components/store/home/ e centralizando dados em src/data/."
---

1. Centralizar dados de conteúdo em `src/data/products.ts` (coleções, faixas de confiança, etc.).
2. Extrair componentes modulares em `src/components/store/home/`:
   - `announcement-bar.tsx`: Faixa superior fixa de frete grátis.
   - `hero.tsx`: Seção Hero principal com modelo, tipografia display e citação.
   - `featured.tsx`: Grade de destaques com cards de produtos em proporção 4:5.
   - `trust-strip.tsx`: Barra com 3 colunas e divisores verticais de confiança.
   - `collections.tsx`: 3 cards grandes editoriais de coleções.
3. Atualizar `newsletter.tsx`, `product-card.tsx` e `store-shell.tsx` (header e footer) conforme especificações.
4. Montar a página `src/routes/index.tsx` de cima a baixo com as 8 seções fieis ao mockup.
5. Executar `npm run lint`.
