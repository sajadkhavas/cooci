# سند مرجع زنده پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۸**  
وضعیت: **مرجع اصلی ادامه کار بین چت‌ها / F31 در حال انجام**  
زبان: فارسی / RTL

> **قانون شروع چت جدید:** ابتدا `WINIMI_PROJECT_STATUS_FA.md`، سپس همین فایل و `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md` را بخوان. بعد PRهای Frontend `#54` و Backend `#17` و CI همان HEADهای زنده را بررسی کن. هیچ checkpoint قدیمی را بر HEAD/Production فعلی مقدم ندان و هیچ فاز بسته‌شده‌ای را بدون evidence جدید دوباره باز نکن.

## 1) هویت پروژه

```text
PROJECT=WINIMI_COOCI
STOREFRONT=https://winimibakery.com
API=https://api.winimibakery.com
FRONTEND_REPO=sajadkhavas/cooci
BACKEND_REPO=sajadkhavas/winimi-bakery-backend
CURRENT_PHASE=F31_FINAL_ACCEPTANCE_HANDOFF
FINAL_DELIVERY=NOT_COMPLETE
```

Frontend stack فعلی: React Router Framework Mode + React + TypeScript + Vite + SSR.  
Backend stack فعلی: Laravel + Filament + Sanctum/session + Queue/Scheduler + MySQL/Redis topology در Production.

اصل معماری رسمی پروژه:

> هر چیز محتوایی، تجاری، قابل مدیریت توسط صاحب فروشگاه، قابل روشن/خاموش شدن یا وابسته به داده در Frontend باید تا جای ممکن از Backend/Filament قابل کنترل و از API مصرف شود. Frontend مالک layout، responsive behavior، animation، accessibility mechanics و microcopy سیستمی است.

## 2) تاریخچه فنی از پایه تا وضعیت فعلی

جزئیات ریز هر مرحله در docs و Git history موجود است؛ این بخش index زمانی جلوگیری از دوباره‌کاری است.

### Foundation / Frontend audits

Frontend از auditهای مرحله‌ای عبور کرده است و اسناد `FRONTEND_FULL_AUDIT_PHASE_*` و `FRONTEND_FULL_AUDIT_ROADMAP.md` تاریخچه آن را نگه می‌دارند. قراردادهای اصلی که در آن مراحل قفل شدند:

- API validation و session/auth boundaries
- runtime catalog + variants + stock/cart persistence
- checkout/payment/idempotency boundaries
- SSR metadata/canonical/JSON-LD/media safety
- accessibility و keyboard/focus/live-region contracts
- PWA/offline/update flow
- immutable SSR deployment/rollback
- security/deployment adversarial audits
- runtime performance/CWV-oriented cleanup
- SSR foundation
- unified shop/category architecture
- server-data rendering
- crawl/URL architecture
- product/merchant SEO
- content/topical authority
- local SEO/brand entity
- SEO release acceptance

### Backend foundation

Backend Laravel در طول فازهای پایه به این domainها رسیده است:

- catalog/categories/products/variants/inventory
- customer auth/session/OTP infrastructure/Google identity
- checkout/orders/idempotency/reservations
- payment abstraction + Zarinpal verify/reconciliation
- delivery/addresses/fulfillment
- content/pages/FAQ/gallery/posts/city pages
- reviews/inquiries
- notification templates/outbox
- Filament administration
- activity/security/readiness/backup/monitoring

اسناد backend مرجع شامل `docs/LARAVEL_BACKEND_COMPLETE.md`, `docs/FULL_LAUNCH_ROADMAP.md`, `docs/API_CONTRACT.md`, `docs/CUSTOMER_AUTH.md`, `docs/ORDERS_CHECKOUT.md`, `docs/PAYMENTS.md`, `docs/OPERATIONS_POLICIES.md` و `docs/BACKUP_RESTORE.md` هستند.

### Phase 28 — SEO Route Architecture

- **COMPLETED / MERGED / REGISTERED**
- Frontend exact CI head: `26c5ef080b910b9b6cf7177cae401e7fe48bb180`
- PR `#37`
- Closure: `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`

### F29S — SEO Content Strategy & Topical Authority

