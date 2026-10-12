import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { hero, heroContent } from "@/data/products";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] text-white min-h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] md:min-h-[640px] flex items-center">
      {/* Background Hero Photo with responsive object position */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={hero}
          alt="Modelo vestindo moletom oversized VERSO em cenário brutalista de concreto"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-right-top"
        />
        {/* Dark directional overlay on left for typography readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent md:bg-gradient-to-r md:from-[#0A0A0A] md:via-[#0A0A0A]/85 md:to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Hero Content Grid */}
      <div className="container-verso relative z-10 w-full py-16 md:py-24 flex flex-col justify-between h-full">
        <motion.div initial="initial" animate="animate" className="max-w-2xl pt-6 md:pt-10">
          {/* Main Title in 2 lines */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold uppercase text-white tracking-tight leading-[0.86] text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[112px] xl:text-[132px]"
          >
            {heroContent.titleLine1}
            <br />
            {heroContent.titleLine2}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#A3A3A3] font-normal tracking-normal max-w-md leading-relaxed"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* Red Rectangular CTA Button */}
          <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
            <Link
              to={heroContent.ctaHref}
              className="inline-flex items-center justify-center gap-3 bg-brand hover:bg-brand-hover text-white px-8 py-4 font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-150 active:scale-[0.99] rounded-none focus-visible:outline-2 focus-visible:outline-white"
            >
              {heroContent.ctaText} <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Biblical Quote in bottom right */}
        <div className="mt-12 md:mt-auto self-end">
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
        </div>
      </div>
    </section>
  );
}
