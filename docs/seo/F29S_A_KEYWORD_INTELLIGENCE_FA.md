# F29S-A — Keyword Intelligence & Competitor/SERP Research

تاریخ تحقیق: ۲۰۲۶-۰۹-۰۵  
Project: WINIMI / COOCI  
Repository: `sajadkhavas/cooci`  
Branch: `phase-29s-a/keyword-intelligence`  
Status: **RESEARCH COMPLETE / READY FOR KEYWORD-TO-URL MAPPING**

> این سند ادعای Search Volume عددی ندارد. تا زمانی که داده مستقیم Google Search Console / Google Ads Keyword Planner / ابزار معتبر با دسترسی واقعی وجود نداشته باشد، عدد Volume یا Difficulty جعل نمی‌شود. اولویت‌ها بر اساس تطابق تجاری با کاتالوگ واقعی وینیمی، مشاهده SERP/رقبا، تمایز Intent و ریسک Cannibalization تعیین شده‌اند.

## 1. منابع حقیقت

### Google / مراجع رسمی

- Google Search Essentials: استفاده از کلماتی که کاربر واقعاً برای یافتن محتوا به‌کار می‌برد و قراردادن طبیعی آن‌ها در title، main heading، alt و link text.
  - https://developers.google.com/search/docs/essentials
- Helpful, Reliable, People-First Content: محتوای اصیل، کامل، مفید، دارای تجربه/منبع و نه تولید انبوه صرفاً برای Search traffic.
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Ecommerce site structure: اهمیت لینک‌های crawlable بین Home → Category → Product و لینک‌دادن از محتوای راهنما به صفحات مهم تجاری.
  - https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- Ecommerce SEO guidance:
  - https://developers.google.com/search/docs/specialty/ecommerce
- Title links:
  - https://developers.google.com/search/docs/appearance/title-link
- Meta descriptions:
  - https://developers.google.com/search/docs/appearance/snippet

### SERP / Competitor evidence مشاهده‌شده در ۲۰۲۶-۰۹-۰۵

- Winimi live result برای queryهای خرید کوکی/کیک/باکس هدیه: `https://winimibakery.com/`
- Studio Shirini — Gift Box / Mini Cookie Mix: `https://studioshirini.com/product/گیفت-باکس/`, `https://studioshirini.com/product/کوکی-میکس-مینی/`
- CookieKade — سفارش سفارشی، هدیه و پذیرایی سازمانی: `https://www.cookiekade.ir/customize/`
- 180 Bakery — کاتالوگ مستقیم چیزکیک/کوکی: `https://180bakery.ir/store.html`
- Croissanta — category/menu visibility برای pastry/cheesecake: `https://croissantabakery.com/menu/`
- Bake Bahar — مقاله آموزشی چیزکیک سن سباستین: `https://bakebahar.ir/san-sebastian-cheesecake-recipe/`
- Rdiet — محتوای informational درباره تفاوت بدون شکر و بدون شکر افزوده: `https://rdiet.ir/بدون-شکر-با-بدون-شکر-افزوده-فرق-دار/`
- Masi Bakery — سیگنال Local برای کرج/غرب تهران: `https://masibakery.blogfa.com/`

## 2. جمع‌بندی SERP

### 2.1 سه خانواده Intent اصلی

1. **Transactional / خرید مستقیم**
   - خرید کوکی
   - خرید کوکی خانگی
   - خرید مینی کوکی
   - خرید چیزکیک
   - خرید کیک و دسر
   - خرید رول و کروسان
   - کوکی رژیمی / بدون قند افزوده
   - باکس هدیه کوکی / شیرینی

2. **Commercial investigation / Use-case**
   - کوکی برای پذیرایی
   - مینی کوکی برای پذیرایی
   - باکس هدیه برای تولد / تشکر
   - هدیه خوراکی
   - هدیه سازمانی خوراکی
   - سفارش سازمانی شیرینی / پذیرایی سازمانی
   - سفارش تعداد بالا

3. **Informational / Guide**
   - نگهداری کوکی
   - ماندگاری کوکی خانگی
   - برای پذیرایی چند کوکی لازم است
   - چطور برای هدیه انتخاب کنیم
   - شرایط نگهداری چیزکیک
   - ارسال سرد چیست / چه محصولاتی نیاز به ارسال سرد دارند
   - تفاوت بدون قند و بدون قند افزوده

