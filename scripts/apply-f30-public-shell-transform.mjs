import fs from "node:fs";

const update = (path, transform) => {
  const before = fs.readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`${path}: transform made no change`);
  fs.writeFileSync(path, after);
};

const replaceOnce = (source, oldValue, newValue, label) => {
  if (!source.includes(oldValue)) {
    if (source.includes(newValue)) return source;
    throw new Error(`missing transform anchor: ${label}`);
  }
  return source.replace(oldValue, newValue);
};

update("src/pages/ProductsPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(
    next,
    'import { useCatalogDirectory } from "@/hooks/useCatalogDirectory";\n',
    'import { useCatalogDirectory } from "@/hooks/useCatalogDirectory";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\n',
    "ProductsPage public shell import",
  );
  next = replaceOnce(
    next,
    '  const [searchParams, setSearchParams] = useSearchParams();\n  const { categories, landings, isLoading: categoriesLoading } = useCatalogDirectory();',
    '  const [searchParams, setSearchParams] = useSearchParams();\n  const shell = usePublicShellContent().catalog;\n  const { categories, landings, isLoading: categoriesLoading } = useCatalogDirectory();',
    "ProductsPage shell binding",
  );
  next = replaceOnce(
    next,
    `  const name = isFilteredEditorialCategory\n    ? content?.name || "محصولات وینیمی"\n    : backendCategory?.name || content?.name || "محصولات وینیمی";\n  const heading = isFilteredEditorialCategory\n    ? content?.heading || name\n    : backendCategory?.name || content?.heading || name;\n  const intro = isFilteredEditorialCategory\n    ? content?.intro || "محصولات این مجموعه را بررسی کن."\n    : backendCategory?.description ||\n      content?.intro ||\n      "محصول موردنظرت را با دسته‌بندی، جست‌وجو، مرتب‌سازی و فیلترهای فروشگاه پیدا کن.";\n  const seoTitle = isFilteredEditorialCategory\n    ? content?.seoTitle || name\n    : backendCategory?.seo.title ||\n      content?.seoTitle ||\n      (backendCategory ? \`خرید \${backendCategory.name}\` : "محصولات");\n  const seoDescription = isFilteredEditorialCategory\n    ? content?.seoDescription || intro\n    : backendCategory?.seo.description ||\n      backendCategory?.description ||\n      content?.seoDescription ||\n      "مشاهده، جست‌وجو، فیلتر و خرید آنلاین محصولات فعال وینیمی با قیمت و موجودی دریافت‌شده از سرور.";\n`,
    `  const name = slug\n    ? isFilteredEditorialCategory\n      ? content?.name || shell.heading\n      : backendCategory?.name || content?.name || shell.heading\n    : shell.heading;\n  const heading = slug\n    ? isFilteredEditorialCategory\n      ? content?.heading || name\n      : backendCategory?.name || content?.heading || name\n    : shell.heading;\n  const intro = slug\n    ? isFilteredEditorialCategory\n      ? content?.intro || shell.intro\n      : backendCategory?.description || content?.intro || shell.intro\n    : shell.intro;\n  const seoTitle = slug\n    ? isFilteredEditorialCategory\n      ? content?.seoTitle || name\n      : backendCategory?.seo.title ||\n        content?.seoTitle ||\n        (backendCategory ? \`خرید \${backendCategory.name}\` : shell.metaTitle)\n    : shell.metaTitle;\n  const seoDescription = slug\n    ? isFilteredEditorialCategory\n      ? content?.seoDescription || intro\n      : backendCategory?.seo.description ||\n        backendCategory?.description ||\n        content?.seoDescription ||\n        shell.metaDescription\n    : shell.metaDescription;\n`,
    "ProductsPage SEO shell",
  );
  next = replaceOnce(
    next,
    '              title="دسته را انتخاب کن یا با فیلترها میان همه محصولات بگرد"\n              description="هر دسته یک URL مستقل و قابل اشتراک دارد، اما انتخاب، فیلتر، مرتب‌سازی و محصولات همگی داخل همین فروشگاه باقی می‌مانند."',
    '              title={shell.categoriesTitle}\n              description={shell.categoriesDescription}',
    "ProductsPage category shell",
  );
  next = replaceOnce(
    next,
    '                  همه محصولات\n                </Link>',
    '                  {shell.allProductsLabel}\n                </Link>',
    "ProductsPage all products label",
  );
  return next;
});

