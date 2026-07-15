import type { CartItem } from "@/context/CartContext";

export type DeliveryMethod = "standard" | "chilled" | "pickup";
export type PaymentProvider = "gateway-placeholder" | "zarinpal" | "idpay" | "nextpay";

export interface CheckoutCustomer {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface LocalOrder {
  id: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  delivery: {
    method: DeliveryMethod;
    label: string;
    city: string;
  };
  payment: {
    method: "online";
    provider: PaymentProvider;
    status: "awaiting_gateway" | "redirect_ready" | "paid" | "failed";
    authority?: string;
    callbackUrl: string;
  };
  status: "draft_frontend_order" | "awaiting_payment" | "paid" | "payment_failed";
}

const ORDERS_STORAGE_KEY = "winimi_orders_v1";

export const readLocalOrders = (): LocalOrder[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  } catch {
    return [];
  }
};

export const deliveryMethods: Record<DeliveryMethod, { label: string; description: string; fee: number }> = {
  standard: {
    label: "ارسال استاندارد محصولات خشک",
    description: "مناسب کوکی‌ها، مینی‌کوکی‌ها و محصولات خشک با بسته‌بندی محافظ.",
    fee: 85000,
  },
  chilled: {
    label: "ارسال یخچالی تهران/کرج",
    description: "برای کیک، چیزکیک، تیرامیسو و محصولات نیازمند زنجیره سرد.",
    fee: 150000,
  },
  pickup: {
    label: "تحویل حضوری با هماهنگی",
    description: "تحویل از محدوده فعالیت وینیمی با هماهنگی قبلی.",
    fee: 0,
  },
};

export const isValidIranMobile = (phone: string) => /^09\d{9}$/.test(phone.trim());

export const isCoolingDeliveryCity = (city: string) => {
  const normalized = city.trim().toLowerCase();
  return ["تهران", "کرج", "اندیشه", "tehran", "karaj", "andisheh"].some((allowed) =>
    normalized.includes(allowed),
  );
};

export const getRecommendedDeliveryMethod = ({
  hasCoolingItems,
  city,
}: {
  hasCoolingItems: boolean;
  city: string;
}): DeliveryMethod => {
  if (hasCoolingItems) return "chilled";
  if (city.trim().includes("اندیشه")) return "pickup";
  return "standard";
};

export const createLocalOrder = ({
  customer,
  items,
  subtotal,
  deliveryMethod,
  paymentProvider = "gateway-placeholder",
}: {
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryMethod: DeliveryMethod;
  paymentProvider?: PaymentProvider;
}): LocalOrder => {
  const delivery = deliveryMethods[deliveryMethod];
  const orderId = `WIN-${Date.now().toString(36).toUpperCase()}`;
  const order: LocalOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    deliveryFee: delivery.fee,
    total: subtotal + delivery.fee,
    delivery: {
      method: deliveryMethod,
      label: delivery.label,
      city: customer.city,
    },
    payment: {
      method: "online",
      provider: paymentProvider,
      status: "redirect_ready",
      authority: `AUTH-${orderId}`,
      callbackUrl: `/payment/callback?order=${encodeURIComponent(orderId)}`,
    },
    status: "awaiting_payment",
  };

  const orders = readLocalOrders();
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...orders]));
  return order;
};

export const getLocalOrder = (orderId: string | null): LocalOrder | undefined => {
  if (!orderId) return undefined;
  return readLocalOrders().find((order) => order.id === orderId);
};

export const updateLocalOrderPaymentStatus = (
  orderId: string,
  status: LocalOrder["payment"]["status"],
): LocalOrder | undefined => {
  const orders = readLocalOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) return undefined;

  const nextStatus: LocalOrder["status"] =
    status === "paid" ? "paid" : status === "failed" ? "payment_failed" : "awaiting_payment";
  const updated: LocalOrder = {
    ...order,
    status: nextStatus,
    payment: { ...order.payment, status },
  };

  window.localStorage.setItem(
    ORDERS_STORAGE_KEY,
    JSON.stringify(orders.map((item) => (item.id === orderId ? updated : item))),
  );

  return updated;
};
