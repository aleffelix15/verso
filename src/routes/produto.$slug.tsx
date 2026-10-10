import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, Suspense } from "react";
import {
  Minus,
  Plus,
  ArrowUpRight,
  ZoomIn,
  Ruler,
  ShoppingBag,
  Check,
  Box,
  Heart,
  Truck,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { products, pageHead, money, type Product } from "@/data/products";
import { useCart } from "@/components/store/cart-context";
import { useWishlist } from "@/components/store/wishlist-context";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modelsRegistry } from "@/components/three/registry";
import { ClientOnly } from "@/components/three/client-only";
import { Scene } from "@/components/three/scene";
import { ThreeErrorBoundary } from "@/components/three/three-error-boundary";
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
  const wishlist = useWishlist();
  const isFav = wishlist?.isFavorite(p.slug) ?? false;
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [color, setColor] = useState(p.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<number | "3d">(0);
  const [zoom, setZoom] = useState(false);
  const [guide, setGuide] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const Model = modelsRegistry[p.slug];

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
        <div className="flex flex-col-reverse md:flex-row gap-3 items-start w-full">
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto snap-x snap-mandatory w-full md:w-[80px] md:shrink-0 hide-scrollbar pb-2 md:pb-0">
            {p.images.map((img, i) => (
              <Button
                variant="size"
                className="h-[100px] min-w-[80px] p-0 relative shrink-0 snap-center overflow-hidden rounded-md"
                key={img}
                onClick={() => setImage(i)}
                aria-label={`Foto ${i + 1}`}
              >
                {i === image && (
                  <motion.div
                    layoutId="imgIndicator"
                    className="absolute inset-0 border-2 border-primary z-10 pointer-events-none rounded-md"
                  />
                )}
                <img
                  src={img}
                  alt={`Ângulo ${i + 1}`}
                  width={80}
                  height={100}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </Button>
            ))}
            {Model && (
              <Button
                variant="size"
                className="h-[100px] min-w-[80px] p-0 relative flex flex-col items-center justify-center bg-muted/30 shrink-0 snap-center rounded-md"
                onClick={() => setImage("3d")}
                aria-label="Ver em 3D"
              >
                {image === "3d" && (
                  <motion.div
                    layoutId="imgIndicator"
                    className="absolute inset-0 border-2 border-primary z-10 pointer-events-none rounded-md"
                  />
                )}
                <Box className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] font-bold mt-1 text-muted-foreground tracking-widest">
                  3D
                </span>
              </Button>
            )}
          </div>
          <div className="flex-1 w-full shrink-0 min-w-0">
            {image === "3d" && Model ? (
              <div className="relative w-full overflow-hidden bg-muted flex aspect-[4/5] md:aspect-[5/6] rounded-md">
                <ClientOnly>
                  <Suspense
                    fallback={
                      <img
                        src={p.images[0]}
                        alt="Carregando 3D"
                        className="opacity-50 object-cover w-full h-full"
                      />
                    }
                  >
                    <ThreeErrorBoundary fallbackImage={p.images[0] ?? ""}>
                      <Scene animated={!prefersReducedMotion}>
                        <Model autoRotate={!prefersReducedMotion} />
                      </Scene>
                    </ThreeErrorBoundary>
                  </Suspense>
                </ClientOnly>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="relative h-auto w-full p-0 overflow-hidden bg-muted aspect-[4/5] md:aspect-[5/6] rounded-md"
                onClick={() => setZoom(true)}
                aria-label="Ampliar foto do produto"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={image as number}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={p.images[image as number]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    width={1008}
                    height={1200}
                    fetchPriority="high"
                  />
                </AnimatePresence>
                <div className="absolute bottom-4 right-4 bg-background/50 rounded-full p-2 backdrop-blur-md">
                  <ZoomIn className="size-5" />
                </div>
              </Button>
            )}
          </div>
        </div>
        <div className="product-detail md:sticky md:top-24 h-max">
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
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 border-border rounded-none"
              onClick={() => wishlist?.toggleWishlist(p.slug)}
              aria-pressed={isFav}
              aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className="transition-colors"
                fill={isFav ? "var(--brand)" : "none"}
                stroke={isFav ? "var(--brand)" : "currentColor"}
              />
            </Button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-4 p-4 border border-border bg-muted/50 rounded-md">
              <Truck className="size-5 shrink-0 text-brand" />
              <div>
                <span className="block text-sm font-bold">Frete Grátis</span>
                <span className="text-xs text-muted-foreground">Para compras acima de R$ 299</span>
              </div>
            </div>
            <div className="flex gap-4 p-4 border border-border bg-muted/50 rounded-md">
              <RefreshCcw className="size-5 shrink-0 text-brand" />
              <div>
                <span className="block text-sm font-bold">Primeira troca grátis</span>
                <span className="text-xs text-muted-foreground">Até 7 dias após o recebimento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABAS E O VERSO */}
      <section className="container-verso section-space pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-12">
            <div className="product-verse p-8 bg-muted rounded-md border border-border">
              <p className="eyebrow">O VERSO / [ {p.verse} ]</p>
              <h2 className="my-4 text-3xl font-display uppercase italic">{p.statement}</h2>
              <p className="text-muted-foreground">{p.meaning}</p>
            </div>

            <Tabs defaultValue="detalhes" className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 flex-wrap">
                <TabsTrigger
                  value="detalhes"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger
                  value="tecido"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Tecido
                </TabsTrigger>
                <TabsTrigger
                  value="medidas"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Medidas
                </TabsTrigger>
                <TabsTrigger
                  value="envio"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Envio
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="detalhes"
                className="text-sm text-muted-foreground leading-relaxed mt-4"
              >
                Modelagem ampla e acabamento reforçado. Referência bíblica discreta, no detalhe.
                Confira as medidas antes de escolher. Nossas peças são feitas com foco no conforto e
                na durabilidade.
              </TabsContent>
              <TabsContent
                value="tecido"
                className="text-sm text-muted-foreground leading-relaxed mt-4"
              >
                {p.fabric} Lave do avesso com água fria. Não use alvejante. Seque à sombra. Não
                passe diretamente sobre etiquetas ou estampas.
              </TabsContent>
              <TabsContent
                value="medidas"
                className="text-sm text-muted-foreground leading-relaxed mt-4"
              >
                As medidas podem variar até 2cm. Recomendamos medir uma peça sua que veste bem e
                comparar com o nosso guia. Na dúvida entre dois tamanhos, escolha o maior para um
                caimento mais solto (oversized).
              </TabsContent>
              <TabsContent
                value="envio"
                className="text-sm text-muted-foreground leading-relaxed mt-4"
              >
                Direito de arrependimento em até 7 dias após o recebimento. A primeira troca é por
                nossa conta. Processamos seu pedido em até 2 dias úteis.
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden md:block h-full min-h-[500px] w-full rounded-md overflow-hidden bg-muted">
            <img
              src={p.images[p.images.length - 1]}
              alt={`Detalhe macro de ${p.name}`}
              loading="lazy"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
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
            src={image === "3d" ? p.images[0] : p.images[image as number]}
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
            <div className="flex gap-2">
              <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }} className="flex-1">
                <Button
                  variant="brand"
                  className="h-12 min-w-0 w-full px-3 text-xs overflow-hidden relative"
                  onClick={() => {
                    if (!size || !color) {
                      setError("Escolha o tamanho e a cor antes de continuar.");
                      window.scrollTo({ top: 0, behavior: "smooth" });
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
                        <ShoppingBag size={16} /> Adicionar
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 border-border rounded-none bg-background"
                onClick={() => wishlist?.toggleWishlist(p.slug)}
                aria-pressed={isFav}
                aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart
                  className="transition-colors"
                  fill={isFav ? "var(--brand)" : "none"}
                  stroke={isFav ? "var(--brand)" : "currentColor"}
                />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
