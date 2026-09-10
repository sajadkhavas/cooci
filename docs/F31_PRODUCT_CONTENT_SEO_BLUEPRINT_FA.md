# F31 — نقشه محتوای محصول و پایه سئوی وینیمی

Status: **APPROVED IMPLEMENTATION BLUEPRINT**  
Project: WINIMI / COOCI  
Updated: **2026-09-09**

## هدف

صفحه محصول وینیمی باید هم‌زمان سه نیاز را پاسخ دهد:

1. تصمیم خرید مشتری با اطلاعات واقعی و قابل اعتماد؛
2. پوشش intent جست‌وجوی همان محصول و دسته، بدون متن‌سازی و keyword stuffing؛
3. مدیریت کامل محتوا توسط Backend/Filament، بدون hardcode کردن ادعاهای تجاری در Frontend.

این سند الگوی اجرایی Product Detail، انتخاب محصول نمونه هر دسته، ترتیب تولید محتوا و مرز داده‌های تأییدشده کارفرما را قفل می‌کند.

## یافته‌های موجود پروژه

منبع تاریخی اطلاعات کارفرما:

- `src/data/products.ts`
- commit: `c0be99195bd9e0b7bd6e123c0dff5d7c4f98b085`
- `src/data/categoriesContent.ts`
- اسناد SEO زیر `docs/seo/`

خانواده‌های ثبت‌شده:

- کوکی‌ها
- مینی کوکی
- رژیمی و بدون قند
- کیک و دسر
- رول و کروسان
- باکس هدیه

Gift در storefront فعلی بازنشسته است و برای این مرحله انتخاب نمی‌شود.

Backend فعلی از قبل این داده‌ها را مدیریت می‌کند:

- short/long description
- variants، price، weight و inventory
- ingredients و allergens
- shelf life و storage instructions
- preparation window
- shipping scope/note
- main image و gallery
- content/media/inventory verification
- meta title و meta description

خلأ اصلی، نبود بلوک‌های محتوایی تفکیک‌شده و قابل مدیریت برای تجربه، کاربرد، مشخصات، سرو و FAQ اختصاصی محصول است.

## معماری پیشنهادی صفحه محصول

ترتیب بالای صفحه برای خرید حفظ می‌شود:

```text
Gallery
-> Product name / verified summary
-> variant and price
-> inventory / preparation
-> quantity / add to cart
```

بعد از ناحیه خرید، محتوای عمیق قرار می‌گیرد:

| بخش | هدف مشتری | مالک داده |
|---|---|---|
| معرفی کامل | محصول دقیقاً چیست و چه تفاوتی دارد | Backend |
| ویژگی‌های طعم و بافت | طعم غالب، بافت و شدت شیرینی فقط طبق داده تأییدشده | Backend |
| مشخصات محصول | وزن، تعداد، نوع فروش، آماده‌سازی و شرایط سفارش | Backend + Variant |
| مناسب برای | مصرف روزمره، پذیرایی، سازمانی یا موقعیت‌های تأییدشده | Backend |
| مواد تشکیل‌دهنده | شفافیت محصول | Backend |
| آلرژن‌ها | هشدار ایمنی، بدون استنباط | Backend |
| پیشنهاد سرو | دما، همراهی و روش مصرف تأییدشده | Backend |
| نگهداری و ماندگاری | کاهش ابهام بعد از خرید | Backend |
| ارسال و تحویل | scope و محدودیت واقعی Checkout | Backend |
| پرسش‌های این محصول | پاسخ به intentهای واقعی و کاهش تماس تکراری | Backend |
| محصولات مرتبط | discovery و internal linking | Backend relationship/category |
| نظر خریداران | اعتماد فقط از review واقعی و تأییدشده | Backend |

بخش «دانلودها» برای محصول خوراکی به‌صورت پیش‌فرض ساخته نمی‌شود. اگر کاتالوگ B2B، برگه ترکیبات یا راهنمای نگهداری رسمی ایجاد شد، ماژول attachment عمومی جداگانه و اختیاری اضافه می‌شود.

## قرارداد Backend-managed پیشنهادی

فیلدهای موجود حفظ می‌شوند و این فیلدها افزوده می‌شوند:

```text
taste_notes: string[]
texture_notes: string[]
use_cases: string[]
serving_suggestions: string|null
specifications: [{label:string,value:string}]
product_faqs: [{question:string,answer:string}]
content_version: integer
content_reviewed_at: datetime|null
```

قواعد انتشار:

- هیچ فیلد خالی در UI render نشود.
- هیچ ادعای «سالم»، «دیابتی»، «رژیمی»، «بدون قند»، «پرفروش» یا ارسال سراسری بدون تأیید کارفرما منتشر نشود.
- `content_verified` فقط پس از بررسی مواد، آلرژن، ماندگاری، نگهداری و متن‌های جدید فعال باشد.
- `media_verified` فقط برای عکس واقعی همان محصول فعال شود.
- قیمت، موجودی و availability باید با landing page، structured data و Checkout یکسان باشند.
- FAQ schema فقط برای پرسش و پاسخ‌های visible همان صفحه تولید شود.
- متن محصول باید اختصاصی باشد؛ طول به‌تنهایی معیار کیفیت نیست.

