# سند مرجع زنده پروژه وینیمی

آخرین به‌روزرسانی: ۲۰۲۶-۰۸-۲۹ (UTC)
وضعیت: مرجع ادامه کار بین چت‌ها  
زبان: فارسی / RTL

> شروع سریع در چت جدید: «فایل `docs/WINIMI_LIVING_HANDOFF_FA.md` را کامل بخوان، وضعیت Git و Production را فقط‌خواندنی دوباره تأیید کن و از `CURRENT_NEXT_ACTION` ادامه بده.»

## 1) خلاصه اجرایی و موقعیت فعلی

- فروشگاه آنلاین است و فرانت‌اند و بک‌اند واقعی به هم متصل‌اند.
- مشکل دائمی تصاویر بسته شده: Nginx رسانه را مستقیم از Shared Storage تحویل می‌دهد و به symlink داخل Release وابسته نیست.
- Production فرانت‌اند در ممیزی زنده ۲۰۲۶-۰۸-۲۹:
  - Release: `/var/www/winimi/frontend/releases/bab4c34db478713465d1`
  - Source SHA: `d9e44edc13c24427c2f4741b19ac4db98f257160`
  - Branch: `phase-27/cross-project-design-synthesis`
  - Process CWD با Release فعال منطبق، سرویس فعال و HTTP=200
- Production بک‌اند در همان ممیزی:
  - Release: `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
  - Source SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`
  - Branch: `phase-25/f5-zarinpal-production`
  - Queue/Scheduler CWD منطبق، Health و Ready برابر 200
- هر دو Source SHA بالا در تاریخچه Branchهای GitHub موجود و ancestor قطعی Commitهای مستندات هستند. هیچ Source delta معتبرِ ثبت‌نشده روی Production یافت نشد.
- تصمیم فعلی: Redesign و SEO/AEO/GEO تمام صفحات به‌صورت صفحه‌به‌صفحه و هم‌زمان انجام شوند.
- برای هر سکشن ۲ تا ۳ گزینه واقعی ارائه می‌شود؛ کاربر انتخاب می‌کند؛ انتخاب ثبت می‌شود؛ سپس پیاده‌سازی انجام می‌شود. اجرای یک‌جای تمام صفحه ممنوع است.

**CURRENT_NEXT_ACTION:** از Baseline ثبت‌شده Production، Route inventory نهایی شود؛ سپس Redesign + SEO صفحه‌به‌صفحه و فاز Google Login اجرا شود. OTP حذف نشود و فقط با Feature Flag غیرفعال بماند.

## 2) هویت فنی

### دامنه و مخزن

- Storefront: `https://winimibakery.com`
- API: `https://api.winimibakery.com`
- Frontend: `https://github.com/sajadkhavas/cooci.git`
- Backend: `https://github.com/sajadkhavas/winimi-bakery-backend.git`

### فرانت‌اند

- SSR با React Router Framework Mode و Vite.
- Runtime: `/usr/bin/node /var/www/winimi/frontend/current/app/build/runtime/server.mjs`
- Service: `winimi-frontend.service`
- Layout: `/var/www/winimi/frontend/releases/<release-id>` و symlink اتمیک `current`.
- Production contract:
  - `SITE_URL=https://winimibakery.com`
  - `VITE_SITE_ORIGIN=https://winimibakery.com`
  - `VITE_USE_BACKEND=true`
  - `VITE_API_BASE_URL=https://api.winimibakery.com`
  - `VITE_ALLOW_DEV_MOCKS=false`

### بک‌اند

- Laravel، PHP-FPM، Queue و Scheduler.
- Serviceها: `php8.3-fpm.service`، `winimi-backend-queue.service`، `winimi-backend-scheduler.timer` و `nginx.service`.
- Layout: `/var/www/winimi/backend/releases`، `current` و `shared`.
- آخرین Backend Release قطعی در شواهد رسانه:
  - Path: `/var/www/winimi/backend/releases/eb002a6d5f093e7780d3`
  - SHA: `eb002a6d5f093e7780d3cf6333b3e5f83f96e57b`
- این مقادیر تاریخی‌اند و قبل از Mutation باید از سرور خوانده شوند.

## 3) Releaseهای مهم فرانت‌اند

