# Winimi Bakery Full Launch Roadmap

Roadmap lock: `2026-07-19-phase-13.5`

## Required final state

The storefront, backend, administration and production server are completed before external activation. At the end of internal work, only these three supplied values may remain:

1. payment gateway credentials / Zarinpal Merchant ID
2. eNAMAD badge code
3. SMS provider API key and approved OTP template

No production dynamic flow may depend on static demo data, browser-only orders or mock authentication after Phase 17.

## Current frontend audit

### Ready

- complete responsive route structure
- modern editorial design system
- cart UX and checkout forms
- OTP/login UI
- account and order UI
- payment callback and development mock screens
- accessibility/content/performance audits
- route splitting, PWA and hosting headers

### Integration gaps that must be removed

1. `src/hooks/useCatalog.ts` always returns static products and reports the backend as disabled.
2. category navigation is sourced from `src/data/products` instead of the catalog API.
3. `src/lib/auth.ts` expects direct response objects while Laravel returns the standard `{ success, data, meta }` envelope.
4. state-changing auth calls do not yet bootstrap Sanctum CSRF through `/sanctum/csrf-cookie`.
5. backend OTP debug code is named `debugCode`, while the frontend development type currently expects `devCode`.
6. `src/lib/orders.ts` stores production-shaped orders in `localStorage` and account screens read those local records.
7. `src/lib/checkout.ts` still contains browser-authoritative delivery fees/totals and expects payment initiation in the checkout response.
8. the Phase 13 backend creates an awaiting-payment order first; Phase 14 will expose payment initiation separately.
9. backend catalog pagination/filtering is not used; the frontend filters and paginates a full static array.
10. contact, corporate, gift, reviews, blog, gallery, city and trust content are not yet connected to bakery-specific backend sources.
11. the repository README is still the generated Lovable placeholder.
12. production server/deployment environment and full end-to-end API tests are not yet defined.

## Locked phases

### Phase 14 — Provider-ready payment backend

Backend-only phase. The storefront remains unchanged while the payment engine, testing provider and disabled-by-default Zarinpal adapter are completed without live credentials.

### Phase 15 — Complete store operations backend

Backend-only phase. Addresses, delivery rules, fees, fulfillment actions, content, reviews, forms, notification outbox, SMS adapter and eNAMAD placeholder are completed.

### Phase 16 — Backend completion and contract freeze

Backend-only phase. Every endpoint and response schema is frozen, tested and reported as `backend_complete=ready` before frontend connection begins.

### Phase 17 — Full frontend/backend integration

The storefront is connected to the frozen API:

- shared API client and standard envelope parsing
- Sanctum CSRF/session handling
- backend categories, catalog, product details, filters and pagination
- real OTP, account, profile and addresses
- server-reconciled cart and Variant availability
- server-authoritative checkout
- order list/detail/cancellation
- payment initiation/retry/callback UI
- content, reviews and inquiry forms
- development-only mock paths isolated from production
- static catalog fallback and localStorage orders removed from production

### Phase 18 — End-to-end completion

- automated integration and browser-flow tests
- mobile/desktop acceptance
- expired session, retry, reconnect and stock-conflict states
- final content, legal and trust pages
- SEO and structured data review
- accessibility and performance budgets
- admin/storefront acceptance checklist

### Phase 19 — Production server deployment

- production frontend and Laravel API
- domain/subdomain, DNS and HTTPS
- secure cookies and CORS
- database, media storage, queue and scheduler
- backups, logs, monitoring and rollback
- smoke tests with payment/SMS disabled or testing-only

### Phase 20 — External activation only

No feature development is allowed. Only:

1. insert payment gateway credentials and run a low-value live payment
2. insert the eNAMAD badge code
3. insert the SMS API key/template and verify OTP/order messages

## Frontend completion gate

The frontend may report `frontend_integrated=ready` only when:

- `VITE_USE_BACKEND=true` is validated against the deployed API
- static products are not a production source
- browser storage is not the source of truth for orders or authentication
- every API response passes through one typed envelope parser
- CSRF/session lifecycle works across `winimibakery.com` and `api.winimibakery.com`
- checkout totals and availability are displayed from server responses
- payment query parameters never mark an order paid without backend verification
- all production forms persist through backend endpoints

## External-only boundary

The final three external inputs are fixed and may not be expanded by later phases:

- `ZARINPAL_MERCHANT_ID` or equivalent gateway credential
- `ENAMAD_BADGE_CODE`
- `KAVENEGAR_API_KEY` and approved `KAVENEGAR_TEMPLATE`
