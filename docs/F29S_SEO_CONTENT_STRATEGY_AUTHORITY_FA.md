# F29S — SEO Content Strategy & Topical Authority

تاریخ ثبت: ۲۰۲۶-۰۹-۰۵  
Project: **WINIMI / COOCI**  
Repository: `sajadkhavas/cooci`  
Status: **REGISTERED / NEXT**

> این فاز Phase 28 را باز نمی‌کند. Phase 28 — SEO Route Architecture همچنان `COMPLETED / MERGED / REGISTERED` است. F29S لایه‌ی Content SEO، Keyword Intelligence و Topical Authority را قبل از Google Login و قبل از Release نهایی تکمیل می‌کند.

## چرا این فاز اضافه شد

Phase 28 زیرساخت فنی SEO را بست: SSR، sitemap/robots، canonical، indexability، route policy، schema، internal-link safety و release-candidate acceptance. اما چند بخش مهم SEO هنوز به سطح تحویل نهایی نرسیده‌اند:

- Keyword Research بازار فارسی/ایران به‌صورت داده‌محور انجام نشده است.
- `/blog` در UI با نام «راهنماها» وجود دارد، اما محتوای واقعی منتشرشده و Topic Cluster کامل ندارد.
- کارت‌های راهنمای Home مانند «چطور برای هدیه انتخاب کنیم؟»، «شرایط نگهداری» و «برای پذیرایی چه تعداد مناسب است؟» فعلاً به `/blog` عمومی می‌روند و مقاله اختصاصی ندارند.
- Topic hub و related-post architecture وجود دارد ولی Authority محتوایی واقعی هنوز ساخته نشده است.
- Category/Product/Gift/Corporate/Local targets هنوز Keyword Map نهایی مبتنی بر Intent/رقابت/تقاضای واقعی ندارند.
- Local SEO، Review/UGC، FAQ strategy و Merchant/Entity content هنوز نیازمند تصمیم و محتوای واقعی‌اند.

## اصل حقیقت

1. هیچ صفحه، شهر، review، rating، FAQ، claim، ترکیب، مزیت پزشکی، زمان ارسال یا سیاست فروش ساختگی فقط برای SEO منتشر نمی‌شود.
2. Keyword stuffing، doorway pages و تولید انبوه صفحه کم‌ارزش ممنوع است.
3. هر URL جدید باید Intent یکتا، ارزش کاربری مستقل و عدم Cannibalization داشته باشد.
4. داده محصول/قیمت/موجودی/ارسال/آلرژن از Backend authoritative می‌آید.
5. محتوا باید People-first باشد؛ هدف فاز ساخت تقاضای ارگانیک پایدار است، نه صرفاً افزایش تعداد URL.

# Scope اجرایی

## F29S-A — Keyword Intelligence

برای بازار واقعی فارسی:

- ساخت Keyword Universe اولیه برای:
  - کوکی
  - مینی کوکی
  - کیک و دسر
  - چیزکیک
  - رول و کروسان
  - محصولات رژیمی / بدون قند افزوده
  - باکس هدیه
  - پذیرایی
  - هدیه سازمانی / سفارش سازمانی
  - نگهداری / ماندگاری / ارسال سرد
  - Local intentهای واقعی در محدوده خدمات
- تفکیک Intent:
  - Transactional
  - Commercial investigation
  - Informational
  - Local
  - Navigational / Brand
- استخراج Secondary و Long-tail queryها.
- ثبت SERP/رقبا برای queryهای اولویت‌دار.
- ثبت evidence و تاریخ تحقیق.

### خروجی

`Keyword -> Intent -> Target URL -> Parent Cluster -> Priority -> Evidence -> Cannibalization Risk`

## F29S-B — Keyword-to-URL Map

تمام صفحات indexable فعلی و URLهای پیشنهادی باید Map شوند:

- `/`
- `/products`
- category routes
- product detail routes
- `/gift`
- `/corporate`
- `/blog`
- `/blog/topic/:topic`
- guide/article routes
- `/faq`
- `/about`
- `/quality`
- `/shipping`
- `/contact`
- `/reviews`
- `/locations` و city routes فقط در صورت داده واقعی

برای هر صفحه:

- Primary keyword
- Secondary keywords
- Search intent
- Title direction
- H1 direction
- Content angle
- Internal-link anchors
- competing/cannibalizing URLs
- indexability decision

## F29S-C — Content Architecture / Topic Clusters

Topic taxonomy باید از محتوای واقعی و Keyword Research استخراج شود، نه از حدس.

حداقل Clusterهای کاندید برای ارزیابی:

1. راهنمای انتخاب و خرید کوکی
2. راهنمای هدیه و باکس هدیه
3. راهنمای پذیرایی و تعداد سفارش
4. نگهداری، ماندگاری و ارسال محصولات
5. کیک/چیزکیک و محصولات نیازمند سرمایش
6. رژیمی و بدون قند افزوده با مرزبندی دقیق اطلاعات پزشکی
7. سفارش سازمانی و پذیرایی سازمانی

برای هر Cluster:

- Pillar/Hub
- Supporting guides
- Commercial destination pages
- Product/category destinations
- Internal linking graph
- عدم Cannibalization

## F29S-D — Guide / Article Foundation

زیرساخت فعلی `/blog`, `/blog/topic/:topic`, `/blog/:slug` باید با محتوای واقعی فعال شود.

الزام‌ها:

