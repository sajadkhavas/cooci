# F29 — Google Login & Auth Closure

Status: **IN PROGRESS**  
Project: **WINIMI / COOCI**  
Frontend repository: `sajadkhavas/cooci`  
Backend repository: `sajadkhavas/winimi-bakery-backend`

## Baseline

- Frontend base: `phase-29s/seo-content-strategy-authority` @ `2cddf69e3a5e550b5acfff4729beffcb81a0ccea`
- Backend base: `phase-29s/seo-content-strategy-authority` @ `ff6ad79c5c3ef1ffc69f77023a37a0a261ded8b0`
- Frontend branch: `phase-29/google-login-auth-closure`
- Backend branch: `phase-29/google-login-auth-closure`
- Tracker: `sajadkhavas/cooci#48`

## هدف

تکمیل Auth نهایی وینیمی با Google Login واقعی در سطح Source/CI و حفظ OTP به‌عنوان زیرساخت قابل فعال‌سازی، بدون قرار دادن credential در Git/Frontend و بدون mutation روی Production.

## معماری Google

Flow انتخاب‌شده Web Server Authorization Code + OpenID Connect است:

1. Frontend فقط به endpoint ثابت Backend یعنی `/auth/google/redirect` هدایت می‌شود.
2. Backend یک `state` تصادفی ۲۵۶ بیتی در session ذخیره می‌کند.
3. Backend کاربر را با scope حداقلی `openid email profile` به Google می‌فرستد.
4. Callback روی Backend مقدار `state` را با session مقایسه می‌کند و یک‌بار مصرف می‌کند.
5. Backend authorization code را با Client Secret موجود فقط در server environment مبادله می‌کند.
6. UserInfo از Google دریافت می‌شود.
7. شناسه هویتی پایدار Google برابر `sub` است؛ email کلید identity نیست.
8. Access token و refresh token در دیتابیس وینیمی ذخیره نمی‌شوند.
9. در login موفق همان guard موجود `customer` استفاده و session بعد از login rotate می‌شود.

## Account linking

اتصال خودکار حساب فقط بر اساس email یا phone ممنوع است.

- اگر `(provider=google, sub)` از قبل وجود داشته باشد، همان Customer معتبر وارد می‌شود.
- اگر identity جدید باشد ولی email از قبل متعلق به Customer دیگری باشد، flow با `account_link_required` متوقف می‌شود.
- اتصال Google به Customer موجود فقط از داخل session احرازشده همان Customer با `/auth/google/link` انجام می‌شود.
- identity یک Google account نمی‌تواند به دو Customer متصل شود.
- هر Customer حداکثر یک identity برای provider `google` دارد.

## Mobile completion

Schema واقعی پروژه `mobile_verified_at` دارد.

- Customer جدید Google می‌تواند ابتدا `mobile = null` داشته باشد.
- قبل از دسترسی به protected customer routes، Frontend `MobileCompletionGate` نشان می‌دهد.
- فقط شماره معتبر ایران با normalization مشترک پذیرفته می‌شود.
- ثبت شماره هرگز `mobile_verified_at` را پر نمی‌کند.
- `mobile_verified_at` فقط بعداً توسط OTP واقعی قابل تأیید است.
- شماره Customerهای active یا soft-deleted قابل claim مجدد نیست.

## OTP feature flag

OTP حذف نشده است.

- `OTP_ENABLED=false` پیش‌فرض امن است.
- sender/service/challenge/rate-limit/test coverage موجود حفظ می‌شوند.
- وقتی flag خاموش باشد request/verify با خطای fail-closed `otp_disabled` متوقف می‌شوند.
- فعال‌سازی SMS credential واقعی در Phase 20 انجام می‌شود.

## Frontend security boundary

Frontend هیچ Google Client ID/Secret دریافت نمی‌کند.

- navigation فقط به pathهای ثابت `/auth/google/redirect` و `/auth/google/link` روی origin Backend انجام می‌شود.
- capability response فقط enabled/disabled را کنترل می‌کند؛ redirect URL دلخواه از Backend یا query اجرا نمی‌شود.
- return path در `sessionStorage` فقط بعد از `sanitizeInternalReturnPath` نگهداری می‌شود.
- پس از round-trip مقصد دوباره sanitize و سپس consume می‌شود.
- callback error codeها فقط به پیام‌های کنترل‌شده UI نگاشت می‌شوند.

## External activation boundary

F29 پیاده‌سازی production-grade و تست‌های واقعی flow boundary را می‌بندد، اما credential واقعی Google متعلق به کارفرماست و در Git وجود ندارد.

بنابراین:

```text
GOOGLE_SOURCE_IMPLEMENTATION=F29
GOOGLE_LIVE_CREDENTIAL_ACTIVATION=PHASE20
PRODUCTION_DEPLOYMENT=PHASE19B
PRODUCTION_MUTATION_DURING_F29=NO
```

F29 فقط در صورتی بسته می‌شود که Backend و Frontend exact-head CI سبز، PRها merge، evidence ثبت و Production mutation همچنان NO باشد. Live validation با credential واقعی در Phase 20 یک Gate جدا و اجباری است و با F29 اشتباه گرفته نمی‌شود.

## مراجع رسمی

- Google OpenID Connect: `https://developers.google.com/identity/openid-connect/openid-connect`
- Google OAuth 2.0 for Web Server Applications: `https://developers.google.com/identity/protocols/oauth2/web-server`
- Laravel Sanctum 12.x: `https://laravel.com/docs/12.x/sanctum`

## Closure evidence

این بخش فقط بعد از PASS واقعی CI/Merge تکمیل می‌شود.

```text
F29_STATUS=IN_PROGRESS
FRONTEND_EXACT_HEAD=PENDING
BACKEND_EXACT_HEAD=PENDING
FRONTEND_PR=PENDING
BACKEND_PR=14_OPEN
FRONTEND_CI=PENDING
BACKEND_CI=PENDING
PRODUCTION_MUTATION=NO
DEPLOY_PERFORMED=NO
NEXT_AFTER_F29=F30_MAINLINE_GIT_STACK_CLOSURE
```
