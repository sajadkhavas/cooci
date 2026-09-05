# وضعیت مرجع پروژه وینیمی

آخرین به‌روزرسانی: **۲۰۲۶-۰۹-۰۵**  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
نقش این فایل: **مرجع شماره ۱ برای ادامه کار در هر چت جدید**

> اگر چت جدید شروع شد، ابتدا همین فایل کامل خوانده شود. سپس `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md`، `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md` و `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md` خوانده شوند. بعد Remote Git و Production به‌صورت read-only دوباره قفل شوند. هیچ مرحله‌ای از روی حافظه، `main` قدیمی یا Production تاریخی شروع نشود.

## CURRENT_STATUS

```text
PROJECT=WINIMI_COOCI
CURRENT_PHASE=F29S_SEO_CONTENT_STRATEGY_AUTHORITY
CURRENT_SUBPHASE=F29S_A_KEYWORD_INTELLIGENCE
PHASE28=COMPLETED_MERGED_REGISTERED
F29S=REGISTERED_NEXT
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

## تصمیم جدید SEO پس از Phase 28

کاربر در ۲۰۲۶-۰۹-۰۵ تأیید کرد که قبل از Google Login یک فاز مستقل برای Content SEO اضافه شود، چون Phase 28 بیشتر Technical SEO/Route Architecture را بسته بود و بخش‌های زیر هنوز کامل نبودند:

- Keyword Research داده‌محور بازار فارسی
- Keyword-to-URL mapping
- Guide/Article content واقعی
- Topic Clusters و Topical Authority
- Commercial page keyword validation
- Product SEO audit
- Local/Merchant/Trust content decisions
- Internal-link graph و Cannibalization control
- Measurement/Search Console plan

فاز ثبت‌شده:

`F29S — SEO Content Strategy & Topical Authority`

مرجع رسمی:

`docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md`

F29S Phase 28 را reopen نمی‌کند؛ لایه بعدی SEO است.

## Git stack فعلی

- Integration branch: `phase-27/cross-project-design-synthesis`
- PR `#36` هنوز **OPEN / DRAFT** است.
- PR #36 base: `phase-26/uir1-home-navigation-redesign`
- Phase 27 شامل Phase 28 merge‌شده و مستندات F29S است، اما زنجیره نهایی هنوز به `main` بسته نشده است.
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

**شش فاز اجرایی باقی مانده:**

1. **F29S — SEO Content Strategy & Topical Authority**
2. **F29 — Google Login & Auth Closure**
3. **F30 — Mainline / Git Stack Closure**
4. **Phase 19B — Live Server Execution**
5. **Phase 20 — External Activation**
6. **F31 — Final Acceptance & Handoff**

ترتیب قطعی:

```text
F29S -> F29 -> F30 -> Phase19B -> Phase20 -> F31
```

## CURRENT_NEXT_ACTION

**شروع F29S-A — Keyword Intelligence & Competitor/SERP Research.**

ترتیب F29S:

1. Keyword Intelligence بازار فارسی/ایران.
2. Search Intent classification.
3. SERP/competitor evidence.
4. Keyword-to-URL map تمام صفحات indexable.
5. Topic Cluster architecture.
6. Guide/Article foundation و انتشار حداقل یک Cluster واقعی اولویت‌دار.
7. اتصال Home Editorial Guides به مقصدهای اختصاصی واقعی.
8. Commercial page SEO validation.
9. Product SEO audit.
10. Local/Merchant/Trust content decisions.
11. Internal-link graph + Cannibalization gate.
12. Crawl/SSR/SEO/CI acceptance.
13. PR/Merge/Register.

### شرط مهم F29S

فاز با صرفاً تهیه یک لیست کلمه بسته نمی‌شود. برای Closure باید حداقل یک Topic Cluster واقعی با محتوای منتشرشده و supporting guideهای لازم فعال باشد و کارت‌های راهنمای Home دیگر به placeholder عمومی `/blog` ختم نشوند.

بعد از F29S، F29 Google Login اجرا می‌شود. پس از F29، F30 stack باز Phase 26/27/28/F29S/Auth را تا `main` می‌بندد و سپس فقط یک release نهایی تمیز از `main` به Production می‌رود، مگر اینکه کاربر صراحتاً interim deployment بخواهد.

## فایل‌هایی که چت بعدی باید بخواند

به این ترتیب:

1. `WINIMI_PROJECT_STATUS_FA.md` ← وضعیت لحظه‌ای و NEXT
2. `docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md` ← تمام فازهای باقی‌مانده و Gateها
3. `docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md` ← Scope کامل فاز فعلی SEO Content
4. `docs/PHASE_28_SEO_ROUTE_ARCHITECTURE_CLOSURE.md` ← آخرین فاز SEO فنی بسته‌شده
5. `docs/WINIMI_LIVING_HANDOFF_FA.md` ← تاریخچه فنی/تصمیم‌های پروژه
6. `docs/PHASE_19_PRODUCTION_DEPLOYMENT.md` ← مرجع رسمی Deploy سرور هنگام رسیدن به 19B

## متن آماده برای چت جدید

```text
پروژه WINIMI / COOCI را ادامه بده.
Repository: sajadkhavas/cooci
ابتدا فایل WINIMI_PROJECT_STATUS_FA.md را کامل بخوان.
بعد docs/WINIMI_FINAL_DELIVERY_ROADMAP_FA.md و docs/F29S_SEO_CONTENT_STRATEGY_AUTHORITY_FA.md را بخوان.
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
