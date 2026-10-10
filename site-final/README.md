# VERSO Streetwear

Loja demonstrativa de streetwear com propósito, em português do Brasil. O catálogo, as imagens e a sacola são conteúdo de demonstração. Pagamento e frete dependem da configuração de serviços externos.

## Requisitos

- Node.js 22.12 ou superior
- npm

## Desenvolvimento

```sh
npm ci
npm run dev
```

## Verificação e produção

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run preview
```

O projeto usa React, TypeScript, TanStack Start, Vite, Tailwind CSS e Nitro. A saída de deploy é configurada para Vercel em `vercel.json`.

## Variáveis de ambiente

Copie `.env.example` para `.env` no desenvolvimento. Configure no servidor da Vercel:

- `PUBLIC_SITE_URL`: domínio público com protocolo; usado em retornos e no sitemap.
- `MP_ACCESS_TOKEN`: credencial privada do Mercado Pago para criar pagamentos.
- `MP_WEBHOOK_SECRET`: segredo para validar notificações de pagamento.
- `FREIGHT_API_TOKEN`: opcional; credencial do serviço de frete, se ativado.

Não coloque credenciais em variáveis `VITE_` nem no código cliente. Os formulários, estimativas e contatos que não estejam configurados permanecem demonstrativos.

## Deploy na Vercel

Importe o repositório na Vercel. Use o preset TanStack Start e o comando `npm run build`; a configuração do adaptador está em `vercel.json`. Adicione as variáveis de ambiente acima conforme os serviços ativados e faça o deploy.

## Conteúdo

Produtos, imagens, referências, categorias e configurações de contato ficam em `src/data/products.ts`. Algumas imagens de acessórios são provisórias e estão identificadas na loja. Revise os contatos e a data do drop antes de uma publicação comercial.
