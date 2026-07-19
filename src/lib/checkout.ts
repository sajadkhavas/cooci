import type { CartItem } from "@/lib/cart";
import {
  CHILLED_DELIVERY_FEE,
  PACKAGING_FEE,
  STANDARD_DELIVERY_FEE,
} from "@/lib/cart";
import {
  addPaymentAttempt,
  generateOrderId,
  generatePaymentAttemptId,
  getOrderById,
  getPaymentAttempt,
  saveOrder,
  updateOrder,
  updatePaymentAttempt,
  type DeliveryMethod,
  type LocalOrder,
  type OrderCustomer,
  type PaymentAttempt,
} from "@/lib/orders";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const BACKEND_ENABLED = import.meta.env.VITE_USE_BACKEND === "true";
const CONFIGURED_PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || "disabled";
const CHECKOUT_DRAFT_KEY = "winimi_checkout_draft_v1";

export type PaymentMode = "backend" | "mock" | "disabled";
export type PaymentResultState = "success" | "failed" | "cancelled" | "unknown";

export interface CheckoutCustomerInput extends OrderCustomer {}

export interface CheckoutDraft {
  customer: Partial<CheckoutCustomerInput>;
  deliveryMethod: DeliveryMethod;
  savedAt: string;
}

export interface CheckoutRequest {
  customer: CheckoutCustomerInput;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  idempotencyKey: string;
}

export interface CheckoutSessionResult {
  success: boolean;
  order?: LocalOrder;
  paymentUrl?: string;
  attemptId?: string;
  error?: string;
}

export interface PaymentVerificationResult {
  state: PaymentResultState;
  order?: LocalOrder;
  refId?: string;
  error?: string;
}

interface BackendPaymentResponse {
  order: LocalOrder;
  payment: {
    attemptId: string;
    redirectUrl: string;
    authority?: string;
  };
}

interface BackendVerificationResponse {
  state: PaymentResultState;
  order: LocalOrder;
  refId?: string;
  error?: string;
}

const randomToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

export const createIdempotencyKey = () => `CHK-${randomToken()}`;

export const getPaymentMode = (): PaymentMode => {
  if (BACKEND_ENABLED) return "backend";
  if (CONFIGURED_PAYMENT_MODE === "mock") return "mock";
  return "disabled";
};

export const isBackendCheckoutEnabled = () => getPaymentMode() === "backend";
export const isMockCheckoutEnabled = () => getPaymentMode() === "mock";

export const normalizeEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const normalizeLocation = (value: string) =>
  value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");

export const isChilledDeliveryCity = (city: string) => {
  const normalized = normalizeLocation(city);
  return normalized.includes("تهران") || normalized.includes("کرج");
};

export const getDeliveryFee = (method: DeliveryMethod) => {
  if (method === "pickup") return 0;
  return method === "chilled" ? CHILLED_DELIVERY_FEE : STANDARD_DELIVERY_FEE;
};

export const validateDeliveryMethod = ({
  method,
  city,
  hasCoolingItems,
}: {
  method: DeliveryMethod;
  city: string;
  hasCoolingItems: boolean;
}): string | null => {
  if (method === "pickup") return null;
  if (hasCoolingItems && method !== "chilled") {
    return "محصولات یخچالی فقط با ارسال یخچالی یا تحویل حضوری قابل ثبت هستند.";
  }
  if (method === "chilled" && !isChilledDeliveryCity(city)) {
    return "ارسال یخچالی فقط برای شهر تهران و کرج امکان‌پذیر است.";
  }
  return null;
};

export const loadCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CheckoutDraft;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveCheckoutDraft = (draft: Omit<CheckoutDraft, "savedAt">) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
    );
  } catch {
    // Draft persistence is optional.
  }
};

export const clearCheckoutDraft = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
  } catch {
    // Draft persistence is optional.
  }
};

