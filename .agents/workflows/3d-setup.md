---
description: "Configura o ambiente 3D básico com Three.js e R3F com suporte seguro para SSR."
---

1. Leia `package.json` e confirme React 19 + TanStack Start (SSR).
2. Instale `three`, `@react-three/fiber`, `@react-three/drei` e `@types/three` em versões compatíveis com React 19.
3. Crie `src/components/three/client-only.tsx`: wrapper que só renderiza o filho após montar no cliente (evita quebrar o SSR).
4. Crie `src/components/three/scene.tsx`: Canvas base com luz suave, Environment leve, OrbitControls com zoom limitado, `dpr` limitado a [1, 1.5], fundo transparente e `frameloop="demand"`.
5. Rode `npx tsc --noEmit` e `npm run build`. Relate o resultado.

