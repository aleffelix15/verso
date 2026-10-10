---
description: "Cria um modelo 3D procedural usando primitivas geométricas estritas do Three.js."
---

Crie um modelo procedural da peça que eu informar após o comando (ex.: "/3d-modelo camiseta oversized").

1. Crie `src/components/three/models/<nome>.tsx` usando geometrias nativas (Lathe, Extrude, Shape, Cylinder, Sphere, Box) e `MeshStandardMaterial`.
2. Receba por props: `color` (padrão #0E0E0E), `accent` (padrão #E4572E) e `autoRotate`.
3. Silhueta fiel à peça (camiseta oversized, moletom boxy, boné 5 painéis, jaqueta coach, calça cargo), com detalhes: costuras, etiqueta, bolsos, aba do boné.
4. Centralize o modelo na origem e normalize a escala para caber em 1 unidade.
5. Faça dispose de geometrias e materiais no cleanup.
6. Não toque em páginas existentes. Mostre um exemplo de uso.

