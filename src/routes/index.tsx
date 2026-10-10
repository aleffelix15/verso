import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hero, community, products, pageHead } from "@/data/products";
import { ProductCard } from "@/components/store/product-card";
import { Newsletter } from "@/components/store/newsletter";
import { Countdown } from "@/components/store/countdown";
import { Reveal } from "@/components/store/reveal";
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
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

function Home() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const heroScale = useTransform(scrollY, [0, 1000], [1, prefersReducedMotion ? 1 : 1.08]);

  const carouselRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });

  const dropRef = useRef(null);
  const { scrollYProgress: dropScroll } = useScroll({
    target: dropRef,
    offset: ["start end", "end start"],
  });
  const dropY1 = useTransform(
    dropScroll,
    [0, 1],
    [prefersReducedMotion ? 0 : 50, prefersReducedMotion ? 0 : -100],
  );
  const dropY2 = useTransform(
    dropScroll,
    [0, 1],
    [prefersReducedMotion ? 0 : 150, prefersReducedMotion ? 0 : -200],
  );

  const stagger = {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  };

  const fadeUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <>
      <section className="hero relative overflow-hidden">
        <motion.img
          style={{ scale: heroScale }}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="hero-photo"
          src={hero}
          alt="Jovem com moletom oversized VERSO em cenário urbano de concreto"
          width={1920}
          height={1120}
          fetchPriority="high"
        />
        <motion.div
          className="hero-content container-verso"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-paper/30 bg-ink/40 px-4 py-2 backdrop-blur-md">
              <span className="size-2 rounded-full bg-brand animate-pulse"></span>
              <span className="eyebrow !text-paper !m-0 !tracking-widest">DROP 001 DISPONÍVEL</span>
            </div>
          </motion.div>
          <h1 className="hero-title flex flex-col">
            <span className="overflow-hidden">
              <motion.span variants={fadeUp} className="block">
                FÉ QUE
              </motion.span>
            </span>
            <span className="overflow-hidden">
              <motion.span variants={fadeUp} className="block">
                VESTE.
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
            <motion.p variants={fadeUp} className="hero-sub !mb-0">
              Streetwear com propósito.
              <br />
              Sem fantasia.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="eyebrow text-paper/70 mr-2 hidden sm:block">NOVO DROP</span>
              <div className="flex gap-2">
                {products.slice(0, 3).map((p) => (
                  <Link
                    key={p.slug}
                    to="/produto/$slug"
                    params={{ slug: p.slug }}
                    className="block overflow-hidden rounded-md border border-paper/20 hover:border-brand transition-colors bg-ink"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-20 object-cover opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="hero-bottom" initial="initial" animate="animate" variants={stagger}>
          <motion.p variants={fadeUp} className="eyebrow flex items-center gap-3">
            MENOS RUÍDO. MAIS ESSÊNCIA. <ArrowDown size={13} />
          </motion.p>
          <motion.div variants={fadeUp} className="hero-tag eyebrow">
            EST. 2026
            <br />
            FEITO COM PROPÓSITO.
          </motion.div>
        </motion.div>
      </section>
      <section className="manifesto container-verso">
        {[
          ["01", "FEITO PRA RUA", "Modelagem livre. Atitude real."],
          ["02", "ESCRITO COM PROPÓSITO", "A mensagem está nos detalhes."],
          ["03", "EDIÇÃO LIMITADA", "Poucas peças. Muito significado."],
        ].map(([n, title, text]) => (
          <div className="manifesto-item" key={n}>
            <span className="eyebrow text-chalk">{n} /</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* COLEÇÕES */}
      <Reveal>
        <section className="container-verso section-space">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "CAMISETAS", img: products[0].images[0] },
              { title: "MOLETONS", img: products[1].images[0] },
              { title: "ACESSÓRIOS", img: products[2].images[0] },
            ].map((col) => (
              <Link
                key={col.title}
                to="/loja"
                className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-md bg-ink"
              >
                <img
                  src={col.img}
                  alt={col.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-display text-white tracking-widest">
                    {col.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="container-verso section-space">
          <div className="section-heading">
            <div>
              <p className="eyebrow mb-3">OS ESSENCIAIS DA VEZ</p>
              <h2 className="section-title">MAIS VENDIDOS.</h2>
            </div>
            <Link to="/loja" className="text-link">
              Ver todas as peças <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="container-verso section-space border-t border-border">
          <div className="section-heading">
            <div>
              <p className="eyebrow mb-3">NOVOS VERSOS. MESMA ESSÊNCIA.</p>
              <h2 className="section-title">CHEGOU AGORA.</h2>
            </div>
            <Link to="/loja" className="text-link">
              Ver lançamentos <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {products
              .filter((p) => p.badge === "NOVO")
              .slice(0, 4)
              .map((p) => (
                <ProductCard product={p} key={p.slug} />
              ))}
          </div>
        </section>
      </Reveal>
      <section ref={dropRef} className="drop-banner relative overflow-hidden">
        <img
          src={community}
          alt="Três jovens vestindo peças do Drop 01 da VERSO"
          loading="lazy"
          width={1600}
          height={1008}
        />
        <div className="drop-inner container-verso relative z-10 flex flex-col justify-center sm:block">
          <div className="max-w-xl">
            <p className="eyebrow">PRIMEIRO CAPÍTULO. MESMA ESSÊNCIA.</p>
            <h2 className="drop-title">
              DROP 01.
              <br />O ESSENCIAL.
            </h2>
            <p className="mb-5 text-xs sm:text-base text-paper/80">
              O que você carrega não cabe só no bolso.
            </p>
            <div className="mb-8">
              <Button asChild variant="brand" size="lg">
                <Link to="/drops">
                  Conhecer o drop <ArrowUpRight className="ml-3" />
                </Link>
              </Button>
            </div>
            <Countdown />
          </div>

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[550px] pointer-events-none">
            <motion.div
              style={{ y: dropY1 }}
              className="absolute top-0 right-[50px] w-[280px] h-[360px] rounded-lg overflow-hidden border border-paper/10 shadow-2xl z-20 bg-ink"
            >
              <img
                src={products[0].images[0]}
                className="w-full h-full object-cover opacity-90"
                alt={products[0].name}
              />
            </motion.div>
            <motion.div
              style={{ y: dropY2 }}
              className="absolute bottom-[20px] left-0 w-[240px] h-[310px] rounded-lg overflow-hidden border border-paper/10 shadow-2xl z-10 bg-ink"
            >
              <img
                src={products[2].images[0]}
                className="w-full h-full object-cover opacity-90"
                alt={products[2].name}
              />
            </motion.div>
          </div>
        </div>
      </section>
      <Reveal>
        <section className="container-verso section-space">
          <div className="section-heading">
            <div>
              <p className="eyebrow mb-3">NÃO É SÓ UMA ESTAMPA.</p>
              <h2 className="section-title">CADA PEÇA, UM VERSO.</h2>
            </div>
            <span className="eyebrow hidden sm:block">FÉ NOS DETALHES.</span>
          </div>
          <div className="relative">
            <div
              ref={carouselRef}
              className="verse-grid flex md:grid overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
            >
              {[products[0], products[1], products[5]].map(
                (p) =>
                  p && (
                    <motion.div
                      key={p.slug}
                      initial={
                        prefersReducedMotion ? { opacity: 1 } : { scale: 0.92, opacity: 0.5 }
                      }
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ root: carouselRef, amount: 0.6 }}
                      transition={{ duration: 0.3 }}
                      className="snap-center w-[85vw] sm:w-auto shrink-0"
                    >
                      <Link
                        to="/produto/$slug"
                        params={{ slug: p.slug }}
                        className="verse-item block h-full"
                      >
                        <div className="flex justify-between">
                          <span className="verse-ref">[ {p.verse} ]</span>
                          <ArrowUpRight size={16} />
                        </div>
                        <h3>{p.statement}</h3>
                        <p>{p.meaning}</p>
                        <span className="eyebrow mt-5 block">{p.category} / DROP 01</span>
                      </Link>
                    </motion.div>
                  ),
              )}
            </div>
            <div className="h-1 bg-border/50 w-full max-w-[100px] mt-6 rounded-full overflow-hidden sm:hidden hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ scaleX: scrollXProgress, transformOrigin: "left" }}
              />
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="container-verso section-space border-t border-border">
          <div className="section-heading">
            <div>
              <p className="eyebrow mb-3">GENTE REAL. FÉ REAL.</p>
              <h2 className="section-title">NA RUA COM VERSO.</h2>
            </div>
            <Link to="/contato" className="text-link">
              @verso <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="community-grid flex md:grid overflow-x-auto snap-x snap-mandatory pb-4">
            {[
              [
                "“Finalmente uma roupa que tem a minha fé, mas também tem a minha cara.”",
                "Gabriel, 22 · São Paulo",
                hero,
              ],
              [
                "“O caimento é absurdo. E o detalhe do verso é o que faz a peça ser diferente.”",
                "Ana, 20 · Curitiba",
                community,
              ],
              [
                "“Não preciso falar muito. A roupa já carrega o que importa.”",
                "Lucas, 25 · Belo Horizonte",
                community,
              ],
            ].map(([quote, name, img], i) => (
              <CommunityItem
                key={name}
                quote={quote as string}
                name={name as string}
                img={img as string}
                i={i}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Fotografias editoriais e depoimentos ilustrativos.
          </p>
        </section>
      </Reveal>
      <section className="about-band section-space">
        <div className="container-verso about-inner">
          <div>
            <p className="eyebrow mb-5 text-chalk">NOSSA FÉ NÃO É UM FIGURINO.</p>
            <h2>
              A GENTE VESTE
              <br />O QUE ACREDITA.
            </h2>
          </div>
          <div>
            <p>
              A VERSO nasceu de uma vontade simples: criar a roupa que a gente queria usar. Jovem.
              Cristão. Sem precisar escolher entre quem você é e o que você veste.
            </p>
            <p>
              Sem símbolos gigantes. Sem rótulos prontos. Só streetwear de verdade, com uma mensagem
              que faz sentido por dentro.
            </p>
            <Link to="/sobre" className="text-link">
              Conheça nossa história <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}

function CommunityItem({
  quote,
  name,
  img,
  i,
}: {
  quote: string;
  name: string;
  img: string;
  i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [prefersReducedMotion ? 0 : -30, prefersReducedMotion ? 0 : 30],
  );

  return (
    <div ref={ref} className="group flex flex-col gap-3">
      <div className="overflow-hidden bg-muted">
        <motion.img
          className="community-photo transition-transform duration-700 ease-out sm:group-hover:scale-[1.03]"
          src={img}
          alt="Editorial demonstrativo da comunidade VERSO"
          loading="lazy"
          width={600}
          height={600}
          style={{
            y,
            scale: prefersReducedMotion ? 1 : 1.15,
            objectPosition: i === 0 ? "75% center" : i === 1 ? "left center" : "right center",
          }}
        />
      </div>
      <div className="quote">
        <p>{quote}</p>
        <span className="eyebrow">{name}</span>
      </div>
    </div>
  );
}