- **PASS / MERGED / REGISTERED / CLOSED**
- Tracker `cooci#38` — CLOSED
- Frontend closure head before F29: `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend integration: `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Closure: `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`

SEO architecture قفل‌شده:

- commercial category intent متعلق به category URL است، نه Home یا product
- filter/search URLs نباید indexable duplicate بسازند
- category -> guide و guide -> commercial/category internal linking architecture
- product SEO/JSON-LD از backend-authoritative fields
- fake review/rating schema ممنوع
- local landing فقط برای location واقعی

### F29 — Google Login & Auth Closure

- **PASS / MERGED / REGISTERED / CLOSED**
- Tracker `cooci#48`
- identity key = Google `sub`
- auto-link صرفاً با email/phone ممنوع
- OAuth state validation اجباری
- mobile capture به معنی mobile verification نیست
- OTP infrastructure نگه داشته شده و بدون provider واقعی fail-closed است
- Closure: `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`

### F30 — Mainline / Git Stack Closure

- **PASS / MERGED / REGISTERED / CLOSED**
- Tracker `cooci#50` — CLOSED
- Frontend source: `d17054b783eabff96db8bd3100402f50d15e2b55`
- Frontend PR `#51` — MERGED -> `main` merge `19e5502549907c75c7800337716e71da469de050`
- Backend source: `e57ee2dcde2c3a67eaeda3d379790021eebcf03b`
- Backend PR `#15` — MERGED
- Legacy Frontend PR `#36` — CLOSED / SUPERSEDED / NOT MERGED
- Closure: `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`

F30 همچنین Backend Authority و NAP/Organization/WebSite/Contact/Locations/City source-of-truth مشترک را قفل کرد.

### Phase19B — Live Server Execution

- **COMPLETED / PRODUCTION READY / LIVE ATTESTED / RESTORE VERIFIED / ROLLBACK VERIFIED / CLOSED**
- Backend production release family: `6a23406ae222f2a71570`
- reboot survival: PASS
- backup restore: PASS
- database restore: PASS
- persistent media restore: PASS (`201` media در evidence اصلی)
- backend rollback: PASS
- frontend rollback: PASS
- production smoke: PASS
- Closure: `docs/PHASE19B_LIVE_SERVER_EXECUTION_CLOSURE_FA.md`

شواهد reboot/restore/rollback بدون mutation مرتبط دوباره اجرا نمی‌شوند.

### Phase20 — External Activation

- **COMPLETED / CLOSED**
- Zarinpal production runtime + verified-payment evidence: PASS
- reconciliation: PASS
- duplicate authority/reference integrity: PASS
- network/TLS: PASS
- eNAMAD official SSR badge: PASS
- public secret audit: PASS
- در زمان closure، Google/Kavenegar به‌عنوان external dependency safely disabled ثبت شدند.
- Closure: `docs/PHASE20_EXTERNAL_ACTIVATION_CLOSURE_FA.md`

> وضعیت Google بعداً در خود F31 با credential واقعی مالک سرویس فعال و با login واقعی Production تأیید شد؛ بنابراین classification تاریخی Phase20 برای Google دیگر وضعیت زنده نیست. Kavenegar/OTP همچنان تا credential واقعی disabled باقی می‌ماند.

## 3) F31 — وضعیت live acceptance که دیگر نباید تکرار شود

F31 از `main`های بسته‌شده Phase20 شروع شد و هنوز **IN PROGRESS** است.

### Production release lock فعلی ثبت‌شده

```text
BACKEND_CURRENT=/var/www/winimi/backend/releases/6a23406ae222f2a71570
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/8855aed3b593be89ff10
FRONTEND_DEPLOYED_SOURCE=4bab98787114ed27613f26df31b40918d04dc80a
```

Frontend release `8855aed3b593be89ff10` بعد از اصلاح checkout empty-note deploy و smoke شد. Backend همان release معتبر Phase19B/F31 باقی مانده است.

### Google Production acceptance

- callback production: `https://api.winimibakery.com/auth/google/callback`
- login واقعی Google روی موبایل و بدون VPN: PASS
- Google identity به customer واقعی متصل شد
- mobile captured but unverified مطابق قرارداد: expected
- `OTP_ENABLED=false`

### Checkout / Zarinpal real purchase acceptance

