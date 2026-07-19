import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { brandConfig } from "@/config/brand";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  author?: string;
  schema?: object;
  noIndex?: boolean;
}

const SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;

const absoluteUrl = (value: string) => {
  if (!value) return SITE_ORIGIN;
  if (value.startsWith("http")) return value;
  return `${SITE_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

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
    if (typeof published !== "string" || !ISO_DATE_PATTERN.test(published)) {
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
  type = "website",
  publishedTime,
  author,
  schema,
  noIndex = false,
}: SEOProps) => {
  const location = useLocation();
  const siteTitle = title
    ? `${title} | ${brandConfig.brandName}`
    : brandConfig.defaultMeta.title;
  const siteDescription = description || brandConfig.defaultMeta.description;
  const siteImage = absoluteUrl(image || brandConfig.defaultMeta.image);
  const canonicalPath =
    url || `${location.pathname}${location.search && !noIndex ? location.search : ""}`;
  const siteUrl = absoluteUrl(canonicalPath);
  const safePublishedTime =
    publishedTime && ISO_DATE_PATTERN.test(publishedTime)
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

  const finalSchema = sanitizeSchema(schema) || defaultSchema;

  return (
    <Helmet>
      <html lang="fa-IR" dir="rtl" />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

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

      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};
