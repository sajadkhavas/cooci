# F30 — Mainline / Git Stack Closure

## وضعیت

این سند شواهد implementation فاز F30 را پیش از merge نهایی Frontend به `main` ثبت می‌کند. شواهد exact-head نهایی Frontend، merge SHA و وضعیت نهایی `main` پس از اجرای Gateها در Tracker #50 ثبت می‌شوند؛ بنابراین هیچ SHA موقتی به‌عنوان END_SHA نهایی در این سند جا زده نمی‌شود.

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

## Frontend — closure candidate

- PR: `#51` — merge فقط پس از سبزشدن همه exact-head release gates مجاز است.
- Source قبل از این registration commit: `e2714d1fafeddf5bd6710fb3faf972ff9f4169f2`
- Auth/OTP Phase18 fixture با قرارداد F29 همگام شد؛ Production OTP همچنان fail-closed/off است.
- Phase10.7 regression واقعی NAP/JSON-LD با Backend-authoritative Store Settings اصلاح شد؛ تست ضعیف یا bypass نشد.
- END_SHA و Run IDهای Frontend نهایی فقط پس از همین registration commit و exact-head rerun در Tracker #50 ثبت می‌شوند.

## Safety

```text
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
SEARCH_CONSOLE_MUTATION=NO
```

## Closure

F30 فقط بعد از این موارد `CLOSED` است:

1. exact-head Frontend CI، Phase8، Phase18، Phase19 Package و F30 Authority روی source نهایی سبز شوند؛
2. Frontend PR #51 به `main` merge شود؛
3. Backend `main` روی source نهایی F30 باقی بماند؛
4. PR #36 به‌صورت امن به‌عنوان superseded resolve شود؛
5. Tracker #50 با SHA/PR/run evidence نهایی بسته شود؛
6. وضعیت مرجع پروژه برای شروع Phase19B به‌روزرسانی شود.

```text
NEXT_AFTER_F30=PHASE19B_LIVE_SERVER_EXECUTION
PRODUCTION_MUTATION_ALLOWED_IN_F30=NO
```
