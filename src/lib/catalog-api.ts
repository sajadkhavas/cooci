import representativeProductImage from "@/assets/cookies/hero-assorted.jpg";
import type { Product } from "@/data/products";
import { apiRequest } from "@/lib/api";
import type {
  BackendCategory,
  BackendProduct,
  BackendProductVariant,
} from "@/lib/backend-contract";
import {
  parseBackendCategories,
  parseBackendPagination,
  parseBackendProduct,
  parseBackendProducts,
} from "@/lib/catalog-schema";
import {
  resolveOutOfRangeCatalogQuery,
  toCatalogSearchParams,
  type CatalogQuery,
} from "@/lib/catalog-query";

export type { CatalogQuery } from "@/lib/catalog-query";

export interface CatalogPage {
  products: Product[];
  pagination: ReturnType<typeof parseBackendPagination>;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  seo: {
    title: string;
    description?: string;
  };
}

export interface CatalogCategoryLanding {
  id: string;
  slug: string;
  productCategorySlug: string;
  catalogSearch?: string;
  name: string;
  eyebrow: string;
  cardDescription: string;
  seoTitle: string;
  seoDescription: string;
  heading: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  faq: Array<{ question: string; answer: string }>;
}

export interface CatalogDirectory {
  categories: CatalogCategory[];
  landings: CatalogCategoryLanding[];
}

type ProductVariant = NonNullable<Product["variants"]>[number] & {
  stock: number;
  regularPriceToman: number;
  salePriceToman?: number;
  available: boolean;
  lowStock: boolean;
  isDefault: boolean;
  weightGrams?: number;
};

