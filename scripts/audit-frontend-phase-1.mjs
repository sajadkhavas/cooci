import fs from "node:fs";

const files = {
  checkout: "src/lib/checkout.ts",
  checkoutPage: "src/pages/CheckoutPage.tsx",
  guard: "src/components/cart/CheckoutGuard.tsx",
  catalogHook: "src/hooks/useCatalog.ts",
  developmentCatalog: "src/lib/development-catalog.ts",
  nginx: "deploy/nginx/winimi-frontend.conf.example",
  deployReadme: "deploy/README.md",
  app: "src/App.tsx",
};

const errors = [];
const sources = {};

for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 1 file: ${path}`);
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

requireText(
  "checkout",
  "paymentStarted?: boolean",
  "explicit payment-start state",
);
requireText(
  "checkout",
  "success: true,\n      order,\n      paymentAvailable: true,\n      paymentStarted: false",
  "successful-order/payment-initiation-failure result",
);
requireText(
  "checkout",
  "برای جلوگیری از سفارش تکراری",
  "ambiguous checkout retry guidance",
);
forbidText(
  "checkoutPage",
  'idempotencyKeyRef.current = createIdempotencyKey("CHK")',
  "automatic checkout-key rotation after an ambiguous failure",
);

forbidText(
  "catalogHook",
  'products as staticProducts',
  "eager static product import",
);
forbidText(
  "catalogHook",
  'categories as staticCategories',
  "eager static category import",
);
forbidText(
  "guard",
  'from "@/data/products"',
  "eager development catalog import",
);
requireText(
  "developmentCatalog",
  'if (!import.meta.env.DEV) return emptyCatalog',
  "production development-catalog guard",
);
requireText(
  "developmentCatalog",
  'await import("@/data/products")',
  "dynamic development catalog import",
);
requireText(
  "guard",
  "missingMockSlugs",
  "stale mock cart detection",
);
requireText(
  "guard",
  "حذف آیتم‌های نامعتبر",
  "stale mock cart recovery action",
);

requireText(
  "nginx",
  "try_files $uri $uri/ /index.html;",
  "SPA fallback",
);
requireText(
  "nginx",
  'Cache-Control "public, max-age=31536000, immutable"',
  "immutable hashed-asset caching",
);
requireText(
  "nginx",
  'Cache-Control "no-cache, no-store, must-revalidate"',
  "service-worker no-cache policy",
);
requireText(
  "nginx",
  "Content-Security-Policy-Report-Only",
  "report-only CSP rollout",
);
requireText(
  "nginx",
  "Strict-Transport-Security",
  "reviewed HSTS template",
);
requireText(
  "deployReadme",
  "A self-hosted Nginx server does not read it",
  "public/_headers deployment boundary",
);
requireText(
  "app",
  "areDevelopmentMocksEnabled && <Route path=\"/payment/mock\"",
  "development-only mock payment route",
);

if (errors.length) {
  console.error(`Frontend Phase 1 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 1 audit passed: checkout/payment failure separation, duplicate-order safety, lazy development catalog, stale-cart recovery and Nginx production boundary are locked.",
);
