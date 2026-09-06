# F29S-F — Product SEO Audit

تاریخ: ۲۰۲۶-۰۹-۰۶  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
Baseline: `5eb60b506eb8f1c6a861a5d910e4fb67c9c8a6e0`  
Branch: `phase-29s-f/product-seo-audit`  
Status: **IMPLEMENTED / AWAITING CI**

## هدف

Audit لایه SEO صفحات Product Detail و رفع ایرادهای سیستماتیک بدون دست‌کاری مستقیم داده Production. منبع حقیقت Product همچنان Laravel Backend است و Frontend فقط خروجی امن و canonical را render می‌کند.

## منابع حقیقت

### Backend contract
`BakeryProductResource` برای Product عمومی این داده‌ها را می‌دهد:

- `slug`, `name`, `productCode`
- توضیح کوتاه و توضیح بلند verified
- Category و Category slug
- price / sale price / stock / availability
- shipping/cooling policy
- ingredients / allergens / shelf-life / storage فقط در مرز verified content
- تصاویر و `alt`
- `contentVerified`, `mediaVerified`, `inventoryVerified`
- Variantها
- `seo.title` و `seo.description`

Product schema در Frontend از loader authoritative ساخته می‌شود؛ review/rating/availability ساختگی از Page component پذیرفته نمی‌شود.

### Live storefront snapshot
در زمان Audit، `/products` شمارش **۱۱ محصول public** را نشان می‌داد. سطح قابل مشاهده crawler این محصولات را صریحاً برگرداند:

- `VIN-CW-001` — کوکی شکلاتی گردویی
- `VIN-CR-002` — کوکی ردولوت
- `VIN-CO-003` — کوکی اورئو
- `VIN-CH-004` — کوکی فندقی با مغزی شکلات سفید
- `VIN-CA-005` — کوکی سیب دارچین
- `VIN-CS-006` — کوکی اسنیکرز
- `VIN-SS-015` — چیزکیک سن سباستین
- `VIN-PC-016` — چیزکیک انار تک‌نفره
- `VIN-CK-017` — چیزکیک توت‌فرنگی
- `VIN-TS-018` — تیرامیسو تک‌نفره

Crawler excerpt نام Product یازدهم را در خروجی قابل استناد نمایش نداد؛ بنابراین این سند نام آن را حدس نمی‌زند. Count عمومی ۱۱ است، اما فهرست نام‌دار بالا فقط مواردی است که evidence سطح live صریحاً نمایش داده است.

## Finding 1 — Duplicate brand suffix در Product Title

صفحه live نمونه `/products/cookie-chocolate-walnut` در snapshot crawler با Title زیر دیده شد:

`خرید کوکی شکلاتی گردویی ۷۰ گرمی | وینیمی بیکری | وینیمی بیکری`

H1 همان Product واقعی یعنی `کوکی شکلاتی گردویی` بود و محتوای محصول، قیمت، موجودی، مواد تشکیل‌دهنده، آلرژن، ماندگاری و نگهداری از داده Product نمایش داده می‌شد.

### Root cause boundary

- `entry.server.tsx` هیچ brand suffix اضافه نمی‌کند.
- `server.runtime.mjs` هیچ title rewrite انجام نمی‌دهد.
- `root.tsx` فقط metadata سراسری غیر-Title را می‌دهد.
- `ProductDetailPage` مقدار `product.seo.title ?? product.name` را به `SEO` می‌دهد.
- resolver قبلی اگر Title **شامل** brand بود آن را همان‌طور برمی‌گرداند؛ بنابراین upstream Title دارای دو suffix را sanitize نمی‌کرد.

### Repair

`resolveMetaTitle` اکنون trailing sequenceهای تکراری `| وینیمی بیکری` را به یک suffix canonical تبدیل می‌کند.

این رفتار idempotent است:

