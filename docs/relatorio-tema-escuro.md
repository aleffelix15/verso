# Relatório: Trava de Tema Escuro

## 1. Decisões de Arquitetura

- **Tema único**: O site foi unificado para operar unicamente em modo escuro (Dark Mode).
- **Sem Toggle**: O `ThemeProvider`, `ThemeToggle` e o script `theme-init.js` responsável pela leitura de `localStorage` foram inteiramente apagados para reduzir overhead de hidratação.
- **SSR Seguro**: A tag `<html>` do documento renderiza nativamente com a classe `.dark` e `lang="pt-BR"` no servidor em `__root.tsx`, impedindo qualquer "flash" no carregamento inicial.

## 2. Paleta de Cores e Tokens

Foram definidos de forma inline no `styles.css`:

- `--background`, `--paper`: `#0A0A0A`
- `--surface`: `#141414`
- `--foreground`, `--ink`: `#F8F8F8`
- `--chalk`: `rgb(248 248 248 / 0.65)`
- `--border`, `--muted`: `rgb(248 248 248 / 0.12)`
- `--brand`: `#FF4500`
- `--on-brand`: `#0A0A0A` (texto preto obrigatório sobre o laranja)

Todas as cores foram padronizadas substituindo usos absolutos. Componentes shadcn foram ajustados para respeitar a estrutura e não exigir `theme="light"`.
Os chips de tamanhos (`Button variant="size"`) renderizam a cor laranja no estado ativo com texto preto conforme solicitado.

## 3. Tabela de Contraste (WCAG)

Um script avaliou todos os pares (texto/fundo) com luminosidade e garantiu a leitura:

| Par             | Fundo   | Texto   | Contraste | Status |
| --------------- | ------- | ------- | --------- | ------ |
| Principal       | #0A0A0A | #F8F8F8 | 18.64:1   | AA     |
| Secundário      | #0A0A0A | #A6A6A6 | 8.13:1    | AA     |
| Surface         | #141414 | #F8F8F8 | 17.35:1   | AA     |
| Botão Brand     | #FF4500 | #0A0A0A | 5.75:1    | AA     |
| Link / Destaque | #0A0A0A | #FF4500 | 5.75:1    | AA     |
| Erro / Aviso    | #0A0A0A | #FF4500 | 5.75:1    | AA     |

_Todos os textos estão com contrastes acima de 4.5:1 (Padrão AA). Textos sobre botões laranjas operam perfeitamente para leitura universal._

## 4. Auditoria de Cores Isoladas e Acentos

- Nenhuma cor Tailwind estática permaneceu no código fora dos domínios da paleta, com exceção da `bg-black/60` usada sobre a foto do hero do `index.tsx` (permitido no escopo de _máscara/fade transparente sobre imagem_).
- O aviso de erro de Checkout que estava estático no componente de Sonner via `<p className="text-red-500">` agora aponta para o `#FF4500` (`text-brand`).
- Nenhuma string de acentuação foi quebrada ou afetada. A ferramenta de verificação atestou 0% de corrupção.

## 5. Pendências ou Exceções

Nenhuma exceção! O script `WCAG` e a auditoria de cores operaram com sucesso. O `theme-init.js` não gera mais 404 de Assets e a política de CSP não foi violada. O 3D tem uma luz focada sobre um fundo em gradiente invisível, garantindo boa visualização até de peças pretas!
