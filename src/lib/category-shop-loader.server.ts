import { data, redirect, type LoaderFunctionArgs } from "react-router";
import { ApiError, isBackendEnabled } from "@/lib/api";
import {
  fetchCatalogDirectory,
  fetchCatalogProducts,
  type CatalogQuery,
} from "@/lib/catalog-api";
import {
  catalogLoaderKey,
  toPublicSsrResponse,
  type PublicSsrLoaderData,
} from "@/lib/public-ssr";
import { resolvePaginationUrlPolicy } from "@/lib/seo/url-policy";

const allowedSorts = new Set<CatalogQuery["sort"]>([
  "featured",
  "newest",
  "name",
  "price-asc",
  "price-desc",
]);

const parsePositivePage = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(10_000, parsed) : 1;
};

const notFound = () =>
  new ApiError({
    message: "Category not found.",
    status: 404,
    code: "resource_not_found",
  });

export const loadManagedCategoryShop = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  if (!isBackendEnabled) return {} satisfies PublicSsrLoaderData;
  const slug = params.slug?.trim();
  if (!slug) throw toPublicSsrResponse(notFound(), "Shop category");

  try {
    const directory = await fetchCatalogDirectory();
    const landing = directory.landings.find((item) => item.slug === slug);
    const backendCategory = directory.categories.find(
      (item) => item.slug === slug || item.slug === landing?.productCategorySlug,
    );

    if (!landing && !backendCategory) throw notFound();

    if (!landing && backendCategory) {
      const canonicalLanding = directory.landings.find(
        (item) =>
          item.productCategorySlug === backendCategory.slug &&
          !item.catalogSearch,
      );
      if (canonicalLanding && canonicalLanding.slug !== slug) {
        const requestUrl = new URL(request.url);
        return redirect(
          `/products/category/${encodeURIComponent(canonicalLanding.slug)}${requestUrl.search}`,
          301,
        );
      }
    }

    const url = new URL(request.url);
    const sortCandidate = url.searchParams.get("sort") as CatalogQuery["sort"];
    const shipping = url.searchParams.get("shipping") ?? "all";
    const query: CatalogQuery = {
      category: landing?.productCategorySlug ?? backendCategory?.slug,
      search:
        landing?.catalogSearch || url.searchParams.get("q")?.trim() || undefined,
      requiresCooling:
        shipping === "chilled"
          ? true
          : shipping === "nationwide"
            ? false
            : undefined,
      inStock: url.searchParams.get("stock") === "true" || undefined,
      sort: allowedSorts.has(sortCandidate) ? sortCandidate : "featured",
      page: parsePositivePage(url.searchParams.get("page")),
      perPage: 12,
    };
    const catalog = await fetchCatalogProducts(query);
    const policy = resolvePaginationUrlPolicy({
      pathname: url.pathname,
      searchParams: url.searchParams,
      totalPages: catalog.pagination.totalPages,
    });
    if (policy.redirectPath) return redirect(policy.redirectPath, 301);

    const payload: PublicSsrLoaderData = {
      catalogs: { [catalogLoaderKey(query)]: catalog },
      categories: directory.categories,
      categoryLandings: directory.landings,
    };

    return policy.noIndex
      ? data(payload, {
          headers: {
            "Cache-Control": "no-cache, must-revalidate",
            "X-Robots-Tag": policy.robots,
          },
        })
      : payload;
  } catch (error) {
    throw toPublicSsrResponse(error, "Shop category");
  }
};
