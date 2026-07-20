# Winimi Bakery Full Launch Roadmap

Roadmap lock: `2026-07-20-phase-18`

## Required final state

The storefront, backend, administration and production server are completed before external activation. At the end of internal work, only these three supplied values may remain:

1. payment gateway credentials / Zarinpal Merchant ID
2. eNAMAD badge code
3. SMS provider API key and approved OTP template

No production dynamic flow may depend on static demo data, browser-only orders or mock authentication.

## Phase 17 — Full frontend/backend integration — complete

Status: `frontend_integrated=ready`

The storefront consumes the frozen backend contract `2026-07-20-phase-16`. Production builds use `VITE_USE_BACKEND=true` and `VITE_ALLOW_DEV_MOCKS=false`.

### Integrated surfaces

- one typed API client parses `{ success, data, message, meta }`
- Sanctum CSRF, credentialed cookies, XSRF header and one-time 419 retry
- backend categories, products, details, filters, sorting and pagination
- OTP, session bootstrap, profile and customer-owned addresses
- cart Variant, price and stock reconciliation before Checkout
- server delivery options, fees, packaging and preparation estimates
- server-authoritative checkout with Idempotency-Key
- customer-owned orders, cancellation, timeline and tracking
- separate payment initiation, retry and backend-only callback verification
- pages, posts, FAQ, gallery, cities, reviews and persisted inquiries
- safe eNAMAD slot with no raw HTML execution
- production removal of static catalog fallback, browser orders and mock auth

## Phase 18 — End-to-end completion — complete

Status: `end_to_end_verified=ready`

### Coordinated acceptance environment

GitHub Actions starts both repositories on one runner:

```text
http://127.0.0.1:4173 -> React/Vite storefront
http://127.0.0.1:8000 -> Laravel API
```

Laravel uses SQLite, deterministic `WinimiStagingSeeder`, testing OTP and testing payment provider. No external SMS, payment or eNAMAD service is called.

### Browser acceptance

- pinned Playwright Chromium runner
- desktop Chrome and Pixel 7 projects
- backend contract and exact three-external-input boundary
- backend staging catalog rendered in the products UI
- search and URL filter behavior
- protected account redirect
- real OTP request/verify through Laravel and Sanctum Cookie session
- authenticated account route and server session inspection
- logout and session invalidation
- public blog and city content
- payment callback-state route and not-found route
- page-error guard and mobile horizontal-overflow check

### Backend acceptance

- frozen contract remains `2026-07-20-phase-16`
- OTP, secure session and logout
- customer address persistence
- dry nationwide delivery
- chilled delivery rejection outside Tehran/Karaj/Andisheh
- chilled Tehran checkout
- checkout replay and idempotency conflict
- testing-provider initiation and verification
- duplicate callback replay
- stock consumption exactly once
- persisted inquiry, duplicate and honeypot protections

### Quality gates

- Phase 17 integration audit
- Phase 18 acceptance audit
- frontend route, accessibility, content and modern UI audits
- ESLint and TypeScript
- production build and performance budget
- backend migrations, seed, config/route cache and PHPUnit
- browser artifacts, traces, screenshots and logs retained on failure

## Phase 19 — Production server deployment — next

Both repositories will run on one Linux server while remaining separate release artifacts:

- `winimibakery.com` serves the immutable Vite build
- `api.winimibakery.com` serves Laravel, Filament and media
- Nginx provides two virtual hosts on the same machine
- DNS, TLS, secure Cookie/CORS configuration
- production database and persistent storage
- queue worker and one-minute scheduler
- backups, restore drill, logs, monitoring and rollback
- disabled-provider production smoke tests
- `production_deployed=ready`

See `docs/SINGLE_SERVER_TOPOLOGY.md`.

## Phase 20 — External activation only

No feature development is allowed. Only:

1. insert payment gateway credentials and run a low-value live payment
2. insert the eNAMAD badge code
3. insert the SMS API key/template and verify OTP/order messages

## Frontend integration invariants

- static products are not a production source
- browser storage is not the source of truth for orders or authentication
- every API response passes through one typed envelope parser
- checkout totals and availability come from server responses
- payment query parameters never create trusted paid state
- all production forms persist through backend endpoints
- no payment, SMS or eNAMAD secret is stored in frontend code or `VITE_*`
- the public API contract remains frozen unless explicitly versioned

## External-only boundary

The final three external inputs are fixed and may not be expanded:

- `ZARINPAL_MERCHANT_ID` or equivalent gateway credential
- `ENAMAD_BADGE_CODE`
- `KAVENEGAR_API_KEY` and approved `KAVENEGAR_TEMPLATE`
