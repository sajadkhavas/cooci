# F29S-H — Internal Linking & Information Architecture

Status: **IMPLEMENTED / READY FOR EXACT-HEAD GATE**

## هدف

ایجاد مسیرهای داخلی طبیعی و قابل crawl بین صفحات تجاری، دسته‌ها و راهنماهای واقعی، بدون ساخت صفحه یا ادعای محتوایی جدید و بدون وابستگی به داده‌های ساختگی.

## قرارداد پذیرفته‌شده

| جهت لینک | وضعیت | شواهد / تصمیم |
| --- | --- | --- |
| Home → Guide | PASS | کارت‌های `EditorialGuides` به سه Guide canonical واقعی می‌روند: هدیه، نگهداری کوکی، تعداد کوکی برای پذیرایی. |
| Home → Commercial | PASS | مسیرهای تجاری اصلی در IA موجود و از Home/navigation قابل دسترسی‌اند؛ این فاز مقصد جدید تجاری نمی‌سازد. |
| Guide → Commercial / Category | PASS | Manifest کنترل‌شده Backend برای Guide هدیه به `/gift` و `/corporate` و برای Guide پذیرایی/نگهداری به دسته‌های canonical مرتبط لینک contextual دارد. |
| Guide → Topic | PASS | `BlogDetailPage` موضوع Guide را با `getContentTopicPath` به topic hub متصل می‌کند. |
| Guide → Guide | PASS | `relatedPosts` فقط محتوای مرتبط منتشرشده را با `BlogPostCard` نمایش می‌دهد. |
| Topic → supporting guides | PASS | Topic page معماری supporting article را از content topic taxonomy دریافت می‌کند. |
| Category → Guide | **ADDED IN H** | `CategoryGuideLinks` برای `cookies`، `mini-cookies` و `cakes` لینک‌های contextual و canonical به Guideهای واقعی اضافه می‌کند. |
| Product → Guide | CONDITIONAL / NO GENERIC LINK | تا وقتی Backend رابطه معنایی معتبر Product↔Guide ارائه نکند، لینک عمومی/حدسی به هر محصول تزریق نمی‌شود. Product از category و مسیرهای فروشگاهی واقعی استفاده می‌کند؛ این تصمیم از لینک نامرتبط و keyword stuffing جلوگیری می‌کند. |

## مقصدهای Category → Guide

- `/products/category/cookies` → `/blog/cookie-storage-guide`
- `/products/category/cookies` → `/blog/cookies-per-guest-guide`
- `/products/category/mini-cookies` → `/blog/cookies-per-guest-guide`
- `/products/category/cakes` → `/blog/cheesecake-cold-storage`

این مقصدها به Route داینامیک canonical `/blog/:slug` متصل می‌شوند و slugهای Guide از manifest کنترل‌شده F29S-D می‌آیند. وجود Guide و قرارداد محتوایی آن‌ها در Backend Gateهای همان فاز قفل شده است.

## قواعد Anchor و Truth

- Anchor باید معنای مقصد را توصیف کند؛ از «اینجا کلیک کنید» یا تکرار مصنوعی keyword استفاده نمی‌شود.
- لینک دسته فقط جایی اضافه می‌شود که Guide واقعاً برای intent آن دسته مرتبط باشد.
- متن کنار لینک صراحتاً می‌گوید Guide جایگزین قیمت، موجودی، ترکیبات و نگهداری تأییدشده Product نیست.
- برای `diet-diabetic` هیچ Guide نامرتبط یا پزشکی صرفاً برای تکمیل ماتریس ساخته/لینک نشده است.
- برای Product سطح item نیز تا وجود relation قابل اثبات، لینک حدسی اضافه نمی‌شود.

## QA Contract

`tests/unit/f29s-internal-linking.test.ts` موارد زیر را lock می‌کند:

1. canonical category route واقعاً `CategoryGuideLinks` را render می‌کند.
2. مقصدهای Guide دسته‌ها دقیق و canonical هستند.
3. Home به Guideهای اختصاصی لینک دارد، نه فقط `/blog`.
4. Guide detail مسیر Topic و Related Guide را نگه می‌دارد.
5. مرز backend-authoritative operational truth در UI لینک‌های contextual حفظ می‌شود.

علاوه بر این، Full Frontend CI باید lint، typecheck، unit tests، build و auditهای SEO/crawl موجود را روی exact head عبور دهد.

## منبع اصول

این اجرا با راهنمای Google Search Central درباره crawlable links و anchor text توصیفی هم‌راستا است: لینک‌های داخلی باید مقصد قابل crawl داشته باشند و متن لینک به درک صفحه مقصد کمک کند. هیچ PageRank sculpting، doorway page یا anchor stuffing در این فاز انجام نشده است.

## Production Boundary

- Deployment: **NO**
- Production content mutation: **NO**
- Backend DB mutation: **NO**
- Scope: source + automated QA + documentation only
