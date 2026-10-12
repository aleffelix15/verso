import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWishlist } from "@/components/store/wishlist-context";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, Trash2, ArrowRight, ShoppingBag, Eye, Check } from "lucide-react";
import { products, money, pageHead, type Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/favoritos")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Seus Favoritos",
      "Suas peças salvas na VERSO. Guarde suas escolhas e adicione à sacola quando quiser.",
      "/favoritos",
    ),
  component: FavoritosPage,
});

export function FavoritosPage() {
  const { items, removeFavorite, clearWishlist, count } = useWishlist();
  const cart = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const favoriteProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  const handleOpenAdd = (product: Product) => {
    const firstSize = product.sizes[0];
    const firstColor = product.colors[0];
    if (product.sizes.length === 1 && product.colors.length === 1 && firstSize && firstColor) {
      cart.add(product, firstSize, firstColor, 1);
      setAddedSlug(product.slug);
      setTimeout(() => setAddedSlug(null), 1800);
      return;
    }
    setSelectedProduct(product);
    setSelectedSize(product.sizes.length === 1 ? (firstSize ?? "") : "");
    setSelectedColor(firstColor ?? "");
    setError("");
  };

  const handleConfirmAdd = () => {
    if (!selectedProduct) return;
    if (!selectedSize || !selectedColor) {
      setError("Por favor, selecione o tamanho e a cor antes de continuar.");
      return;
    }
    cart.add(selectedProduct, selectedSize, selectedColor, 1);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] min-h-[75vh] transition-colors duration-200">
      {/* PAGE HEADER */}
      <div className="container-verso pt-10 sm:pt-14 pb-8 border-b border-black/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
              VERSO / LISTA DE DESEJOS
            </p>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5]">
                SEUS FAVORITOS
              </h1>
              {count > 0 && (
                <span className="font-mono text-xs sm:text-sm bg-[#0E0E0E] text-[#EDEAE4] dark:bg-[#FF4D00] dark:text-white px-2.5 py-1 font-bold">
                  {count} {count === 1 ? "PEÇA" : "PEÇAS"}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {count > 0 && (
              <Button
                variant="ghost"
                onClick={clearWishlist}
                className="text-xs font-mono text-[#0E0E0E]/60 dark:text-[#A0A0A0] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] px-2 h-auto py-1 uppercase tracking-wider"
              >
                Limpar lista
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="border-black/20 dark:border-white/20 text-xs text-[#0E0E0E] dark:text-[#EDEAE4]"
            >
              <Link to="/loja" className="inline-flex items-center gap-2">
                CONTINUAR COMPRANDO <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container-verso py-12">
        {favoriteProducts.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-lg mx-auto"
          >
            <div className="size-20 rounded-full bg-[#E5E2DC] dark:bg-[#262626] flex items-center justify-center mb-6 text-[#0E0E0E]/40 dark:text-white/40">
              <Heart size={36} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5] mb-3">
              Você ainda não salvou suas peças favoritas
            </h2>
            <p className="text-sm text-[#0E0E0E]/70 dark:text-[#A0A0A0] leading-relaxed mb-8">
              Explore nossa loja, conheça os versos e referências de cada peça e clique no ícone de
              coração para guardar o que você mais gostou.
            </p>
            <Link
              to="/loja"
              className="inline-flex items-center gap-3 bg-[#FF4D00] text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#E04400] transition-colors shadow-sm"
            >
              EXPLORAR A LOJA <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          /* FILLED GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence>
              {favoriteProducts.map((p) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#F5F2EB] dark:bg-[#262626] border border-black/10 dark:border-white/10 flex flex-col group"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E6E1]">
                    <Link to="/produto/$slug" params={{ slug: p.slug }}>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFavorite(p.slug)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-[#0E0E0E] dark:text-[#EDEAE4] hover:text-[#FF4D00] transition-colors shadow-xs"
                      aria-label={`Remover ${p.name} dos favoritos`}
                      title="Remover dos favoritos"
                    >
                      <Trash2 size={16} />
                    </button>
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-[#0E0E0E] text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Info area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-mono text-[10px] text-[#FF4D00] font-semibold uppercase tracking-wider">
                          [ {p.verse} ] · {p.category}
                        </span>
                      </div>
                      <Link
                        to="/produto/$slug"
                        params={{ slug: p.slug }}
                        className="font-semibold text-sm text-[#0E0E0E] dark:text-[#F5F5F5] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] transition-colors line-clamp-1 block mb-2"
                      >
                        {p.name}
                      </Link>
                      <div className="text-sm font-bold text-[#0E0E0E] dark:text-[#F5F5F5] mb-3">
                        {money(p.priceCents)}
                      </div>
                      <div className="text-[11px] text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-4 font-mono">
                        Tamanhos: {p.sizes.join(", ")}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                      <Button
                        variant="brand"
                        className="w-full text-xs h-10 tracking-wider flex items-center justify-center gap-2"
                        onClick={() => handleOpenAdd(p)}
                      >
                        {addedSlug === p.slug ? (
                          <>
                            <Check size={15} /> ADICIONADO
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} /> ADICIONAR À SACOLA
                          </>
                        )}
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full text-xs h-8 text-[#0E0E0E]/70 dark:text-[#EDEAE4]/70 hover:text-[#0E0E0E] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <Link to="/produto/$slug" params={{ slug: p.slug }}>
                          <Eye size={14} className="mr-1.5" /> Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* QUICK VARIANT SELECTION DIALOG */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="max-w-md bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] border-black/10 dark:border-white/10">
            <DialogTitle className="font-display text-2xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5]">
              ESCOLHA TAMANHO E COR
            </DialogTitle>
            <DialogDescription className="text-xs text-[#0E0E0E]/70 dark:text-[#A0A0A0]">
              Selecione suas preferências para adicionar {selectedProduct.name} à sua sacola.
            </DialogDescription>
            <div className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#0E0E0E]/70 dark:text-[#A0A0A0] mb-2">
                  Cor
                </label>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        setError("");
                      }}
                      className={`px-3 py-2 text-xs border transition-colors ${
                        selectedColor === c
                          ? "border-[#FF4D00] bg-[#FF4D00] text-white font-semibold"
                          : "border-black/20 dark:border-white/20 bg-white dark:bg-[#262626] text-[#0E0E0E] dark:text-[#EDEAE4] hover:border-[#FF4D00]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#0E0E0E]/70 dark:text-[#A0A0A0] mb-2">
                  Tamanho
                </label>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSize(s);
                        setError("");
                      }}
                      className={`min-w-10 px-3 py-2 text-xs border text-center transition-colors ${
                        selectedSize === s
                          ? "border-[#FF4D00] bg-[#FF4D00] text-white font-semibold"
                          : "border-black/20 dark:border-white/20 bg-white dark:bg-[#262626] text-[#0E0E0E] dark:text-[#EDEAE4] hover:border-[#FF4D00]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-xs text-[#FF4D00] font-medium">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <Button
                  variant="brand"
                  className="w-full h-11 text-xs tracking-wider"
                  onClick={handleConfirmAdd}
                >
                  CONFIRMAR E ADICIONAR
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
