import type { CartItem } from "@/lib/cart";
import { areDevelopmentMocksEnabled } from "@/lib/api";
import type {
  BackendOrder,
  BackendOrderStatus,
  BackendPaymentAttempt,
  BackendPaymentAttemptStatus,
  BackendPaymentStatus,
} from "@/lib/backend-contract";

const ORDERS_KEY = "winimi_dev_orders_v3";
const MAX_MOCK_ORDERS = 100;
const MAX_MOCK_STORAGE_LENGTH = 1_000_000;

export type DeliveryMethod = "standard" | "chilled" | "pickup";
export type OrderStatus = BackendOrderStatus;
export type PaymentStatus = BackendPaymentStatus;
export type PaymentAttemptStatus = BackendPaymentAttemptStatus;

export interface OrderCustomer {
  fullName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
}

export interface PaymentAttempt {
  id: string;
  provider: string;
  attemptNumber?: number;
  status: PaymentAttemptStatus;
  statusLabel?: string;
  createdAt: string;
  updatedAt: string;
  authority?: string;
  refId?: string;
  redirectUrl?: string;
  error?: string;
  mockToken?: string;
}

export interface LocalOrder {
  id: string;
  number?: string;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusLabel?: string;
  paymentStatus: PaymentStatus;
  paymentStatusLabel?: string;
  paymentAttempts: PaymentAttempt[];
  authority?: string;
  refId?: string;
  lastPaymentError?: string;
  reservationExpiresAt?: string;
  canCancel?: boolean;
  trackingCode?: string;
  timeline?: BackendOrder["timeline"];
}

const safeDate = (value: string | null | undefined, fallback: string) =>
  value && Number.isFinite(Date.parse(value)) ? value : fallback;

const mapPaymentAttempt = (attempt: BackendPaymentAttempt): PaymentAttempt => {
  const createdAt = safeDate(attempt.createdAt, new Date(0).toISOString());
  return {
    id: attempt.id,
    provider: attempt.provider,
    attemptNumber: attempt.attemptNumber,
    status: attempt.status,
    statusLabel: attempt.statusLabel,
    createdAt,
    updatedAt: safeDate(attempt.verifiedAt, createdAt),
    authority: attempt.authority || undefined,
    refId: attempt.referenceId || undefined,
    redirectUrl: attempt.redirectUrl || undefined,
    error: attempt.failure?.message || undefined,
  };
};

const comparePaymentAttempts = (left: PaymentAttempt, right: PaymentAttempt) => {
  const numberDifference =
    (left.attemptNumber ?? Number.MIN_SAFE_INTEGER) -
    (right.attemptNumber ?? Number.MIN_SAFE_INTEGER);
  if (numberDifference !== 0) return numberDifference;

  const dateDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt);
  if (Number.isFinite(dateDifference) && dateDifference !== 0) return dateDifference;
  return left.id.localeCompare(right.id, "en");
};

export const mapBackendOrder = (order: BackendOrder): LocalOrder => {
  const paymentAttempts = order.payments
    .map(mapPaymentAttempt)
    .sort(comparePaymentAttempts);
  const latestAttempt = paymentAttempts.at(-1);
  const verifiedAttempt = [...paymentAttempts]
    .reverse()
    .find((attempt) => attempt.status === "verified");
  const createdAt =
    order.placedAt || order.createdAt || new Date(0).toISOString();

  return {
    id: order.id,
    number: order.number,
    createdAt,
    updatedAt:
      order.cancelledAt ||
      order.paidAt ||
      order.fulfillment.deliveredAt ||
      order.fulfillment.dispatchedAt ||
      order.fulfillment.readyAt ||
      order.fulfillment.preparingAt ||
      order.fulfillment.confirmedAt ||
      createdAt,
    customer: {
      fullName: order.recipient.fullName,
      mobile: order.recipient.mobile,
      province: order.recipient.province || "",
      city: order.recipient.city || "",
      address: order.recipient.address || "تحویل حضوری",
      postalCode: order.recipient.postalCode || undefined,
      notes: order.recipient.notes || undefined,
    },
    items: order.items.map((item) => ({
      orderItemId: item.id,
      id: item.productId,
      slug: item.productId,
      name: item.productName,
      productCode: item.productCode,
      priceToman: item.unitPriceToman,
      regularPriceToman: item.unitPriceToman,
      quantity: item.quantity,
      stock: item.quantity,
      requiresCooling: item.requiresCooling,
      image: "",
      availability: "available",
      selectedVariant: {
        id: item.variantId,
        name: item.variantName,
        priceToman: item.unitPriceToman,
        stock: item.quantity,
      },
    })),
    subtotal: order.totals.subtotalToman,
    packagingFee: order.totals.packagingFeeToman,
    deliveryMethod: order.delivery.method,
    deliveryFee: order.totals.deliveryFeeToman,
    discount: order.totals.discountToman,
    total: order.totals.grandTotalToman,
    status: order.status,
    statusLabel: order.statusLabel,
    paymentStatus: order.paymentStatus,
    paymentStatusLabel: order.paymentStatusLabel,
    paymentAttempts,
    authority: latestAttempt?.authority,
    refId: verifiedAttempt?.refId,
    lastPaymentError: latestAttempt?.error,
    reservationExpiresAt: order.reservationExpiresAt || undefined,
    canCancel: order.canCancel,
    trackingCode: order.fulfillment.trackingCode || undefined,
    timeline: order.timeline,
  };
};

