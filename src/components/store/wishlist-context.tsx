/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  toggleWishlist: (slug: string) => void;
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  clearWishlist: () => void;
  isFavorite: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("verso-wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Garante unicidade e strings válidas
          const valid = Array.from(
            new Set(parsed.filter((item): item is string => typeof item === "string")),
          );
          setItems(valid);
        }
      }
    } catch {
      // Ignorar dados corrompidos
    }
    setMounted(true);
  }, []);

  const saveItems = (newItems: string[]) => {
    const unique = Array.from(new Set(newItems));
    setItems(unique);
    try {
      localStorage.setItem("verso-wishlist", JSON.stringify(unique));
    } catch {
      // Ignorar cota de storage
    }
  };

  const toggleWishlist = (slug: string) => {
    if (!slug) return;
    setItems((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((i) => i !== slug) : [...prev, slug];
      const unique = Array.from(new Set(next));
      try {
        localStorage.setItem("verso-wishlist", JSON.stringify(unique));
      } catch {
        // Ignorar
      }
      return unique;
    });
  };

  const addFavorite = (slug: string) => {
    if (!slug) return;
    setItems((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem("verso-wishlist", JSON.stringify(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const removeFavorite = (slug: string) => {
    if (!slug) return;
    setItems((prev) => {
      const next = prev.filter((i) => i !== slug);
      try {
        localStorage.setItem("verso-wishlist", JSON.stringify(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const clearWishlist = () => {
    setItems([]);
    try {
      localStorage.removeItem("verso-wishlist");
    } catch {
      // Ignorar
    }
  };

  const isFavorite = (slug: string) => {
    if (!mounted || !slug) return false;
    return items.includes(slug);
  };

  const count = mounted ? items.length : 0;

  const value = {
    items,
    toggleWishlist,
    addFavorite,
    removeFavorite,
    clearWishlist,
    isFavorite,
    count,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
