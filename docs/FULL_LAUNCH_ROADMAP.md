# Winimi Bakery Full Launch Roadmap

Roadmap lock: `2026-07-20-phase-17`

## Required final state

The storefront, backend, administration and production server are completed before external activation. At the end of internal work, only these three supplied values may remain:

1. payment gateway credentials / Zarinpal Merchant ID
2. eNAMAD badge code
3. SMS provider API key and approved OTP template

No production dynamic flow may depend on static demo data, browser-only orders or mock authentication after Phase 17.

## Phase 17 completion

Status: `frontend_integrated=ready`

The storefront implementation is connected to the frozen backend contract `2026-07-20-phase-16` and its production build runs with `VITE_USE_BACKEND=true` and `VITE_ALLOW_DEV_MOCKS=false`.

### Resolved integration gaps

- one typed API client parses the standard `{ success, data, message, meta }` envelope
- Sanctum CSRF, credentialed cookies, XSRF header and 419 retry are centralized
- backend categories, products, product details, filters, sorting and pagination replace the production static catalog source
- OTP, session bootstrap, profile and customer-owned addresses use backend endpoints
- cart Variants, current price and stock are reconciled from the backend before Checkout
- delivery methods, fees, packaging and preparation estimates are read from server responses
- Checkout sends only address/recipient data, Variant IDs and quantities; the server recalculates all totals
- order list, detail, cancellation, timeline, tracking and verified-purchase reviews use customer-owned endpoints
- payment initiation is separate from Checkout and retry remains attached to the same order
- callback query parameters never mark an order paid; only backend verification can clear the cart
- posts, pages, FAQs, gallery, cities, published reviews and inquiry forms use bakery-specific backend endpoints
- the eNAMAD slot reads public server settings and only accepts HTTPS URLs on `trustseal.enamad.ir`
- browser-only authentication, orders and payment simulation are limited to explicit Vite development mode
- production-shaped localStorage orders and the obsolete browser session compatibility layer are removed

### Phase 17 validation gate

The exact integration branch passed:

- full-launch roadmap audit
- Phase 17 API/security integration audit
- frontend route audit
- accessibility regression audit
- content integrity audit
- modern UI audit
- ESLint
- TypeScript typecheck
- production build
- performance budget audit

This readiness marker covers implementation and production-mode build validation. Browser automation, live cross-domain acceptance and deployed-environment smoke tests remain intentionally assigned to Phases 18 and 19.

## Locked remaining phases

### Phase 18 — End-to-end completion

- automated integration and browser-flow tests
- mobile/desktop acceptance
- expired session, retry, reconnect and stock-conflict states
- final live content/legal/trust acceptance
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

## Frontend integration invariants

- static products are not a production source
- browser storage is not the source of truth for orders or authentication
- every API response passes through one typed envelope parser
- checkout totals and availability are displayed from server responses
- payment query parameters never create trusted paid state
- all production forms persist through backend endpoints
- no payment, SMS or eNAMAD secret is stored in frontend code or `VITE_*`

## External-only boundary

The final three external inputs are fixed and may not be expanded by later phases:

- `ZARINPAL_MERCHANT_ID` or equivalent gateway credential
- `ENAMAD_BADGE_CODE`
- `KAVENEGAR_API_KEY` and approved `KAVENEGAR_TEMPLATE`
