import { authenticatedRequest, getAuthMode, type AuthUser } from "@/lib/auth";
import { getOrderById, getOrdersByMobile, saveOrder, type LocalOrder } from "@/lib/orders";

export interface AccountOrdersResult {
  orders: LocalOrder[];
  source: "backend" | "mock";
}

export const loadAccountOrders = async (user: AuthUser): Promise<AccountOrdersResult> => {
  if (getAuthMode() === "backend") {
    const payload = await authenticatedRequest<{ orders: LocalOrder[] }>(
      "/api/account/orders",
      { method: "GET" },
    );
    payload.orders.forEach((order) => saveOrder(order));
    return {
      orders: [...payload.orders].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      ),
      source: "backend",
    };
  }

  return {
    orders: getOrdersByMobile(user.mobile).sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    ),
    source: "mock",
  };
};

export const loadOwnedOrder = async (
  user: AuthUser,
  orderId: string,
): Promise<LocalOrder | null> => {
  if (getAuthMode() === "backend") {
    try {
      const payload = await authenticatedRequest<{ order: LocalOrder }>(
        `/api/account/orders/${encodeURIComponent(orderId)}`,
        { method: "GET" },
      );
      saveOrder(payload.order);
      return payload.order;
    } catch {
      return null;
    }
  }

  const order = getOrderById(orderId);
  if (!order || order.customer.mobile !== user.mobile) return null;
  return order;
};
