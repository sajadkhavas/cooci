# ممیزی پوشش پنل مدیریت WINIMI — F31

تاریخ ممیزی: ۱۴۰۵/۰۶/۱۹ (2026-09-10)

## هدف و مبنا

این ممیزی بررسی می‌کند هر سطح عمومی یا عملیاتی سایت از کدام داده تغذیه می‌شود، آیا API معتبر دارد و آیا کارفرما می‌تواند آن را از پنل Filament مدیریت کند. اصل معماری پروژه این است که Backend منبع واحد حقیقت باشد؛ متن‌های رابط ثابت و کنترل‌های امنیتی لزوماً محتوای پنل نیستند.

مبنای کد ممیزی:

- Frontend candidate: `7505d28bd5294cf073bfd0e37eaf79b602e22b3c` — CI پنج از پنج موفق.
- Backend candidate: `9989a1b4848b1a87c4749ed3a7eade343664cce3` — CI چهار از چهار موفق.
- Production مشاهده‌شده: خانه، فروشگاه، درباره ما و بلاگ پاسخ SSR معتبر دارند؛ صفحه بلاگ در حال حاضر به‌دلیل نبود مقاله منتشرشده empty state نشان می‌دهد.
- آخرین Production ثبت‌شده قبل از candidateها: Frontend release `803912135173ca965399` و Backend release `a077a3a7827a058b32b7`.

## نتیجه مدیریتی

هسته فروشگاه و محتوای اصلی پنل دارد، اما پنل هنوز برای تحویل نهایی «کاملاً یک‌دست» نیست. چهار شکاف واقعی و دو مسئله پاک‌سازی/تجربه مدیریت وجود دارد. افزودن بی‌حساب Resource جدید توصیه نمی‌شود؛ ابتدا باید منابع قدیمی و منابع معتبر از هم جدا شوند.

## ماتریس پوشش فعلی

| سطح سایت | منبع معتبر Backend/API | محل کنترل در Filament | وضعیت |
|---|---|---|---|
| محصول، قیمت، موجودی، Variant، بسته‌بندی، تخفیف، ارسال و تصاویر | BakeryProduct/Catalog API | محصولات بیکری | کامل |
| توضیح کامل، طعم، بافت، کاربرد، پیشنهاد سرو، مشخصات و FAQ محصول | BakeryProduct | محصولات بیکری ← محتوای کامل محصول | کامل |
| دسته‌های فروشگاه و تصویر/alt/SEO | BakeryCategory | دسته‌بندی‌های بیکری | کامل |
| لندینگ SEO دسته، FAQ و لینک داخلی | BakeryCategoryLanding | لندینگ‌های سئو دسته‌ها | کامل |
| صفحه اصلی، Header copy، Footer copy، تماس، CTAها و متن صفحات عمومی | StoreSetting API | محتوای سایت و صفحه اصلی | موجود، اما ویرایشگر عمومی و کم‌راهنما |
| منوی Header و زیرمنوی فروشگاه در دسکتاپ/موبایل | NavigationItem API | منوی هدر و زیرمنوها | کامل پس از candidate بک‌اند |
| صفحات درباره، کیفیت، ارسال، حریم خصوصی و قوانین | BakeryContentPage API | صفحات محتوایی وینیمی | کامل |
| FAQ عمومی | BakeryFaq API | سوالات متداول وینیمی | کامل |
| بلاگ/راهنما، موضوع، کاور و SEO | BakeryPost API | وبلاگ وینیمی | کامل؛ داده واقعی هنوز باید منتشر شود |
| گالری | BakeryGalleryItem API | گالری وینیمی | کامل |
| صفحات شهری و Local SEO | BakeryCityPage API | صفحات شهری | کامل |
| نظر محصول و دیوار نظرات | ProductReview API | نظرات محصولات | کامل |
| تماس و درخواست سازمانی | Inquiry API | درخواست‌ها | کامل |
| سفارش، وضعیت، یادداشت داخلی، پرداخت و ارسال | Order/Payment/Delivery | سفارش‌ها، تلاش‌های پرداخت، مناطق ارسال | کامل |
| کوپن و تخفیف عمده کوکی | Coupon + StoreSetting | کوپن‌ها + محتوای سایت و صفحه اصلی | قابل‌کنترل، ولی تنظیم عمده فرم تخصصی ندارد |
| eNAMAD | StoreSetting trust contract | محتوای سایت و صفحه اصلی | قابل‌کنترل، ولی فرم اختصاصی/اعتبارسنجی ندارد |
| اعلان سفارش و پیام عمومی مدیر | NotificationTemplate/Outbox/WebPush | قالب‌های اعلان + صف اعلان‌ها | ارسال کامل؛ مشاهده subscriptionها ناقص |
| Redirect، robots، sitemap و ابزارهای SEO | Redirect/SEO admin | Redirect Manager، Robots، Sitemap و SEO resources | کامل |
| حساب مشتری، آدرس و ترجیحات اعلان | Customer/Address/WebPush API | مشتریان و آدرس‌ها | عملیات کامل؛ نمای subscription ناقص |
| PWA نصب‌پذیر، نام برنامه، رنگ، offline و shortcutهای long-press | فایل build-time manifest/service worker | ندارد | شکاف واقعی |
| Analytics/Tag Manager/Search Console verification | در Frontend/Backend قرارداد مدیریتی یکپارچه ندارد | ندارد | برای مرحله Online Launch باقی است |

