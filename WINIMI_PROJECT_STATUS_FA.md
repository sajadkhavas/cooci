# وضعیت مرجع پروژه WINIMI

آخرین GitHub reconciliation: 2026-09-11

> مرجع شماره ۱ ادامه کار. برای جزئیات Runtime/Production ابتدا همین فایل، سپس `docs/WINIMI_LIVING_HANDOFF_FA.md` خوانده شود. F31 تاریخی بسته است و Admin Audit 32 نیز روی Production deploy و QA شده؛ این دو فاز بدون evidence مشخص regression از ابتدا باز نمی‌شوند.

## CURRENT_STATUS

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
NEXT=ONLINE_LAUNCH_READINESS_THEN_POST_LAUNCH_MAINTENANCE
```

## Runtime source lock نهایی

این SHAها Source کد Runtime پذیرفته‌شدهٔ packageهای Production فعلی هستند. docs/tooling commitهای بعدی `main` را نباید به‌جای Runtime source فرض کرد.

```text
FRONTEND_REPO=sajadkhavas/cooci
FRONTEND_RUNTIME_SOURCE=ca074dbd0664c88a7d618299ba04d8d20d729b07
FRONTEND_MAINTENANCE_PR=58 MERGED
FRONTEND_PRODUCTION_RELEASE=deb601c6c31cb98f1cae

BACKEND_REPO=sajadkhavas/winimi-bakery-backend
BACKEND_RUNTIME_SOURCE=fc93669455d9bf22fe41260b192d76fb1e65f284
BACKEND_MAINTENANCE_PR=20 MERGED
BACKEND_PRODUCTION_RELEASE=70044e514b51b463e18b

PRODUCTION_HOST=hwsrv-1332134.hostwindsdns.com
BACKEND_DEPLOY_TOOLING=f370b6c5f39b5f8ded16137953af2ed3ce7922a9
FRONTEND_DEPLOY_TOOLING=164098a7b69caf37f4ede7616b7d02ac481d2629
```

## Production runtime فعلی

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

Google Login و پرداخت واقعی زرین‌پال قبلاً در Production اثبات شده‌اند و صرفاً برای maintenance/launch readiness تکرار نمی‌شوند.

## Admin Audit 32 closure

`AUDIT_CODE_SCOPE=32/32 RECONCILED` و Production sync/QA بسته است.

### Audit #4 — Historical media derivatives

```text
MEDIA_ASSETS=18
SOURCE_MEDIA=18
CONVERSIONS_READY=18
PREVIEW_BUDGET_OK=18
SOURCE_MISSING=0
OVERSIZED=0
ORIGINAL_MEDIA_MUTATION=ZERO
```

فقط derivativeهای `thumb` و `preview` regenerate شدند؛ Originalها تغییر نکردند. بدون evidence جدید defect این کار تکرار نشود.

### Audit #26 — Delivery Zone

```text
DELIVERY_ZONES=0
ACTIVE_DELIVERY_ZONES=0
FAKE_DELIVERY_ZONE_CREATED=NO
DELIVERY_ZONE_MUTATION=ZERO
DELIVERY_FEE_PAYMENT=PAY_ON_DELIVERY_TO_COURIER
DELIVERY_FEE_INCLUDED_IN_ORDER=FALSE
```

Zone ساختگی ممنوع است. اگر مالک کسب‌وکار بعداً Zone واقعی خواست فقط داده واقعی ثبت شود.

## Production health آخرین closure

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

https://winimibakery.com/=200
https://winimibakery.com/products=200
https://winimibakery.com/manifest.webmanifest=200
https://winimibakery.com/sw.js=200
SSR_HEALTH=PASS
```

Services در closure نهایی active بودند: Nginx، PHP-FPM، Backend Queue، Scheduler، Backup Timer و Frontend SSR service.

## Post-launch QA backlog

مرجع رسمی backlog پس از Online Launch:

- GitHub Issue **#61** — `Post-launch QA backlog — mobile Web Push click-through and deferred fixes`
- URL: `https://github.com/sajadkhavas/cooci/issues/61`

وضعیت مورد تأییدشده فعلی:

```text
PUSH_DELIVERY=PASS
PUSH_NOTIFICATION_RECEIVED_ON_PHONE=PASS
PUSH_CLICKTHROUGH_MOBILE=FAIL_DEFERRED
ONLINE_LAUNCH_BLOCKER=NO
```

اعلان واقعاً روی گوشی تحویل می‌شود، اما لمس «مشاهده / مشاهده پیام» مقصد را باز نمی‌کند. Service Worker دارای `push` و `notificationclick` handler است؛ بنابراین این defect بعد از Online Launch روی click-through runtime موبایل/PWA، action button و destination handling بررسی می‌شود. اصل Push delivery خراب فرض نمی‌شود.

هر defect جدیدی که در تست واقعی کارفرما/موبایل پیدا شود، با evidence به Issue #61 اضافه شود تا بعد از Online Launch یکجا triage و اصلاح شود. مورد حدسی بدون evidence ثبت نشود.

## Retained acceptance — بدون regression تکرار نشود

- real Google Login Production acceptance
- authenticated checkout
- real paid/verified Zarinpal order
- live Web Push delivery acceptance
- Phase19B backup/restore/reboot/rollback evidence

## Online Launch priority

ترتیب رسمی ادامه کار از 2026-09-11:

```text
1=ONLINE_LAUNCH_READINESS
2=GO_LIVE_WITH_GOOGLE_AUTH
3=KEEP_OTP_DISABLED
4=KEEP_KAVENEGAR_DISABLED
5=POST_LAUNCH_QA_BACKLOG_ISSUE_61
```

قوانین:

```text
PRODUCTION_SYNC_REPEAT=NO
MEDIA_REGEN_REPEAT=NO
PAYMENT_RETEST=NO
GOOGLE_LOGIN_RETEST=NO
ORDER_MUTATION=NO
PAYMENT_MUTATION=NO
FAKE_DELIVERY_ZONE=NO
KAVENEGAR_ENABLE=NO_FOR_NOW
OTP_ENABLE=NO_FOR_NOW
```

در Online Launch readiness فقط موارد لازم برای عمومی‌شدن امن سایت، indexability/SEO، storefront availability، checkout readiness، auth capability، PWA/public surfaces، health، backup و تنظیمات owner-facing بررسی شوند. defectهای غیرBlocker مانند Push click-through طبق Issue #61 برای بعد از Launch نگه داشته می‌شوند.
