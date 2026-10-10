import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupCep } from "@/lib/viacep";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ViaCEP lookup", () => {
  it("validates a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            cep: "01001-000",
            logradouro: "Praça da Sé",
            bairro: "Sé",
            localidade: "São Paulo",
            uf: "SP",
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(lookupCep("01001000")).resolves.toMatchObject({
      logradouro: "Praça da Sé",
      localidade: "São Paulo",
      uf: "SP",
    });
  });

  it("handles not-found, malformed data, network failures, and timeouts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ erro: true }), { status: 200 })),
    );
    await expect(lookupCep("01001000")).resolves.toBeNull();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ uf: "São Paulo" }), { status: 200 })),
    );
    await expect(lookupCep("01001000")).rejects.toThrow("Resposta inválida");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(lookupCep("01001000")).rejects.toThrow("offline");

    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      ),
    );
    const pending = lookupCep("01001000", 100);
    const timeoutAssertion = expect(pending).rejects.toThrow("Aborted");
    await vi.advanceTimersByTimeAsync(100);
    await timeoutAssertion;
  });
});
