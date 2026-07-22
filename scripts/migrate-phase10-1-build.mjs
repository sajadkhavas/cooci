import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const read = (path) => readFileSync(path, "utf8");
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart().replace(/\s*$/, "\n"), "utf8");
};

write(
  "scripts/generate-service-worker.mjs",
  `import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";

const CLIENT_DIR = resolve(process.cwd(), "build/client");
const TEMPLATE_PATH = resolve(process.cwd(), "scripts/service-worker.template.js");
const OUTPUT_PATH = join(CLIENT_DIR, "sw.js");
const VERSION_PLACEHOLDER = "__WINIMI_BUILD_VERSION__";

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });

if (!existsSync(CLIENT_DIR)) {
  throw new Error(
    "Service worker generation requires a completed React Router build in build/client/.",
  );
}
if (!existsSync(TEMPLATE_PATH)) {
  throw new Error("Service worker template is missing: " + TEMPLATE_PATH);
}

const template = readFileSync(TEMPLATE_PATH, "utf8");
const placeholderCount = template.split(VERSION_PLACEHOLDER).length - 1;
if (placeholderCount !== 1) {
  throw new Error(
    "Service worker template must contain exactly one " +
      VERSION_PLACEHOLDER +
      " placeholder.",
  );
}

const fingerprint = createHash("sha256");
fingerprint.update(template);
for (const filePath of walk(CLIENT_DIR)
  .filter((filePath) => filePath !== OUTPUT_PATH)
  .sort((left, right) => left.localeCompare(right))) {
  const stats = statSync(filePath);
  fingerprint.update(relative(CLIENT_DIR, filePath));
  fingerprint.update(String(stats.size));
  fingerprint.update(readFileSync(filePath));
}

const buildVersion = fingerprint.digest("hex").slice(0, 16);
const serviceWorker = template.replace(VERSION_PLACEHOLDER, buildVersion);
writeFileSync(OUTPUT_PATH, serviceWorker.trimEnd() + "\\n");
console.log("Generated build/client/sw.js for build " + buildVersion + ".");
`,
);

