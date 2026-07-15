# Winimi Frontend ↔ Backend Contract

This document defines the frontend expectations for the future Laravel backend and payment gateway integration.

## Environment

```env
VITE_API_BASE_URL=https://api.winimibakery.com
```

The frontend currently works with local/static data. When backend is ready, use `src/lib/api-client.ts` as the integration point.

## Public endpoints

### `GET /api/products`
Returns all public products.

Response shape: `ApiProduct[]` from `src/lib/api-contract.ts`.

### `GET /api/products/{slug}`
Returns one public product by slug.

Response shape: `ApiProduct`.

## Order endpoint

### `POST /api/orders`
Creates an order and starts payment.

Request shape: `CreateOrderRequest`.

Important frontend fields:
- `customer.fullName`
- `customer.phone`
- `customer.city`
- `customer.address`
- `items[].productId`
- `items[].variantId`
- `items[].quantity`
- `deliveryMethod`: `standard | chilled | pickup`
- `paymentProvider`: `gateway-placeholder | zarinpal | idpay | nextpay`

Response shape: `CreateOrderResponse`.

The backend should calculate final prices server-side and must not trust frontend prices.

## Payment verification

### `POST /api/payments/verify`
Verifies a payment callback.

Request shape: `VerifyPaymentRequest`.

Response shape: `VerifyPaymentResponse`.

## Order status

### `GET /api/orders/{orderId}`
Returns order status for customer tracking.

Response shape: `OrderStatusResponse`.

## Shipping business rules

Dry products:
- `shippingScope = nationwide`
- can use `standard` delivery

Chilled products:
- `requiresCooling = true`
- `shippingScope = tehran-karaj`
- should use `chilled` delivery
- city must be Tehran, Karaj, Andisheh, or another backend-approved cold-delivery city

Pickup:
- available for coordinated local pickup
- current frontend fee: `0`

## Payment provider replacement

Current frontend payment route is a placeholder:

```txt
/payment/callback?order={orderId}&status=paid
```

After a real gateway is connected:
1. `POST /api/orders` returns `paymentUrl`.
2. Frontend redirects to `paymentUrl`.
3. Gateway redirects back to `/payment/callback`.
4. Frontend calls `/api/payments/verify`.
5. Backend returns final order/payment status.

## SEO notes

Private transactional pages must remain `noindex`:
- `/cart`
- `/checkout`
- `/payment/callback`
- `/orders/:orderId`
- `/order-success`

Public indexable pages:
- `/`
- `/products`
- `/products/:slug`
- `/about`
- `/gallery`
- `/faq`
- `/shipping`
- `/contact`
- `/privacy`
- `/terms`
