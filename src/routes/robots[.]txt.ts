import { createFileRoute } from "@tanstack/react-router";
import { getEnv } from "@/lib/env";

export const Route = createFileRoute("/robots.txt")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        try {
          const sitemapUrl = new URL("/sitemap.xml", getEnv().PUBLIC_SITE_URL).href;
          return new Response(
            `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${sitemapUrl}\n`,
            {
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
              },
            },
          );
        } catch {
          return new Response("Site configuration unavailable", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
