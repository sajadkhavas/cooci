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
  calculateCartSummary,
  CART_STORAGE_KEY,
  LEGACY_CART_STORAGE_KEY,
  PACKAGING_FEE,
  parseStoredCart,
  serializeCart,
  type CartItem,
  type CartItemInput,
  type CartSummary,
} from "@/lib/cart";
import { cartReducer, type CartState } from "@/lib/cart-state";

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
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state.items));
      window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private browsing or restricted environments.
    }
  }, [state.items]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const hydrateFromAnotherTab = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return;
      if (
        event.key !== CART_STORAGE_KEY &&
        event.key !== LEGACY_CART_STORAGE_KEY
      ) {
        return;
      }
      dispatch({ type: "HYDRATE", items: parseStoredCart(event.newValue) });
    };

    window.addEventListener("storage", hydrateFromAnotherTab);
    return () => window.removeEventListener("storage", hydrateFromAnotherTab);
  }, []);

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

  const summary = useMemo(
    () => calculateCartSummary(state.items),
    [state.items],
  );

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
