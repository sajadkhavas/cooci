# سند مرجع زنده پروژه WINIMI

به‌روزرسانی: 2026-09-11 — Admin Audit 32 Production closure

## وضعیت فعلی

```text
PROJECT=WINIMI_COOCI
F31=COMPLETED
F31_PRODUCTION_DELIVERY=PASS
F31_HANDOFF=COMPLETE

ADMIN_AUDIT32_CODE_SCOPE=32_OF_32_RECONCILED
ADMIN_AUDIT32_GITHUB_MERGE=PASS
ADMIN_AUDIT32_POST_MERGE_CI=PASS
ADMIN_AUDIT32_PRODUCTION_SYNC=PASS
ADMIN_AUDIT32_MEDIA_REGEN=PASS
ADMIN_AUDIT32_FINAL_QA=PASS
ADMIN_AUDIT32=CLOSED

UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
```

## Source Lock نهایی Runtime

این دو SHA source کد Runtime پذیرفته‌شده‌ای هستند که packageهای Production نهایی Admin Audit32 از آن‌ها ساخته شدند. docs/tooling commitهای بعدی main را نباید به‌جای Runtime source فرض کرد.

```text
FRONTEND_RUNTIME_SOURCE=ca074dbd0664c88a7d618299ba04d8d20d729b07
FRONTEND_MAINTENANCE_PR=58 MERGED
FRONTEND_IMPLEMENTATION_HEAD=506519ced3d68e4c42991c848faf05d376063782
FRONTEND_PRODUCTION_RELEASE=deb601c6c31cb98f1cae

BACKEND_RUNTIME_SOURCE=fc93669455d9bf22fe41260b192d76fb1e65f284
BACKEND_MAINTENANCE_PR=20 MERGED
BACKEND_FINAL_PR_HEAD=e3d46ccec2a037f4226f5db10a07977ca08349a4
BACKEND_PRODUCTION_RELEASE=70044e514b51b463e18b

PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com
```

Tooling استفاده‌شده برای deploy:

```text
BACKEND_DEPLOY_TOOLING=f370b6c5f39b5f8ded16137953af2ed3ce7922a9
FRONTEND_DEPLOY_TOOLING=164098a7b69caf37f4ede7616b7d02ac481d2629
```

قانون: در ادامه پروژه برای تشخیص Runtime واقعی، release فعال + source lock بالا authority هستند؛ «آخرین main» به‌تنهایی authority Runtime نیست.

## Production runtime فعلی — پس از Admin Audit32

```text
BACKEND_RELEASE=70044e514b51b463e18b
FRONTEND_RELEASE=deb601c6c31cb98f1cae

BACKEND_ENV_SHA=edae0af2a804f8901cb683370157ff4997b993b396e856088439164e5c3f2568
FRONTEND_ENV_SHA=97945445a405b492b961ab296ecfb416aaae52cab9ee9a7aefe1bebdb7dc5fcb

ORDERS=6
PAYMENT_ATTEMPTS=6

GOOGLE_AUTH_ENABLED=true
OTP_ENABLED=false
SMS_PROVIDER=disabled
ORDER_SMS_PROVIDER=disabled
CHECKOUT_ENABLED=true
PAYMENT_ENABLED=true
PAYMENT_PROVIDER=zarinpal
ZARINPAL_SANDBOX=false
```

Google Login و پرداخت واقعی زرین‌پال در F31 قبلاً اثبات شده‌اند و در Audit32 دوباره اجرا نشدند.

## GitHub acceptance evidence — Admin Audit32

Backend PR #20:

```text
EXACT_HEAD=e3d46ccec2a037f4226f5db10a07977ca08349a4
MERGE_SHA=fc93669455d9bf22fe41260b192d76fb1e65f284
EXACT_HEAD_BACKEND_CI=34541429972 SUCCESS
EXACT_HEAD_PHASE18=34541429968 SUCCESS
EXACT_HEAD_F30=34541430019 SUCCESS
EXACT_HEAD_PHASE19=34541429944 SUCCESS
POST_MERGE_BACKEND_CI=34541614246 SUCCESS
POST_MERGE_PHASE18=34541614236 SUCCESS
POST_MERGE_PHASE19=34541614252 SUCCESS
```

Frontend PR #58:

```text
EXACT_HEAD=506519ced3d68e4c42991c848faf05d376063782
MERGE_SHA=ca074dbd0664c88a7d618299ba04d8d20d729b07
EXACT_HEAD_FRONTEND_CI=34540720209 SUCCESS
EXACT_HEAD_PHASE8=34540720042 SUCCESS
EXACT_HEAD_PHASE19=34540720081 SUCCESS
EXACT_HEAD_PHASE18=34540720028 SUCCESS
COORDINATED_PHASE18_RERUN_JOB=103085747602 SUCCESS
POST_MERGE_FRONTEND_CI=34542268389 SUCCESS
POST_MERGE_PHASE8=34542268400 SUCCESS
POST_MERGE_PHASE19=34542268410 SUCCESS
POST_MERGE_PHASE18=34542268430 SUCCESS
```