type MappedProduct = Product & {
  regularPriceToman?: number;
  available: boolean;
  contentVerified: boolean;
  mediaVerified: boolean;
  inventoryVerified: boolean;
  updatedAt?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requiredText = (value: unknown, field: string) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid category landing field: ${field}`);
  }
  return value.trim();
};

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const parseCopyPairs = (
  value: unknown,
  first: "title" | "question",
  second: "body" | "answer",
) => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const firstValue = optionalText(item[first]);
    const secondValue = optionalText(item[second]);
    return firstValue && secondValue
      ? [{ [first]: firstValue, [second]: secondValue }]
      : [];
  }) as Array<Record<typeof first | typeof second, string>>;
};

const parseCategoryLandings = (value: unknown): CatalogCategoryLanding[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item) || !isRecord(item.seo)) return [];
    try {
      return [{
        id: requiredText(item.id, "id"),
        slug: requiredText(item.slug, "slug"),
        productCategorySlug: requiredText(
          item.catalogCategorySlug,
          "catalogCategorySlug",
        ),
        catalogSearch: optionalText(item.catalogSearch),
        name: requiredText(item.name, "name"),
        eyebrow: optionalText(item.eyebrow) ?? "",
        cardDescription: optionalText(item.cardDescription) ?? "",
        seoTitle: requiredText(item.seo.title, "seo.title"),
        seoDescription: requiredText(item.seo.description, "seo.description"),
        heading: requiredText(item.heading, "heading"),
        intro: requiredText(item.intro, "intro"),
        sections: parseCopyPairs(item.sections, "title", "body") as Array<{
          title: string;
          body: string;
        }>,
        faq: parseCopyPairs(item.faq, "question", "answer") as Array<{
          question: string;
          answer: string;
        }>,
      }];
    } catch {
      return [];
    }
  });
};

const mapVariant = (variant: BackendProductVariant): ProductVariant => ({
  id: variant.id,
  name: variant.name,
  price: variant.priceToman,
  weight: variant.weight || undefined,
  weightGrams: variant.weightGrams || undefined,
  productCode: variant.productCode,
  description: variant.lowStock ? "موجودی محدود" : undefined,
  stock: variant.stock,
  regularPriceToman: variant.regularPriceToman,
  salePriceToman: variant.salePriceToman || undefined,
  available: variant.available,
  lowStock: variant.lowStock,
  isDefault: variant.isDefault,
});

const compareVariants = (first: ProductVariant, second: ProductVariant) => {
  const defaultDifference = Number(second.isDefault) - Number(first.isDefault);
  if (defaultDifference !== 0) return defaultDifference;

  const availabilityDifference = Number(second.available) - Number(first.available);
  if (availabilityDifference !== 0) return availabilityDifference;

  return first.name.localeCompare(second.name, "fa");
};

export const mapBackendProduct = (product: BackendProduct): MappedProduct => {
  const fallbackImage = {
    url: representativeProductImage,
    alt: `تصویر نمایشی ${product.name}`,
  };
  const verifiedImages = product.images
    .filter((image) => image.verified)
    .map((image) => ({ url: image.url, alt: image.alt || product.name }));
  const variants = product.variants.map(mapVariant).sort(compareVariants);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription || "",
    longDescription: product.longDescription || product.shortDescription || "",
    category: product.category || "محصولات وینیمی",
    categorySlug: product.categorySlug || "uncategorized",
    price: product.priceToman || undefined,
    priceToman: product.regularPriceToman || product.priceToman || undefined,
    regularPriceToman: product.regularPriceToman || undefined,
    salePriceToman: product.salePriceToman || undefined,
    weight: product.weight || undefined,
    weightGrams: product.weightGrams || undefined,
    badges: product.badges,
    tags: [],
    flavors: [],
    allergens: product.allergens,
    ingredients: product.ingredients,
    shelfLife: product.shelfLife || "",
    storageTips: product.storageTips || "",
    preparationTimeDays: product.preparationTimeDays || undefined,
    stock: product.stock,
    requiresCooling: product.requiresCooling,
    shippingScope: product.shippingScope,
    shippingNote: product.shippingNote,
    images: verifiedImages.length ? verifiedImages : [fallbackImage],
    isFeatured: product.isFeatured,
    productCode: product.productCode,
    variants,
    seo: {
      title: product.seo.title,
      description: product.seo.description || product.shortDescription || "",
    },
    available: product.available,
    contentVerified: product.contentVerified,
    mediaVerified: product.mediaVerified && verifiedImages.length > 0,
    inventoryVerified: product.inventoryVerified,
    updatedAt: product.updatedAt || undefined,
  };
};

export const fetchCatalogProducts = async (
  query: CatalogQuery = {},
): Promise<CatalogPage> => {
  const params = toCatalogSearchParams(query);
  const suffix = params.size ? `?${params.toString()}` : "";
  const response = await apiRequest<unknown>(`/api/catalog/products${suffix}`);
  const retryQuery = resolveOutOfRangeCatalogQuery(
    query,
    response.meta.pagination,
  );
  if (retryQuery) return fetchCatalogProducts(retryQuery);

  const products = parseBackendProducts(response.data);
  const pagination = parseBackendPagination(response.meta.pagination);

  return {
    products: products.map(mapBackendProduct),
    pagination,
  };
};

export const fetchCatalogProduct = async (slug: string): Promise<Product> => {
  const response = await apiRequest<unknown>(
    `/api/catalog/products/${encodeURIComponent(slug)}`,
  );
  return mapBackendProduct(parseBackendProduct(response.data));
};

export const fetchCatalogDirectory = async (): Promise<CatalogDirectory> => {
  const response = await apiRequest<unknown>("/api/catalog/categories");
  const categories: BackendCategory[] = parseBackendCategories(response.data);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || undefined,
      image: category.image || undefined,
      productCount:
        typeof category.productCount === "number"
          ? category.productCount
          : undefined,
      seo: {
        title: category.seo.title,
        description: category.seo.description || undefined,
      },
    })),
    landings: parseCategoryLandings(response.meta.categoryLandings),
  };
};

export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> =>
  (await fetchCatalogDirectory()).categories;
