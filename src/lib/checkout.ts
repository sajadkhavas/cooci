import type { CartItem } from "@/lib/cart";
import {
  apiRequest,
  areDevelopmentMocksEnabled,
  createIdempotencyKey,
  getFrontendDataMode,
} from "@/lib/api";
import type {
  BackendDeliveryOptions,
} from "@/lib/backend-contract";
import {
  addPaymentAttempt,
  canRetryLocalOrderPayment,
  generateOrderId,
  generatePaymentAttemptId,
  getOrderById,
  getPaymentAttempt,
  mapBackendOrder,
  saveOrder,
  updateOrder,
  updatePaymentAttempt,
  type DeliveryMethod,
  type LocalOrder,
  type OrderCustomer,
  type PaymentAttempt,
} from "@/lib/orders";
import {
  parseBackendCheckoutResult,
  parseBackendDeliveryOptions,
  parseBackendPaymentInitiationResult,
  parseBackendPaymentVerificationResult,
} from "@/lib/order-schema";
import {
  deriveBackendPaymentState,
  isVerifiedBackendPayment,
  resolveSafePaymentRedirect,
} from "@/lib/payment-security";
import {
  buildCheckoutFingerprint,
  buildPaymentFingerprint,
  clearTransactionIntent,
  getOrCreateTransactionIntent,
} from "@/lib/transaction-intent";

const CONFIGURED_PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || "disabled";
const CHECKOUT_DRAFT_KEY = "winimi_checkout_draft_v1";
const MAX_CHECKOUT_DRAFT_LENGTH = 20_000;
const CHECKOUT_DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type PaymentMode = "backend" | "mock" | "disabled";
export type PaymentResultState = "success" | "failed" | "cancelled" | "unknown";
export interface CheckoutCustomerInput extends OrderCustomer {}
export interface CheckoutDraft {
  customer: Partial<CheckoutCustomerInput>;
  deliveryMethod: DeliveryMethod;
  addressId?: string;
  savedAt: string;
}
export interface CheckoutRequest {
  addressId?: string;
  customer?: CheckoutCustomerInput;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  idempotencyKey?: string;
}
export interface CheckoutSessionResult {
  success: boolean;
  order?: LocalOrder;
  paymentUrl?: string;
  attemptId?: string;
  paymentAvailable?: boolean;
  paymentStarted?: boolean;
  error?: string;
}
export interface PaymentVerificationResult {
  state: PaymentResultState;
  order?: LocalOrder;
  refId?: string;
  verifiedByServer?: boolean;
  error?: string;
}

const randomToken = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replaceAll("-", "")
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const getFrontendOrigin = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return import.meta.env.VITE_SITE_ORIGIN || "https://winimibakery.com";
};

const cleanText = (value: unknown, maximum: number) =>
  typeof value === "string" ? value.trim().slice(0, maximum) : "";

const sanitizeCheckoutDraft = (value: unknown): CheckoutDraft | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<CheckoutDraft>;
  if (
    !["standard", "chilled", "pickup"].includes(
      candidate.deliveryMethod || "",
    )
  ) {
    return null;
  }
  const savedAt = Date.parse(candidate.savedAt || "");
  if (
    !Number.isFinite(savedAt) ||
    savedAt > Date.now() + 60_000 ||
    Date.now() - savedAt > CHECKOUT_DRAFT_MAX_AGE_MS
  ) {
    return null;
  }
  const customer = candidate.customer || {};
  return {
    deliveryMethod: candidate.deliveryMethod as DeliveryMethod,
    addressId: cleanText(candidate.addressId, 180) || undefined,
    customer: {
      fullName: cleanText(customer.fullName, 160) || undefined,
      mobile: cleanText(customer.mobile, 32) || undefined,
      province: cleanText(customer.province, 160) || undefined,
      city: cleanText(customer.city, 160) || undefined,
      address: cleanText(customer.address, 2_000) || undefined,
      postalCode: cleanText(customer.postalCode, 32) || undefined,
      notes: cleanText(customer.notes, 2_000) || undefined,
    },
    savedAt: new Date(savedAt).toISOString(),
  };
};

export { createIdempotencyKey };

export const getPaymentMode = (): PaymentMode => {
  if (getFrontendDataMode() === "backend") return "backend";
  if (areDevelopmentMocksEnabled && CONFIGURED_PAYMENT_MODE === "mock") {
    return "mock";
  }
  return "disabled";
};

export const isBackendCheckoutEnabled = () => getPaymentMode() === "backend";
export const isMockCheckoutEnabled = () => getPaymentMode() === "mock";

