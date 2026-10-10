# Decisões da versão final

## Comparação dos projetos

| Critério        | SITE_A: ZIP indicado                                                                                     | SITE_B: `reference-upsite`                              | Preferido e justificativa                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Stack e versões | React 19, TypeScript, TanStack Start/Router, Vite, Tailwind 4, Nitro/Vercel                              | Mesma base técnica e versões próximas                   | A: inclui integração de pagamento no servidor e configuração Vercel explícita.                        |
| Rotas           | Home, loja, produto, drops, sobre, contato, sitemap, pagamento e webhook                                 | Rotas de loja, produto, drops, sobre, contato e sitemap | A: cobre os fluxos adicionais de pagamento.                                                           |
| Componentes     | Shell compartilhado, contexto de sacola, cards, animações e componentes Radix                            | Shell, contexto e componentes equivalentes              | Empate: organização e padrões são essencialmente os mesmos.                                           |
| Design          | Streetwear editorial, preto/off-white, acento laranja e tipografia condensada                            | Mesmo sistema visual e identidade                       | Empate: linguagem visual compartilhada.                                                               |
| Mobile          | Layout responsivo, navegação adaptável e fotos fluidas                                                   | Base responsiva equivalente                             | A: versão mais recente inclui aprimoramento para movimento/fotos de produto.                          |
| Animação        | Framer Motion, efeitos de entrada e fotos com animação finita                                            | Framer Motion e efeitos de loja                         | A: mantém animação de foto compartilhada e respeita movimento reduzido.                               |
| Performance     | Imagens com dimensões e lazy loading em cards/conteúdo abaixo da dobra                                   | Abordagem semelhante                                    | Empate: ambas usam imagens locais e carregamento tardio nos grids.                                    |
| Acessibilidade  | Semântica e controles acessíveis no shell e nos componentes                                              | Base equivalente                                        | Empate: sem auditoria automatizada disponível nesta etapa.                                            |
| SEO             | Metadados por página, sitemap e robots                                                                   | Metadados e sitemap                                     | A: rotas indexáveis também incluem produtos e páginas do fluxo de pagamento.                          |
| Qualidade       | Dados tipados centralizados e novos testes de catálogo; contém integração antiga de telemetria do editor | Dados centralizados, sem as adições mais recentes       | A: catálogo mais completo e cobertura funcional maior; integração de telemetria removida nesta cópia. |

## Base e elementos aproveitados

Base escolhida: SITE_A (ZIP/cópia `verso-streetwear-main`), por ser a versão mais recente e incluir catálogo ampliado, opções de filtro, avisos de imagens provisórias, animação compartilhada de fotos, endpoints de pagamento e configuração de deploy. SITE_B é uma revisão anterior da mesma aplicação, não um produto visual independente.

Preservados: estrutura de rotas; identidade visual e hierarquia de seções; produtos e textos; imagens; filtros de categoria e cor; catálogo em lotes; sacola global; animações; rotas de pagamento; sitemap; e testes existentes.

Portado do SITE_B: nenhum elemento exclusivo foi necessário. Os componentes equivalentes já existem na versão A.

## Removido ou substituído

- Configuração, planos e telemetria vinculados ao editor de origem foram retirados da cópia final.
- O domínio provisório do sitemap foi substituído pela variável de ambiente `PUBLIC_SITE_URL`.
- A descrição de projeto que era um prompt de criação foi substituída por documentação operacional.
- O lockfile do npm é o único lockfile mantido; Bun foi removido desta distribuição.

## Pendências que exigem o responsável pela loja

- Confirmar telefone e conta oficial de Instagram e substituir os contatos demonstrativos em `src/data/products.ts`.
- Confirmar endereço/destino final para `PUBLIC_SITE_URL` antes do deploy.
- Validar data e horário do encerramento do drop.
- Substituir fotos provisórias de meias e mochila e validar as demais imagens de produto.
- Confirmar preços, estoque, regras de frete, política de troca, condições de pagamento e depoimentos antes de vender. O conteúdo atual é demonstrativo.

## Sugestões não aplicadas

- Migrar contatos, prazo do drop e conteúdo comercial para variáveis de configuração validadas em painel privado.
- Otimizar imagens para AVIF/WebP e adicionar geração de tamanhos responsivos.
- Executar auditoria Lighthouse e revisar contraste e navegação por teclado com dispositivos reais.
