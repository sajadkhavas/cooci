import fs from "node:fs";

const files = {
  routes: "src/routes.ts",
  urlPolicy: "src/lib/seo/url-policy.ts",
  sitemap: "src/lib/seo/sitemap.server.ts",
  localServer: "src/lib/seo/local-seo.server.ts",
  sitemapRoute: "src/routes/sitemap.ts",
  robotsRoute: "src/routes/robots.ts",
  seo: "src/components/SEO.tsx",
  loaders: "src/lib/public-loaders.server.ts",
  redirect: "src/routes/categories-redirect.tsx",
  runtime: "server.runtime.mjs",
  unit: "tests/unit/seo-url-policy.test.ts",
  e2e: "e2e/phase10-4-crawl-index.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  frontendWorkflow: ".github/workflows/frontend-ci.yml",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  deploymentWorkflow: ".github/workflows/phase8-deployment.yml",
  package: "package.json",
  doc: "docs/FRONTEND_PHASE_10_4_CRAWL_INDEX_URL_ARCHITECTURE.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push(`Missing Phase 10.4 file: ${path}`);
  else sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};

for (const stalePath of [
  "public/sitemap.xml",
  "public/robots.txt",
  "scripts/generate-sitemap.mjs",
]) {
  if (fs.existsSync(stalePath)) errors.push(`Stale crawl artifact must be removed: ${stalePath}`);
}

requireText("routes", 'route("sitemap.xml", "./routes/sitemap.ts")', "dynamic sitemap route");
requireText("routes", 'route("robots.txt", "./routes/robots.ts")', "dynamic robots route");
requireText("urlPolicy", "resolvePaginationUrlPolicy", "central pagination policy");
requireText("urlPolicy", '"noindex,follow"', "filtered URL robots policy");
requireText("urlPolicy", "LEGACY_EXACT_REDIRECTS", "redirect registry");
requireText("urlPolicy", "PRIVATE_INDEX_PREFIXES", "private index registry");
requireText("sitemap", "fetchCatalogProducts", "Laravel product sitemap source");
requireText("sitemap", "fetchCatalogCategories", "Laravel category sitemap source");
requireText("sitemap", "loadPosts", "Laravel post sitemap source");
requireText("sitemap", "collectPublishedCityPages", "shared authoritative Laravel city collector");
requireText("localServer", "loadCityPage", "Laravel city validation");
requireText("localServer", "WINIMI_PUBLIC_CITY_SLUGS", "server city registry override");
requireText("sitemapRoute", '"application/xml; charset=utf-8"', "XML response type");
requireText("sitemapRoute", "status: 503", "fail-closed sitemap response");
requireText("robotsRoute", "createRobotsText", "central robots policy");
requireText("seo", 'rel="prev"', "pagination previous link");
requireText("seo", 'rel="next"', "pagination next link");
requireText("seo", "resolvePaginationUrlPolicy", "automatic canonical policy");
requireText("loaders", "crawlResponse", "HTTP crawl headers");
requireText("loaders", "return redirect(policy.redirectPath, 301)", "canonical pagination redirect");
requireText("redirect", "getLegacyRedirectTarget", "redirect registry consumption");
requireText("runtime", 'response.setHeader("X-Robots-Tag", "noindex, nofollow")', "private route HTTP noindex");
requireText("unit", "filtered catalog URLs are noindex-follow", "filtered URL unit test");
requireText("unit", "clean pagination uses self-canonical", "pagination canonical unit test");
requireText("e2e", "dynamic sitemap contains authoritative Laravel public resources only", "dynamic sitemap acceptance");
requireText("e2e", "filtered shop URLs remain crawlable but cannot be indexed", "filter noindex acceptance");
requireText("playwright", '"phase10-4-crawl-index.spec.mjs"', "Phase 10.4 Playwright inclusion");
requireText("frontendWorkflow", "Frontend crawl and URL architecture Phase 10.4", "Phase 10.4 frontend CI gate");
requireText("acceptanceWorkflow", "Run Phase 10.4 crawl and index acceptance", "Phase 10.4 E2E gate");
requireText("deploymentWorkflow", "Verify dynamic sitemap and robots", "deployment crawl smoke test");
requireText("package", '"audit:phase10-4"', "Phase 10.4 package audit command");
requireText("doc", "crawl_index_url_architecture=ready", "Phase 10.4 completion marker");
requireText("roadmap", "Phase 10.4 — Crawl, index and URL architecture — complete", "Roadmap completion state");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  marker: "crawl_index_url_architecture=ready",
  errors,
};
fs.writeFileSync(
  "frontend-phase10-4-audit.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (errors.length) {
  console.error(`Frontend Phase 10.4 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.4 audit passed: dynamic crawl resources, canonical pagination, filtered noindex, private route protection and redirect registry are locked; crawl_index_url_architecture=ready.",
);
