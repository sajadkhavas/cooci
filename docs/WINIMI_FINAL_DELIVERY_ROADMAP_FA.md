# نقشه نهایی تحویل پروژه وینیمی

تاریخ ثبت: ۲۰۲۶-۰۹-۰۵  
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
- Final required gates on exact head: Frontend CI, Phase 8, Phase 18 and Phase 19 package all PASS.
- Production deployment of the Phase 28 chain has **not yet been recorded as completed**.

### Current Git stack

- Current integration branch: `phase-27/cross-project-design-synthesis`
- PR `#36` is still **OPEN / DRAFT** and targets `phase-26/uir1-home-navigation-redesign`.
- The Phase 27 chain, including merged Phase 28, is not yet closed into `main`.
- Therefore final production delivery must not claim that `main` is the source of truth until Mainline Closure is completed.

## باقی‌مانده تا تحویل نهایی

Five execution phases remain.

---

# F29 — Google Login & Auth Closure

هدف: تکمیل Auth نهایی با Google Login بدون حذف زیرساخت OTP.

## مراحل

1. Google OAuth architecture
   - OAuth Client متعلق به کارفرما
   - Production redirect URI
   - Client secret فقط در server environment

2. Backend Google identity
   - provider
   - provider user id
   - account identity uniqueness
   - safe persistence

3. Secure account linking
   - عدم link خودکار صرفاً با email یا phone
   - جلوگیری از account takeover
   - explicit secure linking flow

4. OAuth callback + Sanctum session
   - state validation
   - callback handling
   - authenticated session
   - logout / invalid callback

5. New user phone completion
   - کاربر Google جدید شماره موبایل ایران وارد کند
   - تا OTP واقعی، `phone_verified_at` خالی بماند

6. OTP feature flag
   - کد OTP حذف نشود
   - UI/Backend قابلیت فعال‌سازی مجدد داشته باشند
   - تا آماده‌شدن provider می‌تواند disabled بماند

7. Frontend Auth UX
   - login
   - loading/error/cancel
   - post-login redirect
   - account bootstrap

8. QA / CI / Merge / Registration
   - new user
   - existing user
   - duplicate identity
   - logout/login
   - tampered callback
   - CSRF/session
   - Frontend + Backend CI

### Gate پایان F29

Google Login واقعی، Sanctum session امن، phone completion و OTP feature-flag همگی PASS و ثبت شده باشند.

---

# F30 — Mainline / Git Stack Closure

هدف: بستن stack فازهای باز و رساندن release candidate نهایی به `main`.

## مراحل

1. Freeze SHAهای نهایی Frontend/Backend.
2. بستن PR و CI فاز Auth.
3. بررسی و بستن PR #36 / Phase 27 روی Phase 26.
4. بستن زنجیره Phase 26/27/28/Auth تا `main`.
5. حل conflict فقط surgical؛ بدون force-push/rebase مخرب.
6. اجرای release gates روی exact head نهایی:
   - Frontend CI
   - Phase 8 Deployment Readiness
   - Phase 18 End-to-End
   - Phase 19 Production Package
   - Backend quality gates
7. Merge نهایی به `main`.
8. ثبت Frontend END_SHA، Backend END_SHA، PRها، CI run IDs و release hashes.

### Gate پایان F30

Source مورد استفاده برای Production دقیقاً در `main` ثبت و قابل بازتولید باشد.

---

# Phase 19B — Live Server Execution

هدف: اجرای release نهایی روی VPS واقعی و ثبت `production_deployed=ready`.

Server: `hwsrv-1332134`

## مراحل

1. Live server read-only preflight
   - hostname/repository/SHA locks
   - current symlinks
   - active releases
   - systemd/Nginx/Node/PHP
   - disk and runtime environment
   - API ready/health

2. Backup point
   - database backup
   - media backup
   - checksums
   - previous release IDs
   - rollback target

3. Backend re-attestation / deployment if Auth introduced backend delta
   - migrations
   - env linkage
   - config/route cache
   - queue
   - scheduler
   - readiness

4. Frontend deterministic production build
   - `npm ci`
   - full checks
   - production build
   - release create
   - manifest SHA-256
   - release verify

