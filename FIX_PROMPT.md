# FIX PROMPT (VERSO STREETWEAR)

Use o prompt abaixo em uma nova sessão ou agente para aplicar as correções (embora elas já tenham sido aplicadas no ambiente atual).

---

**CONTEXTO**
Precisamos corrigir problemas críticos no projeto Verso Streetwear (TanStack Start + Vite + Tailwind v4) listados após uma auditoria rigorosa. Não reescreva componentes inteiros. Aplique as seguintes etapas de correção pontualmente.

**ETAPA 1 — Crash Fatal no SSR (store-shell.tsx)**

- Remova o arquivo `inject-form.cjs`.
- No arquivo `src/components/store/store-shell.tsx`, insira os seguintes imports ausentes no topo do arquivo: `useForm` (de `react-hook-form`), `zodResolver` (de `@hookform/resolvers/zod`) e `z` (de `zod`).
- Adicione manualmente a definição mínima do `checkoutFormSchema` no `store-shell.tsx` com `name`, `email`, `phone`, `zip_code`, `street_name`, `street_number`, `neighborhood`, `city`, e `state: z.string().optional()`.

**ETAPA 2 — Correção Lógica de Negócio de Frete e Checkout**

- No `CartDrawer` (dentro de `store-shell.tsx`), remova a função defasada `finishLegacy()`.
- O bloco que faz o fetch do `viacep` hoje não está sob controle de efeitos e causa loop infinito caso o frete falhe. Mova-o para dentro de um `useEffect` que observa `[cepValue, cart.subtotal]`, utilizando uma lógica de hash (`lastCep`) para evitar recálculos excessivos, e só acionando se `clean.length === 8`.
- A interface e o servidor têm discordância no peso. Mude o payload da chamada `calculateFreight` para usar `total_weight_kg: cart.items.reduce((acc, item) => acc + 0.4 * item.quantity, 0)`.
- No submit de pagamento (`finish`), sanitize o `formData.phone` aplicando `.replace(/\D/g, "")` antes de separar em código de área e número.
- Em `src/server/checkout.ts`, altere a `picture_url` do item fixo de frete para a URL do favicon hospedado: `https://verso-streetwear.vercel.app/favicon.svg` (evita rejeição da API do Mercado Pago por string vazia).

**ETAPA 3 — Erros de TS, Links Nativos e Configuração Omissa**

- Nas rotas de pagamento (`src/routes/pagamento/pendente.tsx`, `recusado.tsx`, `sucesso.tsx`), os botões de voltar usam a tag `<Link href="...">`. O TanStack Router exige `<Link to="...">`. Faça a substituição.
- No `__root.tsx` e em `src/routes/api/webhook/mercadopago.ts`, os metadados de rota estão carentes. Adicione `staticData: { sitemap: false }` nas declarações de rota.
- Em `src/routes/index.tsx`, conserte o problema de TS transformando a string de easing de transição (ex: `"easeOut"`) em as const: `"easeOut" as const`.
- No arquivo de configurações `src/data/products.ts` (`storeConfig`), preencha com dados demonstrativos os campos vazios de `whatsapp`, `instagram` e `email`.
- Insira a pasta `.vercel` no `.eslintignore`.

**ETAPA 4 — CSS, Layout iOS e Animações Globais**

- Em `src/styles.css`, corrija a declaração `--font-display` para incluir `"Barlow Condensed", "Inter", sans-serif;`.
- Adicione ao `@theme` as definições: `--color-ink: var(--ink); --color-paper: var(--paper); --color-chalk: var(--chalk); --color-accent: var(--border);`
- Adicione utilidades de preenchimento seguro e rolagem oculta global (`pb-safe` e `hide-scrollbar`).
- Adicione um media query para prevenir o zoom forçado do iOS: `@media (max-width: 768px) { input, select, textarea { font-size: 16px !important; } }`.
- Para prevenir vazamento de memória da biblioteca `Lenis` em `store-shell.tsx` (`requestAnimationFrame`), rastreie o ID no momento do chamamento e invoque `cancelAnimationFrame(rafId)` no callback de retorno do `useEffect`.
- Crie um _event listener_ no `window` que capta a tecla `Escape` (`e.key === "Escape"`) e executa `setMenu(false)` para fechar os menus de navegação corretamente.
