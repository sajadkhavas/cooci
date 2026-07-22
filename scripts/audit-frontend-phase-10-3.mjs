import fs from "node:fs";

const files = {
  routes: "src/routes.ts",
  loaders: "src/lib/public-loaders.server.ts",
  contract: "src/lib/public-ssr.ts",
  catalogQuery: "src/lib/catalog-query.ts",
  catalogQueryTest: "tests/unit/catalog-query.test.ts",
  catalogHook: "src/hooks/useCatalog.ts",
  homeRoute: "src/routes/home.tsx",
  shopRoute: "src/routes/products-shop.tsx",
  categoryRoute: "src/routes/category-shop.tsx",
  productRoute: "src/routes/product-detail.tsx",
  blogListRoute: "src/routes/blog-list.tsx",
  blogDetailRoute: "src/routes/blog-detail.tsx",
  cityRoute: "src/routes/city.tsx",
  blogList: "src/pages/BlogListPage.tsx",
  blogDetail: "src/pages/BlogDetailPage.tsx",
  city: "src/pages/CityPage.tsx",
  playwright: "e2e/playwright.config.mjs",
  sourceSpec: "e2e/phase10-3-ssr-source.spec.mjs",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  doc: "docs/FRONTEND_PHASE_10_3_FULL_SERVER_DATA_RENDERING.md",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push(`Missing Phase 10.3 file: ${path}`);
  else sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};

requireText("routes", 'index("./routes/home.tsx")', "SSR homepage route wrapper");
requireText("routes", 'route("products/:slug", "./routes/product-detail.tsx")', "SSR product route wrapper");
requireText("routes", 'route("blog/:slug", "./routes/blog-detail.tsx")', "SSR blog detail wrapper");
requireText("routes", 'route("city/:slug", "./routes/city.tsx")', "SSR city wrapper");

for (const loader of [
  "loadHomePublicData",
  "loadShopPublicData",
  "loadProductPublicData",
  "loadBlogListPublicData",
  "loadBlogDetailPublicData",
  "loadCityPublicData",
]) {
  requireText("loaders", `export const ${loader}`, loader);
}
requireText("loaders", "fetchCatalogProduct(slug)", "server product fetch");
requireText("loaders", "loadPost(slug)", "server article fetch");
requireText("loaders", "loadCityPage(slug)", "server city fetch");
requireText("loaders", "throw toPublicSsrResponse", "fail-closed public loader errors");

requireText("contract", "catalogLoaderKey", "stable loader/query cache key");
requireText("contract", "passPublicSsrHeaders", "route header passthrough");
requireText("contract", 'source.get(name)', "selected loader/error header forwarding");
requireText("contract", "status: 404", "real missing-resource status");
requireText("contract", "status: 503", "temporary upstream failure status");
requireText("contract", '"X-Robots-Tag": "noindex, nofollow"', "error noindex header");

requireText("catalogQuery", 'value ? "1" : "0"', "Laravel boolean encoding");
requireText("catalogQuery", 'params.set("featured", laravelBoolean(query.featured))', "featured boolean serializer");
requireText("catalogQuery", 'params.set("requiresCooling", laravelBoolean(query.requiresCooling))', "cooling boolean serializer");
requireText("catalogQuery", 'params.set("inStock", laravelBoolean(query.inStock))', "stock boolean serializer");
requireText("catalogQueryTest", 'assert.equal(params.get("featured"), "1")', "featured serializer regression test");
requireText("catalogQueryTest", 'assert.equal(params.get("requiresCooling"), "0")', "cooling serializer regression test");

requireText("catalogHook", "useLoaderData", "route loader hydration access");
requireText("catalogHook", "initialData: isBackendEnabled ? initialCatalog", "catalog initial data");
requireText("catalogHook", "initialData: isBackendEnabled ? loaderData?.categories", "category initial data");
requireText("catalogHook", "initialData: isBackendEnabled ? initialProduct", "product initial data");
requireText("shopRoute", "return loadShopPublicData(args)", "all-products server data loader");
requireText("categoryRoute", "return loadShopPublicData(args)", "category server data loader");
requireText("blogList", "initialData: isBackendEnabled ? initialPosts", "blog listing initial data");
requireText("blogDetail", "initialData: isBackendEnabled ? initialPost", "blog detail initial data");
requireText("city", "initialData: isBackendEnabled ? initialCity", "city initial data");

for (const routeFile of [
  "homeRoute",
  "shopRoute",
  "categoryRoute",
  "productRoute",
  "blogListRoute",
  "blogDetailRoute",
  "cityRoute",
]) {
  requireText(
    routeFile,
    "passPublicSsrHeaders as headers",
    "public SSR response header export",
  );
}

requireText("playwright", '"phase10-3-ssr-source.spec.mjs"', "raw source acceptance inclusion");
for (const path of [
  "/products/staging-chocolate-cookie",
  "/blog/staging-welcome",
  "/city/staging-tehran",
]) {
  requireText("sourceSpec", path, `raw SSR check for ${path}`);
}
requireText("sourceSpec", "expect(product.status()).toBe(404)", "real product 404 acceptance");
requireText(
  "acceptanceWorkflow",
  "Run Phase 10.3 raw dynamic SSR acceptance",
  "dedicated Phase 10.3 workflow step",
);
requireText(
  "acceptanceWorkflow",
  "npm run test:e2e -- phase10-3-ssr-source.spec.mjs",
  "executed Phase 10.3 Playwright suite",
);
requireText(
  "acceptanceWorkflow",
  "phase10-3-ssr-source.log",
  "retained Phase 10.3 browser evidence",
);
requireText("doc", "full_public_ssr=ready", "Phase 10.3 completion marker");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  marker: "full_public_ssr=ready",
  errors,
};
fs.writeFileSync(
  "frontend-phase10-3-audit.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.3 audit passed: authoritative Laravel data is rendered in public SSR HTML; full_public_ssr=ready.",
);
