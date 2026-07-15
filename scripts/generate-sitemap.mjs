// Writes public/sitemap.xml before dev/build without requiring Bun or tsx.
// Reads slugs from src/data/products.ts by regex to avoid importing image assets.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = process.env.SITE_URL || "https://winimibakery.com";
const productsSource = readFileSync(resolve("src/data/products.ts"), "utf-8");
const categorySlugs = new Set(["all", "cookies", "mini-cookies", "cakes", "diet", "gift", "pastry"]);
const slugMatches = Array.from(productsSource.matchAll(/slug:\s*"([a-z0-9-]+)"/g))
  .map((match) => match[1])
  .filter((slug) => !categorySlugs.has(slug));
const productSlugs = Array.from(new Set(slugMatches));

const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
  { path: "/shipping", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  { path: "/cart", changefreq: "weekly", priority: "0.6" },
  { path: "/checkout", changefreq: "weekly", priority: "0.4" },
  ...productSlugs.map((slug) => ({
    path: `/products/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const urls = entries
  .map((entry) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${entry.path}</loc>`,
      entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
      entry.priority ? `    <priority>${entry.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  "</urlset>",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries) for ${BASE_URL}`);
