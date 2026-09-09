# F31 — Final Acceptance & Handoff Worklog

Status: **IN PROGRESS / LIVE PURCHASE ACCEPTED / POLISH HELD OPEN**

Project: WINIMI / COOCI  
Updated: **2026-09-08**

## Baseline

- Phase19B: **CLOSED / retained evidence**
- Phase20: **CLOSED / retained evidence**
- Backend production release: `6a23406ae222f2a71570`
- Frontend production release after checkout fix: `8855aed3b593be89ff10`
- Frontend deployed source: `4bab98787114ed27613f26df31b40918d04dc80a`
- Frontend main after Phase20 closure: `bf364510cf6097c88ecd3a55cb40a72e18d8333a`
- Backend main: `54a33874c4f54e8a5976804a6cea5ea5d2d371f7`

## Branch / PR state

### Frontend

- Branch: `f31/final-acceptance-handoff`
- PR: `cooci#54`
- State: **OPEN / DRAFT / NOT MERGED / MERGEABLE**
- Accepted implementation head before this documentation checkpoint: `74989adee098194f781ffeb5ddbfb4b900afe528`

### Backend

- Branch: `f31/final-acceptance-handoff`
- PR: `winimi-bakery-backend#17`
- State: **OPEN / DRAFT / NOT MERGED / MERGEABLE**
- Accepted implementation head: `900975f6870760a00df984ddfff787528086f1ab`

## Retained Phase19B evidence — do not rerun unless invalidated

- reboot survival
- encrypted backup
- backup restore
- database restore
- persistent media restore
- backend rollback
- frontend rollback
- production health/smoke

Retained backup evidence:

```text
ARCHIVE=/var/www/winimi/backend/shared/storage/app/private/Winimi Bakery/2026-09-08-00-50-57.zip
SHA256=a368ee939e6f6d745cb3adc70576d20b4e803368ec2e58649fdb76531da7bed1
ENCRYPTION=PASS
ZIP_ENTRIES=1429
MEDIA=201
```

## F31 live Google acceptance

Google production credentials were provisioned after the Phase20 historical safely-disabled classification.

- callback: `https://api.winimibakery.com/auth/google/callback`
- real Google login on mobile without VPN: **PASS**
- provider identity binding: **PASS**
- customer Google identity linked: **YES**
- mobile captured but unverified: **EXPECTED**
- OTP/Kavenegar: **DISABLED / external dependency remains**

Security invariant retained:

- identity key = Google `sub`
- no automatic linking by unverified phone/email
- OAuth state validation required
- secrets only in server environment

## Checkout bug found and closed

Observed symptom: checkout spinner stayed active without request.

Root cause:

```text
recipient.notes.trim()
```

A saved recipient draft could contain `notes: undefined`, causing a synchronous TypeError after submitting state became active.

Fix:

```text
notes: (recipient.notes ?? "").trim() || undefined
```

Regression test added in `tests/unit/checkout-submit-regression.test.ts`.

Corrected source was deployed as frontend release `8855aed3b593be89ff10` and live smoke passed.

## Real authenticated purchase acceptance — COMPLETE / RETAIN

User then completed a real purchase through Google-authenticated checkout and Zarinpal. Final database attestation was read-only.

```text
REAL_PAID_ORDER=FOUND
ORDER_ID=2
ORDER_PUBLIC_ID=01M2057KFX4PJ4MKNRZQMNTZRD
ORDER_NUMBER=WNM-260908-ULYW0Z2L
ORDER_STATUS=delivered
PAYMENT_STATUS=paid
GRAND_TOTAL_TOMAN=1000
PAID_AT=2026-09-08 12:54:12
CUSTOMER_ID=3
CUSTOMER_BINDING=PASS
CUSTOMER_ACTIVE=YES
GOOGLE_IDENTITY_LINKED=YES
VERIFIED_PAYMENT_ATTEMPT=FOUND
PAYMENT_ID=2
PAYMENT_PUBLIC_ID=01M2057KZKFPAMDDMF5V5Y55K7
PROVIDER=zarinpal
PAYMENT_ATTEMPT_STATUS=verified
AMOUNT_TOMAN=1000
VERIFIED_AT=2026-09-08 12:54:13
AMOUNT_MATCH=PASS
PAYMENT_VERIFICATION_FIELDS=PASS
AUTHORITY_OCCURRENCES=1
REFERENCE_OCCURRENCES=1
PAYMENT_UNIQUENESS=PASS
DATABASE_MUTATION_DURING_ATTESTATION=NO
```

