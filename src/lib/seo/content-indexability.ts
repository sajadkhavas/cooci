export interface ConditionalContentIndexabilityPolicy {
  indexable: boolean;
  robots: "index,follow" | "noindex,follow";
  includeInSitemap: boolean;
}

const normalizePublishedContentCount = (value: number | null | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
};

export const resolveConditionalContentIndexability = (
  publishedContentCount: number | null | undefined,
): ConditionalContentIndexabilityPolicy => {
  const indexable = normalizePublishedContentCount(publishedContentCount) > 0;

  return {
    indexable,
    robots: indexable ? "index,follow" : "noindex,follow",
    includeInSitemap: indexable,
  };
};

export const resolveBlogIndexability = (
  publishedPostCount: number | null | undefined,
): ConditionalContentIndexabilityPolicy =>
  resolveConditionalContentIndexability(publishedPostCount);
