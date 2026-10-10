import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
export type CartItem = { product: Product; size: string; color: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, size: string, color: string, quantity: number) => void;
  update: (index: number, quantity: number) => void;
  remove: (index: number) => void;
  subtotal: number;
  count: number;
};
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
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
  return (
    <CartContext.Provider
      value={{
        items,
        open,
        setOpen,
        add,
        update,
        remove: (index) => setItems((prev) => prev.filter((_, i) => i !== index)),
        subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
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
