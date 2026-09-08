import { redirect } from "react-router";
import { ApiError, apiRequest, isBackendEnabled } from "@/lib/api";
import { parseStorefrontRedirectData } from "@/lib/seo/storefront-redirect-policy";

const unavailableResponse = () =>
  new Response("Redirect service unavailable", {
    status: 503,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Retry-After": "60",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });

export const isStorefrontNotFoundError = (error: unknown) =>
  (error instanceof ApiError && error.status === 404) ||
  (error instanceof Response && error.status === 404);

export const resolveStorefrontRedirect = async (
  request: Request,
): Promise<Response | null> => {
  if (!isBackendEnabled) return null;

  const pathname = new URL(request.url).pathname;
  let payload: unknown;

  try {
    const response = await apiRequest<unknown>(
      `/api/store/redirect?path=${encodeURIComponent(pathname)}`,
    );
    payload = response.data;
  } catch {
    throw unavailableResponse();
  }

  const resolution = parseStorefrontRedirectData(payload);
  if (resolution === null) {
    throw unavailableResponse();
  }

  if (!resolution.found || !resolution.location || !resolution.statusCode) {
    return null;
  }

  return redirect(resolution.location, resolution.statusCode);
};

export const resolveRedirectForNotFound = async (
  request: Request,
  error: unknown,
): Promise<Response | null> => {
  if (!isStorefrontNotFoundError(error)) return null;
  return resolveStorefrontRedirect(request);
};
