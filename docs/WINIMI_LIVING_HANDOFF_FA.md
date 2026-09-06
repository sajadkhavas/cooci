# سند مرجع زنده پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۷**  
وضعیت: مرجع ادامه کار بین چت‌ها  
زبان: فارسی / RTL

> شروع سریع در چت جدید: ابتدا `WINIMI_PROJECT_STATUS_FA.md` را بخوان. سپس این فایل، `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`، `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` و `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md` را بررسی کن. GitHub و قبل از هر Production mutation خود سرور را read-only دوباره تأیید کن. هیچ `CURRENT_NEXT_ACTION` تاریخی را بر وضعیت فعلی مقدم ندان.

## 1) خلاصه اجرایی و موقعیت فعلی

```text
PROJECT=WINIMI_COOCI
F29S=PASS_MERGED_REGISTERED_CLOSED
F29=PASS_MERGED_REGISTERED_CLOSED
F30=PASS_MERGED_REGISTERED_CLOSED
CURRENT_PHASE=PHASE19B_LIVE_SERVER_EXECUTION
FINAL_DELIVERY=NOT_COMPLETE
PRODUCTION_MUTATION_IN_F30=NO
DEPLOY_PERFORMED_IN_F30=NO
```

**CURRENT_NEXT_ACTION واقعی:**

```text
NEXT=PHASE19B_LIVE_SERVER_EXECUTION
FIRST_ACTION=READ_ONLY_SERVER_RE_ATTESTATION
PRODUCTION_MUTATION_ALLOWED_BEFORE_ATTESTATION=NO
```

F29S، Google Login/Auth implementation و Mainline Closure تمام شده‌اند. مرحله بعدی دیگر Redesign، SEO content یا Google Login implementation نیست؛ مرحله بعد اجرای release نهایی `main` روی سرور واقعی با preflight فقط‌خواندنی و evidence کامل است.

## 2) هویت فنی

### دامنه و مخزن

- Storefront: `https://winimibakery.com`
- API: `https://api.winimibakery.com`
- Frontend: `sajadkhavas/cooci`
- Backend: `sajadkhavas/winimi-bakery-backend`

### Frontend final F30 source

- Exact F30 source HEAD: `d17054b783eabff96db8bd3100402f50d15e2b55`
- PR #51: **MERGED**
- Merge SHA into `main`: `19e5502549907c75c7800337716e71da469de050`
- F30 closure registration commit: `e1d2f00c3e369994013bcdbad7caeec8d546200d`
- Project status advancement commit: `4968b436a335b9e602b6637b923213b3894c61b7`
- Final-delivery roadmap advancement commit: `70801d71a4e061326cf0dc6d8ad3290cc3699942`

Exact-head release gates on F30 source:

- Frontend CI `34065298017` — SUCCESS
- Phase8 Deployment Readiness `34065297991` — SUCCESS
- Phase18 E2E `34065297994` — SUCCESS
- Phase19 Production Package `34065298003` — SUCCESS
- F30 Storefront Frontend Authority `34065297971` — SUCCESS

### Backend final F30 source

- Exact F30 source HEAD: `e57ee2dcde2c3a67eaeda3d379790021eebcf03b`
- PR #15: **MERGED**
- Backend `main`: `37dcbf83ca225cacec40f034659d1448adaebaba`

Exact-head gates:

- Backend CI `34064138819` — SUCCESS
- Phase18 backend `34064138836` — SUCCESS
- F30 Storefront Backend Authority `34064138868` — SUCCESS
- Phase19 Production Package `34064138827` — SUCCESS
- Pint — PASS
- Composer security audit — PASS

## 3) F30 Mainline Closure

- Tracker `cooci#50`: **CLOSED / COMPLETED**
- Closure record: `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`
- Frontend PR #51 review submissions: `0`
- Frontend PR #51 inline review threads: `0`
- Legacy PR #36: **CLOSED / NOT MERGED / SUPERSEDED**
- PR #36 head: `9a062efa972625d3a90f52dc86b089054d43e9f8`
- F30 source vs PR #36: `ahead_by=123`, `behind_by=0`, merge-base = PR #36 head
- نتیجه: Phase27 داخل stack نهایی حفظ شده و merge تکراری انجام نشده است.

### Backend Authority invariant

هر چیزی در Frontend که محتوایی، تجاری، قابل مدیریت توسط صاحب فروشگاه، قابل روشن/خاموش شدن یا وابسته به داده است باید از Backend/Filament قابل کنترل و از API مصرف شود.

Backend-authoritative examples:

