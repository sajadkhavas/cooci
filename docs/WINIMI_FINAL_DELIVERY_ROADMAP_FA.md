# نقشه نهایی تحویل پروژه وینیمی

آخرین به‌روزرسانی: ۲۰۲۶-۰۹-۰۵  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`

> این سند مرجع رسمی مراحل باقی‌مانده تا تحویل نهایی است. برای وضعیت لحظه‌ای ابتدا `WINIMI_PROJECT_STATUS_FA.md` خوانده شود.

## وضعیت مبنا

### Phase 28 — SEO Route Architecture

- Status: **COMPLETED / MERGED / REGISTERED**
- Branch: `phase-28/seo-route-architecture`
- Exact CI head: `26c5ef080b910b9b6cf7177cae401e7fe48bb180`
- PR: `#37`
- Merge SHA into Phase 27: `76085a078e3068be479461582258a828f32496c6`
- Closure record: `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`
- Frontend CI، Phase 8، Phase 18 و Phase 19 package روی exact head همگی PASS شده‌اند.
- Production deployment زنجیره Phase 28 هنوز با evidence زنده سرور به‌عنوان تحویل نهایی ثبت نشده است.

### Current Git stack

- Integration branch: `phase-27/cross-project-design-synthesis`
- PR `#36` هنوز **OPEN / DRAFT** و target آن `phase-26/uir1-home-navigation-redesign` است.
- Phase 27 شامل Phase 28 merge‌شده است، اما stack نهایی هنوز به `main` بسته نشده است.
- بنابراین تا F30، `main` منبع نهایی release نیست.

## تصمیم جدید پس از Phase 28

Phase 28 Technical SEO و Route Architecture را بست، اما Content SEO و Topical Authority کامل نشده‌اند. به همین دلیل قبل از Google Login یک فاز مستقل اضافه شد:

`F29S — SEO Content Strategy & Topical Authority`

مرجع کامل این فاز:

`docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`

این تصمیم Phase 28 را reopen نمی‌کند؛ F29S لایه بعدی SEO است.

# باقی‌مانده تا تحویل نهایی

**Six execution phases remain.**

1. **F29S — SEO Content Strategy & Topical Authority**
2. **F29 — Google Login & Auth Closure**
3. **F30 — Mainline / Git Stack Closure**
4. **Phase 19B — Live Server Execution**
5. **Phase 20 — External Activation**
6. **F31 — Final Acceptance & Handoff**

---

# F29S — SEO Content Strategy & Topical Authority

هدف: تکمیل بخش‌هایی از SEO که Phase 28 عمداً نبسته بود: Keyword Intelligence، Content Authority، Guide/Article strategy، Topic Clusters، Commercial Keyword Mapping، Product SEO audit، Local/Merchant/Trust content و Internal Linking.

## مراحل

1. **Keyword Intelligence**
   - بازار فارسی/ایران
   - Transactional / Commercial / Informational / Local / Brand intent
   - Secondary و Long-tail queries
   - SERP/competitor evidence

2. **Keyword-to-URL Map**
   - Home
   - Products
   - Categories
   - Product detail
   - Gift
   - Corporate
   - Guides/Topics
   - FAQ/About/Quality/Shipping/Contact
   - Local routes فقط با داده واقعی

3. **Topic Cluster Architecture**
   - کوکی و انتخاب محصول
   - هدیه و باکس هدیه
   - پذیرایی و تعداد سفارش
   - نگهداری/ماندگاری/ارسال سرد
   - کیک/چیزکیک
   - رژیمی/بدون قند افزوده
   - سفارش سازمانی
   - Cluster نهایی فقط براساس تحقیق انتخاب می‌شود.

4. **Guide / Article Foundation**
   - فعال‌کردن واقعی `/blog`, `/blog/topic/:topic`, `/blog/:slug`
   - انتشار محتوای Backend/CMS واقعی
   - SSR، Article schema، author/date، breadcrumbs، related guides
   - Home Editorial Guides به مقاله/Hub اختصاصی واقعی لینک شوند، نه placeholder عمومی `/blog`

5. **Commercial Content SEO**
   - بازنگری Home/Products/Categories/Gift/Corporate بر اساس Keyword Map واقعی
   - Title/H1/description/copy/internal links/schema/cannibalization

6. **Product SEO Audit**
   - محصولات منتشرشده واقعی
   - SEO metadata، description، images، Product/Offer، inventory truth، duplicate/thin content

7. **Local / Merchant / Trust Content**
   - city pages فقط در صورت evidence واقعی
   - Shipping/Return/About/Quality/Contact/FAQ/Reviews policy
   - doorway pages و claim ساختگی ممنوع

8. **Internal Linking / Information Architecture**
   - Home ↔ Guide ↔ Category/Product
   - Topic hub ↔ supporting guides
   - anchor strategy
   - no broken links / no cannibalization

9. **Measurement Plan**
   - Search Console mapping
   - sitemap/URL Inspection set
   - query/page tracking matrix
   - refresh policy

10. **QA / CI / Merge / Registration**
   - intent documented
   - unique metadata/H1
   - SSR/canonical/robots/status/schema
   - crawl/internal links
   - mobile/accessibility/performance
   - CI green
   - PR/Merge/Register

### Gate پایان F29S

- Keyword Intelligence و URL Map ثبت شده باشد.
- Topic Cluster architecture نهایی باشد.
- حداقل یک Cluster اولویت‌دار با محتوای واقعی و supporting guideهای لازم فعال باشد.
- Home guide cards به مقصد اختصاصی معتبر برسند.
- Commercial/Product/Local/Merchant decisions ثبت و Audit شده باشند.
- Internal-link/no-cannibalization/crawl/CI gateها PASS باشند.
- PR Merge و Phase Registration انجام شده باشد.

