import fs from "node:fs";

const failures = [];

const read = (path) => {
  if (!fs.existsSync(path)) {
    failures.push(`Missing required launch file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
};

const roadmap = read("docs/FULL_LAUNCH_ROADMAP.md");
const readme = read("README.md");
const env = read(".env.example");
const catalogHook = read("src/hooks/useCatalog.ts");
const auth = read("src/lib/auth.ts");
const orders = read("src/lib/orders.ts");
const checkout = read("src/lib/checkout.ts");

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(`Missing ${label}: ${needle}`);
};

for (const phase of [
  "Phase 14 — Provider-ready payment backend",
  "Phase 15 — Complete store operations backend",
  "Phase 16 — Backend completion and contract freeze",
  "Phase 17 — Full frontend/backend integration",
  "Phase 18 — End-to-end completion",
  "Phase 19 — Production server deployment",
  "Phase 20 — External activation only",
]) {
  requireText(roadmap, phase, "locked roadmap phase");
}

for (const externalInput of [
  "payment gateway credentials / Zarinpal Merchant ID",
  "eNAMAD badge code",
  "SMS provider API key and approved OTP template",
]) {
  requireText(roadmap, externalInput, "external-only input");
}

requireText(roadmap, "src/hooks/useCatalog.ts", "catalog integration gap");
requireText(roadmap, "standard `{ success, data, meta }` envelope", "API envelope integration gap");
requireText(roadmap, "/sanctum/csrf-cookie", "Sanctum CSRF integration gap");
requireText(roadmap, "localStorage", "browser-order integration gap");
requireText(readme, "Winimi Bakery Storefront", "real project README identity");
requireText(readme, "docs/FULL_LAUNCH_ROADMAP.md", "roadmap README link");
requireText(env, "VITE_USE_BACKEND=false", "safe backend default");
requireText(env, "VITE_AUTH_MODE=disabled", "safe auth default");
requireText(env, "VITE_PAYMENT_MODE=disabled", "safe payment default");

if (readme.includes("REPLACE_WITH_PROJECT_ID") || readme.includes("Welcome to your Lovable project")) {
  failures.push("README still contains generated Lovable placeholder content");
}

for (const forbiddenSecret of ["VITE_ZARINPAL", "VITE_KAVENEGAR", "VITE_ENAMAD_BADGE_CODE"]) {
  if (env.includes(forbiddenSecret)) failures.push(`Frontend env contains forbidden secret: ${forbiddenSecret}`);
}

requireText(catalogHook, "products: staticProducts", "documented static catalog boundary before Phase 17");
requireText(auth, "credentials: \"include\"", "credentialed auth requests");
requireText(orders, "winimi_orders_v2", "documented local order boundary before Phase 17");
requireText(checkout, "VITE_USE_BACKEND", "backend checkout switch");

if (failures.length > 0) {
  console.error(`Full-launch roadmap audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Full-launch roadmap audit passed: backend-first completion, full integration, deployment and exactly three external activations are locked.",
);