Retained F31 purchase gate:

```text
GOOGLE_LOGIN=PASS
AUTHENTICATED_CHECKOUT=PASS
REAL_ORDER=PASS
REAL_ZARINPAL=PASS
PAYMENT_VERIFIED=PASS
CUSTOMER_ORDER_BINDING=PASS
AUTHORITY_UNIQUE=PASS
REFERENCE_UNIQUE=PASS
PRODUCTION_HEALTH=PASS
```

**Do not ask the user to pay again.** This live acceptance is already complete unless a later production change invalidates the path.

## User decision: final closure intentionally paused

Although the real purchase gate passed, user explicitly chose **not to close F31 yet**. Before handoff, the project must receive final visual/content/SEO-admin polish.

Required content sequence:

```text
Categories
-> at least one real Product per Category
-> Product SEO fields
-> Articles
-> Static/Commercial pages
-> Internal linking
-> Image SEO / alt / WebP
-> Redirect + URL safety audit
-> Index/Canonical/Schema final audit
-> Search Console
-> SEO specialist handoff
```

Search Console starts only after content/URL structure is stable.

## Frontend polish batch currently implemented in PR #54

Current PR changed surface includes:

- Gift public retirement and controlled disabled route
- Header active-state green/pastel correction
- Header/Footer/Home/Products/ProductDetail customer-facing copy polish
- eNAMAD presentation cleanup
- out-of-stock ProductCard blur removal
- Product Detail responsive/order/content improvements
- DraggableMarquee smoothness work
- self-hosted Vazirmatn installer + integrity audit
- checkout empty-note regression fix
- category/media contract adjustments
- bulk cookie UX/discount support
- storefront redirect policy/server resolver and tests

Approved visual rules:

- keep current Home/Products structure; no redesign from scratch
- remove technical words like backend/server from customer copy
- no Gift exposure in public navigation/CTA while unavailable
- mobile Product Detail: image -> name/price -> variants -> purchase -> detailed data
- eNAMAD centered, no side explanatory strips
- footer separators slightly clearer
- products filters/canonical/noindex architecture retained
- unavailable product images remain visible; no heavy blur

## Backend F31 scope currently implemented in PR #17

- backup env/docs alignment
- category `image_alt` support + migration + API/Filament/tests
- cookie bulk discount settings/service/checkout/tests
- redirect model/resource hardening
- public storefront redirect resolver API
- redirect chain-to-final-target resolution
- open redirect / self-loop / loop / protected-route safety
- stale redirect cache behavior removed
- redirect feature tests

## Resolved CI blockers — accepted checkpoint

### Frontend accepted head `74989adee098194f781ffeb5ddbfb4b900afe528`

```text
F30 Storefront Frontend Authority = SUCCESS
Phase 19 Production Package       = SUCCESS
Frontend CI                       = SUCCESS
Phase 8 Deployment Readiness      = SUCCESS
Phase 18 End-to-End Acceptance    = SUCCESS (rerun attempt 2)
```

Resolution commits:

```text
3fb48a60da8ef6fec62a6b03b8d1be22b7116f83
4222d40ad1c34b27160307c7732c01f998697611
74989adee098194f781ffeb5ddbfb4b900afe528
```

The first commit reconciles the audit with the intentional redirect-aware `return await` loader; the second adds required `imageAlt` fixture data; the third aligns Phase18 with the matching Backend F31 branch. All workflow jobs passed. Suite evidence: Phase18 `27/1 skipped`, Phase10.3 `12`, Phase10.4 `10`, Phase10.5–10.8 `8` each, Phase10.9 `2`, Backend E2E `3 / 66 assertions`, performance `8`.

### Backend accepted head `900975f6870760a00df984ddfff787528086f1ab`