| نقش | Release / SHA | وضعیت ثبت‌شده |
|---|---|---|
| Production قطعی ۲۰۲۶-۰۸-۲۹ | Release `bab4c34db478713465d1` / SHA `d9e44edc...` | فعال، SSR/Routes/HTTP سالم |
| Candidate تاریخی Phase 27 | Release `2097904371803eb7f1ef` / SHA `4cddcbec...` | Candidate تاریخی؛ با نسخه نهایی جایگزین شد |
| Redesign قبلی | Release `ca1d7173da45854a4c90` / SHA `3819215d...` | قبلاً اتمیک فعال و Smoke-test شده |
| Baseline قدیمی | `769edcde704785917d52` | Release سالم تاریخی/Rollback قدیمی |
| Palette source | SHA `7dfc74d6904bb4e57b73fca43fa4f042d1ca09f4` | منبع مرحله‌ای که به `39016...` منتهی شد |

هیچ مقدار تاریخی جای Preflight زنده را نمی‌گیرد. Git remote، `current`، manifest، process identity و systemd منبع حقیقت لحظه اجرا هستند.

## 4) فازهای انجام‌شده

### اتصال، SSR و استقرار

- SSR، CSP nonce، HTTPS، PWA، Immutable Release، Atomic activation و Rollback Audit شده‌اند.
- Frontend به API واقعی متصل و Development mocks در Production غیرفعال است.
- مسیرهای `/`، `/products`، Product detail، `/blog` و `/account/login` در آخرین Acceptance پاسخ ۲۰۰ داده‌اند.

### رسانه و تصاویر — بسته‌شده و پایدار

- Root cause تاریخی: نبودن `public/storage` و Cache شدن 404 در Cloudflare؛ فایل‌ها حذف نشده بودند.
- Nginx، مسیر `/storage/` را مستقیم به `/var/www/winimi/backend/shared/storage/app/public/` Alias می‌کند.
- رسانه موجود: `public, max-age=86400, stale-while-revalidate=604800`.
- رسانه ناموجود: 404 با `no-store, no-cache, must-revalidate, max-age=0`.
- Cache قدیمی 404 در Cloudflare Purge شد.
- آخرین Audit: ۲۰۱ فایل، ۹۷ دایرکتوری، حدود ۱۸MB.
- Media release gate: `/usr/local/sbin/winimi-media-release-gate` با `root:root:750`.
- Release جدید نباید تحویل تصاویر را دوباره به symlink داخل Release وابسته کند.

### پرداخت، OTP و ورود موقت

- پرداخت واقعی زرین‌پال در Audit به `paid/verified` رسید.
- برای Callback تکراری Replay زنده انجام نشد.
- تست Idempotency ایزوله شکاف ابزار داشت: ابتدا `artisan test` و سپس PHPUnit binary موجود نبود. تا شاهد جدید، «Test Harness نیازمند تکمیل» است.
- پرداخت زرین‌پال انجام شده و توسعه مجدد ندارد؛ فقط Regression نهایی موفق/ناموفق/Callback/Idempotency باقی است.
- زیرساخت OTP حفظ می‌شود، اما تا تکمیل ثبت‌نام کاوه‌نگار کارفرما با Feature Flag در UI و Backend غیرفعال خواهد شد؛ حذف کد یا Migration برگشتی ممنوع است.
- تحویل موقت Auth با Google Login انجام می‌شود. کاربر جدید بعد از ورود Google باید شماره موبایل ایران را وارد کند؛ تا OTP موفق، `phone_verified_at` خالی و شماره «تأییدنشده» است.
- اتصال خودکار حساب‌ها صرفاً با ایمیل یا شماره تکراری ممنوع است؛ Provider ID معتبر و جریان امن Linking لازم است.
- OAuth Client و Credentialهای Google/Kavenegar باید متعلق به حساب کارفرما و خارج از Git باشند.
- مهاجرت به sms.ir تصمیم قطعی نیست.

### Redesign و SEO

- Redesign اولیه صفحه اصلی/Navigation پیاده و مستقر شد؛ Media، API، SSR، Assets و Smoke PASS بودند.
- Palette سبز پاستیلی/آجری اصلاح شد و Release `39016...` در Production مشاهده شد.
- نسخه نهایی صفحه اصلی Phase 27 در Release `bab4c34db478713465d1` فعال و در ممیزی ۲۰۲۶-۰۸-۲۹ سالم تأیید شد.
- Redesign و SEO از اینجا یک فاز مشترک‌اند: UI، Copy، Heading، Internal link و Schema با هم طراحی می‌شوند.
- Blueprint SEO/AEO/GEO تحقیق شده، ولی Implementation و Acceptance نهایی باقی است.
- رتبه ۱ تضمین نمی‌شود؛ هدف Foundation فنی، محتوایی و UX قابل دفاع است.

