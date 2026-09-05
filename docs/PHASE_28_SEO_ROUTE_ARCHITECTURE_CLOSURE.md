# Phase 28 — SEO Route Architecture Closure

Status: **COMPLETED / MERGED / REGISTERED**  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
Closed at: `2026-09-03` (UTC)

## Git identity

- Phase branch: `phase-28/seo-route-architecture`
- Base branch: `phase-27/cross-project-design-synthesis`
- START_SHA: `ca64abb286a54190cba11bcffd61fa61cd7992e4`
- Final exact-head SHA: `26c5ef080b910b9b6cf7177cae401e7fe48bb180`
- Pull request: `#37` — Phase 28: close SEO route architecture acceptance
- Merge method: merge commit
- Merge SHA: `76085a078e3068be479461582258a828f32496c6`

## Exact-head closure gates

All required release gates passed on exact head `26c5ef080b910b9b6cf7177cae401e7fe48bb180` before merge:

- Frontend CI `#1479` — **PASS** — run `33792185033`
- Phase 8 Deployment Readiness `#591` — **PASS** — run `33792185194`
- Phase 18 End-to-End Acceptance `#459` — **PASS** — run `33792185044`
- Phase 19 Production Package `#26` — **PASS** — run `33792185052`

Phase 18 final run additionally passed:

- Desktop + Mobile Laravel production acceptance
- Phase 10.3 raw dynamic SSR acceptance
- Phase 10.4 crawl/index acceptance
- Phase 10.5 product/merchant SEO acceptance
- Phase 10.6 content/topical authority acceptance
- Phase 10.7 local SEO/brand entity acceptance
- Phase 10.8 Core Web Vitals/media acceptance
- Phase 10.9 SEO acceptance and release candidate
- SEO release-candidate creation and verification
- PWA acceptance
- final adversarial acceptance
- Phase 9.5 runtime scroll baseline

## Delivered contracts

- Canonical editorial category routing is mapped to Laravel-authoritative category slugs.
- Category visibility and internal navigation are Backend-authoritative; unpublished categories are not emitted as crawlable internal links.
- Product cards and Footer category links follow canonical editorial paths only for published backend categories.
- `/gift` remains the valid gift landing page; its shop CTA falls back to `/products` until a matching backend gift category is published.
- `/locations` remains HTTP 200 and crawlable when no cities are published, uses `noindex,follow`, and is excluded from sitemap until publication criteria are met.
- City query redirects are tested only against actually published city URLs; unpublished city routes remain 404.
- Sitemap publication policy, content indexability, local SEO, metadata and internal-link contracts are aligned with backend publication truth.
- Runtime/PWA/scroll acceptance was updated to test stable structural and accessibility contracts rather than stale editorial copy.

## Acceptance history notes

The Phase 28 closure intentionally preserved strict crawler behavior. Real broken links discovered during acceptance were repaired at the source rather than hidden by weakening tests or fabricating HTTP 200 responses.

Notable real issues closed during final acceptance included:

- `/locations` hard 404 while Footer permanently linked to it.
- `/products/category/gift-boxes` emitted without an authoritative backend gift category.
- legacy `/products?diet=true` redirecting to an unpublished category.
- static Footer category links producing 404s in environments where categories were unpublished.

Several older CI assertions were also updated where they were tied to obsolete editorial text, obsolete support-control semantics, or synthetic fixtures instead of stable runtime contracts.

## Production state at closure

- Production deployment: **NOT PERFORMED by Phase 28 merge**.
- Production mutation during closure: **NO**.
- Last observed frontend production release before deployment remained `/var/www/winimi/frontend/releases/bab4c34db478713465d1`.
- Production must be re-attested from the server immediately before any mutation; historical release paths do not replace live preflight.

## CURRENT_NEXT_ACTION

Proceed to **Production Frontend Release** on server `hwsrv-1332134` using the repository's official immutable/atomic deployment runbook and scripts. Required sequence:

1. live read-only server preflight and project/repository lock;
2. resolve the deployable source SHA from the merged Phase 28 chain;
3. validate production environment and release package;
4. create immutable frontend release;
5. candidate/local health and smoke checks;
6. atomic `current` activation;
7. restart/reload the frontend service according to the official runbook;
8. production smoke, SSR, assets, sitemap/robots and SEO surface verification;
9. verify rollback target and production process identity;
10. record the activated release path and source SHA.

Use `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md` and the official deployment scripts under `deploy/` as the execution source of truth. Do not deploy from an unmerged working tree and do not edit the active release in place.
