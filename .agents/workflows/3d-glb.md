---
description: "Processa e injeta um modelo .glb/gltf externo usando R3F e Drei."
---

Integre um arquivo .glb que eu indicar (ex.: "/3d-glb public/models/moletom.glb").

1. Verifique tamanho e texturas; se passar de ~3 MB, proponha otimização com `npx @gltf-transform/cli optimize`.
2. Crie `src/components/three/glb-viewer.tsx` com `useGLTF`, `Suspense` e `Stage`.
3. Registre o slug no `registry.ts`.
4. Se o `vercel.json` tiver CSP, ajuste apenas o necessário (decoder Draco/worker).

