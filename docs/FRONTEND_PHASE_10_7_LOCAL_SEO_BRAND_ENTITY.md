# Frontend Phase 10.7 — Local SEO and Brand Entity

## Goal

Create one stable, verifiable brand identity across every public page and connect Laravel-managed city service pages into a crawlable local architecture without claiming physical branches, exact street addresses, coordinates or opening hours that have not been verified.

Final marker: `local_seo_brand_entity=ready`

## 10.7A — Stable brand entity

`src/lib/seo/brand-entity.ts` owns the shared JSON-LD identity:

- `https://<site-origin>/#organization`
- `https://<site-origin>/#website`
- brand name and alternate English name
- canonical website origin
- logo URL
- internationalized support phone
- official email
- bounded postal locality, region and country
- official Instagram profile

The same `Organization` and `WebSite` graph is emitted on every page that uses the central `SEO` component. Page-specific Product, Blog, Article, CollectionPage and Service schemas remain separate JSON-LD blocks so existing rich-result contracts stay discoverable.

The frontend deliberately omits:

- `LocalBusiness` or `Bakery` branch entities
- `streetAddress`
- `geo`
- `openingHoursSpecification`
- unsupported branch relationships

These fields may be added only after verified operational data has an authoritative backend contract.

## 10.7B — Authoritative location hub

`/locations` is a public server-rendered route. It is built only from city pages that:

1. are listed in the bounded server configuration `WINIMI_PUBLIC_CITY_SLUGS`, and
2. resolve successfully through the Laravel city-page endpoint.

Configured slugs that return 404 are omitted. Any other authoritative-data failure returns 503 instead of an indexable partial hub. When no published city page remains, `/locations` returns a real 404.

The hub contains:

- visible links to every published city page
- one `CollectionPage` and `ItemList`
- `City` references matching visible cards
- the same visible NAP values used by the central Organization entity
- an explicit notice that a service-area page does not imply a physical branch

Query-string duplicates permanently redirect to `/locations`.

## 10.7C — City service pages

Each `/city/:slug` request is server-rendered from Laravel. The returned Laravel slug owns the canonical URL; noncanonical paths or query strings permanently redirect.

The initial HTML contains:

- `WebPage`
- `City`
- `Service`
- `provider` linked to the stable Organization `@id`
- `areaServed` linked to the page City entity
- visible breadcrumb back to `/locations`
- visible official phone, email and declared brand locality
- a user-facing clarification that the page represents a service area, not a branch

The frontend does not generate a local branch entity for Tehran, Karaj, Andisheh or any other city.

## 10.7D — NAP and entity consistency

The phone, email, address locality, brand name and social identity come only from `src/config/brand.ts`.

The same values are used by:

- global Organization JSON-LD
- ContactPage schema and visible contact cards
- AboutPage schema
- location hub
- city pages
- footer identity block

The footer links to the authoritative `/locations` hub rather than hard-coded city URLs that may not be published.

## 10.7E — Sitemap and acceptance gates

The dynamic sitemap reuses the same published-city collection as `/locations`.

- `/locations` appears only when at least one published city page exists.
- only successfully resolved Laravel city slugs appear.
- configured but missing city pages are omitted.

Automated evidence includes:

- unit tests for stable entity IDs, NAP, schema relationships and forbidden physical-location claims
- a Phase 10.7 source architecture audit
- production SSR fixture checks for Organization, WebSite, CollectionPage, Service and NAP
- real Laravel Playwright checks on desktop and mobile
- canonical redirect, sitemap and 404/noindex checks
- all existing commerce, PWA, adversarial and CPU-throttled runtime regressions

## Completion

- every public SEO page exposes the same stable brand entity
- Product and content rich-result schemas remain intact
- published Laravel city pages form the only local landing-page inventory
- `/locations`, city pages, visible links, structured data and sitemap agree
- official NAP values are consistent across visible content and JSON-LD
- no physical branch, coordinate, street address or fixed opening-hour claim is invented

`local_seo_brand_entity=ready`
