const fs = require('fs');
let f = fs.readFileSync('src/styles.css', 'utf8');

// Replace theme block
f = f.replace(/@theme \{/, '@theme inline {');

// Fix variables mapping
f = f.replace(/--color-background: var\(--paper\);/, '--color-background: var(--background);\n  --color-foreground: var(--foreground);');
f = f.replace(/--color-foreground: var\(--ink\);/, '');

// Add dark custom variant and inject tokens
const baseLayerReplacement = `@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  :root {
    color-scheme: light;
    --background: #f8f8f8;
    --foreground: #0a0a0a;
    --ink: #0a0a0a;
    --paper: #f8f8f8;
    --brand: #ff4500;
    --chalk: #737373;
    --border: #e5e5e5;
    --muted: #e5e5e5;
    --shadow-float: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
  }
  .dark {
    color-scheme: dark;
    --background: #0a0a0a;
    --foreground: #f8f8f8;
    --ink: #f8f8f8;
    --paper: #0a0a0a;
    --brand: #ff4500;
    --chalk: #a3a3a3;
    --border: #262626;
    --muted: #262626;
    --shadow-float: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
  }`;

f = f.replace(/@layer base \{[\s\S]*?:root \{[\s\S]*?\}/, baseLayerReplacement);

// Fix body transition and colors
f = f.replace(/body \{[\s\S]*?\}/, `body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
    width: 100%;
    transition: background-color 0.2s ease, color 0.2s ease;
  }`);

// Make sure transition ignores prefers-reduced-motion
f = f + `
@media (prefers-reduced-motion: reduce) {
  body {
    transition: none !important;
  }
}`;

fs.writeFileSync('src/styles.css', f);
