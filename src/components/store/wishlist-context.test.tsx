import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { WishlistProvider, useWishlist } from "./wishlist-context";

describe("WishlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add, remove, and persist items", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    // Initial state
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);

    // Add item
    act(() => {
      result.current.toggleWishlist("produto-1");
    });

    expect(result.current.items).toContain("produto-1");
    expect(result.current.count).toBe(1);
    expect(result.current.isFavorite("produto-1")).toBe(true);

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem("verso-wishlist") || "[]");
    expect(stored).toContain("produto-1");

    // Remove item
    act(() => {
      result.current.toggleWishlist("produto-1");
    });

    expect(result.current.items).not.toContain("produto-1");
    expect(result.current.count).toBe(0);
    expect(result.current.isFavorite("produto-1")).toBe(false);
  });
});
