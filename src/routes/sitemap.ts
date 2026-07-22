import { brandConfig } from "@/config/brand";
import { generateDynamicSitemap } from "@/lib/seo/sitemap.server";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;

const siteOrigin = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

export const loader = async () => {
  try {
    const sitemap = await generateDynamicSitemap(siteOrigin);
    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "X-Robots-Tag": "noindex, follow",
      },
    });
  } catch (error) {
    console.error("Winimi dynamic sitemap generation failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return new Response("Sitemap is temporarily unavailable.\n", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Retry-After": "300",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
};