Checkout spinner قبلی ناشی از `recipient.notes.trim()` روی `undefined` بود، نه CORS/session/service-worker. Fix در `CheckoutPage.tsx`:

```text
notes: (recipient.notes ?? "").trim() || undefined
```

بعد از deploy اصلاح‌شده، خرید واقعی Production انجام و درگاه زرین‌پال verify شد. این acceptance **نباید دوباره با پرداخت جدید تکرار شود** مگر regression جدید آن را invalidate کند.

Evidence اصلی خرید واقعی:

```text
REAL_PAID_ORDER=FOUND
ORDER_ID=2
ORDER_PUBLIC_ID=01M2057KFX4PJ4MKNRZQMNTZRD
ORDER_NUMBER=WNM-260908-ULYW0Z2L
ORDER_STATUS=delivered
PAYMENT_STATUS=paid
GRAND_TOTAL_TOMAN=1000
CUSTOMER_ID=3
GOOGLE_IDENTITY_LINKED=YES
PAYMENT_ID=2
PAYMENT_PUBLIC_ID=01M2057KZKFPAMDDMF5V5Y55K7
PROVIDER=zarinpal
VERIFIED_PAYMENT_STATUS=verified
AMOUNT_MATCH=PASS
PAYMENT_UNIQUENESS=PASS
DATABASE_MUTATION_DURING_FINAL_ATTESTATION=NO
```

Gate retained:

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

## 4) تصمیم مهم مالک پروژه: F31 هنوز بسته نشود

با وجود PASS شدن خرید واقعی، کاربر عمداً final closure را نگه داشته تا قبل از تحویل، UI/content/SEO admin polish کامل شود.

ترتیب محتوایی مورد توافق:

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

Search Console **بعد از تثبیت نهایی content/URL/polish** انجام می‌شود، نه قبل از آن.

## 5) F31 — تغییرات Frontend پیاده‌سازی‌شده در branch باز

Frontend PR: `sajadkhavas/cooci#54`  
Branch: `f31/final-acceptance-handoff`  
Base: `main @ bf364510cf6097c88ecd3a55cb40a72e18d8333a`  
Accepted implementation head قبل از این documentation checkpoint: `74989adee098194f781ffeb5ddbfb4b900afe528`

PR همچنان **OPEN / DRAFT / NOT MERGED / MERGEABLE** است.

Scope فعلی branch شامل:

- checkout empty-note regression fix/test
- Gift retirement/disabled route و حذف exposure از public navigation/CTA/sitemap surfaces
- Header active state به green/pastel contract
- ProductCard customer-copy cleanup و حذف out-of-stock image blur سنگین
- Product detail mobile ordering/space/content polish
- Footer separator/trust presentation polish
- eNAMAD presentation cleanup
- DraggableMarquee smoothness work
- Vazirmatn self-hosted installer + integrity verification + font CSS
- category/media/content contract updates
- bulk-cookie UX/discount related frontend contract
- storefront redirect policy/server resolver/client validation
- tests برای public-storefront retirement, redirects, checkout regression و bulk discount

### Frontend accepted implementation checkpoint

- Accepted head: `74989adee098194f781ffeb5ddbfb4b900afe528`
- `F30 Storefront Frontend Authority` — **SUCCESS**
- `Phase 19 Production Package` — **SUCCESS**
- `Frontend CI` — **SUCCESS**
- `Phase 8 Deployment Readiness` — **SUCCESS**
- `Phase 18 End-to-End Acceptance` — **SUCCESS** after targeted rerun attempt 2

Resolved changes:

```text
3fb48a60da8ef6fec62a6b03b8d1be22b7116f83 audit/redirect-aware return-await reconciliation
4222d40ad1c34b27160307c7732c01f998697611 Phase10.3 imageAlt fixture alignment
74989adee098194f781ffeb5ddbfb4b900afe528 matching F31 Backend branch in Phase18 PR acceptance
```

Final evidence includes Phase18 `27 passed / 1 skipped`, Phase10.3 `12 passed`, Phase10.4 `10 passed`, Phase10.5–10.8 each `8 passed`, Phase10.9 `2 passed`, Backend E2E `3 passed / 66 assertions`, and runtime performance `8 passed`. Frontend CI blocker فعال ندارد.

