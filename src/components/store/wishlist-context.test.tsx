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

  it("should prevent duplicate items in wishlist", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addFavorite("produto-1");
      result.current.addFavorite("produto-1");
      result.current.addFavorite("produto-1");
    });

    expect(result.current.items).toEqual(["produto-1"]);
    expect(result.current.count).toBe(1);
  });

  it("should remove item directly with removeFavorite", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addFavorite("produto-1");
      result.current.addFavorite("produto-2");
    });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.removeFavorite("produto-1");
    });

    expect(result.current.items).toEqual(["produto-2"]);
    expect(result.current.count).toBe(1);
    expect(result.current.isFavorite("produto-1")).toBe(false);
    expect(result.current.isFavorite("produto-2")).toBe(true);
  });

  it("should clear the entire wishlist", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addFavorite("produto-1");
      result.current.addFavorite("produto-2");
    });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.clearWishlist();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(localStorage.getItem("verso-wishlist")).toBeNull();
  });

  it("should gracefully handle corrupted localStorage", () => {
    localStorage.setItem("verso-wishlist", "{corrupted_data");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it("should load existing items from localStorage on mount", () => {
    localStorage.setItem("verso-wishlist", JSON.stringify(["peça-1", "peça-2"]));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WishlistProvider>{children}</WishlistProvider>
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toEqual(["peça-1", "peça-2"]);
    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite("peça-1")).toBe(true);
  });
});
