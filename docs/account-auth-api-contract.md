# Account and OTP API Contract

The frontend account flow is designed for Laravel using secure server-managed sessions. SMS provider credentials, OTP values, session tokens and authorization rules must never be implemented as trusted frontend logic.

## Frontend environment

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_AUTH_MODE=disabled
```

When `VITE_USE_BACKEND=true`, the frontend automatically uses backend authentication regardless of `VITE_AUTH_MODE`.

Laravel-only secrets:

```env
SMS_PROVIDER=kavenegar
KAVENEGAR_API_KEY=...
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=winimibakery.com
```

Do not expose provider keys or authentication secrets through `VITE_*` variables.

## Session architecture

Recommended production setup:

- HTTPS only.
- HttpOnly, Secure and SameSite session cookie.
- CORS restricted to the production frontend origin.
- `credentials: include` supported for all account requests.
- Rotate the session ID after OTP verification.
- Invalidate the session server-side on logout.
- Do not store bearer access tokens in LocalStorage.

## 1. Request OTP

`POST /api/auth/otp/request`

Request:

```json
{
  "mobile": "09123456789"
}
```

Response:

```json
{
  "challengeId": "OTP-random-public-id",
  "expiresIn": 120,
  "retryAfter": 60
}
```

Laravel requirements:

1. Normalize Persian, Arabic and English digits.
2. Validate Iranian mobile format.
3. Generate OTP with a cryptographically secure random generator.
4. Store only a cryptographic hash of the OTP.
5. Bind the OTP to the mobile and challenge ID.
6. Expire challenges quickly, for example after two minutes.
7. Apply rate limits by IP, mobile and device/session.
8. Enforce resend cooldown.
9. Return the same generic response for existing and new users.
10. Never include the OTP in production responses or logs.

## 2. Verify OTP

`POST /api/auth/otp/verify`

Request:

```json
{
  "mobile": "09123456789",
  "challengeId": "OTP-random-public-id",
  "code": "123456"
}
```

Response:

```json
{
  "user": {
    "id": "user-id",
    "mobile": "09123456789",
    "fullName": "Optional Name",
    "createdAt": "2026-07-19T07:00:00.000Z"
  }
}
```

Laravel requirements:

1. Verify challenge ownership, hash, expiry and attempt count atomically.
2. Invalidate the challenge after successful verification.
3. Lock or invalidate after a small number of failed attempts.
4. Find or create the user by normalized unique mobile.
5. Rotate the Laravel session ID.
6. Authenticate the user through the server session cookie.
7. Record security events without logging OTP values.

## 3. Current user

`GET /api/auth/me`

Authenticated response:

```json
{
  "user": {
    "id": "user-id",
    "mobile": "09123456789",
    "fullName": "Customer Name",
    "createdAt": "2026-07-19T07:00:00.000Z"
  }
}
```

Unauthenticated response should use HTTP `401`.

## 4. Logout

`POST /api/auth/logout`

Laravel must:

- invalidate the authenticated session,
- regenerate the CSRF token when applicable,
- expire the session cookie,
- return a generic success response.

Response:

```json
{
  "success": true
}
```

## 5. Update profile

`PATCH /api/account/profile`

Request:

```json
{
  "fullName": "Customer Name"
}
```

Response:

```json
{
  "user": {
    "id": "user-id",
    "mobile": "09123456789",
    "fullName": "Customer Name"
  }
}
```

The mobile number must not be changed through this endpoint unless a separate verified mobile-change flow is implemented.

## 6. List owned orders

`GET /api/account/orders`

Response:

```json
{
  "orders": []
}
```

The query must scope orders to `auth()->id()` or the server-side account relation. Never accept a mobile number from the frontend as the ownership filter.

Recommended capabilities:

- pagination,
- status filter,
- date filter,
- stable descending order by creation time,
- compact list resources rather than full payment-provider payloads.

## 7. Read one owned order

`GET /api/account/orders/{orderId}`

Response:

```json
{
  "order": {}
}
```

Authorization requirements:

- use a policy or scoped query,
- return `404` for orders that do not exist or are not owned by the authenticated user,
- never rely on the frontend route guard as authorization,
- prefer non-sequential public order identifiers.

## Security checklist

- Rate-limit OTP request and verification endpoints.
- Add abuse monitoring for repeated mobiles and IP addresses.
- Hash OTP values and never persist plaintext codes.
- Use short expirations and limited attempts.
- Regenerate sessions after login.
- Use HttpOnly cookies rather than LocalStorage tokens.
- Authorize every account-order endpoint server-side.
- Avoid revealing whether a mobile is already registered.
- Protect state-changing cookie-authenticated requests against CSRF according to the chosen Laravel architecture.
- Redact mobile numbers and personal data in application logs.
