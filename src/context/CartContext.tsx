import { createContext, useContext, useEffect, useMemo, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  productCode: string;
  priceToman: number;
  quantity: number;
  requiresCooling: boolean;
  image: string;
  selectedVariant?: {
    id: string;
    name: string;
    priceToman: number;
  };
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "ADD"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE"; id: string; variantId?: string }
  | { type: "UPDATE"; id: string; quantity: number; variantId?: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

const STORAGE_KEY = "winimi_cart_v1";

const keyOf = (id: string, variantId?: string) => `${id}::${variantId ?? ""}`;

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const k = keyOf(action.item.id, action.item.selectedVariant?.id);
      const existing = state.items.find((i) => keyOf(i.id, i.selectedVariant?.id) === k);
      if (existing) {
        return {
          items: state.items.map((i) =>
            keyOf(i.id, i.selectedVariant?.id) === k
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: action.quantity }] };
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => keyOf(i.id, i.selectedVariant?.id) !== keyOf(action.id, action.variantId),
        ),
      };
    case "UPDATE":
      return {
        items: state.items
          .map((i) =>
            keyOf(i.id, i.selectedVariant?.id) === keyOf(action.id, action.variantId)
              ? { ...i, quantity: Math.max(1, action.quantity) }
              : i,
          ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  hasCoolingItems: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  const value = useMemo<CartContextType>(() => {
    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = state.items.reduce(
      (s, i) => s + (i.selectedVariant?.priceToman ?? i.priceToman) * i.quantity,
      0,
    );
    const hasCoolingItems = state.items.some((i) => i.requiresCooling);
    return {
      items: state.items,
      addItem: (item, quantity = 1) => dispatch({ type: "ADD", item, quantity }),
      removeItem: (id, variantId) => dispatch({ type: "REMOVE", id, variantId }),
      updateQuantity: (id, quantity, variantId) =>
        dispatch({ type: "UPDATE", id, quantity, variantId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      totalItems,
      subtotal,
      hasCoolingItems,
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const PACKAGING_FEE = 25000;