export const normalizeEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

export const isChilledDeliveryCity = (city: string) =>
  ["تهران", "کرج", "اندیشه"].some((candidate) =>
    city.trim().replace(/ي/g, "ی").replace(/ك/g, "ک").includes(candidate),
  );

export const getDeliveryFee = () => 0;

export const validateDeliveryMethod = ({
  method,
  hasCoolingItems,
}: {
  method: DeliveryMethod;
  city?: string;
  hasCoolingItems: boolean;
}): string | null =>
  hasCoolingItems && method === "standard"
    ? "این سبد به ارسال سرد یا تحویل حضوری نیاز دارد."
    : null;

export const loadCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw || raw.length > MAX_CHECKOUT_DRAFT_LENGTH) return null;
    return sanitizeCheckoutDraft(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveCheckoutDraft = (
  draft: Omit<CheckoutDraft, "savedAt">,
) => {
  if (typeof window === "undefined") return;
  try {
    const sanitized = sanitizeCheckoutDraft({
      ...draft,
      savedAt: new Date().toISOString(),
    });
    if (!sanitized) return;
    window.localStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify(sanitized),
    );
  } catch {
    // This draft is a non-authoritative convenience copy.
  }
};

export const clearCheckoutDraft = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  } catch {
    // Optional browser storage can be unavailable.
  }
};

export const loadDeliveryOptions = async ({
  province,
  city,
  subtotalToman,
  requiresCooling,
}: {
  province?: string;
  city?: string;
  subtotalToman: number;
  requiresCooling: boolean;
}): Promise<BackendDeliveryOptions> => {
  const params = new URLSearchParams({
    subtotalToman: String(Math.max(0, Math.round(subtotalToman))),
    requiresCooling: String(requiresCooling),
  });
  if (province?.trim()) params.set("province", province.trim().slice(0, 160));
  if (city?.trim()) params.set("city", city.trim().slice(0, 160));
  const response = await apiRequest<unknown>(
    `/api/delivery/options?${params.toString()}`,
  );
  return parseBackendDeliveryOptions(response.data);
};

const initiateBackendPayment = async (
  orderId: string,
): Promise<CheckoutSessionResult> => {
  const fingerprint = buildPaymentFingerprint(orderId);
  const idempotencyKey = getOrCreateTransactionIntent("payment", fingerprint);
  const response = await apiRequest<unknown>(
    `/api/orders/${encodeURIComponent(orderId)}/payments`,
    {
      method: "POST",
      idempotencyKey,
      body: {},
    },
  );
  const data = parseBackendPaymentInitiationResult(response.data);
  const order = mapBackendOrder(data.order);
  const rawRedirect = data.payment.redirectUrl;
  const paymentUrl = resolveSafePaymentRedirect(rawRedirect, {
    frontendOrigin: getFrontendOrigin(),
    allowDevelopmentRoutes: import.meta.env.DEV,
  });

  clearTransactionIntent("payment");

  return {
    success: true,
    order,
    paymentAvailable: true,
    paymentStarted: Boolean(paymentUrl),
    attemptId: data.payment.id,
    paymentUrl: paymentUrl || undefined,
    error:
      rawRedirect && !paymentUrl
        ? "آدرس انتقال درگاه با سیاست امنیتی وینیمی سازگار نیست."
        : paymentUrl
          ? undefined
          : "درگاه آدرس انتقال معتبر برنگرداند.",
  };
};

const validateCheckoutItems = (items: CartItem[]) => {
  if (!items.length || items.length > 100) {
    throw new Error("سبد خرید برای ثبت سفارش معتبر نیست.");
  }
  const variantIds = new Set<string>();
  for (const item of items) {
    const variantId = item.selectedVariant?.id?.trim();
    if (!variantId) {
      throw new Error(`Variant قابل سفارش برای «${item.name}» مشخص نیست.`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1_000) {
      throw new Error(`تعداد «${item.name}» معتبر نیست.`);
    }
    if (variantIds.has(variantId)) {
      throw new Error("یک Variant بیش از یک بار در سبد ثبت شده است.");
    }
    variantIds.add(variantId);
  }
};

const createBackendCheckout = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  validateCheckoutItems(request.items);
  const addressPayload = request.addressId
    ? {
        addressId: request.addressId,
        ...(request.customer?.notes
          ? { customer: { notes: request.customer.notes } }
          : {}),
      }
    : { customer: request.customer };
  const response = await apiRequest<unknown>("/api/checkout", {
    method: "POST",
    idempotencyKey: request.idempotencyKey,
    body: {
      ...addressPayload,
      deliveryMethod: request.deliveryMethod,
      items: request.items.map((item) => ({
        variantId: item.selectedVariant?.id,
        quantity: item.quantity,
      })),
    },
  });
  const data = parseBackendCheckoutResult(response.data);
  const order = mapBackendOrder(data.order);
  clearTransactionIntent("checkout");

  if (!data.payment.available) {
    return {
      success: true,
      order,
      paymentAvailable: false,
      paymentStarted: false,
    };
  }

  try {
    const paymentSession = await initiateBackendPayment(order.id);
    return {
      ...paymentSession,
      order: paymentSession.order ?? order,
    };
  } catch (error) {
    return {
      success: true,
      order,
      paymentAvailable: true,
      paymentStarted: false,
      error: getErrorMessage(
        error,
        "سفارش ثبت شد، اما آغاز پرداخت ناموفق بود.",
      ),
    };
  }
};

