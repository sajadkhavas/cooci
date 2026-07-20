import {
  normalizeApiBaseUrl,
  resolveApiRequestUrl,
} from "@/lib/security/api-url";

export const EXPECTED_API_CONTRACT_VERSION = "2026-07-20-phase-16";
export const AUTH_SESSION_EXPIRED_EVENT = "winimi:auth-session-expired";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
let apiConfigurationError: string | undefined;
let normalizedApiBaseUrl = "";

try {
  normalizedApiBaseUrl = normalizeApiBaseUrl(RAW_API_BASE_URL, {
    development: import.meta.env.DEV,
  });
} catch (error) {
  apiConfigurationError =
    error instanceof Error ? error.message : "آدرس API وینیمی معتبر نیست.";
}

export const API_BASE_URL = normalizedApiBaseUrl;
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
  readonly retryAfterSeconds?: number;

  constructor({
    message,
    status,
    code,
    errors = {},
    requestId,
    retryAfterSeconds,
  }: {
    message: string;
    status: number;
    code: string;
    errors?: Record<string, unknown>;
    requestId?: string;
    retryAfterSeconds?: number;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "credentials" | "signal"> {
  body?: unknown;
  idempotencyKey?: string;
  timeoutMs?: number;
  skipCsrf?: boolean;
  signal?: AbortSignal;
  suppressAuthExpiryEvent?: boolean;
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
  if (apiConfigurationError) {
    throw new ApiError({
      message: apiConfigurationError,
      status: 0,
      code: "frontend_api_invalid_configuration",
    });
  }
  if (!API_BASE_URL) {
    throw new ApiError({
      message: "آدرس API وینیمی تنظیم نشده است.",
      status: 0,
      code: "frontend_api_not_configured",
    });
  }
};

const resolveRequestUrl = (path: string) => {
  assertConfigured();
  try {
    return resolveApiRequestUrl(API_BASE_URL, path);
  } catch (error) {
    throw new ApiError({
      message:
        error instanceof Error ? error.message : "مسیر درخواست API معتبر نیست.",
      status: 0,
      code: "frontend_api_invalid_path",
    });
  }
};

const isAbortError = (error: unknown) =>
  error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";

const createRequestController = (
  timeoutMs: number,
  externalSignal?: AbortSignal,
) => {
  const controller = new AbortController();
  let timedOut = false;
  let externallyAborted = false;

  const abortFromExternal = () => {
    externallyAborted = true;
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal?.aborted) abortFromExternal();
  else externalSignal?.addEventListener("abort", abortFromExternal, { once: true });

  const timeout = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  return {
    controller,
    timedOut: () => timedOut,
    externallyAborted: () => externallyAborted,
    cleanup: () => {
      globalThis.clearTimeout(timeout);
      externalSignal?.removeEventListener("abort", abortFromExternal);
    },
  };
};

const parseRetryAfterSeconds = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);

  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - Date.now()) / 1_000));
};

const fallbackCodeForStatus = (status: number) => {
  if (status === 401) return "authentication_required";
  if (status === 403) return "forbidden";
  if (status === 404) return "resource_not_found";
  if (status === 419) return "csrf_token_mismatch";
  if (status === 422) return "validation_failed";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server_error";
  return "request_failed";
};

const notifyAuthExpired = (error: ApiError, path: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { path, requestId: error.requestId },
    }),
  );
};

export const ensureSanctumCsrf = async (force = false): Promise<void> => {
  assertConfigured();
  if (csrfBootstrap) return csrfBootstrap;
  if (!force && getCookie("XSRF-TOKEN")) return;

  csrfBootstrap = (async () => {
    const request = createRequestController(15_000);
    try {
      const response = await fetch(resolveRequestUrl("/sanctum/csrf-cookie"), {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Request-ID": randomRequestId(),
        },
        signal: request.controller.signal,
      });
      if (!response.ok && response.status !== 204) {
        throw new ApiError({
          message: "امکان آماده‌سازی نشست امن وجود ندارد.",
          status: response.status,
          code: "csrf_bootstrap_failed",
          retryAfterSeconds: parseRetryAfterSeconds(
            response.headers.get("Retry-After"),
          ),
        });
      }
    } catch (error) {
      if (isAbortError(error)) {
        throw new ApiError({
          message: "زمان آماده‌سازی نشست امن تمام شد.",
          status: 0,
          code: "request_timeout",
        });
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError({
        message: "ارتباط با سرور برای آماده‌سازی نشست امن برقرار نشد.",
        status: 0,
        code: "network_error",
      });
    } finally {
      request.cleanup();
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
      code: errorPayload?.code || fallbackCodeForStatus(response.status),
      errors: errorPayload?.errors || {},
      requestId:
        typeof errorPayload?.meta?.requestId === "string"
          ? errorPayload.meta.requestId
          : response.headers.get("X-Request-ID") || undefined,
      retryAfterSeconds: parseRetryAfterSeconds(
        response.headers.get("Retry-After"),
      ),
    });
  }

  if (!isSuccessEnvelope<T>(payload)) {
    throw new ApiError({
      message: "ساختار پاسخ سرور معتبر نیست.",
      status: response.status,
      code: "invalid_api_envelope",
      requestId: response.headers.get("X-Request-ID") || undefined,
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
  const method = (options.method || "GET").toUpperCase();
  const requestId = randomRequestId();
  const {
    body: rawBody,
    idempotencyKey,
    timeoutMs = 20_000,
    skipCsrf: _skipCsrf,
    suppressAuthExpiryEvent: _suppressAuthExpiryEvent,
    signal: externalSignal,
    ...requestInit
  } = options;
  const request = createRequestController(timeoutMs, externalSignal);
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Request-ID", requestId);

  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);

  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken && isMutationMethod(method)) {
    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  let body: BodyInit | undefined;
  if (rawBody !== undefined) {
    if (
      typeof rawBody === "string" ||
      rawBody instanceof FormData ||
      rawBody instanceof URLSearchParams ||
      rawBody instanceof Blob
    ) {
      body = rawBody;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(rawBody);
    }
  }

  try {
    const response = await fetch(resolveRequestUrl(path), {
      ...requestInit,
      method,
      body,
      headers,
      credentials: "include",
      signal: request.controller.signal,
    });
    return await parseEnvelope<T>(response);
  } catch (error) {
    if (isAbortError(error)) {
      if (request.externallyAborted() && !request.timedOut()) {
        throw new ApiError({
          message: "درخواست لغو شد.",
          status: 0,
          code: "request_aborted",
          requestId,
        });
      }
      throw new ApiError({
        message: "زمان پاسخ‌گویی سرور تمام شد؛ دوباره تلاش کنید.",
        status: 0,
        code: "request_timeout",
        requestId,
      });
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      message: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.",
      status: 0,
      code: "network_error",
      requestId,
    });
  } finally {
    request.cleanup();
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
    let finalError = error;

    if (
      mutation &&
      !options.skipCsrf &&
      error instanceof ApiError &&
      error.status === 419
    ) {
      try {
        await ensureSanctumCsrf(true);
        return await requestOnce<T>(path, options);
      } catch (retryError) {
        finalError = retryError;
      }
    }

    if (
      finalError instanceof ApiError &&
      finalError.status === 401 &&
      !options.suppressAuthExpiryEvent
    ) {
      notifyAuthExpired(finalError, path);
    }

    throw finalError;
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
