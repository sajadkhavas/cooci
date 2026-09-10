# ممیزی نهایی پوشش پنل مدیریت WINIMI — F31

تاریخ: 2026-09-10

## مبنای ممیزی

این سند فقط بر پایه کد GitHub، API contract، تست‌های خودکار و CI نوشته شده است. «کشف‌های سایت زنده» و مشاهده دستی Production که مالک پروژه تأیید نکرده، عمداً از مبنای این گزارش حذف شده‌اند.

```text
FRONTEND_REPO=sajadkhavas/cooci
FRONTEND_IMPLEMENTATION_HEAD=584aecf5bafac9fa6b757fdd937495be25ab989d
BACKEND_REPO=sajadkhavas/winimi-bakery-backend
BACKEND_IMPLEMENTATION_HEAD=96170b03c28548e627e4bf9255addaef745d9df1
F31_ADMIN_COVERAGE=P0_P1_CODE_GAPS_CLOSED
PRODUCTION_ALIGNMENT=PENDING_FINAL_SINGLE_DEPLOY
```

### Frontend exact-head evidence

- Frontend CI #1778 — run `34460666353` — SUCCESS
- Phase 18 End-to-End Acceptance #594 — run `34460666344` — SUCCESS
- Phase 8 Deployment Readiness #727 — run `34460666422` — SUCCESS
- Phase 19 Production Package #162 — run `34460666319` — SUCCESS
- F30 Storefront Frontend Authority #157 — run `34460666477` — SUCCESS

### Backend exact-head evidence

- Backend CI #639 — run `34461694652` — SUCCESS
- Phase 18 Backend Acceptance #137 — run `34461694575` — SUCCESS
- Phase 19 Production Package #125 — run `34461694663` — SUCCESS
- F30 Storefront Backend Authority #80 — run `34461694563` — SUCCESS

## تعریف «قابل کنترل از پنل»

هر داده محتوایی، تجاری، عمومی یا عملیاتی که مالک فروشگاه باید بدون تغییر کد مدیریت کند، باید Backend/Filament-authoritative باشد و Frontend آن را از API/SSR مصرف کند. منطق امنیتی، validation داخلی، schema دیتابیس، secrets، private keys، payment credentials، Service Worker logic، layout و accessibility mechanics عمداً code-controlled می‌مانند.

## ماتریس نهایی Panel → API → Frontend

| سطح | منبع معتبر | کنترل پنل | مصرف Frontend | وضعیت |
|---|---|---|---|---|
| محصولات، Variant، قیمت، موجودی، رسانه و محتوای کامل محصول | BakeryProduct/Catalog | محصولات بیکری | Catalog/Product SSR/API | PASS |
| دسته‌بندی، تصویر/alt و SEO | BakeryCategory | دسته‌بندی‌های بیکری | Category routes | PASS |
| لندینگ‌های دسته و SEO | BakeryCategoryLanding | لندینگ‌های SEO | Category/SEO | PASS |
| برند، تماس، Home، CTA، Hero، Decision، App UI و copy عمومی | StoreSetting | محتوای سایت و صفحه اصلی | Store settings resolver | PASS |
| Header و زیرمنوها | NavigationItem | منوی هدر و زیرمنوها | SSR header/mobile nav | PASS |
| Footer navigation | NavigationItem `placement=footer` | همان Resource | root SSR → Footer | PASS |
| Footer copy/contact/legal fallback | StoreSetting | محتوای سایت و صفحه اصلی | Footer | PASS |
| صفحات عمومی/حقوقی | BakeryContentPage | صفحات محتوایی وینیمی | SSR public routes | PASS |
| FAQ عمومی و Decision FAQ | BakeryFaq | سوالات متداول وینیمی | FAQ/Home | PASS |
| بلاگ/راهنما | BakeryPost | وبلاگ وینیمی | Blog SSR routes | PASS |
| گالری | BakeryGalleryItem | گالری وینیمی | Gallery | PASS |
| شهرها / Local SEO | BakeryCityPage | صفحات شهری | City routes | PASS |
| نظرات | ProductReview | نظرات محصولات | Product/reviews | PASS |
| سفارش/پرداخت/ارسال | Order/Payment/Delivery | منابع عملیاتی Filament | Account/Checkout | PASS |
| تخفیف عمده کوکی | StoreSetting pricing | Toggle/عدد/TagsInput slug | pricing contract | PASS |
| eNAMAD | StoreSetting trust | Toggle + editor اختصاصی کد رسمی | parser امن EnamadTrustSlot | PASS / FAIL-CLOSED |
| PWA name/colors/shortcuts | StoreSetting PWA | editorهای تخصصی | `/app.webmanifest` | PASS |
| متن Offline | StoreSetting PWA | editor متنی | `/offline` + SW cache refresh | PASS |
| Push subscription inventory | WebPushSubscription | masked/read-only | Push infrastructure | PASS |
| Google Tag / Analytics | StoreSetting integrations/consent | mode + public ID + consent | consent-aware loader | PASS |
| Search Console verification | StoreSetting integrations | public token editor | SSR verification meta | PASS |
| Redirect/robots/sitemap و SEO tools | SEO admin resources | منابع SEO | SSR/crawl | PASS |

