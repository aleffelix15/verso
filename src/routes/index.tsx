import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/data/products";
import { Hero } from "@/components/store/home/hero";
import { Featured } from "@/components/store/home/featured";
import { TrustStrip } from "@/components/store/home/trust-strip";
import { Collections } from "@/components/store/home/collections";
import { Newsletter } from "@/components/store/newsletter";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Vista sua Essência",
      "Streetwear dark com identidade. Modelagens oversized, cortes amplos e estética brutalista contemporânea.",
      "/",
    ),
  component: Home,
});

export function Home() {
  return (
    <div className="w-full bg-background text-foreground overflow-x-clip">
      {/* 3. HERO (≈ 100vh desktop) */}
      <Hero />

      {/* 4. DESTAQUES DA VERSO */}
      <Featured />

      {/* 5. FAIXA DE CONFIANÇA */}
      <TrustStrip />

      {/* 6. NOSSAS COLEÇÕES */}
      <Collections />

      {/* 7. NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
