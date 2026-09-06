const normalizeMetaTitle = (value?: string | null) =>
  (value || "").replace(/\s+/g, " ").trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTrailingBrand = (title: string, brandName: string) => {
  const trailingBrandPattern = new RegExp(
    `(?:\\s*\\|\\s*${escapeRegExp(brandName)})+$`,
    "iu",
  );

  if (!trailingBrandPattern.test(title)) return title;

  const unbrandedTitle = title.replace(trailingBrandPattern, "").trim();
  return unbrandedTitle ? `${unbrandedTitle} | ${brandName}` : brandName;
};

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

  const normalizedTrailingBrand = normalizeTrailingBrand(primary, safeBrandName);
  if (normalizedTrailingBrand !== primary) {
    return normalizedTrailingBrand;
  }

  const normalizedPrimary = primary.toLocaleLowerCase();
  const normalizedBrandName = safeBrandName.toLocaleLowerCase();

  if (normalizedPrimary.includes(normalizedBrandName)) {
    return primary;
  }

  return `${primary} | ${safeBrandName}`;
};