- هر مقاله از Backend/CMS منتشر شود.
- SSR اولیه شامل متن اصلی باشد.
- Title/description/H1 یکتا.
- Published date و author واقعی/قابل دفاع.
- Article/BlogPosting schema مطابق متن قابل مشاهده.
- Breadcrumb و topic link.
- Related guides فقط از مقاله‌های منتشرشده.
- Internal links طبیعی به Category/Product/Gift/Corporate در صورت ارتباط واقعی.
- تصاویر دارای alt و ابعاد مشخص.
- CTA محتوایی، نه keyword stuffing.

### Acceptance ویژه Home

سه کارت فعلی Editorial Guides در Home نباید در نسخه نهایی همگی به `/blog` عمومی اشاره کنند. هر کارت منتشرشده باید به **راهنمای واقعی و اختصاصی** یا Hub مرتبط و دارای محتوای واقعی متصل شود.

### حداقل Content Gate

تعداد مقاله با Keyword Research تعیین می‌شود و quota مصنوعی نداریم؛ اما فاز بدون موارد زیر بسته نمی‌شود:

- حداقل یک Topic Cluster اولویت‌دار به‌صورت واقعی فعال باشد؛
- Hub/Topic آن دارای محتوای منتشرشده باشد؛
- Supporting guideهای لازم برای پوشش Intent اصلی آن Cluster منتشر شده باشند؛
- Home guide cards به مقصد اختصاصی معتبر برسند؛
- هیچ article/topic ساختگی یا empty-indexable وجود نداشته باشد.

## F29S-E — Commercial Content SEO

بازنگری On-page برای صفحات پول‌ساز براساس Keyword Map واقعی:

- Home
- All Products
- Category landing pages
- Gift
- Corporate
- Product detail template + محصولات منتشرشده

برای هرکدام:

- Title
- Meta description
- H1/H2
- Intro/decision-support copy
- FAQ فقط در صورت داده واقعی
- Internal links
- Schema alignment
- Image alt
- CTR intent
- Cannibalization

## F29S-F — Product SEO Audit

برای محصولات واقعی منتشرشده:

- نام محصول و query intent
- SEO title/description Backend
- description quality
- ingredients/allergens/storage فقط در صورت verified data
- Product/Offer schema
- SKU/price/availability truth
- images/alt
- related links
- duplicate/thin content

محصول منتشرنشده یا داده جعلی برای افزایش URL ممنوع است.

## F29S-G — Local / Merchant / Trust Content

### Local

فقط اگر محدوده خدمات واقعی و قابل اثبات باشد:

- Keyword research شهر/منطقه
- تصمیم درباره نیاز واقعی به city landing page
- محتوای یکتا براساس delivery truth
- عدم ساخت doorway city pages

### Merchant / Trust

بازبینی محتوای واقعی:

- Shipping
- Return/refund policy در صورت وجود سیاست تأییدشده
- About / Brand entity
- Quality / ingredients / allergen truth
- Contact / NAP consistency
- FAQ strategy
- Reviews/UGC policy

## F29S-H — Internal Linking & Information Architecture

- Home -> commercial pages
- Home -> real guides
- Guide -> relevant category/product
- Category -> relevant guide
- Product -> relevant guide در صورت کاربرد
- Guide -> Guide within same topic
- Topic hub -> supporting articles
- Related content بدون لینک 404/5xx
- Anchor text طبیعی و متنوع

## F29S-I — Measurement Plan

قبل از Production:

- Search Console mapping
- sitemap submission plan
- representative URL inspection set
- query/page measurement matrix
- CTR/ranking/indexation baseline fields
- content refresh policy

داده واقعی Search Console بعد از Production/ownership در Phase 19B/F31 ثبت می‌شود.

## F29S-J — QA / Closure

هر URL جدید یا اصلاح‌شده باید Gateهای زیر را پاس کند:

- Search intent + keyword mapping documented
- unique title/description
- exactly one H1
- SSR main content
- canonical/robots correct
- real 200/301/404 status
- structured data valid and evidence-safe
- internal links valid
- no cannibalization conflict unresolved
- mobile/accessibility/performance checks
- sitemap policy correct
- crawl acceptance
- CI green
- PR/Merge/Register

# خارج از Scope

- Google Login/Auth implementation: F29
- closing stack to `main`: F30
- VPS final deployment: Phase 19B
- external credential activation: Phase 20
- Search Console post-launch measurement and final handoff evidence: F31

# Gate پایان F29S

فاز فقط زمانی `COMPLETED` است که:

1. Keyword Intelligence و Keyword-to-URL Map ثبت شده باشد.
2. Topic Cluster architecture نهایی شده باشد.
3. حداقل یک Cluster اولویت‌دار با راهنماهای واقعی و مقصدهای اختصاصی فعال شده باشد.
4. Home Editorial Guides دیگر به placeholder عمومی ختم نشوند.
5. Commercial page targets براساس تحقیق بازبینی شده باشند.
6. Product SEO audit برای کاتالوگ منتشرشده انجام شده باشد.
7. Local/Merchant/Trust decisions ثبت شده باشند.
8. Internal-link graph و no-cannibalization gate PASS باشد.
9. Crawl/SSR/SEO/CI acceptance سبز باشد.
10. PR Merge و Phase Registration انجام شده باشد.

## CURRENT_NEXT_ACTION داخل F29S

`F29S-A — Keyword Intelligence & Competitor/SERP Research`

پس از پایان F29S، پروژه به `F29 — Google Login & Auth Closure` می‌رود.
