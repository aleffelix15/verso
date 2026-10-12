import { describe, expect, it } from "vitest";
import { products, catalogCategories, catalogColors, provisionalImages } from "@/data/products";

describe("VERSO expanded catalog", () => {
  it("has 42 unique complete products in the six categories", () => {
    expect(products).toHaveLength(42);
    expect(new Set(products.map((p) => p.slug)).size).toBe(42);
    expect(new Set(products.map((p) => p.category)).size).toBe(6);
    products.forEach((p) => {
      expect(catalogCategories).toContain(p.category);
      expect(p.priceCents).toBeGreaterThan(0);
      expect(p.priceCents).toBeLessThanOrEqual(35000);
      expect(p.images[0]).toBeTruthy();
      expect(p.sizes.length).toBeGreaterThan(0);
      expect(p.colors.length).toBeGreaterThan(0);
      expect(p.colors.length).toBeLessThanOrEqual(3);
      p.colors.forEach((c) => expect(catalogColors).toContain(c));
      expect(p.verse && p.meaning && p.statement && p.fabric).toBeTruthy();
    });
  });

  it("preserves original products and prices", () => {
    expect(products.find((p) => p.slug === "camiseta-paz")?.priceCents).toBe(12900);
    expect(products.find((p) => p.slug === "camiseta-exodo")?.priceCents).toBe(13900);
    expect(products.find((p) => p.slug === "moletom-arca")?.priceCents).toBe(26900);
    expect(products.find((p) => p.slug === "jaqueta-vigia")?.priceCents).toBe(31900);
    expect(Object.keys(provisionalImages)).toEqual(["meias-passo", "mochila-jornada"]);
  });
});
