# وضعیت مرجع پروژه وینیمی

تاریخ ثبت: ۲۰۲۶-۰۸-۲۹ UTC  
هدف: مرجع سریع وضعیت Production، GitHub و کارهای باقی‌مانده

## Baseline قطعی Production

| بخش | مخزن / Branch | SHA فعال | Release فعال |
|---|---|---|---|
| Frontend | `sajadkhavas/cooci` / `phase-27/cross-project-design-synthesis` | `d9e44edc13c24427c2f4741b19ac4db98f257160` | `bab4c34db478713465d1` |
| Backend | `sajadkhavas/winimi-bakery-backend` / `phase-25/f5-zarinpal-production` | `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b` | `eb002a6d5f093e7780d3` |

ممیزی زنده سرور تأیید کرد که Processهای Frontend، Queue و Scheduler از همین Releaseها اجرا می‌شوند و Storefront، Health و Ready همگی HTTP 200 هستند. هر دو SHA در GitHub موجودند و Source delta معتبرِ ثبت‌نشده‌ای روی Production یافت نشد.

## انجام‌شده

- SSR، اتصال API واقعی، Immutable Release، Atomic activation و Rollback
- رسانه Shared و تحویل مستقیم `/storage/` از Nginx
- Backend Laravel/Filament، Catalog، Customer، Address، Order و Inventory
- پرداخت واقعی زرین‌پال و Release Production آن
- صفحه اصلی نهایی Phase 27 و Acceptance فنی آن
- PWA، Security headers، Route smoke tests و health endpoints

## تصمیم‌های قطعی ادامه کار

1. Redesign و SEO تمام صفحات هم‌زمان و صفحه‌به‌صفحه انجام می‌شوند.
2. برای هر صفحه: Intent/Keyword map، UI، Copy/Heading، SSR، Metadata، Internal links، Schema، Performance و QA با هم بسته می‌شوند.
3. پرداخت دوباره ساخته نمی‌شود؛ فقط Regression نهایی انجام می‌شود.
4. OTP حذف نمی‌شود؛ تا تکمیل کاوه‌نگار کارفرما با Feature Flag در UI و Backend غیرفعال می‌ماند.
5. تحویل موقت Auth با Google Login است.
6. کاربر جدید Google باید شماره موبایل وارد کند؛ شماره تا OTP موفق تأییدنشده و `phone_verified_at` خالی است.
7. OAuth/Kavenegar secrets، دیتابیس، Uploadها، Runtime storage و Build artifacts وارد Git نمی‌شوند.

## ترتیب باقی‌مانده تا تحویل

1. Route inventory و Acceptance matrix نهایی
2. Redesign + SEO صفحه‌به‌صفحه
3. Google Login و تکمیل اجباری شماره موبایل
4. Feature Flag امن OTP در Frontend و Backend
5. تکمیل محتوای واقعی و اطلاعات حقوقی/فروشگاه
6. Regression کامل Auth، Cart، Checkout، Order و Zarinpal
7. Accessibility، Visual QA، Core Web Vitals و Security audit
8. Candidate build، Atomic activation و Production smoke test
9. تحویل دسترسی‌ها، آموزش، مستندات و صورت‌جلسه تحویل

## قاعده ادامه در چت جدید

ابتدا این فایل و `docs/WINIMI_LIVING_HANDOFF_FA.md` کامل خوانده شوند؛ سپس SHAهای Remote و Production به‌صورت Read-only دوباره قفل شوند. هیچ کار جدیدی از `main` یا Baseline قدیمی شروع نشود.
