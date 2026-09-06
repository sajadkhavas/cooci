import type { BackendStoreSettings } from "@/lib/backend-contract";

const valueAt = (
  source: Record<string, unknown>,
  group: string,
  key: string,
  fallback: string,
) => {
  const groupValue = source[group];
  if (typeof groupValue !== "object" || groupValue === null || Array.isArray(groupValue)) {
    return fallback;
  }
  const value = (groupValue as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export interface PublicShellContent {
  catalog: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    categoriesTitle: string;
    categoriesDescription: string;
    allProductsLabel: string;
  };
  blogIndex: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
  };
  contact: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    phoneTitle: string;
    emailTitle: string;
    locationTitle: string;
    mapLabel: string;
    hoursTitle: string;
    hoursNote: string;
    locationsCtaLabel: string;
    shopCtaLabel: string;
    instagramLabel: string;
    inquiryTitle: string;
    inquiryDescription: string;
    inquirySubjectLabel: string;
    inquiryMessageLabel: string;
  };
  faq: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    allLabel: string;
    supportTitle: string;
    whatsappLabel: string;
    contactLabel: string;
  };
  gallery: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
  };
  locations: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    eyebrow: string;
    cityCtaPrefix: string;
    brandInfoTitle: string;
    brandInfoDescription: string;
  };
  reviews: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    breadcrumbLabel: string;
  };
  managedPage: {
    relatedTitle: string;
    productsLabel: string;
    contactLabel: string;
    finalTitle: string;
    finalDescription: string;
    finalContactLabel: string;
    finalShopLabel: string;
  };
}

