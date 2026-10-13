---
description: "Auditar responsividade nas matrizes 360, 390, 430, 600, 768, 820, 1024, 1280, 1440, 1920, 2560 e paisagem (844x390), avaliando scroll horizontal, alvos de toque >= 44px e tipografia."
---

1. Criar script de auditoria responsiva em `scripts/responsive-audit.mjs`.
2. Verificar ausência de overflow horizontal (`scrollWidth <= innerWidth`).
3. Verificar tamanhos mínimos de toque (mínimo 44x44px em botões e links interativos).
4. Gerar relatório `.responsive-report/tablet.md` com diagnósticos específicos para a faixa de 768px a 1024px.
