# F30 — Mainline / Git Stack Closure

## وضعیت نهایی

**F30 = PASS / MERGED / REGISTERED / CLOSED**

این فاز Git stack نهایی WINIMI را از Phase26/27/28/F29S/F29/F30 به `main` منتقل کرد، Backend Authority را قفل کرد و هیچ Production mutation یا deployment انجام نداد.

## Backend authority invariant

محتوای تجاری، محتوایی، SEO، CTA، ناوبری، Footer، اطلاعات تماس/برند و shellهای عمومی قابل‌ویرایش از Backend/Filament کنترل می‌شوند. Frontend فقط presentation، responsive behavior، accessibility mechanics و transient system microcopy را code-controlled نگه می‌دارد.

## موارد بسته‌شده

- StoreSetting/CMS موجود به‌عنوان control plane اصلی حفظ و توسعه داده شد؛ CMS موازی ساخته نشد.
- navigation/footer/storefront settings و category landingها Backend-authoritative هستند.
- shellهای عمومی `products`, `blog`, `contact`, `faq`, `gallery`, `locations`, `reviews` و CTAهای managed pages به Backend authority متصل شدند.
- اطلاعات NAP و Organization/WebSite JSON-LD از همان Store Settings عمومی resolve می‌شوند؛ Contact/Locations/City/SEO دیگر دو منبع هویت متناقض ندارند.
- Internal Linking فاز F29S با Backend-primary و fallback قطعی حفظ شد.
- SEO baseline و URL/SSR/local SEO invariants بدون بازنویسی مخرب حفظ شدند.
- Filament controls برای داده‌های مدیریتی اضافه/تکمیل شدند و contract keys ساختاری از محتوای قابل‌ویرایش جدا باقی ماندند.
- F30 authority regression gate دائمی در CI وجود دارد.
- workflowها و transformهای صرفاً تشخیصی/repair قبل از closure حذف شدند.

## Backend — نهایی و Merge‌شده

- F30 source HEAD: `e57ee2dcde2c3a67eaeda3d379790021eebcf03b`
- PR: `#15` — MERGED
- `main` merge SHA: `37dcbf83ca225cacec40f034659d1448adaebaba`
- Backend CI: run `34064138819` — SUCCESS
- Phase 18 backend gate: run `34064138836` — SUCCESS
- F30 Storefront Backend Authority: run `34064138868` — SUCCESS
- Phase 19 Production Package: run `34064138827` — SUCCESS
- Pint formatting gate: PASS
- Composer security audit: PASS
- Production package contract با topology واقعی `current/app/public` همگام شد.

## Frontend — نهایی و Merge‌شده

- Exact source HEAD: `d17054b783eabff96db8bd3100402f50d15e2b55`
- PR: `#51` — MERGED
- Merge SHA into `main`: `19e5502549907c75c7800337716e71da469de050`
- Frontend CI: run `34065298017` — SUCCESS
- Phase 8 Deployment Readiness: run `34065297991` — SUCCESS
- Phase 18 End-to-End Acceptance: run `34065297994` — SUCCESS
- Phase 19 Production Package: run `34065298003` — SUCCESS
- F30 Storefront Frontend Authority: run `34065297971` — SUCCESS
- PR #51 review submissions: 0
- PR #51 inline review threads: 0

### regressions resolved before merge

- Auth/OTP Phase18 fixture با قرارداد F29 همگام شد؛ Production OTP همچنان fail-closed/off است.
- Phase10.7 یک ناسازگاری واقعی NAP/JSON-LD را کشف کرد؛ Organization/WebSite schema و City/Contact surfaces به Store Settings مشترک Backend-authoritative متصل شدند و E2E نهایی PASS شد.
- تست‌ها ضعیف یا bypass نشدند؛ regression gate سخت‌تر شد.

## Legacy stack resolution

- PR #36 head: `9a062efa972625d3a90f52dc86b089054d43e9f8`
- F30 final source نسبت به PR #36: `ahead_by=123`, `behind_by=0`
- merge-base: همان PR #36 head
- نتیجه: محتوای PR #36 داخل stack نهایی F30 است.
- PR #36 بدون merge تکراری به‌عنوان **superseded** بسته شد.

## Tracker

- `cooci#50` — F30 Mainline / Git Stack Closure
- تمام Scopeهای F30-A تا F30-J با شواهد SHA/PR/CI ثبت و Tracker در پایان Closure بسته می‌شود.

## Safety

```text
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
SEARCH_CONSOLE_MUTATION=NO
```

## Closure result

```text
F30=PASS_MERGED_REGISTERED_CLOSED
FRONTEND_F30_SOURCE_HEAD=d17054b783eabff96db8bd3100402f50d15e2b55
FRONTEND_F30_MERGE_SHA=19e5502549907c75c7800337716e71da469de050
BACKEND_F30_SOURCE_HEAD=e57ee2dcde2c3a67eaeda3d379790021eebcf03b
BACKEND_MAIN=37dcbf83ca225cacec40f034659d1448adaebaba
LEGACY_PR_36=CLOSED_SUPERSEDED
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
NEXT=PHASE19B_LIVE_SERVER_EXECUTION
```