```text
Phase 18 Backend Acceptance = SUCCESS
Backend CI                  = SUCCESS
Phase 19 Production Package = SUCCESS
```

Resolution:

```text
1974563504c4a8b8f53a477c29a0d3a0d79d3299 = exact Pint PHPDoc spacing
900975f6870760a00df984ddfff787528086f1ab = temporary diagnostic removed
```

All three Backend workflows passed on the accepted exact head, including downstream migration/test/security stages. Active Backend CI blockers: zero.

## Client product/content source already in GitHub

- `src/data/products.ts`
- historical commit `c0be99195bd9e0b7bd6e123c0dff5d7c4f98b085` — `Transfer complete Winimi product catalog data`
- `src/data/categoriesContent.ts`
- SEO strategy docs under `docs/seo/`

Known catalog families in that historical source:

- کوکی‌ها
- مینی کوکی
- کیک و دسر
- رژیمی و بدون قند
- رول و کروسان
- باکس هدیه

Gift is currently public-retired; historical catalog data must be reconciled with current employer offerings before publication.

## Approved category image checkpoint

For «کوکی‌های خانگی», user approved a generated 4:3 cover based on provided real product photos.

Session artifacts:

```text
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting.png
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.webp
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.jpg
```

Suggested web filename: `winimi-homemade-cookies-category.webp`  
Suggested truthful alt: `مجموعه کوکی‌های خانگی وینیمی با طعم‌های شکلاتی، ردولوت و مغزی`

It is not considered live until uploaded/referenced through the real media/admin path.

## Mobile polish and final Frontend production deploy — 2026-09-09

### WHAT_CHANGED

- pastel-green mobile hamburger and drawer
- four equal mobile bottom-navigation columns: Home / Store / Cart / Account
- removed the obsolete fifth-column space left by Gift retirement
- full-bleed main Product Detail image and full-bleed gallery thumbnails
- aligned product-media regression with the approved full-bleed design
- removed an incorrect temporary eNAMAD account denylist; the latest official Backend-managed code remains authoritative

### EXACT_SHA / CI_RESULT

```text
FRONTEND_EXACT_HEAD=893453fd2599024dfb90fe666e29c30293405017
FRONTEND_CI=SUCCESS
PHASE8_DEPLOYMENT_READINESS=SUCCESS
PHASE18_END_TO_END_ACCEPTANCE=SUCCESS
PHASE19_PRODUCTION_PACKAGE=SUCCESS
F30_STOREFRONT_AUTHORITY=SUCCESS
```

### PRODUCTION_RELEASE / LIVE_RESULT

```text
PREVIOUS_FRONTEND=/var/www/winimi/frontend/releases/f6ced92f952c6728f182
ACTIVE_FRONTEND=/var/www/winimi/frontend/releases/00fc63d9e485b1419c6c
FRONTEND_SOURCE_SHA=893453fd2599024dfb90fe666e29c30293405017
ACTIVE_BACKEND=/var/www/winimi/backend/releases/b7dd719811c14994eeb8
BACKEND_SOURCE_SHA=d51df49f367190f102fa70ffe1f62a7f17aa761e
FRONTEND_INTERNAL_HEALTH=PASS
BACKEND_READY_STATUS=200
HOMEPAGE_STATUS=200
PRODUCTS_STATUS=200
ENAMAD_SSR=VISIBLE
MIGRATION_EXECUTED=NO
BACKUP_REPEATED=NO
ORDER_PAYMENT_MUTATION=NO
```

The one initial loopback refusal occurred during the controlled service restart; wrapper retry succeeded and final health/process identity passed.

### REMAINING_WORK

- user/employer visual confirmation on a real mobile device
- enrich each Product Detail using verified facts, without invented claims
- validate real prices, discounts, stock, weights, preparation and delivery constraints
- reconcile category/article/static content, SEO fields, images/alts and internal links
- final current-tree cleanup for dead code, obsolete routes/files, temporary fixtures/diagnostics and contradictory docs
- zero unresolved P0/P1 blockers and review threads
- ready/merge PR #54 and #17
- post-merge main CI and Production/source reconciliation
- stable sitemap/Search Console check
- final closure, freeze/tag and handoff

