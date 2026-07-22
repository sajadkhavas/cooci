# Frontend Phase 10.2 — Unified shop and categories

Marker: `unified_shop_categories=ready`

## Customer-facing rule

Winimi exposes one shop experience. The customer sees category navigation, search, shipping and stock filters, sorting, pagination and product results inside the same storefront UI.

## SEO rule

- `/products` is the all-products shop.
- `/products/category/:slug` keeps a unique crawlable URL, H1, metadata, canonical path, CollectionPage and ItemList schema, and evidence-safe editorial content.
- Category routes use the same `ProductsPage` route module and filtering UI.
- `/categories` permanently redirects to `/products` with HTTP 301 and is excluded from the sitemap.
- Legacy `?category=...` and `?diet=true` URLs permanently redirect to the matching category URL.
- Search, shipping, stock and non-default sort states are `noindex` and canonicalize to the clean pathname.

## Navigation rule

Header, footer, homepage and the category showcase no longer send customers to a standalone category index. Category cards link directly to the corresponding category-aware shop route.
