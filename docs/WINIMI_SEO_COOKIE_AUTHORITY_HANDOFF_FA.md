# WINIMI SEO COOKIE AUTHORITY HANDOFF FA

## وضعیت

تاریخ ثبت: 2026-09-22

این فایل برای ادامه کار در چت بعدی ایجاد شده است. قبل از هر اقدام جدید باید این فایل و مستندات اصلی پروژه خوانده شوند.

## هدف این مرحله

ورود رسمی پروژه WINIMI به مرحله SEO Architecture و ساخت Topic Authority برای دسته کوکی.

هدف فقط اضافه کردن متن SEO نیست؛ هدف ساخت ساختار قابل توسعه برای:

- Category SEO
- Product SEO
- Content Cluster
- Internal Linking
- Schema
- Technical SEO
- Indexability

## وضعیت فعلی پروژه

WINIMI تا این مرحله زیرساخت اصلی را دارد:

- Frontend و Backend Production شده‌اند.
- Backend بر پایه Laravel 12 است.
- Admin/CMS برای مدیریت محتوا وجود دارد.
- Product data برای محصولات واقعی آماده شده است.
- Rich Content اضافه شده است.
- Push/PWA و Media improvements انجام شده‌اند.
- Product «کوکی اورئو» با اطلاعات نهایی ثبت شده است.

## محصول ثبت شده: کوکی اورئو

Slug:

`oreo-cookie`

نام:

کوکی اورئو

مشخصات نهایی:

- وزن هر عدد: ۷۰ گرم
- بسته ۸ عددی: ۵۶۰ گرم
- مواد اولیه: آرد، شکر، شکر قهوه‌ای، کره، بیسکویت اورئو، پودر کاکائو، شکلات، وانیل، بکینگ پودر، نمک
- آلرژن‌ها: تخم مرغ، پودر کاکائو
- نگهداری: ۵ روز محیط، تا ۷ روز یخچال
- ارسال بین شهری فعال

## تصمیم معماری SEO

مدل نهایی:

Topic → Category → Product → Content → Internal Links

نباید فقط یک صفحه محصول ساخته شود.

## ساختار پیشنهادی SEO

### Category

صفحه دسته کوکی باید یک Landing واقعی باشد:

- Hero
- معرفی دسته
- محصولات
- راهنمای خرید
- FAQ
- لینک داخلی

نمونه هدف:

خرید کوکی خانگی و دست ساز وینیمی

## Product SEO

هر محصول باید شامل:

- SEO Title
- Meta Description
- توضیح کوتاه
- توضیح کامل
- مواد اولیه
- وزن و بسته بندی
- نگهداری
- سوالات متداول
- تصاویر بهینه
- Alt واقعی

## Content Cluster

مقالات پیشنهادی:

- انواع کوکی خانگی
- کوکی شکلاتی چیست
- کوکی اورئو
- بهترین کوکی برای هدیه
- تفاوت کوکی خانگی و صنعتی

هدف:

مقاله → دسته → محصول

## Technical SEO Audit قبل از اجرا

قبل از تولید محتوا باید بررسی شود:

- Sitemap
- Robots
- Canonical
- Product Schema
- Breadcrumb Schema
- SSR Indexability
- Core Web Vitals
- Image optimization

## قانون ادامه کار

در چت بعدی از ابتدا شروع نشود.

ابتدا:

1. WINIMI_PROJECT_STATUS_FA.md
2. docs/WINIMI_LIVING_HANDOFF_FA.md
3. این فایل

خوانده شود.

سپس:

SEO Architecture Audit روی Repository و Production انجام شود.

## وضعیت فعلی مرحله

PHASE: SEO ARCHITECTURE AUDIT

STATUS: READY TO START

NEXT ACTION:

بررسی وضعیت فعلی SEO implementation در Frontend و Backend و ساخت برنامه اجرایی بر اساس معماری موجود.


---

## Update 2026-09-23 — Actual Production Cookie State

Production read-only audit and database source-of-truth were reviewed.

### Current public / launch-ready products

The following products are currently public and launch-ready:

