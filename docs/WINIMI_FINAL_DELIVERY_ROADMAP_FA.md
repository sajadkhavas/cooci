# نقشه نهایی تحویل پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۷**  
Project: **WINIMI / COOCI**  
Frontend Repository: `sajadkhavas/cooci`  
Backend Repository: `sajadkhavas/winimi-bakery-backend`

> این سند مرجع رسمی مراحل باقی‌مانده تا تحویل نهایی است. برای وضعیت لحظه‌ای ابتدا `WINIMI_PROJECT_STATUS_FA.md` خوانده شود. قبل از هر Production mutation، وضعیت live server باید read-only دوباره تأیید شود.

## فازهای بسته‌شده مبنا

### Phase 28 — SEO Route Architecture

- Status: **COMPLETED / MERGED / REGISTERED**
- Exact CI head: `26c5ef080b910b9b6cf7177cae401e7fe48bb180`
- PR: `#37`
- Merge SHA into Phase27: `76085a078e3068be479461582258a828f32496c6`
- Closure: `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`

### F29S — SEO Content Strategy & Topical Authority

- Status: **PASS / MERGED / REGISTERED / CLOSED**
- Tracker: `cooci#38` — CLOSED / COMPLETED
- Frontend closure head before F29: `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend F29S merge: `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Closure: `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`

### F29 — Google Login & Auth Closure

- Status: **PASS / MERGED / REGISTERED / CLOSED**
- Tracker: `cooci#48`
- Frontend implementation head: `55fdb43c8a7e43186ffe89139739de7e3c7bfdf7`
- Backend implementation head: `1bc34ade42b964351b517df9c94c7a79dbbfb781`
- Closure: `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
- Production credential activation عمداً برای Phase20 باقی مانده است.

### F30 — Mainline / Git Stack Closure

- Status: **PASS / MERGED / REGISTERED / CLOSED**
- Tracker: `cooci#50` — CLOSED / COMPLETED
- Frontend exact source: `d17054b783eabff96db8bd3100402f50d15e2b55`
- Frontend PR `#51`: MERGED
- Frontend merge SHA: `19e5502549907c75c7800337716e71da469de050`
- Backend exact source: `e57ee2dcde2c3a67eaeda3d379790021eebcf03b`
- Backend PR `#15`: MERGED
- Backend `main`: `37dcbf83ca225cacec40f034659d1448adaebaba`
- Legacy Frontend PR `#36`: CLOSED / SUPERSEDED / NOT MERGED
- Closure: `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`
- Production mutation/deploy: **NO**

## وضعیت Git stack بعد از F30

- Frontend final source در `main` قرار دارد.
- Backend final source در `main` قرار دارد.
- nested integration PR #36 بسته و containment آن داخل F30 اثبات شده است.
- Git/mainline دیگر blocker تحویل نیست.
- Production release باید از همین `main`های نهایی و پس از server re-attestation ساخته شود.

# باقی‌مانده تا تحویل نهایی

**دقیقاً سه فاز اجرایی باقی مانده است:**

1. **Phase 19B — Live Server Execution**
2. **Phase 20 — External Activation**
3. **F31 — Final Acceptance & Handoff**

---

# Phase 19B — Live Server Execution

هدف: اجرای release نهایی روی VPS واقعی و ثبت `production_deployed=ready` فقط پس از شواهد زنده.

Historical server identifier: `hwsrv-1332134`

> شناسه و checkpointهای تاریخی فقط سرنخ‌اند؛ قبل از mutation باید خود سرور دوباره تأیید شود.

## مراحل

1. **Live server read-only re-attestation**
   - hostname / OS / resources
   - current symlinks و release directories
   - process CWD / systemd services
   - frontend/backend runtime source SHA
   - Nginx/Caddy topology و PHP-FPM/Node runtime
   - DB/Redis/media/storage persistence
   - health/readiness/public HTTP
   - env/provider feature flags بدون افشای secret

2. **Backup point**
   - DB backup
   - media/storage backup
   - checksums
   - rollback targets
   - isolated restore verification

3. **Backend immutable release**
   - source از Backend `main`
   - dependency/security verification
   - env link و permissions
   - migrations با preflight
   - cache/config/routes
   - queue/scheduler readiness
   - candidate health/readiness قبل از activation در حد topology مجاز

