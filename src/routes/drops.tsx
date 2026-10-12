import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products, community, pageHead, catalogCategories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { Countdown } from "@/components/store/countdown";
export const Route = createFileRoute("/drops")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Drop 01 — O essencial",
      "O primeiro capítulo da VERSO. 28 peças essenciais, fé nos detalhes e edição limitada.",
      "/drops",
    ),
  component: Drops,
});
function Drops() {
  return (
    <div className="bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] min-h-[75vh] transition-colors duration-200">
      <section className="drop-banner">
        <img
          src={community}
          alt="Coleção Drop 01 VERSO com três jovens em cenário urbano"
          width={1600}
          height={1008}
          fetchPriority="high"
        />
        <div className="container-verso drop-inner">
          <p className="eyebrow">VERSO® / COLEÇÃO 001</p>
          <h1 className="drop-title">
            DROP 01.
            <br />O ESSENCIAL.
          </h1>
          <p className="mb-5 max-w-sm text-xs leading-6">
            28 peças. Uma essência. Modelagens livres, tecidos encorpados e uma mensagem que não
            precisa gritar.
          </p>
          <Button variant="brand" asChild>
            <Link to="/loja">
              Explorar a coleção <ArrowUpRight />
            </Link>
          </Button>
          <Countdown />
        </div>
      </section>
      <section className="container-verso section-space">
        <div className="section-heading border-b border-black/10 dark:border-white/10 pb-6 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
              EDIÇÃO LIMITADA / PRIMEIRO CAPÍTULO
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5]">
              O DROP COMPLETO.
            </h2>
          </div>
        </div>
        {catalogCategories.map((category) => (
          <div key={category} className="mb-14">
            <h3 className="mb-6 font-display text-2xl sm:text-3xl uppercase font-bold text-[#0E0E0E] dark:text-[#F5F5F5] border-b border-black/10 dark:border-white/10 pb-2">
              {category}
            </h3>
            <div className="product-grid">
              {products
                .filter((p) => p.category === category)
                .map((p) => (
                  <ProductCard product={p} key={p.slug} />
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