- `VIN-CW-001` — `cookie-chocolate-walnut`
- `VIN-CR-002` — `red-velvet-cookie`
- `VIN-CO-003` — `oreo-cookie`
- `VIN-CH-004` — `hazelnut-cookie-white-chocolate`
- `VIN-WP-027` — `protein-whey-cookie-winim`
- `VIN-CA-005` — `cookie-apple-cinnamon`
- `VIN-CS-006` — `cookie-snickers`
- `VIN-MV-008` — `mini-cookie-vanilla-chocolate-chip`

Apple Cinnamon and Snickers were intentionally given final images and activated manually by the owner. Do not treat them as pending-media products anymore.

### Current inactive / media-pending products

- `VIN-CC-007` — `cookie-crinkle`
- `VIN-VWC-028` — `vanilla-walnut-chocolate-chip-cookie`
- `VIN-MC-009` — `mini-cookie-chocolate-chip`
- `VIN-MR-010` — `mini-cookie-red-velvet`

These four still require final media verification and activation after content is finalized.

### Category public counts at audit time

- Homemade cookies: 7 launch-ready
- Mini cookies: 1 launch-ready

### Technical SEO acceptance already confirmed on Production

- Frontend HTTP 200
- Backend health OK
- Category SSR title/meta/canonical present
- Product SSR canonical present
- Product structured data present
- IRR offer currency present
- BreadcrumbList structured data present
- Dynamic sitemap contains launch-ready products only
- Both cookie categories are present in sitemap
- Cookie bulk discount is restricted to `kokyhay-khangy`, min 100, percent 10
- Mini cookies are not part of the 100-piece bulk discount

### Important Pack8 / pricing normalization work still required

The database audit revealed inconsistent Pack8 state across homemade cookies.

Observed examples:
- Some older Pack8 variants are inactive and still use `packaging_fee_toman=0`.
- Apple Cinnamon, Snickers and Crinkle have Pack8 variants with `packaging_fee_toman=100000`.
- Their current Pack8 pricing uses regular=`8 × single` and sale=`7 × single`, while a 100,000 Toman packaging fee is also configured.
- Apple Cinnamon, Snickers and Crinkle also currently show the 100,000 packaging fee on their single variants. This must be reviewed because the business requirement is a 100,000 Toman packaging fee for the 8-piece package, not an unsupported extra fee on one single cookie.
- Do not advertise a Pack8 discount until the effective checkout total is verified and the pricing policy is made transparent.
- Shared inventory between single and Pack8 remains a business/inventory concern and must not be faked with independent stock.

### Current full project scope

The new SEO program applies to the entire cookie vertical, not only newly activated products.

Scope:

1. 12 cookie / mini-cookie PDPs
2. Homemade cookie category
3. Mini-cookie category
4. Keyword ownership and cannibalization map
5. Final SEO title/meta/H1/copy/specifications/FAQ per product
6. Product-specific internal links
7. Image SEO for every product
8. Supporting article cluster
9. Category-to-product, article-to-category and article-to-product linking
10. Product / Offer / Breadcrumb / Collection structured-data validation
11. Canonical/indexability/sitemap/filter policy acceptance
12. Search Console submission and measurement
13. Content refresh plan
14. Safe Production rollout with backup and rollback

### Content rule

Do not reuse generic boilerplate between products.

Every PDP must be based on verified product facts and own the correct commercial search intent.

Unsupported claims such as `fresh`, texture claims, health claims, laboratory protein claims, or exact taste claims must not be invented.

### Next action

Before writing Production content V3, export all factual content fields for all 12 products from the Production database read-only:

- name
- slug
- product code
- short description
- long description
- ingredients
- allergens
- taste notes
- texture notes
- use cases
- serving suggestions
- specifications
- FAQs
- shelf life
- storage instructions
- preparation window
- shipping scope/note
- meta title/meta description
- content version
- variants / package quantities / prices / pack fee / stock

This export becomes the factual lock for the final 12-product SEO rewrite.

### Git workflow for this SEO wave

```text
FRONTEND_REPO=sajadkhavas/cooci
SOURCE_LOCK=d3eb2e669580a9ecba0f1339b6dc2df315739965
WORK_BRANCH=seo/cookie-authority-v3
DIRECT_MAIN_EDIT=NO
PRODUCTION_MUTATION_BEFORE_ACCEPTANCE=NO
```

