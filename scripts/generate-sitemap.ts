// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
// Reads slugs from src/data/products.ts by regex to avoid importing image assets.
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://cooci.lovable.app";

const productsSource = readFileSync(resolve("src/data/products.ts"), "utf-8");
const categorySlugs = new Set(["all", "cookies", "mini-cookies", "cakes", "diet", "gift", "pastry"]);
const slugMatches = Array.from(productsSource.matchAll(/slug:\s*"([a-z0-9-]+)"/g))
  .map((m) => m[1])
  .filter((s) => !categorySlugs.has(s));
const productSlugs = Array.from(new Set(slugMatches));

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
}

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
  { path: "/shipping", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  ...productSlugs.map((slug) => ({
    path: `/products/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
];

const urls = entries
  .map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
