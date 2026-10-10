import { describe, expect, it } from "vitest";
import { checkoutRequestSchema } from "@/lib/checkout-schema";

const validRequest = {
  items: [{ slug: "camiseta-luz", size: "M", color: "Preto lavado", quantity: 1 }],
  payer: {
    name: "Ana Silva",
    surname: "Silva",
    email: "ana@example.com",
    phone: { area_code: "11", number: "988887777" },
    address: { zip_code: "01234567", street_name: "Rua A", street_number: "10" },
  },
  shipping_cep: "01234567",
  shipping_method: "pac",
};

describe("checkout request validation", () => {
  it("accepts a valid cart without any client price fields", () => {
    expect(checkoutRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejects manipulated price fields and extra request properties", () => {
    expect(
      checkoutRequestSchema.safeParse({
        ...validRequest,
        items: [{ ...validRequest.items[0], unit_price: 0 }],
      }).success,
    ).toBe(false);
    expect(checkoutRequestSchema.safeParse({ ...validRequest, total: 1 }).success).toBe(false);
  });

  it("rejects invalid quantities, CEPs, telephone numbers, and shipping identifiers", () => {
    expect(
      checkoutRequestSchema.safeParse({
        ...validRequest,
        items: [{ ...validRequest.items[0], quantity: 0 }],
      }).success,
    ).toBe(false);
    expect(checkoutRequestSchema.safeParse({ ...validRequest, shipping_cep: "123" }).success).toBe(
      false,
    );
    expect(
      checkoutRequestSchema.safeParse({
        ...validRequest,
        payer: { ...validRequest.payer, phone: { area_code: "1", number: "12" } },
      }).success,
    ).toBe(false);
    expect(
      checkoutRequestSchema.safeParse({ ...validRequest, shipping_method: "express" }).success,
    ).toBe(false);
  });

  it("requires payer and shipping CEPs to match", () => {
    expect(
      checkoutRequestSchema.safeParse({ ...validRequest, shipping_cep: "87654321" }).success,
    ).toBe(false);
  });
});
