---
description: "Executar checagens automatizadas (tsc, lint, test, build, smoke) e verificar a responsividade em 375px, 768px e 1280px comparando com o mockup."
---

1. Executar `npx tsc --noEmit` para validação estática de tipos.
2. Executar `npm run lint` para conferir regras do linter.
3. Executar `npm test` para rodar a suíte de testes unitários e de integração.
4. Executar `npm run build` para testar o bundle de produção SSR.
5. Executar `npm run smoke` para validar a renderização das rotas SSR.
6. Avaliar a home em 375px, 768px e 1280px, identificando qualquer discrepância visual ou funcional com o mockup.
