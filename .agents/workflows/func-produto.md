---
description: "Implementar funções de produto: guia de medidas interativo com recomendador de tamanho, galeria com swipe e zoom, compartilhar nativo com fallback, contagem regressiva confiável sem mismatch de hidratação, pedido formatado via WhatsApp e SEO JSON-LD."
---

1. Guia de medidas:
   - Tabela de medidas detalhada em Dialog com recomendador por altura/peso (lógica honesta local).
2. Galeria interativa:
   - Navegação por gestos de swipe, zoom ampliado e seletor acessível por teclado.
3. Compartilhamento:
   - Integração com Web Share API com fallback para cópia de link na área de transferência.
4. Contagem regressiva de Drop (`countdown.tsx`):
   - Fuso horário de São Paulo (`America/Sao_Paulo`), renderização estritamente client-side, pausa ao ocultar aba, ação honesta de lembrete via WhatsApp/aviso.
5. Pedido via WhatsApp:
   - Montador de URL `wa.me` com resumo de carrinho e produtos formatado com segurança contra caracteres especiais e acentos.
6. Metadados e SEO estruturado:
   - JSON-LD `Product` e `BreadcrumbList` nas páginas de produto.