update("src/pages/BlogListPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { SEO } from "@/components/SEO";\n', 'import { SEO } from "@/components/SEO";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\n', "BlogList shell import");
  next = replaceOnce(next, '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n', '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const shell = usePublicShellContent().blogIndex;\n', "BlogList shell binding");
  next = replaceOnce(next, '  const title = "راهنماهای وینیمی";\n  const description =\n    "مقاله‌های منتشرشده وینیمی در موضوعات واقعی فروشگاه برای انتخاب، سفارش و نگهداری آگاهانه‌تر.";\n', '  const title = shell.heading;\n  const description = shell.intro;\n', "BlogList heading copy");
  next = replaceOnce(next, '        title={title}\n        description={description}', '        title={shell.metaTitle}\n        description={shell.metaDescription}', "BlogList SEO metadata");
  return next;
});

update("src/pages/ContactPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";\n', 'import { usePublicShellContent } from "@/hooks/usePublicShellContent";\nimport { useStorefrontSettings } from "@/hooks/useStorefrontSettings";\n', "Contact shell import");
  next = replaceOnce(next, '  const { settings } = useStorefrontSettings();\n', '  const { settings } = useStorefrontSettings();\n  const shell = usePublicShellContent().contact;\n', "Contact shell binding");
  const pairs = [
    ['title="تماس با ما"', 'title={shell.metaTitle}'],
    ['description="راه‌های ارتباط رسمی با وینیمی و فرم امن ثبت درخواست پشتیبانی و همکاری."', 'description={shell.metaDescription}'],
    ['<h1 className="heading-1 text-foreground">تماس با ما</h1>', '<h1 className="heading-1 text-foreground">{shell.heading}</h1>'],
    ['            برای پشتیبانی، همکاری یا پیگیری، درخواست خود را ثبت کنید تا در پنل\n            فروشگاه قابل پیگیری باشد.', '            {shell.intro}'],
    ['<h2 className="font-semibold">تلفن رسمی</h2>', '<h2 className="font-semibold">{shell.phoneTitle}</h2>'],
    ['<h2 className="font-semibold">ایمیل رسمی</h2>', '<h2 className="font-semibold">{shell.emailTitle}</h2>'],
    ['<h2 className="font-semibold">محدوده اعلام‌شده برند</h2>', '<h2 className="font-semibold">{shell.locationTitle}</h2>'],
    ['                    مشاهده محدوده در نقشه', '                    {shell.mapLabel}'],
    ['<h2 className="font-semibold">ساعات پاسخ‌گویی</h2>', '<h2 className="font-semibold">{shell.hoursTitle}</h2>'],
    ['                    بازه دقیق و ثابت اعلام نشده است؛ هماهنگی از مسیرهای رسمی\n                    انجام می‌شود.', '                    {shell.hoursNote}'],
    ['                مناطق منتشرشده ارسال', '                {shell.locationsCtaLabel}'],
    ['                شروع سفارش از فروشگاه', '                {shell.shopCtaLabel}'],
    ['                اینستاگرام رسمی', '                {shell.instagramLabel}'],
    ['              title="ثبت درخواست تماس"', '              title={shell.inquiryTitle}'],
    ['              description="پیام شما در بک‌اند ذخیره می‌شود و تیم فروشگاه می‌تواند آن را در پنل مدیریت بررسی و پیگیری کند."', '              description={shell.inquiryDescription}'],
    ['              subjectLabel="موضوع درخواست"', '              subjectLabel={shell.inquirySubjectLabel}'],
    ['              messageLabel="پیام شما"', '              messageLabel={shell.inquiryMessageLabel}'],
  ];
  for (const [oldValue, newValue] of pairs) next = replaceOnce(next, oldValue, newValue, `Contact ${oldValue}`);
  return next;
});

