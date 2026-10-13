import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { hero, heroContent } from "@/data/products";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASINGS, DURATIONS, heroLineMask } from "@/lib/motion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Max 8% displacement, disabled on mobile and reduced motion
  const heroParallax = useTransform(scrollY, [0, 800], [0, 48]);

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const simpleFade = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] text-white min-h-[calc(100svh-100px)] md:h-[calc(100svh-100px)] md:min-h-[640px] flex items-center">
      {/* Background Hero Photo with responsive object position and light parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          y: prefersReducedMotion || !isDesktop ? 0 : heroParallax,
        }}
      >
        <img
          src={hero}
          alt="Modelo vestindo moletom oversized VERSO em cenário brutalista de concreto"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-right-top scale-[1.04]"
        />
        {/* Dark directional overlay on left for typography readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent md:bg-gradient-to-r md:from-[#0A0A0A] md:via-[#0A0A0A]/85 md:to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true" />
      </motion.div>

      {/* Hero Content Grid */}
      <div className="container-verso relative z-10 w-full py-16 md:py-24 flex flex-col justify-between h-full">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-2xl pt-6 md:pt-10"
        >
          {/* Main Title line-by-line masked entrance */}
          <h1 className="font-display font-extrabold uppercase text-white tracking-tight leading-[0.86] text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[112px] xl:text-[132px]">
            <span className="block overflow-clip">
              <motion.span
                className="block will-change-transform"
                variants={prefersReducedMotion ? simpleFade : heroLineMask}
              >
                {heroContent.titleLine1}
              </motion.span>
            </span>
            <span className="block overflow-clip">
              <motion.span
                className="block will-change-transform"
                variants={prefersReducedMotion ? simpleFade : heroLineMask}
              >
                {heroContent.titleLine2}
              </motion.span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={simpleFade}
            className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#A3A3A3] font-normal tracking-normal max-w-md leading-relaxed"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* Red Rectangular CTA Button with interactive microinteraction */}
          <motion.div variants={simpleFade} className="mt-8 sm:mt-10">
            <Link
              to={heroContent.ctaHref}
              className="group inline-flex items-center justify-center gap-3 bg-brand hover:bg-brand-hover text-white px-8 py-4 font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-150 active:scale-[0.98] rounded-none focus-visible:outline-2 focus-visible:outline-brand"
            >
              {heroContent.ctaText}
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Biblical Quote in bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.4,
            duration: DURATIONS.slow,
            ease: EASINGS.easeOut,
          }}
          className="mt-12 md:mt-auto self-end"
        >
          <div className="border-l border-white/25 pl-3.5 inline-block text-left">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#A3A3A3] leading-relaxed max-w-[200px]">
              TUDO O QUE
              <br />
              VOCÊ FAZ,
              <br />
              FAÇA DE TODO
              <br />O CORAÇÃO.
            </p>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#737373] font-semibold mt-1.5">
              COLOSSENSES 3:23
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
