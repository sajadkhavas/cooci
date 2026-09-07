# نقشه نهایی تحویل پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۷**  
Project: **WINIMI / COOCI**  
Frontend Repository: `sajadkhavas/cooci`  
Backend Repository: `sajadkhavas/winimi-bakery-backend`

> این سند مرجع رسمی مراحل باقی‌مانده تا تحویل نهایی است. قبل از هر Production mutation، وضعیت live server باید read-only دوباره تأیید شود.

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
- Backend `main` after F30: `37dcbf83ca225cacec40f034659d1448adaebaba`
- Legacy Frontend PR `#36`: CLOSED / SUPERSEDED / NOT MERGED
- Closure: `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`

### Phase 19B — Live Server Execution

- Status: **COMPLETED / PRODUCTION READY / LIVE ATTESTED / RESTORE VERIFIED / ROLLBACK VERIFIED**
- Backend final GitHub `main`: `54a33874c4f54e8a5976804a6cea5ea5d2d371f7`
- Backend backup hardening PR: `winimi-bakery-backend#16` — MERGED
- Backend production release: `6a23406ae222f2a71570`
- Frontend source: `557f78e03ea035f68ba9afeca8ae3cd048e408f4`
- Frontend production release: `76769f1b448bff0eb103`
- Reboot survival: PASS
- Backup restore: PASS — DB + `201` persistent media files
- Backend rollback: PASS
- Frontend rollback: PASS
- Business data preserved: PASS
- Production smoke: PASS
- Closure: `docs/PHASE19B_LIVE_SERVER_EXECUTION_CLOSURE_FA.md`

Phase19B final gate:

```text
PRODUCTION_DEPLOYED=READY
LIVE_RELEASE_ATTESTED=YES
ROLLBACK_VERIFIED=YES
BACKUP_RESTORE_VERIFIED=YES
```

# باقی‌مانده تا تحویل نهایی

**دقیقاً دو فاز اجرایی باقی مانده است:**

1. **Phase 20 — External Activation**
2. **F31 — Final Acceptance & Handoff**

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
Phase20 External Activation
  -> F31 Final Acceptance & Handoff
```

اصل اجرایی: Phase19B بسته شده و نباید بدون regression ناشی از تغییر Production دوباره باز شود. هیچ deployment جدیدی از branchهای قدیمی Phase28/F29S/F29/F30 انجام نشود. Providerهای خارجی فقط با credential واقعی مالک سرویس فعال شوند.
