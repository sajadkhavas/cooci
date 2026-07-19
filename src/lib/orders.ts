import type { CartItem } from "@/lib/cart";

const ORDERS_KEY = "winimi_orders_v2";
const LEGACY_ORDERS_KEY = "winimi_orders_v1";

export type DeliveryMethod = "standard" | "chilled" | "pickup";
export type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "cancelled";
export type PaymentAttemptStatus =
  | "created"
  | "redirected"
  | "verified"
  | "failed"
  | "cancelled";

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
  provider: "backend" | "mock";
  status: PaymentAttemptStatus;
  createdAt: string;
  updatedAt: string;
  authority?: string;
  refId?: string;
  error?: string;
  mockToken?: string;
}

export interface LocalOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentAttempts: PaymentAttempt[];
  authority?: string;
  refId?: string;
  lastPaymentError?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const sanitizeAttempt = (value: unknown): PaymentAttempt | null => {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  const now = new Date().toISOString();
  const status: PaymentAttemptStatus =
    value.status === "redirected" ||
    value.status === "verified" ||
    value.status === "failed" ||
    value.status === "cancelled"
      ? value.status
      : "created";

  return {
    id: value.id,
    provider: value.provider === "mock" ? "mock" : "backend",
    status,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : now,
    authority: typeof value.authority === "string" ? value.authority : undefined,
    refId: typeof value.refId === "string" ? value.refId : undefined,
    error: typeof value.error === "string" ? value.error : undefined,
    mockToken: typeof value.mockToken === "string" ? value.mockToken : undefined,
  };
};

const sanitizeOrder = (value: unknown): LocalOrder | null => {
  if (!isRecord(value) || typeof value.id !== "string" || !isRecord(value.customer)) {
    return null;
  }

  const customer = value.customer;
  if (
    typeof customer.fullName !== "string" ||
    typeof customer.mobile !== "string" ||
    typeof customer.province !== "string" ||
    typeof customer.city !== "string" ||
    typeof customer.address !== "string"
  ) {
    return null;
  }

  const createdAt =
    typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString();
  const status: OrderStatus =
    value.status === "paid" ||
    value.status === "processing" ||
    value.status === "shipped" ||
    value.status === "delivered" ||
    value.status === "cancelled"
      ? value.status
      : "awaiting_payment";
  const paymentStatus: PaymentStatus =
    value.paymentStatus === "pending" ||
    value.paymentStatus === "paid" ||
    value.paymentStatus === "failed" ||
    value.paymentStatus === "cancelled"
      ? value.paymentStatus
      : "unpaid";

  return {
    id: value.id,
    createdAt,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : createdAt,
    customer: {
      fullName: customer.fullName,
      mobile: customer.mobile,
      province: customer.province,
      city: customer.city,
      address: customer.address,
      postalCode:
        typeof customer.postalCode === "string" ? customer.postalCode : undefined,
      notes: typeof customer.notes === "string" ? customer.notes : undefined,
    },
    items: Array.isArray(value.items) ? (value.items as CartItem[]) : [],
    subtotal: typeof value.subtotal === "number" ? value.subtotal : 0,
    packagingFee: typeof value.packagingFee === "number" ? value.packagingFee : 0,
    deliveryMethod:
      value.deliveryMethod === "chilled" || value.deliveryMethod === "pickup"
        ? value.deliveryMethod
        : "standard",
    deliveryFee: typeof value.deliveryFee === "number" ? value.deliveryFee : 0,
    total: typeof value.total === "number" ? value.total : 0,
    status,
    paymentStatus,
    paymentAttempts: Array.isArray(value.paymentAttempts)
      ? value.paymentAttempts
          .map(sanitizeAttempt)
          .filter((attempt): attempt is PaymentAttempt => Boolean(attempt))
      : [],
    authority: typeof value.authority === "string" ? value.authority : undefined,
    refId: typeof value.refId === "string" ? value.refId : undefined,
    lastPaymentError:
      typeof value.lastPaymentError === "string" ? value.lastPaymentError : undefined,
  };
};

const readFromKey = (key: string): LocalOrder[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeOrder)
      .filter((order): order is LocalOrder => Boolean(order));
  } catch {
    return [];
  }
};

const read = (): LocalOrder[] => {
  const current = readFromKey(ORDERS_KEY);
  if (current.length > 0) return current;

  const legacy = readFromKey(LEGACY_ORDERS_KEY);
  if (legacy.length > 0) write(legacy);
  return legacy;
};

const write = (orders: LocalOrder[]) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.localStorage.removeItem(LEGACY_ORDERS_KEY);
  } catch {
    // Local demo storage may be unavailable in restricted browsers.
  }
};

export const getOrders = (): LocalOrder[] => read();

export const getOrderById = (id: string): LocalOrder | undefined =>
  read().find((order) => order.id === id);

export const saveOrder = (order: LocalOrder): void => {
  const orders = read();
  const index = orders.findIndex((candidate) => candidate.id === order.id);
  const nextOrder = { ...order, updatedAt: new Date().toISOString() };
  if (index >= 0) orders[index] = nextOrder;
  else orders.unshift(nextOrder);
  write(orders);
};

export const updateOrder = (
  id: string,
  updater: (order: LocalOrder) => LocalOrder,
): LocalOrder | undefined => {
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

export const updateOrderStatus = (
  id: string,
  updates: Partial<
    Pick<
      LocalOrder,
      | "status"
      | "paymentStatus"
      | "refId"
      | "authority"
      | "lastPaymentError"
    >
  >,
): LocalOrder | undefined =>
  updateOrder(id, (order) => ({ ...order, ...updates }));

export const addPaymentAttempt = (
  orderId: string,
  attempt: PaymentAttempt,
): LocalOrder | undefined =>
  updateOrder(orderId, (order) => ({
    ...order,
    paymentStatus: "pending",
    lastPaymentError: undefined,
    paymentAttempts: [...order.paymentAttempts, attempt],
    authority: attempt.authority ?? order.authority,
  }));

export const updatePaymentAttempt = (
  orderId: string,
  attemptId: string,
  updates: Partial<PaymentAttempt>,
): LocalOrder | undefined =>
  updateOrder(orderId, (order) => ({
    ...order,
    paymentAttempts: order.paymentAttempts.map((attempt) =>
      attempt.id === attemptId
        ? { ...attempt, ...updates, updatedAt: new Date().toISOString() }
        : attempt,
    ),
  }));

export const getPaymentAttempt = (
  orderId: string,
  attemptId: string,
): PaymentAttempt | undefined =>
  getOrderById(orderId)?.paymentAttempts.find((attempt) => attempt.id === attemptId);

export const getOrdersByMobile = (mobile: string): LocalOrder[] =>
  read().filter((order) => order.customer.mobile === mobile);

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

export const generateOrderId = () =>
  `WIN-${Date.now().toString(36).toUpperCase()}-${randomId().slice(0, 6).toUpperCase()}`;

export const generatePaymentAttemptId = () => `PAY-${randomId().slice(0, 16)}`;

export const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: "در انتظار پرداخت",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "پرداخت نشده",
  pending: "در حال پرداخت",
  paid: "پرداخت شده",
  failed: "ناموفق",
  cancelled: "لغوشده",
};
