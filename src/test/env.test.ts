import { describe, expect, it } from "vitest";
import { parseEnvironment } from "@/lib/env";

describe("environment validation", () => {
  it("fails explicitly when production secrets or public URLs are missing", () => {
    expect(() => parseEnvironment({}, "production")).toThrow(
      "Missing required production environment variables",
    );
  });

  it("requires HTTPS for production public and Supabase URLs", () => {
    const productionEnv = {
      MP_ACCESS_TOKEN: "placeholder-access-token",
      MP_WEBHOOK_SECRET: "placeholder-webhook-secret",
      PUBLIC_SITE_URL: "http://verso.example",
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "placeholder-service-key",
    };

    expect(() => parseEnvironment(productionEnv, "production")).toThrow(
      "PUBLIC_SITE_URL must use HTTPS",
    );
  });

  it("uses only validated values and allows localhost in development", () => {
    expect(parseEnvironment({}, "development").PUBLIC_SITE_URL).toBe("http://localhost:5173");
    expect(() => parseEnvironment({ PUBLIC_SITE_URL: "not-a-url" }, "development")).toThrow(
      "Invalid environment configuration",
    );
  });
});