const assertMockStorage = () => {
  if (!areDevelopmentMocksEnabled) {
    throw new Error("ذخیره سفارش مرورگر فقط در حالت توسعه مجاز است.");
  }
};

const isLocalOrder = (value: unknown): value is LocalOrder => {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<LocalOrder>;
  return (
    typeof order.id === "string" &&
    order.id.length <= 180 &&
    typeof order.createdAt === "string" &&
    typeof order.updatedAt === "string" &&
    Boolean(order.customer) &&
    Array.isArray(order.items) &&
    order.items.length <= 100 &&
    Array.isArray(order.paymentAttempts) &&
    order.paymentAttempts.length <= 100 &&
    typeof order.total === "number" &&
    Number.isFinite(order.total) &&
    order.total >= 0
  );
};

const read = (): LocalOrder[] => {
  if (typeof window === "undefined" || !areDevelopmentMocksEnabled) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw || raw.length > MAX_MOCK_STORAGE_LENGTH) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(isLocalOrder).slice(0, MAX_MOCK_ORDERS)
      : [];
  } catch {
    return [];
  }
};

const write = (orders: LocalOrder[]) => {
  assertMockStorage();
  window.localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders.slice(0, MAX_MOCK_ORDERS)),
  );
};

export const getOrders = (): LocalOrder[] => read();
export const getOrderById = (id: string): LocalOrder | undefined =>
  read().find((order) => order.id === id);
export const getOrdersByMobile = (mobile: string): LocalOrder[] =>
  read().filter((order) => order.customer.mobile === mobile);

export const saveOrder = (order: LocalOrder): void => {
  assertMockStorage();
  const orders = read();
  const index = orders.findIndex((candidate) => candidate.id === order.id);
  const next = { ...order, updatedAt: new Date().toISOString() };
  if (index >= 0) orders[index] = next;
  else orders.unshift(next);
  write(orders);
};

export const updateOrder = (
  id: string,
  updater: (order: LocalOrder) => LocalOrder,
): LocalOrder | undefined => {
  assertMockStorage();
  const orders = read();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) return undefined;
  const updated = {
    ...updater(orders[index]),
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updated;
  write(orders);
  return updated;
};

export const addPaymentAttempt = (
  orderId: string,
  attempt: PaymentAttempt,
): LocalOrder | undefined =>
  updateOrder(orderId, (order) => ({
    ...order,
    paymentStatus: "pending",
    lastPaymentError: undefined,
    paymentAttempts: [...order.paymentAttempts, attempt].sort(comparePaymentAttempts),
    authority: attempt.authority ?? order.authority,
  }));

export const updatePaymentAttempt = (
  orderId: string,
  attemptId: string,
  updates: Partial<PaymentAttempt>,
): LocalOrder | undefined =>
  updateOrder(orderId, (order) => ({
    ...order,
    paymentAttempts: order.paymentAttempts
      .map((attempt) =>
        attempt.id === attemptId
          ? { ...attempt, ...updates, updatedAt: new Date().toISOString() }
          : attempt,
      )
      .sort(comparePaymentAttempts),
  }));

export const getPaymentAttempt = (
  orderId: string,
  attemptId: string,
): PaymentAttempt | undefined =>
  getOrderById(orderId)?.paymentAttempts.find(
    (attempt) => attempt.id === attemptId,
  );

export const canRetryLocalOrderPayment = (order: LocalOrder) =>
  order.status === "awaiting_payment" && order.paymentStatus !== "paid";

export const cancelOwnedMockOrder = (
  orderId: string,
  ownerMobile: string,
): LocalOrder => {
  assertMockStorage();
  const order = getOrderById(orderId);
  if (!order || order.customer.mobile !== ownerMobile) {
    throw new Error("سفارش آزمایشی وجود ندارد یا متعلق به این حساب نیست.");
  }
  if (!order.canCancel || order.status !== "awaiting_payment") {
    throw new Error("این سفارش دیگر قابل لغو نیست.");
  }

  const cancelled = updateOrder(orderId, (current) => ({
    ...current,
    status: "cancelled",
    paymentStatus: current.paymentStatus === "paid" ? "paid" : "failed",
    canCancel: false,
    lastPaymentError: "سفارش آزمایشی توسط کاربر لغو شد.",
  }));
  if (!cancelled) throw new Error("لغو سفارش آزمایشی ناموفق بود.");
  return cancelled;
};

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replaceAll("-", "")
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

export const generateOrderId = () =>
  `DEV-${Date.now().toString(36).toUpperCase()}-${randomId().slice(0, 6).toUpperCase()}`;
export const generatePaymentAttemptId = () =>
  `DEV-PAY-${randomId().slice(0, 16)}`;

export const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  confirmed: "تأییدشده",
  preparing: "در حال آماده‌سازی",
  ready: "آماده ارسال یا تحویل",
  dispatched: "ارسال‌شده",
  delivered: "تحویل‌شده",
  cancelled: "لغوشده",
  expired: "منقضی‌شده",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "پرداخت‌نشده",
  pending: "در حال بررسی",
  paid: "پرداخت‌شده",
  failed: "ناموفق",
  refunded: "بازگشت‌داده‌شده",
};
