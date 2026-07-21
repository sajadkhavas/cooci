import fs from "node:fs";

const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_7.md",
  package: "package.json",
  app: "src/App.tsx",
  vite: "vite.config.ts",
  main: "src/main.tsx",
  registration: "src/lib/registerServiceWorker.ts",
  workerTemplate: "scripts/service-worker.template.js",
  workerGenerator: "scripts/generate-service-worker.mjs",
  manifest: "public/manifest.webmanifest",
  index: "index.html",
  headers: "public/_headers",
  performance: "scripts/audit-performance.mjs",
  pwaE2e: "e2e/phase7-pwa.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  proxy: "scripts/https-loopback-proxy.mjs",
  workflow: ".github/workflows/frontend-ci.yml",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing Phase 7 file: ${filePath}`);
    continue;
  }
  sources[name] = fs.readFileSync(filePath, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};

const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText(
  "threatModel",
  "static cache versions can preserve obsolete behavior indefinitely",
  "cache-version threat boundary",
);
requireText(
  "threatModel",
  "transactional routes must not execute a cached application shell",
  "transactional offline boundary",
);
requireText("threatModel", "Production source maps", "production artifact budget boundary");

requireText(
  "package",
  '"build": "vite build && node scripts/generate-service-worker.mjs"',
  "post-Vite service worker generation",
);
requireText("package", '"audit:phase7"', "Phase 7 audit command");
requireText("package", "npm run audit:phase7", "Phase 7 check gate");

requireText("vite", 'mode === "development" && componentTagger()', "development-only tagger");
requireText("vite", "cssCodeSplit: true", "CSS code splitting");
requireText("vite", 'target: "es2020"', "explicit production target");
requireText("vite", "sourcemap: false", "disabled production source maps");
requireText("vite", "manualChunks: vendorChunk", "stable vendor chunk policy");
forbidText("vite", "plugins: [react(), componentTagger()]", "unconditional development tagger");

const lazyPages = [
  "AboutPage",
  "AccountPage",
  "BlogDetailPage",
  "BlogListPage",
  "CartPage",
  "CategoryPage",
  "CheckoutPage",
  "CityPage",
  "ContactPage",
  "CorporatePage",
  "FAQPage",
  "GalleryPage",
  "GiftPage",
  "LoginPage",
  "NotFoundPage",
  "OrderDetailPage",
  "PaymentCallbackPage",
  "PaymentMockPage",
  "PrivacyPage",
  "ProductDetailPage",
  "ProductsPage",
  "QualityPage",
  "ReviewsPage",
  "ShippingPage",
  "TermsPage",
];
for (const page of lazyPages) {
  requireText("app", `const ${page} = lazy(() => import(`, `${page} lazy route`);
}
requireText("app", 'import HomePage from "./pages/HomePage"', "eager home route only");
const eagerPageImports = [...(sources.app ?? "").matchAll(/^import\s+\w+\s+from\s+["']\.\/pages\/(.+?)["'];$/gm)]
  .map((match) => match[1])
  .filter((page) => page !== "HomePage");
if (eagerPageImports.length) {
  errors.push(`src/App.tsx: secondary pages are eagerly imported: ${eagerPageImports.join(", ")}`);
}

requireText("main", "registerServiceWorker();", "service worker registration entrypoint");
requireText("registration", "import.meta.env.DEV", "development registration guard");
requireText("registration", "window.isSecureContext", "secure-context registration guard");
requireText("registration", '.register("/sw.js", { scope: "/" })', "root-scoped worker registration");
requireText("registration", "registration.update()", "periodic worker update check");

requireText("workerTemplate", 'const BUILD_VERSION = "__WINIMI_BUILD_VERSION__"', "build fingerprint placeholder");
requireText("workerTemplate", "`${CACHE_PREFIX}-shell-${BUILD_VERSION}`", "versioned shell cache");
requireText("workerTemplate", "`${CACHE_PREFIX}-assets-${BUILD_VERSION}`", "versioned asset cache");
requireText("workerTemplate", "`${CACHE_PREFIX}-images-${BUILD_VERSION}`", "versioned image cache");
requireText("workerTemplate", 'cache: "no-store"', "network navigation cache bypass");
requireText("workerTemplate", '"/account"', "offline account boundary");
requireText("workerTemplate", '"/checkout"', "offline checkout boundary");
requireText("workerTemplate", '"/payment"', "offline payment boundary");
requireText("workerTemplate", "if (isSensitiveNavigation(url.pathname))", "sensitive navigation fallback");
requireText("workerTemplate", 'request.headers.has("range")', "range request bypass");
requireText("workerTemplate", "url.origin !== self.location.origin", "cross-origin bypass");
requireText("workerTemplate", "matchCache(cacheName, request)", "cache-local matching");
forbidText("workerTemplate", "caches.match(request)", "cross-version global cache lookup");
forbidText("workerTemplate", "shell-v2", "fixed shell cache version");

requireText("workerGenerator", 'createHash("sha256")', "artifact fingerprint hashing");
requireText("workerGenerator", 'resolve(process.cwd(), "dist")', "dist generation target");
requireText("workerGenerator", "filePath !== OUTPUT_PATH", "worker self-exclusion from fingerprint");
requireText("workerGenerator", 'slice(0, 16)', "bounded build version");
requireText("workerGenerator", "placeholderCount !== 1", "single placeholder invariant");

let manifest;
try {
  manifest = JSON.parse(sources.manifest ?? "");
} catch (error) {
  errors.push(`public/manifest.webmanifest: invalid JSON (${error.message})`);
}

if (manifest) {
  if (manifest.id !== "/") errors.push("public/manifest.webmanifest: id must be /");
  if (manifest.scope !== "/") errors.push("public/manifest.webmanifest: scope must be /");
  if (!String(manifest.start_url ?? "").startsWith("/")) {
    errors.push("public/manifest.webmanifest: start_url must be same-origin and root-relative");
  }
  if (manifest.lang !== "fa-IR" || manifest.dir !== "rtl") {
    errors.push("public/manifest.webmanifest: Persian RTL identity is incomplete");
  }

  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  const hasPng192 = icons.some(
    (icon) => icon.src === "/icons/winimi-192.png" && icon.sizes === "192x192" && icon.type === "image/png",
  );
  const hasPng512 = icons.some(
    (icon) => icon.src === "/icons/winimi-512.png" && icon.sizes === "512x512" && icon.type === "image/png",
  );
  const hasMaskable = icons.some(
    (icon) => icon.src === "/icons/winimi-512.png" && String(icon.purpose).includes("maskable"),
  );
  if (!hasPng192) errors.push("public/manifest.webmanifest: missing 192x192 PNG icon");
  if (!hasPng512) errors.push("public/manifest.webmanifest: missing 512x512 PNG icon");
  if (!hasMaskable) errors.push("public/manifest.webmanifest: missing maskable PNG icon");
}

const pngIcons = [
  "public/icons/winimi-192.png",
  "public/icons/winimi-512.png",
  "public/icons/winimi-apple-touch.png",
];
for (const iconPath of pngIcons) {
  if (!fs.existsSync(iconPath)) {
    errors.push(`Missing Phase 7 icon: ${iconPath}`);
    continue;
  }
  const signature = fs.readFileSync(iconPath).subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") errors.push(`${iconPath}: invalid PNG signature`);
}

requireText(
  "index",
  '<link rel="apple-touch-icon" sizes="180x180" href="/icons/winimi-apple-touch.png" />',
  "dedicated Apple touch icon",
);
requireText("headers", "/assets/*\n  Cache-Control: public, max-age=31536000, immutable", "immutable hashed asset cache");
requireText("headers", "/sw.js\n  Cache-Control: no-cache, no-store, must-revalidate", "uncached service worker");
requireText("headers", "/\n  Cache-Control: no-cache, no-store, must-revalidate", "uncached root HTML");
requireText("headers", "/index.html\n  Cache-Control: no-cache, no-store, must-revalidate", "uncached index HTML");

requireText("performance", '"dist/sw.js"', "generated worker production requirement");
requireText("performance", "entryGzip", "entry bundle budget");
requireText("performance", "largestJavaScriptGzip", "route/vendor chunk budget");
requireText("performance", "totalJavaScriptGzip", "total JavaScript budget");
requireText("performance", "minimumJavaScriptChunks", "route splitting budget");

requireText("pwaE2e", "waitForServiceWorkerControl", "service worker control wait");
requireText(
  "pwaE2e",
  'const NETWORK_FAILURE_QUERY = "__winimi_network_failure"',
  "deterministic network failure query",
);
requireText(
  "pwaE2e",
  'await page.goto(`/checkout?${NETWORK_FAILURE_QUERY}=1`',
  "fault-injected checkout navigation",
);
requireText("pwaE2e", "اتصال اینترنت در دسترس نیست", "fail-closed offline document assertion");
forbidText("pwaE2e", "context.setOffline(", "browser-only offline emulation");
requireText("playwright", '"phase7-pwa.spec.mjs"', "Phase 7 browser suite inclusion");
requireText("proxy", "failureQueryParam", "loopback failure query configuration");
requireText("proxy", "request.socket.destroy();", "real network connection termination");

requireText("workflow", "Frontend full-audit Phase 7", "Phase 7 CI step");
requireText("workflow", "frontend-phase7-audit.json", "Phase 7 diagnostics artifact");
requireText("workflow", "frontend-performance-report", "performance report artifact");
requireText("acceptanceWorkflow", "Build production storefront and generated PWA", "production acceptance build");
requireText("acceptanceWorkflow", "npm run preview", "production preview server");
requireText("acceptanceWorkflow", "Run desktop, mobile and PWA acceptance", "PWA browser acceptance step");
requireText(
  "acceptanceWorkflow",
  "HTTPS_PROXY_FAILURE_QUERY_PARAM=__winimi_network_failure",
  "deterministic storefront network failure configuration",
);
forbidText("acceptanceWorkflow", "npm run dev -- --host", "development-server acceptance");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  lazyRouteCount: lazyPages.length,
  iconCount: manifest?.icons?.length ?? 0,
  errors,
};
fs.writeFileSync("frontend-phase7-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 7 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 7 audit passed: route splitting, production build boundaries, versioned PWA caches, deterministic fail-closed navigation, install icons, production browser acceptance and performance gates are locked.",
);
