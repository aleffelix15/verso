import { z } from "zod";

const envSchema = z.object({
  MP_ACCESS_TOKEN: z.string().optional(),
  MP_WEBHOOK_SECRET: z.string().optional(),
  PUBLIC_SITE_URL: z.string().optional(),
  FREIGHT_API_TOKEN: z.string().optional(),
});

let cachedEnv: any = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Erro de Variáveis de Ambiente:", parsed.error.format());
    cachedEnv = process.env || {};
  } else {
    cachedEnv = parsed.data;
  }

  if (!cachedEnv.PUBLIC_SITE_URL) {
    if (process.env['NODE_ENV'] !== "production") {
      cachedEnv.PUBLIC_SITE_URL = "http://localhost:5173";
    } else {
      console.warn("AVISO: PUBLIC_SITE_URL não definida em produção.");
    }
  }

  return cachedEnv;
}
