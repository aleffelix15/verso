import { Link } from "@tanstack/react-router";
import { money, type Product } from "@/data/products";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link to="/produto/$slug" params={{ slug: product.slug }} aria-label={`Ver ${product.name}`}>
        <div className="product-photo">
          <img src={product.images[0]} loading="lazy" sizes="(min-width:1024px) 25vw, 50vw" aspect-ratio="0.8"
            alt={product.name}
            loading="lazy"
            width={1008}
            height={1200}
          />
          {product.images[1] && (
            <img
              className="second-photo"
              src={product.images[1]}
              alt={`${product.name} — outro ângulo`}
              loading="lazy"
              width={1008}
              height={1200}
            />
          )}{" "}
          {product.badge && <span className="product-badge">{product.badge}</span>}
        </div>
        <div className="product-info">
          <div>
            <div className="product-name">{product.shortName}</div>
            <div className="product-meta">
              {product.category} · {product.colors[0]}
            </div>
          </div>
          <div className="product-price">{money(product.price)}</div>
        </div>
        <div className="swatch-row">
          <span className="swatch" title="Preto lavado" />
        </div>
      </Link>
    </article>
  );
}