4. **Frontend deterministic production release**
   - source از Frontend `main`
   - clean dependency install
   - type/lint/test/build/release verification
   - SSR package + manifest/hash

5. **Candidate acceptance before activation**
   - backend health/ready
   - Home / Products / Product
   - Login/Auth shell
   - sitemap / robots / canonical
   - SSR raw HTML
   - API connectivity

6. **Atomic activation**
   - immutable release directory
   - atomic `current` switch
   - controlled service restart/reload
   - automatic/manual rollback target محفوظ

7. **Public Production smoke**
   - Home
   - Products / categories / product detail
   - Login / Account bootstrap
   - Cart / Checkout pre-payment flow
   - Guides / Blog
   - Gift / Corporate
   - Locations / Contact / FAQ / Reviews
   - 404
   - backend health / readiness

8. **Production SEO verification**
   - sitemap
   - robots
   - canonical/indexability
   - schema
   - internal links
   - local/brand entity consistency
   - dynamic content routes

9. **Services and reboot survival**
   - frontend SSR
   - PHP-FPM
   - queue
   - scheduler
   - Redis/DB dependencies
   - post-reboot public smoke

10. **Backup + isolated restore drill**

11. **Rollback drill**
   - frontend release rollback
   - migration-aware backend rollback/recovery procedure

12. **Monitoring and search readiness**
   - logs / 5xx / queue / disk / backup
   - CWV collection readiness
   - Search Console/sitemap/URL inspection preparation

### Gate پایان Phase19B

فقط وقتی همه موارد بالا با evidence زنده PASS شوند:

```text
PRODUCTION_DEPLOYED=READY
LIVE_RELEASE_ATTESTED=YES
ROLLBACK_VERIFIED=YES
BACKUP_RESTORE_VERIFIED=YES
```

---

# Phase 20 — External Activation

هدف: فعال‌سازی credential/providerهای خارجی بدون feature development جدید.

## مراحل

1. **Google Production OAuth**
   - client-owned credentials
   - exact production redirect URI
   - server-env only secret
   - success / cancel / invalid-state / existing-user / new-user live validation

2. **Zarinpal final live regression**
   - request
   - callback/verify
   - success/failure
   - retry/duplicate/idempotency
   - reconciliation

3. **eNAMAD official badge**
   - فقط markup/provider رسمی
   - rendering امن

4. **Kavenegar/SMS — در صورت تحویل credentials**
   - OTP send/resend/expiry/rate-limit
   - order notifications
   - secret leak audit

5. **Secret audit**
   - server env only
   - no Git/build/public API leakage

6. **Provider evidence**
   - timestamp
   - sanitized provider identifier/evidence
   - feature flag/deactivation procedure

### Gate پایان Phase20

Providerهای دارای credential واقعی باید live-regression شوند. Provider تحویل‌نشده safely disabled می‌ماند و به‌عنوان external dependency ثبت می‌شود؛ نبود credential نباید با credential ساختگی یا bypass پوشانده شود.

---

# F31 — Final Acceptance & Handoff

هدف: آخرین QA، عملیات، SEO measurement، مستندات و freeze تحویل.

## مراحل

1. End-to-end customer journey — Desktop + Mobile
2. Admin / Filament acceptance
3. Security regression
4. Final SEO acceptance
   - sitemap / robots / canonical / schema / noindex / 404
   - Search Console/content indexation evidence در حد قابل‌دسترسی واقعی
5. Operational acceptance
   - reboot/services/backups/restore/rollback/TLS/log rotation/capacity
6. Final evidence pack
   - Frontend/Backend SHAs
   - production release IDs/paths
   - manifest hashes
   - migrations
   - production URLs
   - service state
   - backup/restore/rollback
   - CI
   - Search Console/provider evidence
7. Documentation / handoff
8. Final freeze/tag
   - final tag
   - `main` clean
   - related open PRs = 0
   - unresolved review threads = 0
   - production matches recorded source
   - unresolved P0/P1 = 0

### Final marker

فقط پس از PASS کامل F31:

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```

---

## ترتیب قطعی ادامه از وضعیت فعلی

```text
Phase19B Live Server Execution
  -> Phase20 External Activation
  -> F31 Final Acceptance & Handoff
```

اصل اجرایی: هیچ deployment جدیدی از branchهای قدیمی Phase28/F29S/F29/F30 انجام نشود. Release بعدی فقط از `main`های نهایی و پس از read-only re-attestation سرور مجاز است.