## شکاف‌هایی که باید یک‌جا تکمیل شوند

### P0 — جلوگیری از ویرایش منبع اشتباه

پنل هم‌زمان Resourceهای قدیمی ToolMaster مانند `ProductResource`, `CategoryResource`, `BlogPostResource`, `FaqResource`, `ReviewResource`, `SettingResource`, `SitePageResource`, `SliderResource` و `BrandResource` را کنار Resourceهای معتبر Bakery نمایش می‌دهد. Frontend فعلی از قراردادهای Bakery/Catalog/Store استفاده می‌کند و API قدیمی در Production غیرفعال است. این Resourceها باید پس از بررسی وابستگی، از navigation پنل Production مخفی یا در یک گروه صریح «Legacy / استفاده نکنید» قرار گیرند. حذف جدول یا داده بدون backup مجاز نیست.

### P0 — منوی Footer واقعاً Backend-authoritative نیست

فرم NavigationItem گزینه `placement=footer` دارد، اما endpoint فعلی navigation فقط `all/header/mobile` را می‌خواند و Frontend فوتر را از چند جایگاه ثابت StoreSetting می‌سازد. در نتیجه مدیر می‌تواند گزینه «فقط فوتر» را ذخیره کند ولی خروجی عمومی آن را مصرف نمی‌کند. باید یکی از این دو قرارداد نهایی شود:

1. Navigation API برای `footer` و گروه‌بندی Footer توسعه یابد و Frontend آن را SSR مصرف کند؛ یا
2. گزینه گمراه‌کننده `footer` از NavigationItem حذف شود و مدیریت فوتر به‌صورت واضح در StoreSetting بماند.

گزینه اول برای کنترل‌پذیری آینده مناسب‌تر است.

### P1 — مدیریت PWA از پنل وجود ندارد

`manifest.webmanifest`، نام/نام کوتاه برنامه، توضیح، رنگ‌ها، shortcutهای فروشگاه/سبد/حساب و متن صفحه offline در فایل‌های build ثابت‌اند. آیکون‌ها و Service Worker باید release-managed باقی بمانند، اما محتوای قابل تغییر PWA می‌تواند مدل/تنظیمات معتبر داشته باشد. نکته فنی: تغییر manifest و offline shell بدون build/deploy جدید فوراً روی فایل استاتیک اعمال نمی‌شود؛ پنل باید این محدودیت را صریح نشان دهد و نباید وانمود کند تغییر آنی است.

### P1 — نمای مدیریتی Web Push subscription ناقص است

