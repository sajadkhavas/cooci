import { ApiError, apiRequest, areDevelopmentMocksEnabled } from "@/lib/api";
import { getAuthMode, type AuthUser } from "@/lib/auth";
import type {
  BackendAddress,
  BackendAddressInput,
  BackendOrder,
} from "@/lib/backend-contract";
import {
  cancelOwnedMockOrder,
  getOrderById,
  getOrdersByMobile,
  mapBackendOrder,
  type LocalOrder,
} from "@/lib/orders";
import {
  parseBackendOrder,
  parseBackendOrders,
} from "@/lib/order-schema";

export interface AccountOrdersResult {
  orders: LocalOrder[];
  source: "backend" | "mock";
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
}

const normalizePagination = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const pagination = value as Record<string, unknown>;
  const page = Number(pagination.page);
  const totalPages = Number(pagination.totalPages);
  const total = Number(pagination.total);
  const hasMore = pagination.hasMore;
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(totalPages) ||
    totalPages < 1 ||
    page > totalPages ||
    !Number.isInteger(total) ||
    total < 0 ||
    typeof hasMore !== "boolean"
  ) {
    throw new ApiError({
      message: "ساختار صفحه‌بندی سفارش‌ها معتبر نیست.",
      status: 502,
      code: "invalid_order_contract",
    });
  }
  return { page, totalPages, total, hasMore };
};

export const loadAccountOrders = async (
  user: AuthUser,
  page = 1,
): Promise<AccountOrdersResult> => {
  if (getAuthMode() === "backend") {
    const safePage = Number.isFinite(page)
      ? Math.max(1, Math.min(10_000, Math.trunc(page)))
      : 1;
    const response = await apiRequest<unknown>(
      `/api/account/orders?page=${safePage}&perPage=30`,
    );
    const backendOrders = parseBackendOrders(response.data);
    return {
      orders: backendOrders.map(mapBackendOrder),
      source: "backend",
      pagination: normalizePagination(response.meta.pagination),
    };
  }

  if (!areDevelopmentMocksEnabled) {
    throw new Error("سفارش‌های مرورگر در production قابل استفاده نیستند.");
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
      const response = await apiRequest<{ order: unknown }>(
        `/api/account/orders/${encodeURIComponent(orderId)}`,
      );
      return mapBackendOrder(parseBackendOrder(response.data.order));
    } catch (error) {
      if (error instanceof ApiError && error.code === "resource_not_found") {
        return null;
      }
      throw error;
    }
  }

  if (!areDevelopmentMocksEnabled) return null;
  const order = getOrderById(orderId);
  if (!order || order.customer.mobile !== user.mobile) return null;
  return order;
};

export const cancelOwnedOrder = async (
  user: AuthUser,
  orderId: string,
): Promise<LocalOrder> => {
  if (getAuthMode() === "backend") {
    const response = await apiRequest<{ order: unknown }>(
      `/api/account/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: "POST" },
    );
    return mapBackendOrder(parseBackendOrder(response.data.order));
  }

  if (!areDevelopmentMocksEnabled) {
    throw new Error("لغو سفارش مرورگر در production مجاز نیست.");
  }
  return cancelOwnedMockOrder(orderId, user.mobile);
};

export const loadAccountAddresses = async (): Promise<BackendAddress[]> =>
  (await apiRequest<BackendAddress[]>("/api/account/addresses")).data;

export const createAccountAddress = async (
  input: BackendAddressInput,
): Promise<BackendAddress> =>
  (
    await apiRequest<{ address: BackendAddress }>("/api/account/addresses", {
      method: "POST",
      body: input,
    })
  ).data.address;

export const updateAccountAddress = async (
  addressId: string,
  input: BackendAddressInput,
): Promise<BackendAddress> =>
  (
    await apiRequest<{ address: BackendAddress }>(
      `/api/account/addresses/${encodeURIComponent(addressId)}`,
      { method: "PUT", body: input },
    )
  ).data.address;

export const deleteAccountAddress = async (addressId: string): Promise<void> => {
  await apiRequest<null>(
    `/api/account/addresses/${encodeURIComponent(addressId)}`,
    { method: "DELETE" },
  );
};

export const submitOrderReview = async ({
  orderId,
  orderItemId,
  rating,
  title,
  body,
}: {
  orderId: string;
  orderItemId: string;
  rating: number;
  title?: string;
  body?: string;
}) =>
  (
    await apiRequest<{
      review: { id: string; status: string; statusLabel: string };
    }>(`/api/account/orders/${encodeURIComponent(orderId)}/reviews`, {
      method: "POST",
      body: { orderItemId, rating, title, body },
    })
  ).data.review;
