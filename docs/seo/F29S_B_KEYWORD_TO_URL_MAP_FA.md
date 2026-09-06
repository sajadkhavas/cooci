# F29S-B — Keyword-to-URL Map

تاریخ: ۲۰۲۶-۰۹-۰۵  
Project: WINIMI / COOCI  
Repository: `sajadkhavas/cooci`  
Branch: `phase-29s-b/keyword-url-map`  
Status: **COMPLETE / READY FOR TOPIC CLUSTER DESIGN**

> این Map بر پایه F29S-A، Route inventory فعلی و اصل عدم Cannibalization تنظیم شده است. Search volume عددی در دسترس نیست و جعل نشده است.

## قواعد مالکیت Keyword

1. Home فقط broad brand/shop intent را می‌گیرد؛ primary keyword دسته‌ها را تصاحب نمی‌کند.
2. هر Category یک commercial family مشخص دارد.
3. Product detail روی نام/نوع همان محصول و modifier خرید تمرکز می‌کند.
4. Guideها intent اطلاعاتی/تصمیم‌گیری را می‌گیرند، نه exact commercial category keyword.
5. `/gift` مالک intent تجاری هدیه است؛ guideهای هدیه informational هستند.
6. `/corporate` مالک B2B conversion intent است؛ guideهای سازمانی pre-purchase/informational هستند.
7. `/shipping` فقط policy/service truth را پوشش می‌دهد؛ guideهای نگهداری و ارسال سرد آموزش را پوشش می‌دهند.
8. Local page بدون service truth و demand evidence ایجاد نمی‌شود.
9. Topic hubها فقط بعد از وجود چند محتوای واقعی مرتبط indexable می‌شوند.
10. Query/filter URLهای فروشگاه برای SEO target مستقل استفاده نمی‌شوند و noindex policy Phase 28 حفظ می‌شود.

## Map اصلی URLهای indexable