## 5) تصمیم‌های قطعی طراحی

### Palette

- Primary برند: سبز پاستیلی `#D0E596`.
- آجری: `#D88972`، روشن `#F7E4DC`، تیره `#B96552`.
- متن اصلی: زیتونی/سبز بسیار تیره با Contrast کافی.
- سبز پاستیلی برای هویت برند، هدر دسکتاپ، Wash سکشن‌ها، Surface و Footer.
- آجری فقط برای Micro-accent، Hairline، فلش، Hover، Badge محدود یا CTA ثانویه؛ نه رنگ غالب صفحه.
- سبز تیره خشن برای Active stateهای بزرگ محدود شود.

### Layout

- فاصله‌های خالی عمودی کاهش یابد و Rhythm مشترک ایجاد شود.
- بین سکشن‌ها Hairline ظریف باشد؛ Double border و برخورد خط‌ها ممنوع.
- Contract مشترک مانند `SectionShell` برای padding/container/separator تعریف شود.
- Background wash کنترل‌شده باشد، نه مه غلیظ روی کل صفحه.
- Signature بزرگ `WINIMI BAKERY` یک‌بار در Pre-footer/Brand divider حفظ شود.

### موبایل

- منوی همبرگری موبایل در وضعیت فعلی خوب است و **نباید تغییر کند**.
- Carouselها Touch/Drag/Swipe، Keyboard و Reduced Motion داشته باشند.
- Autoplay اجباری ممنوع.
- Bottom navigation و Drawer نباید با سکشن‌های جدید تداخل کنند.

## 6) قرارداد قطعی سکشن دسته‌بندی

- `Screenshot (927).png`: وضعیت فعلی، کارت‌های بزرگ Editorial با سه ستون، توضیح بلند و ارتفاع زیاد.
- `Screenshot (926)(1).png`: فقط مرجع تاریخی برای «پاشش سبز پاستیلی»؛ وضعیت فعلی نیست.

تصمیم نهایی:

- حداکثر ۶ دسته فعال.
- Desktop: هر ۶ کارت در یک ردیف.
- Tablet/Mobile: یک Horizontal rail با Touch/Drag/Swipe؛ حدود ۲.۲ کارت در موبایل.
- بدون Autoplay.
- تصویر تمام‌رنگ و بدون متن اصلی روی تصویر.
- نام دسته زیر تصویر و Link واقعی HTML.
- توضیح بلند، Count، Badge بزرگ، Icon بزرگ و CTA تکراری هر کارت حذف شود.
- Green wash زیر کارت/سکشن، نه Overlay تیره روی عکس.
- آجری فقط در فلش/خط/Hover کوچک.
- H2: «دسته‌بندی محصولات وینیمی»
- Intro: «دسته موردنظرت را انتخاب کن و محصولات فعال، قیمت و جزئیات سفارش را ببین.»
- CTA: «مشاهده همه محصولات»
- Semantic contract: `section > h2 + ul/li + a[href]`.
- فقط دسته‌های فعال و واقعی در SSR HTML؛ Alt توصیفی و Link قابل Crawl.

## 7) قرارداد محصولات صفحه اصلی

- کارفرما حدود ۲۸ محصول دارد؛ همه می‌توانند در Home قابل کشف باشند، اما نه در Grid بلند.
- ساختار: Product shelfهای افقی، گروه‌بندی‌شده بر اساس دسته.
- هر Shelf: H2 مستقل، Intro کوتاه واقعی، Link «مشاهده همه» و Carousel افقی.
- همه Product linkهای فعال در SSR HTML؛ JavaScript فقط Progressive enhancement.
- موبایل: Swipe/Snap؛ دسکتاپ: Arrow/Drag/Keyboard؛ بدون Autoplay.
- تصاویر پایین Fold lazy؛ LCP بالای Fold lazy نشود.
- کارت: نام، تصویر، قیمت/وضعیت واقعی و CTA روشن؛ توضیح کامل در Product page.
- جهت پیشنهادی: Hybrid editorial + product shelf؛ یک Featured product و سپس کارت‌های یکنواخت.

## 8) فهرست ۱۰ بخش صفحه اصلی

