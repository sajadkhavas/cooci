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
IMPLEMENTATION_SNAPSHOT_BEFORE_DOC_CHECKPOINT=89fcfc11391ac92e71023a82334aaa5f054dead2
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

### Frontend current CI checkpoint روی implementation snapshot `89fc...`

```text
F30 Storefront Frontend Authority 34248716957 = SUCCESS
Phase 19 Production Package       34248716976 = SUCCESS
Frontend CI                       34248716971 = FAILURE
Phase 8 Deployment Readiness      34248716966 = FAILURE
Phase 18 End-to-End Acceptance    34248717023 = FAILURE
```

Concrete blocker:

```text
src/routes/category-shop.tsx: missing managed category server data loader
```

Failure در `audit-frontend-phase-10-3.mjs` رخ می‌دهد؛ auditهای قبل از آن PASS هستند.

## Backend F31 branch / PR

```text
REPO=sajadkhavas/winimi-bakery-backend
BRANCH=f31/final-acceptance-handoff
PR=17
PR_STATE=OPEN_DRAFT_NOT_MERGED_MERGEABLE
BASE_MAIN=54a33874c4f54e8a5976804a6cea5ea5d2d371f7
IMPLEMENTATION_HEAD=d6a155f114c94c5ebd7ad42031dc5e9ff6142309
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
Phase 18 Backend Acceptance 34248330877 = SUCCESS
Backend CI                  34248330799 = FAILURE
Phase 19 Production Package 34248330820 = FAILURE
```

Concrete blocker:

```text
Pint formatting is clean = FAILURE
app/Services/Orders/CookieBulkDiscountService.php
reported rule includes unary_operator_spaces
```

تا Pint سبز نشود stages بعدی migration/test/security در workflow اجرا نمی‌شوند.

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

## CURRENT_NEXT_ACTION

```text
FIRST=FETCH_LIVE_PR_HEADS_AND_CI
FRONTEND_FIX=RECONCILE_CATEGORY_SHOP_MANAGED_SERVER_DATA_LOADER_WITH_PHASE10_3_AUDIT
BACKEND_FIX=RESOLVE_EXACT_PINT_OUTPUT_IN_COOKIE_BULK_DISCOUNT_SERVICE
THEN=EXACT_HEAD_CI_BOTH_REPOS
NEXT_AFTER_GREEN=CONTINUE_PAGE_BY_PAGE_UI_CONTENT_SEO_ADMIN_POLISH
REAL_PAYMENT_REPEAT=NO
PHASE19B_RESTORE_ROLLBACK_REPEAT=NO_UNLESS_INVALIDATED
MERGE_PR54_PR17=NO_UNTIL_USER_CONFIRMS_POLISH_COMPLETE
F31_CLOSE=NO_UNTIL_FINAL_CONTENT_AND_POLISH_COMPLETE
```

## Final closure sequence

بعد از پایان polish/content:

```text
reconcile final docs/status
-> exact-head frontend/backend CI all green
-> unresolved blockers/review threads = 0
-> merge PR #54 / #17
-> post-merge CI main
-> deploy accepted merged source if production differs
-> production smoke + SHA match
-> final tag/freeze/handoff
-> Search Console on stable structure
```

فقط بعد از این موارد مجاز است:

```text
F31=COMPLETED
ALL_DELIVERY_PRS=MERGED
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
