import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Check } from "lucide-react";
import { money, type Product } from "@/data/products";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cart = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImg, setActiveImg] = useState<number>(0);

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || "Único";
  const currentColor = selectedColor || product.colors[0] || "";

  const handleAddToCart = () => {
    cart.add(product, currentSize, currentColor, 1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="max-w-2xl bg-card text-foreground border-border p-6 sm:p-8 overflow-y-auto max-h-[90svh]"
      >
        <DialogTitle className="sr-only">{product.name} — Visualização Rápida</DialogTitle>
        <DialogDescription className="sr-only">
          Escolha tamanho e cor para adicionar rapidamente à sacola.
        </DialogDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Photos */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] bg-surface overflow-hidden border border-border">
              <img
                src={product.images[activeImg] ?? product.images[0]}
                alt={product.name}
                width={500}
                height={600}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#0A0A0A] text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`relative w-14 h-16 border overflow-hidden transition-all ${
                      activeImg === i
                        ? "border-brand ring-1 ring-brand"
                        : "border-border opacity-70"
                    }`}
                    aria-label={`Ver foto ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-between h-full pt-1">
            <div>
              <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-semibold block mb-1">
                {product.verse} · {product.category}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-foreground leading-tight">
                {product.name}
              </h2>
              <div className="mt-2 text-base font-semibold text-foreground">
                {money(product.priceCents)}
              </div>

              <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {product.statement || product.meaning}
              </p>

              {/* Color selection */}
              <div className="mt-5">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">
                  Cor: <strong className="text-foreground">{currentColor}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => {
                    const isSelected = currentColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`relative size-7 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "border-brand ring-2 ring-brand ring-offset-2 ring-offset-card"
                            : "border-border"
                        }`}
                        title={c}
                        aria-label={`Cor ${c}`}
                      >
                        <span
                          className="swatch-dot size-4"
                          data-color={c.toLowerCase().replace(" ", "-")}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size selection */}
              <div className="mt-5">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">
                  Tamanho: <strong className="text-foreground">{currentSize}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = currentSize === s;
                    return (
                      <Button
                        key={s}
                        type="button"
                        variant={isSelected ? "brand" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(s)}
                        className="min-w-10 h-9 text-xs font-mono rounded-none"
                      >
                        {s}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3">
              <Button
                variant="brand"
                className="w-full h-12 uppercase font-mono text-xs tracking-wider gap-2 rounded-none"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} /> Adicionar à sacola
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                <Link
                  to="/produto/$slug"
                  params={{ slug: product.slug }}
                  onClick={() => onOpenChange(false)}
                >
                  Ver todos os detalhes da peça <ArrowRight size={13} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
