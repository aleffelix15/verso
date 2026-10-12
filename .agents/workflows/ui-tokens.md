---
description: "Ajustar tokens em styles.css para estética streetwear dark, trocar laranja por vermelho vivo, garantir conformidade com tema claro e escuro."
---

1. Em `src/styles.css`, ajustar os tokens de design:
   - Fundo escuro: preto profundo (~#0A0A0A), superfícies (~#111111 / #161616), bordas finas (~#2A2A2A).
   - Acento ÚNICO: vermelho vivo (~#E10D0D / #FF1A1A), substituindo o laranja `#ff4d00` / `--brand`.
   - Tema claro: manter tokens legíveis com base neutra e o mesmo acento vermelho.
   - Tipografia: `--font-display` ("Barlow Condensed"), `--font-mono` ("JetBrains Mono"), `--font-sans` ("Inter").
   - Bordas retas: radius 0 em botões, badges, cards e caixas de diálogo.
2. Atualizar componentes base e utilitários para respeitar os tokens e cantos retos.
3. Executar `npx tsc --noEmit` para verificar tipos.
