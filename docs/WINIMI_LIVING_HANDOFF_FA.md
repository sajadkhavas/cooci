# سند مرجع زنده پروژه WINIMI

به‌روزرسانی: 2026-09-12 — GA4 / Logo / CSP / GitHub ↔ Production closure

این فایل **مرجع اول چت‌های بعدی** است. برای جزئیات کامل maintenance امروز نیز این فایل باید خوانده شود:

- `docs/WINIMI_POST_HANDOFF_2026-09-12_GA4_LOGO_CSP_CLOSURE_FA.md`

مراجع تاریخی که همچنان معتبرند:

- `docs/F31_FINAL_ACCEPTANCE_HANDOFF_WORKLOG_FA.md`
- Backend: `docs/ADMIN_AUDIT32_CONTINUATION_FA.md`

## وضعیت فعلی

```text
PROJECT=WINIMI_COOCI
F31=CLOSED
F31_PRODUCTION_DELIVERY=PASS
F31_HANDOFF=COMPLETE

ADMIN_AUDIT32_CODE_SCOPE=32_OF_32_RECONCILED
ADMIN_AUDIT32=CLOSED
ADMIN_AUDIT32_PRODUCTION_SYNC=PASS
ADMIN_AUDIT32_MEDIA_REGEN=PASS
ADMIN_AUDIT32_FINAL_QA=PASS

POST_HANDOFF_2026_09_12_GA4_LOGO_CSP=CLOSED
FRONTEND_GITHUB_MERGE=PASS
FRONTEND_POST_MERGE_CI=PASS
FRONTEND_PRODUCTION=PASS
BACKEND_COMPAT_GITHUB_MERGE=PASS

UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

## Runtime authority فعلی

### Frontend

```text
REPOSITORY=sajadkhavas/cooci
FINAL_RUNTIME_PR=65 MERGED
FINAL_PR_HEAD=3f578a16dc400c4d855970b10a1bb72e1e8920d5
AUTHORITATIVE_RUNTIME_SOURCE=44e6b4318cf67883fef49063624c26c41ebbdbd2
AUTHORITATIVE_PRODUCTION_RELEASE=33ddd21b10b4e66c62a5
ACTIVE_PATH=/var/www/winimi/frontend/releases/33ddd21b10b4e66c62a5
PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com
PUBLIC_HTTP=200
SSR_HEALTH=PASS
```

Release قبلی Rollback:

```text
PREVIOUS_FRONTEND_RELEASE=7c0edba3df0cea76714b
```

**قانون مهم:** commitهای docs-only بعد از Runtime source بالا، `main` را جلوتر می‌برند. پس latest `main` را بدون deploy جدید Runtime فعال فرض نکن. برای Runtime این closure، source `44e6b431...` + release `33ddd21...` authority هستند.

### Backend

آخرین sync کدی مرتبط امروز:

```text
REPOSITORY=sajadkhavas/winimi-bakery-backend
COMPAT_PR=30 MERGED
COMPAT_PR_HEAD=c478956cb573763bde44889c3126d2abc43ac010
BACKEND_RUNTIME_CODE_MAIN_AT_CLOSURE=b83af12e227ac9cb08b30fc78f01ec4798afbcc3
PHASE18_BACKEND_RUN=34665867392 SUCCESS
```

PR #30 فقط compatibility public settings را ثبت کرد: nested structure حفظ می‌شود و literal dotted keys برای storefront نیز expose می‌شوند. کلیدهای مهم:

- `consent.analytics_enabled`
- `integrations.google_tag_mode`
- `integrations.google_tag_id`

بعد از این closure، Backend `main` نیز می‌تواند به‌علت commitهای docs-only جلوتر از `b83af12...` باشد؛ این به معنی deploy شدن Backend code جدید نیست. Runtime واقعی Backend تا deploy جدید باید با active release سرور read-only تأیید شود.

در Deploy نهایی Frontend هیچ Backend deploy، migration، seed یا DB/business mutation انجام نشد.

Backend handoff تکمیلی امروز:

- `docs/POST_AUDIT32_2026-09-12_GA4_SETTINGS_COMPAT_FA.md`

## GitHub CI نهایی Frontend

روی merge SHA `44e6b4318cf67883fef49063624c26c41ebbdbd2`:

```text
FRONTEND_CI_RUN=34688351046 SUCCESS
PHASE18_E2E_RUN=34688351058 SUCCESS
PHASE19_PRODUCTION_PACKAGE_RUN=34688351071 SUCCESS
PHASE8_DEPLOYMENT_READINESS_RUN=34688351072 SUCCESS
```

PR #65 با عنوان `Sync production GA4, logo cache-busting and CSP hardening` Merge شده است.

## GA4 نهایی

```text
GA_ID=G-96JJNX40BV
GOOGLE_TAG_LOCATION=ROOT_HEAD
GOOGLE_TAG_COUNT=1
GA_CONFIG_COUNT=1
GA_CONSENT_COMMAND_COUNT=0
CUSTOM_ANALYTICS_CONSENT_COMPONENT_MOUNTED=NO
CUSTOMER_PRIVACY_POPUP=REMOVED
CUSTOMER_CLICK_REQUIRED=NO
TAG_ASSISTANT_CONNECTED=YES
GA4_REALTIME_TRAFFIC=OBSERVED
```

`src/root.tsx` فقط Google tag فعال را در `<head>` دارد و `AnalyticsConsent` دیگر در Root mount نمی‌شود.

Consent UI قبلی به‌علت تفاوت SSR/client در خواندن `localStorage` مستعد hydration mismatch / stale banner بود؛ مشکل با `suppressHydrationWarning` پنهان نشد و UI طبق تصمیم نهایی حذف شد.

یادآوری: حذف UI سفارشی یک تصمیم فنی است و به‌تنهایی ادعای compliance حقوقی جهانی نیست؛ jurisdictionهای نیازمند consent باید جدا بررسی شوند.

## CSP نهایی

CSP همچنان nonce-based و محدود است.

```text
CSP_NONCE=PASS
CSP_GTM=PASS
CSP_GOOGLE_ANALYTICS=PASS
CSP_GOOGLE_COLLECT=PASS
```

Phase18 درخواست واقعی GA4 به `https://www.google.com/g/collect` دید؛ source نهایی endpoint لازم `https://www.google.com` را به policy اضافه کرد. broad weakening، `unsafe-eval` یا حذف nonce انجام نشد.

