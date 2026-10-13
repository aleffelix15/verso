---
description: "Corrigir responsividade em tablet (768–1023px), telas grandes (>1440px), teclado virtual, safe areas, imagens responsivas com aspect-ratio/sizes e lazy loading do viewer 3D."
---

1. Definir comportamento explícito de 768–1023px:
   - Grid de produtos em 3 colunas.
   - Navegação do header adaptada para tablet.
   - Drawer do carrinho com largura `min(480px, 90vw)`.
   - Filtros da loja em Sheet no retrato e sidebar no paisagem.
   - Layout do produto em 2 colunas a partir de 900px / 1024px.
2. Telas grandes e dobráveis (280px / 320px até 2560px):
   - Container max 1440px / 1600px centralizado, `clamp()`, sem linhas de texto > 75ch.
   - `dvh/svh` e `env(safe-area-inset-*)` completos em header, footer, drawer e floaters.
3. Bundle e performance:
   - Lazy-loading isolado para viewer 3D sem importar dependências pesadas na rota inicial.
