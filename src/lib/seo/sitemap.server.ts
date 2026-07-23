import {
  fetchCatalogCategories,
  fetchCatalogProducts,
} from "@/lib/catalog-api";
import { ApiError } from "@/lib/api";
import { loadContentPage, loadPosts } from "@/lib/content";
import { categoryContents } from "@/data/categoriesContent";
import { getContentTopicPath } from "@/lib/seo/content-topics";
import { getCityPagePath } from "@/lib/seo/local-seo";
import { collectPublishedCityPages } from "@/lib/seo/local-seo.server";
import {
  CRAWLABLE_STATIC_PATHS,
  MANAGED_CONTENT_PATHS,
} from "@/lib/seo/url-policy";

interface SitemapEntry {
  path: string;
  lastModified?: string;
}

interface CollectedContentEntries {
  posts: SitemapEntry[];
  topics: SitemapEntry[];
}

const MAX_SITEMAP_PAGES = 100;
const BACKEND_PUBLIC_PAGE_SIZE = 48;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const normalizeLastModified = (value?: string | null) => {
  if (!value || !Number.isFinite(Date.parse(value))) return undefined;
  return new Date(value).toISOString();
};

const latestLastModified = (
  first?: string,
  second?: string,
) => {
  if (!first) return second;
  if (!second) return first;
  return Date.parse(second) > Date.parse(first) ? second : first;
};

const readOptionalUpdatedAt = (product: object) => {
  const value = Reflect.get(product, "updatedAt");
  return typeof value === "string" ? value : undefined;
};

const resolveCategoryRouteSlug = (catalogSlug: string) =>
  categoryContents.find(
    (category) => category.productCategorySlug === catalogSlug,
  )?.slug || catalogSlug;

const collectProductEntries = async (): Promise<SitemapEntry[]> => {
  const entries: SitemapEntry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const catalog = await fetchCatalogProducts({
      page,
      perPage: BACKEND_PUBLIC_PAGE_SIZE,
    });
    totalPages = Math.max(1, catalog.pagination.totalPages);
    if (totalPages > MAX_SITEMAP_PAGES) {
      throw new Error("Catalog sitemap pagination exceeds the safety limit.");
    }

    entries.push(
      ...catalog.products.map((product) => ({
        path: `/products/${encodeURIComponent(product.slug)}`,
        lastModified: normalizeLastModified(readOptionalUpdatedAt(product)),
      })),
    );
    page += 1;
  } while (page <= totalPages);

  return entries;
};

const collectContentEntries = async (): Promise<CollectedContentEntries> => {
  const posts: SitemapEntry[] = [];
  const topicLastModified = new Map<string, string | undefined>();
  let page = 1;
  let totalPages = 1;

  do {
    const result = await loadPosts({
      page,
      perPage: BACKEND_PUBLIC_PAGE_SIZE,
    });
    totalPages = Math.max(1, result.pagination?.totalPages ?? 1);
    if (totalPages > MAX_SITEMAP_PAGES) {
      throw new Error("Blog sitemap pagination exceeds the safety limit.");
    }

    for (const post of result.posts) {
      const lastModified = normalizeLastModified(post.publishedAt);
      posts.push({
        path: `/blog/${encodeURIComponent(post.slug)}`,
        lastModified,
      });
      const topicPath = getContentTopicPath(post.category);
      if (topicPath) {
        topicLastModified.set(
          topicPath,
          latestLastModified(topicLastModified.get(topicPath), lastModified),
        );
      }
    }
    page += 1;
  } while (page <= totalPages);

  return {
    posts,
    topics: Array.from(topicLastModified.entries()).map(
      ([path, lastModified]) => ({ path, lastModified }),
    ),
  };
};

const collectPublishedManagedContentEntries = async (): Promise<SitemapEntry[]> => {
  const resolved = await Promise.all(
    MANAGED_CONTENT_PATHS.map(async ({ path, slug }) => {
      try {
        const page = await loadContentPage(slug);
        if (page.slug !== slug) {
          throw new Error(`Managed sitemap slug mismatch: expected ${slug}.`);
        }
        return {
          path,
          lastModified: normalizeLastModified(page.publishedAt),
        } satisfies SitemapEntry;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return undefined;
        throw error;
      }
    }),
  );

  return resolved.filter(
    (entry): entry is NonNullable<(typeof resolved)[number]> => entry !== undefined,
  );
};

export const generateDynamicSitemap = async (siteOrigin: string) => {
  const origin = new URL(siteOrigin).origin;
  const [categories, products, content, cities, managedContent] = await Promise.all([
    fetchCatalogCategories(),
    collectProductEntries(),
    collectContentEntries(),
    collectPublishedCityPages(),
    collectPublishedManagedContentEntries(),
  ]);

  const localEntries: SitemapEntry[] = cities.length
    ? [
        { path: "/locations" },
        ...cities.map((city) => ({ path: getCityPagePath(city.slug) })),
      ]
    : [];
  const entries: SitemapEntry[] = [
    ...CRAWLABLE_STATIC_PATHS.map((path) => ({ path })),
    ...managedContent,
    ...categories.map((category) => ({
      path: `/products/category/${encodeURIComponent(
        resolveCategoryRouteSlug(category.slug),
      )}`,
    })),
    ...products,
    ...content.posts,
    ...content.topics,
    ...localEntries,
  ];
  const uniqueEntries = Array.from(
    new Map(entries.map((entry) => [entry.path, entry])).values(),
  ).sort((first, second) => first.path.localeCompare(second.path, "en"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueEntries.flatMap((entry) => [
      "  <url>",
      `    <loc>${escapeXml(`${origin}${entry.path}`)}</loc>`,
      ...(entry.lastModified
        ? [`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`]
        : []),
      "  </url>",
    ]),
    "</urlset>",
    "",
  ].join("\n");
};
