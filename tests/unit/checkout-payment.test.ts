import assert from "node:assert/strict";
import test from "node:test";
import {
  backendOrderSchema,
  backendPaymentVerificationResultSchema,
} from "../../src/lib/order-contract-schema.ts";
import {
  deriveBackendPaymentState,
  isVerifiedBackendPayment,
  resolveSafePaymentRedirect,
} from "../../src/lib/payment-security.ts";
import {
  TRANSACTION_INTENT_TTL_MS,
  buildCheckoutFingerprint,
  getOrCreateTransactionIntent,
} from "../../src/lib/transaction-intent.ts";

class MemoryStorage {
  #values = new Map<string, string>();

  getItem(key: string) {
    return this.#values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.#values.set(key, value);
  }

  removeItem(key: string) {
    this.#values.delete(key);
  }
}

const checkoutFingerprintInput = {
  customer: {
    fullName: "Test Customer",
    mobile: "09000000000",
    province: "Tehran",
    city: "Tehran",
    address: "Test address number 10",
    postalCode: "1234567890",
    notes: "",
  },
  deliveryMethod: "standard",
  items: [
    { quantity: 2, selectedVariant: { id: "variant-b" } },
    { quantity: 1, selectedVariant: { id: "variant-a" } },
  ],
};

const orderFixture = {
  id: "order-01",
  number: "WNM-001",
  status: "awaiting_payment",
  statusLabel: "Awaiting payment",
  paymentStatus: "unpaid",
  paymentStatusLabel: "Unpaid",
  delivery: {
    method: "standard",
    methodLabel: "Standard",
    requiresCooling: false,
    feeToman: 0,
    zone: null,
  },
  totals: {
    subtotalToman: 120_000,
    deliveryFeeToman: 0,
    packagingFeeToman: 0,
    discountToman: 0,
    grandTotalToman: 120_000,
  },
  itemCount: 2,
  preparationTimeDays: 1,
  preparation: { minDays: 1, maxDays: 2 },
  recipient: {
    fullName: "Test Customer",
    mobile: "09000000000",
    province: "Tehran",
    city: "Tehran",
    address: "Test address number 10",
    postalCode: "1234567890",
    notes: null,
  },
  fulfillment: {
    trackingCode: null,
    confirmedAt: null,
    preparingAt: null,
    readyAt: null,
    dispatchedAt: null,
    deliveredAt: null,
  },
  items: [
    {
      id: "item-01",
      productId: "product-01",
      variantId: "variant-01",
      productName: "Test Cookie",
      variantName: "Pack",
      productCode: "COOKIE-01",
      sku: "COOKIE-01-PACK",
      weightGrams: 300,
      requiresCooling: false,
      unitPriceToman: 60_000,
      quantity: 2,
      lineTotalToman: 120_000,
    },
  ],
  payments: [
    {
      id: "payment-01",
      provider: "testing",
      attemptNumber: 1,
      status: "pending",
      statusLabel: "Pending",
      amountToman: 120_000,
      currency: "IRT",
      authority: "TEST-AUTHORITY",
      referenceId: null,
      gatewayCode: "TEST-100",
      redirectUrl: "https://winimibakery.com/payment/callback?Status=OK",
      failure: null,
      expiresAt: "2026-07-20T10:20:00+00:00",
      verifiedAt: null,
      createdAt: "2026-07-20T10:00:00+00:00",
    },
  ],
  timeline: [
    {
      from: null,
      to: "awaiting_payment",
      label: "Awaiting payment",
      createdAt: "2026-07-20T10:00:00+00:00",
    },
  ],
  reservationExpiresAt: "2026-07-20T10:20:00+00:00",
  canCancel: true,
  placedAt: "2026-07-20T10:00:00+00:00",
  paidAt: null,
  cancelledAt: null,
  createdAt: "2026-07-20T10:00:00+00:00",
};

test("checkout intent survives reload for the same payload", () => {
  const storage = new MemoryStorage();
  const fingerprint = buildCheckoutFingerprint(checkoutFingerprintInput);
  const first = getOrCreateTransactionIntent("checkout", fingerprint, {
    storage,
    now: 1_000,
    keyFactory: () => "CHK-same-payload-000001",
  });
  const second = getOrCreateTransactionIntent("checkout", fingerprint, {
    storage,
    now: 2_000,
    keyFactory: () => "CHK-must-not-be-used-02",
  });
  assert.equal(first, second);
});

test("changed checkout payload receives a different Idempotency key", () => {
  const storage = new MemoryStorage();
  const firstFingerprint = buildCheckoutFingerprint(checkoutFingerprintInput);
  const secondFingerprint = buildCheckoutFingerprint({
    ...checkoutFingerprintInput,
    items: [{ quantity: 3, selectedVariant: { id: "variant-a" } }],
  });
  const first = getOrCreateTransactionIntent("checkout", firstFingerprint, {
    storage,
    now: 1_000,
    keyFactory: () => "CHK-first-payload-000001",
  });
  const second = getOrCreateTransactionIntent("checkout", secondFingerprint, {
    storage,
    now: 2_000,
    keyFactory: () => "CHK-second-payload-00002",
  });
  assert.notEqual(first, second);
});

