import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { getProductBySlug, type Product } from "@/data/products";
import { toast } from "sonner";

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, size: string, color: string, quantity: number) => void;
  update: (index: number, quantity: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  saveForLater: (index: number, addToWishlist: (slug: string) => void) => void;
  subtotal: number;
  count: number;
  bumpCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export const STORAGE_KEY = "verso-cart";
export const CART_SCHEMA_VERSION = 1;

/**
 * Validates, migrates, and deduplicates raw storage input into valid CartItem array.
 */
export function parseStoredCart(rawString: string | null): CartItem[] {
  if (!rawString) return [];
  try {
    const parsed = JSON.parse(rawString);
    let rawList: unknown[] = [];

    // Support both envelope { version: 1, items: [...] } and direct array [...]
    if (
      parsed &&
      typeof parsed === "object" &&
      "items" in parsed &&
      Array.isArray((parsed as Record<string, unknown>)["items"])
    ) {
      rawList = (parsed as Record<string, unknown>)["items"] as unknown[];
    } else if (Array.isArray(parsed)) {
      rawList = parsed;
    } else {
      return [];
    }

    const validatedItems: CartItem[] = [];

    for (const raw of rawList) {
      if (!raw || typeof raw !== "object") continue;
      const r = raw as Record<string, unknown>;

      const rawProduct =
        r["product"] && typeof r["product"] === "object"
          ? (r["product"] as Record<string, unknown>)
          : null;

      const slug =
        typeof r["slug"] === "string"
          ? r["slug"]
          : typeof rawProduct?.["slug"] === "string"
            ? rawProduct["slug"]
            : null;

      if (!slug) continue;

      // 1. Valida se o produto ainda existe no catálogo oficial
      const currentProduct = getProductBySlug(slug);
      if (!currentProduct) continue; // Remove itens descontinuados

      const rawSize = typeof r["size"] === "string" ? r["size"] : "";
      const size = currentProduct.sizes.includes(rawSize)
        ? rawSize
        : (currentProduct.sizes[0] ?? "Único");

      const rawColor = typeof r["color"] === "string" ? r["color"] : "";
      const color = currentProduct.colors.includes(rawColor)
        ? rawColor
        : (currentProduct.colors[0] ?? "");

      const rawQty = typeof r["quantity"] === "number" ? r["quantity"] : 1;
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
          product: currentProduct,
          size,
          color,
          quantity,
        });
      }
    }

    return validatedItems;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [bumpCount, setBumpCount] = useState(0);
  const hydrated = useRef(false);

  // Hidratação segura a partir do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const validated = parseStoredCart(stored);
      setItems(validated);
    } catch {
      // Ignora erro de JSON corrompido
    }
    hydrated.current = true;
  }, []);

  // Sincronização entre abas (storage event)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const updated = parseStoredCart(event.newValue);
        setItems(updated);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Persistência com schema versioning e tratamento de cota
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      // Array com schema version flag em cada registro para compatibilidade total
      const payload = items.map((it) => ({
        product: { slug: it.product.slug },
        slug: it.product.slug,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        _schemaVersion: CART_SCHEMA_VERSION,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
    setBumpCount((b) => b + 1);
    setOpen(true);

    try {
      toast.success("Adicionado à sacola", {
        description: `${product.name} (${size} · ${color})`,
        action: {
          label: "Ver sacola",
          onClick: () => setOpen(true),
        },
      });
    } catch {
      // safe fallback if toast fails in testing env
    }
  }

  function update(index: number, quantity: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item,
      ),
    );
  }

  function remove(index: number) {
    const removedItem = items[index];
    if (!removedItem) return;

    setItems((prev) => prev.filter((_, i) => i !== index));

    try {
      toast("Item removido da sacola", {
        description: removedItem.product.name,
        action: {
          label: "Desfazer",
          onClick: () => {
            add(removedItem.product, removedItem.size, removedItem.color, removedItem.quantity);
          },
        },
      });
    } catch {
      // safe fallback
    }
  }

  function saveForLater(index: number, addToWishlist: (slug: string) => void) {
    const item = items[index];
    if (!item) return;

    addToWishlist(item.product.slug);
    setItems((prev) => prev.filter((_, i) => i !== index));

    try {
      toast.success("Salvo nos favoritos", {
        description: `${item.product.name} foi movido para sua lista de desejos.`,
      });
    } catch {
      // safe fallback
    }
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
        saveForLater,
        subtotal: items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0),
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        bumpCount,
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