## 6) F31 — تغییرات Backend پیاده‌سازی‌شده در branch باز

Backend PR: `sajadkhavas/winimi-bakery-backend#17`  
Branch: `f31/final-acceptance-handoff`  
Base: `main @ 54a33874c4f54e8a5976804a6cea5ea5d2d371f7`  
Accepted implementation head: `900975f6870760a00df984ddfff787528086f1ab`

PR همچنان **OPEN / DRAFT / NOT MERGED / MERGEABLE** است.

Scope branch شامل:

- backup env/documentation alignment
- category `image_alt` support در model/resource/Filament + migration + tests
- cookie bulk discount settings/service/checkout integration/tests
- Redirect model/resource hardening
- StorefrontRedirectController + API route
- redirect chain/final-target resolution
- protected-route/open-redirect/self-loop/loop safety
- removal of stale one-hour redirect cache behavior
- public storefront redirect tests

### Backend exact-head CI status روی `900975f...`

- `Phase 18 Backend Acceptance` — **SUCCESS**
- `Backend CI` — **SUCCESS**
- `Phase 19 Production Package` — **SUCCESS**

Pint blocker با خروجی دقیق formatter رفع شد:

```text
1974563504c4a8b8f53a477c29a0d3a0d79d3299 = exact PHPDoc spacing fix
900975f6870760a00df984ddfff787528086f1ab = diagnostic cleanup / accepted head
```

هر سه workflow Backend سبز شدند و stages بعدی migration/test/security نیز اجرا و PASS شدند. Backend CI blocker فعال ندارد.

## 7) UI / content polish decisions ثبت‌شده

این‌ها تصمیمات approved هستند و چت بعدی نباید دوباره از صفر design discovery کند:

1. **کل redesign ممنوع**؛ structure فعلی Home/Products حفظ و polish می‌شود.
2. active header سبز پاستلی باشد، نه terracotta.
3. technical/backend/server language از customer UI حذف شود.
4. Gift فعلاً در کل public storefront غیرفعال باشد ولی code برای آینده قابل بازیابی بماند.
5. Product Detail mobile: image -> name/price -> variants -> purchase -> detailed info.
6. Product Detail desktop باید فضای خالی را با data واقعی محصول مصرف کند، نه filler.
7. eNAMAD وسط و مستقل؛ متن‌های جانبی حذف شوند و failure تصویر layout را خراب نکند.
8. Footer separatorها کمی واضح‌تر شوند.
9. Vazirmatn self-hosted به‌صورت pinned/integrity-checked استفاده شود.
10. marquee desktop smooth/compositor-friendly شود.
11. out-of-stock product image blur حذف شود؛ تصویر واقعی دیده شود و unavailable state ساده باشد.
12. Products page structure/SEO architecture/filtered noindex حفظ شود؛ toolbar/category duplication فشرده‌تر شود.
13. mobile products filter UX بعداً full-width search + sort/filter + category chips + secondary drawer/bottom-sheet شود.
14. category/product/article/static copy و SEO fields تا جای ممکن Admin-managed باشند.
15. slug change safety نیازمند redirect manager است؛ URL قدیمی نباید بدون redirect رها شود.

## 8) Product/client source-of-truth موجود

Client catalog historical source در Frontend repo:

- `src/data/products.ts`
- commit تاریخی: `c0be99195bd9e0b7bd6e123c0dff5d7c4f98b085` — `Transfer complete Winimi product catalog data`

Known category families در آن data:

- کوکی‌ها
- مینی کوکی
- کیک و دسر
- رژیمی و بدون قند
- رول و کروسان
- باکس هدیه

اما feature Gift اکنون public-retired است؛ محتوای واقعی نهایی باید با اطلاعات فعلی کارفرما reconcile شود و claim ساختگی ساخته نشود.

SEO reference data:

- `src/data/categoriesContent.ts`
- `docs/seo/F29S_A_KEYWORD_INTELLIGENCE_FA.md`
- `docs/seo/F29S_B_KEYWORD_TO_URL_MAP_FA.md`
- `docs/seo/F29S_C_TOPIC_CLUSTER_ARCHITECTURE_FA.md`
- `docs/seo/F29S_F_PRODUCT_SEO_AUDIT_FA.md`
- `docs/seo/F29S_H_INTERNAL_LINKING_INFORMATION_ARCHITECTURE_FA.md`

