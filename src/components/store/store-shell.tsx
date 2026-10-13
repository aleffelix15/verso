import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
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
  Heart,
  User,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { useTheme } from "./theme-context";
import { money, storeConfig } from "@/data/products";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import Lenis from "lenis";
import { calculateFreight } from "@/server/shipping";
import type { FreightOption } from "@/server/freight-calculator";
import { createPaymentPreference } from "@/server/checkout";
import { lookupCep } from "@/lib/viacep";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SearchDialog } from "./search-dialog";
import { ShortcutsDialog } from "./shortcuts-dialog";
import { OfflineBanner } from "./offline-banner";
import { Progress } from "@/components/ui/progress";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

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
  const [account, setAccount] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [manualReduce, setManualReduce] = useState(false);
  const [policy, setPolicy] = useState("");
  const cart = useCart();
  const wishlist = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const [hiddenHeader, setHiddenHeader] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion || manualReduce;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("verso-reduced-motion");
      if (saved === "true") setManualReduce(true);
    } catch {
      // Ignora
    }
  }, []);

  const toggleManualReduce = () => {
    setManualReduce((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("verso-reduced-motion", String(next));
      } catch {
        // Ignora
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isInput =
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;

      if (event.key === "Escape") {
        setMenu(false);
        setSearch(false);
        setAccount(false);
        setShortcuts(false);
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch((prev) => !prev);
      } else if (event.key === "/" && !isInput) {
        event.preventDefault();
        setSearch(true);
      } else if (event.key === "?" && !isInput) {
        event.preventDefault();
        setShortcuts(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Marquee pause on tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      document.documentElement.setAttribute("data-tab-hidden", document.hidden ? "true" : "false");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const [loading, setLoading] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 8);
    if (latest > previous && latest > 150) {
      setHiddenHeader(true);
    } else {
      setHiddenHeader(false);
    }
  });

  useEffect(() => {
    let lenis: Lenis | undefined;
    let rafId: number;
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches &&
      !("ontouchstart" in window);

    if (isDesktop && !shouldReduceMotion) {
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
  }, [shouldReduceMotion]);

  return (
    <>
      <OfflineBanner />

      {/* Red Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand origin-left z-[70] pointer-events-none"
        style={{ scaleX: shouldReduceMotion ? 0 : scrollYProgress }}
      />

      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-brand focus:text-white focus:font-mono focus:text-xs uppercase focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0E0E] text-[#EDEAE4] pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-4xl font-display font-bold tracking-wider"
            >
              VERSO<span className="text-brand">.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-background text-muted-foreground text-center py-2.5 px-4 font-mono text-[11px] uppercase tracking-widest border-b border-border">
        FRETE GRÁTIS A PARTIR DE R$ 299
      </div>

      {/* 2. MINIMALIST STREETWEAR HEADER */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hiddenHeader ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`site-header container-verso sticky top-0 z-50 text-foreground transition-all duration-200 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background/80 border-b border-border/60"
        }`}
      >
        <Link
          to="/"
          className="brand text-foreground font-display font-extrabold tracking-wider text-2xl sm:text-3xl"
          aria-label="VERSO — início"
        >
          VERSO<span className="text-brand">.</span>
        </Link>

        <nav
          className="site-nav items-center justify-center gap-7 lg:gap-10"
          aria-label="Menu principal"
        >
          <Link
            to="/drops"
            className="text-[13px] text-foreground/85 hover:text-brand font-medium tracking-wide transition-colors"
          >
            Novidades
          </Link>
          <Link
            to="/loja"
            className="text-[13px] text-foreground/85 hover:text-brand font-medium tracking-wide transition-colors"
          >
            Roupas
          </Link>
          <Link
            to="/drops"
            className="text-[13px] text-foreground/85 hover:text-brand font-medium tracking-wide transition-colors"
          >
            Coleções
          </Link>
          <Link
            to="/loja"
            search={{ categoria: "Acessórios" }}
            className="text-[13px] text-foreground/85 hover:text-brand font-medium tracking-wide transition-colors"
          >
            Acessórios
          </Link>
          <Link
            to="/loja"
            className="text-[13px] text-foreground/85 hover:text-brand font-medium tracking-wide transition-colors"
          >
            Sale
          </Link>
        </nav>

        <div className="header-actions items-center">
          {/* THEME TOGGLE (SOL / LUA) */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
            title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            onClick={toggleTheme}
            className="text-foreground hover:text-brand hover:bg-muted"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Buscar produtos (Ctrl+K)"
            title="Buscar (Ctrl+K)"
            onClick={() => setSearch(true)}
            className="text-foreground hover:text-brand hover:bg-muted"
          >
            <Search size={19} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Atalhos de teclado (?)"
            title="Atalhos (?)"
            onClick={() => setShortcuts(true)}
            className="hidden md:inline-flex text-foreground hover:text-brand hover:bg-muted"
          >
            <HelpCircle size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Conta do usuário"
            title="Minha Conta"
            onClick={() => setAccount(true)}
            className="text-foreground hover:text-brand hover:bg-muted"
          >
            <User size={19} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={`Abrir sacola, ${cart.count} itens`}
            title="Sacola"
            onClick={() => cart.setOpen(true)}
            className="relative text-foreground hover:text-brand hover:bg-muted"
          >
            <motion.div
              key={cart.bumpCount}
              animate={
                cart.bumpCount > 0 && !shouldReduceMotion ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }
              }
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag size={19} />
            </motion.div>
            <AnimatePresence>
              {cart.count > 0 && (
                <motion.span
                  key={cart.bumpCount || cart.count}
                  initial={{ scale: 0 }}
                  animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.35, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-1 -right-1 grid min-w-4 h-4 px-1 place-items-center bg-brand text-[10px] font-bold text-white rounded-full leading-none pointer-events-none"
                >
                  {cart.count}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-foreground hover:bg-muted"
            aria-label="Abrir menu"
            onClick={() => setMenu(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </motion.header>
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      {/* 8. FOOTER COM 4 COLUNAS E DIVISORES VERTICAIS */}
      <footer className="site-footer bg-background text-foreground border-t border-border">
        <div className="container-verso">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border py-12 lg:py-16">
            {/* Col 1: Marca VERSO. + Tagline */}
            <div className="pb-8 md:pb-0 md:pr-8">
              <Link
                to="/"
                className="brand text-3xl font-display font-extrabold tracking-wider text-foreground"
              >
                VERSO<span className="text-brand">.</span>
              </Link>
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mt-4 leading-relaxed">
                MAIS QUE ROUPAS.
                <br />
                UMA FORMA DE VIVER.
              </p>
            </div>

            {/* Col 2: Navegação */}
            <div className="py-8 md:py-0 md:px-8">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-4">
                Navegação
              </p>
              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                <Link to="/drops" className="hover:text-foreground transition-colors">
                  Novidades
                </Link>
                <Link to="/loja" className="hover:text-foreground transition-colors">
                  Roupas
                </Link>
                <Link to="/drops" className="hover:text-foreground transition-colors">
                  Coleções
                </Link>
                <Link
                  to="/loja"
                  search={{ categoria: "Acessórios" }}
                  className="hover:text-foreground transition-colors"
                >
                  Acessórios
                </Link>
                <Link to="/loja" className="hover:text-foreground transition-colors">
                  Sale
                </Link>
              </div>
            </div>

            {/* Col 3: Institucional */}
            <div className="py-8 md:py-0 md:px-8">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-4">
                Institucional
              </p>
              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                <Link to="/sobre" className="hover:text-foreground transition-colors">
                  Nossa Essência
                </Link>
                <Link to="/sobre" className="hover:text-foreground transition-colors">
                  Sobre a Verso
                </Link>
                <Link to="/contato" className="hover:text-foreground transition-colors">
                  Contato
                </Link>
                <Link to="/privacidade" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
                <Link to="/trocas" className="hover:text-foreground transition-colors">
                  Trocas e Devoluções
                </Link>
              </div>
            </div>

            {/* Col 4: Redes sociais e Formas de pagamento */}
            <div className="pt-8 md:pt-0 md:pl-8">
              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">
                Acompanhe a Verso
              </p>
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-foreground transition-colors"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="hover:text-foreground transition-colors"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-foreground transition-colors"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="hover:text-foreground transition-colors"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>

              <p className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2.5">
                Formas de pagamento
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-muted-foreground">
                <span className="border border-border bg-surface px-2 py-1">VISA</span>
                <span className="border border-border bg-surface px-2 py-1">MASTERCARD</span>
                <span className="border border-border bg-surface px-2 py-1">BOLETO</span>
                <span className="border border-border bg-surface px-2 py-1">PIX</span>
              </div>
            </div>
          </div>

          {/* Rodapé inferior */}
          <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <span>© 2025 Verso. Todos os direitos reservados.</span>
            <span>Feito no Brasil</span>
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
            className="fixed inset-0 z-[100] bg-[#EDEAE4] dark:bg-[#0E0E0E] text-[#0E0E0E] dark:text-[#EDEAE4] flex flex-col p-6 touch-none"
          >
            <div className="flex justify-between items-center">
              <span className="brand text-2xl font-display font-bold text-foreground">
                VERSO<span className="text-brand">.</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenu(false)}
                aria-label="Fechar menu"
                className="text-foreground hover:bg-white/5"
              >
                <X size={24} />
              </Button>
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-wider">
              STREETWEAR COM IDENTIDADE.
            </p>
            <nav className="mt-8 flex flex-col gap-4 font-display text-3xl sm:text-4xl">
              {[
                { name: "NOVIDADES", path: "/drops" },
                { name: "ROUPAS", path: "/loja" },
                { name: "COLEÇÕES", path: "/drops" },
                { name: "ACESSÓRIOS", path: "/loja" },
                { name: "SALE", path: "/loja" },
                { name: "NOSSA ESSÊNCIA", path: "/sobre" },
                {
                  name: `FAVORITOS ${wishlist.count > 0 ? `(${wishlist.count})` : ""}`,
                  path: "/favoritos",
                },
                { name: "CONTATO", path: "/contato" },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25, ease: "easeOut" }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenu(false)}
                    className="block w-full hover:text-brand transition-colors uppercase"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* THEME SWITCH IN MOBILE MENU */}
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-6 flex items-center justify-between w-full py-4 border-t border-border font-mono text-xs tracking-wider uppercase text-left text-foreground hover:text-brand transition-colors cursor-pointer"
            >
              <span>{theme === "dark" ? "MODO CLARO" : "MODO ESCURO"}</span>
              {theme === "dark" ? (
                <Sun size={18} className="text-brand" />
              ) : (
                <Moon size={18} className="text-brand" />
              )}
            </button>

            <div className="mt-auto text-center text-xs text-muted-foreground pb-4 font-mono uppercase tracking-widest">
              Arraste para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH DIALOG WITH CMDK */}
      <SearchDialog open={search} onOpenChange={setSearch} />

      {/* KEYBOARD SHORTCUTS DIALOG */}
      <ShortcutsDialog open={shortcuts} onOpenChange={setShortcuts} />

      {/* USER ACCOUNT DIALOG */}
      <Dialog open={account} onOpenChange={setAccount}>
        <DialogContent className="max-w-md bg-card text-foreground border-border">
          <DialogTitle className="font-display text-3xl font-bold uppercase text-foreground">
            CONTA VERSO
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Sua experiência personalizada de compra e navegação.
          </DialogDescription>
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-surface border border-border">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-semibold block mb-1">
                STATUS DA SESSÃO
              </span>
              <p className="text-sm font-semibold text-foreground">Visitante Convidado</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Suas peças favoritas e itens na sacola são salvos com segurança no seu navegador.
                Quando você finaliza uma compra pelo Mercado Pago, os dados do pedido são
                confirmados no checkout.
              </p>
            </div>

            <div className="p-3 bg-surface border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Reduzir animações</p>
                <p className="text-[10px] text-muted-foreground">
                  Desativa movimentos contínuos e efeitos parallax
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleManualReduce}
                className={`font-mono text-[10px] uppercase h-7 px-2.5 rounded-none ${
                  manualReduce ? "border-brand text-brand" : "border-border text-muted-foreground"
                }`}
              >
                {manualReduce ? "Ativado" : "Desativado"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button asChild variant="outline" className="border-border text-xs">
                <Link to="/favoritos" onClick={() => setAccount(false)}>
                  Favoritos ({wishlist.count})
                </Link>
              </Button>
              <Button asChild variant="brand" className="text-xs">
                <Link to="/loja" onClick={() => setAccount(false)}>
                  Explorar Loja
                </Link>
              </Button>
            </div>
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
  const wishlist = useWishlist();
  const [shippingOptions, setShippingOptions] = useState<FreightOption[] | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<FreightOption | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const lastCep = useRef("");

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

  const calculate = useCallback(
    async (cleanCep: string) => {
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
            cep: cleanCep,
            items: cart.items.map((item) => ({
              slug: item.product.slug,
              quantity: item.quantity,
            })),
          },
        });
        if (res.success && res.options) {
          const defaultShipping = res.options.find((option) => option.id === "pac");
          if (!defaultShipping) throw new Error("Freight option unavailable");
          setShippingOptions(res.options);
          setSelectedShipping(defaultShipping);
        }
      } catch {
        setError("Não foi possível calcular o frete.");
      } finally {
        setLoading(false);
      }
    },
    [cart.items],
  );

  const cartLineKey = cart.items.map((item) => `${item.product.slug}:${item.quantity}`).join(",");

  useEffect(() => {
    const clean = cepValue?.replace(/\D/g, "");
    if (!clean || clean.length !== 8) return;
    const requestKey = `${clean}-${cartLineKey}`;
    if (lastCep.current === requestKey) return;
    lastCep.current = requestKey;
    void calculate(clean);
    let active = true;
    void lookupCep(clean)
      .then((address) => {
        if (!active || !address) return;
        setValue("street_name", address.logradouro);
        setValue("neighborhood", address.bairro);
        setValue("city", address.localidade);
        setValue("state", address.uf);
      })
      .catch(() => {
        if (active) setError("Não foi possível consultar o CEP. Preencha o endereço manualmente.");
      });
    return () => {
      active = false;
      if (lastCep.current === requestKey) lastCep.current = "";
    };
  }, [cepValue, cartLineKey, calculate, setValue]);

  const finish = handleSubmit(async (formData) => {
    if (!selectedShipping) {
      setError("Selecione uma opção de frete.");
      return;
    }
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
        shipping_method: selectedShipping.id,
      };

      const res = await createPaymentPreference({ data: payload });
      if (res.success && res.init_point) {
        window.location.href = res.init_point;
      } else {
        setError(res.success ? "O provedor não retornou um link de pagamento." : res.error);
      }
    } catch (e) {
      setError("Erro de conexão ao gerar o pagamento.");
    }
    setLoading(false);
  });

  return (
    <>
      <Sheet open={cart.open} onOpenChange={cart.setOpen}>
        <SheetContent
          data-lenis-prevent
          className="flex w-full flex-col sm:max-w-[480px] max-w-[100vw] overflow-hidden"
        >
          <SheetTitle className="font-display text-3xl">
            SUA SACOLA <span className="text-muted-foreground">({cart.count})</span>
          </SheetTitle>
          <SheetDescription>
            {cart.items.length
              ? "Suas próximas peças favoritas."
              : "Seu próximo verso começa aqui."}
          </SheetDescription>

          {/* Free Shipping Progress Bar */}
          {cart.items.length > 0 && (
            <div className="py-2.5 px-3 bg-surface border border-border mt-1 mb-2">
              <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono">
                <span className="text-muted-foreground uppercase">
                  {cart.subtotal >= storeConfig.freeShippingThresholdCents
                    ? "Frete grátis garantido!"
                    : `Faltam ${money(storeConfig.freeShippingThresholdCents - cart.subtotal)} para frete grátis`}
                </span>
                <span className="font-bold text-brand">
                  {Math.round(
                    Math.min(100, (cart.subtotal / storeConfig.freeShippingThresholdCents) * 100),
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.min(
                  100,
                  (cart.subtotal / storeConfig.freeShippingThresholdCents) * 100,
                )}
                className="h-1 bg-muted [&>div]:bg-brand"
              />
            </div>
          )}

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
              <AnimatePresence initial={false}>
                {cart.items.map((item, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.25 }}
                    className="bag-line"
                    key={`${item.product.slug}-${item.size}-${item.color}`}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={78}
                      height={98}
                      className="object-cover"
                    />
                    <div className="min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-2">
                          <Link
                            to="/produto/$slug"
                            params={{ slug: item.product.slug }}
                            onClick={() => cart.setOpen(false)}
                            className="text-xs leading-5 font-semibold text-foreground hover:text-brand transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label={`Remover ${item.product.name}`}
                            onClick={() => cart.remove(i)}
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {item.color} · {item.size}
                        </p>
                        <button
                          type="button"
                          onClick={() => cart.saveForLater(i, wishlist.addFavorite)}
                          className="mt-1 text-[10px] text-muted-foreground hover:text-brand underline cursor-pointer text-left"
                        >
                          Salvar para depois
                        </button>
                      </div>

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
                            <Minus size={12} />
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
                            <Plus size={12} />
                          </Button>
                        </div>
                        <span className="text-xs font-mono font-semibold">
                          {money(item.product.priceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {cart.items.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <strong>{money(cart.subtotal)}</strong>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {cart.subtotal >= storeConfig.freeShippingThresholdCents
                  ? "Seu pedido tem frete grátis."
                  : `Faltam ${money(storeConfig.freeShippingThresholdCents - cart.subtotal)} para frete grátis.`}
              </p>
              <form onSubmit={finish} className="mt-5 space-y-3">
                <label className="block text-xs font-semibold">DADOS DO COMPRADOR</label>
                <input
                  {...register("name")}
                  placeholder="Nome completo"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.name && (
                  <span className="text-[10px] text-brand">{errors.name.message}</span>
                )}

                <input
                  {...register("email")}
                  type="email"
                  placeholder="E-mail"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.email && (
                  <span className="text-[10px] text-brand">{errors.email.message}</span>
                )}

                <input
                  {...register("phone")}
                  placeholder="Telefone (DDD + Número)"
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.phone && (
                  <span className="text-[10px] text-brand">{errors.phone.message}</span>
                )}

                <label className="block text-xs font-semibold mt-4">ENDEREÇO E FRETE</label>
                <input
                  {...register("zip_code")}
                  placeholder="CEP"
                  maxLength={9}
                  className="w-full text-xs p-2 border border-border"
                />
                {errors.zip_code && (
                  <span className="text-[10px] text-brand">{errors.zip_code.message}</span>
                )}

                {shippingOptions && (
                  <div className="mt-3 text-xs space-y-2">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center justify-between border border-border p-2 cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="accent-ink"
                          />
                          <div>
                            <p className="font-semibold">{opt.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {opt.estimatedDays} dias úteis
                            </p>
                          </div>
                        </div>
                        <span>{opt.priceCents === 0 ? "Grátis" : money(opt.priceCents)}</span>
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
                  <p role="alert" className="mt-2 text-xs text-brand">
                    {error}
                  </p>
                )}

                <div className="mt-3 flex justify-between font-semibold pt-3 border-t border-border">
                  <span>Total estimado</span>
                  <span>{money(cart.subtotal + (selectedShipping?.priceCents || 0))}</span>
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  className="mt-5 h-12 w-full font-mono text-xs uppercase tracking-wider"
                  disabled={!selectedShipping || loading}
                >
                  <CreditCard size={17} />{" "}
                  {loading ? "Gerando Pagamento..." : "Ir para o Pagamento Seguro"}{" "}
                  <ArrowUpRight size={17} />
                </Button>

                <a
                  href={buildWhatsAppOrderUrl({
                    items: cart.items.map((it) => ({
                      name: it.product.name,
                      size: it.size,
                      color: it.color,
                      quantity: it.quantity,
                      priceCents: it.product.priceCents,
                    })),
                    subtotalCents: cart.subtotal,
                    shippingOption: selectedShipping,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 mt-2.5 border border-border text-xs uppercase font-mono tracking-wider text-foreground hover:bg-muted transition-colors rounded-none"
                >
                  <MessageCircle size={15} /> Finalizar via WhatsApp
                </a>
              </form>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Checkout seguro processado pelo Mercado Pago ou direto com nossa equipe via
                WhatsApp.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
