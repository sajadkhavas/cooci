import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/data/products";
import {
  getProductDisplayPrice,
  getProductRegularPrice,
  getProductStock,
} from "@/lib/catalog";
import {
  calculateCartSummary,
  CART_STORAGE_KEY,
  cartItemKey,
  clampCartQuantity,
  getCartItemKey,
  getCartItemStock,
  LEGACY_CART_STORAGE_KEY,
  PACKAGING_FEE,
  parseStoredCart,
  serializeCart,
  type CartItem,
  type CartItemInput,
  type CartSummary,
} from "@/lib/cart";

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "ADD"; item: CartItemInput; quantity: number }
  | { type: "REMOVE"; id: string; variantId?: string }
  | { type: "UPDATE"; id: string; quantity: number; variantId?: string }
  | { type: "CLEAR" }
  | { type: "SYNC_CATALOG"; products: Product[] };

type ProductVariant = NonNullable<Product["variants"]>[number];

const getVariantStock = (variant: ProductVariant) => {
  if ("stock" in variant) {
    const stock = (variant as ProductVariant & { stock?: number }).stock;
    if (typeof stock === "number" && Number.isFinite(stock)) return Math.max(0, stock);
  }
  return undefined;
};

const isProductActive = (product: Product) => {
  if (!("isActive" in product)) return true;
  return (product as Product & { isActive?: boolean }).isActive !== false;
};

const syncItemWithCatalog = (item: CartItem, products: Product[]): CartItem => {
  const product = products.find(
    (candidate) => candidate.id === item.id || candidate.slug === item.slug,
  );

  if (!product || !isProductActive(product)) {
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

  const regularPrice = selectedVariant?.price ?? getProductRegularPrice(product);
  const currentPrice = selectedVariant?.price ?? getProductDisplayPrice(product);
  const variantStock = selectedVariant ? getVariantStock(selectedVariant) : undefined;
  const stock = variantStock ?? getProductStock(product, selectedVariant?.id);
  const availability =
    !currentPrice || currentPrice <= 0
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
    stock,
    requiresCooling: Boolean(product.requiresCooling),
    image: product.images[0]?.url ?? item.image,
    availability,
    selectedVariant: selectedVariant
      ? {
          id: selectedVariant.id,
          name: selectedVariant.name,
          priceToman: currentPrice ?? item.selectedVariant?.priceToman ?? item.priceToman,
          stock,
        }
      : undefined,
  };
};

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD": {
      const stock = Math.max(
        0,
        action.item.selectedVariant?.stock ?? action.item.stock ?? 99,
      );
      const item: CartItem = {
        ...action.item,
        stock,
        selectedVariant: action.item.selectedVariant
          ? { ...action.item.selectedVariant, stock }
          : undefined,
        availability: action.item.availability ?? "available",
        quantity: 1,
      };

      if (stock <= 0 || item.availability !== "available") return state;

      const key = getCartItemKey(item);
      const existing = state.items.find((candidate) => getCartItemKey(candidate) === key);
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
        syncItemWithCatalog(item, action.products),
      );

      return JSON.stringify(syncedItems) === JSON.stringify(state.items)
        ? state
        : { items: syncedItems };
    }

    case "CLEAR":
      return state.items.length ? { items: [] } : state;

    default:
      return state;
  }
};

const getInitialState = (): CartState => {
  if (typeof window === "undefined") return { items: [] };

  try {
    const currentRaw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (currentRaw !== null) {
      return { items: parseStoredCart(currentRaw) };
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    return { items: parseStoredCart(legacyRaw) };
  } catch {
    return { items: [] };
  }
};

interface CartContextType extends CartSummary {
  items: CartItem[];
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  syncWithCatalog: (products: Product[]) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state.items));
      window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private browsing or restricted environments.
    }
  }, [state.items]);

  const addItem = useCallback(
    (item: CartItemInput, quantity = 1) =>
      dispatch({ type: "ADD", item, quantity }),
    [],
  );
  const removeItem = useCallback(
    (id: string, variantId?: string) =>
      dispatch({ type: "REMOVE", id, variantId }),
    [],
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number, variantId?: string) =>
      dispatch({ type: "UPDATE", id, quantity, variantId }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const syncWithCatalog = useCallback(
    (products: Product[]) => dispatch({ type: "SYNC_CATALOG", products }),
    [],
  );

  const summary = useMemo(() => calculateCartSummary(state.items), [state.items]);

  const value = useMemo<CartContextType>(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      syncWithCatalog,
      ...summary,
    }),
    [
      addItem,
      clearCart,
      removeItem,
      state.items,
      summary,
      syncWithCatalog,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export type { CartItem, CartItemInput } from "@/lib/cart";
export { PACKAGING_FEE } from "@/lib/cart";
