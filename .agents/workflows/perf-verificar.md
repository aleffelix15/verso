---
description: "Verificar integridade geral: compilação TypeScript, ESLint sem erros, execução de todos os testes Vitest, build de produção e testes de fumaça SSR."
---

1. Executar `npx tsc --noEmit` para validação rigorosa de tipos.
2. Executar `npm run lint` para conformidade de código.
3. Executar `npm test` para todos os testes unitários e de integração novos e existentes.
4. Executar `npm run build` e registrar métricas de bundle.
5. Executar `npm run smoke` para certificar todas as rotas SSR ativas.
