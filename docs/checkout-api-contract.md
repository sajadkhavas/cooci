# Checkout and Payment API Contract

The frontend must never receive or store Zarinpal merchant credentials. Prices, discounts, stock, delivery eligibility and payable totals are authoritative only when recalculated by Laravel.

## Environment

Frontend:

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_PAYMENT_MODE=disabled
```

Laravel-only secrets:

```env
ZARINPAL_MERCHANT_ID=...
ZARINPAL_SANDBOX=false
FRONTEND_URL=https://winimibakery.com
```

Never expose Laravel secrets through variables prefixed with `VITE_`.

## 1. Create order and payment

`POST /api/checkout`

Headers:

```http
Content-Type: application/json
Accept: application/json
Idempotency-Key: CHK-unique-client-key
```

Request:

```json
{
  "customer": {
    "fullName": "Customer Name",
    "mobile": "09123456789",
    "province": "تهران",
    "city": "تهران",
    "address": "...",
    "postalCode": "1234567890",
    "notes": "..."
  },
  "deliveryMethod": "standard",
  "items": [
    {
      "productId": "product-id",
      "variantId": "optional-variant-id",
      "quantity": 2
    }
  ]
}
```

The client deliberately does not send trusted prices or totals. Laravel must:

1. Validate customer and delivery data.
2. Load active products and variants from the database.
3. Reject missing or inactive products.
4. Validate and reserve stock inside a database transaction.
5. Recalculate product prices, discounts, packaging, delivery and total.
6. Enforce chilled-delivery restrictions.
7. Reuse the previous response when the same idempotency key is repeated.
8. Create an `awaiting_payment` order and a pending payment attempt.
9. Request payment from Zarinpal using server-side credentials.

Response:

```json
{
  "order": {
    "id": "WIN-...",
    "createdAt": "2026-07-19T07:00:00.000Z",
    "updatedAt": "2026-07-19T07:00:00.000Z",
    "customer": {},
    "items": [],
    "subtotal": 500000,
    "packagingFee": 25000,
    "deliveryMethod": "standard",
    "deliveryFee": 85000,
    "total": 610000,
    "status": "awaiting_payment",
    "paymentStatus": "pending",
    "paymentAttempts": []
  },
  "payment": {
    "attemptId": "PAY-...",
    "redirectUrl": "https://www.zarinpal.com/pg/StartPay/...",
    "authority": "..."
  }
}
```

## 2. Retry payment for an existing order

`POST /api/orders/{orderId}/payments`

Headers:

```http
Idempotency-Key: CHK-new-unique-key
```

Request:

```json
{
  "provider": "zarinpal"
}
```

Laravel must reject paid, cancelled or expired orders, revalidate stock/order state as required and create a new payment attempt without duplicating the order.

The response shape matches `POST /api/checkout`.

## 3. Verify callback

`POST /api/payments/zarinpal/verify`

Request:

```json
{
  "orderId": "WIN-...",
  "authority": "authority-from-callback",
  "status": "OK"
}
```

Laravel must never trust `status=OK` alone. It must:

1. Find the order and matching pending payment attempt.
2. Read the canonical amount from the database.
3. Call Zarinpal verification from the server.
4. Accept only valid verification codes such as successful or already-verified responses.
5. Update order/payment state atomically.
6. Store the gateway reference ID.
7. Make verification idempotent so repeated callbacks return the same result.
8. Release reserved stock on failed/expired orders according to the inventory policy.

Response:

```json
{
  "state": "success",
  "order": {},
  "refId": "123456789"
}
```

Possible states:

- `success`
- `failed`
- `cancelled`
- `unknown`

## 4. Fetch order status

Recommended endpoint:

`GET /api/orders/{orderId}`

Use authenticated ownership or a short-lived order access token. Do not expose arbitrary orders by sequential ID.

## Security requirements

- Use HTTPS only.
- Apply rate limits to checkout, retry and verify endpoints.
- Use database transactions and row locking for stock.
- Keep idempotency records long enough to cover network retries.
- Never mark an order paid from frontend query parameters.
- Never accept frontend totals as authoritative.
- Never clear the frontend cart until the verified response state is `success`.
- Log provider request IDs and failures without logging merchant credentials or sensitive customer data.
