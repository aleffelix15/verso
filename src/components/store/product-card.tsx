import { Link } from "@tanstack/react-router";
import { money, type Product } from "@/data/products";
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { useWishlist } from "@/components/store/wishlist-context";
import { QuickView } from "@/components/store/quick-view";
import { EASINGS, DURATIONS } from "@/lib/motion";

const vibrate = () =>
  typeof navigator !== "undefined" && navigator.vibrate && navigator.vibrate(10);

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const wishlist = useWishlist();
  const isFav = wishlist?.isFavorite(product.slug) ?? false;
  const [imgIndex, setImgIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset }: PanInfo) => {
    const swipe = offset.x;
    if (swipe < -40 && product.images[1]) {
      setImgIndex(1);
    } else if (swipe > 40 && product.images[1]) {
      setImgIndex(0);
    }
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    vibrate();
    wishlist?.toggleWishlist(product.slug);
    if (!isFav) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const cardVariants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATIONS.slow,
        ease: EASINGS.easeOut,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.06, 0.36),
      },
    },
  };

  return (
    <>
      <motion.article
        className="product-card group relative flex flex-col @container"
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-40px" }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Link
            to="/produto/$slug"
            params={{ slug: product.slug }}
            aria-label={`Ver ${product.name}`}
            className="block relative focus-visible:outline-2 focus-visible:outline-brand"
          >
            <div className="product-photo relative aspect-[4/5] overflow-hidden bg-[#ECEBE7] dark:bg-[#1A1A1A] border border-border transition-colors duration-300">
              {/* Main image & Hover secondary image with crossfade and smooth scale */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={product.images[0]}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  width={1008}
                  height={1200}
                  className={`w-full h-full object-cover transition-all duration-500 ease-out sm:group-hover:scale-[1.04] will-change-transform ${
                    product.images[1] && isHovered ? "sm:opacity-0" : "opacity-100"
                  }`}
                />
                {product.images[1] && (
                  <img
                    src={product.images[1]}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    alt={`${product.name} - detalhe`}
                    loading="lazy"
                    decoding="async"
                    width={1008}
                    height={1200}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out sm:group-hover:scale-[1.04] hidden sm:block will-change-transform ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Swipeable on mobile if second image exists */}
              {product.images[1] && (
                <motion.div
                  className="absolute inset-0 w-full h-full flex sm:hidden"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={{ x: imgIndex === 0 ? "0%" : "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {product.images.slice(0, 2).map((img, i) => (
                    <img
                      key={img}
                      src={img}
                      alt={`${product.name} - foto ${i + 1}`}
                      className="w-full h-full object-cover shrink-0 pointer-events-none"
                    />
                  ))}
                </motion.div>
              )}

              {/* Dots for mobile */}
              {product.images[1] && (
                <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-10 sm:hidden">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        imgIndex === i ? "w-3 bg-foreground" : "w-1.5 bg-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Heart burst microinteraction */}
              <AnimatePresence>
                {showHeart && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: [0.5, 1.45, 1], y: -15 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASINGS.easeOut }}
                    className="absolute inset-0 m-auto flex items-center justify-center text-brand z-30 pointer-events-none"
                  >
                    <Heart size={46} fill="currentColor" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badge */}
              {product.badge && (
                <span className="product-badge absolute top-3 left-3 z-10 bg-[#0A0A0A] text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
                  {product.badge}
                </span>
              )}

              {/* Quick View Button on Hover (Desktop) */}
              <button
                type="button"
                onClick={handleQuickView}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 absolute bottom-3 left-3 right-3 z-20 py-2.5 px-3 bg-background/90 backdrop-blur-sm text-foreground font-mono text-[10px] uppercase tracking-wider font-semibold border border-border opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-brand hover:text-white hover:border-brand"
                aria-label={`Visualização rápida de ${product.name}`}
              >
                <Eye size={13} /> Visualização Rápida
              </button>
            </div>
          </Link>

          {/* Wishlist toggle button with pop microinteraction */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            className="absolute top-2.5 right-2.5 z-20 p-2 text-foreground/75 hover:text-foreground transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand"
            onClick={toggleFav}
            aria-label={
              isFav
                ? `Remover ${product.name} dos favoritos`
                : `Adicionar ${product.name} aos favoritos`
            }
            aria-pressed={isFav}
          >
            <motion.div
              animate={isFav ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                size={18}
                fill={isFav ? "var(--brand)" : "transparent"}
                stroke={isFav ? "var(--brand)" : "currentColor"}
                strokeWidth={1.75}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Product meta & info: Name, Price, Colors */}
        <Link
          to="/produto/$slug"
          params={{ slug: product.slug }}
          className="product-info mt-3 flex flex-col items-start gap-1 focus-visible:outline-none"
        >
          <h3 className="product-name font-semibold text-xs sm:text-sm text-foreground uppercase tracking-wide truncate w-full">
            {product.shortName}
          </h3>
          <span className="product-price text-xs sm:text-sm font-semibold text-foreground/90">
            {money(product.priceCents)}
          </span>

          {/* Color swatches with animated ring */}
          <div
            className="flex items-center gap-1.5 mt-1.5"
            role="list"
            aria-label="Cores disponíveis"
          >
            {product.colors.map((c) => (
              <span
                key={c}
                role="listitem"
                className="swatch-dot transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-brand"
                data-color={c.toLowerCase().replace(" ", "-")}
                title={c}
              />
            ))}
          </div>
        </Link>
      </motion.article>

      {/* Quick View Dialog */}
      <QuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
