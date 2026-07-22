# Frontend Phase 10.5 — Product and Merchant SEO

## Goal

Publish merchant-ready Product structured data from the same authoritative Laravel values shown to customers, without inventing price, stock, reviews, shipping or return policy.

Final marker: `product_merchant_seo=ready`

## 10.5A — Authoritative Product schema

`src/lib/seo/product-merchant-schema.ts` is the only builder for product merchant JSON-LD.

The builder receives the product and approved review payload loaded by the public SSR route. The generic SEO component ignores page-authored Product markup when authoritative loader data exists and serializes the server-built schema into the first HTML response.

The schema may include:

- canonical product URL and stable product `@id`
- visible product name and verified description
- preferred purchasable SKU, model and size
- verified public product media
- Winimi brand identity
- an Offer derived from verified Laravel inventory and price
- approved visible reviews and their aggregate rating

## 10.5B — Merchant Offer boundary

An Offer is emitted only when:

- Laravel inventory is explicitly verified
- a positive finite current price exists
- the preferred purchasable variant or product stock snapshot is available

Toman prices are converted to Iranian rial for `priceCurrency=IRR`. Availability is derived from the same reconciled stock value used by the product UI.

No frontend fallback may invent:

- price
- availability
- condition other than the fixed new-product catalog condition
- shipping rates or delivery time
- return policy
- review count or score

Standard shipping and return policy markup remains intentionally absent until an authoritative store-level contract is available.

## 10.5C — Visible review parity

The product SSR loader requests only the approved public review endpoint. The response already excludes pending or rejected reviews and returns a server-calculated summary.

The first page of approved reviews is rendered beneath the product page. AggregateRating and Review JSON-LD are emitted only when the matching review summary is valid and the review content is present in that same page response.

Review endpoint failure is optional and fail-open for the product document:

- the product page remains available
- reviews show an unavailable state
- AggregateRating and Review markup are omitted
- no zero score or synthetic review is published

## 10.5D — Category breadcrumb and variant boundary

Legacy product breadcrumbs using `/products?category=...` are normalized to the crawlable `/products/category/:slug` route in both visible navigation and BreadcrumbList JSON-LD.

The current storefront has one canonical product URL and one preferred purchasable selection. ProductGroup and variant-specific URLs are intentionally not emitted until the UI supports direct variant preselection through stable unique URLs. This prevents variant markup from claiming destinations that customers cannot open directly.

## 10.5E — Acceptance

Automated evidence includes:

- unit tests for verified Offer generation
- unit tests proving unverified inventory removes the complete Offer
- unit tests for visible review and AggregateRating parity
- prohibition of invented shipping and return policy
- Phase 10.5 architecture audit
- deployment fixture with deterministic approved review data
- raw SSR product JSON-LD smoke checks
- Laravel-backed Playwright merchant acceptance
- all existing crawl, PWA, adversarial and runtime gates

## Completion

- Product JSON-LD is present in initial SSR HTML
- Offer price and availability match authoritative Laravel data
- approved reviews shown to users match review markup
- no MerchantReturnPolicy or OfferShippingDetails is fabricated
- category breadcrumbs use crawlable URLs
- no ProductGroup is emitted without direct variant URL support

`product_merchant_seo=ready`
