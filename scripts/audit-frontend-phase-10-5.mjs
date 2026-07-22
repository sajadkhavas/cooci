import fs from "node:fs";

const files = {
  docs: "docs/FRONTEND_PHASE_10_5_PRODUCT_MERCHANT_SEO.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  readme: "README.md",
  package: "package.json",
  merchantSchema: "src/lib/seo/product-merchant-schema.ts",
  seo: "src/components/SEO.tsx",
  publicSsr: "src/lib/public-ssr.ts",
  loaders: "src/lib/public-loaders.server.ts",
  content: "src/lib/content.ts",
  reviewsHook: "src/hooks/useProductReviews.ts",
  reviewsSection: "src/components/catalog/ProductReviewsSection.tsx",
  productRoute: "src/routes/product-detail.tsx",
  breadcrumbs: "src/components/Breadcrumbs.tsx",
  unit: "tests/unit/product-merchant-schema.test.ts",
  e2e: "e2e/phase10-5-product-merchant-seo.spec.mjs",
  fixture: "scripts/phase10-3-catalog-fixture.mjs",
  frontendCi: ".github/workflows/frontend-ci.yml",
  deployment: ".github/workflows/phase8-deployment.yml",
  phase18: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 10.5 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText("docs", "product_merchant_seo=ready", "final Phase 10.5 marker");
requireText("docs", "ProductGroup", "explicit variant URL boundary");
requireText("roadmap", "Phase 10.5 — Product and merchant SEO — complete");
requireText("readme", "Product and merchant SEO | Complete in Phase 10.5");

requireText("merchantSchema", "createProductMerchantSchema", "central merchant schema builder");
requireText("merchantSchema", "inventoryVerified && isPositiveFinite(activePrice)", "verified Offer gate");
requireText("merchantSchema", "priceCurrency: \"IRR\"", "IRR merchant currency");
requireText("merchantSchema", "activePrice * 10", "Toman-to-rial conversion");
requireText("merchantSchema", "https://schema.org/InStock", "verified availability mapping");
requireText("merchantSchema", "aggregateRating", "approved aggregate rating builder");
requireText("merchantSchema", "review: visibleReviews", "visible review parity");
forbidText("merchantSchema", "MerchantReturnPolicy", "invented merchant return policy");
forbidText("merchantSchema", "OfferShippingDetails", "invented offer shipping details");
forbidText("merchantSchema", '"@type": "ProductGroup"', "unsupported ProductGroup without direct variant URLs");

requireText("seo", "createProductMerchantSchema", "authoritative Product schema integration");
requireText("seo", "productLoaderData.productReviews", "SSR review schema input");
requireText("loaders", "loadOptionalProductReviews", "optional review SSR load");
requireText("loaders", "productReviews", "review loader payload");
requireText("publicSsr", "productReviews?: ProductReviewsResult", "typed public SSR reviews");
requireText("content", "Math.min(30", "Laravel review page-size limit");
requireText("reviewsHook", "loaderData.productReviews", "hydration-safe review initial data");
requireText("reviewsSection", "نظر خریداران", "visible review section");
requireText("reviewsSection", "خرید تأییدشده", "verified purchase presentation");
requireText("productRoute", "ProductReviewsSection", "product review route composition");
requireText("breadcrumbs", "/products/category/", "crawlable category breadcrumb normalization");

requireText("unit", "unverified inventory omits the complete Offer", "unverified Offer unit gate");
requireText("unit", "only visible approved review data", "review parity unit gate");
requireText("unit", "hasMerchantReturnPolicy", "return-policy non-invention assertion");
requireText("e2e", "Phase 10.5 product and merchant SEO", "merchant Playwright acceptance");
requireText("fixture", "/reviews", "deterministic review fixture endpoint");
requireText("frontendCi", "Frontend product and merchant SEO Phase 10.5", "CI Phase 10.5 gate");
requireText("deployment", "audit:phase10-5", "deployment Phase 10.5 audit");
requireText("phase18", "Run Phase 10.5 product and merchant SEO acceptance", "Laravel merchant E2E gate");
requireText("package", '"audit:phase10-5"', "Phase 10.5 package command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase10-5-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 10.5 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.5 audit passed: authoritative SSR Product offers, visible approved reviews, crawlable breadcrumbs and no invented merchant policy are locked.",
);