مرجع جزئیات: `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`

---

# F29 — Google Login & Auth Closure

هدف: تکمیل Auth نهایی با Google Login بدون حذف زیرساخت OTP.

## مراحل

1. Google OAuth architecture
   - OAuth Client متعلق به کارفرما
   - Production redirect URI
   - Client secret فقط در server environment
2. Backend Google identity
   - provider / provider user id / uniqueness / persistence
3. Secure account linking
   - عدم link خودکار صرفاً با email/phone
   - جلوگیری از account takeover
4. OAuth callback + Sanctum session
   - state validation / callback / session / logout
5. New user phone completion
   - شماره موبایل ایران
   - `phone_verified_at` تا OTP واقعی خالی
6. OTP feature flag
   - حذف زیرساخت ممنوع
   - قابلیت فعال‌سازی مجدد
7. Frontend Auth UX
   - login/loading/error/cancel/redirect/account bootstrap
8. QA / CI / Merge / Registration
   - new/existing user
   - duplicate identity
   - tampered callback
   - CSRF/session

### Gate پایان F29

Google Login واقعی، Sanctum session امن، phone completion و OTP feature flag همگی PASS و ثبت شده باشند.

---

# F30 — Mainline / Git Stack Closure

هدف: بستن stack فازهای باز و رساندن release candidate نهایی به `main`.

## مراحل

1. Freeze SHAهای نهایی Frontend/Backend.
2. بستن PR و CI فاز F29S و Auth.
3. بررسی و بستن PR #36 / Phase 27 روی Phase 26.
4. بستن زنجیره Phase 26/27/28/F29S/Auth تا `main`.
5. حل conflict فقط surgical؛ بدون force-push/rebase مخرب.
6. exact-head release gates:
   - Frontend CI
   - Phase 8
   - Phase 18
   - Phase 19 package
   - Backend quality gates
7. Merge نهایی به `main`.
8. ثبت END_SHAها، PRها، CI run IDs و release hashes.

### Gate پایان F30

Source مورد استفاده برای Production دقیقاً در `main` ثبت و قابل بازتولید باشد.

---

# Phase 19B — Live Server Execution

هدف: اجرای release نهایی روی VPS واقعی و ثبت `production_deployed=ready`.

Server: `hwsrv-1332134`

## مراحل

1. Live server read-only preflight
   - hostname/repository/SHA/current/service/runtime/API locks
2. Backup point
   - DB/media/checksums/rollback targets
3. Backend re-attestation/deployment if new backend delta exists
   - migrations/env/cache/queue/scheduler/readiness
4. Frontend deterministic production build
   - npm ci/check/build/release create/manifest/release verify
5. Candidate SSR acceptance before mutation
   - health/home/products/sitemap/robots/canonical/API
6. Atomic activation
   - immutable release/current/service/health/auto rollback
7. Public Production smoke
   - Home/Products/Product/Login/Cart/Checkout/Guides/Gift/Locations/404/health/ready
8. Production SEO verification
   - sitemap/robots/canonical/indexability/schema/internal links/content routes
9. Services and reboot survival
10. Backup + isolated restore drill
11. Frontend and migration-aware backend rollback drill
12. Monitoring + Search activation
   - logs/5xx/queue/backup/disk/CWV/Search Console/sitemap/URL inspection

### Gate پایان Phase 19B

`production_deployed=ready` فقط بعد از PASS تمام شواهد فوق.

---

# Phase 20 — External Activation

هدف: فعال‌سازی credentialهای خارجی بدون feature development جدید.

## مراحل

1. Google Production OAuth credentials + live validation
2. Zarinpal final live regression
   - success/fail/retry/callback/duplicate/idempotency/reconciliation
3. eNAMAD official badge + safe rendering
4. Kavenegar/SMS when credentials are available
   - OTP send/resend/expiry/rate-limit/order notifications
5. Secret audit
   - server env only / no Git or build leakage
6. Provider evidence
   - timestamp/identifier/sanitized evidence/deactivation procedure

### Gate پایان Phase 20

Providerهای آماده live-regression شده باشند؛ providerهای تحویل‌نشده با feature flag امن disabled و به‌عنوان external dependency ثبت شوند.

---

# F31 — Final Acceptance & Handoff

هدف: آخرین QA، عملیات، SEO measurement، مستندات و freeze تحویل.

## مراحل

1. End-to-end customer journey — Desktop + Mobile
2. Admin / Filament acceptance
3. Security regression
4. Final SEO acceptance
   - sitemap/robots/canonical/schema/noindex/404/Search Console/content indexation evidence
5. Operational acceptance
   - reboot/services/backups/restore/rollback/TLS/log rotation/capacity
6. Final evidence pack
   - Frontend/Backend SHA، release IDs، manifest hashes، migrations، production URLs، service state، backup/restore/rollback، CI، Search Console
7. Documentation / handoff
8. Final freeze
   - final tag
   - `main` clean
   - related open PRs = 0
   - unresolved review threads = 0
   - production matches recorded SHA
   - unresolved P0/P1 = 0

### Final marker

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```

---

## ترتیب قطعی ادامه

```text
F29S SEO Content Strategy
  -> F29 Google Login
  -> F30 Mainline Closure
  -> Phase19B Production
  -> Phase20 External Activation
  -> F31 Final Acceptance & Handoff
```

پیشنهاد اجرایی ثبت‌شده: Phase 28 به‌تنهایی deploy نشود. ابتدا F29S، F29 و F30 بسته شوند و سپس یک Release نهایی تمیز از `main` به Production برود، مگر اینکه کاربر صراحتاً interim deployment بخواهد.
