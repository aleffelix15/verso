# Changelog de segurança — Fase 2, Lote A

- Removidos o site duplicado, arquivos Bun e patches/scripts Lovable sem uso; documentação legada preservada e backup `backup-site-final` criado.
- Padronizado LF e configuração do ESLint/Prettier; removida dependência de desenvolvimento `vercel`.
- Corrigida a confiança em frete/preços enviados pelo navegador: catálogo do servidor como fonte, validação estrita e valores em centavos.
- Reforçada validação e tratamento de falha no checkout, com resposta genérica e redação de credenciais nos logs.
- Introduzidos schema/cache tipados para configuração e variáveis de produção exigidas.
- Adicionados cabeçalhos de segurança e CSP Report-Only, helper ViaCEP validado, sitemap/robots dinâmicos e páginas legais em estado de rascunho.
- Criados testes unitários para frete, schema de checkout, erros, ambiente e ViaCEP.

O Lote B não foi iniciado. Consulte `AUDITORIA.md` e `DEPLOY.md` antes do go-live.