### 2.2 Intent collisionهای مهم

- `چیزکیک سن سباستین` هم Product intent دارد و هم Recipe/How-to. صفحه محصول نباید با مقاله دستور پخت روی یک intent رقابت کند.
- `کوکی رژیمی` و `بدون قند افزوده` نزدیک YMYL/سلامت می‌شوند؛ وینیمی فقط باید اطلاعات محصول و برچسب تأییدشده را بیان کند، نه وعده پزشکی یا «مناسب دیابت» بدون تأیید معتبر.
- `باکس هدیه` می‌تواند Product/Category و همچنین Guide intent داشته باشد. `/gift` باید commercial landing بماند و guideها سؤال‌های انتخاب هدیه را پوشش دهند.
- `پذیرایی` هم category/use-case و هم guide intent دارد. صفحه تجاری باید انتخاب/سفارش را حل کند؛ مقاله باید محاسبه و تصمیم‌گیری را توضیح دهد.

## 3. Keyword Universe اولیه

| Keyword family | Intent | Target type پیشنهادی | Priority | Evidence | Cannibalization risk |
|---|---|---|---|---|---|
| خرید کوکی | Transactional | Home / Cookies category | P0 | Winimi + commerce SERP | High — Home vs category |
| خرید کوکی خانگی | Transactional | Cookies category | P0 | current category copy + commerce SERP | Medium |
| انواع کوکی | Commercial | Cookies category | P0 | category/product SERP | Medium |
| کوکی شکلاتی / گردویی | Transactional/Product | Product detail | P0 | live catalog | Low if product-specific |
| خرید مینی کوکی | Transactional | Mini-cookies category | P0 | Studio + retail SERP | Low |
| مینی کوکی پذیرایی | Commercial | Mini-cookies category + guide support | P0 | SERP/use-case | Medium |
| کوکی برای پذیرایی | Commercial | Hosting intent landing/category support | P0 | site IA + market pages | High unless mapped |
| برای پذیرایی چند کوکی لازم است | Informational | Guide | P0 | informational intent | Low |
| خرید چیزکیک | Transactional | Cheesecake category/filter | P0 | bakery/store SERP | Medium |
| چیزکیک سن سباستین | Mixed | Product detail | P0 | Winimi inventory + store SERP | High vs recipe guide |
| نگهداری چیزکیک سن سباستین | Informational | Guide | P1 | instructional SERP | Low |
| خرید کیک و دسر | Transactional | Cakes/desserts category | P0 | store SERP | Medium |
| رول و کروسان | Transactional/Commercial | Pastry category | P1 | bakery menu SERP | Low |
| خرید کروسان | Transactional | Pastry category/product | P1 | bakery/menu SERP | Medium |
| کوکی رژیمی | Mixed commercial/YMYL-adjacent | Diet category | P0 | commerce SERP | High semantic risk |
| کوکی بدون قند افزوده | Commercial | Diet category | P0 | commerce/content SERP | Medium |
| تفاوت بدون قند و بدون قند افزوده | Informational/YMYL-adjacent | Evidence-safe guide | P1 | nutrition SERP | Low; requires cautious sourcing |
| باکس هدیه کوکی | Transactional | `/gift` / valid gift catalog when published | P0 | Studio Gift Box SERP | Medium |
| باکس هدیه شیرینی | Transactional | `/gift` | P0 | gift SERP | Medium |
| هدیه خوراکی | Commercial | `/gift` | P1 | gift SERP | Medium |
| باکس هدیه تولد | Commercial | `/gift` + supporting guide if justified | P1 | gift occasion SERP | Medium |
| هدیه تشکر خوراکی | Commercial | `/gift` + guide | P2 | occasion intent | Medium |
| هدیه سازمانی | Commercial/B2B | `/corporate` | P0 | CookieKade + corporate gift SERP | Medium |
| هدیه سازمانی خوراکی | Commercial/B2B | `/corporate` | P0 | corporate gift SERP | Low |
| پذیرایی سازمانی | Commercial/B2B | `/corporate` | P0 | CookieKade + catering SERP | Medium |
| سفارش تعداد بالا شیرینی | Commercial/B2B | `/corporate` | P1 | competitor content | Low |
| نگهداری کوکی | Informational | Guide | P0 | instructional/video SERP | Low |
| ماندگاری کوکی خانگی | Informational | Guide | P0 | informational intent | Low |
| چطور کوکی تازه بماند | Informational | Guide | P1 | informational intent | Low |
| راهنمای انتخاب هدیه | Informational/Commercial assist | Guide hub/article | P0 | current Home intent | Low |
| شرایط ارسال سرد | Informational/Service | Shipping/Guide | P1 | actual chilled products | Medium with `/shipping` |
| سفارش کوکی کرج | Local transactional | City/local page only if delivery truth verified | P1 HOLD | local competitor signal | Very high doorway risk |
| خرید کوکی کرج | Local transactional | City/local page only if verified | P1 HOLD | local signal | Very high doorway risk |
| خرید کوکی تهران | Local transactional | City/local page only if verified | P1 HOLD | broad local market | Very high doorway risk |
| وینیمی / وینیمی بیکری | Navigational/Brand | Home/About | P0 | brand | Low |

