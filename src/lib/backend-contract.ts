export interface BackendPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  from: number | null;
  to: number | null;
  hasMore: boolean;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount?: number;
  seo: {
    title: string;
    description: string | null;
  };
}

export interface BackendProductImage {
  url: string;
  alt: string;
  verified: boolean;
}

export interface BackendProductVariant {
  id: string;
  name: string;
  productCode: string;
  weightGrams: number | null;
  weight: string | null;
  priceToman: number;
  regularPriceToman: number;
  salePriceToman: number | null;
  stock: number;
  available: boolean;
  lowStock: boolean;
  isDefault: boolean;
}

export interface BackendProduct {
  id: string;
  slug: string;
  name: string;
  productCode: string;
  shortDescription: string | null;
  longDescription: string | null;
  category: string | null;
  categorySlug: string | null;
  categoryData?: BackendCategory;
  priceToman: number | null;
  regularPriceToman: number | null;
  salePriceToman: number | null;
  weightGrams: number | null;
  weight: string | null;
  stock: number;
  available: boolean;
  requiresCooling: boolean;
  shippingScope: "nationwide" | "tehran-karaj";
  shippingNote: string;
  ingredients: string[];
  allergens: string[];
  shelfLife: string | null;
  storageTips: string | null;
  preparationTimeDays: number | null;
  badges: string[];
  images: BackendProductImage[];
  isFeatured: boolean;
  contentVerified: boolean;
  mediaVerified: boolean;
  inventoryVerified: boolean;
  variants: BackendProductVariant[];
  seo: {
    title: string;
    description: string | null;
  };
  updatedAt: string | null;
}

export interface BackendUser {
  id: string;
  mobile: string;
  fullName: string | null;
  email: string | null;
  mobileVerified: boolean;
  marketingConsent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BackendOtpChallenge {
  challengeId: string;
  expiresIn: number;
  retryAfter: number;
  debugCode?: string;
}

export interface BackendAddress {
  id: string;
  title: string;
  recipientName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BackendAddressInput {
  title: string;
  recipientName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string | null;
  isDefault?: boolean;
}

export type BackendDeliveryMethod = "standard" | "chilled" | "pickup";
export type BackendOrderStatus =
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "preparing"
  | "ready"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "expired";
export type BackendPaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";
export type BackendPaymentAttemptStatus =
  | "initiated"
  | "pending"
  | "verified"
  | "failed"
  | "cancelled"
  | "expired";

export interface BackendPaymentAttempt {
  id: string;
  provider: string;
  attemptNumber: number;
  status: BackendPaymentAttemptStatus;
  statusLabel: string;
  amountToman: number;
  currency: string;
  authority: string | null;
  referenceId: string | null;
  gatewayCode: number | null;
  redirectUrl: string | null;
  failure: {
    code: string | null;
    message: string | null;
  } | null;
  expiresAt: string | null;
  verifiedAt: string | null;
  createdAt: string | null;
}

export interface BackendOrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productCode: string;
  sku: string;
  weightGrams: number | null;
  requiresCooling: boolean;
  unitPriceToman: number;
  quantity: number;
  lineTotalToman: number;
}

export interface BackendOrder {
  id: string;
  number: string;
  status: BackendOrderStatus;
  statusLabel: string;
  paymentStatus: BackendPaymentStatus;
  paymentStatusLabel: string;
  delivery: {
    method: BackendDeliveryMethod;
    methodLabel: string;
    requiresCooling: boolean;
    feeToman: number;
    zone: { id: string; name: string } | null;
  };
  totals: {
    subtotalToman: number;
    deliveryFeeToman: number;
    packagingFeeToman: number;
    discountToman: number;
    grandTotalToman: number;
  };
  itemCount: number;
  preparationTimeDays: number;
  preparation: { minDays: number; maxDays: number };
  recipient: {
    fullName: string;
    mobile: string;
    province: string | null;
    city: string | null;
    address: string | null;
    postalCode: string | null;
    notes: string | null;
  };
  fulfillment: {
    trackingCode: string | null;
    confirmedAt: string | null;
    preparingAt: string | null;
    readyAt: string | null;
    dispatchedAt: string | null;
    deliveredAt: string | null;
  };
  items: BackendOrderItem[];
  payments: BackendPaymentAttempt[];
  timeline: Array<{
    from: BackendOrderStatus | null;
    to: BackendOrderStatus;
    label: string;
    createdAt: string | null;
  }>;
  reservationExpiresAt: string | null;
  canCancel: boolean;
  placedAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
}

export interface BackendDeliveryOptions {
  zone: {
    id: string;
    name: string;
    minimumOrderToman: number | null;
    freeDeliveryThresholdToman: number | null;
    packagingFeeToman: number;
    preparation: { minDays: number; maxDays: number };
  } | null;
  methods: Array<{
    method: BackendDeliveryMethod;
    label: string;
    enabled: boolean;
    feeToman: number;
  }>;
}

export interface BackendCheckoutResult {
  order: BackendOrder;
  payment: {
    available: boolean;
    state: "ready" | "disabled";
    initiationEndpoint: string | null;
  };
}

export interface BackendPaymentInitiationResult {
  order: BackendOrder;
  payment: BackendPaymentAttempt;
}

export interface BackendPaymentVerificationResult {
  verified: boolean;
  order: BackendOrder;
  payment: BackendPaymentAttempt;
}

export interface BackendStoreSettings {
  settings: Record<string, unknown>;
  trust: {
    enamad: {
      enabled: boolean;
      badgeCode: string | null;
    };
  };
}

export interface BackendContentPage {
  page: {
    id: string;
    type: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    seo: { title: string | null; description: string | null };
    publishedAt: string | null;
  };
}

export interface BackendPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  coverUrl: string | null;
  author: string | null;
  publishedAt: string | null;
}

export interface BackendPostDetail extends BackendPostSummary {
  content: string;
  viewCount: number;
}

export interface BackendReview {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verifiedPurchase: boolean;
  customerName: string;
  publishedAt: string | null;
}

export interface BackendReviewSummary {
  count: number;
  averageRating: number;
}

export type BackendInquiryType = "contact" | "gift" | "corporate";

export interface BackendInquiryInput {
  type: BackendInquiryType;
  fullName: string;
  mobile?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  metadata?: Record<string, unknown> | null;
  website?: string;
}