write(
  "scripts/audit-performance.mjs",
  `import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const CLIENT_DIR = "build/client";
const RUNTIME_DIR = "build/runtime";
const KIB = 1024;
const MIB = 1024 * KIB;
const budgets = {
  largestJavaScriptGzip: 150 * KIB,
  totalJavaScriptGzip: 700 * KIB,
  largestCssGzip: 50 * KIB,
  largestImage: 1 * MIB,
  minimumJavaScriptChunks: 12,
  runtimeBundleGzip: 2.5 * MIB,
};
const failures = [];
const warnings = [];
const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const gzipBytes = (file) => gzipSync(readFileSync(file), { level: 9 }).byteLength;
const formatBytes = (value) =>
  value >= MIB
    ? (value / MIB).toFixed(2) + " MiB"
    : (value / KIB).toFixed(1) + " KiB";

for (const directory of [CLIENT_DIR, RUNTIME_DIR]) {
  if (!existsSync(directory)) failures.push("Missing production directory: " + directory);
}
for (const path of [
  "build/client/manifest.webmanifest",
  "build/client/sw.js",
  "build/client/offline.html",
  "build/client/icons/winimi-192.png",
  "build/client/icons/winimi-512.png",
  "build/runtime/server.mjs",
]) {
  if (!existsSync(path)) failures.push("Required production file is missing: " + path);
}

const clientFiles = existsSync(CLIENT_DIR) ? walk(CLIENT_DIR) : [];
const runtimeFiles = existsSync(RUNTIME_DIR) ? walk(RUNTIME_DIR) : [];
const allFiles = [...clientFiles, ...runtimeFiles];
const sourceMaps = allFiles.filter((file) => file.endsWith(".map"));
if (sourceMaps.length) failures.push("Production output contains source maps.");

const javascript = clientFiles
  .filter((file) => [".js", ".mjs"].includes(extname(file)))
  .map((file) => ({
    file: relative(CLIENT_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));
const css = clientFiles
  .filter((file) => extname(file) === ".css")
  .map((file) => ({
    file: relative(CLIENT_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));
const images = clientFiles
  .filter((file) =>
    [".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"].includes(
      extname(file).toLowerCase(),
    ),
  )
  .map((file) => ({ file: relative(CLIENT_DIR, file), bytes: statSync(file).size }));
const runtime = runtimeFiles
  .filter((file) => [".js", ".mjs"].includes(extname(file)))
  .map((file) => ({
    file: relative(RUNTIME_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));

if (javascript.length < budgets.minimumJavaScriptChunks) {
  failures.push(
    "Only " + javascript.length +
      " client JavaScript chunks were generated; route-module splitting is missing.",
  );
}
const largestJavaScript = [...javascript].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const totalJavaScriptGzip = javascript.reduce((total, item) => total + item.gzipBytes, 0);
const largestCss = [...css].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const largestImage = [...images].sort((a, b) => b.bytes - a.bytes)[0];
const runtimeGzip = runtime.reduce((total, item) => total + item.gzipBytes, 0);
if (largestJavaScript?.gzipBytes > budgets.largestJavaScriptGzip) {
  failures.push(
    "Largest client JavaScript chunk exceeds budget: " +
      largestJavaScript.file + " (" + formatBytes(largestJavaScript.gzipBytes) + ")",
  );
}
if (totalJavaScriptGzip > budgets.totalJavaScriptGzip) {
  failures.push("Total client JavaScript exceeds budget: " + formatBytes(totalJavaScriptGzip));
}
if (largestCss?.gzipBytes > budgets.largestCssGzip) {
  failures.push("Largest CSS exceeds budget: " + formatBytes(largestCss.gzipBytes));
}
if (largestImage?.bytes > budgets.largestImage) {
  failures.push("Largest image exceeds budget: " + formatBytes(largestImage.bytes));
}
if (runtimeGzip > budgets.runtimeBundleGzip) {
  failures.push("Bundled SSR runtime exceeds budget: " + formatBytes(runtimeGzip));
}

let serviceWorkerVersion = null;
if (existsSync("build/client/sw.js")) {
  const serviceWorker = readFileSync("build/client/sw.js", "utf8");
  serviceWorkerVersion = serviceWorker.match(/const BUILD_VERSION = "([a-f0-9]{16})";/)?.[1] || null;
  if (!serviceWorkerVersion) failures.push("Service worker fingerprint is missing.");
  if (serviceWorker.includes("__WINIMI_BUILD_VERSION__")) {
    failures.push("Service worker placeholder remains in production output.");
  }
}

let manifestSummary = null;
if (existsSync("build/client/manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(readFileSync("build/client/manifest.webmanifest", "utf8"));
    manifestSummary = {
      id: manifest.id,
      scope: manifest.scope,
      startUrl: manifest.start_url,
      iconCount: Array.isArray(manifest.icons) ? manifest.icons.length : 0,
    };
    if (manifest.id !== "/" || manifest.scope !== "/") {
      failures.push("Manifest must keep root id and scope.");
    }
  } catch (error) {
    failures.push("Manifest JSON is invalid: " + error.message);
  }
}

for (const image of images.filter((item) => item.bytes > 700 * KIB)) {
  warnings.push(item.file + " is " + formatBytes(item.bytes) + ".");
}
const report = {
  generatedAt: new Date().toISOString(),
  mode: "react-router-framework-ssr",
  budgets,
  serviceWorkerVersion,
  manifest: manifestSummary,
  summary: {
    javascriptChunks: javascript.length,
    largestJavaScript: largestJavaScript || null,
    totalJavaScriptGzip,
    largestCss: largestCss || null,
    largestImage: largestImage || null,
    runtimeFiles: runtime.length,
    runtimeGzip,
  },
  warnings,
  failures,
};
writeFileSync("performance-report.json", JSON.stringify(report, null, 2) + "\\n");
console.log("Client JavaScript chunks: " + javascript.length);
console.log("Client JavaScript gzip: " + formatBytes(totalJavaScriptGzip));
console.log("SSR runtime gzip: " + formatBytes(runtimeGzip));
warnings.forEach((warning) => console.warn("Warning: " + warning));
if (failures.length) {
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("SSR, client and PWA performance budgets passed.");
`,
);