## Logo نهایی

Root cause لوگوی خراب روی release قدیمی permission بود، نه missing asset یا CSP:

```text
OLD_LOGO_OWNER=root:root
OLD_LOGO_MODE=640
OLD_PUBLIC_LOGO_HTTP=500
OLD_SSR_ERROR=EACCES
```

Fix دائمی در Release Builder:

```text
RELEASE_DIRECTORIES=0755
RELEASE_FILES=0644
```

Logo URL برای شکستن cache خطای 500 versioned شد:

```text
/brand/winimi-logo.svg?v=20260912-r1
```

Final acceptance:

```text
LOGO_HTTP=200
LOGO_MODE=644
LOGO_EACCES=0
VERSIONED_LOGO=PASS
```

## Final Production acceptance — 2026-09-12

Release `33ddd21b10b4e66c62a5` از source دقیق `44e6b431...` ساخته، verify و atomically فعال شد.

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

این بسته **بسته است** و بدون evidence جدید regression نباید Deploy یا Rebuild تکراری شود.

## Tooling lessons ثبت‌شده — تکرار نکن

1. Canary قدیمی روی `4174` یک‌بار باعث false-negative شد؛ stale process پاک شد. Canary آینده باید PID/CWD candidate را verify کند یا fresh port داشته باشد.
2. grep عبارت «تنظیمات حریم خصوصی» روی کل SSR HTML معیار معتبر وجود Popup نیست، چون متن ممکن است داخل hydration payload باشد. معیار صحیح semantic DOM است.
3. هنگام systemd restart ممکن است `curl: (7)` لحظه‌ای رخ دهد؛ اگر retry رسمی health PASS شد، آن را failure نهایی تلقی نکن.
4. Browserslist stale، React Router v8 future flags و dependency `use client` messages warning بودند؛ Build/performance/release verify PASS شدند.
5. Frontend preflight را با `bash deploy/bin/preflight-frontend-server.sh` اجرا کن؛ executable bit را فرض نکن.
6. Backend queue بعد از `queue:restart` می‌تواند پنجره‌ی transient داشته باشد؛ قبل از rollback کورکورانه current/readiness/CWD را state-aware بررسی کن.
7. برای JSON key قانونی با value=`null` در PHP از `array_key_exists()` استفاده کن؛ `??` null را با missing یکی می‌کند.

