import { brandConfig } from "@/config/brand";
import { resolvePublicMediaUrl } from "@/lib/security/seo";

export type JsonLdNode = Record<string, unknown>;

const normalizeOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
};

const toInternationalPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("0")) return `+98${digits.slice(1)}`;
  return digits ? `+98${digits}` : undefined;
};

export const getBrandEntityIds = (siteOrigin: string) => {
  const origin = normalizeOrigin(siteOrigin);
  return {
    origin,
    organization: `${origin}/#organization`,
    website: `${origin}/#website`,
  };
};

export const createBrandOrganizationEntity = (
  siteOrigin: string,
): JsonLdNode => {
  const ids = getBrandEntityIds(siteOrigin);
  const telephone = toInternationalPhone(brandConfig.phoneClean);

  return {
    "@type": "Organization",
    "@id": ids.organization,
    name: brandConfig.brandName,
    alternateName: brandConfig.brandNameEn,
    url: ids.origin,
    description: brandConfig.defaultMeta.description,
    logo: {
      "@type": "ImageObject",
      url: resolvePublicMediaUrl(brandConfig.logoPath, ids.origin),
    },
    ...(telephone ? { telephone } : {}),
    email: brandConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: brandConfig.city,
      addressRegion: brandConfig.region,
      addressCountry: "IR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(telephone ? { telephone } : {}),
      email: brandConfig.email,
      availableLanguage: ["fa"],
    },
    sameAs: [brandConfig.instagramUrl],
  };
};

export const createBrandWebsiteEntity = (siteOrigin: string): JsonLdNode => {
  const ids = getBrandEntityIds(siteOrigin);
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: ids.origin,
    name: brandConfig.brandName,
    alternateName: brandConfig.brandNameEn,
    inLanguage: "fa-IR",
    publisher: { "@id": ids.organization },
  };
};

const flattenSchemaNodes = (
  schema?: JsonLdNode | JsonLdNode[],
): JsonLdNode[] => {
  if (!schema) return [];
  const candidates = Array.isArray(schema) ? schema : [schema];
  return candidates.flatMap((candidate) => {
    const copy = { ...candidate };
    delete copy["@context"];
    const graph = copy["@graph"];
    if (Array.isArray(graph)) {
      return graph.filter(
        (node): node is JsonLdNode =>
          Boolean(node) && typeof node === "object" && !Array.isArray(node),
      );
    }
    delete copy["@graph"];
    return [copy];
  });
};

export const createBrandGraphSchema = ({
  siteOrigin,
  pageSchema,
}: {
  siteOrigin: string;
  pageSchema?: JsonLdNode | JsonLdNode[];
}) => {
  const nodes = [
    createBrandOrganizationEntity(siteOrigin),
    createBrandWebsiteEntity(siteOrigin),
    ...flattenSchemaNodes(pageSchema),
  ];
  const seenIds = new Set<string>();
  const graph = nodes.filter((node) => {
    const id = node["@id"];
    if (typeof id !== "string") return true;
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
