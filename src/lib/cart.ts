export const CART_STORAGE_KEY = "winimi_cart_v2";
export const LEGACY_CART_STORAGE_KEY = "winimi_cart_v1";
export const CART_STORAGE_VERSION = 2;

export const PACKAGING_FEE = 25_000;
export const STANDARD_DELIVERY_FEE = 85_000;
export const CHILLED_DELIVERY_FEE = 150_000;

export type CartAvailability = "available" | "out_of_stock" | "unavailable";

export interface CartVariantSnapshot {
  id: string;
  name: string;
  priceToman: number;
  stock: number;
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  productCode: string;
  priceToman: number;
  regularPriceToman?: number;
  quantity: number;
  stock: number;
  requiresCooling: boolean;
  image: string;
  availability: CartAvailability;
  selectedVariant?: CartVariantSnapshot;
}

export type CartItemInput = Omit<CartItem, "quantity" | "availability"> & {
  availability?: CartAvailability;
};

export interface StoredCart {
  version: typeof CART_STORAGE_VERSION;
  updatedAt: string;
  items: CartItem[];
}

export interface CartSummary {
  totalItems: number;
  uniqueItems: number;
  subtotal: number;
  regularSubtotal: number;
  savings: number;
  packagingFee: number;
  estimatedDeliveryFee: number;
  estimatedTotal: number;
  hasCoolingItems: boolean;
  hasUnavailableItems: boolean;
  hasStockIssues: boolean;
  isReadyForCheckout: boolean;
}

export const cartItemKey = (id: string, variantId?: string) =>
  `${id}::${variantId ?? ""}`;

export const getCartItemKey = (item: Pick<CartItem, "id" | "selectedVariant">) =>
  cartItemKey(item.id, item.selectedVariant?.id);

export const getCartUnitPrice = (item: CartItem) =>
  item.selectedVariant?.priceToman ?? item.priceToman;

export const getCartRegularUnitPrice = (item: CartItem) =>
  item.regularPriceToman ?? getCartUnitPrice(item);

export const getCartItemStock = (item: CartItem) =>
  Math.max(0, item.selectedVariant?.stock ?? item.stock);

export const clampCartQuantity = (quantity: number, stock: number) => {
  const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  if (stock <= 0) return Math.max(1, safeQuantity);
  return Math.min(Math.max(1, safeQuantity), stock);
};

export const estimateCartDeliveryFee = (hasCoolingItems: boolean) =>
  hasCoolingItems ? CHILLED_DELIVERY_FEE : STANDARD_DELIVERY_FEE;

export const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + getCartUnitPrice(item) * item.quantity,
    0,
  );
  const regularSubtotal = items.reduce(
    (sum, item) => sum + getCartRegularUnitPrice(item) * item.quantity,
    0,
  );
  const hasCoolingItems = items.some((item) => item.requiresCooling);
  const hasUnavailableItems = items.some(
    (item) => item.availability !== "available" || getCartItemStock(item) <= 0,
  );
  const hasStockIssues = items.some(
    (item) => item.quantity > getCartItemStock(item) && getCartItemStock(item) > 0,
  );
  const packagingFee = items.length > 0 ? PACKAGING_FEE : 0;
  const estimatedDeliveryFee =
    items.length > 0 ? estimateCartDeliveryFee(hasCoolingItems) : 0;

  return {
    totalItems,
    uniqueItems: items.length,
    subtotal,
    regularSubtotal,
    savings: Math.max(0, regularSubtotal - subtotal),
    packagingFee,
    estimatedDeliveryFee,
    estimatedTotal: subtotal + packagingFee + estimatedDeliveryFee,
    hasCoolingItems,
    hasUnavailableItems,
    hasStockIssues,
    isReadyForCheckout:
      items.length > 0 && !hasUnavailableItems && !hasStockIssues,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toPositiveNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;

const toNonNegativeNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;

const sanitizeVariant = (value: unknown): CartVariantSnapshot | undefined => {
  if (!isRecord(value)) return undefined;
  if (typeof value.id !== "string" || typeof value.name !== "string") return undefined;

  return {
    id: value.id,
    name: value.name,
    priceToman: toPositiveNumber(value.priceToman, 0),
    stock: toNonNegativeNumber(value.stock, 99),
  };
};

export const sanitizeCartItem = (value: unknown): CartItem | null => {
  if (!isRecord(value)) return null;
  if (
    typeof value.id !== "string" ||
    typeof value.slug !== "string" ||
    typeof value.name !== "string" ||
    typeof value.productCode !== "string"
  ) {
    return null;
  }

  const priceToman = toPositiveNumber(value.priceToman, 0);
  if (priceToman <= 0) return null;

  const selectedVariant = sanitizeVariant(value.selectedVariant);
  const stock = toNonNegativeNumber(value.stock, 99);
  const availability =
    value.availability === "out_of_stock" || value.availability === "unavailable"
      ? value.availability
      : "available";

  return {
    id: value.id,
    slug: value.slug,
    name: value.name,
    productCode: value.productCode,
    priceToman,
    regularPriceToman:
      typeof value.regularPriceToman === "number" &&
      Number.isFinite(value.regularPriceToman) &&
      value.regularPriceToman >= priceToman
        ? value.regularPriceToman
        : undefined,
    quantity: clampCartQuantity(toPositiveNumber(value.quantity, 1), selectedVariant?.stock ?? stock),
    stock,
    requiresCooling: Boolean(value.requiresCooling),
    image: typeof value.image === "string" ? value.image : "",
    availability,
    selectedVariant:
      selectedVariant && selectedVariant.priceToman > 0 ? selectedVariant : undefined,
  };
};

export const sanitizeCartItems = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) return [];

  const deduplicated = new Map<string, CartItem>();
  value.forEach((candidate) => {
    const item = sanitizeCartItem(candidate);
    if (!item) return;

    const key = getCartItemKey(item);
    const existing = deduplicated.get(key);
    if (!existing) {
      deduplicated.set(key, item);
      return;
    }

    deduplicated.set(key, {
      ...item,
      quantity: clampCartQuantity(
        existing.quantity + item.quantity,
        getCartItemStock(item),
      ),
    });
  });

  return [...deduplicated.values()];
};

export const parseStoredCart = (raw: string | null): CartItem[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return sanitizeCartItems(parsed);
    if (!isRecord(parsed)) return [];

    return sanitizeCartItems(parsed.items);
  } catch {
    return [];
  }
};

export const serializeCart = (items: CartItem[]): string =>
  JSON.stringify({
    version: CART_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    items,
  } satisfies StoredCart);
