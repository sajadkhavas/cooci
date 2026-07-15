import type { CreateOrderResponse } from "@/lib/api-contract";
import type { LocalOrder, PaymentProvider } from "@/lib/orders";

export interface PaymentStartResult {
  provider: PaymentProvider;
  orderId: string;
  authority: string;
  paymentUrl: string;
  callbackUrl: string;
}

export const createFrontendPaymentStart = (order: LocalOrder): PaymentStartResult => ({
  provider: order.payment.provider,
  orderId: order.id,
  authority: order.payment.authority ?? `AUTH-${order.id}`,
  paymentUrl: `/payment/callback?order=${encodeURIComponent(order.id)}&status=paid`,
  callbackUrl: order.payment.callbackUrl,
});

export const createBackendPaymentStart = (response: CreateOrderResponse, provider: PaymentProvider): PaymentStartResult => ({
  provider,
  orderId: response.orderId,
  authority: response.authority,
  paymentUrl: response.paymentUrl,
  callbackUrl: response.callbackUrl,
});

export const redirectToPayment = (payment: PaymentStartResult) => {
  window.location.assign(payment.paymentUrl);
};
