# ماتریس پذیرش Route و SEO وینیمی

تاریخ ممیزی: ۲۰۲۶-۰۸-۳۱ UTC  
Branch فاز: `phase-28/seo-route-architecture`  
Baseline source فعال Production: `d9e44edc13c24427c2f4741b19ac4db98f257160`  
Baseline مستندات GitHub: `a006b5d4993ae6c690786c2c7a528cd1536317ba`

## شواهد پایه

- Storefront، Backend health و Backend ready همگی HTTP 200 بودند.
- 404 واقعی برای مسیر ناموجود تأیید شد.
- `robots.txt` و `sitemap.xml` هر دو HTTP 200 هستند.
- Sitemap فعلی ۳۰ URL دارد.
- Backend فعلی ۱۱ محصول منتشرشده و صفر مقاله منتشرشده برمی‌گرداند.
- Home و Products در SSR دارای Title، Description، Canonical، یک H1 و JSON-LD هستند.
- صفحات خصوصی در Source و Production دارای `noindex,nofollow` هستند.

## طبقه‌بندی Routeها

| Route / Template | سیاست نهایی | وضعیت فعلی | اقدام لازم |
|---|---|---|---|
| `/` | Index | پایه سالم | تکمیل محتوای On-page، Entity، Internal links و Schema acceptance |
| `/products` | Index | پایه سالم | Title/Description هدفمند، متن دسته مادر و Pagination acceptance |
| `/products/category/:slug` | Index فقط برای دسته فعال | پایه سالم | Keyword map، محتوای یکتا، Breadcrumb و جلوگیری از دسته کم‌محتوا |
| `/products/:slug` | Index فقط برای محصول منتشرشده | پایه سالم با Title تکراری | حذف تکرار برند، Product/Offer validation و محتوای یکتا |
| `/blog` | Conditional | Indexable با صفر مقاله | تا وجود مقاله واقعی از Sitemap حذف و `noindex,follow` شود |
| `/blog/topic/:topic` | Conditional | وابسته به مقاله | فقط Topic دارای مقاله منتشرشده Index شود؛ در غیر این صورت 404 یا noindex |
| `/blog/:slug` | Index فقط برای مقاله منتشرشده | داده فعلی ندارد | Article/Breadcrumb/author/date و 404 واقعی |
| `/locations` | Conditional | اکنون 404 و noindex صحیح | فقط با City page واقعی و اطلاعات قابل اثبات منتشر شود |
| `/city/:slug` | Conditional | نمونه اندیشه 404 و noindex صحیح | LocalBusiness فقط با داده واقعی؛ شهر جعلی ممنوع |
| `/gift` | Index | پایه SSR سالم | تحقیق Intent، محتوای یکتا، لینک محصول واقعی و Schema مناسب |
| `/corporate` | Index | پایه SSR سالم | B2B intent، FAQ واقعی و Conversion tracking |
| `/reviews` | Conditional | Indexable | اگر Review واقعی کافی وجود ندارد noindex و خروج از Sitemap؛ Schema فقط SSR و معتبر |
| `/quality` | Index | Title دارای تکرار برند | اصلاح Title و تکمیل محتوای نگهداری/آلرژن واقعی |
| `/about` | Index | Title دارای تکرار برند | اصلاح Title و Entity/Organization truth audit |
| `/gallery` | Conditional | Indexable و JSON-LD محدود | براساس رسانه واقعی؛ Empty state نباید Index شود |
| `/faq` | Index مشروط به FAQ واقعی | پایه سالم | FAQ schema فقط مطابق متن قابل مشاهده و داده واقعی |
| `/contact` | Index | پایه سالم | NAP consistency و اطلاعات واقعی کارفرما |
| `/privacy` | Index | Title دارای تکرار برند | اصلاح Title؛ محتوای حقوقی تأییدشده |
| `/terms` | Index | Title دارای تکرار برند | اصلاح Title؛ محتوای حقوقی تأییدشده |
| `/shipping` | Index | Title دارای تکرار برند | اصلاح Title؛ محدوده و شرایط ارسال فقط با داده واقعی |
| `/categories` | Redirect 301 | پیاده‌سازی شده | حفظ Redirect به `/products` و نبودن در Sitemap |
| `/cart` | Noindex/Nofollow | صحیح | حفظ خارج از Sitemap؛ Canonical و Title موجود |
| `/checkout` | Noindex/Nofollow | Robots صحیح، SSR ناقص | Title، Canonical و H1/Loading SSR قابل‌دسترس |
| `/payment/mock` | 404 در Production | Source guard موجود | حفظ و آزمون Release gate |
| `/payment/callback` | Noindex/Nofollow | صحیح | حفظ خارج از Sitemap و جلوگیری از پارامترهای قابل Index |
| `/account/login` | Noindex/Nofollow | Robots صحیح، SSR ناقص | Title، Canonical و H1/Loading SSR؛ بعداً Google Login |
| `/account` | Noindex/Nofollow | Robots صحیح، SSR ناقص | Title، Canonical و Shell SSR قابل‌دسترس |
| `/account/orders/:orderId` | Noindex/Nofollow | Source policy صحیح | مالکیت/IDOR و نبود داده سفارش در HTML عمومی |
| `*` | 404 + Noindex | صحیح | حفظ Status واقعی 404، بدون Soft 404 |

