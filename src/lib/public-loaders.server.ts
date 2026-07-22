import { data, redirect, type LoaderFunctionArgs } from "react-router";
import { categoryContents, getCategoryContent } from "@/data/categoriesContent";
import { ApiError, isBackendEnabled } from "@/lib/api";
import type { BackendPostDetail } from "@/lib/backend-contract";
import {
  fetchCatalogCategories,
  fetchCatalogProduct,
  fetchCatalogProducts,
  type CatalogQuery,
} from "@/lib/catalog-api";
import {
  loadCityPage,
  loadPost,
  loadPosts,
  loadProductReviews,
  type ProductReviewsResult,
} from "@/lib/content";
import {
  catalogLoaderKey,
  reportOptionalPublicSsrFailure,
  toPublicSsrResponse,
  type PublicSsrLoaderData,
} from "@/lib/public-ssr";
import {
  getContentTopicPath,
  normalizeContentTopic,
} from "@/lib/seo/content-topics";
import {
  collectPublishedContentTopics,
  loadRelatedPublishedPosts,
} from "@/lib/seo/content-topics.server";
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

const resolveCatalogCategorySlug = (slug?: string) => {
  if (!slug) return undefined;
  const content = getCategoryContent(slug);
  return content?.productCategorySlug || slug;
};

const buildShopQuery = (request: Request, slug?: string): CatalogQuery => {
  const url = new URL(request.url);
  const sortCandidate = url.searchParams.get("sort") as CatalogQuery["sort"];
  const shipping = url.searchParams.get("shipping") ?? "all";
  const content = slug ? getCategoryContent(slug) : undefined;
  const search = content?.catalogSearch || url.searchParams.get("q")?.trim() || undefined;

  return {
    category: resolveCatalogCategorySlug(slug),
    search,
    requiresCooling:
      shipping === "chilled" ? true : shipping === "nationwide" ? false : undefined,
    inStock: url.searchParams.get("stock") === "true" || undefined,
    sort: allowedSorts.has(sortCandidate) ? sortCandidate : "featured",
    page: parsePositivePage(url.searchParams.get("page")),
    perPage: 12,
  };
};

const disabledData = (): PublicSsrLoaderData => ({});

const crawlResponse = (
  payload: PublicSsrLoaderData,
  policy: ReturnType<typeof resolvePaginationUrlPolicy>,
) =>
  data(payload, {
    headers: policy.noIndex
      ? {
          "Cache-Control": "no-cache, must-revalidate",
          "X-Robots-Tag": policy.robots,
        }
      : undefined,
  });

const resourceNotFound = (message: string) =>
  new ApiError({
    message,
    status: 404,
    code: "resource_not_found",
  });

const loadOptionalProductReviews = async (
  slug: string,
): Promise<ProductReviewsResult | undefined> => {
  try {
    return await loadProductReviews(slug, 1, 10);
  } catch (error) {
    reportOptionalPublicSsrFailure(error, "Product reviews");
    return undefined;
  }
};

const loadOptionalRelatedPosts = async (post: BackendPostDetail) => {
  try {
    return await loadRelatedPublishedPosts(post, 3);
  } catch (error) {
    reportOptionalPublicSsrFailure(error, "Related blog posts");
    return [];
  }
};

export const loadHomePublicData = async (): Promise<PublicSsrLoaderData> => {
  if (!isBackendEnabled) return disabledData();
  const query: CatalogQuery = {};

  try {
    const [catalog, categories] = await Promise.all([
      fetchCatalogProducts(query),
      fetchCatalogCategories(),
    ]);
    return {
      catalogs: { [catalogLoaderKey(query)]: catalog },
      categories,
    };
  } catch (error) {
    throw toPublicSsrResponse(error, "Homepage catalog");
  }
};

export const loadShopPublicData = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  if (!isBackendEnabled) return disabledData();
  const slug = params.slug;
  const query = buildShopQuery(request, slug);

  try {
    const [catalog, categories] = await Promise.all([
      fetchCatalogProducts(query),
      fetchCatalogCategories(),
    ]);

    if (slug) {
      const editorialCategory = categoryContents.some(
        (category) => category.slug === slug,
      );
      const catalogSlug = resolveCatalogCategorySlug(slug);
      const backendCategory = categories.some(
        (category) => category.slug === catalogSlug,
      );
      if (!editorialCategory && !backendCategory) {
        throw resourceNotFound("Category not found.");
      }
    }

    const requestUrl = new URL(request.url);
    const policy = resolvePaginationUrlPolicy({
      pathname: requestUrl.pathname,
      searchParams: requestUrl.searchParams,
      totalPages: catalog.pagination.totalPages,
    });
    if (policy.redirectPath) return redirect(policy.redirectPath, 301);

    return crawlResponse(
      {
        catalogs: { [catalogLoaderKey(query)]: catalog },
        categories,
      },
      policy,
    );
  } catch (error) {
    throw toPublicSsrResponse(error, "Shop catalog");
  }
};