const requestJson = async <T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {},
): Promise<T> => {
  if (!API_BASE_URL) throw new Error("آدرس API بک‌اند تنظیم نشده است.");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.idempotencyKey
          ? { "Idempotency-Key": init.idempotencyKey }
          : {}),
        ...init.headers,
      },
      credentials: "include",
    });

    const payload = (await response.json().catch(() => null)) as
      | (T & { message?: string })
      | null;

    if (!response.ok) {
      throw new Error(payload?.message || "درخواست به سرور با خطا روبه‌رو شد.");
    }

    if (!payload) throw new Error("پاسخ معتبر از سرور دریافت نشد.");
    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("زمان پاسخ‌گویی سرور تمام شد. دوباره تلاش کنید.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

const createMockPaymentAttempt = (order: LocalOrder): CheckoutSessionResult => {
  const attemptId = generatePaymentAttemptId();
  const mockToken = randomToken();
  const now = new Date().toISOString();
  const attempt: PaymentAttempt = {
    id: attemptId,
    provider: "mock",
    status: "created",
    createdAt: now,
    updatedAt: now,
    mockToken,
  };

  addPaymentAttempt(order.id, attempt);
  updatePaymentAttempt(order.id, attemptId, { status: "redirected" });
  const updatedOrder = getOrderById(order.id) ?? order;
  const params = new URLSearchParams({
    order: order.id,
    attempt: attemptId,
    token: mockToken,
  });

  return {
    success: true,
    order: updatedOrder,
    attemptId,
    paymentUrl: `/payment/mock?${params.toString()}`,
  };
};

const createLocalMockOrder = (request: CheckoutRequest): LocalOrder => {
  const now = new Date().toISOString();
  const order: LocalOrder = {
    id: generateOrderId(),
    createdAt: now,
    updatedAt: now,
    customer: request.customer,
    items: request.items,
    subtotal: request.subtotal,
    packagingFee: request.packagingFee,
    deliveryMethod: request.deliveryMethod,
    deliveryFee: request.deliveryFee,
    total: request.total,
    status: "awaiting_payment",
    paymentStatus: "unpaid",
    paymentAttempts: [],
  };
  saveOrder(order);
  return order;
};

const createBackendCheckout = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  const payload = await requestJson<BackendPaymentResponse>("/api/checkout", {
    method: "POST",
    idempotencyKey: request.idempotencyKey,
    body: JSON.stringify({
      customer: request.customer,
      deliveryMethod: request.deliveryMethod,
      items: request.items.map((item) => ({
        productId: item.id,
        variantId: item.selectedVariant?.id,
        quantity: item.quantity,
      })),
    }),
  });

  saveOrder(payload.order);
  return {
    success: true,
    order: payload.order,
    attemptId: payload.payment.attemptId,
    paymentUrl: payload.payment.redirectUrl,
  };
};

export const createCheckoutSession = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  const mode = getPaymentMode();

  try {
    if (mode === "backend") return await createBackendCheckout(request);
    if (mode === "mock") {
      const order = createLocalMockOrder(request);
      return createMockPaymentAttempt(order);
    }

    return {
      success: false,
      error:
        "پرداخت آنلاین هنوز به بک‌اند متصل نشده است. VITE_USE_BACKEND یا حالت Mock توسعه را تنظیم کنید.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "ساخت سفارش یا اتصال به درگاه ناموفق بود.",
    };
  }
};

export const retryOrderPayment = async (
  orderId: string,
): Promise<CheckoutSessionResult> => {
  const mode = getPaymentMode();
  const order = getOrderById(orderId);
  if (!order) return { success: false, error: "سفارش پیدا نشد." };
  if (order.paymentStatus === "paid") {
    return { success: false, error: "این سفارش قبلاً پرداخت شده است." };
  }

  try {
    if (mode === "backend") {
      const payload = await requestJson<BackendPaymentResponse>(
        `/api/orders/${encodeURIComponent(orderId)}/payments`,
        {
          method: "POST",
          idempotencyKey: createIdempotencyKey(),
          body: JSON.stringify({ provider: "zarinpal" }),
        },
      );
      saveOrder(payload.order);
      return {
        success: true,
        order: payload.order,
        attemptId: payload.payment.attemptId,
        paymentUrl: payload.payment.redirectUrl,
      };
    }

    if (mode === "mock") return createMockPaymentAttempt(order);
    return { success: false, error: "درگاه پرداخت فعال نیست." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "تلاش مجدد پرداخت ناموفق بود.",
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
  if (!order || !attempt || attempt.provider !== "mock" || attempt.mockToken !== token) {
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
    paymentStatus: "cancelled",
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
  const mode = getPaymentMode();

  try {
    if (mode === "backend") {
      const payload = await requestJson<BackendVerificationResponse>(
        "/api/payments/zarinpal/verify",
        {
          method: "POST",
          body: JSON.stringify({
            orderId,
            authority,
            status,
          }),
        },
      );
      saveOrder(payload.order);
      return payload;
    }

    if (mode === "mock") {
      if (!attemptId || !mockToken) {
        return { state: "unknown", error: "اطلاعات پرداخت آزمایشی ناقص است." };
      }
      const order = getOrderById(orderId);
      const attempt = getPaymentAttempt(orderId, attemptId);
      if (!order || !attempt || attempt.mockToken !== mockToken) {
        return { state: "unknown", error: "نتیجه پرداخت آزمایشی معتبر نیست." };
      }
      if (attempt.status === "verified" && order.paymentStatus === "paid") {
        return { state: "success", order, refId: attempt.refId ?? order.refId };
      }
      if (attempt.status === "cancelled") {
        return { state: "cancelled", order, error: attempt.error };
      }
      if (attempt.status === "failed") {
        return { state: "failed", order, error: attempt.error };
      }
      return { state: "unknown", order, error: "وضعیت پرداخت هنوز نهایی نشده است." };
    }

    return { state: "unknown", error: "سرویس تأیید پرداخت فعال نیست." };
  } catch (error) {
    return {
      state: "unknown",
      error: error instanceof Error ? error.message : "تأیید پرداخت ناموفق بود.",
    };
  }
};

export const DEFAULT_PACKAGING_FEE = PACKAGING_FEE;
