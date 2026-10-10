import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/components/store/wishlist-context";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { products } from "@/data/products";

export const Route = createFileRoute("/favoritos")({
  component: FavoritosPage,
});

function FavoritosPage() {
  const { items } = useWishlist();

  const favoriteProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  return (
    <section className="container-verso section-space min-h-[60vh]">
      <div className="section-heading">
        <h1 className="section-title">SEUS FAVORITOS</h1>
        <p className="mt-4 text-muted-foreground">Peças guardadas para depois.</p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
          <Heart size={42} strokeWidth={1} className="text-muted-foreground opacity-50" />
          <p className="text-sm">Você ainda não favoritou nenhuma peça.</p>
          <Button variant="brand" asChild>
            <Link to="/loja">Explorar peças</Link>
          </Button>
        </div>
      ) : (
        <div className="product-grid mt-10">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
