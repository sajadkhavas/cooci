# WINIMI — ثبت نهایی Maintenance تاریخ 2026-09-12

این سند ادامه‌ی `docs/WINIMI_LIVING_HANDOFF_FA.md` و رکورد دقیق maintenance پس از F31/Admin Audit32 است. هدف آن این است که چت بعدی بدون بازکردن دوباره فازهای بسته، دقیقاً از Runtime واقعی و GitHub نهایی ادامه بدهد.

## وضعیت نهایی این بسته

```text
DATE=2026-09-12
PACKAGE=GA4_LOGO_CSP_PRODUCTION_RECONCILIATION
STATUS=CLOSED
FRONTEND_GITHUB=MERGED
FRONTEND_POST_MERGE_CI=PASS
FRONTEND_PRODUCTION=PASS
BACKEND_COMPAT_GITHUB=MERGED
DATABASE_MUTATION=NO
BACKEND_MUTATION_DURING_FINAL_FRONTEND_DEPLOY=NO
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

## Source Lock و Production Runtime نهایی

Frontend GitHub نهایی:

```text
REPOSITORY=sajadkhavas/cooci
PR=65
PR_TITLE=Sync production GA4, logo cache-busting and CSP hardening
PR_HEAD=3f578a16dc400c4d855970b10a1bb72e1e8920d5
PR_MERGE_SHA=44e6b4318cf67883fef49063624c26c41ebbdbd2
MAIN_ACCEPTED_RUNTIME_SOURCE=44e6b4318cf67883fef49063624c26c41ebbdbd2
```

Production Frontend نهایی که از همین merge SHA ساخته و verify شد:

```text
HOST=hwsrv-1332134.hostwindsdns.com
FRONTEND_RELEASE=33ddd21b10b4e66c62a5
FRONTEND_CURRENT=/var/www/winimi/frontend/releases/33ddd21b10b4e66c62a5
SSR_HEALTH=PASS
PUBLIC_HTTP=200
API_HTTP=200
```

Release قبلی که قبل از activation نهایی active بود و برای rollback حفظ شد:

```text
PREVIOUS_FRONTEND_RELEASE=7c0edba3df0cea76714b
```

قانون مهم: commitهای docs-only بعد از این سند ممکن است `main` را جلوتر ببرند. برای Runtime این بسته، authority همان `44e6b431...` + release `33ddd21...` است؛ latest `main` بعدی را بدون deploy جدید Runtime فرض نکن.

## GitHub CI نهایی Frontend روی merge SHA

تمام workflowهای push روی `44e6b4318cf67883fef49063624c26c41ebbdbd2` سبز شدند:

```text
FRONTEND_CI_RUN=34688351046 SUCCESS
PHASE18_E2E_RUN=34688351058 SUCCESS
PHASE19_PRODUCTION_PACKAGE_RUN=34688351071 SUCCESS
PHASE8_DEPLOYMENT_READINESS_RUN=34688351072 SUCCESS
```

Phase18 نهایی شامل build Production، SSR، Laravel-backed browser acceptance، SEO 10.3–10.9، PWA، adversarial acceptance و runtime scroll baseline بود و `SUCCESS` بسته شد.

## Backend compatibility sync — 2026-09-12

Backend برای compatibility تنظیمات عمومی storefront یک hotfix محدود داشت که قبل از بسته‌شدن Frontend ثبت و Merge شد:

```text
REPOSITORY=sajadkhavas/winimi-bakery-backend
PR=30
PR_TITLE=Sync storefront settings dotted-key compatibility
PR_HEAD=c478956cb573763bde44889c3126d2abc43ac010
PR_MERGE_SHA=b83af12e227ac9cb08b30fc78f01ec4798afbcc3
BACKEND_RUNTIME_CODE_MAIN_AT_CLOSURE=b83af12e227ac9cb08b30fc78f01ec4798afbcc3
PHASE18_BACKEND_RUN=34665867392 SUCCESS
```

Backend `main` می‌تواند بعد از این closure فقط به‌خاطر docs-only commitها جلوتر برود؛ این به معنی deploy شدن Backend code جدید نیست. Runtime واقعی Backend تا deploy جدید باید با active release سرور read-only تأیید شود.

قرارداد compatibility:

- ساختار nested تولیدشده با `Arr::set` حفظ می‌شود.
- همان settingهای عمومی با literal dotted key نیز برای storefront در دسترس‌اند.
- کلیدهای مهم: `consent.analytics_enabled`، `integrations.google_tag_mode` و `integrations.google_tag_id`.
- هیچ migration/seed یا mutation تجاری در این hotfix وجود نداشت.

در Final Frontend Deploy هیچ Backend deploy یا DB mutation انجام نشد.

## GA4 — وضعیت نهایی

Measurement ID رسمی این پروژه:

```text
GA_ID=G-96JJNX40BV
```

قرارداد نهایی Frontend:

```text
GOOGLE_TAG_LOCATION=ROOT_HEAD
GOOGLE_TAG_COUNT=1
GA_CONFIG_COUNT=1
GA_CONSENT_COMMAND_COUNT=0
CUSTOM_ANALYTICS_CONSENT_COMPONENT_MOUNTED=NO
CUSTOMER_PRIVACY_POPUP=REMOVED
CUSTOMER_CLICK_REQUIRED=NO
```

`src/root.tsx` فقط Google tag استاندارد را در `<head>` دارد:

- `gtag.js?id=G-96JJNX40BV`
- `gtag('js', new Date())`
- `gtag('config', 'G-96JJNX40BV')`

`AnalyticsConsent` دیگر در Root mount نمی‌شود و `gtag('consent', ...)` در Runtime نهایی وجود ندارد.

### دلیل حذف کامل Consent UI سفارشی

پیاده‌سازی قبلی consent انتخاب ذخیره‌شده را از `localStorage` در initializer state می‌خواند. SSR همیشه بدون دسترسی به `window` مقدار اولیه متفاوتی داشت و این اختلاف می‌توانست به hydration mismatch / banner stale یا غیرقابل‌کلیک منجر شود. از `suppressHydrationWarning` برای پنهان‌کردن مشکل استفاده نشد؛ UI سفارشی طبق تصمیم نهایی از Root حذف شد.

نکته حقوقی: این تصمیم فنی به‌خودی‌خود ادعای انطباق حقوقی جهانی ایجاد نمی‌کند؛ اگر jurisdiction خاص consent اجباری داشته باشد باید جداگانه بررسی شود.

### GA4 acceptance ثبت‌شده

قبل از closure:

```text
TAG_ASSISTANT_CONNECTED=YES
GOOGLE_TAG_FOUND=YES
SOURCE=ON_PAGE_GTAG_CONFIG
PAGE_VIEW=OBSERVED
USER_ENGAGEMENT=OBSERVED
GA4_REALTIME_ACTIVE_USERS=OBSERVED
```

در Runtime نهایی semantic acceptance نیز این موارد PASS شدند:

```text
LIVE_GA_TAG_COUNT=1
LIVE_GA_CONFIG_COUNT=1
LIVE_GA_CONSENT_COUNT=0
```

## CSP — وضعیت نهایی

CSP همچنان nonce-based است و برای حل GA4 broad weakening انجام نشد.

نکات بسته‌شده:

- `https://www.googletagmanager.com` مجاز است.
- Google Analytics endpoints مجازند.
- Phase18 یک request واقعی GA4 به `https://www.google.com/g/collect` مشاهده کرد که قبلاً blocked بود؛ source نهایی فقط endpoint لازم `https://www.google.com` را در قرارداد CSP اضافه کرد.
- inline scriptهای Runtime همچنان nonce دارند؛ `unsafe-eval` یا بازکردن گسترده CSP اضافه نشد.

