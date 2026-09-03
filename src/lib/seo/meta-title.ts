const normalizeMetaTitle = (value?: string | null) =>
  (value || "").replace(/\s+/g, " ").trim();

export const resolveMetaTitle = (
  title: string | undefined,
  brandName: string,
  fallback: string,
) => {
  const primary = normalizeMetaTitle(title);
  const safeBrandName = normalizeMetaTitle(brandName);
  const safeFallback = normalizeMetaTitle(fallback);

  if (!primary) return safeFallback;
  if (!safeBrandName) return primary;

  const normalizedPrimary = primary.toLocaleLowerCase();
  const normalizedBrandName = safeBrandName.toLocaleLowerCase();

  if (normalizedPrimary.includes(normalizedBrandName)) {
    return primary;
  }

  return `${primary} | ${safeBrandName}`;
};
