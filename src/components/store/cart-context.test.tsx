import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CartProvider, useCart } from "./cart-context";
import type { Product } from "@/data/products";

const mockProduct: Product = {
  slug: "camiseta-luz",
  name: "Camiseta Oversized “Luz”",
  shortName: "Camiseta Oversized “Luz”",
  priceCents: 12900,
  category: "Camisetas",
  images: ["/test-img.jpg"],
  sizes: ["P", "M", "G", "GG"],
  colors: ["Preto lavado", "Off-white"],
  verse: "JO 1:5",
  meaning: "A luz continua acesa.",
  statement: "A LUZ NÃO SE APAGA.",
  fabric: "100% algodão penteado",
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add items, update quantities, remove and clear cart", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);

    // Add item
    act(() => {
      result.current.add(mockProduct, "M", "Preto lavado", 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(25800);
    expect(result.current.open).toBe(true);

    // Update quantity
    act(() => {
      result.current.update(0, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.count).toBe(3);
    expect(result.current.subtotal).toBe(38700);

    // Remove item
    act(() => {
      result.current.remove(0);
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("should persist cart to localStorage and restore on mount", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );

    const { result, unmount } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct, "G", "Off-white", 1);
    });

    const stored = JSON.parse(localStorage.getItem("verso-cart") || "[]");
    expect(stored.length).toBe(1);
    expect(stored[0].product.slug).toBe("camiseta-luz");
    expect(stored[0].size).toBe("G");

    unmount();

    // Re-mount and check hydration from localStorage
    const { result: rehydrated } = renderHook(() => useCart(), { wrapper });
    expect(rehydrated.current.items.length).toBe(1);
    expect(rehydrated.current.items[0].product.slug).toBe("camiseta-luz");
    expect(rehydrated.current.items[0].size).toBe("G");
  });

  it("should clear all items with clear()", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct, "P", "Off-white", 1);
      result.current.add(mockProduct, "M", "Off-white", 2);
    });

    expect(result.current.count).toBe(3);

    act(() => {
      result.current.clear();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
  });
});