export const resolvePublicShellContent = (
  payload?: BackendStoreSettings,
): PublicShellContent => {
  const source = payload?.settings ?? {};
  const text = (group: string, key: string, fallback: string) =>
    valueAt(source, group, key, fallback);

  return {
    catalog: {
      metaTitle: text("catalog", "meta_title", "محصولات وینیمی"),
      metaDescription: text(
        "catalog",
        "meta_description",
        "مشاهده، جست‌وجو، فیلتر و خرید آنلاین محصولات فعال وینیمی با قیمت و موجودی دریافت‌شده از سرور.",
      ),
      heading: text("catalog", "heading", "محصولات وینیمی"),
      intro: text(
        "catalog",
        "intro",
        "محصول موردنظرت را با دسته‌بندی، جست‌وجو، مرتب‌سازی و فیلترهای فروشگاه پیدا کن.",
      ),
      categoriesTitle: text(
        "catalog",
        "categories_title",
        "دسته را انتخاب کن یا با فیلترها میان همه محصولات بگرد",
      ),
      categoriesDescription: text(
        "catalog",
        "categories_description",
        "هر دسته یک URL مستقل و قابل اشتراک دارد، اما انتخاب، فیلتر، مرتب‌سازی و محصولات همگی داخل همین فروشگاه باقی می‌مانند.",
      ),
      allProductsLabel: text("catalog", "all_products_label", "همه محصولات"),
    },
    blogIndex: {
      metaTitle: text("blog_index", "meta_title", "راهنماهای وینیمی"),
      metaDescription: text(
        "blog_index",
        "meta_description",
        "مقاله‌های منتشرشده وینیمی در موضوعات واقعی فروشگاه برای انتخاب، سفارش و نگهداری آگاهانه‌تر.",
      ),
      heading: text("blog_index", "heading", "راهنماهای وینیمی"),
      intro: text(
        "blog_index",
        "intro",
        "مقاله‌های منتشرشده وینیمی در موضوعات واقعی فروشگاه برای انتخاب، سفارش و نگهداری آگاهانه‌تر.",
      ),
    },
    contact: {
      metaTitle: text("contact_page", "meta_title", "تماس با ما"),
      metaDescription: text(
        "contact_page",
        "meta_description",
        "راه‌های ارتباط رسمی با وینیمی و فرم امن ثبت درخواست پشتیبانی و همکاری.",
      ),
      heading: text("contact_page", "heading", "تماس با ما"),
      intro: text(
        "contact_page",
        "intro",
        "برای پشتیبانی، همکاری یا پیگیری، درخواست خود را ثبت کنید تا در پنل فروشگاه قابل پیگیری باشد.",
      ),
      phoneTitle: text("contact_page", "phone_title", "تلفن رسمی"),
      emailTitle: text("contact_page", "email_title", "ایمیل رسمی"),
      locationTitle: text("contact_page", "location_title", "محدوده اعلام‌شده برند"),
      mapLabel: text("contact_page", "map_label", "مشاهده محدوده در نقشه"),
      hoursTitle: text("contact_page", "hours_title", "ساعات پاسخ‌گویی"),
      hoursNote: text(
        "contact_page",
        "hours_note",
        "بازه دقیق و ثابت اعلام نشده است؛ هماهنگی از مسیرهای رسمی انجام می‌شود.",
      ),
      locationsCtaLabel: text("contact_page", "locations_cta_label", "مناطق منتشرشده ارسال"),
      shopCtaLabel: text("contact_page", "shop_cta_label", "شروع سفارش از فروشگاه"),
      instagramLabel: text("contact_page", "instagram_label", "اینستاگرام رسمی"),
      inquiryTitle: text("contact_page", "inquiry_title", "ثبت درخواست تماس"),
      inquiryDescription: text(
        "contact_page",
        "inquiry_description",
        "پیام شما در بک‌اند ذخیره می‌شود و تیم فروشگاه می‌تواند آن را در پنل مدیریت بررسی و پیگیری کند.",
      ),
      inquirySubjectLabel: text("contact_page", "inquiry_subject_label", "موضوع درخواست"),
      inquiryMessageLabel: text("contact_page", "inquiry_message_label", "پیام شما"),
    },
    faq: {
      metaTitle: text("faq_page", "meta_title", "سوالات متداول"),
      metaDescription: text(
        "faq_page",
        "meta_description",
        "پاسخ‌های منتشرشده فروشگاه درباره سفارش، پرداخت، ارسال و محصولات.",
      ),
      heading: text("faq_page", "heading", "سوالات متداول"),
      intro: text("faq_page", "intro", "پاسخ‌های مدیریت‌شده وینیمی"),
      allLabel: text("faq_page", "all_label", "همه"),
      supportTitle: text("faq_page", "support_title", "پاسخ سوال‌تان را نیافتید؟"),
      whatsappLabel: text("faq_page", "whatsapp_label", "پشتیبانی واتساپ"),
      contactLabel: text("faq_page", "contact_label", "ثبت درخواست تماس"),
    },
    gallery: {
      metaTitle: text("gallery_page", "meta_title", "گالری"),
      metaDescription: text(
        "gallery_page",
        "meta_description",
        "تصاویر منتشرشده وینیمی از منبع محتوای فروشگاه.",
      ),
      heading: text("gallery_page", "heading", "گالری تصاویر"),
      intro: text(
        "gallery_page",
        "intro",
        "تصاویر مدیریت‌شده محصولات، بسته‌بندی و فرآیند آماده‌سازی",
      ),
    },
    locations: {
      metaTitle: text("locations_page", "meta_title", "مناطق منتشرشده ارسال وینیمی"),
      metaDescription: text(
        "locations_page",
        "meta_description",
        "صفحه‌های رسمی و منتشرشده وینیمی برای بررسی شرایط سفارش و ارسال در هر شهر؛ محدوده و روش نهایی تحویل در Checkout تأیید می‌شود.",
      ),
      heading: text("locations_page", "heading", "مناطق منتشرشده ارسال وینیمی"),
      intro: text(
        "locations_page",
        "intro",
        "صفحه‌های رسمی و منتشرشده وینیمی برای بررسی شرایط سفارش و ارسال در هر شهر؛ محدوده و روش نهایی تحویل در Checkout تأیید می‌شود.",
      ),
      eyebrow: text("locations_page", "eyebrow", "صفحات محلی مدیریت‌شده"),
      cityCtaPrefix: text("locations_page", "city_cta_prefix", "مشاهده شرایط"),
      brandInfoTitle: text("locations_page", "brand_info_title", "اطلاعات ثابت برند"),
      brandInfoDescription: text(
        "locations_page",
        "brand_info_description",
        "این اطلاعات برای شناسایی و ارتباط با وینیمی در همه صفحه‌ها یکسان است. وجود صفحه شهر به معنی وجود شعبه فیزیکی در آن شهر نیست.",
      ),
    },
    reviews: {
      metaTitle: text("reviews_page", "meta_title", "نظرهای تأییدشده مشتریان"),
      metaDescription: text(
        "reviews_page",
        "meta_description",
        "نظرهای خرید تأییدشده و منتشرشده از بک‌اند وینیمی.",
      ),
      heading: text("reviews_page", "heading", "نظرهای تأییدشده مشتریان"),
      intro: text(
        "reviews_page",
        "intro",
        "فقط نظرهای تأییدشده مرتبط با سفارش تحویل‌شده نمایش داده می‌شوند.",
      ),
      breadcrumbLabel: text("reviews_page", "breadcrumb_label", "نظرهای مشتریان"),
    },
    managedPage: {
      relatedTitle: text("managed_page_shell", "related_title", "مسیرهای مرتبط"),
      productsLabel: text("managed_page_shell", "products_label", "مشاهده محصولات"),
      contactLabel: text("managed_page_shell", "contact_label", "تماس با پشتیبانی"),
      finalTitle: text(
        "managed_page_shell",
        "final_title",
        "درباره محصولات یا شرایط سفارش سؤال دارید؟",
      ),
      finalDescription: text(
        "managed_page_shell",
        "final_description",
        "اطلاعات نهایی هر محصول و وضعیت سفارش را پیش از ثبت درخواست بررسی کنید.",
      ),
      finalContactLabel: text("managed_page_shell", "final_contact_label", "ارتباط با وینیمی"),
      finalShopLabel: text("managed_page_shell", "final_shop_label", "ورود به فروشگاه"),
    },
  };
};
