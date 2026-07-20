export const EXPECTED_API_CONTRACT_VERSION = "2026-07-20-phase-16";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const isBackendEnabled = import.meta.env.VITE_USE_BACKEND === "true";
export const areDevelopmentMocksEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ALLOW_DEV_MOCKS === "true";

export interface ApiMeta {
  requestId?: string;
  apiVersion: string;
  contractVersion: string;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    from: number | null;
    to: number | null;
    hasMore: boolean;
  };
  [key: string]: unknown;
}

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message?: string;
  meta: ApiMeta;
}

interface ApiErrorEnvelope {
  success: false;
  code: string;
  message: string;
  errors: Record<string, unknown>;
  meta?: Partial<ApiMeta>;
}

export interface ApiResult<T> {
  data: T;
  meta: ApiMeta;
  message?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: Record<string, unknown>;
  readonly requestId?: string;

  constructor({
    message,
    status,
    code,
    errors = {},
    requestId,
  }: {
    message: string;
    status: number;
    code: string;
    errors?: Record<string, unknown>;
    requestId?: string;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
  }
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "credentials" | "signal"> {
  body?: unknown;
  idempotencyKey?: string;
  timeoutMs?: number;
  skipCsrf?: boolean;
}

let csrfBootstrap: Promise<void> | null = null;

const randomRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export const createIdempotencyKey = (prefix = "WEB") => {
  const random = randomRequestId().replaceAll("-", "");
  return `${prefix}-${random}`.slice(0, 120);
};

const isMutationMethod = (method?: string) =>
  !["GET", "HEAD", "OPTIONS"].includes((method || "GET").toUpperCase());

const getCookie = (name: string) => {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  return value ? decodeURIComponent(value) : undefined;
};

const assertConfigured = () => {
  if (!API_BASE_URL) {
    throw new ApiError({
      message: "آدرس API وینیمی تنظیم نشده است.",
      status: 0,
      code: "frontend_api_not_configured",
    });
  }
};

const createTimeoutSignal = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
};

export const ensureSanctumCsrf = async (force = false): Promise<void> => {
  assertConfigured();
  if (!force && getCookie("XSRF-TOKEN")) return;
  if (!force && csrfBootstrap) return csrfBootstrap;

  csrfBootstrap = (async () => {
    const { controller, timeout } = createTimeoutSignal(15_000);
    try {
      const response = await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Request-ID": randomRequestId(),
        },
        signal: controller.signal,
      });
      if (!response.ok && response.status !== 204) {
        throw new ApiError({
          message: "امکان آماده‌سازی نشست امن وجود ندارد.",
          status: response.status,
          code: "csrf_bootstrap_failed",
        });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError({
          message: "زمان آماده‌سازی نشست امن تمام شد.",
          status: 0,
          code: "request_timeout",
        });
      }
      throw error;
    } finally {
      globalThis.clearTimeout(timeout);
      csrfBootstrap = null;
    }
  })();

  return csrfBootstrap;
};

const isErrorEnvelope = (value: unknown): value is ApiErrorEnvelope => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ApiErrorEnvelope>;
  return candidate.success === false && typeof candidate.message === "string";
};

const isSuccessEnvelope = <T>(value: unknown): value is ApiSuccessEnvelope<T> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ApiSuccessEnvelope<T>>;
  return candidate.success === true && Boolean(candidate.meta);
};

const parseEnvelope = async <T>(response: Response): Promise<ApiResult<T>> => {
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok || isErrorEnvelope(payload)) {
    const errorPayload = isErrorEnvelope(payload) ? payload : null;
    throw new ApiError({
      message: errorPayload?.message || "درخواست به سرور وینیمی ناموفق بود.",
      status: response.status,
      code:
        errorPayload?.code ||
        (response.status === 401
          ? "authentication_required"
          : response.status === 422
            ? "validation_failed"
            : "request_failed"),
      errors: errorPayload?.errors || {},
      requestId:
        typeof errorPayload?.meta?.requestId === "string"
          ? errorPayload.meta.requestId
          : response.headers.get("X-Request-ID") || undefined,
    });
  }

  if (!isSuccessEnvelope<T>(payload)) {
    throw new ApiError({
      message: "ساختار پاسخ سرور معتبر نیست.",
      status: response.status,
      code: "invalid_api_envelope",
    });
  }

  if (payload.meta.contractVersion !== EXPECTED_API_CONTRACT_VERSION) {
    throw new ApiError({
      message: "نسخه قرارداد فرانت و بک‌اند یکسان نیست.",
      status: response.status,
      code: "api_contract_mismatch",
      requestId: payload.meta.requestId,
    });
  }

  return {
    data: payload.data,
    meta: payload.meta,
    message: payload.message,
  };
};

const requestOnce = async <T>(
  path: string,
  options: ApiRequestOptions,
): Promise<ApiResult<T>> => {
  assertConfigured();
  const method = (options.method || "GET").toUpperCase();
  const requestId = randomRequestId();
  const { controller, timeout } = createTimeoutSignal(options.timeoutMs ?? 20_000);
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Request-ID", requestId);

  if (options.idempotencyKey) {
    headers.set("Idempotency-Key", options.idempotencyKey);
  }

  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken && isMutationMethod(method)) {
    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (
      typeof options.body === "string" ||
      options.body instanceof FormData ||
      options.body instanceof URLSearchParams ||
      options.body instanceof Blob
    ) {
      body = options.body;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      body,
      headers,
      credentials: "include",
      signal: controller.signal,
    });
    return await parseEnvelope<T>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        message: "زمان پاسخ‌گویی سرور تمام شد؛ دوباره تلاش کنید.",
        status: 0,
        code: "request_timeout",
        requestId,
      });
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResult<T>> => {
  const mutation = isMutationMethod(options.method);
  if (mutation && !options.skipCsrf) await ensureSanctumCsrf();

  try {
    return await requestOnce<T>(path, options);
  } catch (error) {
    if (
      mutation &&
      !options.skipCsrf &&
      error instanceof ApiError &&
      error.status === 419
    ) {
      await ensureSanctumCsrf(true);
      return requestOnce<T>(path, options);
    }
    throw error;
  }
};

export const apiData = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => (await apiRequest<T>(path, options)).data;

export const getFrontendDataMode = (): "backend" | "mock" | "disabled" => {
  if (isBackendEnabled) return "backend";
  if (areDevelopmentMocksEnabled) return "mock";
  return "disabled";
};
