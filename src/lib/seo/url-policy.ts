export const PRIVATE_INDEX_PREFIXES = [
  "/account",
  "/cart",
  "/checkout",
  "/payment",
] as const;

export const CRAWLABLE_STATIC_PATHS = [
  "/",
  "/products",
  "/blog",
  "/gift",
  "/corporate",
  "/reviews",
  "/gallery",
  "/faq",
  "/contact",
] as const;

export const MANAGED_CONTENT_PATHS = [
  { path: "/about", slug: "about" },
  { path: "/quality", slug: "quality" },
  { path: "/shipping", slug: "shipping" },
  { path: "/privacy", slug: "privacy" },
  { path: "/terms", slug: "terms" },
] as const;

export const PUBLIC_CITY_SLUGS = ["tehran", "karaj", "andisheh"] as const;

export const LEGACY_EXACT_REDIRECTS = new Map<string, string>([
  ["/categories", "/products"],
]);

const MAX_PUBLIC_PAGE = 10_000;

export interface PaginationUrlPolicy {
  canonicalPath: string;
  noIndex: boolean;
  robots: "index,follow" | "noindex,follow";
  previousPath?: string;
  nextPath?: string;
  redirectPath?: string;
  page: number;
}

const normalizePathname = (pathname: string) => {
  const trimmed = pathname.trim();
  if (!trimmed || !trimmed.startsWith("/")) return "/";
  if (trimmed === "/") return "/";
  return trimmed.replace(/\/+$/, "");
};

const pathWithPage = (pathname: string, page: number) =>
  page <= 1 ? pathname : `${pathname}?page=${page}`;

const parsePageState = (rawValue: string | null) => {
  if (rawValue === null) {
    return { page: 1, canonical: true };
  }

  if (!/^[1-9]\d*$/.test(rawValue)) {
    return { page: 1, canonical: false };
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isSafeInteger(parsed)) {
    return { page: MAX_PUBLIC_PAGE, canonical: false };
  }

  const page = Math.min(MAX_PUBLIC_PAGE, parsed);
  return {
    page,
    canonical: rawValue === String(page) && page > 1,
  };
};

export const resolvePaginationUrlPolicy = ({
  pathname,
  searchParams,
  totalPages,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  totalPages?: number;
}): PaginationUrlPolicy => {
  const cleanPathname = normalizePathname(pathname);
  const pageState = parsePageState(searchParams.get("page"));
  const hasNonPageParams = Array.from(searchParams.keys()).some(
    (key) => key !== "page",
  );
  const safeTotalPages =
    typeof totalPages === "number" && Number.isFinite(totalPages)
      ? Math.max(1, Math.trunc(totalPages))
      : undefined;
  const boundedPage = safeTotalPages
    ? Math.min(pageState.page, safeTotalPages)
    : pageState.page;
  const canonicalPath = pathWithPage(
    cleanPathname,
    hasNonPageParams ? 1 : boundedPage,
  );

  let redirectPath: string | undefined;
  if (!hasNonPageParams) {
    const requestedCanonicalPath = pathWithPage(cleanPathname, pageState.page);
    if (!pageState.canonical && searchParams.has("page")) {
      redirectPath = requestedCanonicalPath;
    }
    if (safeTotalPages && pageState.page > safeTotalPages) {
      redirectPath = pathWithPage(cleanPathname, safeTotalPages);
    }
  }

  const noIndex = hasNonPageParams;
  const previousPath =
    !noIndex && boundedPage > 1
      ? pathWithPage(cleanPathname, boundedPage - 1)
      : undefined;
  const nextPath =
    !noIndex && safeTotalPages && boundedPage < safeTotalPages
      ? pathWithPage(cleanPathname, boundedPage + 1)
      : undefined;

  return {
    canonicalPath,
    noIndex,
    robots: noIndex ? "noindex,follow" : "index,follow",
    previousPath,
    nextPath,
    redirectPath:
      redirectPath && redirectPath !== `${cleanPathname}${searchParams.size ? `?${searchParams}` : ""}`
        ? redirectPath
        : undefined,
    page: boundedPage,
  };
};

export const getLegacyRedirectTarget = (pathname: string) =>
  LEGACY_EXACT_REDIRECTS.get(normalizePathname(pathname));

export const isPrivateIndexPath = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return PRIVATE_INDEX_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
};

export const createRobotsText = (siteOrigin: string) => {
  const origin = new URL(siteOrigin).origin;
  return [
    "User-agent: *",
    "Allow: /",
    ...PRIVATE_INDEX_PREFIXES.map((prefix) => `Disallow: ${prefix}`),
    "Disallow: /__ssr_health",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
};
