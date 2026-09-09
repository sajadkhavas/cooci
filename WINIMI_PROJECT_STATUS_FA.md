# وضعیت مرجع پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۸**  
Project: **WINIMI / COOCI**  
Frontend: `sajadkhavas/cooci`  
Backend: `sajadkhavas/winimi-bakery-backend`  
نقش این فایل: **مرجع شماره ۱ برای ادامه کار در هر چت جدید**

> **چت جدید باید ابتدا همین فایل، سپس `docs/WINIMI_LIVING_HANDOFF_FA.md` و `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` را بخواند.** بعد PRهای زنده Frontend `#54` و Backend `#17` و CI همان HEADهای فعلی را verify کند. هیچ SHA تاریخی را بدون reconcile با GitHub فعلی مبنای mutation قرار نده.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
PHASE28=COMPLETED_MERGED_REGISTERED
F29S=PASS_MERGED_REGISTERED_CLOSED
F29=PASS_MERGED_REGISTERED_CLOSED
F30=PASS_MERGED_REGISTERED_CLOSED
PHASE19B=COMPLETED_PRODUCTION_READY_LIVE_ATTESTED_RESTORE_ROLLBACK_VERIFIED
PHASE20=COMPLETED_CLOSED
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
F31=IN_PROGRESS
REAL_GOOGLE_LOGIN=PASS
REAL_AUTHENTICATED_CHECKOUT=PASS
REAL_ZARINPAL_PURCHASE=PASS
FINAL_DELIVERY=NOT_COMPLETE
MERGE_ALLOWED_NOW=NO
```

## Canonical continuation files

1. `WINIMI_PROJECT_STATUS_FA.md` — **مرجع شماره ۱ / وضعیت فعلی**
2. `docs/WINIMI_LIVING_HANDOFF_FA.md` — **تاریخچه فنی و ادامه کار از پایه تا امروز**
3. `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` — **worklog دقیق F31 و blockers فعلی**
4. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` — نقشه تحویل
5. `docs/PHASE19B_LIVE_SERVER_EXECUTION_CLOSURE_FA.md`
6. `docs/PHASE20_EXTERNAL_ACTIVATION_CLOSURE_FA.md`
7. `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`
8. `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
9. `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`
10. `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`

جزئیات فازهای قدیمی‌تر و auditهای Frontend/Backend در docs همان repoها باقی مانده‌اند و نباید بدون دلیل دوباره اجرا شوند.

## Production — آخرین وضعیت ثبت‌شده

```text
BACKEND_CURRENT=/var/www/winimi/backend/releases/6a23406ae222f2a71570
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/8855aed3b593be89ff10
FRONTEND_DEPLOYED_SOURCE=4bab98787114ed27613f26df31b40918d04dc80a
```

Frontend release فعلی بعد از اصلاح checkout empty-note deploy و smoke شده است. Backend release همان release معتبر بسته‌شده Phase19B/F31 است.

## Phase19B — CLOSED / retained evidence

Status: **COMPLETED / PRODUCTION READY / LIVE ATTESTED / RESTORE VERIFIED / ROLLBACK VERIFIED**

- reboot survival: PASS
- encrypted backup: PASS
- DB restore: PASS
- persistent media restore: PASS
- backend rollback: PASS
- frontend rollback: PASS
- public production smoke: PASS

Retained backup evidence:

```text
ARCHIVE=/var/www/winimi/backend/shared/storage/app/private/Winimi Bakery/2026-09-08-00-50-57.zip
SHA256=a368ee939e6f6d745cb3adc70576d20b4e803368ec2e58649fdb76531da7bed1
ENCRYPTION=PASS
ZIP_ENTRIES=1429
MEDIA=201
```

این evidenceها بدون production mutation مرتبط دوباره اجرا نمی‌شوند.

## Phase20 — CLOSED

Phase20 در زمان closure این وضعیت را داشت:

- Zarinpal production: PASS
- verified payment evidence: PASS
- reconciliation: PASS
- duplicate authority/reference integrity: PASS
- eNAMAD live SSR: PASS
- public secret audit: PASS
- Google/Kavenegar در آن checkpoint external dependency safely disabled بودند.

**Update بعدی F31:** Google production credential واقعی بعداً provision شد و login واقعی PASS شد؛ بنابراین Google دیگر در وضعیت زنده safely-disabled نیست. Kavenegar/OTP همچنان disabled است تا credential واقعی تحویل شود.

## F31 — live acceptance completed so far

### Google Production

- callback: `https://api.winimibakery.com/auth/google/callback`
- real mobile login without VPN: **PASS**
- Google identity binding: **PASS**
- customer identity linked: **YES**
- mobile captured but not OTP-verified: **EXPECTED**
- `OTP_ENABLED=false`

