import { Link } from "@tanstack/react-router";
import { money, type Product } from "@/data/products";
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/store/wishlist-context";

const vibrate = () =>
  typeof navigator !== "undefined" && navigator.vibrate && navigator.vibrate(10);

export function ProductCard({ product }: { product: Product }) {
  const prefersReducedMotion = useReducedMotion();
  const wishlist = useWishlist();
  const isFav = wishlist?.isFavorite(product.slug) ?? false;
  const [imgIndex, setImgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  return (
    <motion.article
      className="product-card group relative flex flex-col"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to="/produto/$slug"
        params={{ slug: product.slug }}
        aria-label={`Ver ${product.name}`}
        className="block relative focus-visible:outline-2 focus-visible:outline-brand"
      >
        <div className="product-photo relative aspect-[4/5] overflow-hidden bg-[#ECEBE7] dark:bg-[#1A1A1A] border border-border transition-colors duration-300">
          {/* Main image & Hover secondary image */}
          <div className="relative w-full h-full overflow-hidden">
            <motion.img
              src={product.images[0]}
              sizes="(min-width:1024px) 25vw, 50vw"
              alt={product.name}
              loading="lazy"
              width={1008}
              height={1200}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ease-out sm:group-hover:scale-[1.03] ${
                product.images[1] && isHovered ? "sm:opacity-0" : "opacity-100"
              }`}
            />
            {product.images[1] && (
              <motion.img
                src={product.images[1]}
                sizes="(min-width:1024px) 25vw, 50vw"
                alt={`${product.name} - detalhe`}
                loading="lazy"
                width={1008}
                height={1200}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out sm:group-hover:scale-[1.03] hidden sm:block ${
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
                    imgIndex === i ? "w-3 bg-[#0E0E0E]" : "w-1.5 bg-[#0E0E0E]/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Heart burst microinteraction */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.4, y: -15 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 m-auto flex items-center justify-center text-brand z-30 pointer-events-none"
              >
                <Heart size={44} fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge */}
          {product.badge && (
            <span className="product-badge absolute top-3 left-3 z-10 bg-[#0A0A0A] text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
              {product.badge}
            </span>
          )}

          {/* Wishlist toggle button */}
          <button
            type="button"
            className="absolute top-2.5 right-2.5 z-20 p-1.5 text-foreground/70 hover:text-foreground transition-all hover:scale-110"
            onClick={toggleFav}
            aria-label={
              isFav
                ? `Remover ${product.name} dos favoritos`
                : `Adicionar ${product.name} aos favoritos`
            }
            aria-pressed={isFav}
          >
            <Heart
              size={18}
              className="transition-transform duration-200"
              fill={isFav ? "var(--brand)" : "transparent"}
              stroke={isFav ? "var(--brand)" : "currentColor"}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Product meta & info: Name, Price, Colors */}
        <div className="product-info mt-3 flex flex-col items-start gap-1">
          <h3 className="product-name font-semibold text-xs sm:text-sm text-foreground uppercase tracking-wide truncate w-full">
            {product.shortName}
          </h3>
          <span className="product-price text-xs sm:text-sm font-semibold text-foreground/90">
            {money(product.priceCents)}
          </span>
          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {product.colors.map((c) => (
              <span
                key={c}
                className="swatch-dot"
                data-color={c.toLowerCase().replace(" ", "-")}
                title={c}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
