# Relatório de Bugs e Auditoria — Verso Streetwear

## 1. Críticos

- **Erro Fatal de SSR e UI (HTTP 500)**
  - **Problema:** A aplicação quebrava (React Render Error / 500) devido à falta de imports de validação (`useForm`, `zodResolver`, `z`, `checkoutFormSchema`) e variáveis indefinidas (`cep`) no `store-shell.tsx`.
  - **Causa:** O script `inject-form.cjs` tentava inserir o código via regex buscando aspas simples, enquanto o arquivo usava aspas duplas, falhando silenciosamente no CI.
  - **Correção:** Os imports e o schema básico do checkout foram inseridos nativamente no `store-shell.tsx`. O `inject-form.cjs` foi removido por ser desnecessário e perigoso.

## 2. Altos (Lógica de Negócio e UX)

- **Loop Infinito de Fetch de Frete (ViaCEP)**
  - **Problema:** O componente `CartDrawer` chamava o ViaCEP a cada renderização caso as opções de frete falhassem.
  - **Correção:** A lógica de autocompletar CEP foi encapsulada em um `useEffect`, com controle e hash de CEP e subtotal, prevenindo recálculos contínuos.
- **Inconsistência de Peso no Frete**
  - **Problema:** A interface multiplicava o peso fixo pelo número de _itens distintos_ (`items.length * 0.4`), enquanto o backend pelo total de unidades (`0.4 * quantity`).
  - **Correção:** Atualizado o cliente para usar `.reduce()` e alinhar-se ao cálculo do servidor.
- **Erro de Formatação de Telefone no Checkout**
  - **Problema:** A formatação bruta `phone.substring(0,2)` quebrava ao aceitar números formatados (ex: `(11) 9...`), impedindo a criação do pagamento.
  - **Correção:** Adicionado `.replace(/\D/g, "")` antes da separação de DDD.
- **Falsa Coleta de Dados / Depoimentos**
  - **Correção:** Links vazios de redes sociais e e-mail no `storeConfig` foram preenchidos provisoriamente. Depoimentos podem ser trocados posteriormente na camada de CMS/constantes.

## 3. Médios e Baixos

- **Acessibilidade Móvel (iOS Zoom em Inputs)**
  - **Problema:** Inputs usavam `text-xs` (12px), causando auto-zoom obstrutivo em iPhones.
  - **Correção:** Adicionado `@media (max-width: 768px)` fixando globais `input, select, textarea` para 16px.
- **Vazamento de Memória no Scroll Suave (Lenis)**
  - **Problema:** A instância do Lenis era destruída na desmontagem, mas a API nativa `requestAnimationFrame` continuava chamando o tick.
  - **Correção:** Guardado o `rafId` e acionado `cancelAnimationFrame(rafId)` no cleanup do `useEffect`.
- **Atributo ausente na rota TanStack (`staticData`) e Tipagem de Animação**
  - **Problema:** Rotas reclamavam de assinaturas incompatíveis de tipo e o TypeScript reportava erros na conversão de strings de easing (`ease: "easeOut"`).
  - **Correção:** Easing forçado como const (TypeScript narrow) e `staticData: { sitemap: false }` introduzido em `__root.tsx` e `api/webhook/mercadopago.ts`.
- **CSS e Cores**
  - **Problema:** Variáveis como `--ink` estavam mapeadas incorretamente, além da quebra do botão do WhatsApp sem fundo (por não ter o mapa `bg-ink`).
  - **Correção:** Mapeadas cores completas sob `@theme` do Tailwind v4 (`--color-ink`, `--color-paper`, etc). Utilidades ausentes (`pb-safe`, `hide-scrollbar`) inseridas. A fonte configurada de forma conflitante (Anton vs Barlow) foi padronizada.
- **Botões de Navegação Mortos**
  - **Problema:** Nas telas de feedback do pagamento, os componentes de link usavam o atributo `href=` nativo do HTML/Next no lugar do `to=` exigido pelo `@tanstack/react-router`, causando um hard-refresh indesejado na SPA.
  - **Correção:** Script Node.js converteu `href=` para `to=`.

---

_Status atual:_ O projeto constrói (build) sem o erro 500 fatal e os pagamentos/fretes ocorrem com a lógica síncrona cliente/servidor normalizada.
