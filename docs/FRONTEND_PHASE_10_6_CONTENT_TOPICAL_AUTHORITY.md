# Frontend Phase 10.6 — Content and Topical Authority Foundation

## Goal

Turn the Laravel-managed article inventory into a coherent, crawlable content architecture without creating static topics, fake articles, unsupported expertise claims or client-only internal links.

Final marker: `content_topical_authority=ready`

## 10.6A — Authoritative topic taxonomy

A topic exists only when at least one published Laravel post exposes the exact category value.

`src/lib/seo/content-topics.ts` owns:

- Unicode-normalized topic labels
- bounded and path-safe topic validation
- stable `/blog/topic/:topic` URLs
- topic counts derived from published post payloads
- latest publication date per topic

`src/lib/seo/content-topics.server.ts` reads every paginated published post page with a strict safety limit. No static topic registry, keyword list or demo taxonomy contributes to production output.

## 10.6B — Crawlable server-rendered topic hubs

`/blog/topic/:topic` is a public React Router route with a server loader.

Before HTML is sent, the loader:

- validates the requested topic
- confirms that it exists in the published Laravel inventory
- loads the topic-filtered article page
- loads the complete topic navigation
- applies canonical pagination and permanent duplicate redirects

Unknown or unpublished topics return a real 404 with `X-Robots-Tag: noindex, nofollow`. Authoritative data failure returns 503 instead of an indexable empty page.

## 10.6C — Visible internal linking and related content

The blog index exposes a semantic topic navigation with real article counts. Article cards and article detail breadcrumbs link to the same crawlable topic URL.

Article detail pages load up to three related published posts from the same Laravel category. The current article is excluded. If optional related-content loading fails, the article remains available and the related section is omitted; unrelated or fabricated fallback articles are never shown.

Dates use one UTC-based Persian formatter so Node SSR and browser hydration produce identical visible text.

## 10.6D — Structured data and sitemap

The initial HTML contains structured data built from the same server-loaded content visible to users:

- `/blog` uses `Blog` plus an `ItemList` of visible posts
- topic hubs use `CollectionPage`, `DefinedTerm` and visible `ItemList` entries
- article pages use `BlogPosting`, `articleSection`, backend tags as keywords, canonical `mainEntityOfPage` and a crawlable topic `isPartOf`

The frontend does not invent `dateModified`, author credentials, editorial claims or article entities that are absent from Laravel.

The dynamic sitemap collects post and topic entries in the same paginated Laravel pass. Each topic `lastmod` is the latest valid publication timestamp among its published posts.

## 10.6E — Acceptance gates

Automated evidence includes:

- topic normalization and schema unit tests
- source architecture audit
- existing launch, crawl, merchant, accessibility and security audits
- production build and TypeScript validation
- deployed Node SSR checks for Blog, CollectionPage, BlogPosting and related links
- real Laravel Playwright checks on desktop and mobile
- canonical topic pagination and unknown-topic noindex checks
- existing PWA, adversarial and CPU-throttled runtime regression suites

## Completion

- published Laravel categories form the only production topic taxonomy
- every topic has one stable crawlable URL
- topic hubs and article clusters are server-rendered
- visible links, canonical URLs, structured data and sitemap entries agree
- related content remains same-topic and authoritative
- no static content inventory or invented authority signal enters production

`content_topical_authority=ready`