5. Candidate SSR acceptance before Production mutation
   - SSR health
   - home/products
   - sitemap/robots
   - canonical
   - API connectivity

6. Atomic activation
   - immutable release
   - atomic `current`
   - frontend service restart
   - health check
   - automatic rollback on activation failure

7. Public Production smoke
   - Home
   - Products/Product
   - Account/Login
   - Cart/Checkout
   - Blog/Gift/Locations
   - 404
   - frontend health
   - backend ready

8. Production SEO verification
   - sitemap
   - robots
   - canonical
   - index/noindex
   - structured data
   - internal links
   - conditional publication policies

9. Services and reboot survival
   - frontend
   - PHP-FPM
   - queue
   - scheduler
   - Nginx

10. Backup + isolated restore drill

11. Frontend and migration-aware backend rollback drill

12. Monitoring + Search activation
   - 5xx/service failures
   - queue/backup/disk
   - CWV logs
   - Search Console ownership
   - sitemap submission
   - representative URL inspection

### Gate پایان Phase 19B

`production_deployed=ready` فقط بعد از PASS شدن تمام شواهد فوق.

---

# Phase 20 — External Activation

هدف: فعال‌سازی credentialهای خارجی بدون feature development جدید.

## مراحل

1. Google Production OAuth credentials
   - production client
   - authorized domain/redirect
   - live login validation

2. Zarinpal final live regression
   - low-value successful payment
   - cancel/fail
   - retry
   - callback verify
   - duplicate callback
   - order state
   - stock once-only
   - idempotency/reconciliation

3. eNAMAD
   - official badge code
   - safe rendering
   - production domain verification

4. Kavenegar / SMS when credentials are available
   - API key
   - approved OTP template
   - OTP send/resend/expiry/rate-limit
   - order notification
   - if unavailable, OTP infrastructure remains disabled by feature flag

5. Secret audit
   - secrets only in server env
   - no Git/build leakage
   - config cache/restart/health

6. Provider evidence
   - timestamp
   - transaction/message identifier
   - sanitized evidence
   - rollback/deactivation procedure

### Gate پایان Phase 20

تمام providerهای آماده فعال و live-regression شده باشند؛ providerهای تحویل‌نشده از سمت کارفرما باید با feature flag امن disabled و به‌عنوان external dependency ثبت شوند.

---

# F31 — Final Acceptance & Handoff

هدف: آخرین QA، عملیات، مستندات و freeze تحویل.

## مراحل

1. End-to-end customer journey
   - Home → Product → Cart → Login → Address → Delivery → Checkout → Payment → Order → Account
   - Desktop + Mobile

2. Admin / Filament acceptance
   - product/category
   - stock
   - order/payment
   - content/gallery/review/inquiry
   - users/audit visibility

3. Security regression
   - CSRF/Sanctum
   - authorization/IDOR
   - OAuth state/linking
   - payment callback replay
   - rate limits
   - secret leakage

4. Final SEO acceptance
   - sitemap/robots/canonical
   - Product/Organization/WebSite schemas
   - noindex private routes
   - real 404
   - Search Console evidence

5. Operational acceptance
   - reboot
   - services
   - backups
   - restore
   - rollback
   - TLS renewal
   - log rotation
   - capacity

6. Final evidence pack
   - Frontend SHA
   - Backend SHA
   - release IDs
   - manifest hashes
   - migration state
   - production URLs
   - service state
   - backup checksum
   - restore result
   - rollback result
   - CI run IDs
   - Search Console evidence

7. Documentation / handoff
   - Living Handoff
   - deployment/rollback runbooks
   - credential ownership
   - provider state
   - backup/restore
   - known limitations

8. Final freeze
   - final release/tag
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

`F29 Google Login → F30 Mainline Closure → Phase 19B Production → Phase 20 External Activation → F31 Final Acceptance & Handoff`

پیشنهاد اجرایی ثبت‌شده: اگر هدف تحویل نهایی سریع است، Phase 28 به‌تنهایی deploy نشود؛ ابتدا F29 و F30 بسته شوند و سپس یک release نهایی تمیز از `main` به Production برود، مگر اینکه کاربر صراحتاً interim deployment بخواهد.
