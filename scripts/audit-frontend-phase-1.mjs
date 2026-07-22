import fs from "node:fs";
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
const pattern = /^\s*import\s+([^;]+?)\s+from\s+["']@\/data\/products["'];/gm;
for (const sourcePath of walk("src").filter((filePath) => /\.[cm]?[jt]sx?$/.test(filePath))) {
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
  JSON.stringify({ generatedAt: new Date().toISOString(), passed: true, errors: [] }, null, 2) + "\n",
);
console.log("Frontend Phase 1 audit passed under the SSR production boundary.");
