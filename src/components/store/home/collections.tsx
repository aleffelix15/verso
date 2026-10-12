import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { homeCollections } from "@/data/products";
import { Reveal } from "@/components/store/reveal";

export function Collections() {
  return (
    <section className="container-verso section-space bg-background text-foreground">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="eyebrow-red mb-2">COLEÇÕES</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-foreground">
              NOSSAS COLEÇÕES
            </h2>
          </div>
          <Link
            to="/drops"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-brand font-semibold transition-colors group self-start sm:self-end"
          >
            VER TODAS{" "}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {homeCollections.map((col) => (
          <Reveal key={col.id}>
            <Link
              to={col.href}
              className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden border border-border bg-card focus-visible:outline-2 focus-visible:outline-brand"
            >
              {/* Background Photo with smooth hover zoom */}
              <img
                src={col.image}
                alt={`Coleção ${col.title}`}
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Red Accent for DROP 02 as in mockup */}
              {col.hasRedAccent && (
                <div
                  className="absolute top-0 right-0 w-[45%] h-full bg-brand/80 mix-blend-color pointer-events-none transition-opacity duration-300"
                  aria-hidden="true"
                />
              )}

              {/* Dark Vignette Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Bottom Card Content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
                  {col.title}
                </h3>
                <p className="font-mono text-[11px] sm:text-xs text-white/75 uppercase tracking-wider mt-1.5">
                  {col.description}
                </p>
                <div className="mt-4 pt-2">
                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/90 group-hover:text-brand font-semibold transition-colors">
                    {col.ctaText}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