- بدون brand → یک brand اضافه می‌شود.
- یک trailing brand → همان یک brand باقی می‌ماند.
- دو یا چند trailing brand → به یک brand collapse می‌شود.
- Title طبیعی که brand را در متن دارد، مثل `درباره وینیمی بیکری`، rewrite نمی‌شود.

## Product template SEO contract

بررسی Template نشان داد:

1. **H1** از `product.name` واقعی می‌آید.
2. **Title** از Backend SEO title و سپس Product name fallback می‌آید و اکنون brand duplication را normalize می‌کند.
3. **Description** از Backend SEO description یا public Product description می‌آید.
4. **Canonical** از Product pathname ساخته می‌شود و filter/query ownership به این Template تزریق نمی‌شود.
5. **Product JSON-LD** از authoritative loader data ساخته می‌شود.
6. **Offer price / currency / availability** از Product/Variant truth می‌آید.
7. **Review / aggregateRating** فقط وقتی داده تأییدشده وجود داشته باشد مجاز است؛ synthetic rating ممنوع است.
8. **Breadcrumb** به Category crawlable منتشرشده متصل است.
9. **Media alt** از Backend media metadata و در نبود آن از نام Product fallback می‌آید.
10. **Ingredients / allergens / shelf-life / storage** فقط در مرز `contentVerified` عمومی می‌شوند.

## Keyword ownership

Product URL مالک exact Product intent است. Primary Category keyword به همه Productها تزریق نمی‌شود. مثال:

- `/products/cookie-chocolate-walnut` → exact product intent
- Category cookie landing → مالک `خرید کوکی خانگی`
- `/products` → مالک browse/store intent

این مرزبندی از cannibalization میان Product، Category و Store جلوگیری می‌کند.

## Gates اضافه‌شده

### Unit
`tests/unit/meta-title.test.ts`

- brand دقیقاً یک بار اضافه شود.
- backend title از قبل branded دوباره branded نشود.
- repeated trailing brand suffix به یک suffix collapse شود.
- whitespace variant نیز collapse شود.
- managed title حاوی نام برند تغییر نکند.

### SSR / Merchant SEO
`e2e/phase10-5-product-merchant-seo.spec.mjs`

Product SSR باید نام `وینیمی بیکری` را دقیقاً یک بار در `<title>` داشته باشد و الگوی duplicate brand را رد کند. Gateهای قبلی Product Offer، نبود policy ساختگی، نبود rating ساختگی و Breadcrumb crawlable نیز حفظ شدند.

## مواردی که عمداً در F تغییر نکردند

- Production database
- Product price / stock
- مواد تشکیل‌دهنده یا آلرژن
- shelf-life / storage
- Product media
- Shipping policy
- Category publication state
- review/rating data

هرگونه اصلاح خود داده تجاری باید از Backend authoritative و فرایند verified content انجام شود، نه از Frontend SEO patch.

## F29S-G handoff finding

در audit live مشخص شد بعضی Managed Contentهای trust/policy هنوز متن قدیمی «پرداخت آنلاین فعال نیست» را نمایش می‌دهند، در حالی که Surfaceهای فروشگاه مسیر درگاه بانکی و حساب کاربری را فعال نشان می‌دهند. این mismatch خارج از scope Product SEO است و به **F29S-G — Local / Merchant / Trust Content** منتقل می‌شود.

## Acceptance state

- Product SEO ownership: PASS
- Product template backend authority: PASS
- Duplicate brand root cause: REPAIRED IN CANDIDATE
- Unit regression guard: ADDED
- SSR regression guard: ADDED
- Synthetic review/rating protection: PRESERVED
- Product structured data contract: PRESERVED
- Production DB mutation: NONE

## Mutation state

`COMMIT_CREATED=YES`  
`PUSH_PERFORMED=YES`  
`DEPLOY_PERFORMED=NO`  
`PRODUCTION_MUTATION=NO`

## NEXT

`RUN_EXACT_HEAD_FRONTEND_CI_THEN_MERGE_AND_REGISTER_F29S_F`