### DO_NOT_REPEAT

```text
REAL_GOOGLE_LOGIN=RETAINED_PASS
REAL_AUTHENTICATED_CHECKOUT=RETAINED_PASS
REAL_ZARINPAL_PURCHASE=RETAINED_PASS
REAL_ORDER_CREATION=RETAINED_PASS
PHASE19B_RESTORE=RETAINED_PASS
PHASE19B_ROLLBACK=RETAINED_PASS
REPEAT_WITHOUT_INVALIDATING_EVIDENCE=FORBIDDEN
```

## Exact continuation contract for next chat

1. Read `WINIMI_PROJECT_STATUS_FA.md` first.
2. Read `docs/WINIMI_LIVING_HANDOFF_FA.md`.
3. Read this F31 Worklog.
4. Fetch live PR #54/#17 heads and CI; do not blindly trust historical SHAs.
5. Start with Product content/commercial-data enrichment.
6. Record every material checkpoint using WHAT_CHANGED, EXACT_SHA, CI_RESULT, PRODUCTION_RELEASE, LIVE_RESULT, REMAINING_WORK, CURRENT_NEXT_ACTION and DO_NOT_REPEAT.
7. Do not merge or close F31 before content and visual approval.
8. Do not repeat retained real purchase/login/restore/rollback evidence.

```text
CURRENT_NEXT_ACTION=PRODUCT_CONTENT_AND_COMMERCIAL_DATA_ENRICHMENT
FRONTEND_PRODUCTION_DEPLOYED=YES
BACKEND_PRODUCTION_DEPLOYED=YES
ACTIVE_CI_BLOCKERS=0
PRS_MERGED=NO
F31_CLOSED=NO
```

## Final gate

```text
content and commercial data approved
-> final current-tree cleanup
-> documentation reconciled
-> exact-head CI green
-> blockers/review threads zero
-> merge PR #54/#17
-> post-merge main CI
-> Production/source match
-> final non-commerce smoke
-> sitemap/Search Console check
-> freeze/tag/handoff
```

Only then:

```text
F31=COMPLETED
ALL_DELIVERY_PRS=MERGED
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```


## F31 technical completion checkpoint — 2026-09-09

```text
WHAT_CHANGED=Backend-managed rich Product Detail content; managed desktop/mobile navigation; complete PWA/Web Push subscription and transactional VAPID transport; final notification outbox fix; removal of unused vulnerable Excel export dependency
FRONTEND_IMPLEMENTATION_HEAD=4bfb0dd4d7b8fa12585a6e10ff3f58ee3f48b08f
FRONTEND_IMPLEMENTATION_CI=5_OF_5_SUCCESS
BACKEND_HEAD=07d38915561f40cae57a3ad529b3dc155340d9c6
BACKEND_CI=4_OF_4_SUCCESS
BACKEND_REGRESSION=151_TESTS_1508_ASSERTIONS_PASS
COMPOSER_AUDIT=PASS
TEMPORARY_DIAGNOSTICS=REMOVED
PRODUCTION_RELEASE=UNCHANGED_PENDING_CONTROLLED_DEPLOY
LIVE_RESULT=PREVIOUS_PRODUCTION_REMAINS_HEALTHY
ACTIVE_CODE_OR_CI_BLOCKERS=0
```

Implemented authority now available from Backend/admin:

- product taste, texture, use cases, serving suggestions, specifications and product FAQs
- public managed navigation with nested active categories for desktop hover/focus and mobile menu
- encrypted Web Push subscriptions with separate transactional/marketing preferences
- safe transactional order-status Push delivery; fail-closed when VAPID is not configured
- PWA service-worker push and notification-click handling

Remaining delivery work:

1. Controlled immutable deployment of Backend `07d389...` with its two F31 migrations, then Frontend implementation `4bfb0d...`.
2. Configure secret VAPID environment values and enable Push, or deliberately retain `PUSH_ENABLED=false` until keys are supplied.
3. Run non-commerce health/UI/PWA smoke only; do not repeat login, purchase, payment or order creation.
4. Populate one representative product per active category using verified employer facts and real employer media; validate prices, stock, weights, allergens, storage and preparation claims.
5. Complete category/article/static content and stable internal-link/SEO rollout, then employer visual/content approval.
6. Final current-tree reconciliation, zero P0/P1/review threads, explicit user permission to ready/merge PR #54 and #17, post-merge CI, Production reconciliation, sitemap/Search Console, tag/freeze/handoff.

