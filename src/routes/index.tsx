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
          <motion.p variants={fadeUp} className="eyebrow">VERSO® &nbsp; / &nbsp; DROP 001 — ESSENCIAL</motion.p>
          <h1 className="hero-title flex flex-col">
            <span className="overflow-hidden">
              <motion.span variants={fadeUp} className="block">FÉ QUE</motion.span>
            </span>
            <span className="overflow-hidden">
              <motion.span variants={fadeUp} className="block">VESTE.</motion.span>
            </span>
          </h1>
          <motion.p variants={fadeUp} className="hero-sub">
            Streetwear com propósito.
            <br />
            Sem fantasia.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button asChild variant="brand" size="lg">
              <Link to="/drops">
                Ver Drop 01 <ArrowUpRight className="ml-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-bottom"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
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
      <section className="drop-banner">
        <img
          src={community}
          alt="Três jovens vestindo peças do Drop 01 da VERSO"
          loading="lazy"
          width={1600}
          height={1008}
        />
        <div className="drop-inner container-verso">
          <p className="eyebrow">PRIMEIRO CAPÍTULO. MESMA ESSÊNCIA.</p>
          <h2 className="drop-title">
            DROP 01.
            <br />O ESSENCIAL.
          </h2>
          <p className="mb-5 text-xs">O que você carrega não cabe só no bolso.</p>
          <Button asChild variant="brand" size="lg">
            <Link to="/drops">
              Conhecer o drop <ArrowUpRight className="ml-5" />
            </Link>
          </Button>
          <Countdown />
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
            <div ref={carouselRef} className="verse-grid flex md:grid overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
              {[products[0], products[1], products[5]].map(
                (p) =>
                  p && (
                    <motion.div
                      key={p.slug}
                      initial={prefersReducedMotion ? { opacity: 1 } : { scale: 0.92, opacity: 0.5 }}
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
              <motion.div className="h-full bg-primary" style={{ scaleX: scrollXProgress, transformOrigin: "left" }} />
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
              <CommunityItem key={name} quote={quote as string} name={name as string} img={img as string} i={i} />
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

function CommunityItem({ quote, name, img, i }: { quote: string; name: string; img: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : -30, prefersReducedMotion ? 0 : 30]);

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
