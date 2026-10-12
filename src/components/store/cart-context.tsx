import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { getProductBySlug, type Product } from "@/data/products";

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

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

const STORAGE_KEY = "verso-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const hydrated = useRef(false);

  // Hidratação segura a partir do localStorage com validação de catálogo e migração
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validatedItems: CartItem[] = [];

          for (const raw of parsed) {
            if (!raw || typeof raw !== "object") continue;

            const slug =
              typeof raw.slug === "string"
                ? raw.slug
                : typeof raw.product?.slug === "string"
                  ? raw.product.slug
                  : null;

            if (!slug) continue;

            // 1. Valida se o produto ainda existe no catálogo atual
            const currentProduct = getProductBySlug(slug);
            if (!currentProduct) continue; // Remove itens descontinuados

            const rawSize = typeof raw.size === "string" ? raw.size : "";
            const size = currentProduct.sizes.includes(rawSize)
              ? rawSize
              : (currentProduct.sizes[0] ?? "Único");

            const rawColor = typeof raw.color === "string" ? raw.color : "";
            const color = currentProduct.colors.includes(rawColor)
              ? rawColor
              : (currentProduct.colors[0] ?? "");

            const rawQty = typeof raw.quantity === "number" ? raw.quantity : 1;
            const quantity = Math.max(1, Math.min(10, Math.floor(rawQty)));

            // 2. Agrupa itens idênticos (mesmo slug, tamanho e cor)
            const existingIndex = validatedItems.findIndex(
              (it) => it.product.slug === slug && it.size === size && it.color === color,
            );

            if (existingIndex >= 0) {
              const existing = validatedItems[existingIndex];
              if (existing) {
                existing.quantity = Math.min(10, existing.quantity + quantity);
              }
            } else {
              validatedItems.push({
                product: currentProduct, // Preço e fotos sempre atualizados do catálogo oficial
                size,
                color,
                quantity,
              });
            }
          }

          setItems(validatedItems);
        }
      }
    } catch {
      // Ignora erro de JSON corrompido e inicia sacola limpa
    }
    hydrated.current = true;
  }, []);

  // Persistência com tratamento de cota de armazenamento
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignora erro de cota ou bloqueio de storage privado
    }
  }, [items]);

  function add(product: Product, size: string, color: string, quantity: number) {
    const validQty = Math.max(1, Math.min(10, quantity));
    setItems((prev) => {
      const index = prev.findIndex(
        (item) => item.product.slug === product.slug && item.size === size && item.color === color,
      );
      if (index < 0) return [...prev, { product, size, color, quantity: validQty }];
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.min(10, item.quantity + validQty) } : item,
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
