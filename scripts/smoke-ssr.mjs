import { resolve } from "path";
import { pathToFileURL } from "url";

// Dynamically import the handler from nitro output
const handlerPath = resolve(process.cwd(), ".vercel/output/functions/__server.func/index.mjs");
const { default: handler } = await import(pathToFileURL(handlerPath).href);

const routesToTest = [
  "/",
  "/loja",
  "/produto/camiseta-luz",
  "/produto/moletom-salmo-23",
  "/sobre",
  "/contato",
  "/drops",
  "/favoritos",
  "/pagamento/sucesso",
  "/pagamento/pendente",
  "/pagamento/recusado",
  "/nao-existe",
];

async function smokeTest() {
  console.log("Starting smoke test for SSR routes...\n");

  let failed = false;

  for (const route of routesToTest) {
    try {
      const req = new Request(`http://localhost${route}`);
      // handler.fetch takes a Request and returns a Response
      const res = await handler.fetch(req, {});
      const body = await res.text();

      const expectedStatus = route === "/nao-existe" ? 404 : 200;
      const statusText =
        res.status === expectedStatus
          ? "✅ OK"
          : `❌ FAILED (Expected ${expectedStatus}, got ${res.status})`;

      console.log(`Route: ${route.padEnd(30)} -> ${statusText}`);

      if (res.status !== expectedStatus) {
        failed = true;
      }

      if (body.includes("Error in renderToReadableStream") || body.includes("Error:")) {
        // We only want to fail if it's an actual unexpected error text, though checking for "Error:" might catch harmless text.
        // Let's specifically look for the error reported by the user or render errors.
        if (body.includes("useTheme must be used within a ThemeProvider")) {
          console.error(`❌ FAILED: useTheme error found in body for ${route}`);
          failed = true;
        } else if (body.includes("Error in renderToReadableStream")) {
          console.error(`❌ FAILED: "Error in renderToReadableStream" found in body for ${route}`);
          failed = true;
        }
      }
    } catch (err) {
      console.error(`Route: ${route.padEnd(30)} -> ❌ CRASHED:`, err);
      failed = true;
    }
  }

  if (failed) {
    console.error("\n❌ Smoke tests failed.");
    process.exit(1);
  } else {
    console.log("\n✅ All smoke tests passed.");
    process.exit(0);
  }
}

smokeTest();