write(
  "scripts/audit-frontend.mjs",
  `import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(".");
const SRC_ROOT = resolve("src");
const errors = [];
const warnings = [];
const read = (path) => readFileSync(resolve(path), "utf8");
const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = resolve(directory, entry);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
const sourceFiles = walk(SRC_ROOT).filter((file) => /\\.(ts|tsx)$/.test(file));
const routesSource = read("src/routes.ts");
const routePaths = [
  "/",
  ...Array.from(
    routesSource.matchAll(/route\\(["']([^"']+)["']/g),
    (match) => "/" + match[1].replace(/^\\//, ""),
  ),
];
if (!routePaths.includes("/*") && !routePaths.includes("/*")) {
  if (!routesSource.includes('route("*"')) errors.push("src/routes.ts must include a wildcard 404 route.");
}
const routeRegexes = routePaths
  .filter((route) => route !== "/*")
  .map((route) => {
    const expression = route
      .replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&")
      .replace(/:[a-zA-Z0-9_]+/g, "[^/]+")
      .replace(/\\\\\\*/g, ".*");
    return new RegExp("^" + expression + "/?$");
  });
const isKnownRoute = (pathname) =>
  pathname === "/" || routeRegexes.some((pattern) => pattern.test(pathname));
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  for (const match of source.matchAll(/(?:to|href)=["'](\\/[^"']*)["']/g)) {
    const target = match[1];
    const pathname = target.split(/[?#]/, 1)[0] || "/";
    if (!isKnownRoute(pathname)) {
      errors.push(displayPath + ": internal link does not match a framework route: " + target);
    }
  }
  for (const rule of [
    { pattern: /(?:href|to)=["']#["']/g, message: "empty hash navigation" },
    { pattern: /javascript:/gi, message: "javascript: URL" },
    { pattern: /\\b(?:TODO|FIXME)\\b/g, message: "unfinished TODO/FIXME marker" },
    { pattern: /lorem ipsum/gi, message: "placeholder Lorem Ipsum copy" },
    { pattern: /cooci\\.lovable\\.app/gi, message: "temporary Lovable domain" },
  ]) {
    if (rule.pattern.test(source)) errors.push(displayPath + ": contains " + rule.message + ".");
  }
}
const pageFiles = sourceFiles.filter((file) => /src[\\/]pages[\\/].+Page\\.tsx$/.test(file));
for (const file of pageFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  if (!source.includes("<SEO") && !source.includes("ManagedContentPage")) {
    errors.push(displayPath + ": routed page is missing SEO.");
  }
  if (!/export default\\s+[A-Za-z0-9_]+/.test(source)) {
    errors.push(displayPath + ": page is missing a default export.");
  }
}
for (const required of [
  'index("./pages/HomePage.tsx")',
  'route("categories", "./pages/CategoriesPage.tsx")',
  'route("products/:slug", "./pages/ProductDetailPage.tsx")',
  'route("*", "./routes/not-found.tsx")',
]) {
  if (!routesSource.includes(required)) errors.push("src/routes.ts missing " + required);
}
if (!read("src/root.tsx").includes("<Scripts nonce={nonce}")) {
  errors.push("src/root.tsx must render nonce-protected framework scripts.");
}
if (routePaths.length < 20) warnings.push("Framework route inventory appears unexpectedly small.");
warnings.forEach((warning) => console.warn("- " + warning));
if (errors.length) {
  errors.forEach((error) => console.error("- " + error));
  process.exit(1);
}
console.log(
  "Frontend framework audit passed: " + routePaths.length +
    " routes, " + pageFiles.length + " pages and " + sourceFiles.length + " source files checked.",
);
`,
);