test("expired transaction intent cannot be replayed", () => {
  const storage = new MemoryStorage();
  const fingerprint = buildCheckoutFingerprint(checkoutFingerprintInput);
  const first = getOrCreateTransactionIntent("checkout", fingerprint, {
    storage,
    now: 1_000,
    keyFactory: () => "CHK-expiring-payload-0001",
  });
  const second = getOrCreateTransactionIntent("checkout", fingerprint, {
    storage,
    now: 1_000 + TRANSACTION_INTENT_TTL_MS + 1,
    keyFactory: () => "CHK-renewed-payload-00002",
  });
  assert.notEqual(first, second);
});

test("checkout fingerprint is stable across cart item ordering", () => {
  const first = buildCheckoutFingerprint(checkoutFingerprintInput);
  const second = buildCheckoutFingerprint({
    ...checkoutFingerprintInput,
    items: [...checkoutFingerprintInput.items].reverse(),
  });
  assert.equal(first, second);
});

test("payment redirects reject executable, credentialed and unapproved URLs", () => {
  const options = { frontendOrigin: "https://winimibakery.com" };
  assert.equal(resolveSafePaymentRedirect("javascript:alert(1)", options), null);
  assert.equal(
    resolveSafePaymentRedirect("https://user:pass@payment.zarinpal.com/pg/StartPay/A", options),
    null,
  );
  assert.equal(
    resolveSafePaymentRedirect("https://payment.zarinpal.com.evil.example/pg/StartPay/A", options),
    null,
  );
  assert.equal(
    resolveSafePaymentRedirect("https://evil.example/pg/StartPay/A", options),
    null,
  );
  assert.equal(
    resolveSafePaymentRedirect("https://winimibakery.com/account", options),
    null,
  );
});

test("payment redirects allow only the approved gateway and callback routes", () => {
  const options = { frontendOrigin: "https://winimibakery.com" };
  assert.equal(
    resolveSafePaymentRedirect(
      "https://payment.zarinpal.com/pg/StartPay/A000000000000000000000000000000001",
      options,
    ),
    "https://payment.zarinpal.com/pg/StartPay/A000000000000000000000000000000001",
  );
  assert.equal(
    resolveSafePaymentRedirect(
      "/payment/callback?Status=OK&Authority=TEST",
      options,
    ),
    "https://winimibakery.com/payment/callback?Status=OK&Authority=TEST",
  );
  assert.equal(
    resolveSafePaymentRedirect("/payment/mock?token=x", options),
    null,
  );
  assert.equal(
    resolveSafePaymentRedirect("/payment/mock?token=x", {
      ...options,
      allowDevelopmentRoutes: true,
    }),
    "https://winimibakery.com/payment/mock?token=x",
  );
});

test("runtime order contract accepts gateway string codes", () => {
  assert.equal(backendOrderSchema.safeParse(orderFixture).success, true);
});

test("runtime order contract rejects client-visible total and cancellation contradictions", () => {
  const wrongTotal = structuredClone(orderFixture);
  wrongTotal.totals.grandTotalToman = 1;
  assert.equal(backendOrderSchema.safeParse(wrongTotal).success, false);

  const wrongCancellation = structuredClone(orderFixture);
  wrongCancellation.status = "preparing";
  wrongCancellation.canCancel = true;
  assert.equal(backendOrderSchema.safeParse(wrongCancellation).success, false);
});

test("verified payment requires paid order, verified attempt, reference and exact amount", () => {
  const verifiedOrder = structuredClone(orderFixture);
  verifiedOrder.status = "paid";
  verifiedOrder.statusLabel = "Paid";
  verifiedOrder.paymentStatus = "paid";
  verifiedOrder.paymentStatusLabel = "Paid";
  verifiedOrder.canCancel = false;
  verifiedOrder.paidAt = "2026-07-20T10:05:00+00:00";
  verifiedOrder.payments[0].status = "verified";
  verifiedOrder.payments[0].statusLabel = "Verified";
  verifiedOrder.payments[0].referenceId = "TESTREF-001";
  verifiedOrder.payments[0].verifiedAt = "2026-07-20T10:05:00+00:00";

  const result = backendPaymentVerificationResultSchema.parse({
    verified: true,
    order: verifiedOrder,
    payment: verifiedOrder.payments[0],
  });
  assert.equal(isVerifiedBackendPayment(result), true);
  assert.equal(deriveBackendPaymentState(result), "success");

  const inconsistent = structuredClone(result);
  inconsistent.payment.amountToman = 119_999;
  assert.equal(
    backendPaymentVerificationResultSchema.safeParse(inconsistent).success,
    false,
  );
});

test("callback status alone cannot produce payment success", () => {
  const result = {
    verified: false,
    order: orderFixture,
    payment: orderFixture.payments[0],
  };
  assert.equal(isVerifiedBackendPayment(result), false);
  assert.equal(deriveBackendPaymentState(result), "unknown");
});
