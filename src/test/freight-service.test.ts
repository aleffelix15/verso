import { describe, expect, it } from "vitest";
import {
  calculateFreightWithProvider,
  freightServiceRequestSchema,
} from "@/server/freight-service";

describe("Freight Service Layer", () => {
  it("calculates table estimates with correct regional rates and metadata", async () => {
    // CEP SP (iniciando em 0)
    const quoteSP = await calculateFreightWithProvider({
      cep: "01310100",
      items: [{ slug: "camiseta-exodo", quantity: 1 }],
    });

    expect(quoteSP.success).toBe(true);
    expect(quoteSP.isFreeShippingEligible).toBe(false);
    expect(quoteSP.options).toHaveLength(2);

    const pacSP = quoteSP.options.find((o) => o.id === "pac");
    const sedexSP = quoteSP.options.find((o) => o.id === "sedex");

    expect(pacSP?.priceCents).toBe(1990);
    expect(sedexSP?.priceCents).toBe(3590);
    expect(pacSP?.isEstimate).toBe(true);
    expect(pacSP?.provider).toBe("table_estimate");
    expect(quoteSP.expiresAt).toBeTruthy();
  });

  it("applies free shipping for orders exceeding threshold (R$ 299,00)", async () => {
    // 2 jaquetas vigia = 2 * R$ 319,00 = R$ 638,00
    const quote = await calculateFreightWithProvider({
      cep: "01310100",
      items: [{ slug: "jaqueta-vigia", quantity: 2 }],
    });

    expect(quote.isFreeShippingEligible).toBe(true);
    const pac = quote.options.find((o) => o.id === "pac");
    expect(pac?.priceCents).toBe(0);
    expect(pac?.name).toContain("Frete Grátis");
  });

  it("computes additional weight charges when package exceeds 1kg", async () => {
    // 4 moletons = 4 * 400g = 1600g (> 1000g, gera adicional de R$ 2,00)
    // Subtotal: 4 * 269 = 1076 (> 299, portanto frete grátis para PAC, mas Sedex tem sobretaxa de peso)
    // Vamos usar 3 camisetas de R$ 90 (270 reais, < 299) para testar PAC com peso:
    // 3 camisetas * 400g = 1200g (> 1000g)
    const quote = await calculateFreightWithProvider({
      cep: "01310100",
      items: [{ slug: "bone-verso", quantity: 3 }], // 3 * 99 = 297 (< 299), peso = 1200g
    });

    const pac = quote.options.find((o) => o.id === "pac");
    // Base 1990 + 200 (1kg adicional) = 2190
    expect(pac?.priceCents).toBe(2190);
  });

  it("rejects invalid inputs and non-existent catalog items", async () => {
    expect(
      freightServiceRequestSchema.safeParse({
        cep: "1234",
        items: [{ slug: "camiseta-exodo", quantity: 1 }],
      }).success,
    ).toBe(false);

    expect(
      freightServiceRequestSchema.safeParse({
        cep: "01310100",
        items: [],
      }).success,
    ).toBe(false);

    await expect(
      calculateFreightWithProvider({
        cep: "01310100",
        items: [{ slug: "produto-inexistente-xyz", quantity: 1 }],
      }),
    ).rejects.toThrow(/Produto não encontrado/);
  });
});
