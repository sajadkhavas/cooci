import { useLocation, useMatches } from "react-router";
import { brandConfig } from "@/config/brand";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import { useCspNonce } from "@/lib/security/csp";
import {
  resolveCanonicalUrl,
  resolvePublicMediaUrl,
  serializeJsonLd,
} from "@/lib/security/seo";
import {
  createBrandGraphSchema,
  type JsonLdNode,
} from "@/lib/seo/brand-entity";
import { createProductMerchantSchema } from "@/lib/seo/product-merchant-schema";
import { resolvePaginationUrlPolicy } from "@/lib/seo/url-policy";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  previousUrl?: string;
  nextUrl?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  author?: string;
  schema?: object | object[];
  noIndex?: boolean;
  robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
}

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/;

const sanitizeSchemaNode = (schema: object) => {
  const cloned = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;
  const schemaType = cloned["@type"];

  if (schemaType === "Product" || schemaType === "Organization") {
    delete cloned.aggregateRating;
    delete cloned.review;
  }
  if (schemaType === "Product" && cloned.offers) {
    const offers = cloned.offers as Record<string, unknown>;
    delete offers.availability;
    cloned.offers = offers;
  }
  if (schemaType === "Article" || schemaType === "BlogPosting") {
    const published = cloned.datePublished;
    if (
      typeof published !== "string" ||
      !ISO_DATE_PATTERN.test(published) ||
      !Number.isFinite(Date.parse(published))
    ) {
      delete cloned.datePublished;
    }
  }
  return cloned;
};

const sanitizeSchema = (schema: object | object[] | undefined) => {
  if (!schema) return undefined;
  return Array.isArray(schema)
    ? schema.map((node) => sanitizeSchemaNode(node))
    : sanitizeSchemaNode(schema);
};

const getPaginationTotal = (
  pathname: string,
  matches: ReturnType<typeof useMatches>,
) => {
  const loaderData = [...matches]
    .reverse()
    .map((match) => match.data as PublicSsrLoaderData | undefined)
    .find((data) => data?.catalogs || data?.posts);

  if (pathname === "/blog" || pathname.startsWith("/blog/topic/")) {
    return loaderData?.posts?.pagination?.totalPages;
  }
  if (pathname === "/products" || pathname.startsWith("/products/category/")) {
    const catalogs = Object.values(loaderData?.catalogs || {});
    return catalogs[0]?.pagination.totalPages;
  }
  return undefined;
};

const getProductLoaderData = (matches: ReturnType<typeof useMatches>) =>
  [...matches]
    .reverse()
    .map((match) => match.data as PublicSsrLoaderData | undefined)
    .find((data) => data?.product);

export const SEO = ({
  title,
  description,
  image,
  url,
  previousUrl,
  nextUrl,
  type = "website",
  publishedTime,
  author,
  schema,
  noIndex = false,
  robots,
}: SEOProps) => {
  const location = useLocation();
  const matches = useMatches();
  const nonce = useCspNonce();
  const supportsPaginationPolicy =
    location.pathname === "/blog" ||
    location.pathname.startsWith("/blog/topic/") ||
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/category/");
  const paginationPolicy = supportsPaginationPolicy
    ? resolvePaginationUrlPolicy({
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        totalPages: getPaginationTotal(location.pathname, matches),
      })
    : undefined;
  const siteTitle = title
    ? title + " | " + brandConfig.brandName
    : brandConfig.defaultMeta.title;
  const siteDescription = description || brandConfig.defaultMeta.description;
  const siteImage = resolvePublicMediaUrl(
    image || brandConfig.defaultMeta.image,
    SITE_ORIGIN,
  );
  const siteUrl = resolveCanonicalUrl(
    url || paginationPolicy?.canonicalPath || location.pathname,
    SITE_ORIGIN,
  );
  const safePreviousUrl = previousUrl || paginationPolicy?.previousPath
    ? resolveCanonicalUrl(
        previousUrl || paginationPolicy?.previousPath || "/",
        SITE_ORIGIN,
      )
    : undefined;
  const safeNextUrl = nextUrl || paginationPolicy?.nextPath
    ? resolveCanonicalUrl(nextUrl || paginationPolicy?.nextPath || "/", SITE_ORIGIN)
    : undefined;
  const robotsContent =
    robots ||
    (paginationPolicy?.noIndex
      ? paginationPolicy.robots
      : noIndex
        ? "noindex,nofollow"
        : undefined);
  const safePublishedTime =
    publishedTime &&
    ISO_DATE_PATTERN.test(publishedTime) &&
    Number.isFinite(Date.parse(publishedTime))
      ? publishedTime
      : undefined;
  const productLoaderData = type === "product" ? getProductLoaderData(matches) : undefined;
  const authoritativeProductSchema = productLoaderData?.product
    ? createProductMerchantSchema({
        product: productLoaderData.product,
        reviews: productLoaderData.productReviews,
        siteOrigin: SITE_ORIGIN,
        brandName: brandConfig.brandName,
      })
    : undefined;
  const pageSchema =
    (authoritativeProductSchema as JsonLdNode | undefined) ||
    (sanitizeSchema(schema) as JsonLdNode | JsonLdNode[] | undefined);
  const serializedSchema = serializeJsonLd(
    createBrandGraphSchema({
      siteOrigin: SITE_ORIGIN,
      pageSchema,
    }),
  );

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      {safePreviousUrl && <link rel="prev" href={safePreviousUrl} />}
      {safeNextUrl && <link rel="next" href={safeNextUrl} />}
      {robotsContent && <meta name="robots" content={robotsContent} />}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content={brandConfig.brandName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      {type === "article" && safePublishedTime && (
        <meta property="article:published_time" content={safePublishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedSchema }}
      />
    </>
  );
};
