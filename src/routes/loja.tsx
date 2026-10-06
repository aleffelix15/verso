import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, pageHead, money, catalogCategories, catalogColors } from "@/data/products";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
export const Route = createFileRoute("/loja")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Loja",
      "Conheça todas as peças VERSO. Camisetas oversized, moletons, jaquetas e acessórios com propósito.",
      "/loja",
    ),
  component: Shop,
});
function Shop() {
  const [categories, setCategories] = useState<string[]>([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [max, setMax] = useState(350);
  const [sort, setSort] = useState("featured");
  const [filters, setFilters] = useState(false);
  let filtered = products.filter(
    (p) =>
      (!categories.length || categories.includes(p.category)) &&
      (!size || p.sizes.includes(size)) &&
      (!color || p.colors.includes(color)) &&
      p.price <= max,
  );
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  const active = categories.length + (size ? 1 : 0) + (color ? 1 : 0) + (max < 350 ? 1 : 0);
  function clear() {
    setCategories([]);
    setSize("");
    setColor("");
    setMax(350);
  }
  const panel = (
    <>
      <div className="filter-group">
        <h3>CATEGORIA</h3>
        <div className="filter-options">
          {catalogCategories.map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                checked={categories.includes(c)}
                onChange={() =>
                  setCategories((prev) =>
                    prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                  )
                }
              />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h3>TAMANHO</h3>
        <div className="size-selector">
          {["P", "M", "G", "GG", "Único"].map((s) => (
            <Button
              variant="size"
              className="h-9 min-w-9 px-2 text-xs"
              data-selected={size === s}
              key={s}
              onClick={() => setSize(size === s ? "" : s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h3>COR</h3>
        <div className="filter-options">
          {catalogColors.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={color === c}
                onChange={() => setColor(color === c ? "" : c)}
              />
              <span className="swatch" data-color={c.toLowerCase().replace(" ", "-")} />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h3>PREÇO ATÉ {money(max)}</h3>
        <input
          className="w-full accent-ink"
          type="range"
          min={50}
          max={350}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          aria-label="Preço máximo"
        />
      </div>
      {active > 0 && (
        <Button variant="ghost" className="px-0" onClick={clear}>
          <X size={13} />
          Limpar filtros
        </Button>
      )}
    </>
  );
  return (
    <>
      <div className="container-verso page-heading">
        <p className="eyebrow">VERSO / LOJA / DROP 01</p>
        <h1>TODAS AS PEÇAS.</h1>
        <p className="mt-4 text-xs text-muted-foreground">
          Essenciais no corte. Intencionais nos detalhes.
        </p>
      </div>
      <div className="container-verso shop-layout">
        <aside className="desktop-filters">{panel}</aside>
        <div>
          <div className="shop-toolbar">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="h-auto p-0 sm:hidden"
                onClick={() => setFilters(true)}
              >
                <SlidersHorizontal size={14} />
                Filtros {active > 0 && `(${active})`}
              </Button>
              <span>{filtered.length} peças</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Ordenar produtos"
            >
              <option value="featured">Mais relevantes</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
              <option value="name">Nome: A–Z</option>
            </select>
          </div>
          <div className="product-grid shop-grid">
            {filtered.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>
          {!filtered.length && (
            <div className="py-16 text-center">
              <h2 className="text-3xl">NENHUMA PEÇA POR AQUI.</h2>
              <p className="my-5 text-xs">Tenta mudar os filtros.</p>
              <Button variant="ink" onClick={clear}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
      <Sheet open={filters} onOpenChange={setFilters}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetTitle className="font-display text-3xl">FILTROS</SheetTitle>
          <SheetDescription>Encontre sua próxima peça.</SheetDescription>
          {panel}
          <Button variant="brand" className="mt-5 w-full" onClick={() => setFilters(false)}>
            Ver {filtered.length} peças
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
