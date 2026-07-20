# Winimi Bakery frontend full audit roadmap

Audit lock: `2026-07-20-frontend-full-audit`

## Stage 0 — Technology and language inventory

The frontend and its production delivery surface use these languages and configuration formats:

- TypeScript and TSX: application logic, React components, API contracts and state
- JavaScript / MJS: build-time audits, sitemap generation and performance tooling
- CSS: semantic tokens, Tailwind layers, responsive layout and brand overrides
- HTML: application shell and offline fallback
- JSON / Web Manifest: package metadata, TypeScript configuration and PWA metadata
- YAML: GitHub Actions CI and coordinated browser acceptance
- SVG / XML: brand logo and installable app icons
- Nginx configuration: production routing, caching and security headers
- Shell commands: release build, CI, deployment and health checks

The connected backend additionally uses PHP, Laravel migrations/Eloquent for SQL schema management and server-side deployment configuration. The frontend audit treats the Laravel API contract as an external security boundary and does not trust browser state for authentication, price, stock, delivery or payment truth.

## Audit rule

A green build is not proof that the codebase is bug-free. Every phase combines:

1. line-by-line source review
2. threat and failure-mode analysis
3. deterministic regression checks
4. browser acceptance where relevant
5. production deployment validation

No phase is marked complete until its fixes are merged and CI is green.

## Phase 1 — Transaction safety, mocks and production boundary

Scope:

- CheckoutPage
- checkout.ts
- CheckoutGuard
- development catalog loading
- payment initiation failure after successful order creation
- idempotency lifecycle and duplicate-order prevention
- stale development cart recovery
- removal of eager mock catalog imports from the production path
- Nginx SPA, cache and security-header template

Exit criteria:

- an order created successfully is never reported as a failed checkout only because payment initiation failed
- checkout retry does not rotate the key after an ambiguous network result
- development-only catalog assets are lazy and unavailable in production mode
- stale mock cart items have a recoverable UI instead of an infinite spinner
- Nginx configuration replaces assumptions made by `public/_headers`

## Phase 2 — API client, authentication and session security

Scope:

- api.ts
- auth.ts
- AuthContext
- LoginPage
- ProtectedRoute
- CSRF/XSRF handling
- 401/419/429 behavior
- timeout, abort, retry and reconnect behavior
- redirect validation and session expiry

Exit criteria:

- no open redirect
- no browser token source of truth
- safe session-expiry recovery
- deterministic error mapping
- authentication browser tests for mobile and desktop

## Phase 3 — Catalog, cart and product correctness

Scope:

- backend-contract.ts
- catalog-api.ts
- catalog.ts
- cart.ts
- CartContext
- ProductsPage
- CategoryPage
- ProductDetailPage
- CartPage

Exit criteria:

- server Variant IDs remain authoritative
- stale products and variants become explicitly unavailable
- quantity and stock boundaries are deterministic
- no production fallback to static product truth
- search/filter/pagination state is URL-safe and accessible

## Phase 4 — Orders and payment user experience

Scope:

- orders.ts
- OrderDetailPage
- PaymentCallbackPage
- PaymentMockPage
- retry and cancellation UI
- duplicate callbacks and terminal payment states

Exit criteria:

- paid orders never expose a retry action
- callback URL parameters never create trusted paid state
- order-created/payment-failed state is recoverable
- browser back/refresh and duplicate callback are safe

## Phase 5 — Content pages and persisted forms

Scope:

- content.ts
- HomePage
- Blog pages
- CityPage
- GiftPage
- CorporatePage
- ContactPage
- ReviewsPage
- GalleryPage
- FAQPage
- legal and policy pages
- InquiryForm and trust components

Exit criteria:

- every production form persists through the backend
- loading, empty, error and not-found states exist
- no unsafe HTML or trust-badge execution
- SEO metadata does not publish unverified claims

## Phase 6 — Layout, components and accessibility

Scope:

- Header
- Footer
- SiteLayout
- navigation and dialogs
- all shared components
- Radix wrappers used by production pages
- keyboard, focus, landmarks, labels and motion preferences

Exit criteria:

- complete keyboard navigation
- no focus trap leaks
- correct mobile safe areas
- no horizontal overflow
- accessible loading and error announcements

## Phase 7 — Build, PWA and performance

Scope:

- App routing and code splitting
- Vite configuration
- Tailwind and PostCSS
- service worker and offline page
- manifest and icons
- asset budgets and cache invalidation

Exit criteria:

- no development-only assets in production entry chunks
- service worker cannot pin obsolete checkout behavior
- immutable asset caching and no-cache HTML/SW rules
- measured production bundle budgets

## Phase 8 — Production deployment readiness

Scope:

- environment schema
- Nginx configuration
- release directories and rollback
- CSP and security headers
- compression and caching
- health checks
- production smoke-test checklist

Exit criteria:

- frontend release is reproducible
- secrets are absent from the bundle
- SPA routes work through Nginx
- HTTPS and security headers are verified
- rollback is documented and tested

## Phase 9 — Final adversarial acceptance

Scope:

- desktop and mobile browser matrix
- offline/reconnect
- expired session
- rate limiting
- stale cart
- changed stock
- changed delivery zone
- duplicate submit
- payment cancellation/failure/success/replay
- malformed and hostile URL inputs

Final marker:

`frontend_security_and_deployment_audited=ready`
