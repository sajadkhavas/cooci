import { useLocation } from "react-router";
import { brandConfig } from "@/config/brand";
import { useCspNonce } from "@/lib/security/csp";
import {
  resolveCanonicalUrl,
  resolvePublicMediaUrl,
  serializeJsonLd,
} from "@/lib/security/seo";

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
  schema?: object;
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

const sanitizeSchema = (schema: object | undefined) => {
  if (!schema) return undefined;
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
  if (schemaType === "Article") {
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
  const nonce = useCspNonce();
  const siteTitle = title
    ? title + " | " + brandConfig.brandName
    : brandConfig.defaultMeta.title;
  const siteDescription = description || brandConfig.defaultMeta.description;
  const siteImage = resolvePublicMediaUrl(
    image || brandConfig.defaultMeta.image,
    SITE_ORIGIN,
  );
  const siteUrl = resolveCanonicalUrl(url || location.pathname, SITE_ORIGIN);
  const safePreviousUrl = previousUrl
    ? resolveCanonicalUrl(previousUrl, SITE_ORIGIN)
    : undefined;
  const safeNextUrl = nextUrl
    ? resolveCanonicalUrl(nextUrl, SITE_ORIGIN)
    : undefined;
  const robotsContent = robots || (noIndex ? "noindex,nofollow" : undefined);
  const safePublishedTime =
    publishedTime &&
    ISO_DATE_PATTERN.test(publishedTime) &&
    Number.isFinite(Date.parse(publishedTime))
      ? publishedTime
      : undefined;
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandConfig.brandName,
    alternateName: brandConfig.brandNameEn,
    url: brandConfig.website,
    description: brandConfig.defaultMeta.description,
    telephone: brandConfig.phone,
    email: brandConfig.email,
    sameAs: [brandConfig.instagramUrl],
  };
  const serializedSchema = serializeJsonLd(
    sanitizeSchema(schema) || defaultSchema,
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
