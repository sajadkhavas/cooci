# Winimi Frontend ↔ Backend Contract

This document defines the frontend expectations for the Laravel backend and payment gateway integration.

## Environment

```env
SITE_URL=https://winimibakery.com
VITE_USE_BACKEND=false
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_PAYMENT_PROVIDER=gateway-placeholder
```

Switch `VITE_USE_BACKEND=true` only when the backend API is deployed and ready. Until then, the frontend keeps using the static catalog and local checkout fallback.

## Frontend integration points

- `src/hooks/useCatalog.ts`: reads products from backend when `VITE_USE_BACKEND=true`, otherwise falls back to static `src/data/products.ts`.
- `src/lib/api-client.ts`: typed API client for products, orders and payment verification.
- `src/lib/api-contract.ts`: request/response types expected from the backend.
- `src/lib/payment-adapter.ts`: redirects either to the local placeholder payment callback or the real gateway `paymentUrl` returned by backend.

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
- `customer.notes`
- `items[].productId`
- `items[].productSlug`
- `items[].productCode`
- `items[].variantId`
- `items[].variantName`
- `items[].quantity`
- `items[].price` — frontend display price only; backend must recalculate
- `deliveryMethod`: `standard | chilled | pickup`
- `paymentProvider`: `gateway-placeholder | zarinpal | idpay | nextpay`

Response shape: `CreateOrderResponse`.

The backend must calculate final prices, delivery fees, product availability, cold-delivery eligibility and discounts server-side. Never trust frontend prices.

## Payment verification

### `POST /api/payments/verify`
Verifies a payment callback.

Request shape: `VerifyPaymentRequest`.

Response shape: `VerifyPaymentResponse`.

The frontend payment callback page reads possible gateway values from query params:
- `order`
- `authority` or `Authority`
- `token`
- `status`

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

Current frontend fallback route is:

```txt
/payment/callback?order={orderId}&status=paid
```

After a real gateway is connected:
1. Set `VITE_USE_BACKEND=true`.
2. Set `VITE_API_BASE_URL`.
3. Set `VITE_PAYMENT_PROVIDER=zarinpal` or the chosen provider.
4. `POST /api/orders` returns `paymentUrl`.
5. Frontend redirects to `paymentUrl`.
6. Gateway redirects back to `/payment/callback`.
7. Frontend calls `/api/payments/verify` when `authority` or provider token exists.
8. Backend returns final order/payment status.

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