- products/categories/catalog
- hero/banner/marquee/CTA content
- navigation/footer/link groups
- brand/contact/social/trust/store settings
- SEO metadata و public shell content
- blog/guides/FAQ/gallery/locations/reviews/managed pages
- auth/account/orders/payments/delivery state

Frontend code-controlled فقط برای:

- layout/components
- responsive behavior
- animation/design tokens
- accessibility mechanics
- transient technical/validation microcopy

F30 همچنین NAP/JSON-LD را یکپارچه کرد: Organization/WebSite schema و Contact/Locations/City همگی از Store Settings مشترک Backend-authoritative استفاده می‌کنند.

## 4) Auth invariant بعد از F29

- Google Login implementation کامل و ثبت شده است.
- provider identity key = Google `sub`، نه email.
- auto-link صرفاً با email/phone ممنوع است.
- OAuth state validation اجباری است.
- credentials فقط server-env هستند.
- کاربر جدید Google شماره موبایل ایران را تکمیل می‌کند.
- mobile verification تا OTP واقعی NULL می‌ماند.
- OTP infrastructure حذف نشده و `OTP_ENABLED` به‌صورت پیش‌فرض fail-closed/off است.
- Production Google credential activation در Phase20 انجام می‌شود.

## 5) Production — فقط checkpoint تاریخی

آخرین checkpointهای ثبت‌شده قدیمی‌اند و **نباید** به‌عنوان وضعیت زنده فرض شوند.

### Frontend historical checkpoint

- Release: `/var/www/winimi/frontend/releases/bab4c34db478713465d1`
- Historical source SHA: `d9e44edc13c24427c2f4741b19ac4db98f257160`

### Backend historical checkpoint

- Release: `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
- Historical source SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`

قبل از mutation در Phase19B باید از خود سرور دوباره استخراج شود:

- hostname / OS / CPU / RAM / disk / swap
- frontend/backend `current` targets
- source/manifest SHA هر release
- systemd service status و process CWD
- Nginx/PHP-FPM/Node topology
- DB/Redis/storage/media persistence
- queue/scheduler state
- health/readiness/public HTTP
- backup/rollback targets
- provider feature flags بدون چاپ secret

## 6) Release architecture ثبت‌شده

### Frontend

- SSR با React Router Framework Mode + Vite
- immutable releases + atomic `current`
- Node SSR service
- Production contract باید API واقعی را مصرف کند و dev mocks خاموش باشند.

### Backend

- Laravel + PHP-FPM
- Queue + Scheduler
- immutable releases + shared env/storage + atomic `current`
- Production package topology نهایی F30 با مسیر `current/app/public` همگام شده است.

هیچ release تاریخی جای read-only preflight زنده را نمی‌گیرد.

## 7) فازهای باقی‌مانده تا تحویل نهایی

دقیقاً سه فاز:

```text
Phase19B -> Phase20 -> F31
```

### Phase19B — Live Server Execution

- read-only live-server re-attestation
- backup + checksum + restore evidence
- Backend immutable release از `main`
- Frontend deterministic SSR release از `main`
- candidate acceptance
- atomic activation
- public smoke
- Production SEO verification
- queue/scheduler/service + reboot survival
- rollback drill
- monitoring/search readiness

Gate:

```text
PRODUCTION_DEPLOYED=READY
LIVE_RELEASE_ATTESTED=YES
ROLLBACK_VERIFIED=YES
BACKUP_RESTORE_VERIFIED=YES
```

### Phase20 — External Activation

- Google production OAuth credentials/live validation
- Zarinpal final live regression
- eNAMAD official badge
- Kavenegar/SMS فقط در صورت تحویل credential واقعی
- secret/provider audit

Provider بدون credential واقعی safely disabled می‌ماند؛ هیچ credential یا evidence ساختگی مجاز نیست.

### F31 — Final Acceptance & Handoff

- Desktop/Mobile customer journey
- Filament admin acceptance
- security regression
- final SEO/Search Console evidence
- operational acceptance
- evidence pack
- docs/handoff
- final tag
- related open PRs = 0
- unresolved threads = 0
- unresolved P0/P1 = 0
- Production SHA match

## 8) مرجع ادامه چت بعدی

به‌ترتیب بخوان:

1. `WINIMI_PROJECT_STATUS_FA.md`
2. `docs/F30_MAINLINE_GIT_STACK_CLOSURE_FA.md`
3. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`
4. `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md`
5. `docs/F29_GOOGLE_LOGIN_AUTH_CLOSURE_FA.md`
6. `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`
7. همین فایل

و سپس GitHub/Server را read-only با این اسناد reconcile کن.

## 9) Final delivery marker

فقط پس از F31:

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
