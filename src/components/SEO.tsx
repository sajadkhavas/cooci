import { Helmet } from "react-helmet-async";
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
}

export const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  author,
  schema,
}: SEOProps) => {
  const siteTitle = title
    ? `${title} | ${brandConfig.brandName}`
    : brandConfig.defaultMeta.title;
  const siteDescription = description || brandConfig.defaultMeta.description;
  const siteImage = image || brandConfig.defaultMeta.image;
  const siteUrl = url || "";

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: brandConfig.brandName,
    description: brandConfig.tagline,
    telephone: brandConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: brandConfig.address,
      addressLocality: brandConfig.city,
      addressCountry: "IR",
    },
    openingHours: ["Sa-Th 09:00-21:00", "Fr 10:00-20:00"],
    sameAs: [brandConfig.instagramUrl],
    priceRange: "$$",
    servesCuisine: "Bakery",
  };

  return (
    <Helmet>
      <html lang="fa-IR" dir="rtl" />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content={brandConfig.brandName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
