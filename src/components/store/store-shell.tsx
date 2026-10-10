import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  Search,
  ShoppingBag,
  Menu,
  ArrowUpRight,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  Instagram,
  CreditCard,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "./cart-context";
import { products, money, storeConfig } from "@/data/products";
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { calculateFreight } from "@/server/shipping";
import { createPaymentPreference } from "@/server/checkout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "DDD + Número"),
  zip_code: z.string().min(8, "CEP inválido"),
  street_name: z.string().min(2, "Rua inválida"),
  street_number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "UF inválida"),
});


export function StoreShell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [policy, setPolicy] = useState("");
  const cart = useCart();
  const results = products.filter((p) =>
    `${p.name} ${p.verse} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  const [hiddenHeader, setHiddenHeader] = useState(false);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [loading, setLoading] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHiddenHeader(true);
    } else {
      setHiddenHeader(false);
    }
  });

  useEffect(() => {
    let lenis: Lenis | undefined;
    let rafId: number;
    if (window.matchMedia("(min-width: 768px)").matches && !prefersReducedMotion) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    const t = setTimeout(() => setLoading(false), 800);

    return () => {
      lenis?.destroy();
      cancelAnimationFrame(rafId);
      clearTimeout(t);
    };
  }, [prefersReducedMotion]);
  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-4xl font-display tracking-tight"
            >
              VERSO<span className="text-primary">.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div
        className="marquee"
        aria-label="Frete grátis acima de R$ 299, Drop 01 disponível, parcele em 3x"
      >
        <div className="marquee-track" style={prefersReducedMotion ? { animationPlayState: "paused" } : {}}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              FRETE GRÁTIS ACIMA DE R$ 299 <span className="text-primary">•</span> DROP 01
              DISPONÍVEL <span className="text-primary">•</span> PARCELE EM 3X
            </span>
          ))}
        </div>
      </div>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hiddenHeader ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="site-header container-verso sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      >
        <Link to="/" className="brand" aria-label="VERSO — início">
          VERSO<span className="text-primary">.</span>
        </Link>
        <nav className="site-nav" aria-label="Menu principal">
          <Link to="/loja">Loja</Link>
          <Link to="/drops">Drops</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Button
            variant="header"
            size="icon"
            aria-label="Buscar produtos"
            title="Buscar"
            onClick={() => setSearch(true)}
          >
            <Search size={19} />
          </Button>
          <Button
            variant="header"
            size="icon"
            aria-label={`Abrir sacola, ${cart.count} itens`}
            title="Sacola"
            onClick={() => cart.setOpen(true)}
            className="relative"
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.span 
                  key={cart.count}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 top-0 grid size-4 place-items-center bg-primary text-[9px] text-primary-foreground"
                >
                  {cart.count}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <Button
            variant="header"
            size="icon"
            className="sm:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </motion.header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container-verso">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="brand">
                VERSO<span className="text-primary">.</span>
              </Link>
              <p className="mt-4 text-xs text-chalk">Fé que veste. Propósito que fica.</p>
              <p className="eyebrow mt-5 text-chalk">FEITO PARA A RUA. NÃO PARA UMA CAIXA.</p>
            </div>
            <div className="footer-links">
              <p className="footer-heading">EXPLORAR</p>
              <Link to="/loja">Todas as peças</Link>
              <Link to="/drops">Drop 01</Link>
              <Link to="/sobre">Nossa história</Link>
              <Link to="/contato">Fala com a gente</Link>
            </div>
            <div className="footer-links">
              <p className="footer-heading">INFORMAÇÕES</p>
              <Button
                variant="header"
                className="h-auto justify-start p-0 text-[11px]"
                onClick={() => setPolicy("Trocas e devoluções")}
              >
                Trocas e devoluções
              </Button>
              <Button
                variant="header"
                className="h-auto justify-start p-0 text-[11px]"
                onClick={() => setPolicy("Entrega e frete")}
              >
                Entrega e frete
              </Button>
              <Button
                variant="header"
                className="h-auto justify-start p-0 text-[11px]"
                onClick={() => setPolicy("Privacidade")}
              >
                Privacidade
              </Button>
            </div>
            <div className="footer-links">
              <p className="footer-heading">CONECTE-SE</p>
              <Link to="/contato" className="flex items-center gap-2">
                <Instagram size={14} /> Instagram <ArrowUpRight size={12} />
              </Link>
              <Link to="/contato" className="flex items-center gap-2">
                <MessageCircle size={14} /> WhatsApp <ArrowUpRight size={12} />
              </Link>
              <p className="footer-heading mt-4">FORMAS DE PAGAMENTO</p>
              <div className="flex flex-wrap gap-3 text-[10px]">
                <CreditCard size={15} />
                <span>VISA</span>
                <span>Mastercard</span>
                <span>PIX</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 VERSO. Todos os direitos reservados.</span>
            <span>LOJA CONCEITO · PRODUTOS E CONTEÚDO DEMONSTRATIVOS</span>
          </div>
        </div>
      </footer>
      <Button
        asChild
        variant="ink"
        size="icon"
        className="whatsapp-float size-11 rounded-full"
        title="Falar com a VERSO"
      >
        <Link to="/contato" aria-label="Falar com a VERSO pelo WhatsApp">
          <MessageCircle size={20} />
        </Link>
      </Button>
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500 || offset.y < -100 || velocity.y < -500) {
                setMenu(false);
              }
            }}
            className="fixed inset-0 z-[100] bg-background flex flex-col p-6 touch-none"
          >
            <div className="flex justify-between items-center">
              <span className="brand text-xl">VERSO.</span>
              <Button variant="ghost" size="icon" onClick={() => setMenu(false)}>
                <X size={24} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Fé que veste.</p>
            <nav className="mt-16 flex flex-col gap-8 font-display text-5xl">
              {[
                { name: "LOJA", path: "/loja" },
                { name: "DROPS", path: "/drops" },
                { name: "SOBRE", path: "/sobre" },
                { name: "CONTATO", path: "/contato" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <Link to={item.path} onClick={() => setMenu(false)} className="block w-full">
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto text-center text-xs text-muted-foreground pb-4 opacity-50">
              Arraste para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="max-h-[85svh] overflow-y-auto">
          <DialogTitle className="font-display text-3xl">ENCONTRE SEU VERSO.</DialogTitle>
          <DialogDescription>Peças, categorias e referências.</DialogDescription>
          <div className="relative">
            <input
              autoFocus
              aria-label="Buscar peças"
              placeholder="O que você procura?"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 100))}
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-3" size={18} />
          </div>
          <div className="space-y-3">
            {results.map((p) => (
              <Link
                key={p.slug}
                to="/produto/$slug"
                params={{ slug: p.slug }}
                onClick={() => setSearch(false)}
                className="grid grid-cols-[55px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  width={55}
                  height={65}
                  className="h-16 w-14 object-cover"
                />
                <span className="text-xs">{p.name}</span>
                <span className="text-xs">{money(p.price)}</span>
              </Link>
            ))}
            {results.length === 0 && (
              <p className="py-5 text-sm">Nenhuma peça por aqui. Tenta outro nome.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!policy} onOpenChange={() => setPolicy("")}>
        <DialogContent>
          <DialogTitle className="font-display text-3xl">{policy}</DialogTitle>
          <DialogDescription>Informações desta loja conceito.</DialogDescription>
          <p className="text-sm leading-7">
            {policy === "Privacidade"
              ? "Esta demonstração não envia seus dados nem cadastra e-mails. A sacola existe apenas enquanto você navega."
              : policy === "Entrega e frete"
                ? "Frete grátis em pedidos acima de R$ 299. Os valores por CEP são simulações, não cotações reais. Prazos e transportadoras serão confirmados antes da loja abrir."
                : "Em compras online, o direito de arrependimento é de 7 dias após o recebimento. As condições de troca de tamanho e o canal de atendimento serão confirmados na abertura da loja."}
          </p>
        </DialogContent>
      </Dialog>
      <CartDrawer />
    </>
  );
}
function CartDrawer() {
  const cart = useCart();
  const [shippingOptions, setShippingOptions] = useState<
    { name: string; price: number; estimated_days: number }[] | null
  >(null);
  const [selectedShipping, setSelectedShipping] = useState<{ name: string; price: number } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastCep, setLastCep] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const cepValue = watch("zip_code");

  async function calculate(cleanCep: string) {
    if (!/^\d{8}$/.test(cleanCep)) {
      setError("Digite um CEP válido com 8 números.");
      setShippingOptions(null);
      setSelectedShipping(null);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await calculateFreight({
        data: {
          zip_code: cleanCep,
          total_weight_kg: cart.items.reduce((acc, item) => acc + 0.4 * item.quantity, 0),
          total_value: cart.subtotal,
        },
      });
      if (res.success && res.options) {
        setShippingOptions(res.options);
        setSelectedShipping(res.options[0]);
      }
    } catch (e) {
      setError("Não foi possível calcular o frete.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (cepValue) {
      const clean = cepValue.replace(/\D/g, "");
      if (clean.length === 8) {
        const hash = `${clean}-${cart.subtotal}`;
        if (lastCep !== hash && !loading) {
          setLastCep(hash);
          calculate(clean);
          fetch(`https://viacep.com.br/ws/${clean}/json/`)
            .then((r) => r.json())
            .then((d) => {
              if (!d.erro) {
                setValue("street_name", d.logradouro);
                setValue("neighborhood", d.bairro);
                setValue("city", d.localidade);
                setValue("state", d.uf);
              }
            })
            .catch(() => {});
        }
      }
    }
  }, [cepValue, cart.subtotal, loading, lastCep]);

  const finish = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      const payload = {
        items: cart.items.map((i) => ({
          slug: i.product.slug,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        payer: {
          name: formData.name,
          surname: "Comprador",
          email: formData.email,
          phone: { area_code: cleanPhone.substring(0, 2), number: cleanPhone.substring(2) },
          address: {
            zip_code: formData.zip_code.replace(/\D/g, ""),
            street_name: formData.street_name,
            street_number: formData.street_number,
          },
        },
        shipping_cep: formData.zip_code.replace(/\D/g, ""),
        shipping_method: (selectedShipping?.name || "").toLowerCase().includes("sedex")
          ? "sedex"
          : ("pac" as "pac" | "sedex"),
      };

      const res = await createPaymentPreference({ data: payload });
      if (res.success && res.init_point) {
        window.location.href = res.init_point;
      } else {
        setError(res.error || "Erro ao gerar o pagamento.");
      }
    } catch (e) {
      setError("Erro de conexão ao gerar o pagamento.");
    }
    setLoading(false);
  });

  return (
    <>
      <Sheet open={cart.open} onOpenChange={cart.setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-[450px]">
          <SheetTitle className="font-display text-3xl">
            SUA SACOLA <span className="text-muted-foreground">({cart.count})</span>
          </SheetTitle>
          <SheetDescription>
            {cart.items.length
              ? "Suas próximas peças favoritas."
              : "Seu próximo verso começa aqui."}
          </SheetDescription>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 py-14">
                <ShoppingBag size={42} strokeWidth={1} />
                <p className="text-sm">A sacola ainda está vazia.</p>
                <Button variant="brand" asChild>
                  <Link to="/loja" onClick={() => cart.setOpen(false)}>
                    Explorar peças <ArrowRight />
                  </Link>
                </Button>
              </div>
            ) : (
              cart.items.map((item, i) => (
                <div className="bag-line" key={`${item.product.slug}-${item.size}-${item.color}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={78}
                    height={98}
                  />
                  <div className="min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link
                        to="/produto/$slug"
                        params={{ slug: item.product.slug }}
                        onClick={() => cart.setOpen(false)}
                        className="text-xs leading-5"
                      >
                        {item.product.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0"
                        aria-label={`Remover ${item.product.name}`}
                        onClick={() => cart.remove(i)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`Diminuir quantidade de ${item.product.name}`}
                          onClick={() => cart.update(i, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        >
                          <Minus />
                        </Button>
                        <span className="w-5 text-center text-xs">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`Aumentar quantidade de ${item.product.name}`}
                          onClick={() => cart.update(i, item.quantity + 1)}
                          disabled={item.quantity === 10}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="text-xs">{money(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.items.length > 0 && (
            <div className="border-t border-border pt-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <strong>{money(cart.subtotal)}</strong>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {cart.subtotal > 299
                  ? "Seu pedido tem frete grátis."
                  : `Faltam ${money(299.01 - cart.subtotal)} para frete grátis.`}
              </p>
              <form onSubmit={finish} className="mt-5 space-y-3">
                <label className="block text-xs font-semibold">DADOS DO COMPRADOR</label>
                <input
                  {...register("name")}
                  placeholder="Nome completo"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500">{errors.name.message}</span>
                )}

                <input
                  {...register("email")}
                  type="email"
                  placeholder="E-mail"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.email && (
                  <span className="text-[10px] text-red-500">{errors.email.message}</span>
                )}

                <input
                  {...register("phone")}
                  placeholder="Telefone (DDD + Número)"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.phone && (
                  <span className="text-[10px] text-red-500">{errors.phone.message}</span>
                )}

                <label className="block text-xs font-semibold mt-4">ENDEREÇO E FRETE</label>
                <input
                  {...register("zip_code")}
                  placeholder="CEP"
                  maxLength={9}
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.zip_code && (
                  <span className="text-[10px] text-red-500">{errors.zip_code.message}</span>
                )}

                {shippingOptions && (
                  <div className="mt-3 text-xs space-y-2">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.name}
                        className="flex items-center justify-between border border-border p-2 cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.name === opt.name}
                            onChange={() => setSelectedShipping(opt)}
                            className="accent-ink"
                          />
                          <div>
                            <p className="font-semibold">{opt.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {opt.estimated_days} dias úteis
                            </p>
                          </div>
                        </div>
                        <span>{opt.price === 0 ? "Grátis" : money(opt.price)}</span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      {...register("street_name")}
                      placeholder="Rua"
                      className="w-full text-xs p-2 border border-border"
                    />
                  </div>
                  <input
                    {...register("street_number")}
                    placeholder="Nº"
                    className="w-full text-xs p-2 border border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    {...register("neighborhood")}
                    placeholder="Bairro"
                    className="w-full text-xs p-2 border border-border"
                  />
                  <input
                    {...register("city")}
                    placeholder="Cidade"
                    className="w-full text-xs p-2 border border-border"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-2 text-xs text-red-500">
                    {error}
                  </p>
                )}

                <div className="mt-3 flex justify-between font-semibold pt-3 border-t border-border">
                  <span>Total estimado</span>
                  <span>{money(cart.subtotal + (selectedShipping?.price || 0))}</span>
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  className="mt-5 h-12 w-full"
                  disabled={!selectedShipping || loading}
                >
                  <CreditCard size={17} />{" "}
                  {loading ? "Gerando Pagamento..." : "Ir para o Pagamento Seguro"}{" "}
                  <ArrowUpRight size={17} />
                </Button>
              </form>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Checkout seguro processado pelo Mercado Pago.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
