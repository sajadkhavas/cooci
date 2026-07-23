# Frontend Phase 10.9 — SEO Acceptance and Release Candidate

Status: `seo_release_candidate=ready`

## Objective

Phase 10.9 is the final frontend SEO gate before production infrastructure work. It does not add ranking claims or new content. It proves that the compiled SSR storefront, authoritative Laravel data, crawl policy, structured data and release artifact agree with each other.

Google eligibility is not a ranking guarantee. The acceptance gate follows the technical requirements that indexable pages remain crawlable, expose accurate visible structured data, use canonical URLs, avoid conflicting `noindex` directives and can be inspected after deployment.

## 10.9A — Raw HTML acceptance

The test runner starts from the dynamic Laravel-backed sitemap and requests every listed URL before browser hydration. Each URL must:

- return HTTP 200 and HTML
- stay on the configured HTTPS site origin
- contain no query string or fragment in the sitemap
- expose a non-empty title and meta description
- expose exactly one self-referencing canonical URL
- remain free of `noindex`
- expose Open Graph and Twitter metadata
- expose exactly one H1
- contain parseable JSON-LD
- contain the stable Organization and WebSite entities
- contain the route-specific schema when applicable
- contain visible internal links

The route-specific matrix covers CollectionPage, Product, Blog, BlogPosting, ContactPage, AboutPage and local Service surfaces when those URLs are published.

## 10.9B — Crawl, status and link acceptance

The final crawler verifies:

- unique sitemap URLs
- robots sitemap declaration and private-route policy
- permanent canonical redirects for duplicate URLs
- real 404 responses with `noindex, nofollow` for missing public resources
- `noindex,follow` for filtered collection URLs
- `noindex, nofollow` for account, cart, checkout, payment and health surfaces
- no legacy `/categories` or `/products?category=` internal links
- no internal link returning 404 or 5xx

The sitemap is the acceptance inventory. A URL cannot be accepted as indexable while returning an error, conflicting canonical or indexing restriction.

## 10.9C — Desktop and mobile evidence

The same sitemap and status matrix runs independently in:

- desktop Chromium
- Pixel 7 mobile Chromium

Each project writes a machine-readable report. The reports must use the same origin and the same SHA-256 digest of the sitemap. The merge step fails unless both projects pass and each covers at least ten indexable routes plus internal-link, redirect and noindex checks.

## 10.9D — Release candidate attestation

The production build is packaged by the existing deterministic SSR release process. Phase 10.9 then binds these two inputs:

1. `release-manifest.json`
2. merged `seo-acceptance-report.json`

The resulting `seo-release-candidate.json` contains:

- deterministic release ID
- SHA-256 of the release manifest
- SHA-256 of the SEO acceptance report
- accepted desktop and mobile projects
- frozen backend contract `2026-07-20-phase-16`
- production site and API origins
- backend-enabled and development-mocks-disabled assertions

A separate verifier recomputes both hashes and rejects altered evidence, origin drift, contract drift or missing viewport acceptance.

## 10.9E — Deployment and regression gates

The release candidate cannot pass without:

- all Phase 1–10.9 source audits
- accessibility and content integrity
- unit tests, ESLint and TypeScript
- production build and Core Web Vitals/media budgets
- raw SSR deployment snapshots for home, product, topic, article, location, city and contact templates
- Release A/B creation, atomic deploy, rollback, Nginx and HTTPS smoke tests
- real Laravel desktop and mobile commerce acceptance
- all SSR/SEO phases 10.3–10.9
- PWA, adversarial security and CPU-throttled runtime regressions

Production Search Console submission, URL Inspection, live Rich Results testing, real-user percentile dashboards and log shipping remain Phase 19/21 activities because they require the deployed public domain.

## Completion marker

`seo_release_candidate=ready`