این‌ها نیازها/تصمیم‌های ثبت‌شده‌اند و به معنی تکمیل اصلاحات جدید نیستند.

1. **Hero**
   - المان شفاف روی تصویر و متن ناخوانا.
   - متن سمت راست نامرتب و دارای مشکل شکست/نقطه.
   - سه باکس عمومی پایین با مسیرهای واقعی خرید/دسته جایگزین شوند.
   - H1، Copy و CTA واقعی و Contrast کنترل‌شده.

2. **نوار متحرک زیر Hero**
   - محتوا مخصوص وینیمی.
   - ظاهر قبلی و Green wash مطلوب است؛ ترمیم شود، نه بازطراحی نامرتبط.
   - حرکت دستی با Touch/Mouse؛ Autoplay آزاردهنده ممنوع.

3. **دسته‌بندی**
   - قرارداد بخش ۶ اجرا شود.

4. **محصولات پیشنهادی**
   - تصویر کارت را درست پر کند.
   - Hierarchy، قیمت، موجودی، CTA و Stateها استاندارد شوند.
   - قرارداد Product shelf اجرا شود.

5. **خرید بر اساس موقعیت/مناسبت**
   - مشکل Contrast، متن مخفی و Overlay دارد.
   - فقط بر اساس موقعیت‌های واقعی کارفرما بازطراحی شود.

6. **سکشن خالی/خراب**
   - یک فضای تقریباً خالی دیده شد.
   - Root cause شرط Render، داده، CSS height، animation یا hydration پیش از طراحی مشخص شود.

7. **راهنماها/مقالات**
   - سکشن داستان/نظر مبهم با Hub خاص راهنماها و مقاله‌ها جایگزین شود.
   - هدف: Internal linking و پاسخ به سؤال قبل از خرید.

8. **CTA دسته‌بندی/مقایسه**
   - Copy سمت راست منظم شود.
   - سبز تیره غالب محدود شود.
   - متن سفید نامرئی زیر محصول اصلاح شود.
   - Hairline ظریف اضافه شود.

9. **Trust / eNAMAD**
   - متن اضافه وسط حذف شود.
   - Container مستقل و استاندارد برای eNAMAD.
   - متن فنی «ورود، سفارش، مالکیت و پرداخت از نشست امن...» حذف و با پیام واقعی مشتری‌فهم جایگزین شود.
   - ادعای اعتماد/امنیت بدون سند ممنوع.

10. **Pre-footer / Footer**
    - عبارت «انتخاب بر اساس دسته و مناسبت» با Copy اصولی جایگزین شود.
    - ستون‌ها Hairline ظریف.
    - اطلاعات واقعی کارفرما تکمیل شود.
    - موبایل: Accordion قابل‌دسترس با Icon.
    - Credit: `SHINETHREE`، فعلاً بدون Link.
    - Wordmark بزرگ `WINIMI BAKERY` حفظ شود.
    - سبز پاستیلی با Accent آجری محدود.

## 9) اطلاعات عمومی فعلی؛ نیازمند تأیید کارفرما

- برند: وینیمی بیکری / WINIMI BAKERY
- تلفن نمایش‌داده‌شده: `09212508746`
- ایمیل نمایش‌داده‌شده: `hello@winimibakery.com`
- محدوده نمایش‌داده‌شده: اندیشه، استان تهران
- تیم طراحی/توسعه: `SHINETHREE`، فعلاً بدون لینک

هیچ آدرس، ساعت کاری، محدوده ارسال یا ادعای خدماتی نباید حدس زده شود.

## 10) Blueprint مشترک SEO / AEO / GEO

### معماری

- Home، Products، Category، Product detail
- Occasion/use-case landing فقط با محتوای واقعی
- Guides/Blog hub و Article/Guide
- About، Contact و Policy
- Cart/Checkout/Account/Search/Filters با سیاست درست noindex/canonical

### الزامات

- SSR واقعی برای محتوا و Linkهای Product/Category.
- Title، Meta description و H1 یکتا؛ Canonical صحیح.
- Sitemap پویا فقط برای URLهای فعال.
- 404 واقعی.
- Filter/query با noindex/canonical؛ URL بی‌نهایت ممنوع.
- Breadcrumb قابل مشاهده و `BreadcrumbList`.
- `Product` + `Offer` با داده واقعی؛ `ProductGroup` فقط برای Variant واقعی.
- `Article`/`BlogPosting` برای راهنمای واقعی.
- `Organization` و `WebSite` با داده معتبر.
- `LocalBusiness` فقط با اطلاعات واقعی قابل اثبات.
- FAQ قابل مشاهده؛ Schema فقط مطابق سیاست رسمی و محتوای واقعی.
- متن/Schema مخفی برای موتور جستجو ممنوع.
- Alt، width/height، WebP/AVIF، Lazy loading و LCP درست.
- Internal linking بین Category، Product، Occasion و Guide.
- Core Web Vitals و Accessibility جزو Release gate.