Phase18 coordinated rerun بعد از Backend merge، Backend Runtime source `fc936694...` را از main همان زمان checkout کرد و Laravel migrations/seed، backend adversarial، delivery contract، SSR production build، desktop/mobile browser، SEO 10.3–10.9، PWA، final adversarial و scroll baseline را PASS کرد.

## Migrationهای Production Admin Audit32

سه migration جدید دقیقاً یک‌بار روی Production ثبت شدند:

```text
2026_09_10_221000_add_weight_range_to_bakery_product_variants=1
2026_09_10_223000_add_cover_url_to_bakery_content_pages=1
2026_09_11_001000_add_admin_followup_audit_fields=1
```

این migrationها additive/backward-compatible بودند و شمارش business تغییر نکرد:

```text
ORDERS=6 -> 6
PAYMENT_ATTEMPTS=6 -> 6
ORDER_MUTATION=ZERO
PAYMENT_MUTATION=ZERO
```

## Media Production closure — Audit #4

قبل از regeneration تاریخی:

```text
MEDIA_ASSETS=18
SOURCE_MEDIA=18
CONVERSIONS_READY=15
PREVIEW_BUDGET_OK=15
SOURCE_MISSING=0
OVERSIZED=0
FAILED_JOBS=9
```

فقط derivativeهای `thumb` و `preview` با Spatie و `--force` regenerate شدند. Originalها با SHA-256 قبل/بعد مقایسه شدند.

بعد از regeneration:

```text
MEDIA_ASSETS=18
SOURCE_MEDIA=18
CONVERSIONS_READY=18
PREVIEW_BUDGET_OK=18
SOURCE_MISSING=0
OVERSIZED=0
ORIGINAL_MEDIA_MUTATION=ZERO
FAILED_JOBS=9 -> 9
```

پس Audit #4 در Production بسته است. Regeneration را بدون evidence جدید defect تکرار نکن.

## Delivery runtime — Audit #26

Production در زمان closure هیچ Delivery Zone ساختگی ندارد:

```text
DELIVERY_ZONES=0
ACTIVE_DELIVERY_ZONES=0
FAKE_DELIVERY_ZONE_CREATED=NO
DELIVERY_ZONE_MUTATION=ZERO
```

Runtime contract فعلی:

```text
DELIVERY_ZONE_KEY=EXISTS
DELIVERY_ZONE_VALUE=NULL
DELIVERY_FEE_PAYMENT=PAY_ON_DELIVERY_TO_COURIER
DELIVERY_FEE_INCLUDED_IN_ORDER=FALSE
```

یعنی Zone فعلی authority قیمت/checkout نیست. روش جاری merchant-arranged courier است و هزینه ارسال در مبلغ سفارش قرار نمی‌گیرد و هنگام تحویل به پیک پرداخت می‌شود. اگر مالک کسب‌وکار بعداً Zone واقعی بخواهد، فقط داده واقعی ثبت شود؛ هیچ داده آزمایشی برای پرکردن پنل ساخته نشود.

## Final Admin/API QA

همه surfaceهای read-only زیر در closure نهایی PASS/HTTP 200 داشتند:

```text
/api/system/ready=200
/api/store/settings=200
/api/store/navigation=200
/api/catalog/categories=200
/api/catalog/products=200
/api/store/faqs=200
/api/store/gallery=200
/api/store/posts=200
/api/push/capabilities=200
/api/auth/capabilities=200
/api/delivery/options=200
/admin=200
```

Admin route discovery نیز PASS و `ADMIN_ROUTE_LINES=141` بود.

## Final Storefront/PWA QA

```text
https://winimibakery.com/=200
https://winimibakery.com/products=200
https://winimibakery.com/manifest.webmanifest=200
https://winimibakery.com/sw.js=200
SSR_HEALTH={"status":"ok","surface":"winimi-ssr"}
```

Homepage maintenance و Audit32 frontend روی release `deb601c6c31cb98f1cae` در Production تأیید شدند.

## سرویس‌های Production

در closure نهایی:

```text
nginx.service=active
php8.3-fpm.service=active
winimi-backend-queue.service=active
winimi-backend-scheduler.timer=active
winimi-backend-backup.timer=active
winimi-frontend.service=active
QUEUE_CWD=/var/www/winimi/backend/releases/70044e514b51b463e18b/app
```

