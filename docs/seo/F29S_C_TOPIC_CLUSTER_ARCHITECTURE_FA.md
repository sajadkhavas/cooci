# F29S-C — Content Architecture / Topic Clusters

تاریخ: ۲۰۲۶-۰۹-۰۵  
Project: WINIMI / COOCI  
Branch: `phase-29s-c/topic-clusters`  
Status: **COMPLETE / READY FOR GUIDE FOUNDATION**

## Backend/CMS constraint audit

Backend موجود همین حالا `BakeryPost` را با فیلدهای زیر پشتیبانی می‌کند:
- title
- slug
- excerpt
- content
- category
- tags
- cover_url
- author
- status
- published_at

Filament نیز create/edit/publish و filter بر اساس category را دارد. بنابراین برای اولین خوشه محتوایی **نیازی به ساخت CMS جدید یا migration جدید نداریم**.

Frontend route/topic architecture:
- `/blog`
- `/blog/topic/:topic`
- `/blog/:slug`

Topic URL مستقیماً از مقدار `category` ساخته می‌شود. نتیجه: category باید کم‌تعداد، پایدار و قابل‌دفاع باشد؛ تغییر بی‌دلیل نام category باعث تغییر URL topic می‌شود.

## Strategy decision

به‌جای ساخت چند Topic Hub کم‌محتوا از روز اول، فاز اولیه یک خوشه اصلی پرمحتوا می‌سازد و سایر sub-intentها را با `tags` تفکیک می‌کند.

### Priority cluster — `راهنمای انتخاب و سفارش`

هدف:
- پاسخ به سؤال‌های قبل/بعد از خرید که مستقیماً به تجربه واقعی فروشگاه مرتبط‌اند.
- ایجاد پل طبیعی از Informational intent به Category/Product/Gift/Shipping.
- اصلاح سه کارت Editorial Guides صفحه Home.
- جلوگیری از ساخت topic hubهای تک‌مقاله‌ای و thin.

Canonical topic label:

`راهنمای انتخاب و سفارش`

Topic path فعلی frontend:

`/blog/topic/%D8%B1%D8%A7%D9%87%D9%86%D9%85%D8%A7%DB%8C%20%D8%A7%D9%86%D8%AA%D8%AE%D8%A7%D8%A8%20%D9%88%20%D8%B3%D9%81%D8%A7%D8%B1%D8%B4`

> Browser می‌تواند متن فارسی را نمایش دهد؛ URL canonical توسط frontend encode می‌شود. نام category از این مرحله به بعد stable است مگر migration/redirect برنامه‌ریزی‌شده وجود داشته باشد.

## Foundational article set

### G1 — انتخاب هدیه

Working title:
`چطور باکس هدیه خوراکی مناسب انتخاب کنیم؟`

Primary informational intent:
`راهنمای انتخاب باکس هدیه`

Tags:
- هدیه
- باکس هدیه
- انتخاب محصول
- مناسبت

Commercial links:
- `/gift`
- محصولات مرتبط واقعی در صورت وجود

Must not target:
- exact commercial primary `باکس هدیه کوکی و شیرینی`

Home card replacement:
- «چطور برای هدیه انتخاب کنیم؟» → G1

### G2 — پذیرایی و تعداد

Working title:
`برای پذیرایی چند کوکی در نظر بگیریم؟`

Primary informational intent:
`تعداد کوکی برای پذیرایی`

Tags:
- پذیرایی
- مینی کوکی
- تعداد سفارش
- دورهمی

Commercial links:
- `/products/category/mini-cookies`
- `/corporate` فقط وقتی context سازمانی باشد

Truth rule:
- عدد ثابت جهانی اعلام نشود.
- تصمیم بر اساس تعداد مهمان، اندازه محصول، نقش کوکی در پذیرایی و وجود خوراکی‌های دیگر توضیح داده شود.
- اگر serving/yield واقعی محصول در Backend وجود نداشته باشد، عدد دقیق محصول ساخته نشود.

Home card replacement:
- «برای پذیرایی چه تعداد مناسب است؟» → G2

### G3 — نگهداری کوکی

Working title:
`نگهداری و ماندگاری کوکی؛ قبل و بعد از سفارش چه چیزهایی را بررسی کنیم؟`

Primary informational intent:
`نگهداری کوکی` / `ماندگاری کوکی`

Tags:
- نگهداری
- ماندگاری
- کوکی
- تازگی

Commercial links:
- cookies category
- product detail only when storage information for that product is verified

Truth rule:
- روز/ساعت ثابت برای ماندگاری عمومی ساخته نشود.
- متن باید کاربر را به storage/shelf-life تأییدشده هر محصول ارجاع دهد.

Home card replacement:
- «شرایط نگهداری را پیش از سفارش ببین» → G3

### G4 — چیزکیک و سرمایش

