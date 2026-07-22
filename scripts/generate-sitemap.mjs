// Writes public/sitemap.xml before dev/build without requiring Bun or tsx.
// Reads route slugs from source files to keep the sitemap aligned with the app.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = (process.env.SITE_URL || "https://winimibakery.com").replace(/\/$/, "");

const readSource = (path) => {
  try {
    return readFileSync(resolve(path), "utf-8");
  } catch {
    return "";
  }
};

const uniqueMatches = (source, pattern) =>
  Array.from(new Set(Array.from(source.matchAll(pattern)).map((match) => match[1])));

const productsSource = readSource("src/data/products.ts");
const categoriesSource = readSource("src/data/categoriesContent.ts");
const blogSource = readSource("src/data/blogPosts.ts");

const productCategorySlugs = new Set([
  "all",
  "cookies",
  "mini-cookies",
  "cakes",
  "diet",
  "gift",
  "pastry",
]);

const productSlugs = uniqueMatches(productsSource, /^\s*slug:\s*"([a-z0-9-]+)"/gm).filter(
  (slug) => !productCategorySlugs.has(slug),
);
const categorySlugs = uniqueMatches(categoriesSource, /^\s*slug:\s*"([a-z0-9-]+)"/gm);
const blogSlugs = uniqueMatches(blogSource, /^\s*slug:\s*"([a-z0-9-]+)"/gm);
const citySlugs = ["tehran", "karaj", "andisheh"];

const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/categories", changefreq: "weekly", priority: "0.85" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/gift", changefreq: "monthly", priority: "0.7" },
  { path: "/corporate", changefreq: "monthly", priority: "0.6" },
  { path: "/reviews", changefreq: "monthly", priority: "0.6" },
  { path: "/quality", changefreq: "monthly", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
  { path: "/shipping", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  ...categorySlugs.map((slug) => ({
    path: `/products/category/${slug}`,
    changefreq: "weekly",
    priority: "0.75",
  })),
  ...citySlugs.map((slug) => ({
    path: `/city/${slug}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
  ...blogSlugs.map((slug) => ({
    path: `/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
  ...productSlugs.map((slug) => ({
    path: `/products/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const uniqueEntries = Array.from(
  new Map(entries.map((entry) => [entry.path, entry])).values(),
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.flatMap((entry) => [
    "  <url>",
    `    <loc>${BASE_URL}${entry.path}</loc>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    "  </url>",
  ]),
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml, "utf-8");
console.log(`Generated sitemap with ${uniqueEntries.length} URLs.`);
