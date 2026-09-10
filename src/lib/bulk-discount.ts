const DEFAULT_MINIMUM_QUANTITY = 100;
const DEFAULT_PERCENT = 10;
const MAXIMUM_MINIMUM_QUANTITY = 1_000;
const MAXIMUM_CATEGORY_COUNT = 30;

export interface CookieBulkDiscountConfig {
  enabled: boolean;
  minimumQuantity: number;
  percent: number;
  categorySlugs: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const boundedInteger = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
};

const resolveCategorySlugs = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const unique = new Set<string>();
  for (const candidate of value.slice(0, MAXIMUM_CATEGORY_COUNT)) {
    if (typeof candidate !== "string") continue;
    const slug = candidate.trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) {
      continue;
    }
    unique.add(slug);
  }

  return [...unique];
};

export const resolveCookieBulkDiscount = (
  settings: Record<string, unknown> | undefined,
): CookieBulkDiscountConfig => {
  const pricing = isRecord(settings?.pricing) ? settings.pricing : undefined;
  const bulk = isRecord(pricing?.cookie_bulk_discount)
    ? pricing.cookie_bulk_discount
    : undefined;

  return {
    enabled: bulk?.enabled === true,
    minimumQuantity: boundedInteger(
      bulk?.min_quantity,
      DEFAULT_MINIMUM_QUANTITY,
      1,
      MAXIMUM_MINIMUM_QUANTITY,
    ),
    percent: boundedInteger(bulk?.percent, DEFAULT_PERCENT, 0, 100),
    categorySlugs: resolveCategorySlugs(bulk?.category_slugs),
  };
};

export const isCookieBulkDiscountEligibleCategory = (
  categorySlug: string | null | undefined,
  config: CookieBulkDiscountConfig,
) =>
  Boolean(
    config.enabled &&
      config.percent > 0 &&
      categorySlug &&
      config.categorySlugs.includes(categorySlug),
  );

export const getCookieBulkEligibleQuantity = (
  items: ReadonlyArray<{ quantity: number; categorySlug?: string }>,
  config: CookieBulkDiscountConfig,
) =>
  items.reduce(
    (total, item) =>
      isCookieBulkDiscountEligibleCategory(item.categorySlug, config)
        ? total + Math.max(0, Math.trunc(item.quantity))
        : total,
    0,
  );
