import fs from "node:fs";

const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_4.md",
  transactionIntent: "src/lib/transaction-intent.ts",
  paymentSecurity: "src/lib/payment-security.ts",
  orderContract: "src/lib/order-contract-schema.ts",
  orderSchema: "src/lib/order-schema.ts",
  orders: "src/lib/orders.ts",
  account: "src/lib/account.ts",
  checkout: "src/lib/checkout.ts",
  httpQuery: "src/lib/http-query.ts",
  callback: "src/pages/PaymentCallbackPage.tsx",
  unit: "tests/unit/checkout-payment.test.ts",
  queryUnit: "tests/unit/http-query.test.ts",
  package: "package.json",
};

const errors = [];
const sources = {};

for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 4 file: ${path}`);
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

requireText("threatModel", "Gateway callback query parameters are untrusted hints", "callback trust boundary");
requireText("threatModel", "payload-bound checkout intent", "persistent Idempotency gate");

requireText("transactionIntent", "winimi_${kind}_intent_v1", "versioned transaction intent storage");
requireText("transactionIntent", "INTENT_TTL_MS = 30 * 60 * 1000", "transaction intent expiry");
requireText("transactionIntent", "buildCheckoutFingerprint", "payload-bound checkout fingerprint");
requireText("transactionIntent", "normalizedItems", "canonical item normalization");
requireText("transactionIntent", "existing?.fingerprint === fingerprint", "same-payload Idempotency reuse");
requireText("transactionIntent", "createTransactionIdempotencyKey", "independent key generator");
requireText("transactionIntent", "fingerprint: fingerprint.slice(0, 128)", "only bounded fingerprint persisted");
forbidText("transactionIntent", "source,\n    idempotencyKey", "raw fingerprint source persistence");

requireText("paymentSecurity", "ZARINPAL_HOSTS", "explicit payment host allowlist");
requireText("paymentSecurity", 'parsed.pathname === "/payment/callback"', "same-origin callback allowlist");
requireText("paymentSecurity", 'parsed.pathname === "/payment/mock"', "development mock route boundary");
requireText("paymentSecurity", 'parsed.pathname.toLowerCase().startsWith("/pg/startpay/")', "gateway path allowlist");
requireText("paymentSecurity", "isVerifiedBackendPayment", "verified payment predicate");
requireText("paymentSecurity", "payment.amountToman === order.totals.grandTotalToman", "payment amount consistency");

requireText("orderContract", "gatewayCode: z.union", "string or numeric gateway code");
requireText("orderContract", "line total does not match unit price and quantity", "line-total invariant");
requireText("orderContract", "grand total is inconsistent", "grand-total invariant");
requireText("orderContract", "cancellation boundary is inconsistent", "server cancellation boundary");
requireText("orderContract", "paid order lacks a matching verified payment", "paid-order verification invariant");
requireText("orderContract", "verified response is internally inconsistent", "verification response invariant");
requireText("orderSchema", 'code: "invalid_order_contract"', "runtime order contract error");
requireText("orderSchema", "parseBackendPaymentVerificationResult", "runtime verification parser");

requireText("orders", ".sort(comparePaymentAttempts)", "deterministic payment attempt sorting");
requireText("orders", "paymentAttempts.at(-1)", "latest attempt selection");
requireText("orders", "MAX_MOCK_STORAGE_LENGTH", "bounded development order storage");
requireText("orders", "cancelOwnedMockOrder", "development cancellation ownership boundary");
forbidText("orders", "paymentAttempts[paymentAttempts.length - 1]", "array-order latest attempt assumption");

requireText("account", "parseBackendOrders", "runtime account-order parsing");
requireText("account", "parseBackendOrder", "runtime owned-order parsing");
requireText("account", "cancelOwnedMockOrder", "mock cancellation ownership validation");

requireText("checkout", "getOrCreateTransactionIntent", "persistent transaction intent usage");
requireText("checkout", "buildCheckoutFingerprint", "checkout payload fingerprint usage");
requireText("checkout", "parseBackendCheckoutResult", "runtime checkout response parsing");
requireText("checkout", "parseBackendPaymentInitiationResult", "runtime payment initiation parsing");
requireText("checkout", "parseBackendPaymentVerificationResult", "runtime payment verification parsing");
requireText("checkout", "resolveSafePaymentRedirect", "safe payment redirect resolution");
requireText("checkout", "validateCheckoutItems", "checkout item validation");
requireText("checkout", "clearTransactionIntent(\"checkout\")", "checkout intent cleared after definitive order");
requireText("checkout", "deriveBackendPaymentState", "server-driven payment state");
requireText("checkout", "encodeBooleanQuery(requiresCooling)", "Laravel-compatible delivery boolean query");
forbidText("checkout", "requiresCooling: String(requiresCooling)", "invalid textual boolean query serialization");
forbidText("checkout", 'state: response.data.verified', "TypeScript-only payment success mapping");
forbidText("checkout", 'status?.toUpperCase() === "NOK"', "callback status as backend payment truth");

requireText("httpQuery", 'value ? "1" : "0"', "boolean query encoder");
requireText("queryUnit", 'assert.equal(encodeBooleanQuery(true), "1")', "true query serialization test");
requireText("queryUnit", 'assert.equal(encodeBooleanQuery(false), "0")', "false query serialization test");

requireText("callback", 'result.order?.paymentStatus === "paid"', "paid-order cart clearing gate");
requireText("callback", "Boolean(result.refId)", "verified reference cart clearing gate");
requireText("callback", "if (isConsistentSuccess)", "consistent success-only cart clearing");
forbidText("callback", 'if (result.state === "success") {\n      clearCart()', "state-only cart clearing");
requireText("callback", 'paymentMode === "mock" ? providedOrderId : ""', "untrusted backend order query isolation");

requireText("unit", "checkout intent survives reload for the same payload", "Idempotency reload unit test");
requireText("unit", "changed checkout payload receives a different Idempotency key", "payload-change unit test");
requireText("unit", "payment redirects reject executable", "redirect attack unit test");
requireText("unit", "verified payment requires paid order", "verified payment consistency unit test");
requireText("unit", "callback status alone cannot produce payment success", "callback hint unit test");
requireText("package", '"audit:phase4"', "Phase 4 audit command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase4-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 4 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 4 audit passed: payload-bound Idempotency, Laravel-compatible delivery queries, runtime order/payment contracts, safe gateway redirects, deterministic attempts and verified-only cart clearing are locked.",
);