export const loadProductPublicData = async ({
  params,
}: LoaderFunctionArgs): Promise<PublicSsrLoaderData> => {
  if (!isBackendEnabled) return disabledData();
  const slug = params.slug?.trim();
  if (!slug) {
    throw toPublicSsrResponse(resourceNotFound("Product not found."), "Product");
  }

  try {
    const [product, catalog, productReviews] = await Promise.all([
      fetchCatalogProduct(slug),
      fetchCatalogProducts(),
      loadOptionalProductReviews(slug),
    ]);
    return {
      product,
      productReviews,
      catalogs: { [catalogLoaderKey({})]: catalog },
    };
  } catch (error) {
    throw toPublicSsrResponse(error, "Product");
  }
};

export const loadBlogListPublicData = async ({
  request,
}: LoaderFunctionArgs) => {
  if (!isBackendEnabled) return disabledData();
  const url = new URL(request.url);
  const page = parsePositivePage(url.searchParams.get("page"));

  try {
    const [posts, contentTopics] = await Promise.all([
      loadPosts({ page, perPage: 12 }),
      collectPublishedContentTopics(),
    ]);
    const policy = resolvePaginationUrlPolicy({
      pathname: url.pathname,
      searchParams: url.searchParams,
      totalPages: posts.pagination?.totalPages,
    });
    if (policy.redirectPath) return redirect(policy.redirectPath, 301);
    return crawlResponse({ posts, contentTopics }, policy);
  } catch (error) {
    throw toPublicSsrResponse(error, "Blog");
  }
};

export const loadBlogTopicPublicData = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  if (!isBackendEnabled) return disabledData();
  const topic = normalizeContentTopic(params.topic);
  if (!topic) {
    throw toPublicSsrResponse(
      resourceNotFound("Content topic not found."),
      "Content topic",
    );
  }
  const topicPath = getContentTopicPath(topic);
  if (!topicPath) {
    throw toPublicSsrResponse(
      resourceNotFound("Content topic not found."),
      "Content topic",
    );
  }
  const url = new URL(request.url);
  const page = parsePositivePage(url.searchParams.get("page"));

  try {
    const [posts, contentTopics] = await Promise.all([
      loadPosts({ category: topic, page, perPage: 12 }),
      collectPublishedContentTopics(),
    ]);
    const contentTopic = contentTopics.find(
      (candidate) => candidate.name === topic,
    );
    if (!contentTopic) throw resourceNotFound("Content topic not found.");

    const policy = resolvePaginationUrlPolicy({
      pathname: contentTopic.path,
      searchParams: url.searchParams,
      totalPages: posts.pagination?.totalPages,
    });
    if (policy.redirectPath) return redirect(policy.redirectPath, 301);
    if (url.pathname !== contentTopic.path) {
      return redirect(policy.canonicalPath, 301);
    }

    return crawlResponse(
      { posts, contentTopics, contentTopic },
      policy,
    );
  } catch (error) {
    throw toPublicSsrResponse(error, "Content topic");
  }
};

export const loadBlogDetailPublicData = async ({
  params,
}: LoaderFunctionArgs): Promise<PublicSsrLoaderData> => {
  if (!isBackendEnabled) return disabledData();
  const slug = params.slug?.trim();
  if (!slug) {
    throw toPublicSsrResponse(
      resourceNotFound("Post not found."),
      "Blog post",
    );
  }

  try {
    const post = await loadPost(slug);
    const relatedPosts = await loadOptionalRelatedPosts(post);
    return { post, relatedPosts };
  } catch (error) {
    throw toPublicSsrResponse(error, "Blog post");
  }
};

export const loadCityPublicData = async ({
  params,
}: LoaderFunctionArgs): Promise<PublicSsrLoaderData> => {
  if (!isBackendEnabled) return disabledData();
  const slug = params.slug?.trim();
  if (!slug) {
    throw toPublicSsrResponse(
      resourceNotFound("City page not found."),
      "City page",
    );
  }
  const catalogQuery: CatalogQuery = { featured: true, perPage: 6 };

  try {
    const [city, catalog] = await Promise.all([
      loadCityPage(slug),
      fetchCatalogProducts(catalogQuery),
    ]);
    return {
      city,
      catalogs: { [catalogLoaderKey(catalogQuery)]: catalog },
    };
  } catch (error) {
    throw toPublicSsrResponse(error, "City page");
  }
};
