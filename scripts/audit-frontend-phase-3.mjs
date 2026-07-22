import fs from "node:fs";

const files = {
  contract: "src/lib/catalog-contract-schema.ts",
  adapter: "src/lib/catalog-schema.ts",
  catalogApi: "src/lib/catalog-api.ts",
  catalogQuery: "src/lib/catalog-query.ts",
  catalog: "src/lib/catalog.ts",
  productSelection: "src/lib/product-selection.ts",
  cart: "src/lib/cart.ts",
  cartState: "src/lib/cart-state.ts",
  cartContext: "src/context/CartContext.tsx",
  reconciliation: "src/hooks/useCartCatalogReconciliation.ts",
  productDetail: "src/pages/ProductDetailPage.tsx",
  productCard: "src/components/ProductCard.tsx",
  productsPage: "src/pages/ProductsPage.tsx",
  cartPage: "src/pages/CartPage.tsx",
  unit: "tests/unit/catalog-cart.test.ts",
  aliasLoader: "tests/unit/alias-loader.mjs",
  package: "package.json",
};

const errors = [];
const sources = {};

for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 3 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) {
    errors.push(`${files[file]}: missing ${label}`);
  }
};

const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) {
    errors.push(`${files[file]}: contains forbidden ${label}`);
  }
};

requireText("contract", "safeCatalogMediaUrlSchema", "safe media URL schema");
requireText("contract", "available product has no stock", "product stock consistency rule");
requireText("contract", "available variant has no stock", "Variant stock consistency rule");
requireText("contract", "sale price exceeds regular price", "price consistency rule");
requireText(
  "contract",
  "product.mediaVerified && product.images.some",
  "unverifiable media downgrade",
);
requireText("contract", "empty pagination has non-null bounds", "empty pagination consistency rule");
requireText("adapter", "backendProductSchema", "runtime product schema adapter");
requireText("adapter", 'code: "invalid_catalog_contract"', "catalog contract error code");
requireText("catalogApi", "parseBackendProducts", "runtime products parsing");
requireText("catalogApi", "parseBackendPagination", "runtime pagination parsing");
requireText("catalogApi", "verifiedImages", "verified media filtering");
requireText("catalogApi", "toCatalogSearchParams", "shared catalog query serializer");
requireText("catalogQuery", "MAX_SEARCH_LENGTH = 120", "bounded search query");
requireText("catalogQuery", "MAX_PER_PAGE = 100", "bounded page size");

requireText("catalog", "return 0;", "unknown stock fallback to zero");
forbidText(
  "catalog",
  'typeof product.stock === "number" ? product.stock : 1',
  "fabricated product stock",
);
forbidText(
  "catalog",
  'typeof variantStock === "number" ? variantStock : 1',
  "fabricated Variant stock",
);
requireText("catalog", "getVariantSalePrice", "Variant sale-price handling");
requireText("catalog", "getComparableUpdatedAt", "deterministic newest sorting");
requireText("productSelection", "getPreferredProductVariant", "available default Variant selection");

requireText("cart", "MAX_CART_ITEMS = 100", "bounded cart item count");
requireText("cart", "raw.length > 1_000_000", "bounded persisted cart payload");
requireText("cart", "effectiveStock <= 0", "unknown persisted stock becomes unavailable");
forbidText("cart", "?? 99", "fabricated cart stock");
requireText("cartState", "if (!product) return item", "partial catalog cannot invalidate absent item");
requireText("cartState", "if (stock <= 0", "ADD rejects non-positive stock");
requireText("cartContext", 'window.addEventListener("storage"', "cross-tab cart synchronization");
requireText("reconciliation", "fetchCatalogProduct(slug)", "exact per-slug cart reconciliation");
requireText("reconciliation", "products.length !== slugs.length", "complete reconciliation requirement");

requireText("productDetail", "getPreferredProductVariant", "safe Variant default selection");
requireText("productDetail", "getVariantDisplayPrice", "Variant current price");
requireText("productDetail", "stock: activeStock", "authoritative product stock snapshot");
requireText("productDetail", "regularPriceToman:", "regular price snapshot");
requireText("productDetail", "inventoryVerified", "verified inventory schema handling");
requireText("productCard", "getPublicProductSummary", "verified public product summary");
requireText("productCard", "const isOutOfStock = stock <= 0", "unknown stock cannot be added");
requireText("productCard", "stock,", "stock snapshot passed to cart");
requireText("productsPage", "const updateParams", "atomic URL parameter updates");
requireText("productsPage", "Math.min(10_000, parsed)", "bounded requested page");
requireText("productsPage", "event.target.value.slice(0, 120)", "bounded URL search input");
requireText("productsPage", "onClick={() => void refetch()}", "query retry without full reload");
forbidText("productsPage", "window.location.reload()", "full-page retry");
requireText("cartPage", "useCartCatalogReconciliation", "exact cart reconciliation hook");
requireText("cartPage", "cartCatalogReconciled", "checkout reconciliation gate");
requireText("cartPage", "تهران، کرج و اندیشه", "complete chilled delivery area copy");

requireText("unit", "runtime catalog contract rejects unsafe media", "unsafe media unit test");
requireText("unit", "unverifiable media is downgraded", "media downgrade unit test");
requireText("unit", "missing persisted stock becomes unavailable", "unknown stock unit test");
requireText("unit", "partial catalog page cannot invalidate", "partial catalog unit test");
requireText("unit", "exact Variant reconciliation", "Variant reconciliation unit test");
requireText("aliasLoader", "Unit-test alias loader", "Node alias resolver");
requireText("package", '"audit:phase3"', "Phase 3 audit command");
requireText("package", "alias-loader.mjs", "unit-test alias loader command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase3-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 3 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 3 audit passed: runtime catalog contracts, safe stock and Variant pricing, bounded cart persistence, exact per-slug reconciliation and atomic catalog filters are locked.",
);