const createMockPaymentAttempt = (order: LocalOrder): CheckoutSessionResult => {
  const attemptId = generatePaymentAttemptId();
  const mockToken = randomToken();
  const now = new Date().toISOString();
  const attempt: PaymentAttempt = {
    id: attemptId,
    provider: "mock",
    attemptNumber: order.paymentAttempts.length + 1,
    status: "initiated",
    createdAt: now,
    updatedAt: now,
    mockToken,
  };
  addPaymentAttempt(order.id, attempt);
  updatePaymentAttempt(order.id, attemptId, { status: "pending" });
  const params = new URLSearchParams({
    order: order.id,
    attempt: attemptId,
    token: mockToken,
  });
  const paymentUrl = resolveSafePaymentRedirect(
    `/payment/mock?${params.toString()}`,
    {
      frontendOrigin: getFrontendOrigin(),
      allowDevelopmentRoutes: true,
    },
  );
  return {
    success: Boolean(paymentUrl),
    order: getOrderById(order.id) ?? order,
    paymentAvailable: true,
    paymentStarted: Boolean(paymentUrl),
    attemptId,
    paymentUrl: paymentUrl || undefined,
    error: paymentUrl ? undefined : "آدرس پرداخت آزمایشی معتبر نیست.",
  };
};

const createLocalMockOrder = (request: CheckoutRequest): LocalOrder => {
  if (!request.customer) throw new Error("گیرنده آزمایشی مشخص نیست.");
  validateCheckoutItems(request.items);
  const now = new Date().toISOString();
  const subtotal = request.items.reduce(
    (sum, item) =>
      sum +
      (item.selectedVariant?.priceToman || item.priceToman) * item.quantity,
    0,
  );
  const order: LocalOrder = {
    id: generateOrderId(),
    createdAt: now,
    updatedAt: now,
    customer: request.customer,
    items: request.items,
    subtotal,
    packagingFee: 0,
    deliveryMethod: request.deliveryMethod,
    deliveryFee: 0,
    discount: 0,
    total: subtotal,
    status: "awaiting_payment",
    paymentStatus: "unpaid",
    paymentAttempts: [],
    canCancel: true,
  };
  saveOrder(order);
  return order;
};

export const createCheckoutSession = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  try {
    const mode = getPaymentMode();
    const fingerprint = buildCheckoutFingerprint(request);
    const idempotencyKey = getOrCreateTransactionIntent(
      "checkout",
      fingerprint,
    );
    const securedRequest = { ...request, idempotencyKey };

    if (mode === "backend") return await createBackendCheckout(securedRequest);
    if (mode === "mock") {
      const result = createMockPaymentAttempt(
        createLocalMockOrder(securedRequest),
      );
      clearTransactionIntent("checkout");
      return result;
    }
    return { success: false, error: "ثبت سفارش در حال حاضر فعال نیست." };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(
        error,
        "ساخت سفارش یا ارتباط با سرور ناموفق بود. برای جلوگیری از سفارش تکراری، اطلاعات را تغییر ندهید و دوباره تلاش کنید.",
      ),
    };
  }
};

export const retryOrderPayment = async (
  orderId: string,
): Promise<CheckoutSessionResult> => {
  try {
    const safeOrderId = orderId.trim().slice(0, 180);
    if (!safeOrderId) return { success: false, error: "شماره سفارش معتبر نیست." };
    const mode = getPaymentMode();
    if (mode === "backend") return await initiateBackendPayment(safeOrderId);
    if (mode === "mock") {
      const order = getOrderById(safeOrderId);
      if (!order) return { success: false, error: "سفارش پیدا نشد." };
      if (!canRetryLocalOrderPayment(order)) {
        return { success: false, error: "این سفارش قابل پرداخت مجدد نیست." };
      }
      return createMockPaymentAttempt(order);
    }
    return { success: false, error: "درگاه پرداخت فعال نیست." };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "تلاش مجدد پرداخت ناموفق بود."),
    };
  }
};

