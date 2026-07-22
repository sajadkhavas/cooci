# Frontend Phase 10.4 — Crawl, Index and URL Architecture

## Goal

Give every public Winimi URL one deterministic crawl and index policy before product, merchant, content and local SEO work continues.

Final marker: `crawl_index_url_architecture=ready`

## 10.4A — Central URL policy

`src/lib/seo/url-policy.ts` is the only registry for:

- crawlable static paths
- private route prefixes
- public city slugs used for Laravel validation
- exact legacy redirects
- canonical pagination rules
- filtered URL index policy
- generated robots directives

Known legacy `/categories` requests permanently redirect to `/products`. Page-one query duplicates and out-of-range pagination also resolve through permanent redirects instead of returning duplicate indexable documents.

## 10.4B — Dynamic sitemap and robots

`/sitemap.xml` and `/robots.txt` are React Router resource routes. Static build-time copies and source-scanned demo sitemap generation were removed.

The sitemap is generated from:

- public static storefront routes
- Laravel catalog categories
- every paginated Laravel product
- every paginated published Laravel post
- configured city slugs that are confirmed by the Laravel city endpoint

Product `updatedAt` and post `publishedAt` values become sitemap `lastmod` values when valid. Duplicate paths are removed and output is sorted deterministically.

If authoritative data is unavailable, the sitemap fails closed with HTTP 503, `Retry-After`, `no-store` and `noindex` instead of publishing an incomplete index surface.

The production city registry defaults to `tehran`, `karaj` and `andisheh`. Tests may override it through the server-only `WINIMI_PUBLIC_CITY_SLUGS` value. This is deployment configuration, not an external provider credential.

## 10.4C — Canonical pagination

Clean collection pagination is self-canonical:

- `/products` is the canonical first page
- `/products?page=2` is canonical for page two
- category and blog pagination follow the same rule
- page two and later expose `rel=prev` and `rel=next`
- `?page=1`, malformed pages and pages beyond the final page permanently redirect to the one valid URL

The SEO component derives total pages from server loader data, so canonical and pagination links are present in the first HTML response.

## 10.4D — Filter and private-route index policy

Search, sort, stock, shipping and unknown query combinations remain accessible to users and crawlers, but they return:

- clean collection canonical
- HTML `meta robots=noindex,follow`
- HTTP `X-Robots-Tag: noindex,follow`

Private and transaction surfaces return HTTP `noindex,nofollow`:

- `/account`
- `/cart`
- `/checkout`
- `/payment`
- `/__ssr_health`

Robots disallows private route prefixes but does not block filtered public pages, allowing crawlers to receive their `noindex,follow` response.

## 10.4E — Acceptance

Automated evidence includes:

- URL policy unit tests
- stale static sitemap/robots prohibition
- Phase 10.4 source architecture audit
- dynamic sitemap and robots deployment smoke test
- Laravel-backed Playwright sitemap checks
- filtered collection HTML and HTTP noindex checks
- canonical redirect checks
- private-route HTTP header checks
- existing SSR, PWA, adversarial and runtime gates

## Completion

- dynamic crawl resources are authoritative
- one canonical address exists for each indexable collection page
- filtered pages cannot enter the index
- private and transaction pages cannot enter the index
- legacy and pagination duplicates permanently converge
- no static demo data contributes URLs to production sitemap output

`crawl_index_url_architecture=ready`
