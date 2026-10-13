import { useState, useEffect } from "react";
import { ProductCard } from "@/components/store/product-card";
import { getRecentlyViewedProducts, clearRecentlyViewed } from "@/lib/recently-viewed";
import type { Product } from "@/data/products";
import { Trash2 } from "lucide-react";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getRecentlyViewedProducts(excludeSlug));
    setMounted(true);
  }, [excludeSlug]);

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  if (!mounted || items.length === 0) return null;

  return (
    <section className="container-verso section-space border-t border-border bg-background text-foreground content-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow-red mb-2">SEU HISTÓRICO</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-foreground">
            VISTOS RECENTEMENTE
          </h2>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-brand transition-colors"
          aria-label="Limpar histórico de produtos vistos recentemente"
        >
          <Trash2 size={13} /> Limpar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {items.map((product, idx) => (
          <ProductCard key={product.slug} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
