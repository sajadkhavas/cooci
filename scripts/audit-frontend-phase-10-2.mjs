import fs from "node:fs";

const files = {
  routes: "src/routes.ts",
  redirect: "src/routes/categories-redirect.tsx",
  categoryShop: "src/routes/category-shop.tsx",
  products: "src/pages/ProductsPage.tsx",
  home: "src/pages/HomePage.tsx",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  showcase: "src/components/catalog/CategoryShowcase.tsx",
  sitemapGenerator: "scripts/generate-sitemap.mjs",
  runtimeE2e: "e2e/runtime-performance.spec.mjs",
  doc: "docs/FRONTEND_PHASE_10_2_UNIFIED_SHOP_CATEGORIES.md",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push(`Missing Phase 10.2 file: ${path}`);
  else sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText(
  "routes",
  'route("categories", "./routes/categories-redirect.tsx")',
  "legacy permanent redirect route",
);
requireText(
  "routes",
  'route("products/category/:slug", "./routes/category-shop.tsx")',
  "unique category route-module wrapper",
);
requireText(
  "categoryShop",
  'export { default, loader } from "../pages/ProductsPage"',
  "shared ProductsPage implementation",
);
requireText("redirect", 'redirect("/products", 301)', "301 redirect");
requireText("products", "export const loader", "legacy query redirect loader");
requireText("products", "resolveEditorialSlug", "backend/editorial slug bridge");
requireText("products", "categoryNavigation", "category navigation inside shop");
requireText("products", "getCategoryContent", "category-specific SEO content");
requireText(
  "products",
  'aria-label="دسته‌بندی محصولات"',
  "accessible category navigation",
);
requireText("products", "hasNonCanonicalFilters", "filtered page noindex policy");
requireText("products", "CatalogPagination", "shared pagination");
requireText("products", '"@type": "CollectionPage"', "category collection schema");
forbidText("home", 'to="/categories"', "homepage category-index link");
forbidText("header", 'href: "/categories"', "duplicate category header item");
forbidText("footer", "/categories", "duplicate category footer item");
requireText("showcase", 'to="/products"', "unified shop all-link");
forbidText(
  "sitemapGenerator",
  '{ path: "/categories"',
  "redirect-only sitemap entry",
);
requireText("runtimeE2e", "shop unifies categories and filters", "browser acceptance");
requireText("doc", "unified_shop_categories=ready", "phase marker");

for (const removed of [
  "src/pages/CategoriesPage.tsx",
  "src/pages/CategoryPage.tsx",
]) {
  if (fs.existsSync(removed)) {
    errors.push(`${removed} must be removed after UI unification`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  marker: "unified_shop_categories=ready",
  errors,
};
fs.writeFileSync(
  "frontend-phase10-2-audit.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Frontend Phase 10.2 audit passed: unified_shop_categories=ready.");
