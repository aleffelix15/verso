export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Página indisponível</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { 
        font: 15px/1.5 system-ui, -apple-system, sans-serif; 
        background: #000; 
        color: #fff; 
        display: grid; 
        place-items: center; 
        min-height: 100vh; 
        margin: 0; 
        padding: 1.5rem; 
      }
      .card { 
        max-width: 28rem; 
        width: 100%; 
        text-align: center; 
        padding: 2rem; 
        border: 1px solid #333;
        border-radius: 0.5rem;
        background: #0a0a0a;
      }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      p { color: #a1a1aa; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { 
        padding: 0.5rem 1rem; 
        font: inherit; 
        cursor: pointer; 
        text-decoration: none; 
        border: 1px solid transparent; 
        text-transform: uppercase;
        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        border-radius: 0;
      }
      .primary { background: #fff; color: #000; }
      .secondary { background: transparent; color: #fff; border-color: #333; }
      .secondary:hover { background: #111; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Página indisponível</h1>
      <p>Algo deu errado do nosso lado. Você pode tentar novamente ou voltar para o início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar de novo</button>
        <a class="secondary" href="/">Ir para o início</a>
      </div>
    </div>
  </body>
</html>`;
}
