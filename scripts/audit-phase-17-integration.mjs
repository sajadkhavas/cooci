import fs from "node:fs";

const failures = [];
const read = (path) => {
  if (!fs.existsSync(path)) {
    failures.push(`Missing Phase 17 file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
};
const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(`Missing ${label}: ${needle}`);
};
const forbidText = (source, needle, label) => {
  if (source.includes(needle)) failures.push(`Forbidden ${label}: ${needle}`);
};

const roadmap = read("docs/FULL_LAUNCH_ROADMAP.md");
const api = read("src/lib/api.ts");
const catalog = read("src/hooks/useCatalog.ts");
const auth = read("src/lib/auth.ts");
const orders = read("src/lib/orders.ts");
const checkout = read("src/lib/checkout.ts");
const account = read("src/lib/account.ts");
const content = read("src/lib/content.ts");
const checkoutGuard = read("src/components/cart/CheckoutGuard.tsx");
const checkoutPage = read("src/pages/CheckoutPage.tsx");
const callback = read("src/pages/PaymentCallbackPage.tsx");
const inquiry = read("src/components/forms/InquiryForm.tsx");
const managedContent = read("src/components/content/ManagedContentPage.tsx");
const trust = read("src/components/trust/EnamadTrustSlot.tsx");
const app = read("src/App.tsx");

requireText(roadmap, "frontend_integrated=ready", "Phase 17 readiness marker");
requireText(roadmap, "2026-07-20-phase-16", "frozen backend contract reference");

for (const contractNeedle of [
  'EXPECTED_API_CONTRACT_VERSION = "2026-07-20-phase-16"',
  'credentials: "include"',
  "/sanctum/csrf-cookie",
  'headers.set("X-XSRF-TOKEN"',
  "parseEnvelope",
  'headers.set("X-Request-ID"',
]) requireText(api, contractNeedle, "shared API contract");

requireText(catalog, "fetchCatalogProducts", "backend catalog list");
requireText(catalog, "fetchCatalogProduct", "backend product detail");
requireText(catalog, "fetchCatalogCategories", "backend categories");
requireText(catalog, "areDevelopmentMocksEnabled", "development-only catalog fallback");
requireText(auth, 'apiData<{ user: BackendUser }>', "enveloped session auth");
requireText(auth, "debugCode", "backend OTP debug mapping");
requireText(orders, "winimi_dev_orders_v3", "development-only order key");
requireText(orders, "assertMockStorage", "production order-storage guard");
forbidText(orders, "winimi_orders_v2", "production-shaped browser orders");

for (const endpoint of [
  "/api/delivery/options",
  'apiRequest<BackendCheckoutResult>("/api/checkout"',
  "/payments",
  "/api/payments/zarinpal/verify",
]) requireText(checkout, endpoint, "checkout/payment endpoint");
requireText(checkoutGuard, "fetchCatalogProduct", "per-product cart reconciliation");
requireText(checkoutGuard, "account/login", "authenticated checkout guard");
requireText(checkoutPage, "deliveryOptions", "server delivery quote UI");
requireText(checkoutPage, "selectedAddressId", "saved address checkout");
requireText(callback, 'result.state === "success"', "verified-only cart clearing");
requireText(callback, "authority", "provider callback verification");

for (const endpoint of [
  "/api/account/addresses",
  "/cancel",
  "/reviews",
]) requireText(account, endpoint, "account operation");
for (const endpoint of [
  "/api/store/settings",
  "/api/store/pages/",
  "/api/store/faqs",
  "/api/store/gallery",
  "/api/store/posts",
  "/api/store/cities/",
  "/api/inquiries",
]) requireText(content, endpoint, "store content endpoint");
requireText(inquiry, "submitInquiry", "persisted public inquiries");
requireText(managedContent, "loadContentPage", "managed legal/trust pages");
requireText(trust, "trustseal.enamad.ir", "official eNAMAD host restriction");
forbidText(trust, "dangerouslySetInnerHTML", "raw trust HTML execution");
requireText(app, "areDevelopmentMocksEnabled &&", "development-only mock payment route");

for (const source of [api, auth, checkout, content]) {
  for (const forbidden of ["ZARINPAL_MERCHANT_ID", "KAVENEGAR_API_KEY", "ENAMAD_BADGE_CODE"]) {
    forbidText(source, forbidden, "frontend secret");
  }
}

if (failures.length) {
  console.error(`Phase 17 integration audit failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 17 integration audit passed: readiness marker, backend API, session, catalog, checkout, payment, account, content, forms and production mock boundaries are connected.");
