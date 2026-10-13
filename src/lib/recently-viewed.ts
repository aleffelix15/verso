import { products, type Product } from "@/data/products";

const RECENTLY_VIEWED_KEY = "verso-recently-viewed";
const MAX_RECENT = 6;

export function getRecentlyViewedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function getRecentlyViewedProducts(excludeSlug?: string): Product[] {
  const slugs = getRecentlyViewedSlugs();
  return slugs
    .filter((slug) => slug !== excludeSlug)
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, MAX_RECENT);
}

export function addRecentlyViewed(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  try {
    const current = getRecentlyViewedSlugs();
    const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch {
    // Ignore
  }
}
