import type { CartItem } from "@/context/CartContext";
import type { DeliveryMethod, PaymentProvider } from "@/lib/orders";

export interface ApiProductImage {
  url: string;
  alt: string;
}

export interface ApiProductVariant {
  id: string;
  name: string;
  price?: number;
  weight?: string;
  productCode?: string;
  description?: string;
}

export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categorySlug: string;
  price?: number;
  weight?: string;
  badges: string[];
  tags?: string[];
  flavors?: string[];
  allergens: string[];
  ingredients: string[];
  shelfLife: string;
  storageTips: string;
  stock?: number;
  requiresCooling: boolean;
  shippingScope: "nationwide" | "tehran-karaj";
  shippingNote: string;
  images: ApiProductImage[];
  isFeatured: boolean;
  productCode: string;
  variants?: ApiProductVariant[];
  seo?: {
    title: string;
    description: string;
  };
}

export interface CreateOrderRequest {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: Array<Pick<CartItem, "productId" | "productSlug" | "productCode" | "variantId" | "variantName" | "quantity" | "price">>;
  deliveryMethod: DeliveryMethod;
  paymentProvider: PaymentProvider;
}

export interface CreateOrderResponse {
  orderId: string;
  authority: string;
  amount: number;
  paymentUrl: string;
  callbackUrl: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  authority: string;
  status: "paid" | "failed";
}

export interface VerifyPaymentResponse {
  orderId: string;
  status: "paid" | "failed";
  refId?: string;
  message: string;
}

export interface OrderStatusResponse {
  id: string;
  status: "awaiting_payment" | "paid" | "preparing" | "sent" | "delivered" | "cancelled" | "payment_failed";
  paymentStatus: "awaiting_gateway" | "redirect_ready" | "paid" | "failed";
  total: number;
  deliveryFee: number;
  createdAt: string;
}
