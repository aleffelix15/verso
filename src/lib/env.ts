import { z } from "zod";

const optionalHttpsUrl = z
  .string()
  .url()
  .refine((value) => new URL(value).protocol === "https:", "Must use HTTPS")
  .optional();
const optionalSiteUrl = z.string().url().optional();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  MP_ACCESS_TOKEN: z.string().min(1).optional(),
  MP_PUBLIC_KEY: z.string().min(1).optional(),
  MP_WEBHOOK_SECRET: z.string().min(1).optional(),
  FREIGHT_API_TOKEN: z.string().min(1).optional(),
  PUBLIC_SITE_URL: optionalSiteUrl,
  SUPABASE_URL: optionalHttpsUrl,
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema> & { PUBLIC_SITE_URL: string };

const productionRequiredKeys = [
  "MP_ACCESS_TOKEN",
  "MP_WEBHOOK_SECRET",
  "PUBLIC_SITE_URL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export function parseEnvironment(
  source: NodeJS.ProcessEnv,
  mode: string | undefined = source["NODE_ENV"],
): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const keys = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid environment configuration: ${keys}`);
  }

  const missingRequired =
    mode === "production" ? productionRequiredKeys.filter((key) => !parsed.data[key]) : [];
  if (missingRequired.length) {
    throw new Error(
      `Missing required production environment variables: ${missingRequired.join(", ")}`,
    );
  }
  if (mode === "production" && new URL(parsed.data.PUBLIC_SITE_URL!).protocol !== "https:") {
    throw new Error("PUBLIC_SITE_URL must use HTTPS in production");
  }

  return {
    ...parsed.data,
    PUBLIC_SITE_URL: parsed.data.PUBLIC_SITE_URL ?? "http://localhost:5173",
  };
}

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  cachedEnv = parseEnvironment(process.env);

  if (process.env["NODE_ENV"] !== "production") {
    const missingIntegrations = [
      "MP_ACCESS_TOKEN",
      "MP_WEBHOOK_SECRET",
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ].filter((key) => !process.env[key]);
    if (missingIntegrations.length) {
      console.warn(`[env] Integrações indisponíveis; configure: ${missingIntegrations.join(", ")}`);
    }
  }

  return cachedEnv;
}