### محتوای پیشنهادی

- راهنمای انتخاب محصول/هدیه
- نگهداری و تازگی
- مواد تشکیل‌دهنده و آلرژن
- پذیرایی و مناسبت
- مقایسه بر اساس نیاز واقعی
- پاسخ کوتاه به سؤال‌های قبل از خرید

### محدودیت‌ها

- Google Merchant Center و Google Business Profile برای ایران محدودیت رسمی دارند؛ کشور/اطلاعات جعلی ممنوع.
- برای AI Search میان‌بر جادویی وجود ندارد؛ محتوای Crawlable، Entity روشن، Structured data معتبر و Citation-worthy content اصل است.
- Snippet فنی قدیمی صفحه `/products` درباره «تنظیمات فعال بک‌اند» باید حذف بماند؛ متن فنی داخلی در UI/Metadata عمومی ممنوع.

## 11) قواعد اجرای تغییرات

- ابتدا منابع رسمی و مستندات معتبر بررسی شوند.
- تغییرات در Git؛ Production محل ویرایش Source نیست.
- داخل `/current` ویرایش ممنوع.
- Build از Clone/Worktree تمیز و Exact SHA.
- Immutable Release، verify، Candidate loopback با API واقعی، سپس Atomic activation و Auto-rollback.
- Gateهای قبل/بعد: SHA/Branch، current، manifest، PID/CWD، API health/ready/catalog، SSR routes، hashed asset، media و journal errors.
- Backend/Nginx/Database همراه Redesign تغییر نکند مگر جداگانه و صریحاً تأیید شود.
- Dirty file کاربر حذف/restore نشود مگر Proven generated artifact.
- Cleanup مخرب ممنوع.
- متغیر shell به نام `PATH` ساخته نشود؛ قبلاً موجب `curl/install: command not found` شد.
- در اسکریپت حساس مسیر مطلق commandها ترجیح دارد.
- کاربر دستور کامل `bash <<'BASH' ... BASH` می‌خواهد؛ اصلاحیه باید نسخه کامل باشد.
- هر Mutation: Preflight + Acceptance + Auto-rollback.

## 12) چرخه تصمیم‌گیری جدید

1. Screenshot و Source map وضعیت فعلی.
2. هدف تجاری، UX، SEO/AEO و داده واقعی.
3. ارائه ۲ تا ۳ گزینه متفاوت.
4. توضیح Trade-off موبایل، Performance، SEO و Maintenance.
5. انتخاب و تأیید کاربر.
6. ثبت تصمیم در همین سند.
7. پیاده‌سازی Git پس از قفل شدن گروه تصمیم‌ها.
8. Unit/Type/Lint/Accessibility/SSR/Performance.
9. Candidate ایزوله.
10. Visual acceptance و Atomic deploy.

ترتیب پیشنهادی:

1. Global foundation
2. Header دسکتاپ؛ منوی موبایل دست‌نخورده
3. Hero
4. Marquee
5. Categories
6. Product shelves
7. Occasion
8. Guides/articles + FAQ
9. Trust/eNAMAD
10. Pre-footer/Footer
11. Products/Category/Product pages
12. Metadata/Schema/Sitemap/Robots/Redirect و SEO acceptance

## 13) موارد باز تا تحویل نهایی

- [ ] انتخاب بصری همه سکشن‌ها
- [ ] پیاده‌سازی در Branch مشخص
- [ ] تکمیل SEO/AEO/GEO روی Home و Templateها
- [ ] Admin fieldهای Product/Category/Article/Global SEO/Redirect
- [ ] تکمیل Test harness پرداخت/Idempotency
- [ ] Google Login، تکمیل اجباری شماره و Feature Flag غیرفعال OTP
- [ ] تکمیل حساب کاوه‌نگار کارفرما و فعال‌سازی/تأیید OTP در فاز بعدی
- [ ] تأیید اطلاعات تماس، محدوده، ارسال و Policy
- [ ] Accessibility/Responsive/Cross-browser
- [ ] Performance/CWV
- [ ] Candidate و Visual acceptance
- [ ] Atomic production deploy
- [ ] Cloudflare/cache/media smoke
- [ ] Observation window و ثبت Release نهایی