### Checkout bug + deploy

Root cause spinner bug:

```text
recipient.notes.trim()
```

saved draft می‌توانست `notes: undefined` داشته باشد. Fix ثبت‌شده:

```text
notes: (recipient.notes ?? "").trim() || undefined
```

Regression test اضافه شد و corrected frontend deploy شد.

### Real authenticated purchase

خرید واقعی Production با Google login + checkout + Zarinpal انجام و database read-only attestation شد.

```text
REAL_PAID_ORDER=FOUND
ORDER_ID=2
ORDER_PUBLIC_ID=01M2057KFX4PJ4MKNRZQMNTZRD
ORDER_NUMBER=WNM-260908-ULYW0Z2L
ORDER_STATUS=delivered
PAYMENT_STATUS=paid
GRAND_TOTAL_TOMAN=1000
CUSTOMER_ID=3
CUSTOMER_BINDING=PASS
GOOGLE_IDENTITY_LINKED=YES
PAYMENT_ID=2
PAYMENT_PUBLIC_ID=01M2057KZKFPAMDDMF5V5Y55K7
PROVIDER=zarinpal
VERIFIED_PAYMENT_STATUS=verified
AMOUNT_MATCH=PASS
AUTHORITY_OCCURRENCES=1
REFERENCE_OCCURRENCES=1
PAYMENT_UNIQUENESS=PASS
DATABASE_MUTATION_DURING_FINAL_ATTESTATION=NO
```

Retained gate:

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

**دوباره از کاربر خرید واقعی نخواه.** این acceptance کامل است مگر مسیر با mutation جدید invalidate شود.

## چرا F31 هنوز بسته نشده؟

مالک پروژه عمداً closure نهایی را متوقف کرده تا قبل از تحویل، محتوا، تصاویر، UI و SEO-admin polish کامل شود.

ترتیب مورد توافق:

```text
Categories
-> حداقل یک Product واقعی در هر Category
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

Search Console بعد از تثبیت content/URL نهایی انجام می‌شود.

## Frontend F31 branch / PR

```text
REPO=sajadkhavas/cooci
BRANCH=f31/final-acceptance-handoff
PR=54
PR_STATE=OPEN_DRAFT_NOT_MERGED_MERGEABLE
BASE_MAIN=bf364510cf6097c88ecd3a55cb40a72e18d8333a
ACCEPTED_IMPLEMENTATION_HEAD_BEFORE_DOC_CHECKPOINT=74989adee098194f781ffeb5ddbfb4b900afe528
```

Current branch scope شامل:

- checkout empty-note fix/test
- Gift retirement/disabled route
- header green/pastel active state
- product/customer copy polish
- out-of-stock image blur removal
- Product Detail responsive/content polish
- footer/eNAMAD/trust presentation
- marquee smoothness work
- self-hosted Vazirmatn + integrity installer
- category/media contract work
- bulk-cookie UX/discount frontend support
- storefront redirect policy/resolver/validation/tests

### Frontend exact-head CI checkpoint روی `74989ade...`

```text
F30 Storefront Frontend Authority = SUCCESS
Phase 19 Production Package       = SUCCESS
Frontend CI                       = SUCCESS
Phase 8 Deployment Readiness      = SUCCESS
Phase 18 End-to-End Acceptance    = SUCCESS (targeted rerun attempt 2)
```

Resolved checkpoint:

```text
3fb48a60da8ef6fec62a6b03b8d1be22b7116f83 = audit accepts intentional redirect-aware `return await loadManagedCategoryShop(args)`
4222d40ad1c34b27160307c7732c01f998697611 = Phase10.3 fixture includes required `imageAlt`
74989adee098194f781ffeb5ddbfb4b900afe528 = Phase18 checks matching F31 Backend branch for this PR
```

Evidence on the accepted head: all workflow jobs are green; Phase18 `27 passed / 1 skipped`, Phase10.3 `12 passed`, Phase10.4 `10 passed`, Phase10.5–10.8 each `8 passed`, Phase10.9 `2 passed`, Backend E2E `3 passed / 66 assertions`, runtime performance `8 passed`. Blocker فعال Frontend وجود ندارد.

## Backend F31 branch / PR

```text
REPO=sajadkhavas/winimi-bakery-backend
BRANCH=f31/final-acceptance-handoff
PR=17
PR_STATE=OPEN_DRAFT_NOT_MERGED_MERGEABLE
BASE_MAIN=54a33874c4f54e8a5976804a6cea5ea5d2d371f7
ACCEPTED_IMPLEMENTATION_HEAD=900975f6870760a00df984ddfff787528086f1ab
```

Current branch scope شامل:

- backup env/docs alignment
- category `image_alt` + migration/API/Filament/tests
- cookie bulk discount settings/service/checkout/tests
- Redirect Manager hardening
- public redirect resolver API
- redirect chain final-target resolution
- open redirect / loop / self-loop / protected-route safety
- stale redirect cache removal
- redirect feature tests

### Backend current CI checkpoint

```text
Phase 18 Backend Acceptance = SUCCESS
Backend CI                  = SUCCESS
Phase 19 Production Package = SUCCESS
```

Resolved checkpoint:

```text
1974563504c4a8b8f53a477c29a0d3a0d79d3299 = exact Pint PHPDoc spacing applied
900975f6870760a00df984ddfff787528086f1ab = temporary diagnostic removed; accepted clean implementation head
```

هر سه workflow روی exact head سبز هستند و migration/test/security stages اجرا و PASS شده‌اند. Blocker فعال Backend وجود ندارد.

## UI / UX decisions already approved

چت بعدی این design discovery را دوباره از صفر انجام ندهد:

- structure Home/Products حفظ شود؛ redesign کامل ممنوع
- active header سبز پاستلی
- technical/backend/server wording از UI مشتری حذف
- Gift در public storefront فعلاً غیرفعال
- Product Detail mobile: image -> name/price -> variants -> purchase -> details
- Product Detail desktop فضای خالی را با data واقعی پر کند
- eNAMAD centered و بدون side-copy
- footer separators کمی واضح‌تر
- Vazirmatn self-hosted
- marquee desktop smooth شود
- unavailable product image بدون heavy blur
- Products filtered/search URLs noindex architecture حفظ شود
- category/product/article/static SEO fields تا جای ممکن Admin-managed
- slug changes باید Redirect Manager/301 safety داشته باشند

## Client content source already available

- `src/data/products.ts`
- historical commit `c0be99195bd9e0b7bd6e123c0dff5d7c4f98b085` — `Transfer complete Winimi product catalog data`
- `src/data/categoriesContent.ts`
- SEO reference docs under `docs/seo/`

Known catalog groups در historical data:

- کوکی‌ها
- مینی کوکی
- کیک و دسر
- رژیمی و بدون قند
- رول و کروسان
- باکس هدیه

Gift data تاریخی است و تا تأیید current employer offering نباید public فعال شود.

## Approved category image checkpoint

برای «کوکی‌های خانگی» cover 4:3 ساخته و توسط کاربر تأیید شده است.

Session artifacts:

```text
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting.png
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.webp
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.jpg
```

Suggested web filename: `winimi-homemade-cookies-category.webp`  
Suggested truthful alt: `مجموعه کوکی‌های خانگی وینیمی با طعم‌های شکلاتی، ردولوت و مغزی`

تا وقتی از media/admin واقعی publish نشده، live محسوب نمی‌شود.

## Canonical zero-to-100 delivery ledger

این فایل از این checkpoint مرجع شماره ۱ و خلاصه جامع پروژه است. تاریخچه تفصیلی در Living Handoff و شواهد اجرایی F31 در Worklog نگهداری می‌شوند، اما هیچ تصمیم جاری نباید فقط در آن دو فایل باقی بماند.

### مسیر انجام‌شده از ابتدا تا Production فعلی

- foundation و auditهای اولیه Frontend/Backend
- قرارداد Backend-authoritative برای catalog، content، navigation، trust و SEO
- Laravel 12 + Filament 3 + API و React Router SSR storefront
- customer authentication، Google OAuth production و identity binding
- catalog، category، product variants، media، inventory و delivery
- checkout server-authoritative، order lifecycle و idempotency
- Zarinpal production، callback/verify/reconciliation و خرید واقعی موفق
- SEO route architecture، canonical/noindex، structured data و redirect manager
- Phase28، F29S، F29، F30، Phase19B، Phase20 و F31
- immutable releases، systemd، Nginx، health/readiness، queue و scheduler
- encrypted backup، isolated restore evidence، reboot survival و rollback evidence
- Gift retirement defense-in-depth
- Vazirmatn self-hosted، category image_alt و cookie bulk discount
- mobile navigation polish، four-column bottom navigation و full-bleed product gallery
- eNAMAD official Backend-managed markup
- final Frontend-only immutable deploy روی Production

### Production checkpoint — 2026-09-09

```text
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/00fc63d9e485b1419c6c
FRONTEND_SOURCE_SHA=893453fd2599024dfb90fe666e29c30293405017
BACKEND_CURRENT=/var/www/winimi/backend/releases/b7dd719811c14994eeb8
BACKEND_SOURCE_SHA=d51df49f367190f102fa70ffe1f62a7f17aa761e
FRONTEND_HEALTH=PASS
BACKEND_READY=PASS
HOMEPAGE_HTTP=200
PRODUCTS_HTTP=200
ENAMAD_SSR=VISIBLE
ORDER_PAYMENT_MUTATION_DURING_DEPLOY=NO
MIGRATION_REPEATED=NO
BACKUP_REPEATED=NO
```

Frontend exact-head workflows on `893453fd...`: **5/5 SUCCESS**. Backend accepted exact-head workflows on `d51df49...`: **4/4 SUCCESS**.

### Latest approved UI implementation

- hamburger button and mobile drawer: pastel green
- mobile bottom navigation: Home / Store / Cart / Account, four equal centered columns
- no replacement page was invented for retired Gift
- Product Detail main image and thumbnails: full-bleed inside their own frames
- latest official eNAMAD code stored by Backend is authoritative; Frontend must not invent an ID, replace it, or maintain an account denylist

### Product content/SEO authority

Implementation blueprint: `docs/F31_PRODUCT_CONTENT_SEO_BLUEPRINT_FA.md`  
This document locks the Backend-managed Product Detail sections, one-product-per-active-category rollout, verified-media policy and Product → Category → Article SEO sequence.

### Remaining work before formal handoff

1. Employer/user mobile visual approval of the deployed UI.
2. Product content enrichment using only verified employer facts:
   - distinctive taste and texture
   - serving/use occasion
   - exact portion/weight
   - ingredients and allergens
   - storage and shelf life
   - preparation/dispatch constraints
   - non-duplicated SEO title/description and image alt
3. Verify all commercial prices, discounts, stock and preparation claims; test-looking prices must not survive final handoff.
4. Reconcile remaining category/article/static-page content and internal links.
5. Run final dead-code/obsolete-file/current-tree cleanup. Git history remains intact for audit and rollback.
6. Confirm unresolved P0/P1 blockers and review threads are zero.
7. Mark PR #54 and #17 ready, merge them, and require post-merge main CI.
8. Reconcile Production with merged source; redeploy only if the merged tree differs.
9. Final sitemap/Search Console verification on stable URLs/content.
10. Write closure evidence, create final freeze/tag and declare handoff complete.

## Mandatory progress-record contract

After every material change, update this canonical file and the relevant detailed worklog with:

```text
WHAT_CHANGED=
EXACT_SHA=
CI_RESULT=
PRODUCTION_RELEASE=
LIVE_RESULT=
REMAINING_WORK=
CURRENT_NEXT_ACTION=
DO_NOT_REPEAT=
```

Rules:

- No historical SHA may replace a live GitHub/Production check.
- Closed phases are not re-run without new invalidating evidence.
- Real Google login, real Zarinpal purchase, order creation, restore and rollback are retained evidence and must not be requested again.
- Current-tree cleanup removes obsolete code/files from the final branch; Git commit history is retained.
- A new chat reads this file first, then Living Handoff, then F31 Worklog.

## CURRENT_NEXT_ACTION

```text
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
F31_STATUS=IN_PROGRESS_PRODUCTION_DEPLOYED_CONTENT_CLOSURE_PENDING
FRONTEND_HEAD=893453fd2599024dfb90fe666e29c30293405017
FRONTEND_CI=5_OF_5_SUCCESS
BACKEND_HEAD=d51df49f367190f102fa70ffe1f62a7f17aa761e
BACKEND_CI=4_OF_4_SUCCESS
ACTIVE_FRONTEND_RELEASE=00fc63d9e485b1419c6c
ACTIVE_BACKEND_RELEASE=b7dd719811c14994eeb8
ACTIVE_CI_BLOCKERS=0
NEXT=PRODUCT_CONTENT_AND_COMMERCIAL_DATA_ENRICHMENT
THEN=FINAL_CURRENT_TREE_CLEANUP_AND_DOC_RECONCILIATION
MERGE_PR54_PR17=NO_UNTIL_CONTENT_AND_VISUAL_APPROVAL
REAL_PAYMENT_REPEAT=NO
GOOGLE_LOGIN_REPEAT=NO
RESTORE_ROLLBACK_REPEAT=NO_UNLESS_INVALIDATED
```

## Final closure sequence

```text
content/commercial-data approval
-> current-tree cleanup
-> canonical documentation reconciliation
-> exact-head CI all green
-> review threads and P0/P1 blockers = 0
-> merge PR #54 / #17
-> post-merge main CI
-> Production/source reconciliation
-> final smoke without commerce mutation
-> sitemap/Search Console verification
-> final tag/freeze/handoff
```

Only then set:

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
