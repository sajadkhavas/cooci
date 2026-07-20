import representativeProductImage from "@/assets/cookies/hero-assorted.jpg";
import type { Product } from "@/data/products";
import { apiRequest } from "@/lib/api";
import type {
  BackendCategory,
  BackendPagination,
  BackendProduct,
  BackendProductVariant,
} from "@/lib/backend-contract";

export interface CatalogQuery {
  category?: string;
  search?: string;
  featured?: boolean;
  requiresCooling?: boolean;
  inStock?: boolean;
  sort?: "featured" | "newest" | "name" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}

export interface CatalogPage {
  products: Product[];
  pagination: BackendPagination;
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
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

export const mapBackendProduct = (product: BackendProduct): MappedProduct => {
  const fallbackImage = {
    url: representativeProductImage,
    alt: `تصویر نمایشی ${product.name}`,
  };
  const variants = product.variants.map(mapVariant);

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
    images: product.images.length
      ? product.images.map((image) => ({ url: image.url, alt: image.alt }))
      : [fallbackImage],
    isFeatured: product.isFeatured,
    productCode: product.productCode,
    variants,
    seo: {
      title: product.seo.title,
      description: product.seo.description || product.shortDescription || "",
    },
    available: product.available,
    contentVerified: product.contentVerified,
    mediaVerified: product.mediaVerified && product.images.length > 0,
    inventoryVerified: product.inventoryVerified,
    updatedAt: product.updatedAt || undefined,
  };
};

const toSearchParams = (query: CatalogQuery) => {
  const params = new URLSearchParams();
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.featured !== undefined) params.set("featured", String(query.featured));
  if (query.requiresCooling !== undefined) {
    params.set("requiresCooling", String(query.requiresCooling));
  }
  if (query.inStock !== undefined) params.set("inStock", String(query.inStock));
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("perPage", String(query.perPage));
  return params;
};

export const fetchCatalogProducts = async (
  query: CatalogQuery = {},
): Promise<CatalogPage> => {
  const params = toSearchParams(query);
  const suffix = params.size ? `?${params.toString()}` : "";
  const response = await apiRequest<BackendProduct[]>(`/api/catalog/products${suffix}`);
  const pagination = response.meta.pagination as BackendPagination | undefined;

  return {
    products: response.data.map(mapBackendProduct),
    pagination:
      pagination ||
      ({
        page: 1,
        perPage: response.data.length,
        total: response.data.length,
        totalPages: 1,
        from: response.data.length ? 1 : null,
        to: response.data.length || null,
        hasMore: false,
      } satisfies BackendPagination),
  };
};

export const fetchCatalogProduct = async (slug: string): Promise<Product> => {
  const response = await apiRequest<BackendProduct>(
    `/api/catalog/products/${encodeURIComponent(slug)}`,
  );
  return mapBackendProduct(response.data);
};

export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
  const response = await apiRequest<BackendCategory[]>("/api/catalog/categories");
  return response.data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || undefined,
    image: category.image || undefined,
    productCount:
      typeof category.productCount === "number" ? category.productCount : undefined,
  }));
};
