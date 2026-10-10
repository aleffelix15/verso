import { describe, expect, it } from "vitest";
import { calculateFreightOptions, freightRequestSchema } from "@/server/freight-calculator";

describe("server freight calculation", () => {
  it("recomputes subtotal and weight from catalog items in centavos", () => {
    const options = calculateFreightOptions({
      cep: "01234567",
      items: [{ slug: "moletom-salmo-23", quantity: 2 }],
    });

    expect(options).toEqual([
      { id: "pac", name: "Frete Grátis (Econômico)", priceCents: 0, estimatedDays: 7 },
      { id: "sedex", name: "Sedex (Expresso)", priceCents: 2990, estimatedDays: 3 },
    ]);
  });

  it("rejects client-supplied totals, weights, quantities, and invalid CEPs", () => {
    const base = { cep: "01234567", items: [{ slug: "camiseta-luz", quantity: 1 }] };

    expect(freightRequestSchema.safeParse({ ...base, total_value: 99999 }).success).toBe(false);
    expect(freightRequestSchema.safeParse({ ...base, total_weight_kg: 0 }).success).toBe(false);
    expect(
      freightRequestSchema.safeParse({ ...base, items: [{ slug: "camiseta-luz", quantity: 0 }] })
        .success,
    ).toBe(false);
    expect(
      freightRequestSchema.safeParse({ ...base, items: [{ slug: "camiseta-luz", quantity: -1 }] })
        .success,
    ).toBe(false);
    expect(freightRequestSchema.safeParse({ ...base, cep: "12x4567" }).success).toBe(false);
  });

  it("returns explicit shipping identifiers and centavos", () => {
    const options = calculateFreightOptions({
      cep: "01234567",
      items: [{ slug: "camiseta-luz", quantity: 1 }],
    });

    expect(options.map(({ id, priceCents }) => ({ id, priceCents }))).toEqual([
      { id: "pac", priceCents: 1990 },
      { id: "sedex", priceCents: 3590 },
    ]);
  });
});
