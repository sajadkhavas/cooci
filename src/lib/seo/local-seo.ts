import type { StoreCityPage } from "@/lib/content";
import { getBrandEntityIds, type JsonLdNode } from "@/lib/seo/brand-entity";

const canonicalUrl = (siteOrigin: string, path: string) =>
  new URL(path, `${getBrandEntityIds(siteOrigin).origin}/`).toString();

export const getCityPagePath = (slug: string) =>
  `/city/${encodeURIComponent(slug)}`;

export const createLocationsCollectionSchema = ({
  siteOrigin,
  cities,
  title,
  description,
}: {
  siteOrigin: string;
  cities: StoreCityPage[];
  title: string;
  description: string;
}): JsonLdNode[] => {
  const ids = getBrandEntityIds(siteOrigin);
  const pageUrl = canonicalUrl(siteOrigin, "/locations");
  const pageId = `${pageUrl}#webpage`;

  return [
    {
      "@type": "CollectionPage",
      "@id": pageId,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "fa-IR",
      isPartOf: { "@id": ids.website },
      about: cities.map((city) => ({
        "@type": "City",
        name: city.city,
      })),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: cities.length,
        itemListElement: cities.map((city, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: city.title,
          url: canonicalUrl(siteOrigin, getCityPagePath(city.slug)),
        })),
      },
    },
  ];
};

export const createCityLocalServiceSchema = ({
  siteOrigin,
  city,
}: {
  siteOrigin: string;
  city: StoreCityPage;
}): JsonLdNode[] => {
  const ids = getBrandEntityIds(siteOrigin);
  const pageUrl = canonicalUrl(siteOrigin, getCityPagePath(city.slug));
  const pageId = `${pageUrl}#webpage`;
  const serviceId = `${pageUrl}#service`;
  const placeId = `${pageUrl}#city`;

  return [
    {
      "@type": "WebPage",
      "@id": pageId,
      url: pageUrl,
      name: city.seo.title || city.title,
      description: city.seo.description || city.description,
      inLanguage: "fa-IR",
      isPartOf: { "@id": ids.website },
      about: { "@id": placeId },
      mainEntity: { "@id": serviceId },
    },
    {
      "@type": "City",
      "@id": placeId,
      name: city.city,
    },
    {
      "@type": "Service",
      "@id": serviceId,
      url: pageUrl,
      name: city.title,
      description: city.description,
      serviceType: "سفارش آنلاین و ارسال محصولات وینیمی",
      provider: { "@id": ids.organization },
      areaServed: { "@id": placeId },
      mainEntityOfPage: { "@id": pageId },
    },
  ];
};

export const createContactPageSchema = (siteOrigin: string): JsonLdNode[] => {
  const ids = getBrandEntityIds(siteOrigin);
  const pageUrl = canonicalUrl(siteOrigin, "/contact");
  return [
    {
      "@type": "ContactPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "تماس با وینیمی بیکری",
      inLanguage: "fa-IR",
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.organization },
    },
  ];
};

export const createAboutPageSchema = (siteOrigin: string): JsonLdNode[] => {
  const ids = getBrandEntityIds(siteOrigin);
  const pageUrl = canonicalUrl(siteOrigin, "/about");
  return [
    {
      "@type": "AboutPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "درباره وینیمی بیکری",
      inLanguage: "fa-IR",
      isPartOf: { "@id": ids.website },
      about: { "@id": ids.organization },
      mainEntity: { "@id": ids.organization },
    },
  ];
};