## 9) Category image approved asset

برای دسته «کوکی‌های خانگی» یک cover جدید بر اساس تصاویر واقعی مشتری ساخته و توسط کاربر تأیید شده است.

Approved generated source در session artifact:

```text
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting.png
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.webp
/mnt/data/gourmet_cookies_in_a_cozy_bakery_setting_optimized.jpg
```

Web target پیشنهادی: WebP.  
SEO-safe filename پیشنهادی: `winimi-homemade-cookies-category.webp`  
Alt پیشنهادی و truthful: `مجموعه کوکی‌های خانگی وینیمی با طعم‌های شکلاتی، ردولوت و مغزی`

این asset هنوز فقط وقتی production/admin media واقعاً آپلود و reference شود، live محسوب می‌شود.

## 10) Production safety / retained evidence

Backup/recovery evidence Phase19B/F31 تا زمانی که production mutation مرتبط invalidate نکرده retained است. نمونه backup ثبت‌شده:

```text
/var/www/winimi/backend/shared/storage/app/private/Winimi Bakery/2026-09-08-00-50-57.zip
SHA256=a368ee939e6f6d745cb3adc70576d20b4e803368ec2e58649fdb76531da7bed1
ZIP_ENTRIES=1429
MEDIA=201
ENCRYPTION=PASS
```

Root ownership incident قبلی recover شده است. Laravel config/cache را به‌صورت root بدون normalization ownership/mode نساز.

## 11) F31 current live checkpoint — 2026-09-09

Frontend mobile/product-detail polish was completed, exact-head CI passed and the immutable Frontend release was deployed.

```text
FRONTEND_HEAD=893453fd2599024dfb90fe666e29c30293405017
FRONTEND_CI=5_OF_5_SUCCESS
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/00fc63d9e485b1419c6c
BACKEND_HEAD=d51df49f367190f102fa70ffe1f62a7f17aa761e
BACKEND_CI=4_OF_4_SUCCESS
BACKEND_CURRENT=/var/www/winimi/backend/releases/b7dd719811c14994eeb8
PUBLIC_HOME=200
PUBLIC_PRODUCTS=200
BACKEND_READY=200
ENAMAD_SSR=VISIBLE
```

Implemented and deployed:

- pastel-green hamburger control and mobile drawer
- pastel-green four-column bottom navigation with Home, Store, Cart and Account centered evenly
- retired Gift no longer reserves a fifth empty navigation column
- Product Detail main image and gallery thumbnails fill their own frames
- latest Backend-managed official eNAMAD markup remains authoritative and visible
- no Backend, migration, backup, order or payment mutation occurred

The initial loopback connection refusal during restart was transient; the deployment wrapper retry completed and final internal/public health passed.

## 12) Canonical continuation discipline

`WINIMI_PROJECT_STATUS_FA.md` is the comprehensive zero-to-100 authority. This Living Handoff preserves chronology and technical context. The F31 Worklog preserves exact acceptance/deployment evidence.

Every material checkpoint must record:

```text
WHAT_CHANGED
EXACT_SHA
CI_RESULT
PRODUCTION_RELEASE
LIVE_RESULT
REMAINING_WORK
CURRENT_NEXT_ACTION
DO_NOT_REPEAT
```

Current-tree cleanup at final closure means obsolete files, diagnostics, fixtures, routes and contradictory documentation are removed from the final branch. Git history is deliberately retained for evidence and rollback.

## 13) CURRENT_NEXT_ACTION — continue exactly here

```text
FIRST=ENRICH_PRODUCT_CONTENT_FROM_VERIFIED_EMPLOYER_FACTS
VERIFY=PRICES_DISCOUNTS_STOCK_WEIGHT_PREPARATION_AND_DELIVERY_CLAIMS
THEN=RECONCILE_CATEGORIES_ARTICLES_STATIC_PAGES_INTERNAL_LINKS
THEN=FINAL_CURRENT_TREE_DEAD_CODE_AND_OBSOLETE_DOC_CLEANUP
THEN=USER_VISUAL_AND_CONTENT_APPROVAL
THEN=READY_AND_MERGE_PR54_PR17
THEN=POST_MERGE_MAIN_CI_AND_PRODUCTION_RECONCILIATION
THEN=SEARCH_CONSOLE_FINAL_CHECK_AND_FREEZE_TAG_HANDOFF
REAL_PAYMENT_REPEAT=NO
GOOGLE_LOGIN_REPEAT=NO
RESTORE_ROLLBACK_REPEAT=NO_UNLESS_INVALIDATED
```