Disk نهایی:

```text
FREE_KIB=5464188
AVAILABLE≈5.3GiB
USE=82%
```

## Admin Audit 32 — closure summary

`AUDIT_CODE_SCOPE = 32/32 RECONCILED` و Production sync/QA کامل است.

تمام موارد کدنویسی، UX پنل، permissions، Media authority، Tiptap/sanitization، Navigation allowlist، customer privacy، Store Settings، Push consent/preview، payment/outbox UX و responsive/editor integration بسته شده‌اند.

دو مورد خاص نیز اکنون وضعیت نهایی دارند:

1. **Audit #4 — Historical media derivatives:** Production PASS؛ 18/18 آماده، preview budget PASS، Original mutation صفر.
2. **Audit #26 — Real Delivery Zone:** CLOSED BY BUSINESS POLICY؛ Zone ساختگی ایجاد نشده و runtime فعلی zone را authority نمی‌داند. هر Zone آینده فقط با داده واقعی مالک فروشگاه ثبت می‌شود.

## معماری تحویلی

هر داده محتوایی، تجاری، عمومی یا عملیاتی که مالک فروشگاه باید مدیریت کند از Backend/Filament می‌آید و Frontend از API/SSR مصرف می‌کند. Secrets، payment/auth internals، DB/server configuration، Service Worker logic، validationهای امنیتی و layout/accessibility mechanics code-controlled می‌مانند.

Admin Audit32 این قرارداد را با Media Library مرکزی، managed Tiptap، internal links، sanitizer، safe Callout rendering، owner-facing Store Settings، شش گروه ثابت Navigation، نقش‌های حساس، customer privacy/audit و consent-aware Push تکمیل کرده است.

## Production deployment source-of-truth

Frontend:

- `deploy/README.md`
- `deploy/bin/preflight-frontend-server.sh`
- `deploy/bin/deploy-production-frontend.sh`
- `deploy/bin/smoke-production-surfaces.sh`
- rollback scripts

Backend:

- `deploy/bin/preflight-backend-server.sh`
- `deploy/bin/deploy-production-backend.sh`
- `deploy/bin/smoke-backend-production.sh`
- `deploy/bin/rollback-backend.sh`

### Tooling notes کشف‌شده در sync

- Frontend preflight باید با `bash deploy/bin/preflight-frontend-server.sh` صدا زده شود؛ executable bit را فرض نکن.
- Backend wrapper بعد از `queue:restart` ممکن است در پنجره restart یک `systemctl is-active` لحظه‌ای non-zero بگیرد؛ قبل از rollback کورکورانه release/current، queue CWD و readiness را state-aware بررسی کن.
- برای JSON key که مقدار قانونی `null` دارد، در PHP از `array_key_exists()` استفاده کن؛ `??` بین null و missing تمایز نمی‌گذارد.

## F31 تاریخی — فقط مرجع، نه Runtime فعلی

Releaseهای F31 قبلی دیگر active Production نیستند:

```text
HISTORICAL_F31_FRONTEND_SOURCE=7d5e3fe03b11bc007652908b5f2fff2e78504b31
HISTORICAL_F31_FRONTEND_RELEASE=b0d20cd656e5e5d680c3
HISTORICAL_F31_BACKEND_SOURCE=a2e5c48e8c73c49caaac1f5c9cbb0f608f066e3b
HISTORICAL_F31_BACKEND_RELEASE=49045150d53cd2be5c2b
```

این releaseها نباید در چت بعدی به‌عنوان active runtime گزارش شوند.

## شواهد تاریخی که بدون regression تکرار نمی‌شوند

- Google Login واقعی Production
- authenticated checkout
- پرداخت واقعی و verified زرین‌پال
- Web Push live delivery
- backup/restore/reboot/rollback Phase19B

این maintenance مجوز تکرار این تست‌های واقعی نیست. فقط در صورت evidence مشخص regression دوباره اجرا شوند.

## قوانین ادامه

```text
NEXT=POST_HANDOFF_MAINTENANCE_ONLY
ADMIN_AUDIT32=CLOSED
PRODUCTION_SYNC_REPEAT=NO
MEDIA_REGEN_REPEAT=NO
PAYMENT_RETEST=NO
GOOGLE_LOGIN_RETEST=NO
ORDER_MUTATION=NO
PAYMENT_MUTATION=NO
FAKE_DELIVERY_ZONE=NO
```

اگر درخواست بعدی دربارهٔ تغییر جدید سایت باشد، ابتدا active releaseهای بالا و Source Lock را read-only بررسی کن و فقط همان change جدید را scoped اجرا کن؛ F31 یا Audit32 را از ابتدا باز نکن.
