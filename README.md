# Winimi Bakery Storefront

Production storefront for Winimi Bakery, built with React, TypeScript, Vite and Tailwind CSS. The frozen Laravel API lives in `sajadkhavas/winimi-bakery-backend`.

## Current status

| Area | Status |
|---|---|
| Responsive storefront and modern editorial UI | Complete |
| Shared typed API client and frozen envelope | Complete in Phase 17 |
| Catalog, categories, filters and pagination | Backend integrated in Phase 17 |
| OTP, secure session, profile and addresses | Backend integrated in Phase 17 |
| Cart reconciliation, delivery quote and checkout | Backend integrated in Phase 17 |
| Orders, cancellation, payment and callback verification | Backend integrated in Phase 17 |
| Content, reviews, inquiry forms and trust slot | Backend integrated in Phase 17 |
| End-to-end browser completion | Complete in Phase 18 |
| Node SSR foundation | Complete in Phase 10.1 |
| Unified crawlable shop categories | Complete in Phase 10.2 |
| Full server data rendering for public SEO routes | Complete in Phase 10.3 |
| Crawl, index and canonical URL architecture | Complete in Phase 10.4 |
| Product and merchant SEO | Complete in Phase 10.5 |
| Content and topical authority | Complete in Phase 10.6 |
| Local SEO and brand entity | Complete in Phase 10.7 |
| Core Web Vitals and media | Complete in Phase 10.8 |
| SEO release acceptance | Phase 10.9 |
| Production deployment | Phase 19 after Phase 10.9 |
| External activation only | Phase 20 |

## Production integration boundary

- Every Laravel response passes through one typed `{ success, data, message, meta }` parser.
- The frontend requires contract version `2026-07-20-phase-16`.
- Customer authentication uses an HttpOnly cookie and Sanctum CSRF.
- Production catalog, orders, content, reviews and forms come from the backend.
- Public product, category, article, topic, location hub and city data is loaded before the server sends indexable HTML.
- Missing public resources preserve real 404 responses; unavailable authoritative data fails closed with 503.
- Sitemap products, categories, posts, published topics, the location hub and published cities are generated from authoritative Laravel responses at request time.
- Filtered collection URLs are `noindex,follow`; private and transaction surfaces are `noindex,nofollow`.
- Clean collection pagination is self-canonical and duplicate page URLs permanently redirect.
- Product merchant JSON-LD is built from server-loaded Laravel price, stock, media and approved reviews.
- Product Offers are omitted when inventory or price cannot be verified; shipping and return policy are never invented in the frontend.
- Approved reviews rendered to customers are the only reviews eligible for Product rating markup.
- Content topics exist only when published Laravel posts expose the category; no static production taxonomy is added in the frontend.
- Topic hubs, article category links, related articles, Blog/CollectionPage/BlogPosting schemas and sitemap topic entries use the same authoritative content values.
- Related content is limited to published posts from the same topic and is omitted rather than fabricated when unavailable.
- Every public SEO page emits the same stable Organization and WebSite identifiers.
- Official phone, email, brand name, locality and social profile come from one configured brand source.
- `/locations`, city links, Service schemas and sitemap city entries use only successfully resolved Laravel city pages.
- Service-area pages do not claim physical branches, exact street addresses, coordinates or fixed opening hours.
- The homepage LCP image is preloaded from the first HTML, eager, high-priority and intrinsically sized.
- Product and article media reserve layout space and use explicit responsive sizes and network priorities.
- The frontend never fabricates resized backend media URLs; `<picture>` sources are supplied only when real derivatives exist.
- Production releases enforce JavaScript, CSS, SSR runtime, largest-image and total-image budgets.
- Privacy-bounded LCP, INP and CLS payloads are accepted by the Node runtime for structured production logging.
- Cart storage is only a convenience snapshot; Variants, price and stock are reconciled before checkout.
- Delivery options are informational and checkout recalculates every total on the server.
- Checkout creates an order first; payment initiation is a separate idempotent request.
- Callback parameters never mark an order paid without backend verification.
- Browser-only auth, orders and payment simulation require both Vite DEV mode and `VITE_ALLOW_DEV_MOCKS=true`.

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev
```

The default environment points to the production API contract:

```env
SITE_URL=https://winimibakery.com
VITE_SITE_ORIGIN=https://winimibakery.com
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_ALLOW_DEV_MOCKS=false
VITE_AUTH_MODE=disabled
VITE_PAYMENT_MODE=disabled
```

For an isolated local simulator, use a Vite development build and explicitly set `VITE_USE_BACKEND=false` plus `VITE_ALLOW_DEV_MOCKS=true`. This path is excluded from production builds.

## Validation

```bash
npm run check
```

Validation includes the launch roadmap, Phase 17 integration contract, SSR phases 10.1–10.8, Core Web Vitals thresholds, media budgets, routes, accessibility, content integrity, modern UI, ESLint, TypeScript and the production SSR build.

## Security boundary

The frontend never contains payment credentials, SMS provider keys, eNAMAD code, provider verification secrets or trusted payment state. eNAMAD settings are read from the backend; only HTTPS links and images on `trustseal.enamad.ir` are accepted by the prepared trust slot.

The Core Web Vitals application payload does not include customer identities, order information, form values, IP addresses or user-agent strings.

## Production domains

```text
https://winimibakery.com
https://www.winimibakery.com
https://api.winimibakery.com
```

## Remaining delivery phases

- Phase 10.9: SEO acceptance and release candidate
- Phase 19: production server, DNS, HTTPS, queue, storage, monitoring and rollback
- Phase 20: external activation only

The only external values allowed in Phase 20 are:

1. payment gateway credentials / Zarinpal Merchant ID
2. eNAMAD badge code
3. SMS provider API key and approved OTP template
