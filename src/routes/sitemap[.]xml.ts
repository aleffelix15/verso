import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { products } from "@/data/products";
import { getEnv } from "@/lib/env";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        let baseUrl: string;
        try {
          baseUrl = getEnv().PUBLIC_SITE_URL;
        } catch {
          return new Response("Sitemap domain not configured", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        const routeId = "/produto/$slug";
        if (isSitemapRouteIncluded(router.routesById[routeId])) {
          for (const p of products) {
            const location = router.buildLocation({
              to: "/produto/$slug",
              params: { slug: p.slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, routeId);
            if (path) entries.push({ path });
          }
        }
        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }
        return new Response(sitemapXML(baseUrl, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
