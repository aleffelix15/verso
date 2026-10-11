import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; size: string; color: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, size: string, color: string, quantity: number) => void;
  update: (index: number, quantity: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("verso-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignora erro de JSON inválido
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem("verso-cart", JSON.stringify(items));
    } catch {
      // Ignora erro de cota de storage
    }
  }, [items]);

  function add(product: Product, size: string, color: string, quantity: number) {
    setItems((prev) => {
      const index = prev.findIndex(
        (item) => item.product.slug === product.slug && item.size === size && item.color === color,
      );
      if (index < 0) return [...prev, { product, size, color, quantity }];
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item,
      );
    });
    setOpen(true);
  }

  function update(index: number, quantity: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item,
      ),
    );
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        open,
        setOpen,
        add,
        update,
        remove,
        clear,
        subtotal: items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0),
        count: items.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider required");
  return context;
}