| URL / Template | Primary keyword / topic ownership | Secondary / semantic terms | Intent | Title direction | H1 direction | Indexability | Cannibalization guard |
|---|---|---|---|---|---|---|---|
| `/` | فروشگاه آنلاین وینیمی / خرید آنلاین کوکی، کیک و باکس هدیه | شیرینی دست‌ساز، هدیه، پذیرایی، دسر | Broad commercial + Brand | خرید کوکی، کیک و باکس هدیه \| وینیمی بیکری | پیام برند/انتخاب broad، نه «خرید کوکی خانگی» | Index | category keywords فقط در لینک/بدنه، نه primary ownership |
| `/products` | محصولات وینیمی / فروشگاه محصولات وینیمی | کوکی، مینی کوکی، کیک، دسر، رول، کروسان | Commercial browse | محصولات وینیمی \| کوکی، کیک، دسر و شیرینی | همه محصولات وینیمی | Index | «خرید کوکی خانگی» به cookies category واگذار شود |
| `/products/category/cookies` | خرید کوکی خانگی | انواع کوکی، کوکی وینیمی | Transactional | خرید کوکی خانگی \| انواع کوکی وینیمی | کوکی‌های وینیمی؛ انتخاب بر اساس طعم و حال‌وهوا | Index only if backend category published | Home نباید همین primary را بگیرد |
| `/products/category/mini-cookies` | خرید مینی کوکی | مینی کوکی پذیرایی، مینی کوکی هدیه | Transactional + Commercial | خرید مینی کوکی \| برای پذیرایی و هدیه | مینی کوکی؛ انتخاب جمع‌وجور برای پذیرایی | Index only if backend category published | guide «برای پذیرایی چند کوکی» informational بماند |
| `/products/category/cakes` | خرید کیک و دسر | کیک خانگی، دسر وینیمی | Transactional | خرید کیک و دسر \| وینیمی | کیک و دسر برای جشن، پذیرایی یا انتخاب شیرین | Index only if backend category published | cheesecake sub-intent جدا شود |
| `/products/category/cheesecakes` | خرید چیزکیک | انواع چیزکیک، چیزکیک وینیمی | Transactional | خرید چیزکیک \| انواع چیزکیک وینیمی | چیزکیک‌های وینیمی | Index only when filtered editorial result has real products | recipe queries ممنوع از target اصلی |
| `/products/category/pastry` | خرید رول و کروسان | کروسان، محصولات خمیری | Transactional | خرید رول و کروسان \| محصولات خمیری وینیمی | رول و کروسان؛ برای صبحانه و میان‌وعده | Index only if backend category published | product-specific pastry terms به detail pages |
| `/products/category/diet-diabetic` | کوکی رژیمی و بدون قند افزوده | محصولات بدون قند افزوده، اطلاعات ترکیبات | Commercial/YMYL-adjacent | کوکی رژیمی و بدون قند افزوده \| وینیمی | انتخاب‌های رژیمی و بدون قند افزوده | Index only if published | هیچ ادعای «مناسب دیابت/سالم» بدون evidence |
| `/gift` | باکس هدیه کوکی و شیرینی | هدیه خوراکی، باکس هدیه تولد، هدیه تشکر | Commercial | باکس هدیه کوکی و شیرینی \| وینیمی | هدیه‌ای متناسب با مناسبت شما | Index | guide هدیه روی «چطور انتخاب کنیم» تمرکز کند |
| `/corporate` | هدیه و پذیرایی سازمانی | سفارش شرکتی، سفارش تعداد بالا، هدیه کارکنان/مشتریان | B2B commercial | هدیه و پذیرایی سازمانی \| استعلام سفارش وینیمی | استعلام هدیه و پذیرایی سازمانی | Index | مقاله B2B فقط pre-purchase/راهنما باشد |
| `/blog` | راهنماهای وینیمی | انتخاب، سفارش، نگهداری | Informational hub | راهنماهای وینیمی \| انتخاب، سفارش و نگهداری | راهنماهای وینیمی | Conditional | noindex/omit sitemap when zero published posts |
| `/blog/topic/:topic` | Topic-specific informational hub | supporting questions | Informational hub | `[موضوع] \| راهنماهای وینیمی` | heading topic واقعی | Conditional | فقط topic دارای published posts |
| `/blog/:slug` | یک سؤال/Intent اطلاعاتی یکتا | related semantic terms | Informational | title مقاله | title مقاله | Index if published | exact commercial category title ممنوع |
| `/faq` | سوالات متداول وینیمی | سفارش، پرداخت، ارسال، محصولات | Informational/support | سوالات متداول سفارش، پرداخت و ارسال \| وینیمی | سوالات متداول | Index when real FAQs exist | article content را تکرار کامل نکند |
| `/about` | درباره وینیمی / برند وینیمی | داستان برند، هویت فروشگاه | Brand/Trust | درباره وینیمی بیکری | درباره وینیمی | Index | claimهای بدون evidence ممنوع |
| `/quality` | کیفیت و اطلاعات محصول وینیمی | مواد اولیه، ترکیبات، آلرژن، نگهداری | Trust/Informational | کیفیت و اطلاعات محصولات \| وینیمی | کیفیت، ترکیبات و اطلاعات قابل تأیید | Index if content truthful/substantial | guide پزشکی/تغذیه‌ای جدا و evidence-safe |
| `/shipping` | ارسال سفارش وینیمی / روش‌های تحویل | ارسال سرد، محدوده تحویل | Service/Commercial support | روش‌های ارسال و تحویل سفارش \| وینیمی | ارسال و تحویل سفارش | Index | guide «ارسال سرد چیست» informational باشد |
| `/contact` | تماس با وینیمی | پشتیبانی، اطلاعات تماس | Navigational/Trust | تماس با وینیمی | تماس با وینیمی | Index | NAP truth only |
| `/reviews` | نظر مشتریان وینیمی | تجربه خرید، بازخورد | Trust/UGC | نظرات مشتریان وینیمی | تجربه و نظر مشتریان | Conditional | فقط review واقعی؛ no fabricated rating |
| `/gallery` | گالری وینیمی | تصاویر محصولات/بسته‌بندی | Visual/Brand | گالری وینیمی | گالری وینیمی | Conditional | empty page noindex |
| `/locations` | محدوده خدمات وینیمی | شهرهای قابل سرویس | Local/service hub | محدوده ارسال و خدمات وینیمی | محدوده خدمات وینیمی | Conditional | فقط published/verified city data |
| `/city/:slug` | خرید/سفارش محلی فقط در صورت demand + delivery truth | city modifiers | Local transactional | city-specific truthful title | city-specific truthful H1 | HOLD/Conditional | doorway guard اجباری |
| `/privacy` | حریم خصوصی وینیمی | privacy policy | Legal | حریم خصوصی \| وینیمی | حریم خصوصی | Index | SEO traffic target نیست |
| `/terms` | قوانین و شرایط وینیمی | terms/order rules | Legal | قوانین و شرایط \| وینیمی | قوانین و شرایط | Index | SEO traffic target نیست |

## Product detail template ownership

Template: `/products/:slug`

### Primary ownership

`[نام دقیق محصول]` + modifiers طبیعی خرید/قیمت فقط وقتی با محتوا و SERP سازگار است.

نمونه برای محصول واقعی موجود:
- `چیزکیک سن سباستین`
- commercial modifier ثانویه: `خرید چیزکیک سن سباستین`

### Rules