## 14) ممنوع‌ها و هشدارها

- Release فعال صفحه اصلی بدون Candidate، QA و Rollback gate با تغییر جدید جایگزین نشود.
- Screenshot قدیمی وضعیت فعلی فرض نشود.
- Mobile hamburger drawer تغییر نکند.
- ادعای ساختگی درباره ارسال، امنیت، رضایت، مواد یا محدوده خدمات ممنوع.
- ۲۸ محصول در Grid بلند Home قرار نگیرند.
- Carousel Client-only و غیرقابل Crawl نباشد.
- سبز تیره یا آجری رنگ غالب همه سکشن‌ها نشود.
- 404 رسانه Cacheable نشود.
- تحویل رسانه دوباره به symlink داخل Release وابسته نشود.
- Preview موقت روی Production/TLS bridge قبلی احیا نشود.

## 15) پروتکل به‌روزرسانی سند

پس از هر تصمیم/استقرار ثبت شود:

- تاریخ و نام سکشن/فاز
- گزینه انتخاب‌شده و دلیل
- Copy نهایی
- Component/Fileها
- Branch و Commit SHA
- Release ID
- Test PASS/FAIL
- Rollback target
- Production active release
- Next action دقیق

اگر شاهد جدید با سند تعارض داشت، Git/سرور زنده برتری دارد و سند فوراً Version جدید می‌گیرد.

### به‌روزرسانی ۲۰۲۶-۰۸-۲۵ — سکشن دسته‌بندی

- مرجع انتخابی کارفرما: ردیف ساده «Shop by Category» با تصویر و نام زیر آن.
- پیاده‌سازی Git: حداکثر ۶ دسته فعال، یک ردیف ۶ ستونه در دسکتاپ و Rail افقی Snap/Touch در موبایل.
- روی تصویر هیچ عنوان، Count، Badge یا توضیحی قرار نمی‌گیرد؛ نام دسته زیر تصویر است.
- دور پنل و کارت Hairline ظریف دارد؛ Hover کارت سبز پاستیلی `#D0E596` است.
- CTA کلی: «مشاهده همه محصولات».
- H2: «دسته‌بندی محصولات وینیمی».
- Intro: «دسته موردنظرت را انتخاب کن و محصولات فعال، قیمت و جزئیات سفارش را ببین.»
- فایل‌ها:
  - `src/components/catalog/CategoryShowcase.tsx`
  - `src/pages/HomePage.tsx`
  - `scripts/audit-content-integrity.mjs`
  - `scripts/audit-modern-ui.mjs`
- Code commit: `66cc2a80400b594f664042ab6802311ea84c9c00`
- Frontend CI: PASS — run `32833365870`.
- Production activation: انجام نشده.
- Next: Build/Candidate ایزوله و Visual acceptance همین سکشن؛ بعد انتخاب طراحی Product shelf.

## 16) Checkpoint

```yaml
project: winimi-bakery
status_date_utc: 2026-08-29
public_site: https://winimibakery.com
public_api: https://api.winimibakery.com
frontend_repo: sajadkhavas/cooci
backend_repo: sajadkhavas/winimi-bakery-backend
production_frontend:
  branch: phase-27/cross-project-design-synthesis
  source_sha: d9e44edc13c24427c2f4741b19ac4db98f257160
  release_id: bab4c34db478713465d1
  production_activated: true
  acceptance: PASS
production_backend:
  branch: phase-25/f5-zarinpal-production
  source_sha: eb002a6d5f093e7780d3cf6333b3e5f83f96e57b
  release_id: eb002a6d5f093e7780d3
  acceptance: PASS
decision_mode: page_by_page
combined_phase: redesign_plus_seo_aeo_geo
locked_mobile_drawer: do_not_change
brand_primary: "#D0E596"
accent_terracotta: "#D88972"
payment: implemented_regression_only
temporary_auth: google_login
phone_onboarding: required_unverified_until_otp
otp: retained_but_feature_flag_disabled_until_client_kavenegar
current_next_action: route_inventory_then_page_redesign_seo_and_google_auth
production_mutation_authorized: false
preflight_required: true
```