Final acceptance:

```text
CSP_NONCE=PASS
CSP_GTM=PASS
CSP_GOOGLE_ANALYTICS=PASS
CSP_GOOGLE_COLLECT=PASS
```

## Logo incident — Root Cause و Fix نهایی

مشکل لوگوی Header/Footer missing asset یا CSP نبود. Root cause قطعی روی release قبلی این بود:

```text
FILE=/var/www/winimi/frontend/releases/929389fe01b5ba755acb/app/build/client/brand/winimi-logo.svg
OWNER=root:root
MODE=640
PUBLIC_LOGO_HTTP=500
SSR_ERROR=EACCES_PERMISSION_DENIED
```

یعنی SSR process نمی‌توانست فایل static لوگو را بخواند.

Fix ریشه‌ای در `scripts/create-frontend-release.mjs` ثبت شد:

```text
RELEASE_DIRECTORIES=0755
RELEASE_FILES=0644
```

Release builder بعد از copy کردن build، permission تمام directoryها را `0755` و fileها را `0644` نرمال می‌کند. این fix داخل PR #65 و Runtime source نهایی است.

برای حذف اثر cache قدیمی 500، URL لوگو نیز versioned شد:

```text
/brand/winimi-logo.svg?v=20260912-r1
```

سه reference canonical در source با همین version هماهنگ شدند و brand audit نیز query-string cache bust را بدون ضعیف‌کردن path assertion پذیرفت.

Final Logo acceptance:

```text
LOGO_HTTP=200
LOGO_MODE=644
LOGO_EACCES=0
VERSIONED_LOGO=PASS
BARE_LOGO_REFERENCE=0
```

## False negatives / tooling incidents که نباید دوباره باعث Deploy اضافی شوند

### 1. Canary قدیمی روی 4174

یک process قدیمی روی `127.0.0.1:4174` از release قبلی زنده مانده بود و باعث شد اولین Canary ظاهراً Popup/consent قدیمی و logo بدون version را نشان دهد. PID/CWD بعداً قفل شد و process stale پاک شد:

