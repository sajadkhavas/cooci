import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const requiredFiles = [
  "docs/seo/F29S_A_KEYWORD_INTELLIGENCE_FA.md",
  "docs/seo/F29S_B_KEYWORD_TO_URL_MAP_FA.md",
  "docs/seo/F29S_C_TOPIC_CLUSTER_ARCHITECTURE_FA.md",
  "docs/seo/F29S_E_COMMERCIAL_CONTENT_SEO_FA.md",
  "docs/seo/F29S_F_PRODUCT_SEO_AUDIT_FA.md",
  "docs/seo/F29S_H_INTERNAL_LINKING_INFORMATION_ARCHITECTURE_FA.md",
  "docs/seo/F29S_I_MEASUREMENT_PLAN_FA.md",
  "docs/seo/f29s-i-measurement-matrix.csv",
  "src/components/content/CategoryGuideLinks.tsx",
  "tests/unit/f29s-internal-linking.test.ts",
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    throw new Error(`F29S closure file missing: ${relativePath}`);
  }
}

const keywordMap = read("docs/seo/F29S_B_KEYWORD_TO_URL_MAP_FA.md");
const internalLinks = read(
  "docs/seo/F29S_H_INTERNAL_LINKING_INFORMATION_ARCHITECTURE_FA.md",
);
const measurementPlan = read("docs/seo/F29S_I_MEASUREMENT_PLAN_FA.md");
const categoryGuideLinks = read(
  "src/components/content/CategoryGuideLinks.tsx",
);
const categoryRoute = read("src/routes/category-shop.tsx");
const homeGuides = read("src/components/home/EditorialGuides.tsx");
const blogDetail = read("src/pages/BlogDetailPage.tsx");

const expectIncludes = (source, value, label) => {
  if (!source.includes(value)) {
    throw new Error(`F29S closure invariant failed: ${label}`);
  }
};

expectIncludes(keywordMap, "/city/:slug", "local route must remain explicitly mapped");
expectIncludes(keywordMap, "HOLD/Conditional", "doorway guard must remain on local pages");

for (const route of [
  "/blog/cookie-storage-guide",
  "/blog/cookies-per-guest-guide",
  "/blog/cheesecake-cold-storage",
]) {
  expectIncludes(categoryGuideLinks, route, `category contextual link ${route}`);
}
expectIncludes(
  categoryRoute,
  "<CategoryGuideLinks slug={slug} />",
  "canonical category route must render contextual guides",
);

for (const route of [
  "/blog/choose-food-gift-box",
  "/blog/cookie-storage-guide",
  "/blog/cookies-per-guest-guide",
]) {
  expectIncludes(homeGuides, route, `home editorial destination ${route}`);
}
expectIncludes(blogDetail, "relatedPosts.map", "guide-to-guide related navigation");
expectIncludes(blogDetail, "getContentTopicPath", "guide-to-topic navigation");
expectIncludes(internalLinks, "Product → Guide", "product-link conditional decision must be documented");
expectIncludes(internalLinks, "NO GENERIC LINK", "unverified product-guide relation must stay blocked");

expectIncludes(
  measurementPlan,
  "Current values: **NOT COLLECTED — PRE-PRODUCTION**",
  "measurement baseline must not be fabricated",
);
expectIncludes(
  measurementPlan,
  "Search Console mutation: **NO**",
  "Search Console must remain untouched before production",
);
expectIncludes(
  measurementPlan,
  "https://support.google.com/webmasters/answer/9012289",
  "URL Inspection official reference",
);
expectIncludes(
  measurementPlan,
  "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
  "sitemap official reference",
);

console.log("F29S_CLOSURE_AUDIT=PASS");
console.log("F29S_REQUIRED_FRONTEND_EVIDENCE=PASS");
console.log("F29S_INTERNAL_LINKING_CONTRACT=PASS");
console.log("F29S_MEASUREMENT_TRUTH_BOUNDARY=PASS");
console.log("PRODUCTION_MUTATION=NO");
