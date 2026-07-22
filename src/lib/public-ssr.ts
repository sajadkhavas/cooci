import type { HeadersArgs } from "react-router";
import type { Product } from "@/data/products";
import { ApiError } from "@/lib/api";
import type { BackendPostDetail } from "@/lib/backend-contract";
import type {
  CatalogCategory,
  CatalogPage,
  CatalogQuery,
} from "@/lib/catalog-api";
import type {
  ProductReviewsResult,
  StoreCityPage,
  StorePostsResult,
} from "@/lib/content";

export interface PublicSsrLoaderData {
  catalogs?: Record<string, CatalogPage>;
  categories?: CatalogCategory[];
  product?: Product;
  productReviews?: ProductReviewsResult;
  posts?: StorePostsResult;
  post?: BackendPostDetail;
  city?: StoreCityPage;
}

export const catalogLoaderKey = (query: CatalogQuery = {}) => {
  const normalized = Object.fromEntries(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== "")
      .sort(([first], [second]) => first.localeCompare(second)),
  );
  return JSON.stringify(normalized);
};

const hasHeaders = (headers: Headers | undefined) =>
  Boolean(headers && !headers.keys().next().done);

export const passPublicSsrHeaders = ({
  errorHeaders,
  loaderHeaders,
}: HeadersArgs): Headers => {
  const source = hasHeaders(errorHeaders) ? errorHeaders : loaderHeaders;
  const responseHeaders = new Headers();
  if (!source) return responseHeaders;

  for (const name of ["Cache-Control", "X-Robots-Tag", "Retry-After"]) {
    const value = source.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return responseHeaders;
};

const reportPublicSsrFailure = (error: unknown, resourceLabel: string) => {
  if (error instanceof ApiError) {
    console.error("Winimi public SSR loader failed", {
      resource: resourceLabel,
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      retryAfterSeconds: error.retryAfterSeconds,
      issues: error.errors?.issues,
    });
    return;
  }

  console.error("Winimi public SSR loader failed", {
    resource: resourceLabel,
    error: error instanceof Error ? error.message : String(error),
  });
};

export const reportOptionalPublicSsrFailure = (
  error: unknown,
  resourceLabel: string,
) => reportPublicSsrFailure(error, resourceLabel);

export const toPublicSsrResponse = (
  error: unknown,
  resourceLabel: string,
): Response => {
  reportPublicSsrFailure(error, resourceLabel);

  if (error instanceof ApiError && error.status === 404) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  });
  if (error instanceof ApiError && error.retryAfterSeconds !== undefined) {
    headers.set("Retry-After", String(error.retryAfterSeconds));
  }

  return new Response(`${resourceLabel} is temporarily unavailable.`, {
    status: 503,
    headers,
  });
};
