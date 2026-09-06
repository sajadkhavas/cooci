# F30 — Mainline / Git Stack Closure

## وضعیت

این سند شواهد implementation فاز F30 را پیش از merge نهایی به `main` ثبت می‌کند. شواهد merge/main و SHAهای نهایی پس از اجرای exact-head gate در Tracker #50 ثبت می‌شوند.

## Backend authority invariant

محتوای تجاری، محتوایی، SEO، CTA، ناوبری، Footer، اطلاعات تماس/برند و shellهای عمومی قابل‌ویرایش از Backend/Filament کنترل می‌شوند. Frontend فقط presentation، responsive behavior، accessibility mechanics و transient system microcopy را code-controlled نگه می‌دارد.

## موارد بسته‌شده

- StoreSetting/CMS موجود به‌عنوان control plane اصلی حفظ و توسعه داده شد؛ CMS موازی ساخته نشد.
- navigation/footer/storefront settings و category landingها Backend-authoritative هستند.
- shellهای عمومی `products`, `blog`, `contact`, `faq`, `gallery`, `locations`, `reviews` و CTAهای managed pages به Backend authority متصل شدند.
- Internal Linking فاز F29S با Backend-primary و fallback قطعی حفظ شد.
- SEO baseline و URL/SSR/local SEO invariants بدون بازنویسی مخرب حفظ شدند.
- Filament controls برای داده‌های مدیریتی اضافه/تکمیل شدند و contract keys ساختاری از محتوای قابل‌ویرایش جدا باقی ماندند.
- F30 authority regression gate دائمی در CI وجود دارد.
- workflowها و transformهای صرفاً تشخیصی/repair قبل از closure حذف شدند.

## شواهد پیش از exact-head PR gate

### Frontend

- Verified public-shell repair run: `34051146120` — SUCCESS
- در run قبلی `34051046462`:
  - TypeScript: PASS
  - Unit: 107/107 PASS
  - `F30_STOREFRONT_BACKEND_AUTHORITY=PASS`
  - `SEO_BASELINE_PRESERVED=PASS`
  - `SEO_BACKEND_AUTHORITY=PASS`
  - Phase 10.3 SSR audit: PASS
  - Phase 10.7 Local SEO audit: PASS
- Source before this registration commit: `8ad938838941e02bf4ae5aea14890516a93de821`

### Backend

- Exact-head source: `7b165b048c61c02eccc97ce297cbb863fc094588`
- F30 Storefront Backend Authority run: `34051061464` — SUCCESS
- Migration gate: PASS
- F30 authority tests: PASS
- Full backend regression: PASS
- Pint formatting gate: PASS
- Composer security audit: PASS

## Safety

```text
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
SEARCH_CONSOLE_MUTATION=NO
```

## Closure

F30 فقط بعد از این موارد `CLOSED` است:

1. exact-head Frontend release gates روی source نهایی سبز شوند؛
2. Frontend و Backend PRهای نهایی به `main` merge شوند؛
3. PR #36 به‌صورت امن resolve/supersede شود؛
4. Tracker #50 با SHA/PR/run evidence نهایی بسته شود؛
5. `main` هر دو مخزن منبع تحویل باشد.

```text
NEXT_AFTER_F30=PHASE19B_LIVE_SERVER_EXECUTION
```
