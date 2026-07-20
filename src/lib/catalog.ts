import type { Product } from "@/data/products";

export type CatalogSort = "featured" | "newest" | "price-asc" | "price-desc";
export type ShippingFilter = "all" | "nationwide" | "chilled";

export const CATALOG_PAGE_SIZE = 12;

interface ProductVerificationFlags {
  inventoryVerified?: boolean;
  contentVerified?: boolean;
  mediaVerified?: boolean;
  updatedAt?: string;
}

type ProductVariant = NonNullable<Product["variants"]>[number];
type ProductVariantPricing = ProductVariant & {
  stock?: number;
  regularPriceToman?: number;
  salePriceToman?: number;
  available?: boolean;
  isDefault?: boolean;
};

const PERSIAN_NORMALIZATION_MAP: Record<string, string> = {
  ي: "ی",
  ى: "ی",
  ك: "ک",
  ة: "ه",
  ۀ: "ه",
};

const FACTUAL_BADGE_PATTERNS = [
  /کیلویی/,
  /بدون قند افزوده/,
  /نیازمند نگهداری سرد/,
];

const getVerificationFlags = (product: Product) =>
  product as Product & ProductVerificationFlags;

const isFinitePositive = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const getComparableUpdatedAt = (product: Product) => {
  const updatedAt = getVerificationFlags(product).updatedAt;
  if (!updatedAt) return 0;
  const timestamp = Date.parse(updatedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const isProductInventoryVerified = (product: Product) =>
  getVerificationFlags(product).inventoryVerified === true;

export const isProductContentVerified = (product: Product) =>
  getVerificationFlags(product).contentVerified === true;

export const isProductMediaVerified = (product: Product) =>
  getVerificationFlags(product).mediaVerified === true;

export const getPublicProductBadges = (product: Product) => {
  if (isProductContentVerified(product)) return product.badges;
  return product.badges.filter((badge) =>
    FACTUAL_BADGE_PATTERNS.some((pattern) => pattern.test(badge)),
  );
};

export const getPublicProductDescription = (product: Product) => {
  if (isProductContentVerified(product)) return product.longDescription;

  const priceSentence = getProductDisplayPrice(product)
    ? "قیمت فعلی این انتخاب در همین صفحه نمایش داده می‌شود."
    : "قیمت این انتخاب نیازمند استعلام است.";

  return `${product.name} در دسته ${product.category} قرار دارد. ${priceSentence} جزئیات ترکیبات، آلرژن، وزن نهایی، ماندگاری و زمان آماده‌سازی باید پیش از تأیید سفارش از منبع معتبر بررسی شوند.`;
};

export const getPublicProductSummary = (product: Product) => {
  if (isProductContentVerified(product) && product.shortDescription.trim()) {
    return product.shortDescription;
  }

  return `${product.name}؛ قیمت و موجودی نهایی هنگام ثبت سفارش دوباره توسط سرور بررسی می‌شود.`;
};

export const getPublicIngredients = (product: Product) =>
  isProductContentVerified(product) ? product.ingredients : [];

export const getPublicAllergens = (product: Product) =>
  isProductContentVerified(product) ? product.allergens : [];

export const getPublicShelfLife = (product: Product) =>
  isProductContentVerified(product)
    ? product.shelfLife
    : "مدت دقیق ماندگاری پس از تأیید محصول و روی بسته‌بندی سفارش اعلام می‌شود.";

export const getPublicStorageTips = (product: Product) =>
  isProductContentVerified(product)
    ? product.storageTips
    : product.requiresCooling
      ? "تا زمان تأیید دستور اختصاصی محصول، نگهداری سرد و پیروی از برچسب بسته‌بندی الزامی است."
      : "پس از تحویل، دستور درج‌شده روی بسته‌بندی را مبنا قرار دهید.";

export const normalizeCatalogText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("fa-IR")
    .replace(
      /[يىكةۀ]/g,
      (character) => PERSIAN_NORMALIZATION_MAP[character] ?? character,
    )
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ");

export const getVariantCurrentPrice = (variant?: ProductVariant) =>
  variant && isFinitePositive(variant.price) ? variant.price : undefined;

export const getVariantRegularPrice = (variant?: ProductVariant) => {
  if (!variant) return undefined;
  const pricing = variant as ProductVariantPricing;
  return isFinitePositive(pricing.regularPriceToman)
    ? pricing.regularPriceToman
    : getVariantCurrentPrice(variant);
};

export const getVariantSalePrice = (variant?: ProductVariant) => {
  if (!variant) return undefined;
  const pricing = variant as ProductVariantPricing;
  const regularPrice = getVariantRegularPrice(variant);
  const salePrice = pricing.salePriceToman;

  if (
    !isFinitePositive(regularPrice) ||
    !isFinitePositive(salePrice) ||
    salePrice >= regularPrice
  ) {
    return undefined;
  }

  return salePrice;
};

export const getVariantDisplayPrice = (variant?: ProductVariant) =>
  getVariantSalePrice(variant) ?? getVariantCurrentPrice(variant);

export const getVariantPrices = (product: Product) =>
  product.variants
    ?.map((variant) => getVariantDisplayPrice(variant))
    .filter((price): price is number => isFinitePositive(price)) ?? [];

export const getProductRegularPrice = (product: Product) => {
  if (isFinitePositive(product.priceToman)) return product.priceToman;
  if (isFinitePositive(product.price)) return product.price;

  const variantPrices = product.variants
    ?.map((variant) => getVariantRegularPrice(variant))
    .filter((price): price is number => isFinitePositive(price)) ?? [];
  return variantPrices.length ? Math.min(...variantPrices) : undefined;
};

export const getProductSalePrice = (product: Product) => {
  const regularPrice = getProductRegularPrice(product);
  const salePrice = product.salePriceToman;

  if (
    !isFinitePositive(regularPrice) ||
    !isFinitePositive(salePrice) ||
    salePrice >= regularPrice
  ) {
    return undefined;
  }

  return salePrice;
};

export const getProductDisplayPrice = (product: Product) =>
  getProductSalePrice(product) ??
  (isFinitePositive(product.price) ? product.price : getProductRegularPrice(product));

export const getProductPriceRange = (product: Product) => {
  const variantPrices = getVariantPrices(product);

  if (!variantPrices.length) {
    const price = getProductDisplayPrice(product);
    return { min: price, max: price };
  }

  return {
    min: Math.min(...variantPrices),
    max: Math.max(...variantPrices),
  };
};

export const getDiscountPercent = (product: Product) => {
  const regularPrice = getProductRegularPrice(product);
  const salePrice = getProductSalePrice(product);

  if (!regularPrice || !salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

export const getVariantDiscountPercent = (variant?: ProductVariant) => {
  const regularPrice = getVariantRegularPrice(variant);
  const salePrice = getVariantSalePrice(variant);
  if (!regularPrice || !salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

export const getProductStock = (
  product: Product,
  variantId?: string | null,
) => {
  const variant = product.variants?.find((item) => item.id === variantId);
  const variantStock = (variant as ProductVariantPricing | undefined)?.stock;

  if (typeof variantStock === "number" && Number.isFinite(variantStock)) {
    return Math.max(0, Math.floor(variantStock));
  }
  if (typeof product.stock === "number" && Number.isFinite(product.stock)) {
    return Math.max(0, Math.floor(product.stock));
  }
  return 0;
};

export const isProductInStock = (
  product: Product,
  variantId?: string | null,
) => getProductStock(product, variantId) > 0;

export const getStockPresentation = (
  stock: number,
  inventoryVerified = false,
) => {
  if (!inventoryVerified) {
    return {
      label: "موجودی نهایی هنگام ثبت سفارش توسط بک‌اند بررسی می‌شود",
      tone: "warning" as const,
    };
  }

  if (stock <= 0) {
    return { label: "ناموجود", tone: "danger" as const };
  }

  if (stock <= 5) {
    return {
      label: `فقط ${stock.toLocaleString("fa-IR")} عدد باقی مانده`,
      tone: "warning" as const,
    };
  }

  return { label: "موجود و آماده سفارش", tone: "success" as const };
};

export const productMatchesQuery = (product: Product, rawQuery: string) => {
  const query = normalizeCatalogText(rawQuery);
  if (!query) return true;

  const searchableText = normalizeCatalogText(
    [
      product.name,
      product.shortDescription,
      product.productCode,
      product.category,
      product.weight,
      ...(product.tags ?? []),
      ...(product.flavors ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );

  return query.split(" ").every((term) => searchableText.includes(term));
};

interface FilterCatalogOptions {
  products: Product[];
  category: string;
  query: string;
  shipping: ShippingFilter;
  dietOnly: boolean;
  inStockOnly: boolean;
  sort: CatalogSort;
}

const comparePrices = (
  first: Product,
  second: Product,
  direction: "asc" | "desc",
) => {
  const firstPrice = getProductDisplayPrice(first);
  const secondPrice = getProductDisplayPrice(second);

  if (firstPrice === undefined && secondPrice === undefined) {
    return first.name.localeCompare(second.name, "fa");
  }
  if (firstPrice === undefined) return 1;
  if (secondPrice === undefined) return -1;

  const difference = firstPrice - secondPrice;
  return direction === "asc" ? difference : -difference;
};

export const filterCatalogProducts = ({
  products,
  category,
  query,
  shipping,
  dietOnly,
  inStockOnly,
  sort,
}: FilterCatalogOptions) => {
  let result = products.filter((product) => {
    if (!("isActive" in product)) return true;
    return (product as Product & { isActive?: boolean }).isActive !== false;
  });

  if (category !== "all") {
    result = result.filter((product) => product.categorySlug === category);
  }

  if (query.trim()) {
    result = result.filter((product) => productMatchesQuery(product, query));
  }

  if (shipping === "nationwide") {
    result = result.filter(
      (product) =>
        product.shippingScope === "nationwide" && !product.requiresCooling,
    );
  }

  if (shipping === "chilled") {
    result = result.filter(
      (product) =>
        product.requiresCooling || product.shippingScope === "tehran-karaj",
    );
  }

  if (dietOnly) {
    result = result.filter(
      (product) =>
        product.categorySlug === "diet" ||
        product.badges.some(
          (badge) => badge.includes("رژیمی") || badge.includes("بدون قند"),
        ) ||
        (product.tags ?? []).some(
          (tag) =>
            tag.includes("رژیمی") ||
            tag.includes("بدون قند") ||
            tag.includes("دیابتی"),
        ),
    );
  }

  if (inStockOnly) {
    result = result.filter((product) => isProductInStock(product));
  }

  switch (sort) {
    case "newest":
      return [...result].sort((first, second) => {
        const dateDifference =
          getComparableUpdatedAt(second) - getComparableUpdatedAt(first);
        return dateDifference || first.name.localeCompare(second.name, "fa");
      });
    case "price-asc":
      return [...result].sort((first, second) =>
        comparePrices(first, second, "asc"),
      );
    case "price-desc":
      return [...result].sort((first, second) =>
        comparePrices(first, second, "desc"),
      );
    case "featured":
    default:
      return [...result].sort((first, second) => {
        const featuredDifference =
          Number(second.isFeatured) - Number(first.isFeatured);
        if (featuredDifference !== 0) return featuredDifference;
        return first.name.localeCompare(second.name, "fa");
      });
  }
};

export const paginateCatalog = <T,>(
  items: T[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
) => {
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const startIndex = (safePage - 1) * safePageSize;

  return {
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    totalItems: items.length,
    startIndex,
    endIndex: Math.min(startIndex + safePageSize, items.length),
    items: items.slice(startIndex, startIndex + safePageSize),
  };
};