for (const [path, replacements] of Object.entries({
  "scripts/audit-modern-ui.mjs": [
    ["main: \"src/main.tsx\"", "main: \"src/root.tsx\""],
    ['import \"./styles/modern-pages.css\"', 'import \"./styles/modern-pages.css\"'],
  ],
  "scripts/audit-runtime-performance.mjs": [
    ["main: \"src/main.tsx\"", "main: \"src/root.tsx\""],
  ],
})) {
  if (!existsSync(path)) continue;
  let source = read(path);
  for (const [from, to] of replacements) source = source.replace(from, to);
  write(path, source);
}

write(
  "scripts/audit-frontend-phase-1.mjs",
  `import fs from "node:fs";
import path from "node:path";
const files = {
  checkout: "src/lib/checkout.ts",
  checkoutPage: "src/pages/CheckoutPage.tsx",
  guard: "src/components/cart/CheckoutGuard.tsx",
  catalogHook: "src/hooks/useCatalog.ts",
  developmentCatalog: "src/lib/development-catalog.ts",
  nginx: "deploy/nginx/winimi-frontend.conf.example",
  securityHeaders: "deploy/nginx/winimi-security-headers.conf",
  deployReadme: "deploy/README.md",
  routes: "src/routes.ts",
  paymentMock: "src/routes/payment-mock.tsx",
};
const errors = [];
const sources = {};
for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) errors.push("Missing Phase 1 file: " + filePath);
  else sources[name] = fs.readFileSync(filePath, "utf8");
}
const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(files[file] + ": missing " + label);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(files[file] + ": contains forbidden " + label);
};
requireText("checkout", "paymentStarted?: boolean", "explicit payment-start state");
forbidText(
  "checkoutPage",
  'idempotencyKeyRef.current = createIdempotencyKey("CHK")',
  "automatic checkout-key rotation after an ambiguous failure",
);
forbidText("catalogHook", "products as staticProducts", "eager static product import");
forbidText("guard", 'from "@/data/products"', "eager development catalog import");
requireText("developmentCatalog", "if (!import.meta.env.DEV) return emptyCatalog");
requireText("guard", "missingMockSlugs", "stale mock cart detection");
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
const pattern = /^\\s*import\\s+([^;]+?)\\s+from\\s+["']@\\/data\\/products["'];/gm;
for (const sourcePath of walk("src").filter((filePath) => /\\.[cm]?[jt]sx?$/.test(filePath))) {
  const source = fs.readFileSync(sourcePath, "utf8");
  for (const match of source.matchAll(pattern)) {
    if (!match[1].trim().startsWith("type ")) errors.push(sourcePath + ": eagerly imports development catalog values");
  }
}
requireText("nginx", "proxy_pass http://winimi_ssr", "SSR reverse proxy");
requireText("nginx", 'Cache-Control "public, max-age=31536000, immutable"', "immutable assets");
requireText("securityHeaders", "Strict-Transport-Security", "static asset HSTS");
requireText("routes", 'route("payment/mock", "./routes/payment-mock.tsx")');
requireText("paymentMock", 'process.env.NODE_ENV === "production"', "production mock denial");
if (errors.length) {
  errors.forEach((error) => console.error("- " + error));
  process.exit(1);
}
fs.writeFileSync(
  "frontend-phase1-audit.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), passed: true, errors: [] }, null, 2) + "\\n",
);
console.log("Frontend Phase 1 audit passed under the SSR production boundary.");
`,
);

console.log("Phase 10.1 build, PWA and core audit migration written.");
