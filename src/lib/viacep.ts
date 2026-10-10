import { z } from "zod";

const viaCepSuccessSchema = z
  .object({
    cep: z.string().regex(/^\d{5}-?\d{3}$/),
    logradouro: z.string(),
    bairro: z.string(),
    localidade: z.string().min(1),
    uf: z.string().regex(/^[A-Z]{2}$/),
  })
  .passthrough();

const viaCepNotFoundSchema = z.object({ erro: z.literal(true) }).passthrough();

export type ViaCepAddress = z.infer<typeof viaCepSuccessSchema>;

export async function lookupCep(cep: string, timeoutMs = 5000): Promise<ViaCepAddress | null> {
  if (!/^\d{8}$/.test(cep)) throw new Error("CEP inválido");

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("ViaCEP indisponível");

    const payload: unknown = await response.json();
    const notFound = viaCepNotFoundSchema.safeParse(payload);
    if (notFound.success) return null;

    const parsed = viaCepSuccessSchema.safeParse(payload);
    if (!parsed.success) throw new Error("Resposta inválida do ViaCEP");
    return parsed.data;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
