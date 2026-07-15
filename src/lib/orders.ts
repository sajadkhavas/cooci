import type { CartItem } from "@/context/CartContext";

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
  payment: {
    method: "online";
    provider: "gateway-placeholder";
    status: "awaiting_gateway";
  };
  status: "draft_frontend_order";
}

const ORDERS_STORAGE_KEY = "winimi_orders_v1";

const readOrders = (): LocalOrder[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  } catch {
    return [];
  }
};

export const createLocalOrder = ({
  customer,
  items,
  subtotal,
  deliveryFee = 0,
}: {
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number;
}): LocalOrder => {
  const order: LocalOrder = {
    id: `WIN-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    payment: {
      method: "online",
      provider: "gateway-placeholder",
      status: "awaiting_gateway",
    },
    status: "draft_frontend_order",
  };

  const orders = readOrders();
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...orders]));
  return order;
};

export const getLocalOrder = (orderId: string | null): LocalOrder | undefined => {
  if (!orderId) return undefined;
  return readOrders().find((order) => order.id === orderId);
};

export const isCoolingDeliveryCity = (city: string) => {
  const normalized = city.trim().toLowerCase();
  return ["تهران", "کرج", "اندیشه", "tehran", "karaj", "andisheh"].some((allowed) =>
    normalized.includes(allowed),
  );
};