## محصول نمونه پیشنهادی هر دسته فعال

انتخاب بر اساس بیشترین داده تاریخی و امکان تکمیل بدون حدس انجام شده است:

| دسته فعال | محصول پایه پیشنهادی | وضعیت |
|---|---|---|
| کوکی‌های خانگی | کوکی ردولوت | اکنون live؛ داده و تصویر موجود، نیازمند غنی‌سازی |
| مینی کوکی | مینی کوکی وانیلی با تکه‌های شکلات | داده وزن/تعداد تاریخی مناسب |
| کیک و دسر | تیرامیسو تک‌نفره | داده وزن و نگهداری سرد قابل ساخت |
| چیزکیک | چیزکیک سن‌سباستین | محصول live و intent مستقل |
| رژیمی و بدون قند افزوده | کوکی جو پرک و کشمش | باید ادعاهای تغذیه‌ای محافظه‌کارانه بماند |
| رول و کروسان | رول دارچینی | داده تاریخی موجود؛ نیازمند عکس واقعی |

انتخاب نهایی هر محصول فقط وقتی publish می‌شود که رکورد واقعی Backend با دسته فعال تطبیق داده شود.

## استاندارد محتوای هر محصول پایه

حداقل خروجی لازم:

- short description: حدود ۱ جمله، مناسب کارت
- introduction: دو تا چهار پاراگراف کوتاه و اختصاصی
- taste/texture: دو تا شش ویژگی واقعی
- specifications: حداقل وزن/تعداد/نوع فروش/آماده‌سازی
- use cases: دو تا پنج مورد واقعی
- serving suggestion: یک پاراگراف کوتاه در صورت وجود اطلاعات
- ingredients/allergens/storage/shelf life: کامل و تأییدشده
- product FAQ: سه تا شش پرسش واقعی، نه FAQ مصنوعی برای keyword
- meta title و meta description یکتا
- main image + gallery واقعی همان محصول با alt توصیفی

## ترتیب اجرای محتوا و سئو

```text
1 verified Product per active Category
-> complete Product SEO fields and real media
-> complete Category landing content
-> write supporting Category articles
-> connect Product <-> Category <-> Article internal links
-> validate visible content and Product/Merchant structured data
-> add the next products using the approved template
```

برای هر دسته، article cluster از سؤال‌ها و نیازهای واقعی همان خانواده ساخته می‌شود؛ مقاله نباید متن محصول را تکرار کند.

## معیار موفقیت سئو

هدف «تضمین رتبه یک» نیست؛ هیچ پیاده‌سازی فنی چنین تضمینی نمی‌دهد. پایه رقابتی شامل این موارد است:

- محتوای مفید، دقیق، اختصاصی و people-first
- crawlable links از Home به دسته، از دسته به محصول و از مقالات به صفحات تجاری مرتبط
- Product/Offer data هماهنگ با قیمت و موجودی visible
- تصویر واقعی با URL پایدار و alt صادقانه
- canonical یکتا و مدیریت variant/filter URL
- review و AggregateRating فقط با داده واقعی
- sitemap و Search Console پس از تثبیت URL و محتوا
- بهبود دوره‌ای براساس query، impression، CTR و conversion واقعی

## تصویر واقعی

- تصاویر placeholder یا borrowed برای محصول نهایی پذیرفته نیستند.
- هر main image و gallery باید متعلق به همان محصول باشد.
- Backend conversionهای thumb/card/detail WebP را تولید می‌کند.
- alt باید محصول و نمای واقعی را توصیف کند، نه اینکه keyword list باشد.
- بعد از هر تغییر تصویر، `media_verified` دوباره بررسی شود.
- تصویر دسته باید نماینده محصولات واقعی همان دسته باشد.

## کنترل کیفیت قبل از انتشار هر محصول

```text
PRODUCT_RECORD_EXISTS=YES
CATEGORY_ACTIVE_MATCH=YES
COMMERCIAL_DATA_VERIFIED=YES
CONTENT_VERIFIED=YES
MEDIA_VERIFIED=YES
PRICE_STOCK_CHECKOUT_MATCH=YES
SEO_FIELDS_UNIQUE=YES
VISIBLE_SECTIONS_MATCH_SCHEMA=YES
NO_UNVERIFIED_CLAIM=YES
```

## منابع

1. Google Search Central. [Intro to Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product).
2. Google Search Central. [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing).
3. Google Search Central. [Help Google understand your ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure).
4. Google Search Central. [Include structured data relevant to ecommerce](https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce).
5. Google Search Central. [Designing an ecommerce URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites).
6. Google Search Central. [Product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants).
7. Google Merchant Center Help. [Product data specification](https://support.google.com/merchants/answer/7052112).
8. WINIMI historical employer catalog. `src/data/products.ts@c0be99195bd9e0b7bd6e123c0dff5d7c4f98b085`.
