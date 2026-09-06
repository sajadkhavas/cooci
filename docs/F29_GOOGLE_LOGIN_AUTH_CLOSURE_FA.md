# F29 — Google Login & Auth Closure

Status: **COMPLETED / MERGED / REGISTERED**  
Project: **WINIMI / COOCI**  
Frontend repository: `sajadkhavas/cooci`  
Backend repository: `sajadkhavas/winimi-bakery-backend`

## Baseline

- Frontend base: `phase-29s/seo-content-strategy-authority` @ `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend base: `phase-29s/seo-content-strategy-authority` @ `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Frontend branch: `phase-29/google-login-auth-closure`
- Backend branch: `phase-29/google-login-auth-closure`
- Tracker: `sajadkhavas/cooci#48`

## هدف و معماری بسته‌شده

F29 لایه Auth نهایی Source/CI را با Google Login واقعی در سطح Authorization Code + OpenID Connect تکمیل کرد، بدون قرار دادن credential در Git/Frontend و بدون mutation روی Production.

1. Frontend فقط به endpoint ثابت Backend یعنی `/auth/google/redirect` هدایت می‌شود.
2. Backend `state` تصادفی را در session نگهداری و در callback یک‌بار مصرف اعتبارسنجی می‌کند.
3. Scope حداقلی `openid email profile` استفاده می‌شود.
4. شناسه پایدار Google برابر `sub` است؛ email کلید identity نیست.
5. Access/refresh token در دیتابیس وینیمی ذخیره نمی‌شود.
6. login موفق از guard موجود `customer` استفاده و session را regenerate می‌کند.
7. اتصال خودکار بر اساس email/phone ممنوع است؛ existing-email collision با `account_link_required` متوقف می‌شود.
8. linking فقط از session احرازشده همان Customer انجام می‌شود و یک Google identity نمی‌تواند متعلق به دو Customer باشد.

## Mobile completion و OTP

- Customer جدید Google می‌تواند ابتدا `mobile = null` داشته باشد.
- Frontend برای کاربر Google بدون موبایل، `MobileCompletionGate` را اعمال می‌کند.
- فقط شماره معتبر ایران با normalization مشترک پذیرفته می‌شود.
- تکمیل موبایل، `mobile_verified_at` را پر نمی‌کند؛ تأیید فقط پس از OTP واقعی مجاز است.
- OTP infrastructure حذف نشده است.
- `OTP_ENABLED=false` پیش‌فرض امن باقی مانده و request/verify هنگام خاموش بودن fail-closed است.
- فعال‌سازی credential واقعی Google و SMS در Phase 20 انجام می‌شود.

## Frontend security boundary

- هیچ `VITE_GOOGLE_*` credential در Frontend تعریف یا مصرف نمی‌شود.
- capability response فقط enabled/disabled را کنترل می‌کند و URL دلخواه برای redirect اجرا نمی‌شود.
- return path قبل و بعد از OAuth round-trip با policy داخلی sanitize می‌شود.
- callback error codeها فقط به پیام‌های کنترل‌شده UI نگاشت می‌شوند.

## Security dependency closure

در Backend exact-head، Composer audit یک advisory برای `livewire/livewire v3.8.2` شناسایی کرد. Lockfile با Composer و minimal-change به نسخه patched `v3.8.3` ارتقا یافت؛ سپس workflow موقت تولید lock حذف شد. Commit lock:

`044ed8e12f0a5df3babcceba9e9d0eecc234d5cf`

Final Backend source head پس از حذف workflow موقت:

`1bc34ade42b964351b517df9c94c7a79dbbfb781`

روی همین exact head، F29 Auth Closure شامل focused tests، full backend regression و Composer security audit سبز شد.

## External activation boundary

```text
GOOGLE_SOURCE_IMPLEMENTATION=F29_COMPLETE
GOOGLE_LIVE_CREDENTIAL_ACTIVATION=PHASE20
PRODUCTION_DEPLOYMENT=PHASE19B
PRODUCTION_MUTATION_DURING_F29=NO
```

Live validation با credential واقعی کارفرما یک Gate جدا در Phase 20 است و جزو ادعای Closure این فاز محسوب نمی‌شود.

## مراجع رسمی

- Google OpenID Connect: `https://developers.google.com/identity/openid-connect/openid-connect`
- Google OAuth 2.0 for Web Server Applications: `https://developers.google.com/identity/protocols/oauth2/web-server`
- Laravel Sanctum 12.x: `https://laravel.com/docs/12.x/sanctum`

## Closure evidence

```text
F29_STATUS=PASS_MERGED_REGISTERED

FRONTEND_BASE=2cddf69e3a5e550b5acfff4729beffcb81a0ccea
FRONTEND_EXACT_HEAD=55fdb43c8a7e43186ffe89139739de7e3c7bfdf7
FRONTEND_PR=49_MERGED
FRONTEND_F29_AUTH_RUN=34041798526_SUCCESS
FRONTEND_FULL_CI_RUN=34041798547_SUCCESS
FRONTEND_F29S_REGRESSION_RUN=34041798554_SUCCESS
FRONTEND_MERGE_SHA=3539938dff37d788b11a532097145a2e87569915

BACKEND_BASE=ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0
BACKEND_EXACT_HEAD=1bc34ade42b964351b517df9c94c7a79dbbfb781
BACKEND_PR=14_MERGED
BACKEND_F29_AUTH_RUN=34041754511_SUCCESS
BACKEND_F29S_CONTENT_RUN=34041754498_SUCCESS
BACKEND_F29S_TRUST_RUN=34041754502_SUCCESS
BACKEND_MERGE_SHA=6c6874dfe3d616f8523601a83b0d2427b1b7f3ee
LIVEWIRE_PATCHED_VERSION=3.8.3

PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
GOOGLE_LIVE_CREDENTIALS_ACTIVATED=NO_PHASE20
NEXT_AFTER_F29=F30_MAINLINE_GIT_STACK_CLOSURE
```
