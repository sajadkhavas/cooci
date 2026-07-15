import type {
  ApiProduct,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatusResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/lib/api-contract";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured. Set VITE_API_BASE_URL when the backend is ready.", 0);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(payload?.message ?? "Request failed", response.status);
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  products: {
    list: () => request<ApiProduct[]>("/api/products"),
    bySlug: (slug: string) => request<ApiProduct>(`/api/products/${encodeURIComponent(slug)}`),
  },
  orders: {
    create: (payload: CreateOrderRequest) =>
      request<CreateOrderResponse>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    status: (orderId: string) =>
      request<OrderStatusResponse>(`/api/orders/${encodeURIComponent(orderId)}`),
  },
  payments: {
    verify: (payload: VerifyPaymentRequest) =>
      request<VerifyPaymentResponse>("/api/payments/verify", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};

export { ApiError, API_BASE_URL };
