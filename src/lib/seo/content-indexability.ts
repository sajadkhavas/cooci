export interface BlogIndexabilityPolicy {
  indexable: boolean;
  robots: "index,follow" | "noindex,follow";
  includeInSitemap: boolean;
}

const normalizePublishedPostCount = (
  value: number | null | undefined,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
};

export const resolveBlogIndexability = (
  publishedPostCount: number | null | undefined,
): BlogIndexabilityPolicy => {
  const indexable = normalizePublishedPostCount(publishedPostCount) > 0;

  return {
    indexable,
    robots: indexable ? "index,follow" : "noindex,follow",
    includeInSitemap: indexable,
  };
};
