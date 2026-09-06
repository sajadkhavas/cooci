# وضعیت مرجع پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۷**  
Project: **WINIMI / COOCI**  
Frontend: `sajadkhavas/cooci`  
Backend: `sajadkhavas/winimi-bakery-backend`  
نقش این فایل: **مرجع شماره ۱ برای ادامه کار در هر چت جدید**

> در چت جدید ابتدا این فایل، سپس `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`، `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md` و `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md` خوانده شوند. قبل از هر mutation در Phase19B وضعیت واقعی GitHub و خود سرور باید read-only دوباره تأیید شود؛ checkpointهای قدیمی Production مبنای mutation نیستند.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
PHASE28=COMPLETED_MERGED_REGISTERED
F29S=PASS_MERGED_REGISTERED_CLOSED
F29=PASS_MERGED_REGISTERED_CLOSED
F30=PASS_MERGED_REGISTERED_CLOSED
CURRENT_PHASE=PHASE19B_LIVE_SERVER_EXECUTION
FINAL_DELIVERY=NOT_COMPLETE
PRODUCTION_MUTATION_IN_F30=NO
DEPLOY_PERFORMED_IN_F30=NO
```

## F30 — Mainline / Git Stack Closure

Status: **PASS / MERGED / REGISTERED / TRACKER CLOSED**

Closure record: `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`  
Tracker: `cooci#50` — CLOSED / COMPLETED

### Frontend final evidence

- Exact F30 source HEAD: `d17054b783eabff96db8bd3100402f50d15e2b55`
- PR `#51`: MERGED
- Merge SHA into `main`: `19e5502549907c75c7800337716e71da469de050`
- Frontend CI: run `34065298017` — SUCCESS
- Phase 8 Deployment Readiness: run `34065297991` — SUCCESS
- Phase 18 End-to-End Acceptance: run `34065297994` — SUCCESS
- Phase 19 Production Package: run `34065298003` — SUCCESS
- F30 Storefront Frontend Authority: run `34065297971` — SUCCESS
- Review submissions on PR #51: `0`
- Inline review threads on PR #51: `0`

### Backend final evidence

- Exact F30 source HEAD: `e57ee2dcde2c3a67eaeda3d379790021eebcf03b`
- PR `#15`: MERGED
- Backend `main`: `37dcbf83ca225cacec40f034659d1448adaebaba`
- Backend CI: run `34064138819` — SUCCESS
- Phase 18 backend gate: run `34064138836` — SUCCESS
- F30 Storefront Backend Authority: run `34064138868` — SUCCESS
- Phase 19 Production Package: run `34064138827` — SUCCESS
- Pint: PASS
- Composer security audit: PASS

### Legacy stack resolution

- PR `#36`: CLOSED / NOT MERGED / SUPERSEDED
- PR #36 head: `9a062efa972625d3a90f52dc86b089054d43e9f8`
- F30 exact source نسبت به آن: `ahead_by=123`, `behind_by=0`
- merge-base برابر PR #36 head بود؛ بنابراین کد Phase27 داخل stack نهایی حفظ شده و merge تکراری لازم نبود.

### Backend Authority locked by F30

1. محتوای business/editorial/SEO قابل‌ویرایش Backend/Filament authoritative است.
2. Navigation/Footer/brand/contact/social/trust/public-shell content از API/Store Settings مصرف می‌شود.
3. Organization/WebSite JSON-LD و Contact/Locations/City از یک NAP source مشترک Backend-authoritative استفاده می‌کنند.
4. Frontend فقط layout، responsive behavior، accessibility mechanics و transient system microcopy را code-controlled نگه می‌دارد.
5. regression gates این قرارداد را در CI قفل کرده‌اند.

## F29 — Google Login & Auth Closure

- Status: **PASS / MERGED / REGISTERED / CLOSED**
- Tracker: `cooci#48`
- Closure record: `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
- Google identity key = provider `sub`, نه email.
- auto-link صرفاً با email/phone ممنوع است.
- OAuth state validation اجباری است.
- Google credentials فقط server-env هستند.
- کاربر جدید Google شماره موبایل ایران را تکمیل می‌کند؛ verification تا OTP واقعی NULL می‌ماند.
- OTP infrastructure حفظ شده و `OTP_ENABLED` به‌صورت پیش‌فرض fail-closed/off است.
- Production Google credential activation در Phase20 انجام می‌شود.

## F29S — SEO Content Strategy & Topical Authority

- Status: **DONE / MERGED / REGISTERED / TRACKER CLOSED**
- Tracker: `cooci#38` — CLOSED / COMPLETED
- Frontend integration head before F29: `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend F29S integration head before F29: `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Production deployment: **NO**

## Git stack فعلی

- Frontend final F30 source به `main` Merge شده است.
- Backend final F30 source به `main` Merge شده است.
- PR #36 بسته و superseded است.
- Tracker #50 بسته و completed است.
- مرحله integration/mainline دیگر blocker پروژه نیست.
- Release بعدی باید از `main`های نهایی بالا و پس از read-only server attestation ساخته شود.

## Production — historical checkpoint only

Frontend historical release:

- `/var/www/winimi/frontend/releases/bab4c34db478713465d1`
- Historical source SHA: `d9e44edc13c24427c2f4741b19ac4db98f257160`

Backend historical release:

- `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
- Historical source SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`

این‌ها فقط checkpoint تاریخی‌اند. قبل از هر mutation در Phase19B باید `current`, process CWD, systemd state, health/ready, source SHA، DB/media persistence، backup state و rollback target از خود سرور read-only دوباره تأیید شوند.

## FINAL DELIVERY ROADMAP

فازهای اجرایی باقی‌مانده دقیقاً:

```text
Phase19B -> Phase20 -> F31
```

### Phase19B — Live Server Execution

- read-only production/server preflight
- backup و restore evidence
- immutable Backend/Frontend releases از `main`های نهایی
- migration/readiness/service restart کنترل‌شده
- SSR/public smoke/SEO acceptance
- reboot survival
- rollback drill
- ثبت exact deployed SHAs و evidence

### Phase20 — External Activation

- Google production OAuth credentials و live validation
- Zarinpal live regression/activation evidence
- eNAMAD official badge
- Kavenegar/SMS در صورت ارائه credentials
- secret/provider audit

هر provider بدون credential واقعی safely disabled می‌ماند و به‌عنوان external dependency ثبت می‌شود.

### F31 — Final Acceptance & Handoff

- desktop/mobile customer journey
- Filament admin acceptance
- security regression
- final SEO/Search Console evidence
- operational evidence pack
- final tag/handoff
- unresolved P0/P1 = 0

## CURRENT_NEXT_ACTION

```text
NEXT=PHASE19B_LIVE_SERVER_EXECUTION
FIRST_ACTION=READ_ONLY_SERVER_RE_ATTESTATION
PRODUCTION_MUTATION_ALLOWED_BEFORE_ATTESTATION=NO
```

Phase19B نباید از checkpoint تاریخی سرور یا release قدیمی شروع به mutation کند. ابتدا وضعیت live server read-only استخراج و با `main`های نهایی F30 تطبیق داده شود.

## فایل‌های مرجع چت بعدی

1. `WINIMI_PROJECT_STATUS_FA.md`
2. `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`
3. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`
4. `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md`
5. `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
6. `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`
7. `docs/WINIMI_LIVING_HANDOFF_FA.md`

## Final delivery marker

فقط بعد از F31 مجاز است:

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
