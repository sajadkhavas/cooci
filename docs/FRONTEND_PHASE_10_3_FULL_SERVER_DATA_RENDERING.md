# Frontend Phase 10.3 — Full Server Data Rendering

Marker: `full_public_ssr=ready`

## Goal

Every public, indexable route must receive its authoritative Laravel data before React renders the HTML response. JavaScript hydration enhances the page but is no longer required for a crawler to see the primary product, category, article or city content.

## Delivered surfaces

- homepage catalog and category data
- all-products shop and category shop data
- product detail data with real 404 responses
- blog listing and blog detail data
- city content plus featured catalog data
- React Query hydration from route loader data
- fail-closed 503 responses when authoritative public data is unavailable
- `noindex` error boundaries for temporary failures
- raw-source Playwright acceptance without browser hydration

## Runtime contract

Laravel remains the source of truth. React Router Framework Mode loaders call the frozen Phase 16 API contract on the server, serialize safe public loader data, and seed the matching React Query cache during the first render.

Public loader failures follow these rules:

- missing product, category, article or city: HTTP 404
- unavailable API, timeout, rate limit or invalid contract: HTTP 503
- error HTML is marked `noindex,nofollow`
- private cart, account, checkout and payment routes remain outside public SSR data loading

## Acceptance

The Phase 18 browser topology now checks raw response HTML for deterministic Laravel staging content on:

- `/`
- `/products`
- `/products/category/staging-cookies`
- `/products/staging-chocolate-cookie`
- `/blog`
- `/blog/staging-welcome`
- `/city/staging-tehran`

It also verifies real 404 status codes for missing product, article and city routes.