- Title اول از Backend SEO title معتبر؛ fallback نام محصول.
- H1 نام واقعی محصول.
- category primary مثل `خرید چیزکیک` نباید primary همه product pages شود.
- recipe/how-to intent روی Product page هدف‌گذاری نشود.
- ingredients/allergens/storage فقط verified backend data.
- product-specific FAQ فقط اگر واقعاً در CMS/data وجود دارد.

## Guide ownership — اولین بسته محتوایی پیشنهادی

این‌ها URL قطعی نیستند تا F29S-C/D taxonomy و Backend slug نهایی شود، اما intent ownership قطعی است:

| Working guide | Primary informational intent | Commercial destination | Forbidden competing intent |
|---|---|---|---|
| راهنمای انتخاب کوکی برای پذیرایی | کوکی مناسب پذیرایی | mini-cookies / cookies | خرید مینی کوکی |
| برای هر نفر چند کوکی در نظر بگیریم؟ | تعداد کوکی برای پذیرایی | mini-cookies / corporate when relevant | قیمت/خرید مینی کوکی |
| نگهداری و ماندگاری کوکی خانگی | نگهداری کوکی / ماندگاری کوکی | cookies + relevant products | خرید کوکی خانگی |
| چطور باکس هدیه خوراکی انتخاب کنیم؟ | راهنمای انتخاب باکس هدیه | `/gift` | باکس هدیه کوکی (commercial exact) |
| انتخاب هدیه برای تولد و تشکر | انتخاب هدیه خوراکی | `/gift` | product/category exact keywords |
| شرایط نگهداری چیزکیک | نگهداری چیزکیک | cakes/cheesecakes/products | خرید چیزکیک |
| ارسال سرد چیست و چه زمانی لازم است؟ | ارسال سرد / نگهداری سرد | `/shipping` + chilled products | shipping policy exact page ownership |
| تفاوت بدون قند افزوده با ادعاهای مشابه | معنای بدون قند افزوده | diet category | توصیه پزشکی / مناسب دیابت |
| برای استعلام سفارش سازمانی چه اطلاعاتی لازم است؟ | راهنمای سفارش سازمانی | `/corporate` | هدیه سازمانی exact commercial |

## Home internal-anchor ownership

Home می‌تواند anchorهای توصیفی زیر را استفاده کند بدون اینکه مالک Primary آن‌ها شود:

- «مشاهده کوکی‌های خانگی» → cookies category
- «مینی کوکی برای پذیرایی» → mini-cookies category
- «دیدن کیک و دسر» → cakes category
- «راهنمای انتخاب هدیه» → guide واقعی بعد از F29S-D
- «باکس هدیه» → `/gift`
- «سفارش سازمانی» → `/corporate`

## Query/filter policy

URLهای زیر برای SEO landing مستقل نیستند:
- `/products?q=...`
- `/products?sort=...`
- `/products?shipping=...`
- `/products?stock=true`
- ترکیب فیلترها

Policy Phase 28 حفظ می‌شود: `noindex,follow` + canonical clean root/category as applicable.

## Local mapping decision

Keywordهای کرج/تهران در Map نگه داشته می‌شوند ولی target URL هنوز ساخته نمی‌شود:

```text
LOCAL_TARGET=HOLD
REQUIRES=VERIFIED_DELIVERY_TRUTH + UNIQUE_LOCAL_VALUE + DEMAND_EVIDENCE
DOORWAY_PAGES=FORBIDDEN
```

## Cannibalization matrix

| Query family | Owner | Must not own |
|---|---|---|
| خرید کوکی خانگی | cookies category | Home, guides, product generic titles |
| خرید مینی کوکی | mini-cookies category | hosting guide |
| خرید چیزکیک | cheesecakes category | San Sebastian product, storage guide |
| چیزکیک سن سباستین | specific product | generic category, recipe guide |
| باکس هدیه کوکی/شیرینی | `/gift` | guide hub |
| راهنمای انتخاب هدیه | guide | `/gift` primary title |
| هدیه/پذیرایی سازمانی | `/corporate` | generic guides |
| نگهداری کوکی | guide | cookies category primary title |
| ارسال و تحویل سفارش | `/shipping` | chilled guide exact title |
| کوکی رژیمی/بدون قند افزوده | diet category | health/medical article exact commercial target |

## F29S-B Gate

```text
F29S_B_KEYWORD_TO_URL_MAP=PASS
CURRENT_INDEXABLE_ROUTES_MAPPED=YES
COMMERCIAL_OWNERSHIP=DEFINED
GUIDE_INTENT_OWNERSHIP=DEFINED
PRODUCT_TEMPLATE_OWNERSHIP=DEFINED
FILTER_NOINDEX_POLICY=PRESERVED
LOCAL_TARGET=HOLD_WITH_GUARD
CANNIBALIZATION_MATRIX=PASS
NEXT=F29S_C_CONTENT_ARCHITECTURE_TOPIC_CLUSTERS
```
