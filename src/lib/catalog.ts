import type { Product } from "@/data/products";

export type CatalogSort = "featured" | "newest" | "price-asc" | "price-desc";
export type ShippingFilter = "all" | "nationwide" | "chilled";

export const CATALOG_PAGE_SIZE = 12;

interface ProductVerificationFlags {
  inventoryVerified?: boolean;
  contentVerified?: boolean;
  mediaVerified?: boolean;
}

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

export const getVariantPrices = (product: Product) =>
  product.variants
    ?.map((variant) => variant.price)
    .filter(
      (price): price is number =>
        typeof price === "number" && Number.isFinite(price),
    ) ?? [];

export const getProductRegularPrice = (product: Product) => {
  if (typeof product.priceToman === "number") return product.priceToman;
  if (typeof product.price === "number") return product.price;

  const variantPrices = getVariantPrices(product);
  return variantPrices.length ? Math.min(...variantPrices) : undefined;
};

export const getProductSalePrice = (product: Product) => {
  const regularPrice = getProductRegularPrice(product);
  const salePrice = product.salePriceToman;

  if (
    typeof regularPrice !== "number" ||
    typeof salePrice !== "number" ||
    salePrice <= 0 ||
    salePrice >= regularPrice
  ) {
    return undefined;
  }

  return salePrice;
};

export const getProductDisplayPrice = (product: Product) =>
  getProductSalePrice(product) ?? getProductRegularPrice(product);

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

export const getProductStock = (
  product: Product,
  variantId?: string | null,
) => {
  const variant = product.variants?.find((item) => item.id === variantId);
  const variantStock =
    variant && "stock" in variant
      ? (variant as typeof variant & { stock?: number }).stock
      : undefined;

  if (typeof variantStock === "number") return Math.max(0, variantStock);
  if (typeof product.stock === "number") return Math.max(0, product.stock);
  return 1;
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
      return [...result].reverse();
    case "price-asc":
      return [...result].sort(
        (a, b) =>
          (getProductDisplayPrice(a) ?? Number.POSITIVE_INFINITY) -
          (getProductDisplayPrice(b) ?? Number.POSITIVE_INFINITY),
      );
    case "price-desc":
      return [...result].sort(
        (a, b) =>
          (getProductDisplayPrice(b) ?? Number.NEGATIVE_INFINITY) -
          (getProductDisplayPrice(a) ?? Number.NEGATIVE_INFINITY),
      );
    case "featured":
    default:
      return [...result].sort((a, b) => {
        const featuredDifference = Number(b.isFeatured) - Number(a.isFeatured);
        if (featuredDifference !== 0) return featuredDifference;
        return a.name.localeCompare(b.name, "fa");
      });
  }
};

export const paginateCatalog = <T,>(
  items: T[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    page: safePage,
    pageSize,
    totalPages,
    totalItems: items.length,
    startIndex,
    endIndex: Math.min(startIndex + pageSize, items.length),
    items: items.slice(startIndex, startIndex + pageSize),
  };
};