```text
STALE_CANARY_PORT=4174
STALE_CANARY_CLEANUP=PASS
PUBLIC_HTTP_AFTER_CLEANUP=200
API_HTTP_AFTER_CLEANUP=200
```

از این به بعد Canary باید PID/CWD دقیق release candidate را verify کند یا از fresh port آزاد استفاده کند.

### 2. grep روی متن خام HTML

یک Gate اولیه عبارت «تنظیمات حریم خصوصی» را در کل HTML grep می‌کرد. این متن می‌تواند داخل SSR/Hydration payload تنظیمات Backend serialize شود حتی وقتی هیچ dialog در DOM render نشده است. بنابراین این Gate false positive بود.

معیار صحیحی که استفاده شد semantic DOM parse بود:

```text
DOM_PRIVACY_DIALOG_COUNT=0
GA_CONSENT_COMMAND_COUNT=0
```

در آینده وجود متن در payload را با وجود UI render‌شده یکی فرض نکن.

### 3. restart window روی پورت 4173

در activation نهایی یک `curl: (7)` لحظه‌ای هنگام restart دیده شد، سپس retry داخلی deploy script health را PASS کرد و wrapper گزارش داد:

```text
Production frontend deployment is active and healthy.
```

این یک restart window بود، نه failure نهایی.

### 4. Build warnings

موارد زیر warning بودند و Build را fail نکردند:

- Browserslist/caniuse-lite stale warning
- React Router v8 future-flag warnings
- Vite/Rollup `use client` directive warnings در dependencies

Build، postbuild performance budget و release verification همگی PASS شدند؛ این warningها به‌تنهایی دلیل rollback یا rebuild نیستند.

## Final Production semantic acceptance

Release `33ddd21b10b4e66c62a5` قبل از activation و بعد از activation تست شد:

```text
SEMANTIC_CONSENT_DIALOG=ABSENT
GA_TAG_COUNT=1
GA_CONFIG_COUNT=1
GA_CONSENT_COMMAND=0
VERSIONED_LOGO=PASS
CSP_GOOGLE_COLLECT=PASS
PUBLIC_HTTP=200
LOGO_HTTP=200
API_HTTP=200
SSR_HEALTH=PASS
DATABASE_MUTATION=NO
BACKEND_MUTATION=NO
```

این بسته دیگر نیاز به Deploy تکراری ندارد مگر evidence جدید regression دیده شود.

## Search Console / SEO context حفظ‌شده

وضعیت ثبت‌شده قبلی:

```text
SEARCH_CONSOLE_PROPERTY=winimibakery.com
SITEMAP=https://winimibakery.com/sitemap.xml
SITEMAP_STATUS=SUCCESS
DISCOVERED_PAGES=29
```

`DISCOVERED_PAGES` به معنی indexed بودن تمام 29 URL نیست؛ فقط discovery در Sitemap/Search Console را نشان می‌دهد.

## رابطه با F31 و Admin Audit32

- F31 تاریخی بسته است و از ابتدا باز نمی‌شود.
- Admin Audit32 با 32/32 مورد بسته است و از ابتدا باز نمی‌شود.
- Media regeneration تاریخی 18/18 بسته است و بدون defect جدید تکرار نمی‌شود.
- Google Login واقعی، checkout واقعی، پرداخت Zarinpal verified، Web Push و backup/restore evidenceهای retained هستند و بدون regression تکرار نمی‌شوند.
- این سند فقط maintenance بعد از آن closureها را ثبت می‌کند.

مراجع تاریخی:

- `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md`
- `docs/WINIMI_LIVING_HANDOFF_FA.md`
- Backend: `docs/ADMIN_AUDIT32_CONTINUATION_FA.md`
- Backend: `docs/POST_AUDIT32_2026-09-12_GA4_SETTINGS_COMPAT_FA.md`

## قانون ادامه برای چت بعدی

```text
AUTHORITATIVE_FRONTEND_RUNTIME_SOURCE=44e6b4318cf67883fef49063624c26c41ebbdbd2
AUTHORITATIVE_FRONTEND_RELEASE=33ddd21b10b4e66c62a5
BACKEND_RUNTIME_CODE_MAIN_AT_CLOSURE=b83af12e227ac9cb08b30fc78f01ec4798afbcc3
GA_ID=G-96JJNX40BV
GA_MODE=ROOT_ONLY
CUSTOM_CONSENT_UI=REMOVED
LOGO_PERMISSION_FIX=PERMANENT_IN_RELEASE_BUILDER
CSP_GOOGLE_COLLECT=PASS
ADMIN_AUDIT32=CLOSED
F31=CLOSED
PRODUCTION_SYNC_REPEAT=NO
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

در چت بعدی ابتدا این سند و `WINIMI_LIVING_HANDOFF_FA.md` خوانده شود. قبل از هر mutation جدید، active release فعلی read-only بررسی شود. اگر همان `33ddd21b10b4e66c62a5` فعال است، این بسته GA4/Logo/CSP را دوباره اجرا نکن؛ فقط change جدید را scoped ادامه بده.