## Admin Audit32 — همچنان CLOSED

Audit32 از ابتدا باز نمی‌شود. نتایج تاریخی معتبر:

```text
AUDIT_CODE_SCOPE=32_OF_32_RECONCILED
MEDIA_ASSETS=18
SOURCE_MEDIA=18
CONVERSIONS_READY=18
PREVIEW_BUDGET_OK=18
ORIGINAL_MEDIA_MUTATION=ZERO
DELIVERY_ZONES=0
FAKE_DELIVERY_ZONE_CREATED=NO
DELIVERY_ZONE_MUTATION=ZERO
```

Delivery policy ثبت‌شده:

```text
DELIVERY_ZONE_KEY=EXISTS
DELIVERY_ZONE_VALUE=NULL
DELIVERY_FEE_PAYMENT=PAY_ON_DELIVERY_TO_COURIER
DELIVERY_FEE_INCLUDED_IN_ORDER=FALSE
```

اگر کسب‌وکار بعداً Zone واقعی بخواهد فقط داده واقعی مالک فروشگاه ثبت شود؛ داده ساختگی Production ایجاد نشود.

جزئیات 32 مورد در Backend:

- `docs/ADMIN_AUDIT32_CONTINUATION_FA.md`

## Retained evidence — بدون regression تکرار نشود

- Google Login واقعی Production
- authenticated checkout
- پرداخت واقعی و verified زرین‌پال
- Web Push live delivery
- backup/restore/reboot/rollback Phase19B
- Media derivative regeneration 18/18

## Search Console / SEO context

```text
SEARCH_CONSOLE_PROPERTY=winimibakery.com
SITEMAP=https://winimibakery.com/sitemap.xml
SITEMAP_STATUS=SUCCESS
DISCOVERED_PAGES=29
```

`29 discovered` مساوی `29 indexed` نیست.

## قوانین ادامه برای چت بعدی

```text
READ_THIS_FILE_FIRST=YES
READ_2026_09_12_CLOSURE_FILE=YES
F31=CLOSED
ADMIN_AUDIT32=CLOSED
GA4_LOGO_CSP_PACKAGE=CLOSED
PRODUCTION_SYNC_REPEAT=NO
MEDIA_REGEN_REPEAT=NO
PAYMENT_RETEST=NO
GOOGLE_LOGIN_RETEST=NO
ORDER_MUTATION=NO
PAYMENT_MUTATION=NO
FAKE_DELIVERY_ZONE=NO
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

در چت بعدی:

- اول این فایل و `docs/WINIMI_POST_HANDOFF_2026-09-12_GA4_LOGO_CSP_CLOSURE_FA.md` را بخوان.
- active release را read-only چک کن.
- اگر Frontend active release همان `33ddd21b10b4e66c62a5` است، GA4/Logo/CSP را دوباره deploy نکن.
- F31 یا Audit32 را از ابتدا باز نکن.
- فقط change جدید کاربر را scoped انجام بده.
