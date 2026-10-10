import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Minus, Plus, ArrowUpRight, ZoomIn, Ruler, ShoppingBag, Check } from "lucide-react";
import { products, pageHead, money, type Product } from "@/data/products";
import { useCart } from "@/components/store/cart-context";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";

export const Route = createFileRoute("/produto/$slug")({
  staticData: { sitemap: true },
  head: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    return pageHead(
      p?.name ?? "Peça não encontrada",
      p
        ? `${p.name}. ${p.meaning} Conheça os detalhes e escolha seu tamanho.`
        : "Esta peça não está disponível.",
      `/produto/${params.slug}`,
    );
  },
  component: ProductPage,
});
function ProductPage() {
  const { slug } = Route.useParams();
  const product = products.find((p) => p.slug === slug);
  if (!product)
    return (
      <section className="container-verso section-space">
        <h1 className="text-5xl">PEÇA NÃO ENCONTRADA.</h1>
        <Button asChild className="mt-6" variant="brand">
          <Link to="/loja">Voltar para a loja</Link>
        </Button>
      </section>
    );
  return <ProductDetails key={slug} product={product} />;
}
function ProductDetails({ product: p }: { product: Product }) {
  const cart = useCart();
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [color, setColor] = useState(p.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [guide, setGuide] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const addToCartRef = useRef(null);
  const isAddToCartInView = useInView(addToCartRef, { margin: "0px 0px -100px 0px" });

  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || window.innerWidth <= 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  }
  function resetMouse() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-verso pt-7">
        <Link to="/loja" className="eyebrow">
          LOJA
        </Link>
        <span className="eyebrow text-muted-foreground">
          {" "}
          / {p.category} / {p.verse}
        </span>
      </div>
      <section className="container-verso product-layout">
        <div>
          <Button
            variant="ghost"
            className="relative h-auto w-full p-0 overflow-hidden"
            onClick={() => setZoom(true)}
            aria-label="Ampliar foto do produto"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={p.images[image]}
                alt={p.name}
                className="product-main-photo object-cover"
                width={1008}
                height={1200}
              />
            </AnimatePresence>
            <ZoomIn className="absolute bottom-4 right-4" />
          </Button>
          <div className="mt-3 flex gap-3">
            {p.images.map((img, i) => (
              <Button
                variant="size"
                className="h-auto w-16 p-0 relative"
                key={img}
                onClick={() => setImage(i)}
                aria-label={`Foto ${i + 1}`}
              >
                {i === image && (
                  <motion.div
                    layoutId="imgIndicator"
                    className="absolute inset-0 border-2 border-primary z-10 pointer-events-none"
                  />
                )}
                <img
                  src={img}
                  alt={`Ângulo ${i + 1}`}
                  width={64}
                  height={76}
                  className="h-20 w-16 object-cover"
                />
              </Button>
            ))}
          </div>
        </div>
        <div className="product-detail">
          <p className="eyebrow">DROP 001 / {p.verse}</p>
          <h1>{p.name}</h1>
          <div className="text-xl">{money(p.priceCents)}</div>
          <p className="mt-2 text-muted-foreground">
            ou 3x de {money(Math.round(p.priceCents / 3))} sem juros
          </p>
          <p className="mt-6">
            Corte livre. Presença discreta. Uma peça feita pra acompanhar você — e o que você
            acredita.
          </p>
          <div className="option-label">
            <span>COR {color && `/ ${color.toUpperCase()}`}</span>
          </div>
          <div className="flex gap-2">
            {p.colors.map((c) => (
              <Button
                key={c}
                variant="size"
                size="icon"
                className="relative"
                onClick={() => {
                  setColor(c);
                  setError("");
                }}
                aria-label={`Cor ${c}`}
              >
                {color === c && (
                  <motion.div
                    layoutId="colorIndicator"
                    className="absolute inset-0 border-2 border-primary rounded-md z-10 pointer-events-none"
                  />
                )}
                <span className="swatch" data-color={c.toLowerCase().replace(" ", "-")} />
              </Button>
            ))}
          </div>
          <div className="option-label">
            <span>TAMANHO {size && `/ ${size}`}</span>
            <Button variant="ghost" className="h-auto p-0 text-xs" onClick={() => setGuide(true)}>
              <Ruler size={13} />
              Guia de medidas
            </Button>
          </div>
          <div className="size-selector">
            {p.sizes.map((s) => (
              <Button
                key={s}
                variant="size"
                className="h-11 min-w-12 relative"
                onClick={() => {
                  setSize(s);
                  setError("");
                }}
              >
                {size === s && (
                  <motion.div
                    layoutId="sizeIndicator"
                    className="absolute inset-0 border-2 border-primary rounded-md bg-primary/5 z-0 pointer-events-none"
                  />
                )}
                <span className="relative z-10">{s}</span>
              </Button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-primary">
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-3" ref={addToCartRef}>
            <div className="flex shrink-0 items-center border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-12"
                disabled={quantity === 1}
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((n) => Math.max(1, n - 1))}
              >
                <Minus />
              </Button>
              <span className="w-5 text-center text-xs">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-12"
                disabled={quantity === 10}
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((n) => Math.min(10, n + 1))}
              >
                <Plus />
              </Button>
            </div>
            <motion.div
              className="flex-1"
              style={{ x: springX, y: springY }}
              onMouseMove={handleMouse}
              onMouseLeave={resetMouse}
            >
              <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}>
                <Button
                  variant="brand"
                  className="h-12 min-w-0 w-full px-3 text-xs sm:text-xs overflow-hidden relative"
                  onClick={() => {
                    if (!size || !color) {
                      setError("Escolhe o tamanho e a cor antes de continuar.");
                      return;
                    }
                    if (typeof navigator !== "undefined" && navigator.vibrate)
                      navigator.vibrate(10);
                    cart.add(p, size, color, quantity);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                  }}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center gap-2"
                      >
                        <Check size={16} /> Adicionado
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={16} /> Adicionar à sacola
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Frete grátis acima de R$ 299. Produto demonstrativo.
          </p>
          <div className="accordions">
            {[
              [
                "Descrição",
                "Modelagem ampla e acabamento reforçado. Referência bíblica discreta, no detalhe. Confira as medidas antes de escolher.",
              ],
              ["Tecido", p.fabric],
              [
                "Cuidados",
                "Lave do avesso com água fria. Não use alvejante. Seque à sombra. Não passe diretamente sobre etiquetas ou estampas.",
              ],
              [
                "Troca e devolução",
                "Direito de arrependimento em até 7 dias após o recebimento. Condições adicionais e atendimento serão confirmados na abertura da loja.",
              ],
            ].map(([title, text]) => (
              <details key={title}>
                <summary>{title}</summary>
                <p>{text}</p>
              </details>
            ))}
          </div>
          <div className="product-verse">
            <p className="eyebrow">O VERSO / [ {p.verse} ]</p>
            <h2 className="my-4 text-3xl">{p.statement}</h2>
            <p className="text-muted-foreground">{p.meaning}</p>
          </div>
        </div>
      </section>
      <section className="container-verso section-space border-t border-border">
        <div className="section-heading">
          <h2 className="section-title">NO MESMO PROPÓSITO.</h2>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.slug !== p.slug)
            .slice(0, 4)
            .map((x) => (
              <ProductCard product={x} key={x.slug} />
            ))}
        </div>
      </section>
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{p.name} — foto ampliada</DialogTitle>
          <DialogDescription className="sr-only">Detalhes da peça.</DialogDescription>
          <img
            src={p.images[image]}
            alt={p.name}
            className="max-h-[78svh] w-full object-contain"
            width={1008}
            height={1200}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent>
          <DialogTitle className="font-display text-3xl">GUIA DE MEDIDAS</DialogTitle>
          <DialogDescription>
            Medidas demonstrativas em centímetros. Meça uma peça sua de corte semelhante.
          </DialogDescription>
          {p.sizes.length === 1 ? (
            <p className="text-sm">Tamanho único. Circunferência ajustável: 54–60 cm.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3">Tamanho</th>
                  <th>Largura</th>
                  <th>Comprimento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["P", "56", "70"],
                  ["M", "59", "73"],
                  ["G", "62", "76"],
                  ["GG", "65", "79"],
                ].map((row) => (
                  <tr className="border-b border-border" key={row[0]}>
                    {row.map((c) => (
                      <td className="py-3" key={c}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="text-xs text-muted-foreground">
            Para a calça, largura corresponde à cintura da peça aberta. Tolerância de ±2 cm. Medidas
            finais precisam de confirmação.
          </p>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        {!isAddToCartInView && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 w-full z-50 p-4 pb-safe bg-background/90 backdrop-blur-md border-t border-border sm:hidden"
          >
            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}>
              <Button
                variant="brand"
                className="h-12 min-w-0 w-full px-3 text-xs overflow-hidden relative"
                onClick={() => {
                  if (!size || !color) {
                    setError("Escolhe o tamanho e a cor antes de continuar.");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                  }
                  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
                  cart.add(p, size, color, quantity);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.div
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} /> Adicionado
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={16} /> Adicionar
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