Working title:
`چیزکیک و محصولات یخچالی را چطور نگهداری کنیم؟`

Primary informational intent:
`نگهداری چیزکیک`

Tags:
- چیزکیک
- نگهداری سرد
- دسر
- یخچالی

Commercial links:
- cakes/cheesecakes destination
- published chilled products
- `/shipping` when delivery method is relevant

Must not target:
- recipe / طرز تهیه
- medical/food-safety claims beyond verified guidance

### G5 — ارسال سرد

Working title:
`ارسال سرد چیست و چه زمانی برای سفارش شیرینی لازم می‌شود؟`

Primary informational intent:
`ارسال سرد چیست`

Tags:
- ارسال سرد
- تحویل
- نگهداری
- سفارش

Commercial links:
- `/shipping`
- chilled products only from authoritative catalog

Truth rule:
- delivery zone/fee/time must come from current backend/checkout truth, not article copy.

## Cluster graph

```text
/blog
  └── Topic: راهنمای انتخاب و سفارش
       ├── G1 انتخاب باکس هدیه
       │    └── /gift
       ├── G2 تعداد کوکی برای پذیرایی
       │    └── /products/category/mini-cookies
       ├── G3 نگهداری و ماندگاری کوکی
       │    └── /products/category/cookies
       ├── G4 نگهداری چیزکیک/محصول یخچالی
       │    ├── /products/category/cheesecakes
       │    └── published chilled products
       └── G5 ارسال سرد چیست
            └── /shipping
```

Cross-guide links:
- G2 → G3 وقتی کاربر بعد از انتخاب تعداد به نگهداری نیاز دارد.
- G4 ↔ G5 برای تفاوت storage و delivery.
- G1 → `/gift`, نه به G2 مگر context پذیرایی/هدیه چندنفره واقعاً مرتبط باشد.

## Deferred topic candidates

این Topicها فعلاً URL جدا نمی‌گیرند تا حداقل محتوای کافی و Intent مستقل ثابت شود:

### `هدیه و مناسبت`
Deferred until multiple high-value gift guides exist beyond G1.

### `پذیرایی و رویداد`
Deferred until enough genuinely different guides exist.

### `رژیمی و برچسب محصول`
Guarded due YMYL adjacency. فقط با منابع معتبر و بدون medical recommendation.

### `سفارش سازمانی`
Commercial landing `/corporate` فعلاً owner است. Topic جدا فقط وقتی چند guide pre-purchase مستقل لازم باشد.

### Local topics
Blocked pending service truth + demand evidence.

## Home Editorial Guides acceptance

Current problem:
- سه کارت Home همگی `href="/blog"` دارند.

Required after F29S-D:
- Gift card → G1 canonical article
- Storage card → G3 canonical article
- Hosting card → G2 canonical article

No card may point to unpublished/404 article.

Implementation must derive/lock only published guide destinations or ship content simultaneously with backend fixtures/import contract.

## Author / E-E-A-T policy

Backend author is optional. Frontend schema already treats missing author as the Winimi brand Organization.

Rules:
- شخص خیالی ساخته نشود.
- اگر مقاله با نام شخص منتشر می‌شود، نام واقعی/قابل دفاع باشد.
- اگر author خالی است، brand organization publisher/author fallback قابل استفاده است.
- Health-adjacent content باید source-aware و محدود به تعریف/برچسب باشد.

## Slug policy

Article slugs:
- stable
- short
- descriptive
- lowercase ASCII preferred for operational stability unless existing CMS convention differs
- no date in slug
- no keyword stuffing

Proposed stable slugs:
- `choose-food-gift-box`
- `cookies-per-guest-guide`
- `cookie-storage-guide`
- `cheesecake-cold-storage`
- `cold-delivery-guide`

Persian title/H1 remains user-facing; slug is not required to transliterate every keyword.

## Publication strategy

F29S-D should ship the five foundational guides as **draft/source-controlled content first**, then publish through backend/CMS in a deterministic release/import path.

No direct Production DB mutation happens during GitHub development.

Required data per guide:
- slug
- title
- excerpt
- content
- category=`راهنمای انتخاب و سفارش`
- tags
- author (real or blank → Organization fallback)
- status/published_at controlled at activation
- cover image only when real approved media exists

## F29S-C Gate

```text
F29S_C_TOPIC_CLUSTER_ARCHITECTURE=PASS
CMS_CAPABILITY_AUDIT=PASS
NEW_CMS_REQUIRED=NO
PRIMARY_TOPIC=راهنمای انتخاب و سفارش
FOUNDATIONAL_GUIDES=5
HOME_GUIDE_DESTINATIONS_MAPPED=3
THIN_TOPIC_PROLIFERATION=BLOCKED
LOCAL_TOPICS=HOLD
YMYL_GUARD=PASS
NEXT=F29S_D_GUIDE_ARTICLE_FOUNDATION
```
