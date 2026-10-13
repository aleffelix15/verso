---
description: "Criar tokens de movimento em styles.css, motion variants reutilizáveis em src/lib/motion.ts, scroll animations, microinterações no hero, cards e sacola, com suporte a prefers-reduced-motion."
---

1. Definir tokens de movimento em `src/styles.css`:
   - `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
   - `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`
   - `--dur-fast: 150ms`, `--dur-base: 250ms`, `--dur-slow: 400ms`.
2. Criar `src/lib/motion.ts` com variants tipados:
   - `fadeUp`, `stagger`, `scaleIn`, `slideInRight`, `bumpBadge`, `shakeIcon`.
3. Aplicar animações de scroll:
   - Barra de progresso vermelha fina no header (`useScroll` + `scaleX`).
   - Header inteligente (esconde ao rolar para baixo, reaparece ao subir, fundo/borda após scroll).
   - Efeito parallax suave no Hero com desativação em mobile / reduced motion.
4. Microinterações em cards e sacola:
   - Hover zoom + crossfade, coração "pop" ao favoritar, anel nos swatches de cor.
   - Animação de entrada/saída na sacola com AnimatePresence e toast com botão "Ver sacola".
5. Testar e validar com `npx tsc --noEmit` e `npm run lint`.