update("src/pages/FAQPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', 'import { generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', "FAQ remove static brand import");
  next = replaceOnce(next, 'import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', 'import { generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', "FAQ remove static brand import");
  next = replaceOnce(next, 'import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', 'import { generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";\n', "FAQ remove static brand import");
  next = replaceOnce(next, 'import { SEO } from "@/components/SEO";\n', 'import { SEO } from "@/components/SEO";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\n', "FAQ shell import");
  next = replaceOnce(next, '  const [openId, setOpenId] = useState<number | null>(null);\n', '  const [openId, setOpenId] = useState<number | null>(null);\n  const shell = usePublicShellContent().faq;\n', "FAQ shell binding");
  const pairs = [
    ['<SEO title="سوالات متداول" description="پاسخ‌های منتشرشده فروشگاه درباره سفارش، پرداخت، ارسال و محصولات." schema={schema} />', '<SEO title={shell.metaTitle} description={shell.metaDescription} schema={schema} />'],
    ['<h1 className="heading-1 text-foreground">سوالات متداول</h1>', '<h1 className="heading-1 text-foreground">{shell.heading}</h1>'],
    ['<p className="body-large mt-4 text-muted-foreground">پاسخ‌های مدیریت‌شده {brandConfig.brandName}</p>', '<p className="body-large mt-4 text-muted-foreground">{shell.intro}</p>'],
    ['>همه</button>', '>{shell.allLabel}</button>'],
    ['<h2 className="heading-3 mb-2">پاسخ سوال‌تان را نیافتید؟</h2>', '<h2 className="heading-3 mb-2">{shell.supportTitle}</h2>'],
    ['<MessageCircle size={18} aria-hidden="true" />پشتیبانی واتساپ</a>', '<MessageCircle size={18} aria-hidden="true" />{shell.whatsappLabel}</a>'],
    ['className="btn-primary rounded-xl px-6 py-3 font-medium">ثبت درخواست تماس</Link>', 'className="btn-primary rounded-xl px-6 py-3 font-medium">{shell.contactLabel}</Link>'],
  ];
  for (const [oldValue, newValue] of pairs) next = replaceOnce(next, oldValue, newValue, `FAQ ${oldValue}`);
  return next;
});

update("src/pages/GalleryPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { SEO } from "@/components/SEO";\n', 'import { SEO } from "@/components/SEO";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\n', "Gallery shell import");
  next = replaceOnce(next, '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n', '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const shell = usePublicShellContent().gallery;\n', "Gallery shell binding");
  for (const [oldValue, newValue] of [
    ['title="گالری"', 'title={shell.metaTitle}'],
    ['description="تصاویر منتشرشده وینیمی از منبع محتوای فروشگاه."', 'description={shell.metaDescription}'],
    ['<h1 className="heading-1">گالری تصاویر</h1>', '<h1 className="heading-1">{shell.heading}</h1>'],
    ['            تصاویر مدیریت‌شده محصولات، بسته‌بندی و فرآیند آماده‌سازی', '            {shell.intro}'],
  ]) next = replaceOnce(next, oldValue, newValue, `Gallery ${oldValue}`);
  return next;
});

