# وضعیت مرجع پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۵**  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
نقش این فایل: **مرجع شماره ۱ برای ادامه کار در هر چت جدید**

> اگر چت جدید شروع شد، ابتدا همین فایل کامل خوانده شود. سپس `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` و `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md` خوانده شوند. بعد Remote Git و Production به‌صورت read-only دوباره قفل شوند. هیچ مرحله‌ای از روی حافظه، `main` قدیمی یا Production تاریخی شروع نشود.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
CURRENT_PHASE=F29_GOOGLE_LOGIN_AUTH_CLOSURE
PHASE28=COMPLETED_MERGED_REGISTERED
PHASE28_PRODUCTION_DEPLOYMENT=NOT_RECORDED_AS_COMPLETE
FINAL_DELIVERY=NOT_COMPLETE
```

## Phase 28 — بسته‌شده

- Phase: `Phase 28 — SEO Route Architecture`
- Status: **COMPLETED / MERGED / REGISTERED**
- Branch: `phase-28/seo-route-architecture`
- START_SHA: `ca64abb286a54190cba11bcffd61fa61cd7992e4`
- Final exact CI head: `26c5ef080b910b9b6cf7177cae401e7fe48bb180`
- PR: `#37`
- Merge SHA into Phase 27: `76085a078e3068be479461582258a828f32496c6`
- Closure record: `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md`

Exact-head release gates before merge:

- Frontend CI `#1479` — PASS
- Phase 8 Deployment Readiness `#591` — PASS
- Phase 18 End-to-End Acceptance `#459` — PASS
- Phase 19 Production Package `#26` — PASS

Phase 28 به‌تنهایی هنوز با evidence زنده‌ی سرور به‌عنوان deploy نهایی ثبت نشده است.

## Git stack فعلی

- Integration branch: `phase-27/cross-project-design-synthesis`
- PR `#36` هنوز **OPEN / DRAFT** است.
- PR #36 base: `phase-26/uir1-home-navigation-redesign`
- Phase 27 شامل Phase 28 merge‌شده است، اما زنجیره نهایی هنوز به `main` بسته نشده است.
- بنابراین تا F30، `main` منبع نهایی release نیست.

## Production — آخرین وضعیت تاریخی ثبت‌شده

Frontend آخرین baseline تاریخی تأییدشده:

- Release: `/var/www/winimi/frontend/releases/bab4c34db478713465d1`
- Source SHA: `d9e44edc13c24427c2f4741b19ac4db98f257160`
- Service: `winimi-frontend.service`

Backend آخرین baseline تاریخی تأییدشده:

- Release: `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
- Source SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`

این مقادیر فقط checkpoint تاریخی هستند. قبل از هر Production mutation باید `current`, process CWD, service state, health/ready و Git SHA دوباره از خود سرور خوانده شوند.

## تصمیم‌های قطعی Auth

1. تحویل Auth با **Google Login** انجام می‌شود.
2. OTP حذف نمی‌شود.
3. OTP تا آماده‌شدن provider کارفرما با Feature Flag امن غیرفعال می‌ماند.
4. کاربر جدید Google باید شماره موبایل ایران را تکمیل کند.
5. تا OTP واقعی، `phone_verified_at` خالی می‌ماند.
6. Account linking صرفاً با email/phone مشابه خودکار انجام نمی‌شود؛ flow امن لازم است.
7. OAuth/Kavenegar credentials فقط متعلق به کارفرما و خارج از Git هستند.

## FINAL DELIVERY ROADMAP

مرجع کامل زیرمرحله‌ها:

`docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`

پنج فاز اجرایی باقی مانده:

1. **F29 — Google Login & Auth Closure**
2. **F30 — Mainline / Git Stack Closure**
3. **Phase 19B — Live Server Execution**
4. **Phase 20 — External Activation**
5. **F31 — Final Acceptance & Handoff**

ترتیب قطعی:

```text
F29 -> F30 -> Phase19B -> Phase20 -> F31
```

## CURRENT_NEXT_ACTION

**شروع F29 — Google Login & Auth Closure.**

ترتیب F29:

1. Audit قرارداد فعلی Auth در Frontend و Backend.
2. طراحی Google OAuth production-safe.
3. Backend Google identity + secure account linking.
4. OAuth callback + Sanctum session.
5. phone completion برای کاربر جدید.
6. OTP feature flag بدون حذف زیرساخت.
7. Frontend login UX.
8. adversarial/security tests + CI.
9. PR/Merge/Register.

بعد از F29، F30 باید stack باز Phase 26/27/28/Auth را تا `main` ببندد. سپس فقط یک release نهایی تمیز از `main` به Production برده شود، مگر اینکه کاربر صراحتاً interim deployment بخواهد.

## فایل‌هایی که چت بعدی باید بخواند

به این ترتیب:

1. `WINIMI_PROJECT_STATUS_FA.md` ← وضعیت لحظه‌ای و NEXT
2. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` ← تمام فازهای باقی‌مانده و Gateها
3. `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md` ← آخرین فاز بسته‌شده
4. `docs/WINIMI_LIVING_HANDOFF_FA.md` ← تاریخچه فنی/تصمیم‌های پروژه
5. `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md` ← مرجع رسمی Deploy سرور هنگام رسیدن به 19B

## متن آماده برای چت جدید

```text
پروژه WINIMI / COOCI را ادامه بده.
Repository: sajadkhavas/cooci
ابتدا فایل WINIMI_PROJECT_STATUS_FA.md را کامل بخوان.
بعد docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md و docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md را بخوان.
سپس Git remote/PR stack و Production را read-only دوباره تأیید کن و دقیقاً از CURRENT_NEXT_ACTION ادامه بده.
هیچ فازی را Done اعلام نکن مگر CI/Merge/Registration/Production evidence مربوط به آن واقعاً کامل شده باشد.
```

## Final delivery marker

فقط بعد از F31 مجاز است:

```text
WINIMI_FINAL_DELIVERY=PASS
PRODUCTION=READY
HANDOFF=COMPLETE
```
