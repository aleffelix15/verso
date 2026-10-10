---
description: "Integra dinamicamente um modelo 3D à galeria da página de produto via Suspense/Lazy."
---

Integre o modelo da peça indicada à página `src/routes/produto.$slug.tsx`.

1. Adicione uma aba "Ver em 3D" na galeria, mantendo as fotos como padrão.
2. Carregue com `React.lazy` + `Suspense` + `ClientOnly`, só quando o usuário clicar na aba.
3. Mostre a foto do produto como fallback durante o carregamento e em dispositivos sem WebGL.
4. Respeite `prefers-reduced-motion` (sem rotação automática).
5. Mapeie `slug` → componente 3D em um único arquivo `src/components/three/registry.ts`.
6. Não altere o visual atual da página além da aba nova.

