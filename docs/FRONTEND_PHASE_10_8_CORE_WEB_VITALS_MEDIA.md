# Frontend Phase 10.8 — Core Web Vitals and Media

Status: `core_web_vitals_media=ready`

## Objective

Phase 10.8 locks the storefront's critical rendering path, media behavior and measurable user-experience signals before the final SEO release-candidate phase.

The good-experience targets are evaluated independently for mobile and desktop at the 75th percentile:

- Largest Contentful Paint (LCP): at or below 2.5 seconds
- Interaction to Next Paint (INP): at or below 200 milliseconds
- Cumulative Layout Shift (CLS): at or below 0.1

Synthetic browser checks are release gates. Field data is collected separately because laboratory and real-user measurements answer different questions.

## 10.8A — LCP critical path

- the homepage hero remains present in the first server-rendered HTML
- its intrinsic width and height reserve layout space before decoding
- it is eager and high-priority
- the compiled fingerprinted hero URL is preloaded from the document head
- the preload and the rendered image reference the same bundled asset
- no client-side request is required to discover the LCP candidate

## 10.8B — Media loading contract

`OptimizedImage` provides one typed media primitive for:

- explicit eager or lazy loading
- explicit network priority
- asynchronous decoding
- intrinsic dimensions
- responsive `sizes`
- optional `<picture>` sources when authoritative derivatives exist

The frontend does not invent resized backend URLs. Product and article media continue to use the authoritative Laravel URLs. Responsive source sets can be supplied only when the media pipeline exposes real derivatives.

Product detail media is high-priority because it can become that route's LCP candidate. Thumbnails, article covers and below-fold images are lazy and low-priority.

## 10.8C — CLS, paint and interaction stability

- media frames reserve aspect-ratio and intrinsic dimensions
- scrollbar space is stable
- media frames use layout and paint containment
- coarse-pointer and reduced-motion devices avoid decorative image scaling
- reduced-data users receive a cheaper decorative path
- existing passive, requestAnimationFrame-based scroll handling remains intact
- the production scroll profiler continues to run with 4x CPU throttling

The phase does not hide content with unstable placeholders and does not replace authoritative SSR content with client-only rendering.

## 10.8D — Field Core Web Vitals transport

The browser observes:

- `largest-contentful-paint` for LCP
- non-input `layout-shift` entries for CLS
- interaction event timing for INP

Metrics are sent on page exit with `sendBeacon`, with a keepalive fetch fallback.

The payload is deliberately bounded to:

- metric name, value and rating
- route
- navigation type
- viewport dimensions
- random page identifier
- recording timestamp

The endpoint does not collect IP addresses in the application payload, user-agent strings, customer identifiers, order identifiers, form values or page content. The Node runtime validates an 8 KiB maximum body and emits structured `WINIMI_WEB_VITAL` log records. Production log shipping and percentile dashboards belong to Phase 19 infrastructure.

## 10.8E — Release gates

Build budgets now enforce:

- largest client JavaScript chunk gzip: 150 KiB
- total client JavaScript gzip: 700 KiB
- largest CSS gzip: 50 KiB
- largest production image: 750 KiB
- total production image bytes: 5 MiB
- minimum route-split JavaScript chunks: 12
- SSR runtime gzip: 2.5 MiB

The acceptance matrix includes:

- source audit
- threshold and INP-selection unit tests
- ESLint and TypeScript
- production build and media budget
- raw SSR hero preload verification
- desktop and mobile LCP, CLS and interaction lab checks
- RUM endpoint validation and privacy headers
- product and article media dimension checks
- Release A/B, atomic deployment and rollback
- real Laravel browser acceptance
- PWA, adversarial and CPU-throttled runtime regressions

## Completion marker

`core_web_vitals_media=ready`
