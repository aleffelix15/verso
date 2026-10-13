import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Clock, ArrowRight, X, Sparkles } from "lucide-react";
import { products, money, type Product } from "@/data/products";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

const HISTORY_KEY = "verso-search-history";
const POPULAR_SEARCHES = ["Camiseta Oversized", "Moletom Boxy", "Jaqueta", "Boné", "Salmo 23"];

export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchProducts(query: string, catalog: Product[] = products): Product[] {
  const normQuery = normalizeText(query);
  if (!normQuery) return [];

  const tokens = normQuery.split(/\s+/).filter(Boolean);

  return catalog
    .map((product) => {
      const target = normalizeText(
        `${product.name} ${product.shortName} ${product.verse} ${product.category} ${product.statement} ${product.meaning} ${product.colors.join(" ")}`,
      );

      // Simple scoring: full query match gets higher score, token match gets score
      let score = 0;
      if (target.includes(normQuery)) score += 10;
      if (normalizeText(product.name).includes(normQuery)) score += 15;
      if (normalizeText(product.verse).includes(normQuery)) score += 8;

      const matchesAllTokens = tokens.every((token) => target.includes(token));
      if (matchesAllTokens) score += 5;

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignora erro
    }
  }, []);

  const saveToHistory = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const next = [
        trimmed,
        ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 5);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        // Ignora cota
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignora
    }
  }, []);

  const results = useMemo(() => searchProducts(query), [query]);

  const handleSelectProduct = (p: Product) => {
    saveToHistory(p.shortName);
    onOpenChange(false);
    void navigate({ to: "/produto/$slug", params: { slug: p.slug } });
  };

  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div data-lenis-prevent className="flex flex-col bg-card text-foreground">
        <CommandInput
          placeholder="Busque por peça, categoria, versículo, cor..."
          value={query}
          onValueChange={setQuery}
          className="border-b border-border text-foreground"
        />

        <CommandList className="max-h-[70svh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
              Nenhuma peça encontrada para "{query}". Tente buscar por versículo ou categoria.
            </CommandEmpty>
          )}

          {/* Results when searching */}
          {query.trim() && results.length > 0 && (
            <CommandGroup heading={`Peças encontradas (${results.length})`}>
              {results.map((p) => (
                <CommandItem
                  key={p.slug}
                  value={`${p.name} ${p.verse} ${p.category} ${p.colors.join(" ")}`}
                  onSelect={() => handleSelectProduct(p)}
                  className="flex items-center gap-3 p-2.5 cursor-pointer aria-selected:bg-surface hover:bg-surface rounded-none border border-transparent hover:border-border transition-colors"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    width={48}
                    height={58}
                    className="w-12 h-14 object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-brand uppercase font-semibold block">
                      {p.verse} · {p.category}
                    </span>
                    <span className="text-xs font-semibold text-foreground block truncate">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {p.colors.slice(0, 2).join(", ")}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-foreground block">
                      {money(p.priceCents)}
                    </span>
                    <CommandShortcut className="text-[10px] uppercase font-mono">
                      Abrir ↵
                    </CommandShortcut>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* History and popular suggestions when query is empty */}
          {!query.trim() && (
            <>
              {history.length > 0 && (
                <CommandGroup
                  heading={
                    <div className="flex items-center justify-between w-full">
                      <span>Buscas Recentes</span>
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="text-[10px] text-muted-foreground hover:text-foreground font-mono uppercase underline"
                      >
                        Limpar
                      </button>
                    </div>
                  }
                >
                  {history.map((term) => (
                    <CommandItem
                      key={term}
                      value={term}
                      onSelect={() => handleSelectSuggestion(term)}
                      className="flex items-center justify-between py-2 px-3 text-xs cursor-pointer hover:bg-surface"
                    >
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock size={13} className="text-muted-foreground" />
                        <span>{term}</span>
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup heading="Sugestões Populares">
                {POPULAR_SEARCHES.map((term) => (
                  <CommandItem
                    key={term}
                    value={term}
                    onSelect={() => handleSelectSuggestion(term)}
                    className="flex items-center justify-between py-2 px-3 text-xs cursor-pointer hover:bg-surface"
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      <Sparkles size={13} className="text-brand" />
                      <span>{term}</span>
                    </div>
                    <ArrowRight size={12} className="text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>

              <div className="p-3 text-[11px] font-mono text-muted-foreground uppercase tracking-wider text-center border-t border-border mt-2">
                Use as setas ↑ ↓ para navegar · ↵ para selecionar · ESC para fechar
              </div>
            </>
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
