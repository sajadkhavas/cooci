export const MIN_META_DESCRIPTION_LENGTH = 20;
export const MAX_META_DESCRIPTION_LENGTH = 320;

const normalizeMetaText = (value?: string | null) =>
  (value || "").replace(/\s+/g, " ").trim();

const truncateMetaText = (value: string) => {
  if (value.length <= MAX_META_DESCRIPTION_LENGTH) return value;
  return `${value.slice(0, MAX_META_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
};

export const resolveMetaDescription = (
  description: string | undefined,
  fallback: string,
) => {
  const primary = normalizeMetaText(description);
  const safeFallback = normalizeMetaText(fallback);

  if (primary.length >= MIN_META_DESCRIPTION_LENGTH) {
    return truncateMetaText(primary);
  }
  if (!primary) return truncateMetaText(safeFallback);
  if (!safeFallback || safeFallback === primary) return truncateMetaText(primary);

  const separator = /[.!?؟؛:]$/.test(primary) ? " " : "؛ ";
  return truncateMetaText(`${primary}${separator}${safeFallback}`);
};
