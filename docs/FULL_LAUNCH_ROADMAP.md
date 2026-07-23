# Winimi Bakery Full Launch Roadmap

Roadmap lock: `2026-07-23-phase-10-9`

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

## Frontend SEO delivery sequence

### Phase 10.1 — SSR foundation — complete

Status: `frontend_ssr_foundation=ready`

React Router Framework Mode, Node SSR, streaming HTML, client hydration, CSP nonces, release packaging, Nginx proxying and rollback are complete.

### Phase 10.2 — Unified shop categories — complete

Status: `unified_shop_categories=ready`

The all-products shop and crawlable category routes share one canonical catalog experience with hardened legacy redirects.

### Phase 10.3 — Full server data rendering — complete

Status: `full_public_ssr=ready`

Authoritative Laravel catalog, product, article and city data is loaded before the first public HTML response. Missing public resources return 404 and unavailable authoritative data returns 503 instead of indexable empty content.

### Phase 10.4 — Crawl, index and URL architecture — complete

Status: `crawl_index_url_architecture=ready`

Laravel-backed dynamic sitemap and robots resource routes replace static source-scanned files. Clean pagination is self-canonical with previous/next links, duplicate page URLs permanently redirect, filtered collection URLs return HTML and HTTP `noindex,follow`, and account/cart/checkout/payment surfaces return `noindex,nofollow`.

### Phase 10.5 — Product and merchant SEO — complete

Status: `product_merchant_seo=ready`

Authoritative Product JSON-LD is rendered in the initial HTML from Laravel product, preferred Variant, verified price, inventory, media and approved reviews. Offers are omitted when price or inventory cannot be verified, visible reviews match rating markup, category breadcrumbs use crawlable routes, and the frontend never fabricates shipping or return policy. ProductGroup remains blocked until direct stable variant URLs exist.

### Phase 10.6 — Content and topical authority foundation — complete

Status: `content_topical_authority=ready`

Published Laravel post categories form the only production topic taxonomy. Crawlable server-rendered topic hubs, visible category links, same-topic related articles, Blog/CollectionPage/BlogPosting structured data and sitemap topic entries all use the same authoritative content values. Unknown topics return 404/noindex, related content is omitted instead of fabricated, and the frontend does not invent editorial claims or article modification dates.

### Phase 10.7 — Local SEO and brand entity — complete

Status: `local_seo_brand_entity=ready`

Every public SEO surface emits one stable Organization and WebSite identity with consistent configured name, phone, email, locality, region and official social profile. `/locations` and `/city/:slug` are server-rendered only from successfully resolved Laravel city pages, use crawlable visible links and matching CollectionPage/Service schemas, permanently redirect duplicate local URLs, and share the same authoritative inventory with the dynamic sitemap. Service-area pages explicitly do not claim physical branches, exact street addresses, coordinates or fixed opening hours.

### Phase 10.8 — Core Web Vitals and media — complete

Status: `core_web_vitals_media=ready`

The homepage LCP image is discoverable from the server-rendered head and rendered with eager high network priority plus intrinsic dimensions. Product and article media follow one typed loading contract with reserved layout space, responsive sizes and low-priority lazy loading below the fold. Rendering containment, stable scrollbar space, reduced-motion and reduced-data paths protect CLS and interaction work. Production builds enforce JavaScript, CSS, SSR and media budgets. Privacy-bounded field LCP/INP/CLS records are accepted by the Node runtime and emitted as structured logs without customer, order, form, IP or user-agent fields in the application payload. Desktop and mobile lab gates verify LCP, CLS and interaction targets while the existing CPU-throttled scroll profiler remains mandatory.

### Phase 10.9 — SEO acceptance and release candidate — complete

Status: `seo_release_candidate=ready`

The dynamic sitemap is now the final indexable inventory. Desktop Chromium and Pixel 7 independently request every sitemap URL before hydration and verify HTTP 200, HTTPS origin, title, description, one self-canonical URL, indexability, Open Graph/Twitter metadata, exactly one H1, parseable JSON-LD, stable Organization/WebSite entities and route-specific schema. The same gate verifies redirects, 404/noindex behavior, filtered and private noindex policy, robots declarations and internal links without 404/5xx or legacy category URLs. Both viewport reports must share the same sitemap SHA-256. Their merged evidence is cryptographically bound to the deterministic SSR release manifest in `seo-release-candidate.json`, while the backend contract and production origin/mock boundary remain frozen.

Production deployment may now begin in Phase 19. Search Console submission, URL Inspection, live Rich Results validation and field percentile dashboards require the public deployment and remain Phase 19/21 work.

## Phase 19 — Production server deployment — ready to begin

Both repositories will run on one Linux server while remaining separate release artifacts:

- `winimibakery.com` runs the Node SSR storefront behind Nginx
- immutable client assets are served directly by Nginx
- `api.winimibakery.com` serves Laravel, Filament and media
- Nginx provides two virtual hosts on the same machine
- DNS, TLS, secure Cookie/CORS configuration
- production database and persistent storage
- queue worker and one-minute scheduler
- backups, restore drill, logs, monitoring and rollback
- disabled-provider production smoke tests
- Search Console ownership, sitemap submission and representative URL Inspection
- production Core Web Vitals log shipping and 75th-percentile dashboards
- `production_deployed=ready`

See `docs/SINGLE_SERVER_TOPOLOGY.md` and the SSR deployment documents.

## Phase 20 — External activation only

No feature development is allowed. Only:

1. insert payment gateway credentials and run a low-value live payment
2. insert the eNAMAD badge code
3. insert the SMS API key/template and verify OTP/order messages

## Frontend integration invariants

- static products are not a production source
- browser storage is not the source of truth for orders or authentication
- every API response passes through one typed envelope parser
- public indexable data is present in server-rendered HTML
- product price, inventory, media and review markup come from authoritative server-loaded data
- published Laravel post categories are the only source of production content topics
- visible topic links, related content, structured data and sitemap entries use the same authoritative published posts
- every public SEO page uses the same stable Organization and WebSite identifiers
- visible NAP and JSON-LD values come from one configured brand source
- only successfully resolved Laravel city pages enter `/locations`, local schemas and the sitemap
- service-area pages never imply a physical branch or invent street address, coordinates or fixed hours
- the primary LCP media candidate is discoverable in the first HTML and reserves intrinsic layout space
- the frontend never fabricates image derivatives; responsive sources require authoritative media variants
- below-fold media is lazy and low-priority while route-level LCP media is explicitly prioritized
- field Core Web Vitals payloads exclude customer, order, form, IP and user-agent fields at the application layer
- production releases remain inside locked JavaScript, CSS, SSR and image budgets
- every sitemap URL must pass raw HTML, status, canonical, metadata, H1 and structured-data acceptance on desktop and mobile
- missing or private URLs must expose the correct noindex policy and never enter the sitemap
- internal links from indexable pages must not resolve to 404/5xx or legacy category URLs
- the final SEO acceptance report and deterministic release manifest are bound by SHA-256 in one verifiable release candidate
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
