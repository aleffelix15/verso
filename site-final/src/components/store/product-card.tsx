import { Link } from "@tanstack/react-router";
import { money, type Product } from "@/data/products";
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";

const vibrate = () =>
  typeof navigator !== "undefined" && navigator.vibrate && navigator.vibrate(10);

export function ProductCard({ product }: { product: Product }) {
  const prefersReducedMotion = useReducedMotion();
  const [imgIndex, setImgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset }: PanInfo) => {
    const swipe = offset.x;
    if (swipe < -40 && product.images[1]) {
      setImgIndex(1);
    } else if (swipe > 40 && product.images[1]) {
      setImgIndex(0);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault();
    vibrate();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <motion.article
      className="product-card group relative"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
    >
      <Link
        to="/produto/$slug"
        params={{ slug: product.slug }}
        aria-label={`Ver ${product.name}`}
        className="block relative"
      >
        <div
          className="product-photo relative overflow-hidden bg-muted touch-pan-y"
          onDoubleClick={handleDoubleTap}
        >
          <motion.div
            className="w-full h-full flex"
            drag={product.images[1] ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={{ x: imgIndex === 0 ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {product.images.slice(0, 2).map((img, i) => (
              <motion.img
                key={img}
                src={img}
                sizes="(min-width:1024px) 25vw, 50vw"
                alt={`${product.name} - imagem ${i + 1}`}
                loading="lazy"
                width={1008}
                height={1200}
                initial={{ filter: prefersReducedMotion ? "blur(0px)" : "blur(10px)", opacity: 0 }}
                animate={{
                  filter: loaded ? "blur(0px)" : prefersReducedMotion ? "blur(0px)" : "blur(10px)",
                  opacity: loaded ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                onLoad={() => setLoaded(true)}
                className="w-full h-full object-cover shrink-0 pointer-events-none transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
              />
            ))}
          </motion.div>

          {/* Dots for mobile */}
          {product.images[1] && (
            <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-10 sm:hidden">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full ${imgIndex === i ? "bg-foreground" : "bg-foreground/40"}`}
                  animate={{ width: imgIndex === i ? 12 : 6 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          )}

          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.5, y: -20 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 m-auto flex items-center justify-center text-red-500 z-30 drop-shadow-md pointer-events-none"
              >
                <Heart size={48} fill="currentColor" />
                {!prefersReducedMotion &&
                  [...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: (Math.random() - 0.5) * 80,
                        y: (Math.random() - 0.5) * 80,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute bg-red-500 rounded-full w-2 h-2"
                    />
                  ))}
              </motion.div>
            )}
          </AnimatePresence>

          {product.badge && (
            <motion.span
              className="product-badge absolute top-3 left-3 z-10"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {product.badge}
            </motion.span>
          )}

          <div className="absolute bottom-0 left-0 w-full p-3 translate-y-4 opacity-0 transition-all duration-300 ease-out sm:group-hover:translate-y-0 sm:group-hover:opacity-100 hidden sm:block z-20">
            <div className="bg-background text-foreground text-center py-3 text-xs font-semibold w-full">
              VER PEÇA
            </div>
          </div>
        </div>
        <div className="product-info mt-3 flex justify-between items-start">
          <div>
            <div className="product-name font-semibold text-sm">{product.shortName}</div>
            <div className="product-meta text-xs text-muted-foreground mt-1">
              {product.category} · {product.colors[0]}
            </div>
          </div>
          <div className="product-price text-sm">{money(product.price)}</div>
        </div>
      </Link>
    </motion.article>
  );
}