## ایرادهای قطعی SEO-1

1. جلوگیری از دوبار افزوده‌شدن نام برند در Title صفحات Product و Managed content.
2. Blog hub با صفر مقاله نباید Indexable یا عضو Sitemap باشد.
3. Reviews و Gallery باید سیاست Index/Sitemap شرطی بر اساس محتوای واقعی داشته باشند.
4. Checkout، Login و Account باید با وجود noindex، SSR metadata و Page shell کامل داشته باشند.
5. Query/filterها باید `noindex,follow` و Canonical تمیز داشته باشند؛ Pagination معتبر باید self-canonical بماند.
6. Sitemap باید فقط URLهای 200، canonical، published و indexable را وارد کند.
7. Schema هر صفحه باید با محتوای قابل مشاهده و داده Backend منطبق باشد.

## Gate هر صفحه در Redesign + SEO

هر صفحه فقط وقتی بسته می‌شود که موارد زیر PASS باشند:

- هدف تجاری، Search intent و Keyword mapping یکتا
- Title و Meta description یکتا و بدون تکرار برند
- دقیقاً یک H1 و ساختار H2/H3 منطقی
- Canonical صحیح و Robots مطابق همین ماتریس
- SSR واقعی برای متن، Heading و Linkهای اصلی
- Breadcrumb قابل مشاهده و BreadcrumbList معتبر در صفحات لازم
- Schema منطبق با داده واقعی و بدون ادعای ساختگی
- Internal linking به Parent/Child/Related routes
- Image alt، width/height، format و loading policy
- 200/301/404 واقعی و نبود Soft 404
- Mobile، Accessibility و Core Web Vitals
- عدم Cannibalization با صفحات دیگر
- تست Candidate و Production acceptance

## ترتیب اجرای پیشنهادشده

1. `SEO-1`: اصلاح سیاست Title، Blog/Reviews/Gallery و SSR صفحات خصوصی
2. `SEO-2`: صفحه `/products` همراه Redesign و SEO
3. `SEO-3`: Template دسته‌بندی
4. `SEO-4`: Template محصول
5. `SEO-5`: Blog hub، Topic و Article پس از ورود محتوای واقعی
6. `SEO-6`: Gift، Corporate، FAQ، About، Contact و Policyها
7. `SEO-7`: Sitemap، Robots، Redirect و Schema سراسری نهایی
8. `SEO-8`: Performance، Accessibility، Crawl و Production acceptance

## محدودیت‌های حقیقت

- تعداد فعلی محصولات منتشرشده API برابر ۱۱ است؛ محصول منتشرنشده نباید در Sitemap جعل شود.
- تعداد فعلی مقاله منتشرشده صفر است؛ مقاله یا Topic ساختگی ممنوع است.
- صفحات شهر فقط پس از انتشار داده واقعی و قابل اثبات Index می‌شوند.
- Review، Rating، Offer، Availability، LocalBusiness و FAQ schema فقط از داده واقعی ساخته شوند.
- رتبه یک تضمین نمی‌شود؛ تعهد فاز، اجرای Scope و Gateهای قابل سنجش است.

## NEXT

`SEO-1 — Technical Indexability, Metadata and Conditional Sitemap Closure`
