import process from "node:process";
import { ApiError } from "@/lib/api";
import {
  fetchCatalogCategories,
  fetchCatalogProducts,
} from "@/lib/catalog-api";
import { loadCityPage, loadPosts } from "@/lib/content";
import { categoryContents } from "@/data/categoriesContent";
import {
  CRAWLABLE_STATIC_PATHS,
  PUBLIC_CITY_SLUGS,
} from "@/lib/seo/url-policy";

interface SitemapEntry {
  path: string;
  lastModified?: string;
}

const MAX_SITEMAP_PAGES = 100;
const BACKEND_PUBLIC_PAGE_SIZE = 48;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

const readOptionalUpdatedAt = (product: object) => {
  const value = Reflect.get(product, "updatedAt");
  return typeof value === "string" ? value : undefined;
};

const resolveCategoryRouteSlug = (catalogSlug: string) =>
  categoryContents.find(
    (category) => category.productCategorySlug === catalogSlug,
  )?.slug || catalogSlug;

const configuredCitySlugs = () => {
  const values = (process.env.WINIMI_PUBLIC_CITY_SLUGS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => SAFE_SLUG.test(value));
  return values.length ? Array.from(new Set(values)) : [...PUBLIC_CITY_SLUGS];
};

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

const collectPostEntries = async (): Promise<SitemapEntry[]> => {
  const entries: SitemapEntry[] = [];
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

    entries.push(
      ...result.posts.map((post) => ({
        path: `/blog/${encodeURIComponent(post.slug)}`,
        lastModified: normalizeLastModified(post.publishedAt),
      })),
    );
    page += 1;
  } while (page <= totalPages);

  return entries;
};

const collectCityEntries = async (): Promise<SitemapEntry[]> => {
  const entries: SitemapEntry[] = [];

  for (const slug of configuredCitySlugs()) {
    try {
      const city = await loadCityPage(slug);
      entries.push({ path: `/city/${encodeURIComponent(city.slug)}` });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) continue;
      throw error;
    }
  }

  return entries;
};

export const generateDynamicSitemap = async (siteOrigin: string) => {
  const origin = new URL(siteOrigin).origin;
  const [categories, products, posts, cities] = await Promise.all([
    fetchCatalogCategories(),
    collectProductEntries(),
    collectPostEntries(),
    collectCityEntries(),
  ]);

  const entries: SitemapEntry[] = [
    ...CRAWLABLE_STATIC_PATHS.map((path) => ({ path })),
    ...categories.map((category) => ({
      path: `/products/category/${encodeURIComponent(
        resolveCategoryRouteSlug(category.slug),
      )}`,
    })),
    ...products,
    ...posts,
    ...cities,
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
