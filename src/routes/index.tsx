import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { hero, community, products, pageHead } from "@/data/products";
import { ProductCard } from "@/components/store/product-card";
import { Newsletter } from "@/components/store/newsletter";
import { Countdown } from "@/components/store/countdown";
import { Reveal } from "@/components/store/reveal";
import { motion, useReducedMotion } from "framer-motion";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Fé que veste.",
      "Streetwear com propósito. Conheça a VERSO e o Drop 01: peças essenciais, modelagem ampla e fé nos detalhes.",
      "/",
    ),
  component: Home,
});

export function Home() {
  const prefersReducedMotion = useReducedMotion();

  const stagger = {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const fadeUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  // 1. MAIS VENDIDOS (4 peças icônicas)
  const bestSellers = products.slice(0, 4);

  // 2. CHEGOU AGORA (4 peças complementares)
  const newArrivals = products.slice(4, 8);

  return (
    <div className="bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] transition-colors duration-200">
      {/* 3. HERO EDITORIAL DE STREETWEAR */}
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[620px] lg:min-h-[720px]">
          {/* Left column: Typography, Copy, CTA */}
          <motion.div
            className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 z-10"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Top Tag */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/70 dark:text-[#EDEAE4]/70 font-medium">
                DROP 01 / 2026
              </span>
              <span className="h-px w-16 bg-[#0E0E0E]/30 dark:bg-white/20" />
            </motion.div>

            {/* Main Headline & Subtitle */}
            <div className="my-8 lg:my-12">
              <motion.h1
                variants={fadeUp}
                className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5] leading-[0.88]"
              >
                FÉ QUE
                <br />
                VESTE.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-base sm:text-lg text-[#0E0E0E]/80 dark:text-[#A0A0A0] max-w-md font-normal leading-relaxed"
              >
                Streetwear com propósito. Sem fantasia.
              </motion.p>

              {/* Main CTA Button — Intense Orange #FF4D00 */}
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="/drops"
                  className="inline-flex items-center justify-center gap-3 bg-[#FF4D00] text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#E04400] active:scale-[0.99] transition-all duration-150 shadow-sm"
                >
                  EXPLORAR DROP <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            {/* Bottom Verse Tag Detail */}
            <motion.div
              variants={fadeUp}
              className="pt-4 border-t border-black/10 dark:border-white/10"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#0E0E0E]/70 dark:text-[#EDEAE4]/70">
                JO 1:5 — A luz brilha nas trevas.
              </span>
            </motion.div>
          </motion.div>

          {/* Right column: Editorial Fashion Photography */}
          <div className="relative min-h-[420px] lg:min-h-full overflow-hidden bg-[#1E1E1E]">
            <motion.img
              initial={{ scale: prefersReducedMotion ? 1 : 1.05, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={hero}
              alt="Modelo usando streetwear oversized VERSO em cenário urbano de arquitetura brutalista"
              width={1600}
              height={1200}
              className="w-full h-full object-cover object-center lg:object-top"
              fetchPriority="high"
            />
            {/* Drop pagination indicator on the right edge */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 font-mono text-[11px] tracking-widest z-10">
              <span className="text-[#FF4D00] font-bold">01</span>
              <span className="text-white/60">02</span>
              <span className="text-white/60">03</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAIXA COM OS PILARES DA MARCA (3 PILARES) */}
      <section className="bg-[#0E0E0E] text-[#EDEAE4] border-b border-black/10 dark:border-white/10">
        <div className="container-verso py-5 sm:py-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-4 md:gap-0">
          <div className="flex items-center gap-4 md:px-6 first:pl-0">
            <span className="font-mono text-sm text-[#FF4D00] font-bold">01</span>
            <span className="font-display text-lg sm:text-xl uppercase tracking-wider font-bold">
              FEITO PRA RUA
            </span>
          </div>
          <div className="flex items-center gap-4 md:px-6 pt-3 md:pt-0">
            <span className="font-mono text-sm text-[#FF4D00] font-bold">02</span>
            <span className="font-display text-lg sm:text-xl uppercase tracking-wider font-bold">
              PROPÓSITO EM CADA DETALHE
            </span>
          </div>
          <div className="flex items-center gap-4 md:px-6 pt-3 md:pt-0 last:pr-0">
            <span className="font-mono text-sm text-[#FF4D00] font-bold">03</span>
            <span className="font-display text-lg sm:text-xl uppercase tracking-wider font-bold">
              PEÇAS EM EDIÇÃO LIMITADA
            </span>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO “MAIS VENDIDOS.” */}
      <section className="container-verso section-space">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="w-10 h-1 bg-[#FF4D00] mb-3" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5]">
              MAIS VENDIDOS.
            </h2>
          </div>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0E0E0E] dark:text-[#EDEAE4] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] font-semibold transition-colors group"
          >
            VER TODOS{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        </div>
      </section>

      {/* 6. SEÇÃO “CHEGOU AGORA.” */}
      <section className="container-verso section-space pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="w-10 h-1 bg-[#FF4D00] mb-3" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5]">
              CHEGOU AGORA.
            </h2>
          </div>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0E0E0E] dark:text-[#EDEAE4] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] font-semibold transition-colors group"
          >
            VER TODOS{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newArrivals.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        </div>
      </section>

      {/* 7. BANNER EDITORIAL DO DROP ATUAL */}
      <section className="relative overflow-hidden bg-[#0E0E0E] text-[#EDEAE4]">
        <div className="relative min-h-[500px] md:min-h-[580px] flex items-center">
          <img
            src={community}
            alt="Coleção Drop 01 VERSO em cenário urbano brutalista"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
            loading="lazy"
            width={1600}
            height={1008}
          />
          <div className="container-verso relative z-10 py-16 md:py-24 max-w-2xl">
            <p className="font-mono text-xs text-[#FF4D00] tracking-widest uppercase mb-3 font-semibold">
              PRIMEIRO CAPÍTULO / DROP 01
            </p>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] mb-6 text-white">
              DROP 01.
              <br />O ESSENCIAL.
            </h2>
            <p className="text-sm sm:text-base text-[#EDEAE4]/80 leading-relaxed mb-8 max-w-lg">
              Modelagens oversized, tecidos encorpados de até 400 g/m² e versos que carregam
              verdade. Sem fantasia. Feito pra rua.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/drops"
                className="inline-flex items-center gap-3 bg-[#FF4D00] text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#E04400] transition-colors"
              >
                CONHECER O DROP <ArrowRight size={16} />
              </Link>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO “CADA PEÇA, UM VERSO.” */}
      <Reveal>
        <section className="container-verso section-space">
          <div className="flex justify-between items-end mb-10 border-b border-black/10 dark:border-white/10 pb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
                NÃO É SÓ UMA ESTAMPA
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5]">
                CADA PEÇA, UM VERSO.
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#0E0E0E]/60 dark:text-[#A0A0A0] hidden sm:block">
              FÉ NOS DETALHES
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[products[0], products[1], products[3]]
              .filter((p): p is (typeof products)[number] => Boolean(p))
              .map((p) => (
                <div
                  key={p.slug}
                  className="p-8 bg-[#F5F2EB] dark:bg-[#262626] border border-black/10 dark:border-white/10 flex flex-col justify-between hover:border-black/30 dark:hover:border-white/30 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-xs font-bold tracking-wider text-[#FF4D00]">
                        [ {p.verse} ]
                      </span>
                      <span className="font-mono text-[10px] text-[#0E0E0E]/50 dark:text-white/50 uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-3 text-[#0E0E0E] dark:text-[#F5F5F5]">
                      {p.statement}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0E0E0E]/70 dark:text-[#A0A0A0] leading-relaxed">
                      {p.meaning}
                    </p>
                  </div>
                  <Link
                    to="/produto/$slug"
                    params={{ slug: p.slug }}
                    className="mt-8 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#0E0E0E] dark:text-[#EDEAE4] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] transition-colors group"
                  >
                    CONHECER A PEÇA{" "}
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </Reveal>

      {/* 9. SEÇÃO EDITORIAL “NA RUA COM VERSO.” (COMMUNITY) */}
      <section className="container-verso section-space pt-0">
        <div className="flex justify-between items-end mb-10 border-b border-black/10 dark:border-white/10 pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
              EDITORIAL URBANO
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5]">
              NA RUA COM VERSO.
            </h2>
          </div>
          <Link
            to="/drops"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0E0E0E] dark:text-[#EDEAE4] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] font-semibold transition-colors group"
          >
            COMMUNITY{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-[#1E1E1E]">
              <img
                src={hero}
                alt="Moletom Boxy VERSO em uso urbano"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#0E0E0E]/80 dark:text-[#A0A0A0] italic leading-relaxed">
              “O caimento oversized e a mensagem me acompanham no corre diário.”
            </p>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#FF4D00] font-semibold">
              Moletom Boxy “Graça” · São Paulo
            </span>
          </div>

          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-[#1E1E1E]">
              <img
                src={community}
                alt="Camiseta Oversized VERSO na rua"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#0E0E0E]/80 dark:text-[#A0A0A0] italic leading-relaxed">
              “Streetwear de verdade com a mensagem que a gente acredita. Sem fantasia.”
            </p>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#FF4D00] font-semibold">
              Camiseta “Luz” · Curitiba
            </span>
          </div>

          <div className="flex flex-col">
            <div className="aspect-[4/5] overflow-hidden bg-[#1E1E1E]">
              <img
                src={products[3]?.images[0] ?? hero}
                alt="Jaqueta Coach VERSO"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>
            <p className="mt-4 text-xs sm:text-sm text-[#0E0E0E]/80 dark:text-[#A0A0A0] italic leading-relaxed">
              “Qualidade brutal do tecido e acabamento de etiqueta impecável.”
            </p>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#FF4D00] font-semibold">
              Jaqueta Coach “Firme” · Belo Horizonte
            </span>
          </div>
        </div>
      </section>

      {/* 10. HISTÓRIA DA MARCA / NOSSA ESSÊNCIA */}
      <section className="bg-[#0E0E0E] text-[#EDEAE4] section-space border-t border-white/10">
        <div className="container-verso grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs text-[#FF4D00] uppercase tracking-widest mb-4 font-semibold">
              NOSSA FÉ NÃO É UM FIGURINO
            </p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] text-white">
              A GENTE VESTE
              <br />O QUE ACREDITA.
            </h2>
          </div>
          <div className="space-y-6 text-[#EDEAE4]/80 text-sm sm:text-base leading-relaxed">
            <p>
              A VERSO nasceu de uma vontade simples: criar o streetwear que a gente queria usar.
              Jovem, autêntico e com mensagem real, sem precisar escolher entre quem você é e o que
              você veste.
            </p>
            <p>
              Sem slogans vazios ou rótulos institucionais. Peças com modelagem oversized premium,
              tecido encorpado e referências bíblicas sutis nos detalhes e nas etiquetas.
            </p>
            <div>
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#EDEAE4] hover:text-[#FF4D00] transition-colors pt-2 group"
              >
                CONHEÇA NOSSA HISTÓRIA{" "}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
