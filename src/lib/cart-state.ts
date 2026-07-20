import type { Product } from "@/data/products";
import {
  getProductDisplayPrice,
  getProductRegularPrice,
  getProductStock,
  getVariantDisplayPrice,
  getVariantRegularPrice,
} from "@/lib/catalog";
import {
  cartItemKey,
  clampCartQuantity,
  getCartItemKey,
  getCartItemStock,
  sanitizeCartItems,
  type CartItem,
  type CartItemInput,
} from "@/lib/cart";

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD"; item: CartItemInput; quantity: number }
  | { type: "REMOVE"; id: string; variantId?: string }
  | { type: "UPDATE"; id: string; quantity: number; variantId?: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "SYNC_CATALOG"; products: Product[] };

type ProductVariant = NonNullable<Product["variants"]>[number];
type ProductVariantRuntime = ProductVariant & {
  stock?: number;
  available?: boolean;
};

const getVariantStock = (variant: ProductVariant) => {
  const stock = (variant as ProductVariantRuntime).stock;
  return typeof stock === "number" && Number.isFinite(stock)
    ? Math.max(0, Math.floor(stock))
    : undefined;
};

const isVariantAvailable = (variant: ProductVariant) =>
  (variant as ProductVariantRuntime).available !== false;

const isProductActive = (product: Product) =>
  !("isActive" in product) ||
  (product as Product & { isActive?: boolean }).isActive !== false;

export const syncCartItemWithCatalog = (
  item: CartItem,
  products: Product[],
): CartItem => {
  const product = products.find(
    (candidate) => candidate.id === item.id || candidate.slug === item.slug,
  );

  // A paginated or filtered response is not proof that an absent item is invalid.
  // CheckoutGuard performs exact per-slug reconciliation before ordering.
  if (!product) return item;

  if (!isProductActive(product)) {
    return { ...item, stock: 0, availability: "unavailable" };
  }

  const selectedVariant = item.selectedVariant
    ? product.variants?.find((variant) => variant.id === item.selectedVariant?.id)
    : undefined;

  if (item.selectedVariant && !selectedVariant) {
    return {
      ...item,
      name: product.name,
      productCode: product.productCode,
      image: product.images[0]?.url ?? item.image,
      stock: 0,
      availability: "unavailable",
    };
  }

  if (!item.selectedVariant && (product.variants?.length ?? 0) > 0) {
    return {
      ...item,
      name: product.name,
      productCode: product.productCode,
      image: product.images[0]?.url ?? item.image,
      stock: 0,
      availability: "unavailable",
    };
  }

  const regularPrice = selectedVariant
    ? getVariantRegularPrice(selectedVariant)
    : getProductRegularPrice(product);
  const currentPrice = selectedVariant
    ? getVariantDisplayPrice(selectedVariant)
    : getProductDisplayPrice(product);
  const variantStock = selectedVariant ? getVariantStock(selectedVariant) : undefined;
  const stock = variantStock ?? getProductStock(product, selectedVariant?.id);
  const availability =
    !currentPrice ||
    currentPrice <= 0 ||
    (selectedVariant && !isVariantAvailable(selectedVariant))
      ? "unavailable"
      : stock <= 0
        ? "out_of_stock"
        : "available";

  return {
    ...item,
    id: product.id,
    slug: product.slug,
    name: product.name,
    productCode: selectedVariant?.productCode ?? product.productCode,
    priceToman: currentPrice ?? item.priceToman,
    regularPriceToman:
      regularPrice && currentPrice && regularPrice > currentPrice
        ? regularPrice
        : undefined,
    quantity: clampCartQuantity(item.quantity, stock),
    stock,
    requiresCooling: Boolean(product.requiresCooling),
    image: product.images[0]?.url ?? item.image,
    availability,
    selectedVariant: selectedVariant
      ? {
          id: selectedVariant.id,
          name: selectedVariant.name,
          priceToman:
            currentPrice ?? item.selectedVariant?.priceToman ?? item.priceToman,
          stock,
        }
      : undefined,
  };
};

export const cartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case "ADD": {
      const stock = Math.max(
        0,
        Math.floor(action.item.selectedVariant?.stock ?? action.item.stock ?? 0),
      );
      const availability =
        action.item.availability ?? (stock > 0 ? "available" : "unavailable");
      const item: CartItem = {
        ...action.item,
        stock,
        selectedVariant: action.item.selectedVariant
          ? { ...action.item.selectedVariant, stock }
          : undefined,
        availability,
        quantity: 1,
      };

      if (stock <= 0 || availability !== "available") return state;

      const key = getCartItemKey(item);
      const existing = state.items.find(
        (candidate) => getCartItemKey(candidate) === key,
      );
      const requestedQuantity = clampCartQuantity(action.quantity, stock);

      if (existing) {
        const nextQuantity = clampCartQuantity(
          existing.quantity + requestedQuantity,
          stock,
        );
        if (nextQuantity === existing.quantity) return state;

        return {
          items: state.items.map((candidate) =>
            getCartItemKey(candidate) === key
              ? { ...candidate, ...item, quantity: nextQuantity }
              : candidate,
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: requestedQuantity }],
      };
    }

    case "REMOVE":
      return {
        items: state.items.filter(
          (item) =>
            getCartItemKey(item) !== cartItemKey(action.id, action.variantId),
        ),
      };

    case "UPDATE": {
      const key = cartItemKey(action.id, action.variantId);
      const existing = state.items.find((item) => getCartItemKey(item) === key);
      if (!existing) return state;

      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => getCartItemKey(item) !== key),
        };
      }

      const nextQuantity = clampCartQuantity(
        action.quantity,
        getCartItemStock(existing),
      );
      if (nextQuantity === existing.quantity) return state;

      return {
        items: state.items.map((item) =>
          getCartItemKey(item) === key
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      };
    }

    case "SYNC_CATALOG": {
      const syncedItems = state.items.map((item) =>
        syncCartItemWithCatalog(item, action.products),
      );
      return JSON.stringify(syncedItems) === JSON.stringify(state.items)
        ? state
        : { items: syncedItems };
    }

    case "HYDRATE": {
      const items = sanitizeCartItems(action.items);
      return JSON.stringify(items) === JSON.stringify(state.items)
        ? state
        : { items };
    }

    case "CLEAR":
      return state.items.length ? { items: [] } : state;

    default:
      return state;
  }
};
