import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/store/reveal";

export function Featured() {
  const featured = products.slice(0, 4);

  return (
    <section className="container-verso section-space bg-background text-foreground">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="eyebrow-red mb-2">EM ALTA</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-foreground">
              DESTAQUES DA VERSO
            </h2>
          </div>
          <Link
            to="/loja"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-brand font-semibold transition-colors group self-start sm:self-end"
          >
            VER TODOS{" "}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {featured.map((p) => (
          <ProductCard product={p} key={p.slug} />
        ))}
      </div>
    </section>
  );
}
