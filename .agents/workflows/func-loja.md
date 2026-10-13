---
description: "Implementar funções de loja: busca cmdk inteligente com atalho Ctrl+K, filtros na URL sincronizados via TanStack Router search params, quick view de produto, sacola persistente com meta de frete grátis e sincronização entre abas, e histórico de vistos recentemente."
---

1. Busca instantânea (cmdk):
   - Abertura com `Ctrl/Cmd + K` e `/`.
   - Busca em nome, categoria, cor, versículo com normalização de acentos (`normalize("NFD")`).
   - Histórico das últimas 5 buscas e sugestões populares.
2. Filtros e ordenação na URL (`/loja`):
   - `validateSearch` no TanStack Router com Zod para categoria, tamanho, cor, preço e ordenação.
   - Chips de filtros ativos, contador de resultados e botão "Limpar filtros".
3. Quick view:
   - Botão no card de produto abrindo diálogo/sheet com seleção de tamanho/cor e adição à sacola.
4. Sacola persistente:
   - Versão de schema no localStorage, sync via evento `storage`.
   - Barra de progresso para frete grátis (meta R$ 299 de `storeConfig`).
   - Desfazer remoção via sonner toast e mover para favoritos.
5. Vistos recentemente:
   - Registro local das últimas peças vistas com lista na home e na página de produto.
