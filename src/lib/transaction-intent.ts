import { createIdempotencyKey } from "@/lib/api";

export type TransactionIntentKind = "checkout" | "payment";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface StoredTransactionIntent {
  version: 1;
  kind: TransactionIntentKind;
  fingerprint: string;
  idempotencyKey: string;
  createdAt: string;
}

const INTENT_TTL_MS = 30 * 60 * 1000;
const MAX_STORED_INTENT_LENGTH = 2_048;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9:_-]{16,120}$/;

const storageKey = (kind: TransactionIntentKind) =>
  `winimi_${kind}_intent_v1`;

const getSessionStorage = (): StorageLike | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const normalizeText = (value: unknown, maximum = 500) =>
  typeof value === "string" ? value.trim().slice(0, maximum) : "";

const hashFingerprintSource = (source: string) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

export const buildCheckoutFingerprint = ({
  addressId,
  customer,
  deliveryMethod,
  items,
}: {
  addressId?: string;
  customer?: {
    fullName?: string;
    mobile?: string;
    province?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    notes?: string;
  };
  deliveryMethod: string;
  items: Array<{
    quantity: number;
    selectedVariant?: { id?: string };
  }>;
}) => {
  const normalizedItems = items
    .map((item) => ({
      variantId: normalizeText(item.selectedVariant?.id, 180),
      quantity: Number.isFinite(item.quantity)
        ? Math.max(1, Math.min(1_000, Math.trunc(item.quantity)))
        : 1,
    }))
    .sort((left, right) =>
      left.variantId.localeCompare(right.variantId, "en"),
    );

  const source = JSON.stringify({
    addressId: normalizeText(addressId, 180),
    customer: addressId
      ? null
      : {
          fullName: normalizeText(customer?.fullName, 160),
          mobile: normalizeText(customer?.mobile, 32),
          province: normalizeText(customer?.province, 160),
          city: normalizeText(customer?.city, 160),
          address: normalizeText(customer?.address, 1_000),
          postalCode: normalizeText(customer?.postalCode, 32),
          notes: normalizeText(customer?.notes, 1_000),
        },
    deliveryMethod: normalizeText(deliveryMethod, 32),
    items: normalizedItems,
  });

  return `checkout:${hashFingerprintSource(source)}`;
};

export const buildPaymentFingerprint = (orderId: string) =>
  `payment:${hashFingerprintSource(normalizeText(orderId, 180))}`;

const parseIntent = (
  raw: string | null,
  kind: TransactionIntentKind,
  now: number,
): StoredTransactionIntent | null => {
  if (!raw || raw.length > MAX_STORED_INTENT_LENGTH) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const candidate = value as Partial<StoredTransactionIntent>;
    const createdAt = Date.parse(candidate.createdAt || "");

    if (
      candidate.version !== 1 ||
      candidate.kind !== kind ||
      typeof candidate.fingerprint !== "string" ||
      candidate.fingerprint.length > 128 ||
      typeof candidate.idempotencyKey !== "string" ||
      !IDEMPOTENCY_KEY_PATTERN.test(candidate.idempotencyKey) ||
      !Number.isFinite(createdAt) ||
      createdAt > now + 60_000 ||
      now - createdAt > INTENT_TTL_MS
    ) {
      return null;
    }

    return candidate as StoredTransactionIntent;
  } catch {
    return null;
  }
};

export const getOrCreateTransactionIntent = (
  kind: TransactionIntentKind,
  fingerprint: string,
  options: {
    storage?: StorageLike | null;
    now?: number;
    keyFactory?: (prefix: string) => string;
  } = {},
) => {
  const storage = options.storage === undefined
    ? getSessionStorage()
    : options.storage;
  const now = options.now ?? Date.now();
  const existing = parseIntent(storage?.getItem(storageKey(kind)) ?? null, kind, now);

  if (existing?.fingerprint === fingerprint) {
    return existing.idempotencyKey;
  }

  const idempotencyKey = (options.keyFactory ?? createIdempotencyKey)(
    kind === "checkout" ? "CHK" : "PAY",
  );
  if (!IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
    throw new Error("Generated Idempotency key is invalid.");
  }

  const intent: StoredTransactionIntent = {
    version: 1,
    kind,
    fingerprint: fingerprint.slice(0, 128),
    idempotencyKey,
    createdAt: new Date(now).toISOString(),
  };

  try {
    storage?.setItem(storageKey(kind), JSON.stringify(intent));
  } catch {
    // The in-memory key is still valid for this request when storage is restricted.
  }

  return idempotencyKey;
};

export const clearTransactionIntent = (
  kind: TransactionIntentKind,
  storage: StorageLike | null = getSessionStorage(),
) => {
  try {
    storage?.removeItem(storageKey(kind));
  } catch {
    // Restricted storage must not block the completed transaction flow.
  }
};

export const TRANSACTION_INTENT_TTL_MS = INTENT_TTL_MS;
