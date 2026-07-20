import type { CartItem } from "@/lib/cart";
import {
  apiRequest,
  areDevelopmentMocksEnabled,
  createIdempotencyKey,
  getFrontendDataMode,
} from "@/lib/api";
import type {
  BackendCheckoutResult,
  BackendDeliveryOptions,
  BackendPaymentInitiationResult,
  BackendPaymentVerificationResult,
} from "@/lib/backend-contract";
import {
  addPaymentAttempt,
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

const CONFIGURED_PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || "disabled";
const CHECKOUT_DRAFT_KEY = "winimi_checkout_draft_v1";

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
  idempotencyKey: string;
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
  error?: string;
}

const randomToken = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replaceAll("-", "")
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

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
    return raw ? (JSON.parse(raw) as CheckoutDraft) : null;
  } catch {
    return null;
  }
};

export const saveCheckoutDraft = (
  draft: Omit<CheckoutDraft, "savedAt">,
) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
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
  if (province?.trim()) params.set("province", province.trim());
  if (city?.trim()) params.set("city", city.trim());
  return (
    await apiRequest<BackendDeliveryOptions>(
      `/api/delivery/options?${params.toString()}`,
    )
  ).data;
};

const initiateBackendPayment = async (
  orderId: string,
): Promise<CheckoutSessionResult> => {
  const response = await apiRequest<BackendPaymentInitiationResult>(
    `/api/orders/${encodeURIComponent(orderId)}/payments`,
    {
      method: "POST",
      idempotencyKey: createIdempotencyKey("PAY"),
      body: {},
    },
  );
  const order = mapBackendOrder(response.data.order);
  const paymentUrl = response.data.payment.redirectUrl || undefined;

  return {
    success: true,
    order,
    paymentAvailable: true,
    paymentStarted: Boolean(paymentUrl),
    attemptId: response.data.payment.id,
    paymentUrl,
    error: paymentUrl
      ? undefined
      : "درگاه آدرس انتقال معتبر برنگرداند.",
  };
};

const createBackendCheckout = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  const invalidItem = request.items.find((item) => !item.selectedVariant?.id);
  if (invalidItem) {
    throw new Error(`Variant قابل سفارش برای «${invalidItem.name}» مشخص نیست.`);
  }

  const addressPayload = request.addressId
    ? {
        addressId: request.addressId,
        ...(request.customer?.notes
          ? { customer: { notes: request.customer.notes } }
          : {}),
      }
    : { customer: request.customer };
  const response = await apiRequest<BackendCheckoutResult>("/api/checkout", {
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
  const order = mapBackendOrder(response.data.order);

  if (!response.data.payment.available) {
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
  return {
    success: true,
    order: getOrderById(order.id) ?? order,
    paymentAvailable: true,
    paymentStarted: true,
    attemptId,
    paymentUrl: `/payment/mock?${params.toString()}`,
  };
};

const createLocalMockOrder = (request: CheckoutRequest): LocalOrder => {
  if (!request.customer) throw new Error("گیرنده آزمایشی مشخص نیست.");
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
    if (mode === "backend") return await createBackendCheckout(request);
    if (mode === "mock") {
      return createMockPaymentAttempt(createLocalMockOrder(request));
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
    const mode = getPaymentMode();
    if (mode === "backend") return await initiateBackendPayment(orderId);
    if (mode === "mock") {
      const order = getOrderById(orderId);
      if (!order) return { success: false, error: "سفارش پیدا نشد." };
      if (order.paymentStatus === "paid") {
        return { success: false, error: "این سفارش قبلاً پرداخت شده است." };
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
    attempt.mockToken !== token
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
      lastPaymentError: undefined,
    }));
    return { state: "success", order: updated, refId };
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
      if (!authority) {
        return {
          state: "unknown",
          error: "شناسه پرداخت در آدرس بازگشت وجود ندارد.",
        };
      }
      const response = await apiRequest<BackendPaymentVerificationResult>(
        "/api/payments/zarinpal/verify",
        {
          method: "POST",
          body: { authority, status: status || "NOK" },
        },
      );
      const order = mapBackendOrder(response.data.order);
      return {
        state: response.data.verified
          ? "success"
          : status?.toUpperCase() === "NOK"
            ? "cancelled"
            : "failed",
        order,
        refId: response.data.payment.referenceId || undefined,
        error: response.data.payment.failure?.message || undefined,
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
        orderId,
        attemptId,
        token: mockToken,
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