export const completeMockPayment = ({
  orderId,
  attemptId,
  token,
  outcome,
}: {
  orderId: string;
  attemptId: string;
  token: string;
  outcome: "success" | "cancelled";
}): PaymentVerificationResult => {
  if (!isMockCheckoutEnabled()) {
    return { state: "unknown", error: "حالت پرداخت آزمایشی فعال نیست." };
  }
  const order = getOrderById(orderId);
  const attempt = getPaymentAttempt(orderId, attemptId);
  if (
    !order ||
    !attempt ||
    attempt.provider !== "mock" ||
    attempt.mockToken !== token ||
    !["initiated", "pending"].includes(attempt.status) ||
    !canRetryLocalOrderPayment(order)
  ) {
    return { state: "unknown", error: "اطلاعات تلاش پرداخت معتبر نیست." };
  }
  if (outcome === "success") {
    const refId = `MOCK-${randomToken().slice(0, 12).toUpperCase()}`;
    updatePaymentAttempt(orderId, attemptId, {
      status: "verified",
      refId,
      error: undefined,
    });
    const updated = updateOrder(orderId, (current) => ({
      ...current,
      status: "paid",
      paymentStatus: "paid",
      refId,
      canCancel: false,
      lastPaymentError: undefined,
    }));
    return {
      state: updated ? "success" : "unknown",
      order: updated,
      refId,
      verifiedByServer: false,
      error: updated ? undefined : "ثبت نتیجه پرداخت آزمایشی ناموفق بود.",
    };
  }
  updatePaymentAttempt(orderId, attemptId, {
    status: "cancelled",
    error: "پرداخت آزمایشی توسط کاربر لغو شد.",
  });
  const updated = updateOrder(orderId, (current) => ({
    ...current,
    paymentStatus: "failed",
    lastPaymentError: "پرداخت توسط کاربر لغو شد.",
  }));
  return {
    state: "cancelled",
    order: updated,
    error: "پرداخت توسط کاربر لغو شد.",
  };
};

export const verifyPaymentResult = async ({
  orderId,
  authority,
  status,
  attemptId,
  mockToken,
}: {
  orderId: string;
  authority?: string | null;
  status?: string | null;
  attemptId?: string | null;
  mockToken?: string | null;
}): Promise<PaymentVerificationResult> => {
  try {
    const mode = getPaymentMode();
    if (mode === "backend") {
      const safeAuthority = authority?.trim().slice(0, 255);
      if (!safeAuthority) {
        return {
          state: "unknown",
          error: "شناسه پرداخت در آدرس بازگشت وجود ندارد.",
        };
      }
      const response = await apiRequest<unknown>(
        "/api/payments/zarinpal/verify",
        {
          method: "POST",
          body: {
            authority: safeAuthority,
            status: status?.trim().slice(0, 16) || "NOK",
          },
        },
      );
      const data = parseBackendPaymentVerificationResult(response.data);
      const verified = isVerifiedBackendPayment(data);
      const state = deriveBackendPaymentState(data);
      const order = mapBackendOrder(data.order);
      return {
        state,
        order,
        refId: verified ? data.payment.referenceId || undefined : undefined,
        verifiedByServer: verified,
        error:
          state === "success"
            ? undefined
            : data.payment.failure?.message ||
              (state === "unknown"
                ? "پاسخ بررسی پرداخت از نظر داخلی سازگار نبود."
                : undefined),
      };
    }
    if (mode === "mock") {
      if (!orderId || !attemptId || !mockToken) {
        return {
          state: "unknown",
          error: "اطلاعات پرداخت آزمایشی ناقص است.",
        };
      }
      return completeMockPayment({
        orderId: orderId.slice(0, 180),
        attemptId: attemptId.slice(0, 180),
        token: mockToken.slice(0, 255),
        outcome: status?.toUpperCase() === "OK" ? "success" : "cancelled",
      });
    }
    return { state: "unknown", error: "بررسی پرداخت فعال نیست." };
  } catch (error) {
    return {
      state: "unknown",
      error: getErrorMessage(error, "بررسی پرداخت ناموفق بود."),
    };
  }
};
