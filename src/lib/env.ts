import { z } from "zod";

const envSchema = z.object({
  MP_ACCESS_TOKEN: z.string().min(1, "MP_ACCESS_TOKEN é obrigatório para transações."),
  MP_WEBHOOK_SECRET: z.string().optional(), // Opcional em dev, mas obrigatório em prod para assinar
  PUBLIC_SITE_URL: z.string().url("PUBLIC_SITE_URL deve ser uma URL válida.").default("http://localhost:5173"),
  FREIGHT_API_TOKEN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro de Variáveis de Ambiente:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas ou ausentes.");
}

export const env = _env.data;

