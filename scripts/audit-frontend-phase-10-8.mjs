import fs from "node:fs";

const files = {
  docs: "docs/FRONTEND_PHASE_10_8_CORE_WEB_VITALS_MEDIA.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  readme: "README.md",
  package: "package.json",
  root: "src/root.tsx",
  home: "src/pages/HomePage.tsx",
  optimizedImage: "src/components/media/OptimizedImage.tsx",
  productGallery: "src/components/catalog/ProductGallery.tsx",
  blogCard: "src/components/content/BlogPostCard.tsx",
  webVitals: "src/lib/performance/web-vitals.ts",
  reporter: "src/components/performance/WebVitalsReporter.tsx",
  styles: "src/styles/core-web-vitals.css",
  runtime: "server.runtime.mjs",
  performanceAudit: "scripts/audit-performance.mjs",
  unit: "tests/unit/web-vitals.test.ts",
  e2e: "e2e/phase10-8-core-web-vitals-media.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  frontendCi: ".github/workflows/frontend-ci.yml",
  deployment: ".github/workflows/phase8-deployment.yml",
  phase18: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 10.8 file: ${path}`);
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

requireText("docs", "core_web_vitals_media=ready", "final Phase 10.8 marker");
requireText("roadmap", "Phase 10.8 — Core Web Vitals and media — complete");
requireText("readme", "Core Web Vitals and media | Complete in Phase 10.8");

requireText("root", 'rel: "preload"', "LCP image preload");
requireText("root", 'as: "image"', "image preload type");
requireText("root", 'fetchPriority: "high"', "high-priority preload");
requireText("root", "WebVitalsReporter", "field metric reporter mount");
requireText("home", 'loading="eager"', "eager hero image");
requireText("home", 'fetchPriority="high"', "high-priority hero image");
requireText("home", "width={1200}", "hero intrinsic width");
requireText("home", "height={1450}", "hero intrinsic height");

requireText("optimizedImage", "ResponsiveImageSource", "responsive source contract");
requireText("optimizedImage", "resolvedFetchPriority", "network priority contract");
requireText("optimizedImage", "<picture>", "picture fallback support");
requireText("productGallery", "OptimizedImage", "product media primitive");
requireText("productGallery", "priority", "product LCP priority");
requireText("productGallery", 'sizes="(min-width: 1024px) 50vw, 100vw"', "product responsive sizes");
requireText("blogCard", "OptimizedImage", "article media primitive");
requireText("blogCard", 'fetchPriority="low"', "below-fold article priority");

requireText("webVitals", "LCP: { good: 2_500", "LCP threshold");
requireText("webVitals", "INP: { good: 200", "INP threshold");
requireText("webVitals", "CLS: { good: 0.1", "CLS threshold");
requireText("webVitals", '"largest-contentful-paint"', "LCP observer");
requireText("webVitals", '"layout-shift"', "CLS observer");
requireText("webVitals", 'type: "event"', "INP observer");
requireText("webVitals", 'navigator.sendBeacon', "page-exit beacon");
requireText("reporter", "observeCoreWebVitals", "reporter observer wiring");

requireText("runtime", 'app.post(', "RUM ingestion route");
requireText("runtime", '"/__web_vitals"', "RUM endpoint path");
requireText("runtime", 'limit: "8kb"', "bounded RUM request body");
requireText("runtime", '"WINIMI_WEB_VITAL "', "structured metric log");
requireText("runtime", '"X-Robots-Tag", "noindex, nofollow"', "private metric endpoint");
forbidText("runtime", "user-agent", "user agent collection");
forbidText("runtime", "request.ip", "IP collection");

requireText("styles", "scrollbar-gutter: stable", "stable scrollbar layout");
requireText("styles", ".media-frame", "media containment");
requireText("styles", "contain: layout paint", "layout and paint containment");
requireText("styles", "prefers-reduced-data", "reduced-data path");
requireText("performanceAudit", "largestImage: 750 * KIB", "single-image budget");
requireText("performanceAudit", "totalImageBytes: 5 * MIB", "total-image budget");

requireText("unit", "Core Web Vitals thresholds match", "threshold unit gate");
requireText("unit", "INP selection ignores one worst interaction", "INP unit gate");
requireText("e2e", "Phase 10.8 Core Web Vitals and media", "browser acceptance suite");
requireText("e2e", "2_500", "lab LCP target");
requireText("e2e", "0.1", "lab CLS target");
requireText("e2e", "200", "lab interaction target");
requireText("playwright", "phase10-8-core-web-vitals-media.spec.mjs", "Playwright Phase 10.8 registration");
requireText("frontendCi", "Frontend Core Web Vitals and media Phase 10.8", "CI Phase 10.8 gate");
requireText("deployment", "audit:phase10-8", "deployment Phase 10.8 audit");
requireText("deployment", "Verify Core Web Vitals media and RUM runtime", "deployment performance evidence");
requireText("phase18", "Run Phase 10.8 Core Web Vitals and media acceptance", "Laravel performance E2E gate");
requireText("package", '"audit:phase10-8"', "Phase 10.8 package command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase10-8-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 10.8 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.8 audit passed: LCP discovery, intrinsic media sizing, RUM, rendering containment, performance budgets and browser gates are locked.",
);