مدیر می‌تواند پیام عمومی بفرستد و Outbox را ببیند، ولی Resource اختصاصی read-only برای subscriptionهای فعال، نوع کاربر مهمان/مشتری، زمان آخرین موفقیت/خطا، وضعیت permission و endpointهای منقضی ندارد. باید یک داشبورد امن و mask‌شده اضافه شود؛ endpoint و کلیدهای رمزنگاری هرگز نباید کامل در پنل نمایش داده شوند. قابلیت لغو مدیریتی باید audit log و confirmation داشته باشد.

### P1 — تنظیمات عمومی فرم تخصصی ندارند

StoreSetting بیش از صد کلید را با یک Textarea عمومی و نوع‌های فنی نمایش می‌دهد. کنترل وجود دارد، ولی احتمال خطای مدیر برای URL، JSON، عدد، eNAMAD، لینک شبکه اجتماعی و تخفیف عمده بالاست. باید viewهای تخصصی روی همان StoreSetting ساخته شود، نه منبع حقیقت دوم:

- برند و اطلاعات تماس؛
- Header/Footer و CTAها؛
- صفحه اصلی؛
- اعتماد/eNAMAD؛
- تخفیف عمده؛
- SEO عمومی؛
- App/PWA و integrationهای عمومی.

### P2 — ابزارهای Online Launch هنوز قرارداد یکپارچه پنل ندارند

برای مرحله واقعی آنلاین‌شدن، شناسه‌های عمومی Google Analytics/Tag Manager، Search Console verification و در صورت نیاز marketing pixels باید با consent و CSP هماهنگ شوند. secretها و credentialهای OAuth نباید در StoreSetting عمومی ذخیره شوند؛ فقط شناسه‌ها/verificationهای عمومی و toggleهای امن می‌توانند در پنل باشند. این بخش باید بعد از تعیین حساب‌های مالک کارفرما فعال شود.

## مواردی که «کمبود پنل» محسوب نمی‌شوند

- متن دکمه‌های امنیتی، پیام خطا، checkout، پرداخت و وضعیت حساب باید عمدتاً نسخه‌گذاری‌شده و کنترل‌شده در کد بمانند؛ تغییر آزاد مدیر می‌تواند جریان حقوقی یا امنیتی را خراب کند.
- VAPID private key، Zarinpal merchant secret، Google OAuth secret، DB/Redis و کلیدهای deployment باید فقط در env امن سرور باشند.
- PWA icon و Service Worker logic فایل release هستند و آپلود آزاد آن‌ها از پنل توصیه نمی‌شود.
- داده‌های واقعی محصول، مقاله، تصویر و محتوای دسته کمبود نرم‌افزاری نیستند؛ کار اپراتور محتوا در Resourceهای موجودند.

## بسته اصلاحی پیشنهادی واحد

1. مخفی‌سازی امن Resourceهای Legacy از پنل Production بدون حذف داده.
2. تکمیل Footer Navigation end-to-end با SSR و دسترسی‌پذیری.
3. افزودن نمای read-only و امن Web Push subscriptions.
4. ساخت صفحات تنظیمات تخصصی روی StoreSetting موجود، همراه validation و helper text.
5. افزودن قرارداد عمومی PWA/Online Launch با جداسازی دقیق build-time، public ID و server secret.
6. تست policy/Filament/API/SSR و سپس یک immutable deploy؛ خرید، پرداخت و Google Login تکرار نشود.

## وضعیت و اقدام بعدی

```text
ADMIN_CONTROL_COVERAGE_AUDIT=COMPLETE
CORE_COMMERCE_CONTROL=COVERED
CORE_CONTENT_CONTROL=COVERED
REAL_GAPS=4
PANEL_CLEANUP_UX_ITEMS=2
DATABASE_MUTATION_PERFORMED=NO
PRODUCTION_MUTATION_PERFORMED=NO
CURRENT_NEXT_ACTION=IMPLEMENT_ONE_BOUNDED_ADMIN_COMPLETION_PACKAGE_AFTER_USER_APPROVAL
DO_NOT_REPEAT=REAL_PURCHASE,PAYMENT,GOOGLE_LOGIN,PUSH_DELIVERY,RESTORE,ROLLBACK
```
