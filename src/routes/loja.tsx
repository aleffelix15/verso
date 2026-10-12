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
      p.priceCents <= max * 100,
  );
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.priceCents - b.priceCents);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.priceCents - a.priceCents);
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
        <h3>PREÇO ATÉ {money(max * 100)}</h3>
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
    <div className="bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] min-h-[75vh] transition-colors duration-200">
      <div className="container-verso page-heading border-b border-black/10 dark:border-white/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
          VERSO / LOJA / DROP 01
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5]">
          TODAS AS PEÇAS.
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#0E0E0E]/70 dark:text-[#A0A0A0] max-w-lg">
          Essenciais no corte. Intencionais nos detalhes. 28 peças do Drop 01.
        </p>
      </div>

      <div className="container-verso shop-layout pt-8">
        <aside className="desktop-filters">{panel}</aside>
        <div>
          <div className="shop-toolbar flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="h-auto p-0 sm:hidden text-xs font-semibold"
                onClick={() => setFilters(true)}
              >
                <SlidersHorizontal size={14} className="mr-1" />
                Filtros {active > 0 && `(${active})`}
              </Button>
              <span className="font-mono text-xs text-[#0E0E0E]/60 dark:text-[#A0A0A0] uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "peça" : "peças"}
              </span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Ordenar produtos"
              className="bg-transparent border border-black/20 dark:border-white/20 text-xs px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#FF4D00] text-[#0E0E0E] dark:text-[#EDEAE4] dark:bg-[#1E1E1E]"
            >
              <option value="featured" className="dark:bg-[#1E1E1E]">Mais relevantes</option>
              <option value="low" className="dark:bg-[#1E1E1E]">Menor preço</option>
              <option value="high" className="dark:bg-[#1E1E1E]">Maior preço</option>
              <option value="name" className="dark:bg-[#1E1E1E]">Nome: A–Z</option>
            </select>
          </div>

          <div className="product-grid shop-grid">
            {filtered.map((p) => (
              <ProductCard product={p} key={p.slug} />
            ))}
          </div>

          {!filtered.length && (
            <div className="py-20 text-center max-w-md mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5] mb-3">
                NENHUMA PEÇA ENCONTRADA
              </h2>
              <p className="text-sm text-[#0E0E0E]/70 dark:text-[#A0A0A0] mb-6">
                Não encontramos peças com os filtros selecionados. Tente ajustar os parâmetros de tamanho, cor ou preço.
              </p>
              <Button variant="brand" onClick={clear}>
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      <Sheet open={filters} onOpenChange={setFilters}>
        <SheetContent side="left" className="overflow-y-auto bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4]">
          <SheetTitle className="font-display text-3xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5]">FILTROS</SheetTitle>
          <SheetDescription className="text-xs text-[#0E0E0E]/70 dark:text-[#A0A0A0]">
            Encontre sua próxima peça VERSO.
          </SheetDescription>
          <div className="mt-6">{panel}</div>
          <Button variant="brand" className="mt-8 w-full" onClick={() => setFilters(false)}>
            Ver {filtered.length} peças
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
