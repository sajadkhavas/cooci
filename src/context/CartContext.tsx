import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type ProductVariant = NonNullable<Product["variants"]>[number];

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productCode: string;
  name: string;
  category: string;
  variantId?: string;
  variantName?: string;
  price: number;
  weight?: string;
  quantity: number;
  image?: string;
  imageAlt?: string;
  requiresCooling: boolean;
  shippingScope: Product["shippingScope"];
  shippingNote?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasCoolingItems: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "winimi_cart_v1";

const readInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const makeCartItemId = (product: Product, variant?: ProductVariant) =>
  `${product.slug}:${variant?.id ?? "default"}`;

const getPrice = (product: Product, variant?: ProductVariant) =>
  variant?.price ?? product.price ?? 0;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const price = getPrice(product, variant);
    if (!price) return;

    const id = makeCartItemId(product, variant);
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      const nextItem: CartItem = {
        id,
        productId: product.id,
        productSlug: product.slug,
        productCode: variant?.productCode ?? product.productCode,
        name: product.name,
        category: product.category,
        variantId: variant?.id,
        variantName: variant?.name,
        price,
        weight: variant?.weight ?? product.weight,
        quantity,
        image: product.images[0]?.url,
        imageAlt: product.images[0]?.alt ?? product.name,
        requiresCooling: Boolean(product.requiresCooling),
        shippingScope: product.shippingScope,
        shippingNote: product.shippingNote,
      };

      return [...current, nextItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasCoolingItems = items.some((item) => item.requiresCooling);

    return {
      items,
      itemCount,
      subtotal,
      hasCoolingItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const formatToman = (amount: number) => `${amount.toLocaleString("fa-IR")} تومان`;
