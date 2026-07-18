import type { CartItem } from "@/context/CartContext";

const ORDERS_KEY = "winimi_orders_v1";

export type DeliveryMethod = "standard" | "chilled" | "pickup";
export type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed";

export interface LocalOrder {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    mobile: string;
    province: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
  };
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  authority?: string;
  refId?: string;
}

const read = (): LocalOrder[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  } catch {
    return [];
  }
};

const write = (orders: LocalOrder[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrders = (): LocalOrder[] => read();

export const getOrderById = (id: string): LocalOrder | undefined =>
  read().find((o) => o.id === id);

export const saveOrder = (order: LocalOrder): void => {
  const orders = read();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = order;
  else orders.unshift(order);
  write(orders);
};

export const updateOrderStatus = (
  id: string,
  updates: Partial<Pick<LocalOrder, "status" | "paymentStatus" | "refId" | "authority">>,
): LocalOrder | undefined => {
  const orders = read();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return undefined;
  orders[idx] = { ...orders[idx], ...updates };
  write(orders);
  return orders[idx];
};

export const getOrdersByMobile = (mobile: string): LocalOrder[] =>
  read().filter((o) => o.customer.mobile === mobile);

export const generateOrderId = () => "WIN-" + Date.now().toString(36).toUpperCase();

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
  paid: "پرداخت شده",
  failed: "ناموفق",
};
