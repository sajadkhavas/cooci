import { ApiError, apiRequest, areDevelopmentMocksEnabled } from "@/lib/api";
import { getAuthMode, type AuthUser } from "@/lib/auth";
import type {
  BackendAddress,
  BackendAddressInput,
  BackendOrder,
} from "@/lib/backend-contract";
import {
  getOrderById,
  getOrdersByMobile,
  mapBackendOrder,
  type LocalOrder,
} from "@/lib/orders";

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

export const loadAccountOrders = async (
  user: AuthUser,
  page = 1,
): Promise<AccountOrdersResult> => {
  if (getAuthMode() === "backend") {
    const response = await apiRequest<BackendOrder[]>(
      `/api/account/orders?page=${page}&perPage=30`,
    );
    return {
      orders: response.data.map(mapBackendOrder),
      source: "backend",
      pagination: response.meta.pagination
        ? {
            page: response.meta.pagination.page,
            totalPages: response.meta.pagination.totalPages,
            total: response.meta.pagination.total,
            hasMore: response.meta.pagination.hasMore,
          }
        : undefined,
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
      const response = await apiRequest<{ order: BackendOrder }>(
        `/api/account/orders/${encodeURIComponent(orderId)}`,
      );
      return mapBackendOrder(response.data.order);
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

export const cancelOwnedOrder = async (orderId: string): Promise<LocalOrder> => {
  const response = await apiRequest<{ order: BackendOrder }>(
    `/api/account/orders/${encodeURIComponent(orderId)}/cancel`,
    { method: "POST" },
  );
  return mapBackendOrder(response.data.order);
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
