## هدف
تکمیل فرانت وینیمی بیکری برای رتبه اول گوگل در حوزه «کوکی خانگی/سفارش کوکی» — بدون افزودن سبد خرید یا چک‌اوت. تمرکز روی صفحات محتوایی SEO-محور، صفحات دسته‌بندی، landing pageهای شهری، و پاکسازی مسیرهای اضافی.

## وضعیت فعلی (بررسی شد)
- ۱۶ صفحه فعال، اما ۶ صفحه e-commerce بلااستفاده (Cart, Checkout, PaymentCallback, OrderSuccess, OrderDetail و context مربوطه) که با قانون پروژه (بدون سبد خرید) در تضادند.
- صفحات محتوایی SEO مثل بلاگ، دسته‌بندی محصول، مقایسه، صفحه شهری، دستور پخت و … وجود ندارد.
- Schema.org فقط Bakery عمومی است؛ Product / FAQ / Breadcrumb / Article / LocalBusiness نداریم.

---

## فاز ۱ — پاکسازی (حذف کدهای e-commerce)
حذف کامل مسیرها و فایل‌های زیر چون با پوزیشنینگ برند و قانون «بدون سبد/چک‌اوت» در تضادند و SEO را رقیق می‌کنند:
- `CartPage`, `CheckoutPage`, `PaymentCallbackPage`, `OrderSuccessPage`, `OrderDetailPage`
- `src/context/CartContext.tsx`, `src/lib/orders.ts`, `src/lib/payment-adapter.ts`
- مسیرهای مربوطه در `App.tsx` و حذف `CartProvider`

## فاز ۲ — صفحات جدید SEO-محور (بلوک اصلی رشد ارگانیک)

### الف) صفحات دسته‌بندی محصول (Category Landing Pages)
هرکدام با H1 اختصاصی، توضیح ۳۰۰+ کلمه‌ای، لیست محصولات فیلترشده، FAQ اختصاصی و Schema.
- `/products/category/cookies` — همه کوکی‌ها
- `/products/category/mini-cookies` — مینی کوکی
- `/products/category/diet-diabetic` — کوکی رژیمی و دیابتی
- `/products/category/cakes` — کیک‌ها
- `/products/category/cheesecakes` — چیزکیک
- `/products/category/gift-boxes` — باکس هدیه

### ب) صفحات شهری / محلی (Local SEO — کلیدواژه‌های پرترافیک)
- `/tehran` — سفارش کوکی در تهران
- `/karaj` — سفارش کوکی در کرج
- `/andisheh` — کوکی اندیشه (شهر مبدأ)
هرکدام: نقشه، ساعت کاری، محدوده ارسال، محصولات پیشنهادی، FAQ محلی، LocalBusiness schema.

### ج) صفحات کاربردی/مناسبتی (Money Pages)
- `/gift` — کوکی هدیه (تولد، سالگرد، تشکر شرکتی)
- `/corporate` — سفارش عمده و شرکتی (B2B)
- `/occasions/birthday` — کوکی تولد
- `/occasions/yalda` — باکس یلدا (فصلی)

### د) بلاگ / راهنما (Content Hub برای long-tail)
- `/blog` — لیست مقالات (داده در `src/data/blogPosts.ts` هست ولی صفحه نیست)
- `/blog/:slug` — صفحه مقاله با Article schema
- ۶ مقاله شروع: «تفاوت کوکی و بیسکویت»، «نگهداری کوکی خانگی»، «کوکی رژیمی چیست؟»، «راهنمای انتخاب باکس هدیه»، «کوکی برای دیابتی‌ها»، «تاریخچه کوکی».

### ه) صفحات اعتماد
- `/reviews` — نظرات مشتریان (با Review schema)
- `/quality` — استانداردهای کیفیت و بهداشت (E-E-A-T)

## فاز ۳ — بازسازی صفحات موجود

- **HomePage**: افزودن بخش «دسته‌بندی‌ها» با لینک به category pages، بخش «مقالات اخیر»، بخش «مناطق ارسال» (لینک داخلی به صفحات شهری). داخلی‌سازی anchor text.
- **ProductsPage**: افزودن فیلتر و لینک به دسته‌بندی‌ها؛ H1 و توضیح متنی SEO بالای لیست.
- **ProductDetailPage**: افزودن Product + Review + Breadcrumb schema، بخش «محصولات مرتبط»، بخش «سوالات این محصول».
- **FAQPage**: افزودن FAQPage schema (الان نیست).
- **AboutPage**: افزودن Person schema برای بنیان‌گذار (E-E-A-T)، تصویر کارگاه.
- **ContactPage**: افزودن LocalBusiness schema + نقشه embed.
- **Footer**: افزودن لینک به دسته‌بندی‌ها، صفحات شهری، بلاگ.

## فاز ۴ — زیرساخت SEO فنی

- کامپوننت `Breadcrumbs` قابل استفاده در همه صفحات داخلی + BreadcrumbList JSON-LD.
- کامپوننت `ProductSchema`, `ArticleSchema`, `LocalBusinessSchema`, `FAQSchema` قابل reuse.
- به‌روزرسانی `scripts/generate-sitemap.ts` برای شامل کردن همه صفحات جدید (دسته‌بندی، شهر، مناسبت، بلاگ).
- افزودن `hreflang` fa-IR و بهبود `<html lang>`.
- افزودن Open Graph image واقعی ۱۲۰۰x۶۳۰ برای هر دسته بزرگ.
- بهبود Core Web Vitals: `loading="lazy"` روی تصاویر پایین fold، `<link rel="preload">` روی هیرو، `width/height` صریح.
- افزودن `<link rel="alternate">` بین صفحه دسته و محصولات مرتبط.

## فاز ۵ — لینک‌سازی داخلی و UX نهایی
- Related Products در PDP.
- Related Articles در انتهای هر مقاله.
- CTA «مشاهده در دسته X» در PDP.
- منوی هدر: افزودن dropdown برای «دسته‌بندی‌ها» و «مقالات».

---

## بخش فنی (خلاصه)
- Stack موجود: React + Vite + Tailwind + react-router + react-helmet-async — همه ابزار لازم موجود است، backend لازم نیست.
- داده‌ها از فایل استاتیک `src/data/*.ts` می‌آیند (blogPosts موجود، فقط UI ندارد).
- Schema.org از طریق `<script type="application/ld+json">` در `SEO.tsx` که کامپوننت‌های اختصاصی بسط داده می‌شود.

## خروجی نهایی این پلن
- ۶ صفحه بلااستفاده حذف می‌شود.
- ~۲۰ صفحه جدید SEO-محور اضافه می‌شود.
- کل sitemap از ~۳۶ URL به ~۶۰+ URL می‌رسد، همه دارای intent مشخص.
- هر صفحه محتوایی دارای schema اختصاصی می‌شود.

## Things to customize (بعد از پیاده‌سازی)
- متن مقالات بلاگ (پیش‌نویس AI، ولی بازبینی انسانی لازم).
- عکس‌های واقعی کارگاه و بنیان‌گذار.
- نظرات واقعی مشتریان (فعلاً ۳ نمونه placeholder).
- شماره ثبت / مجوز بهداشت (اگر دارید) در Footer.

---

## سؤال قبل از شروع
آیا با **حذف کامل صفحات سبد خرید/چک‌اوت (فاز ۱)** موافقید؟ چون طبق قانون پروژه نباید باشند، ولی می‌خواهم مطمئن شوم قبل از حذف.