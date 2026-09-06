# F29S-I — SEO Measurement Plan

Status: **PRE-PRODUCTION PLAN COMPLETE / NO METRICS FABRICATED**

Site origin: `https://winimibakery.com`

## Boundary

این سند فقط قرارداد اندازه‌گیری را قبل از Production تعریف می‌کند. در این فاز هیچ داده Search Console، impression، click، CTR، position یا indexation ساختگی ثبت نمی‌شود. جمع‌آوری واقعی داده پس از مالکیت/دسترسی Search Console و Production در F31 انجام می‌شود.

## 1. Search Console property

پس از Production و در F31:

1. مالکیت property مربوط به `winimibakery.com` تأیید شود.
2. نوع property و روش verification همان چیزی ثبت شود که واقعاً در Search Console فعال شده است؛ این سند آن را حدس نمی‌زند.
3. تاریخ اولین baseline و timezone گزارش ثبت شود.
4. داده Performance به تفکیک `Page` و `Query` خوانده شود؛ مقادیر property-level با page-level مخلوط نشوند.

## 2. Sitemap submission plan

پس از فعال‌شدن Production:

- canonical sitemap سایت از endpoint واقعی Production بررسی شود.
- فقط URLهای canonical و indexable وارد sitemap باشند.
- URLهای filter/query، auth/account، cart/checkout و صفحات noindex نباید به‌عنوان SEO target وارد sitemap شوند.
- sitemap در Search Console ثبت و status/last read/error واقعی آن در F31 ثبت شود.
- Submit شدن sitemap به معنی تضمین crawl/index نیست و نباید به‌عنوان PASS indexation گزارش شود.

## 3. Representative URL Inspection set

حداقل این خانواده‌ها در URL Inspection بررسی می‌شوند؛ نمونه داینامیک فقط از URL واقعاً موجود Production انتخاب می‌شود:

| Family | Representative target | انتظار |
| --- | --- | --- |
| Home | `/` | indexable, self-canonical |
| Shop hub | `/products` | indexable, self-canonical |
| Category | `/products/category/cookies` + یک category واقعاً published دیگر | indexable فقط وقتی backend category واقعی/published است |
| Product | یک `/products/:slug` واقعی از sitemap | indexable و product truth backend-authoritative |
| Gift | `/gift` | indexable, commercial owner |
| Corporate | `/corporate` | indexable, B2B owner |
| Guide hub | `/blog` | فقط وقتی published content دارد |
| Guide | حداقل دو `/blog/:slug` واقعی از بسته F29S-D | published/indexable |
| Topic | یک `/blog/topic/:topic` واقعی | فقط topic دارای published posts |
| Trust | `/quality`, `/shipping`, `/about`, `/contact` | canonical و policy/content truth مطابق source |
| Legal | `/privacy`, `/terms` | canonical؛ SEO traffic target نیست |
| Conditional | `/reviews`, `/gallery`, `/locations`, `/city/:slug` | فقط طبق evidence و indexability policy خود route |

برای هر URL این فیلدها ثبت می‌شوند: inspection date، indexed verdict، user-declared canonical، Google-selected canonical، crawl status، robots status، rendered-content note و structured-data note در صورت وجود.

## 4. Query → Page measurement matrix

| Intent family | Owner URL/template | Query grouping | Guard |
| --- | --- | --- | --- |
| Brand / broad shop | `/` | Winimi + broad shop terms | category exact terms نباید primary Home شوند |
| Product browse | `/products` | محصولات وینیمی / browse | category transactional terms به category واگذار می‌شوند |
| Cookies | `/products/category/cookies` | خرید کوکی خانگی + semantic variants | Guide نگهداری/پذیرایی informational می‌ماند |
| Mini cookies | `/products/category/mini-cookies` | خرید مینی کوکی + پذیرایی commercial | Guide تعداد کوکی informational می‌ماند |
| Cakes / dessert | `/products/category/cakes` | خرید کیک و دسر | Guide نگهداری چیزکیک informational می‌ماند |
| Gift | `/gift` | باکس هدیه / هدیه خوراکی commercial | Guide انتخاب هدیه informational است |
| Corporate | `/corporate` | سفارش سازمانی / تعداد بالا | Guideها pre-purchase هستند |
| Guide | `/blog/:slug` | سؤال/راهنمای یکتای همان مقاله | exact commercial category ownership ممنوع |
| Local | `/city/:slug` | city modifier | HOLD مگر demand + delivery truth + unique value ثابت شود |

## 5. Baseline fields

در اولین بازه کامل قابل اعتماد F31 برای هر owner URL ثبت شود:

- Date range
- Clicks
- Impressions
- CTR
- Average position
- Top queries
- Indexed / not indexed state
- Canonical mismatch state
- Sitemap membership
- Notes on page/query cannibalization

Current values: **NOT COLLECTED — PRE-PRODUCTION**.

طبق تعریف Search Console، CTR برابر clicks ÷ impressions است و average position باید با توجه به aggregation و query/page context خوانده شود. Position به‌تنهایی KPI موفقیت نیست؛ trend کلی clicks و impressions نیز بررسی می‌شود.

## 6. Cannibalization review

برای هر query family که impression معنی‌دار ایجاد کرده است:

1. Query را در Performance filter کنید.
2. Pages را بررسی کنید.
3. URL owner تعریف‌شده در F29S-B را با URLهایی که واقعاً impression گرفته‌اند مقایسه کنید.
4. اگر یک intent ثابت بین چند URL نامرتبط پخش شده، قبل از هر rewrite علت را از title/H1/internal links/canonical/content overlap پیدا کنید.
5. مشابه‌بودن semantic queries به‌تنهایی cannibalization محسوب نمی‌شود؛ conflict باید در ownership واقعی دیده شود.

## 7. Cadence & refresh policy

- اولین 30 روز بعد از Production: review هفتگی برای indexation، canonical anomalies و query/page ownership.
- بعد از تثبیت داده: review ماهانه Performance و indexation.
- Content refresh خارج از تقویم ثابت فقط وقتی انجام شود که یکی از این triggerها رخ دهد: product/business truth تغییر کند، Search Console intent drift نشان دهد، content outdated شود، یا URL owner نیاز به رفع overlap داشته باشد.
- داده روز جاری/preliminary برای تصمیم قطعی baseline استفاده نشود.
- هر تغییر SEO ناشی از داده با before/after date range و URL owner ثبت شود.

## 8. Official references

- Google Search Console — Performance report: `https://support.google.com/webmasters/answer/7576553`
- Google Search Console — clicks, impressions, CTR and position definitions: `https://support.google.com/webmasters/answer/7042828`
- Google Search Console — URL Inspection: `https://support.google.com/webmasters/answer/9012289`
- Google Search Central — Build and submit a sitemap: `https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`

## Closure

F29S-I فقط زمانی PASS است که این plan در repository ثبت، Full Frontend CI روی exact head سبز و هیچ metric ساختگی یا Search Console action قبل از Production ادعا نشده باشد.

Deployment: **NO**  
Production mutation: **NO**  
Search Console mutation: **NO**