update("src/pages/LocationsPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { brandConfig, generatePhoneUrl } from "@/config/brand";\n', 'import { brandConfig } from "@/config/brand";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\nimport { useStorefrontSettings } from "@/hooks/useStorefrontSettings";\n', "Locations settings import");
  next = replaceOnce(next, '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const cities = loaderData?.cities ?? [];\n  const title = "مناطق منتشرشده ارسال وینیمی";\n  const description =\n    "صفحه‌های رسمی و منتشرشده وینیمی برای بررسی شرایط سفارش و ارسال در هر شهر؛ محدوده و روش نهایی تحویل در Checkout تأیید می‌شود.";\n', '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const cities = loaderData?.cities ?? [];\n  const shell = usePublicShellContent().locations;\n  const { settings } = useStorefrontSettings();\n  const title = shell.heading;\n  const description = shell.intro;\n', "Locations shell binding");
  next = replaceOnce(next, '        title={title}\n        description={description}', '        title={shell.metaTitle}\n        description={shell.metaDescription}', "Locations SEO");
  const pairs = [
    ['            صفحات محلی مدیریت‌شده', '            {shell.eyebrow}'],
    ['                      مشاهده شرایط {city.city}', '                      {shell.cityCtaPrefix} {city.city}'],
    ['<h2 className="heading-2 mb-4">اطلاعات ثابت برند</h2>', '<h2 className="heading-2 mb-4">{shell.brandInfoTitle}</h2>'],
    ['                این اطلاعات برای شناسایی و ارتباط با {brandConfig.brandName} در همه\n                صفحه‌ها یکسان است. وجود صفحه شهر به معنی وجود شعبه فیزیکی در آن شهر\n                نیست.', '                {shell.brandInfoDescription}'],
    ['{brandConfig.address}', '{settings.contact.address}'],
    ['href={generatePhoneUrl()}', 'href={settings.contact.phoneUrl}'],
    ['{brandConfig.phone}', '{settings.contact.phone}'],
    ['href={`mailto:${brandConfig.email}`}', 'href={`mailto:${settings.contact.email}`}'],
    ['{brandConfig.email}', '{settings.contact.email}'],
  ];
  for (const [oldValue, newValue] of pairs) next = replaceOnce(next, oldValue, newValue, `Locations ${oldValue}`);
  return next;
});

update("src/pages/ReviewsPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { SEO } from "@/components/SEO";\n', 'import { SEO } from "@/components/SEO";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\nimport { useStorefrontSettings } from "@/hooks/useStorefrontSettings";\n', "Reviews settings imports");
  next = replaceOnce(next, '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n', '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const shell = usePublicShellContent().reviews;\n  const { settings } = useStorefrontSettings();\n', "Reviews shell binding");
  for (const [oldValue, newValue] of [
    ['name: brandConfig.brandName,', 'name: settings.brand.name,'],
    ['title="نظرهای تأییدشده مشتریان"', 'title={shell.metaTitle}'],
    ['description="نظرهای خرید تأییدشده و منتشرشده از بک‌اند وینیمی."', 'description={shell.metaDescription}'],
    ['{ name: "نظرهای مشتریان" }', '{ name: shell.breadcrumbLabel }'],
    ['<h1 className="heading-1 mb-4">نظرهای تأییدشده مشتریان</h1>', '<h1 className="heading-1 mb-4">{shell.heading}</h1>'],
    ['            فقط نظرهای تأییدشده مرتبط با سفارش تحویل‌شده نمایش داده می‌شوند.', '            {shell.intro}'],
  ]) next = replaceOnce(next, oldValue, newValue, `Reviews ${oldValue}`);
  return next;
});

update("src/components/content/ManagedContentPage.tsx", (source) => {
  let next = source;
  next = replaceOnce(next, 'import { SEO } from "@/components/SEO";\n', 'import { SEO } from "@/components/SEO";\nimport { usePublicShellContent } from "@/hooks/usePublicShellContent";\n', "Managed shell import");
  next = replaceOnce(next, '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n', '  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;\n  const shell = usePublicShellContent().managedPage;\n', "Managed shell binding");
  for (const [oldValue, newValue] of [
    ['                مسیرهای مرتبط', '                {shell.relatedTitle}'],
    ['                  مشاهده محصولات', '                  {shell.productsLabel}'],
    ['                  تماس با پشتیبانی', '                  {shell.contactLabel}'],
    ['                درباره محصولات یا شرایط سفارش سؤال دارید؟', '                {shell.finalTitle}'],
    ['                اطلاعات نهایی هر محصول و وضعیت سفارش را پیش از ثبت درخواست بررسی\n                کنید.', '                {shell.finalDescription}'],
    ['                ارتباط با وینیمی', '                {shell.finalContactLabel}'],
    ['                ورود به فروشگاه', '                {shell.finalShopLabel}'],
  ]) next = replaceOnce(next, oldValue, newValue, `Managed ${oldValue}`);
  return next;
});

console.log("F30 public shell transform applied.");
