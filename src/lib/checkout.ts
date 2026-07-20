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
  subtotal?: number;
  packagingFee?: number;
  deliveryFee?: number;
  total?: number;
}

export interface CheckoutSessionResult {
  success: boolean;
  order?: LocalOrder;
  paymentUrl?: string;
  attemptId?: string;
  paymentAvailable?: boolean;
  error?: string;
}

export interface PaymentVerificationResult {
  state: PaymentResultState;
  order?: LocalOrder;
  refId?: string;
  error?: string;
}

const randomToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

export { createIdempotencyKey };

export const getPaymentMode = (): PaymentMode => {
  if (getFrontendDataMode() === "backend") return "backend";
  if (
    areDevelopmentMocksEnabled &&
    CONFIGURED_PAYMENT_MODE === "mock"
  ) {
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

const normalizeLocation = (value: string) =>
  value
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");

export const isChilledDeliveryCity = (city: string) => {
  const normalized = normalizeLocation(city);
  return ["تهران", "کرج", "اندیشه"].some((candidate) =>
    normalized.includes(candidate),
  );
};

export const getDeliveryFee = () => 0;

export const validateDeliveryMethod = ({
  method,
  hasCoolingItems,
}: {
  method: DeliveryMethod;
  city?: string;
  hasCoolingItems: boolean;
}): string | null => {
  if (hasCoolingItems && method === "standard") {
    return "این سبد به ارسال سرد یا تحویل حضوری نیاز دارد.";
  }
  return null;
};

export const loadCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CheckoutDraft;
    return parsed && typeof parsed === "object" ? parsed : null;
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
    // Draft persistence is optional and never authoritative.
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
  return {
    success: true,
    order,
    paymentAvailable: true,
    attemptId: response.data.payment.id,
    paymentUrl: response.data.payment.redirectUrl || undefined,
    error: response.data.payment.redirectUrl
      ? undefined
      : "درگاه آدرس انتقال معتبر برنگرداند.",
  };
};

const createBackendCheckout = async (
  request: CheckoutRequest,
): Promise<CheckoutSessionResult> => {
  const invalidItem = request.items.find((item) => !item.selectedVariant?.id);
  if (invalidItem) {
    throw new Error(`نوع قابل سفارش برای «${invalidItem.name}» مشخص نیست.`);
  }

  const response = await apiRequest<BackendCheckoutResult>("/api/checkout", {
    method: "POST",
    idempotencyKey: request.idempotencyKey,
    body: {
      ...(request.addressId
        ? { addressId: request.addressId }
        : { customer: request.customer }),
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
    };
  }

  return initiateBackendPayment(order.id);
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
  const updatedOrder = getOrderById(order.id) ?? order;
  const params = new URLSearchParams({
    order: order.id,
    attempt: attemptId,
    token: mockToken,
  });
  return {
    success: true,
    order: updatedOrder,
    paymentAvailable: true,
    attemptId,
    paymentUrl: `/payment/mock?${params.toString()}`,
  };
};

const createLocalMockOrder = (request: CheckoutRequest): LocalOrder => {
  if (!request.customer) throw new Error("گیرنده آزمایشی مشخص نیست.");
  const now = new Date().toISOString();
  const subtotal = request.items.reduce(
    (sum, item) =>
      sum + (item.selectedVariant?.priceToman || item.priceToman) * item.quantity,
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
  const mode = getPaymentMode();
  try {
    if (mode === "backend") return await createBackendCheckout(request);
    if (mode === "mock") return createMockPaymentAttempt(createLocalMockOrder(request));
    return { success: false, error: "ثبت سفارش در حال حاضر فعال نیست." };
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
  try {
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
  const mode = getPaymentMode();
  try {
    if (mode === "backend") {
      if (!authority) {
        return { state: "unknown", error: "شناسه پرداخت در آدرس بازگشت وجود ندارد." };
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
      if (!attemptId || !mockToken) {
        return { state: "unknown", error: "اطلاعات پرداخت آزمایشی ناقص است." };
      }
      return completeMockPayment({
        orderId,
        attemptId,
        token: mockToken,
        outcome: status === "OK" ? "success" : "cancelled",
      });
    }
    return { state: "unknown", error: "بررسی پرداخت فعال نیست." };
  } catch (error) {
    return {
      state: "unknown",
      error: error instanceof Error ? error.message : "بررسی پرداخت ناموفق بود.",
    };
  }
};