```text
CURRENT_NEXT_ACTION=CONTROLLED_IMMUTABLE_BACKEND_THEN_FRONTEND_DEPLOY
DO_NOT_REPEAT=REAL_GOOGLE_LOGIN_REAL_ZARINPAL_PURCHASE_REAL_ORDER_PHASE19B_RESTORE_ROLLBACK
PRS=OPEN_DRAFT_NOT_MERGED
F31=CLOSURE_PENDING_DEPLOY_AND_VERIFIED_CONTENT
```


## F31 final technical Production deployment — 2026-09-09

```text
DEPLOY_RESULT=FINAL_DIRECT_ACTIVATION_R4_PASS
DEPLOYED_FRONTEND_SOURCE=643c75209292ba7a24617dd17b76ccc689ea92a4
ACTIVE_FRONTEND_RELEASE=/var/www/winimi/frontend/releases/fd4472c3dac57417bd83
FRONTEND_CI=5_OF_5_SUCCESS
DEPLOYED_BACKEND_SOURCE=07d38915561f40cae57a3ad529b3dc155340d9c6
ACTIVE_BACKEND_RELEASE=/var/www/winimi/backend/releases/3d53e8c0c92d9e3888c4
BACKEND_CI=4_OF_4_SUCCESS
BACKEND_REGRESSION=151_TESTS_1508_ASSERTIONS_PASS
COMPOSER_SECURITY_AUDIT=PASS
WEB_PUSH_MIGRATION=RAN_BATCH_7
RICH_PRODUCT_CONTENT_MIGRATION=RAN_BATCH_7
INTERNAL_FRONTEND_HTTP=200
BACKEND_READY_HTTP=200
PUBLIC_HOME_HTTP=200
PUBLIC_PRODUCTS_HTTP=200
PWA_MANIFEST_HTTP=200
PWA_SERVICE_WORKER_HTTP=200
COMMERCE_BEFORE={"orders":4,"payments":4}
COMMERCE_AFTER={"orders":4,"payments":4}
ORDER_CREATED=NO
PAYMENT_ATTEMPT_CREATED=NO
MIGRATION_REPEATED=NO
BACKUP_REPEATED=NO
GOOGLE_LOGIN_RETESTED=NO
```

The first activation attempt safely rolled back only because the wrapper probed nonexistent Frontend routes `/healthz` and `/health`. Read-only diagnosis proved the SSR health contract is internal `/` with HTTP 200. R4 then activated the already-built, already-verified pair with the correct health route. This was an orchestration-probe correction, not an application defect.

Current delivery state:

- technical implementation, exact-head CI and Production deployment are complete;
- PWA assets are live;
- Web Push code and database authority are live and fail closed; actual delivery remains disabled until secure VAPID environment values are configured;
- product rich-content controls and managed navigation are live;
- PR #54 and PR #17 remain intentionally Draft/Open/Not merged;
- final content/media population still requires verified employer facts and real employer-owned images;
- formal F31 closure still requires visual/content approval, merge authorization, post-merge CI, Production reconciliation, sitemap/Search Console verification and final freeze/tag.

```text
CURRENT_NEXT_ACTION=VERIFY_PUSH_CONFIGURATION_THEN_POPULATE_VERIFIED_PRODUCT_CONTENT_AND_MEDIA
DO_NOT_REPEAT=REAL_GOOGLE_LOGIN_REAL_ZARINPAL_PURCHASE_REAL_ORDER_PHASE19B_RESTORE_ROLLBACK
TECHNICAL_PRODUCTION_DEPLOYMENT=COMPLETE
CONTENT_HANDOFF=IN_PROGRESS
PRS=OPEN_DRAFT_NOT_MERGED
F31=NOT_FORMALLY_CLOSED
```
