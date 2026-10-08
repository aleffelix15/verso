# Verso Streetwear

Crie um site completo de e-commerce (landing + loja) para uma marca de moda cristã streetwear voltada a jovens de 16 a 28 anos. Idioma: português do Brasil. Mobile-first.

CONCEITO
A marca é streetwear de verdade que carrega fé de forma sutil e autêntica. Nada de visual "igreja", pombas, cruzes gigantes, tipografia cursiva ou clichês. A fé aparece na mensagem, nos detalhes e nas referências bíblicas discretas, não em símbolos óbvios. Referência de vibe: Aimé Leon Dore, Essentials, Carhartt WIP, com alma e propósito.

NOME PROVISÓRIO: VERSO (alusão a "versículo", sem ser literal)
Tagline: "Fé que veste."

IDENTIDADE VISUAL

- Paleta: preto off-black (#0E0E0E), off-white/cimento (#EDEAE4), cinza chumbo, com UM acento: laranja queimado (#E4572E) usado só em botões e detalhes.
- Tipografia: títulos em sans condensada bold, em caixa alta (ex.: Anton ou Bebas Neue); corpo em Inter. Citações bíblicas em mono pequena (ex.: JetBrains Mono), estilo "etiqueta de roupa".
- Estilo: grid limpo, muito espaço, fotos grandes, bordas retas, microtextura de grão no hero. Sem gradientes coloridos, sem emojis.
- Animações sutis: fade-up ao rolar, hover com zoom leve nos produtos, marquee de texto no topo.

ESTRUTURA DA HOME

1. Barra de aviso rolando (marquee): "FRETE GRÁTIS ACIMA DE R$ 299 • DROP 01 DISPONÍVEL • PARCELE EM 3X"
2. Header minimalista: logo à esquerda, menu (Loja, Drops, Sobre, Contato), ícones de busca e sacola.
3. Hero em tela cheia: foto de jovem com moletom oversized em cenário urbano, título grande "FÉ QUE VESTE.", subtítulo "Streetwear com propósito. Sem fantasia.", botão laranja "Ver Drop 01".
4. Faixa de manifesto (3 colunas): "Feito pra rua", "Escrito com propósito", "Edição limitada".
5. Grid "Mais vendidos" (4 produtos): card com foto, nome, preço, segundo ângulo no hover.
6. Seção "O Drop": banner largo com a coleção atual e contagem regressiva.
7. Seção "Versos" (diferencial): peças com estampas baseadas em versículos discretos (ex.: "Jo 1:5", "Sl 23", "Is 41:10") em tipografia pequena e posicionamento de etiqueta. Cada card mostra a referência e uma frase curta explicando o significado.
8. Prova social: grid estilo Instagram com fotos de clientes + 3 depoimentos curtos.
9. Sobre a marca (resumo): texto curto e honesto sobre ser jovem, cristão e criar roupa que não precisa explicar quem você é.
10. Newsletter: "Entra pra lista. Drops primeiro." (campo de e-mail).
11. Footer: links, redes sociais, formas de pagamento, política de troca.

PÁGINAS

- /loja: filtros (categoria, tamanho, cor, preço), grid responsivo, ordenação.
- /produto/:slug: galeria com zoom, seletor de tamanho com guia de medidas, cor, quantidade, botão "Adicionar à sacola", acordeões (descrição, tecido, cuidados, troca), seção "O verso" mostrando a referência bíblica da peça e seu significado, produtos relacionados.
- Sacola lateral (drawer) com subtotal, cálculo de frete por CEP e botão de finalizar via WhatsApp.
- /sobre e /contato.

PRODUTOS DE EXEMPLO (use dados mockados)
Camiseta Oversized "Luz" R$ 129 • Moletom Boxy "Salmo 23" R$ 249 • Boné 5 painéis "Verso" R$ 99 • Jaqueta Coach "Graça" R$ 289 • Calça Cargo "Firme" R$ 219 • Camiseta "Isaías 41" R$ 119.
Use imagens placeholder de qualidade (Unsplash, moda streetwear, pessoas jovens e diversas).

REGRAS DE TOM
Voz direta, jovem, confiante. Frases curtas. Zero pregação, zero "irmão/irmã" forçado. A marca convida, não cobra.

TÉCNICO
React + TypeScript + Tailwind + Framer Motion. Estado da sacola em contexto global. Dados dos produtos em arquivo local fácil de editar. SEO básico, meta tags, favicon e imagens com lazy loading. Botão flutuante de WhatsApp discreto.

## Desenvolvimento

```sh
git clone <url-do-repositorio>
cd verso-streetwear
npm i
npm run dev
```

## Build de Produção

```sh
npm run build
npm run preview
```

## Deploy na Vercel

O projeto usa TanStack Start com Nitro para gerar a saída de deploy da Vercel. Configure em **Vercel > Settings > Environment Variables**:

- `MP_ACCESS_TOKEN` — token privado do Mercado Pago.
- `MP_WEBHOOK_SECRET` — segredo de assinatura de notificações do Mercado Pago.
- `PUBLIC_SITE_URL` — domínio real do site, incluindo `https://` (por exemplo, `https://seudominio.com`).
- `FREIGHT_API_TOKEN` — opcional; token da API de frete.

No painel do Mercado Pago, cadastre a URL de webhook `{PUBLIC_SITE_URL}/api/webhook/mercadopago` e habilite notificações de pagamento.
