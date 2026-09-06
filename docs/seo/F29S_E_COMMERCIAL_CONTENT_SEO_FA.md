# F29S-E — Commercial Content SEO

تاریخ: ۲۰۲۶-۰۹-۰۵  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
Baseline: `263ee90c82436f57774c5824c00295a8b1c2cb14`  
Branch: `phase-29s-e/commercial-content-seo`  
Status: **IMPLEMENTED / AWAITING CI**

## هدف

هم‌راستا کردن On-page SEO صفحات پول‌ساز با Keyword-to-URL Map فاز F29S-B، بدون ایجاد ادعای ساختگی، تصاحب Intent مقاله‌ها یا تغییر سیاست Indexability فاز 28.

## تصمیم معماری

برای URLهای ثابت پول‌ساز، مالکیت Title/Description در `src/lib/seo/commercial-content.ts` ثبت شد و `SEO.tsx` فقط برای همان pathnameهای دقیق از این registry استفاده می‌کند:

- `/`
- `/products`
- `/gift`
- `/corporate`

Category، Product Detail، Blog و صفحات Managed Content عمداً وارد این override نشده‌اند تا داده Backend/editorial همچنان منبع حقیقت آن‌ها بماند.

## ماتریس بازبینی

| URL | Intent owner | Title direction | H1 / body decision | نتیجه |
|---|---|---|---|---|
| `/` | فروشگاه آنلاین وینیمی / خرید آنلاین کوکی، کیک و باکس هدیه | `خرید کوکی، کیک و باکس هدیه | وینیمی بیکری` | H1 فعلی broad و برندمحور باقی ماند؛ exact category keyword تصاحب نشد | PASS |
| `/products` | محصولات وینیمی / فروشگاه محصولات وینیمی | `محصولات وینیمی | کوکی، کیک، دسر و شیرینی` | H1 فعلی «محصولات وینیمی» همان browse intent را حفظ می‌کند؛ category primary به این صفحه منتقل نشد | PASS |
| `/gift` | باکس هدیه کوکی و شیرینی | `باکس هدیه کوکی و شیرینی | وینیمی` | H1 «هدیه‌ای متناسب با مناسبت شما» و فرم استعلام حفظ شد؛ اجرای کارت/بسته‌بندی قطعی ادعا نمی‌شود | PASS |
| `/corporate` | هدیه و پذیرایی سازمانی | `هدیه و پذیرایی سازمانی | استعلام سفارش وینیمی` | H1 از قبل «استعلام هدیه و پذیرایی سازمانی» بود؛ لوگو/تخفیف/فاکتور فقط پس از تأیید کتبی معتبر است | PASS |

## Category landing pages

بررسی `src/data/categoriesContent.ts` نشان داد ownership اصلی Categoryها از قبل با F29S-B همسو است:

- `cookies` → خرید کوکی خانگی
- `mini-cookies` → خرید مینی کوکی
- `cakes` → خرید کیک و دسر
- `cheesecakes` → خرید چیزکیک؛ recipe intent ممنوع
- `pastry` → خرید رول و کروسان
- `diet-diabetic` → کوکی رژیمی و بدون قند افزوده با مرزبندی پزشکی

Indexability همچنان به انتشار Category در Backend وابسته است. `gift-boxes` با `productCategorySlug=gift` تا وقتی Backend چنین Category منتشرشده‌ای ندارد، هدف indexable مستقل نیست و `/gift` مالک intent تجاری هدیه می‌ماند.

## Product Detail template

قالب `/products/:slug` در همین فاز audit شد و نیاز به override تجاری جدید نداشت:

- Title ابتدا از `product.seo.title` معتبر Backend و سپس نام واقعی محصول می‌آید.
- H1 نام واقعی محصول است.
- Description از SEO Backend یا description قابل‌نمایش محصول می‌آید.
- Product schema در `SEO.tsx` از loader authoritative ساخته می‌شود و داده جعلی review/rating/availability پذیرفته نمی‌شود.
- Ingredients / allergens / shelf-life / storage فقط از داده verified نمایش داده می‌شوند.
- category exact keyword به‌صورت primary روی همه Productها تزریق نشد.

بازبینی تک‌تک محصولات منتشرشده و کیفیت metadata آن‌ها در **F29S-F — Product SEO Audit** انجام می‌شود.

## Shipping / Managed Content

`/shipping` عمداً در registry تجاری ثابت override نشد. این صفحه از `ManagedContentPage` و Backend authoritative می‌آید و بازبینی policy/service truth آن در **F29S-G — Local / Merchant / Trust Content** انجام می‌شود.

## Cannibalization guards

1. `/products` مالک «محصولات وینیمی» است و `خرید کوکی خانگی` را نمی‌گیرد.
2. `/gift` مالک intent تجاری هدیه است؛ `/blog/choose-food-gift-box` informational باقی می‌ماند.
3. `/corporate` مالک conversion intent سازمانی است؛ guideهای B2B فقط pre-purchase/informational خواهند بود.
4. Dynamic category/product URLs توسط registry ثابت override نمی‌شوند.
5. Filter/query URLها همچنان از URL policy فاز 28 پیروی می‌کنند.

## Acceptance

- Commercial registry exact-path only
- چهار Title یکتا
- Meta descriptionهای evidence-safe و substantial
- عدم capture شدن Blog / Category / Product / Shipping
- Product template backend-authoritative
- Category ownership مطابق F29S-B
- هیچ تغییر Production

## Mutation state

`COMMIT_CREATED=YES`  
`PUSH_PERFORMED=YES`  
`DEPLOY_PERFORMED=NO`  
`PRODUCTION_MUTATION=NO`

## NEXT

`RUN_EXACT_HEAD_FRONTEND_CI_THEN_MERGE_AND_REGISTER_F29S_E`
