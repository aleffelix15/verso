import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  products,
  pageHead,
  money,
  catalogCategories,
  catalogColors,
  type Product,
} from "@/data/products";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { z } from "zod";

export const shopSearchSchema = z.object({
  categoria: z.string().optional().catch(undefined),
  tamanho: z.string().optional().catch(undefined),
  cor: z.string().optional().catch(undefined),
  precoMax: z.coerce.number().optional().catch(undefined),
  ordenacao: z.enum(["featured", "low", "high", "name"]).optional().catch("featured"),
});

export type ShopSearchParams = z.infer<typeof shopSearchSchema>;

export const Route = createFileRoute("/loja")({
  validateSearch: (search) => shopSearchSchema.parse(search),
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
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedCategory = search.categoria ?? "";
  const selectedSize = search.tamanho ?? "";
  const selectedColor = search.cor ?? "";
  const selectedMaxPrice = search.precoMax ?? 350;
  const selectedSort = search.ordenacao ?? "featured";

  const updateSearch = (updates: Partial<ShopSearchParams>) => {
    void navigate({
      to: "/loja",
      search: (prev) => {
        const next = { ...prev, ...updates };
        // Clean empty values so URL query string stays clean
        if (!next.categoria) delete next.categoria;
        if (!next.tamanho) delete next.tamanho;
        if (!next.cor) delete next.cor;
        if (!next.precoMax || next.precoMax >= 350) delete next.precoMax;
        if (!next.ordenacao || next.ordenacao === "featured") delete next.ordenacao;
        return next;
      },
      replace: true,
    });
  };

  const clearAllFilters = () => {
    void navigate({
      to: "/loja",
      search: {},
      replace: true,
    });
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedMaxPrice < 350 ? 1 : 0);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory =
        !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSize = !selectedSize || p.sizes.includes(selectedSize);
      const matchColor =
        !selectedColor || p.colors.some((c) => c.toLowerCase() === selectedColor.toLowerCase());
      const matchPrice = p.priceCents <= selectedMaxPrice * 100;
      return matchCategory && matchSize && matchColor && matchPrice;
    });

    if (selectedSort === "low") {
      list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    } else if (selectedSort === "high") {
      list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    } else if (selectedSort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, selectedSize, selectedColor, selectedMaxPrice, selectedSort]);

  const panelContent = (
    <div className="flex flex-col gap-6">
      {/* Categoria */}
      <div className="filter-group border-t border-border pt-4">
        <h3 className="font-mono text-xs uppercase font-semibold text-foreground tracking-wider mb-3">
          CATEGORIA
        </h3>
        <div className="filter-options flex flex-col gap-2">
          {catalogCategories.map((c) => {
            const isChecked = selectedCategory.toLowerCase() === c.toLowerCase();
            return (
              <label
                key={c}
                className="flex items-center gap-2.5 text-xs text-foreground/80 hover:text-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateSearch({ categoria: isChecked ? undefined : c })}
                  className="size-4 accent-brand cursor-pointer"
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tamanho */}
      <div className="filter-group border-t border-border pt-4">
        <h3 className="font-mono text-xs uppercase font-semibold text-foreground tracking-wider mb-3">
          TAMANHO
        </h3>
        <div className="size-selector flex flex-wrap gap-2">
          {["P", "M", "G", "GG", "Único"].map((s) => {
            const isSelected = selectedSize === s;
            return (
              <Button
                key={s}
                type="button"
                variant={isSelected ? "brand" : "outline"}
                size="sm"
                className="h-8 min-w-8 px-2 text-xs font-mono rounded-none"
                onClick={() => updateSearch({ tamanho: isSelected ? undefined : s })}
              >
                {s}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Cor */}
      <div className="filter-group border-t border-border pt-4">
        <h3 className="font-mono text-xs uppercase font-semibold text-foreground tracking-wider mb-3">
          COR
        </h3>
        <div className="filter-options flex flex-col gap-2">
          {catalogColors.map((c) => {
            const isChecked = selectedColor.toLowerCase() === c.toLowerCase();
            return (
              <label
                key={c}
                className="flex items-center gap-2.5 text-xs text-foreground/80 hover:text-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateSearch({ cor: isChecked ? undefined : c })}
                  className="size-4 accent-brand cursor-pointer"
                />
                <span
                  className="swatch-dot size-3"
                  data-color={c.toLowerCase().replace(" ", "-")}
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Preço máximo */}
      <div className="filter-group border-t border-border pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-mono text-xs uppercase font-semibold text-foreground tracking-wider">
            PREÇO MÁXIMO
          </h3>
          <span className="font-mono text-xs font-bold text-brand">
            {money(selectedMaxPrice * 100)}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={350}
          step={10}
          value={selectedMaxPrice}
          onChange={(e) => updateSearch({ precoMax: Number(e.target.value) })}
          className="w-full accent-brand cursor-pointer"
          aria-label="Preço máximo"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
          <span>R$ 50</span>
          <span>R$ 350</span>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          className="justify-start px-0 text-xs text-brand hover:text-brand-hover hover:bg-transparent"
          onClick={clearAllFilters}
        >
          <X size={14} className="mr-1" /> Limpar todos os filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-[75vh] transition-colors duration-200">
      <div className="container-verso page-heading border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
          VERSO / LOJA / DROP 01
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-extrabold uppercase tracking-tight text-foreground">
          TODAS AS PEÇAS.
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
          Essenciais no corte. Intencionais nos detalhes. 28 peças do Drop 01.
        </p>
      </div>

      <div className="container-verso shop-layout pt-8">
        {/* Desktop / Tablet Landscape Sticky Sidebar */}
        <aside className="desktop-filters hidden lg:block">{panelContent}</aside>

        <div>
          {/* Shop Toolbar */}
          <div className="shop-toolbar flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden text-xs font-mono uppercase tracking-wider rounded-none gap-1.5"
                onClick={() => setSheetOpen(true)}
              >
                <SlidersHorizontal size={14} />
                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "peça encontrada" : "peças encontradas"}
              </span>
            </div>

            <select
              value={selectedSort}
              onChange={(e) =>
                updateSearch({ ordenacao: e.target.value as ShopSearchParams["ordenacao"] })
              }
              aria-label="Ordenar produtos"
              className="bg-surface border border-border text-xs px-3 py-2 font-mono uppercase focus:outline-none focus:border-brand text-foreground rounded-none cursor-pointer"
            >
              <option value="featured">Mais relevantes</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
              <option value="name">Nome: A–Z</option>
            </select>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6" aria-label="Filtros ativos">
              <span className="font-mono text-[10px] uppercase text-muted-foreground mr-1">
                Filtros ativos:
              </span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => updateSearch({ categoria: undefined })}
                  className="inline-flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 text-xs font-mono text-foreground hover:border-brand transition-colors"
                >
                  <span>{selectedCategory}</span>
                  <X size={12} className="text-muted-foreground hover:text-brand" />
                </button>
              )}
              {selectedSize && (
                <button
                  type="button"
                  onClick={() => updateSearch({ tamanho: undefined })}
                  className="inline-flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 text-xs font-mono text-foreground hover:border-brand transition-colors"
                >
                  <span>Tam: {selectedSize}</span>
                  <X size={12} className="text-muted-foreground hover:text-brand" />
                </button>
              )}
              {selectedColor && (
                <button
                  type="button"
                  onClick={() => updateSearch({ cor: undefined })}
                  className="inline-flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 text-xs font-mono text-foreground hover:border-brand transition-colors"
                >
                  <span>Cor: {selectedColor}</span>
                  <X size={12} className="text-muted-foreground hover:text-brand" />
                </button>
              )}
              {selectedMaxPrice < 350 && (
                <button
                  type="button"
                  onClick={() => updateSearch({ precoMax: undefined })}
                  className="inline-flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 text-xs font-mono text-foreground hover:border-brand transition-colors"
                >
                  <span>Até {money(selectedMaxPrice * 100)}</span>
                  <X size={12} className="text-muted-foreground hover:text-brand" />
                </button>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-brand hover:underline font-mono uppercase ml-2"
              >
                Limpar todos
              </button>
            </div>
          )}

          {/* Product Grid: 2 cols on mobile, 3 cols on tablet (md), 4 cols on desktop (xl) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, idx) => (
              <ProductCard product={p} key={p.slug} index={idx} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-20 text-center max-w-md mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-foreground mb-3">
                NENHUMA PEÇA ENCONTRADA
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Não encontramos peças com a combinação de filtros selecionada. Tente ajustar os
                parâmetros de categoria, tamanho ou faixa de preço.
              </p>
              <Button
                variant="brand"
                onClick={clearAllFilters}
                className="font-mono text-xs uppercase tracking-wider rounded-none"
              >
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sheet Filter Drawer for Mobile & Tablet Portrait */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          data-lenis-prevent
          className="overflow-y-auto bg-card text-foreground border-border w-full sm:max-w-md"
        >
          <SheetTitle className="font-display text-3xl font-extrabold uppercase text-foreground">
            FILTROS
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Filtre por categoria, tamanho, cor e preço.
          </SheetDescription>
          <div className="mt-6">{panelContent}</div>
          <Button
            variant="brand"
            className="mt-8 w-full font-mono text-xs uppercase tracking-wider rounded-none"
            onClick={() => setSheetOpen(false)}
          >
            Ver {filtered.length} {filtered.length === 1 ? "peça" : "peças"}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