PR `#54` and PR `#17` remain Draft/open/not merged until content and visual approval.

## 14) Final marker

Only after the sequence above:

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


## F31 Production Frontend compile-environment correction — 2026-09-09

The first technically activated Frontend artifact `fd4472c3dac57417bd83` was built without Vite's compile-time Production integration variables. SSR could render Backend data, but hydrated browser code treated the Backend as disabled and displayed the catalog error. The application source was correct; the server Build invocation was incomplete.

The exact same accepted source was rebuilt with the CI/Production contract:

```text
NODE_ENV=production
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://api.winimibakery.com
VITE_ALLOW_DEV_MOCKS=false
WINIMI_API_ORIGIN=https://api.winimibakery.com
```

Final live evidence:

```text
FRONTEND_REBUILD_RESULT=PASS
ACTIVE_FRONTEND_RELEASE=/var/www/winimi/frontend/releases/9d5c90ad98f635ee93ee
FRONTEND_SOURCE_SHA=643c75209292ba7a24617dd17b76ccc689ea92a4
ACTIVE_BACKEND_RELEASE=/var/www/winimi/backend/releases/3d53e8c0c92d9e3888c4
BACKEND_SOURCE_SHA=07d38915561f40cae57a3ad529b3dc155340d9c6
FRONTEND_INTERNAL_PROCESS_IDENTITY=PASS
CATALOG_API_HTTP=200
PUBLIC_HOME_HTTP=200
PUBLIC_PRODUCTS_HTTP=200
PWA_MANIFEST_HTTP=200
PWA_SERVICE_WORKER_HTTP=200
BACKEND_CHANGED_DURING_CORRECTION=NO
DATABASE_CHANGED_DURING_CORRECTION=NO
MIGRATION_EXECUTED_DURING_CORRECTION=NO
ORDER_PAYMENT_MUTATION=NO
SUPERSEDED_FRONTEND_RELEASE=fd4472c3dac57417bd83
```

`9d5c90ad98f635ee93ee` is the authoritative active Frontend release. Do not reactivate `fd4472c3dac57417bd83`.

```text
CURRENT_NEXT_ACTION=CLIENT_CACHE_REFRESH_AND_VISUAL_ACCEPTANCE_THEN_VAPID_AND_VERIFIED_CONTENT
DO_NOT_REPEAT=REAL_GOOGLE_LOGIN_REAL_ZARINPAL_PURCHASE_REAL_ORDER_PHASE19B_RESTORE_ROLLBACK
```

## F31 — Final installable app, push and navigation package (2026-09-09)

این checkpoint نصب مستقل PWA و shortcutهای long-press، Service Worker اعلان، opt-in اعلان مهمان و مشتری، منوی Backend-authoritative فروشگاه در desktop/mobile، bottom navigation پنج‌تایی و رفع repaint سنگین Decision Support را جمع می‌کند.

- `EXACT_SHA`: FE remote `971dbf646b858a824f45caadb5cbe37e1d4d271c`; BE remote `ebdcfe5dcbac99b801c160502222b8db6661f3c4`.
- `CI_RESULT`: FE full local PASS؛ BE و remote CI pending.
- `CURRENT_NEXT_ACTION`: composer.lock + backend tests/CI، سپس pair release و production activation.
- `DO_NOT_REPEAT`: خرید، سفارش، ورود گوگل و عملیات restore/rollback قبلی بدون evidence جدید ممنوع است.

Backend-authority reconciliation confirmed the pre-existing 190+ editable public settings and all dedicated content/catalog domains. The remaining new app-shell copy is now represented by `app_ui.*`; navigation and consented push broadcast are manageable from Filament. The official Web Push PHP runtime is locked at v11.0.0.
