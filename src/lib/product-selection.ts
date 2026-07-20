import type { Product } from "@/data/products";
import { getProductStock } from "@/lib/catalog";

type ProductVariant = NonNullable<Product["variants"]>[number];
type ProductVariantRuntime = ProductVariant & {
  available?: boolean;
  isDefault?: boolean;
};

const isAvailable = (product: Product, variant: ProductVariant) =>
  (variant as ProductVariantRuntime).available !== false &&
  getProductStock(product, variant.id) > 0;

export const getPreferredProductVariant = (product: Product) => {
  const variants = product.variants ?? [];
  if (!variants.length) return undefined;

  return (
    variants.find(
      (variant) =>
        (variant as ProductVariantRuntime).isDefault === true &&
        isAvailable(product, variant),
    ) ??
    variants.find((variant) => isAvailable(product, variant)) ??
    variants.find(
      (variant) => (variant as ProductVariantRuntime).isDefault === true,
    ) ??
    variants[0]
  );
};
