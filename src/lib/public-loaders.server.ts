import { data, redirect, type LoaderFunctionArgs } from "react-router";
import { getCategoryContent } from "@/data/categoriesContent";
import { ApiError, isBackendEnabled } from "@/lib/api";
import type { BackendPostDetail } from "@/lib/backend-contract";
import {
  fetchCatalogCategories,
  fetchCatalogProduct,
  fetchCatalogProducts,
  type CatalogPage,
  type CatalogQuery,
} from "@/lib/catalog-api";
import {
  loadCityPage,
  loadGallery,
  loadPost,
  loadPosts,
  loadProductReviews,
  loadReviewWall,
  type ProductReviewsResult,
} from "@/lib/content";
import {
  catalogLoaderKey,
  reportOptionalPublicSsrFailure,
  toPublicSsrResponse,
  type PublicSsrLoaderData,
} from "@/lib/public-ssr";
import { HOME_CHILLED_QUERY } from "@/lib/home-cold-gallery";
import {
  resolveBlogIndexability,
  resolveConditionalContentIndexability,
} from "@/lib/seo/content-indexability";
import {
  getContentTopicPath,
  normalizeContentTopic,
} from "@/lib/seo/content-topics";
import {
  collectPublishedContentTopics,
  loadRelatedPublishedPosts,
} from "@/lib/seo/content-topics.server";
import { getCityPagePath } from "@/lib/seo/local-seo";
import { collectPublishedCityPages } from "@/lib/seo/local-seo.server";
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
  const search =
    content?.catalogSearch || url.searchParams.get("q")?.trim() || undefined;

  return {
    category: resolveCatalogCategorySlug(slug),
    search,
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

const conditionalContentResponse = (
  payload: PublicSsrLoaderData,
  publishedContentCount: number,
) => {
  const indexability = resolveConditionalContentIndexability(
    publishedContentCount,
  );

  if (indexability.indexable) return payload;

  return data(payload, {
    headers: {
      "Cache-Control": "no-cache, must-revalidate",
      "X-Robots-Tag": indexability.robots,
    },
  });
};

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

const loadOptionalChilledCatalog = async (): Promise<
  CatalogPage | undefined
> => {
  try {
    return await fetchCatalogProducts(HOME_CHILLED_QUERY);
  } catch (error) {
    reportOptionalPublicSsrFailure(error, "Homepage chilled catalog");
    return undefined;
  }
};

export const loadHomePublicData = async (): Promise<PublicSsrLoaderData> => {
  if (!isBackendEnabled) return disabledData();
  const query: CatalogQuery = {};

  try {
    const [catalog, chilledCatalog, categories] = await Promise.all([
      fetchCatalogProducts(query),
      loadOptionalChilledCatalog(),
      fetchCatalogCategories(),
    ]);
    return {
      catalogs: {
        [catalogLoaderKey(query)]: catalog,
        ...(chilledCatalog
          ? { [catalogLoaderKey(HOME_CHILLED_QUERY)]: chilledCatalog }
          : {}),
      },
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
      const catalogSlug = resolveCatalogCategorySlug(slug);
      const backendCategory = categories.some(
        (category) => category.slug === catalogSlug,
      );
      if (!backendCategory) {
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
    throw toPublicSsrResponse(
      resourceNotFound("Product not found."),
      "Product",
    );
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
    const indexability = resolveBlogIndexability(
      posts.pagination?.total ?? posts.posts.length,
    );
    if (!indexability.indexable) {
      return data(
        { posts, contentTopics },
        {
          headers: {
            "Cache-Control": "no-cache, must-revalidate",
            "X-Robots-Tag": indexability.robots,
          },
        },
      );
    }
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

    return crawlResponse({ posts, contentTopics, contentTopic }, policy);
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
    throw toPublicSsrResponse(resourceNotFound("Post not found."), "Blog post");
  }

  try {
    const post = await loadPost(slug);
    const relatedPosts = await loadOptionalRelatedPosts(post);
    return { post, relatedPosts };
  } catch (error) {
    throw toPublicSsrResponse(error, "Blog post");
  }
};

export const loadReviewsPublicData = async () => {
  if (!isBackendEnabled) {
    return conditionalContentResponse({ reviewWall: undefined }, 0);
  }

  try {
    const reviewWall = await loadReviewWall();

    return conditionalContentResponse(
      { reviewWall },
      reviewWall.publishedReviewCount,
    );
  } catch (error) {
    throw toPublicSsrResponse(error, "Reviews");
  }
};

export const loadGalleryPublicData = async () => {
  if (!isBackendEnabled) {
    return conditionalContentResponse({ galleryItems: [] }, 0);
  }

  try {
    const galleryItems = await loadGallery();

    return conditionalContentResponse({ galleryItems }, galleryItems.length);
  } catch (error) {
    throw toPublicSsrResponse(error, "Gallery");
  }
};

export const loadLocationsPublicData =
  async (): Promise<PublicSsrLoaderData> => {
    if (!isBackendEnabled) return disabledData();

    try {
      const cities = await collectPublishedCityPages();
      if (!cities.length) throw resourceNotFound("Location pages not found.");
      return { cities };
    } catch (error) {
      throw toPublicSsrResponse(error, "Location pages");
    }
  };

export const loadCityPublicData = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<PublicSsrLoaderData | Response> => {
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
    const url = new URL(request.url);
    const canonicalPath = getCityPagePath(city.slug);
    if (url.pathname !== canonicalPath || url.search) {
      return redirect(canonicalPath, 301);
    }
    return {
      city,
      catalogs: { [catalogLoaderKey(catalogQuery)]: catalog },
    };
  } catch (error) {
    throw toPublicSsrResponse(error, "City page");
  }
};