## 4. Priority clusters

### Cluster P0-1 — Cookies / Mini Cookies

Commercial destinations:
- `/products/category/cookies`
- `/products/category/mini-cookies`
- relevant product detail URLs

Supporting guides candidates:
- راهنمای انتخاب کوکی برای پذیرایی
- برای هر نفر چند کوکی در نظر بگیریم؟
- نگهداری و ماندگاری کوکی خانگی

هدف: گرفتن intent خرید بدون اینکه guide و category برای یک query اصلی با هم رقابت کنند.

### Cluster P0-2 — Gift / Occasion

Commercial destination:
- `/gift`

Supporting guides candidates:
- چطور باکس هدیه خوراکی انتخاب کنیم؟
- راهنمای انتخاب هدیه برای تولد، تشکر و مناسبت شخصی
- انتخاب تعداد/ترکیب برای هدیه چندنفره فقط در صورت وجود داده واقعی

### Cluster P0-3 — Corporate / Hosting

Commercial destination:
- `/corporate`

Supporting guides candidates:
- راهنمای سفارش شیرینی برای جلسه یا رویداد
- چه اطلاعاتی برای استعلام سفارش سازمانی لازم است؟
- بسته‌بندی/لوگو/فاکتور فقط بر اساس capability واقعی و تأییدشده

### Cluster P0-4 — Cheesecake / Chilled

Commercial destinations:
- cakes/desserts category
- cheesecake editorial filter/category
- product detail for San Sebastian and other published products

Supporting guides:
- شرایط نگهداری چیزکیک
- ارسال سرد چیست و چه زمانی لازم است؟

Rule: Recipe intent (`طرز تهیه چیزکیک سن سباستین`) عمداً خارج از اولویت اولیه Winimi است مگر بعداً business/content strategy آن را توجیه کند. هدف اولیه فروش/انتخاب/نگهداری است، نه تبدیل سایت فروشگاهی به سایت رسپی.

### Cluster P0-5 — Diet / No-added-sugar

Commercial destination:
- `/products/category/diet-diabetic`

Supporting informational content only when evidence-safe:
- تفاوت «بدون قند افزوده» با ادعاهای پزشکی
- نحوه خواندن ترکیبات/آلرژن محصول

Rule: عبارت‌هایی مثل «مناسب افراد دیابتی»، «سالم»، «کم‌کالری» یا ادعای درمانی بدون داده تأییدشده ممنوع‌اند.

## 5. Competitor gap analysis

### Studio Shirini

Strengths:
- Product landing مشخص برای Gift Box و Mini Cookie Mix.
- تعداد/ترکیب بسته به‌صورت مستقیم دیده می‌شود.
- بخش مجله در IA وجود دارد.

Opportunity for Winimi:
- Winimi می‌تواند با SSR، Backend-authoritative availability، راهنمای انتخاب واقعی و internal linking بهتر رقابت کند.

### CookieKade

Strengths:
- صفحه مستقل سفارش سفارشی/سازمانی.
- Use caseهای هدیه و پذیرایی سازمانی را شفاف پوشش می‌دهد.

Opportunity:
- `/corporate` Winimi موجود است ولی باید Keyword mapping، FAQ واقعی و مسیرهای مرتبط guide → corporate تکمیل شود.

### 180 Bakery / Croissanta

Strengths:
- Inventory/category breadth و نام محصول مستقیم.

Weakness/gap:
- فرصت برای Winimi در محتوای decision-support، Product truth و structured internal linking.

