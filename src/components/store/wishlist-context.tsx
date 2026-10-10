/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  toggleWishlist: (slug: string) => void;
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
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignorar
    }
    setMounted(true);
  }, []);

  const toggleWishlist = (slug: string) => {
    setItems((prev) => {
      const next = prev.includes(slug) ? prev.filter((i) => i !== slug) : [...prev, slug];
      try {
        localStorage.setItem("verso-wishlist", JSON.stringify(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const isFavorite = (slug: string) => {
    if (!mounted) return false;
    return items.includes(slug);
  };

  const count = mounted ? items.length : 0;

  const value = { items, toggleWishlist, isFavorite, count };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
