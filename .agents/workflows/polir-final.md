---
description: "Revisão e polimento de acessibilidade, foco por teclado, suporte a prefers-reduced-motion, atalhos globais (?) e feedback sonner/aria-live."
---

1. Verificar funcionamento completo com `prefers-reduced-motion` ativado e toggle manual de acessibilidade.
2. Conferir foco visível vermelho (`outline: 2px solid var(--brand)`), trap de foco em modais e restauração ao fechar.
3. Testar navegação por teclado (atalho `?` para ajuda de atalhos, `Ctrl+K` para busca).
4. Conferir banner discreto de status offline quando a conexão com a internet for interrompida.