### Bake Bahar / informational publishers

Strength:
- پوشش عمیق how-to/recipe برای چیزکیک.

Decision:
- Winimi نباید برای queryهای recipe بدون مزیت واقعی وارد جنگ محتوایی شود. اطلاعات نگهداری/انتخاب/تحویل با نزدیکی بیشتر به تجربه خرید اولویت دارد.

## 6. Local SEO decision at F29S-A

سیگنال Local برای کرج/غرب تهران در بازار مشاهده شد، اما Search Volume قابل اتکا و محدوده خدمات فعلی Winimi در این تحقیق از منبع Production جدید اثبات نشده است.

بنابراین:
- Local keywords در Universe حفظ می‌شوند.
- ساخت URL جدید شهر در F29S-A **BLOCKED/HOLD** است.
- هیچ `city/karaj`, `city/tehran` یا doorway page جدیدی فقط براساس keyword ایجاد نمی‌شود.
- تصمیم نهایی در F29S-G فقط پس از verification محدوده delivery واقعی و داده Keyword/Search Console/Planner انجام می‌شود.

## 7. Volume / Difficulty policy

در این تحقیق:
- `Search Volume = UNKNOWN / NOT FABRICATED`
- `Keyword Difficulty = UNKNOWN / NOT FABRICATED`

برای اولویت‌بندی قبل از Production از این سیگنال‌ها استفاده می‌شود:
1. تطابق مستقیم با محصولات و قابلیت واقعی Winimi.
2. وجود SERP تجاری/محتوایی مشاهده‌شده.
3. امکان پاسخ بهتر و اصیل‌تر از رقبا.
4. فاصله از YMYL و ادعاهای غیرقابل اثبات.
5. ریسک Cannibalization.
6. مسیر Conversion مشخص.

پس از Search Console ownership / داده واقعی، Priorityها با impressions, clicks, CTR, average position و query/page pairs بازتنظیم می‌شوند.

## 8. Cannibalization rules for F29S-B

1. Home نباید Primary target تمام خانواده‌های محصول باشد؛ Home broad brand/shop intent می‌گیرد.
2. هر Category یک primary commercial family یکتا دارد.
3. Product detail نام/نوع محصول مشخص را target می‌کند، نه primary category keyword عمومی.
4. Guideها informational question/decision intent می‌گیرند و با exact commercial title رقابت نمی‌کنند.
5. `/gift` commercial gift intent؛ guideهای هدیه informational decision intent.
6. `/corporate` B2B conversion intent؛ guideهای سازمانی informational/pre-purchase intent.
7. `/shipping` policy/service truth؛ guide chilled-storage educational intent.
8. Local page فقط با service truth و unique local value.

## 9. نتیجه F29S-A

### Accepted primary opportunities

P0:
- خرید کوکی خانگی / انواع کوکی
- خرید مینی کوکی / مینی کوکی پذیرایی
- خرید کیک و دسر / خرید چیزکیک
- کوکی رژیمی / بدون قند افزوده (با guard پزشکی)
- باکس هدیه کوکی و شیرینی
- هدیه سازمانی / پذیرایی سازمانی
- راهنمای انتخاب هدیه
- راهنمای پذیرایی و تعداد
- نگهداری/ماندگاری کوکی
- نگهداری و ارسال سرد چیزکیک/دسر

### Deferred / guarded opportunities

- Recipe-heavy queries مثل `طرز تهیه چیزکیک سن سباستین`: DEFERRED
- medical claims برای diabetes/health: GUARDED
- city landing pages: HOLD UNTIL SERVICE + DEMAND EVIDENCE
- هر URL مناسبتی زیاد و مشابه: BLOCKED unless unique intent/value is proven

## 10. Gate

```text
F29S_A_KEYWORD_INTELLIGENCE=PASS
EXACT_SEARCH_VOLUME_CLAIMED=NO
EXACT_KEYWORD_DIFFICULTY_CLAIMED=NO
SERP_RESEARCH=PASS
COMPETITOR_RESEARCH=PASS
INTENT_SEGMENTATION=PASS
CANNIBALIZATION_RISKS=DOCUMENTED
LOCAL_DOORWAY_GUARD=PASS
YMYL_GUARD=PASS
NEXT=F29S_B_KEYWORD_TO_URL_MAPPING
```