## اصلاحات نهایی F31

### Footer

`placement=footer` در API validate می‌شود و Frontend آن را در root loader به‌صورت SSR دریافت می‌کند. گزینه «فقط فوتر» دیگر داده مرده ایجاد نمی‌کند.

### PWA و Offline

Manifest نصب‌شونده واقعی `/app.webmanifest` از StoreSetting ساخته می‌شود. Phase18 #594 خود همین route را با Content-Type، name/short_name، theme/background colors، shortcutهای داخلی و iconها تست کرده است.

برای navigation حساس مثل `/checkout`، Offline fallback بدون script و modulepreload تحویل می‌شود تا React روی URL حساس hydrate نشود. Service Worker همچنین cache صفحه `/offline` را به‌صورت محدود و `no-store` refresh می‌کند تا تغییر متن مدیریتی به Deploy جدید وابسته نباشد.

### Push

Resource اعضای Web Push endpoint/key کامل را نمایش نمی‌دهد، اطلاعات مشتری mask می‌شود و create/edit/delete/bulk action ندارد. این Resource inventory مدیریتی است، نه ابزار دستکاری subscription.

### Online Launch

فقط شناسه‌های عمومی GA4/GTM و Search Console token در StoreSetting قرار می‌گیرند. Google Tag فقط بعد از consent صریح بارگذاری می‌شود. Secret/OAuth credential/private key در API عمومی یا StoreSetting این سطح قرار نمی‌گیرد.

### Legacy cleanup

Resourceهای قدیمی `Product`, `Category`, `BlogPost`, `Faq`, `Review`, `Setting`, `SitePage`, `Slider`, `Brand` از navigation مخفی شده‌اند؛ داده حذف نشده است. SiteSettings قدیمی writable نیست و به StoreSettingResource معتبر هدایت می‌شود.

### StoreSetting UX

ویرایشگر عمومی Textarea برای همه نوع‌ها کنار گذاشته شده است. نوع‌های PWA shortcut، color، Google Tag mode/ID، Search Console، boolean، integer، JSON، email، internal path، media URL، phone، long text، bulk category slugs و eNAMAD editor تخصصی دارند. کلید فنی/type/public flag از پنل قابل تغییر نیستند.

### حفاظت داده مدیریتی در migration

Migrationهای admin-completion و cookie bulk settings در صورت وجود مقدار، فقط metadata قرارداد را repair می‌کنند و `value` فعلی مدیر را overwrite نمی‌کنند. `down()` آن‌ها برای داده operator-owned عمداً non-destructive است.

## Decision Support desktop jitter

چهار نسل قبلی component بررسی شد. نسخه‌های قدیمی wrapper انیمیشنی `Reveal` داشتند؛ در F31 این wrapper فقط از Decision Support حذف شد. سپس مسیر paint دسکتاپ برای همان section جدا شد و pseudo-layer/contain سنگین در breakpoint دسکتاپ محدود شد. این اصلاح سراسری نیست و ساختار/متن/Backend authority بخش را تغییر نمی‌دهد.

## مواردی که عمداً پنلی نیستند

- VAPID private key و encryption material
- Zarinpal/Kavenegar/Google OAuth secrets
- DB/Redis/server credentials
- Service Worker logic و security boundaries
- API validation، order/payment state machines و idempotency
- layout/responsive/accessibility mechanics
- PWA icon binaries و release logic

## نتیجه

```text
UNRESOLVED_ADMIN_P0=0
UNRESOLVED_ADMIN_P1=0
LIVE_SITE_DISCOVERIES_USED=NO
FRONTEND_IMPLEMENTATION_CI=5_OF_5_SUCCESS
BACKEND_IMPLEMENTATION_CI=4_OF_4_SUCCESS
FINAL_SINGLE_PRODUCTION_DEPLOY=REQUIRED_AFTER_MERGE
```
