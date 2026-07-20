export const CART_STORAGE_KEY = "winimi_cart_v2";
export const LEGACY_CART_STORAGE_KEY = "winimi_cart_v1";
export const CART_STORAGE_VERSION = 2;
export const MAX_CART_ITEMS = 100;
export const MAX_CART_QUANTITY = 1_000;

export const PACKAGING_FEE = 0;
export const STANDARD_DELIVERY_FEE = 0;
export const CHILLED_DELIVERY_FEE = 0;

export type CartAvailability = "available" | "out_of_stock" | "unavailable";

export interface CartVariantSnapshot {
  id: string;
  name: string;
  priceToman: number;
  stock: number;
}

export interface CartItem {
  id: string;
  orderItemId?: string;
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

export interface CartVariantInput {
  id: string;
  name: string;
  priceToman: number;
  stock?: number;
}

export type CartItemInput = Omit<
  CartItem,
  "quantity" | "availability" | "stock" | "selectedVariant"
> & {
  availability?: CartAvailability;
  stock?: number;
  selectedVariant?: CartVariantInput;
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
export const getCartItemKey = (
  item: Pick<CartItem, "id" | "selectedVariant">,
) => cartItemKey(item.id, item.selectedVariant?.id);
export const getCartUnitPrice = (item: CartItem) =>
  item.selectedVariant?.priceToman ?? item.priceToman;
export const getCartRegularUnitPrice = (item: CartItem) =>
  item.regularPriceToman ?? getCartUnitPrice(item);
export const getCartItemStock = (item: CartItem) =>
  Math.max(0, item.selectedVariant?.stock ?? item.stock);

export const clampCartQuantity = (quantity: number, stock: number) => {
  const safeQuantity = Number.isFinite(quantity)
    ? Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)))
    : 1;
  if (stock <= 0) return safeQuantity;
  return Math.min(safeQuantity, Math.floor(stock));
};

export const estimateCartDeliveryFee = () => 0;

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
    (item) =>
      item.quantity > getCartItemStock(item) && getCartItemStock(item) > 0,
  );
  return {
    totalItems,
    uniqueItems: items.length,
    subtotal,
    regularSubtotal,
    savings: Math.max(0, regularSubtotal - subtotal),
    packagingFee: 0,
    estimatedDeliveryFee: 0,
    estimatedTotal: subtotal,
    hasCoolingItems,
    hasUnavailableItems,
    hasStockIssues,
    isReadyForCheckout:
      items.length > 0 && !hasUnavailableItems && !hasStockIssues,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toBoundedNumber = (
  value: unknown,
  fallback: number,
  maximum: number,
) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= maximum
    ? value
    : fallback;

const toPositiveNumber = (value: unknown, fallback: number) => {
  const number = toBoundedNumber(value, fallback, 1_000_000_000_000);
  return number > 0 ? number : fallback;
};

const toNonNegativeInteger = (value: unknown, fallback: number) => {
  const number = toBoundedNumber(value, fallback, 1_000_000);
  return Math.floor(number);
};

const toSafeString = (
  value: unknown,
  maximum: number,
  allowEmpty = false,
) => {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().slice(0, maximum);
  if (!allowEmpty && !normalized) return undefined;
  if (
    [...normalized].some((character) => {
      const code = character.charCodeAt(0);
      return code <= 31 || code === 127;
    })
  ) {
    return undefined;
  }
  return normalized;
};

const sanitizeImage = (value: unknown) => {
  const image = toSafeString(value, 2_048, true);
  if (!image) return "";
  if (image.startsWith("/") && !image.startsWith("//") && !image.includes("\\")) {
    return image;
  }
  try {
    const parsed = new URL(image);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
};

const sanitizeVariant = (value: unknown): CartVariantSnapshot | undefined => {
  if (!isRecord(value)) return undefined;
  const id = toSafeString(value.id, 180);
  const name = toSafeString(value.name, 200);
  const priceToman = toPositiveNumber(value.priceToman, 0);
  if (!id || !name || priceToman <= 0) return undefined;

  return {
    id,
    name,
    priceToman,
    stock: toNonNegativeInteger(value.stock, 0),
  };
};

export const sanitizeCartItem = (value: unknown): CartItem | null => {
  if (!isRecord(value)) return null;

  const id = toSafeString(value.id, 180);
  const slug = toSafeString(value.slug, 180);
  const name = toSafeString(value.name, 255);
  const productCode = toSafeString(value.productCode, 160);
  const priceToman = toPositiveNumber(value.priceToman, 0);
  if (!id || !slug || !name || !productCode || priceToman <= 0) return null;

  const selectedVariant = sanitizeVariant(value.selectedVariant);
  const stock = toNonNegativeInteger(value.stock, 0);
  const effectiveStock = selectedVariant?.stock ?? stock;
  const storedAvailability: CartAvailability =
    value.availability === "out_of_stock" || value.availability === "unavailable"
      ? value.availability
      : "available";
  const availability =
    effectiveStock <= 0 && storedAvailability === "available"
      ? "unavailable"
      : storedAvailability;
  const regularPrice = toPositiveNumber(value.regularPriceToman, 0);

  return {
    id,
    orderItemId: toSafeString(value.orderItemId, 180),
    slug,
    name,
    productCode,
    priceToman,
    regularPriceToman:
      regularPrice >= priceToman ? regularPrice : undefined,
    quantity: clampCartQuantity(
      toPositiveNumber(value.quantity, 1),
      effectiveStock,
    ),
    stock,
    requiresCooling: value.requiresCooling === true,
    image: sanitizeImage(value.image),
    availability,
    selectedVariant,
  };
};

export const sanitizeCartItems = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) return [];
  const deduplicated = new Map<string, CartItem>();

  for (const candidate of value.slice(0, MAX_CART_ITEMS * 2)) {
    const item = sanitizeCartItem(candidate);
    if (!item) continue;
    const key = getCartItemKey(item);
    const existing = deduplicated.get(key);
    if (!existing) deduplicated.set(key, item);
    else {
      deduplicated.set(key, {
        ...item,
        quantity: clampCartQuantity(
          existing.quantity + item.quantity,
          getCartItemStock(item),
        ),
      });
    }
    if (deduplicated.size >= MAX_CART_ITEMS) break;
  }

  return [...deduplicated.values()];
};

export const parseStoredCart = (raw: string | null): CartItem[] => {
  if (!raw || raw.length > 1_000_000) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return sanitizeCartItems(parsed);
    if (!isRecord(parsed)) return [];
    if (
      typeof parsed.version === "number" &&
      parsed.version > CART_STORAGE_VERSION
    ) {
      return [];
    }
    return sanitizeCartItems(parsed.items);
  } catch {
    return [];
  }
};

export const serializeCart = (items: CartItem[]): string =>
  JSON.stringify({
    version: CART_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    items: sanitizeCartItems(items),
  } satisfies StoredCart);
