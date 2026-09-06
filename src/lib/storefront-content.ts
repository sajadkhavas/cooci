import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import { brandConfig } from "@/config/brand";
import type { BackendStoreSettings } from "@/lib/backend-contract";

const getValue = (
  source: Record<string, unknown>,
  path: readonly string[],
): unknown => {
  let current: unknown = source;
  for (const segment of path) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
};

const text = (
  source: Record<string, unknown>,
  path: readonly string[],
  fallback: string,
) => {
  const value = getValue(source, path);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const internalPath = (
  source: Record<string, unknown>,
  path: readonly string[],
  fallback: string,
) => {
  const value = text(source, path, fallback);
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
};

const mediaUrl = (
  source: Record<string, unknown>,
  path: readonly string[],
  fallback: string,
) => {
  const value = text(source, path, fallback);
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const parsed = new URL(value, brandConfig.website);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
};

const slug = (
  source: Record<string, unknown>,
  path: readonly string[],
  fallback: string,
) => {
  const value = text(source, path, fallback).toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : fallback;
};

export interface StorefrontLink {
  label: string;
  href: string;
}

export interface StorefrontContent {
  navigation: {
    links: StorefrontLink[];
    contextLine: string;
    mobileSubtitle: string;
    mobileGuestTitle: string;
    mobileGuestSubtitle: string;
    categoriesCta: StorefrontLink;
    whatsappLabel: string;
    phoneLabel: string;
  };
  footer: {
    supportTitle: string;
    supportText: string;
    phoneLabel: string;
    whatsappLabel: string;
    aboutText: string;
    locationText: string;
    discovery: { title: string; links: StorefrontLink[] };
    categoryTitle: string;
    services: { title: string; links: StorefrontLink[] };
    legal: Array<StorefrontLink>;
    developerLabel: string;
    developerName: string;
    watermark: string;
  };
  home: {
    metaTitle: string;
    metaDescription: string;
    hero: {
      eyebrow: string;
      titleLine1: string;
      titleLine2: string;
      description: string;
      primary: StorefrontLink;
      secondary: StorefrontLink;
      imageUrl: string;
      imageAlt: string;
      captionLabel: string;
      captionText: string;
    };
    marquee: string[];
    categories: { eyebrow: string; title: string; description: string };
    featured: { eyebrow: string; title: string; description: string; cta: StorefrontLink };
    occasion: {
      eyebrow: string;
      title: string;
      description: string;
      items: Array<{
        shortTitle: string;
        eyebrow: string;
        title: string;
        description: string;
        actionLabel: string;
        href: string;
        imageUrl: string;
      }>;
    };
    decision: {
      eyebrow: string;
      title: string;
      description: string;
      faqEyebrow: string;
      faqTitle: string;
      paths: Array<{
        eyebrow: string;
        title: string;
        description: string;
        href: string;
        actionLabel: string;
      }>;
    };
    editorial: {
      eyebrow: string;
      title: string;
      description: string;
      cta: StorefrontLink;
      readLabel: string;
      slugs: string[];
    };
  };
  gift: {
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    primary: StorefrontLink;
    supportLabel: string;
    imageUrl: string;
    imageAlt: string;
    occasionsTitle: string;
    occasions: Array<{ title: string; description: string }>;
    productsTitle: string;
    inquiry: { title: string; description: string; subject: string; messageLabel: string };
  };
  corporate: {
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroDescription: string;
    heroWarning: string;
    supportLabel: string;
    requests: Array<{ title: string; description: string }>;
    useCasesTitle: string;
    useCases: string[];
    inquiry: { title: string; description: string; subject: string; messageLabel: string };
  };
}

export const resolveStorefrontContent = (
  payload?: BackendStoreSettings,
): StorefrontContent => {
  const settings = payload?.settings ?? {};
  const navigationFallbacks = [
    ["خانه", "/"],
    ["فروشگاه", "/products"],
    ["هدیه", "/gift"],
    ["راهنماها", "/blog"],
    ["داستان ما", "/about"],
  ] as const;
  const navigationLinks = navigationFallbacks.map(([label, href], index) => ({
    label: text(settings, ["navigation", `header_${index + 1}_label`], label),
    href: internalPath(settings, ["navigation", `header_${index + 1}_href`], href),
  }));
  const discoveryFallbacks = [
    ["خانه", "/"],
    ["همه محصولات", "/products"],
    ["درباره ما", "/about"],
    ["راهنماها", "/blog"],
    ["تماس با ما", "/contact"],
  ] as const;
  const serviceFallbacks = [
    ["مناطق ارسال", "/locations"],
    ["سفارش سازمانی", "/corporate"],
    ["راهنمای هدیه", "/gift"],
    ["شرایط ارسال", "/shipping"],
    ["سؤالات متداول", "/faq"],
  ] as const;
  const discoveryLinks = discoveryFallbacks.map(([label, href], index) => ({
    label: text(settings, ["footer", `group_1_link_${index + 1}_label`], label),
    href: internalPath(settings, ["footer", `group_1_link_${index + 1}_href`], href),
  }));
  const serviceLinks = serviceFallbacks.map(([label, href], index) => ({
    label: text(settings, ["footer", `group_3_link_${index + 1}_label`], label),
    href: internalPath(settings, ["footer", `group_3_link_${index + 1}_href`], href),
  }));
  const occasionFallbacks = [
    {
      shortTitle: "هدیه",
      eyebrow: "برای یک انتخاب شخصی‌تر",
      title: "هدیه‌ای که از روی فکر انتخاب شده",
      description: "مناسبت، تعداد و سلیقه گیرنده را در نظر بگیر و از مسیر راهنمای هدیه به انتخاب روشن‌تری برس.",
      actionLabel: "رفتن به راهنمای هدیه",
      href: "/gift",
      imageUrl: galleryGiftBoxes,
    },
    {
      shortTitle: "پذیرایی",
      eyebrow: "برای جمع‌های کوچک و بزرگ",
      title: "پذیرایی خوش‌ریتم، بدون انتخاب اضافه",
      description: "تعداد مهمان‌ها و حال‌وهوای دورهمی را مشخص کن و گزینه‌های جمع‌وجور و قابل مقایسه را ببین.",
      actionLabel: "دیدن گزینه‌های پذیرایی",
      href: "/products/category/mini-cookies",
      imageUrl: galleryBaking,
    },
    {
      shortTitle: "روزمره",
      eyebrow: "برای چای، قهوه و حال خوب",
      title: "یک شیرینی کوچک برای همین امروز",
      description: "میان کوکی‌های فعال، طعم و بافتی را پیدا کن که به حال‌وهوای امروزت نزدیک‌تر است.",
      actionLabel: "دیدن کوکی‌ها",
      href: "/products/category/cookies",
      imageUrl: lifestyleMilk,
    },
  ];
  const occasionItems = occasionFallbacks.map((fallback, index) => {
    const number = index + 1;
    return {
      shortTitle: text(settings, ["home", `occasion_${number}_short_title`], fallback.shortTitle),
      eyebrow: text(settings, ["home", `occasion_${number}_eyebrow`], fallback.eyebrow),
      title: text(settings, ["home", `occasion_${number}_title`], fallback.title),
      description: text(settings, ["home", `occasion_${number}_description`], fallback.description),
      actionLabel: text(settings, ["home", `occasion_${number}_action_label`], fallback.actionLabel),
      href: internalPath(settings, ["home", `occasion_${number}_href`], fallback.href),
      imageUrl: mediaUrl(settings, ["home", `occasion_${number}_image_url`], fallback.imageUrl),
    };
  });
  const decisionFallbacks = [
    ["شروع از نوع محصول", "دسته‌بندی‌های فروشگاه", "محصولات مشابه را کنار هم ببین و سریع‌تر مقایسه کن.", "/products", "مشاهده دسته‌ها"],
    ["شروع از مناسبت", "راهنمای انتخاب هدیه", "برای مناسبت، تعداد و سلیقه گیرنده مسیر مناسب‌تری پیدا کن.", "/gift", "رفتن به راهنما"],
    ["پیش از سفارش", "راهنماهای کوتاه وینیمی", "درباره تعداد، نگهداری و انتخاب بهتر بیشتر بدان.", "/blog", "خواندن راهنماها"],
  ] as const;
  const decisionPaths = decisionFallbacks.map(([eyebrow, title, description, href, actionLabel], index) => {
    const number = index + 1;
    return {
      eyebrow: text(settings, ["home", `decision_path_${number}_eyebrow`], eyebrow),
      title: text(settings, ["home", `decision_path_${number}_title`], title),
      description: text(settings, ["home", `decision_path_${number}_description`], description),
      href: internalPath(settings, ["home", `decision_path_${number}_href`], href),
      actionLabel: text(settings, ["home", `decision_path_${number}_action_label`], actionLabel),
    };
  });
  const giftOccasionFallbacks = [
    ["سالگرد و مناسبت شخصی", "درخواست کارت و ترکیب پیشنهادی"],
    ["تولد و جشن", "انتخاب محصول و تعداد متناسب با جشن"],
    ["تشکر و تبریک", "درخواست بسته‌بندی هدیه پس از استعلام"],
    ["هدیه خانوادگی", "ترکیب محصولات موجود فروشگاه"],
  ] as const;
  const corporateRequestFallbacks = [
    ["بسته‌بندی و شخصی‌سازی", "نوع جعبه، کارت، روبان یا درج لوگو براساس تعداد و زمان استعلام می‌شود."],
    ["قیمت سفارش تعداد بالا", "قیمت بعد از مشخص‌شدن محصول، تعداد، تاریخ و مقصد محاسبه می‌شود."],
    ["پیش‌فاکتور و نوع فاکتور", "امکان ارائه نوع فاکتور موردنیاز پیش از تأیید سفارش بررسی می‌شود."],
    ["همکاری دوره‌ای", "ظرفیت تولید، بازه تحویل و شرایط همکاری برای هر درخواست جداگانه ارزیابی می‌شود."],
  ] as const;
  const corporateUseCaseFallbacks = [
    "پذیرایی جلسه یا رویداد",
    "هدیه کارکنان یا مشتریان",
    "پک خوشامدگویی",
    "سفارش مناسبتی تعداد بالا",
    "درخواست همکاری کافه یا مجموعه پذیرایی",
  ];

  return {
    navigation: {
      links: navigationLinks,
      contextLine: text(settings, ["header", "context_line"], "کوکی، کیک و هدیه؛ انتخاب بر اساس دسته و مناسبت"),
      mobileSubtitle: text(settings, ["header", "mobile_subtitle"], "منوی سریع فروشگاه"),
      mobileGuestTitle: text(settings, ["header", "mobile_guest_title"], "ورود به حساب"),
      mobileGuestSubtitle: text(settings, ["header", "mobile_guest_subtitle"], "سفارش‌ها، پروفایل و پیگیری"),
      categoriesCta: {
        label: text(settings, ["header", "categories_cta_label"], "انتخاب از دسته‌بندی‌ها"),
        href: internalPath(settings, ["header", "categories_cta_href"], "/categories"),
      },
      whatsappLabel: text(settings, ["header", "whatsapp_label"], "واتساپ"),
      phoneLabel: text(settings, ["header", "phone_label"], "تماس"),
    },
    footer: {
      supportTitle: text(settings, ["footer", "support_title"], "برای انتخاب بهتر، کنار شما هستیم"),
      supportText: text(settings, ["footer", "support_text"], "درباره محصول، تعداد مناسب یا شرایط سفارش سؤال داری؟ مستقیم با وینیمی صحبت کن."),
      phoneLabel: text(settings, ["footer", "phone_label"], "تماس"),
      whatsappLabel: text(settings, ["footer", "whatsapp_label"], "واتساپ"),
      aboutText: text(settings, ["footer", "about_text"], "کوکی، کیک، دسر و باکس هدیه؛ با جزئیاتی که پیش از سفارش می‌بینی."),
      locationText: text(settings, ["footer", "location_text"], "اندیشه، استان تهران"),
      discovery: {
        title: text(settings, ["footer", "group_1_title"], "کشف وینیمی"),
        links: discoveryLinks,
      },
      categoryTitle: text(settings, ["footer", "group_2_title"], "دسته‌بندی‌ها"),
      services: {
        title: text(settings, ["footer", "group_3_title"], "خدمات و راهنما"),
        links: serviceLinks,
      },
      legal: [
        { label: text(settings, ["footer", "legal_quality_label"], "سیاست شفافیت"), href: "/quality" },
        { label: text(settings, ["footer", "legal_shipping_label"], "شرایط ارسال"), href: "/shipping" },
        { label: text(settings, ["footer", "legal_privacy_label"], "حریم خصوصی"), href: "/privacy" },
        { label: text(settings, ["footer", "legal_terms_label"], "شرایط استفاده"), href: "/terms" },
      ],
      developerLabel: text(settings, ["footer", "developer_label"], "طراحی و توسعه توسط"),
      developerName: text(settings, ["footer", "developer_name"], "SHINETHREE"),
      watermark: text(settings, ["footer", "watermark"], "WINIMI BAKERY"),
    },
    home: {
      metaTitle: text(settings, ["home", "meta_title"], "خرید کوکی، کیک و باکس هدیه"),
      metaDescription: text(settings, ["home", "meta_description"], "محصولات فعال وینیمی را براساس دسته یا مناسبت پیدا کنید؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببینید و آنلاین سفارش دهید."),
      hero: {
        eyebrow: text(settings, ["home", "hero_eyebrow"], "شیرینی دست‌ساز برای لحظه‌های شما"),
        titleLine1: text(settings, ["home", "hero_title_line_1"], "طعم خوب برای"),
        titleLine2: text(settings, ["home", "hero_title_line_2"], "هدیه، پذیرایی و حال خوب."),
        description: text(settings, ["home", "hero_description"], "محصولات فعال وینیمی را براساس دسته یا مناسبت پیدا کن؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببین و با خیال روشن‌تر سفارش بده."),
        primary: {
          label: text(settings, ["home", "hero_primary_label"], "مشاهده محصولات"),
          href: internalPath(settings, ["home", "hero_primary_href"], "/products"),
        },
        secondary: {
          label: text(settings, ["home", "hero_secondary_label"], "راهنمای انتخاب هدیه"),
          href: internalPath(settings, ["home", "hero_secondary_href"], "/gift"),
        },
        imageUrl: mediaUrl(settings, ["home", "hero_image_url"], heroImage),
        imageAlt: text(settings, ["home", "hero_image_alt"], "کوکی شکلاتی تازه وینیمی"),
        captionLabel: text(settings, ["home", "hero_caption_label"], "انتخاب روشن، سفارش ساده"),
        captionText: text(settings, ["home", "hero_caption_text"], "یک انتخاب شیرین، با جزئیاتی که پیش از سفارش می‌بینی."),
      },
      marquee: Array.from({ length: 8 }, (_, index) =>
        text(settings, ["home", `marquee_${index + 1}`], ["کوکی‌های خانگی", "مینی‌کوکی برای پذیرایی", "کیک و چیزکیک", "رول و کروسان", "باکس هدیه", "راهنمای انتخاب هدیه", "سفارش سازمانی", "پشتیبانی وینیمی"][index]),
      ),
      categories: {
        eyebrow: text(settings, ["home", "categories_eyebrow"], "دسته‌های فعال فروشگاه"),
        title: text(settings, ["home", "categories_title"], "دسته‌بندی محصولات وینیمی"),
        description: text(settings, ["home", "categories_description"], "دسته موردنظرت را انتخاب کن و محصولات فعال، قیمت و جزئیات سفارش را ببین."),
      },
      featured: {
        eyebrow: text(settings, ["home", "featured_eyebrow"], "انتخاب‌های پیشنهادی"),
        title: text(settings, ["home", "featured_title"], "چند انتخاب برای شروع"),
        description: text(settings, ["home", "featured_description"], "محصول، قیمت و موجودی را سریع مقایسه کن؛ برای انتخاب نوع یا دیدن جزئیات بیشتر، پیش‌نمایش را باز کن."),
        cta: {
          label: text(settings, ["home", "featured_cta_label"], "مشاهده همه محصولات"),
          href: internalPath(settings, ["home", "featured_cta_href"], "/products"),
        },
      },
      occasion: {
        eyebrow: text(settings, ["home", "occasion_eyebrow"], "انتخاب براساس موقعیت"),
        title: text(settings, ["home", "occasion_title"], "برای چه لحظه‌ای انتخاب می‌کنی؟"),
        description: text(settings, ["home", "occasion_description"], "به‌جای مرور همه‌چیز، از موقعیتت شروع کن؛ وینیمی مسیرهای مرتبط‌تر را جلو دستت می‌گذارد."),
        items: occasionItems,
      },
      decision: {
        eyebrow: text(settings, ["home", "decision_eyebrow"], "کمک برای یک انتخاب روشن"),
        title: text(settings, ["home", "decision_title"], "از نیازت شروع کن؛ مسیر مناسب را کوتاه‌تر برو"),
        description: text(settings, ["home", "decision_description"], "اگر هنوز بین چند انتخاب مرددی، از یکی از مسیرهای زیر شروع کن. هر مسیر فقط اطلاعات مرتبط با همان تصمیم را جلو دستت می‌گذارد."),
        faqEyebrow: text(settings, ["home", "decision_faq_eyebrow"], "پرسش‌های پرتکرار"),
        faqTitle: text(settings, ["home", "decision_faq_title"], "قبل از سفارش"),
        paths: decisionPaths,
      },
      editorial: {
        eyebrow: text(settings, ["home", "editorial_eyebrow"], "یادداشت‌های کوتاه و کاربردی"),
        title: text(settings, ["home", "editorial_title"], "قبل از انتخاب، کمی بیشتر بدان"),
        description: text(settings, ["home", "editorial_description"], "چند دقیقه مطالعه برای انتخاب هدیه، پذیرایی و نگهداری بهتر محصولات."),
        cta: {
          label: text(settings, ["home", "editorial_cta_label"], "همه راهنماها"),
          href: internalPath(settings, ["home", "editorial_cta_href"], "/blog"),
        },
        readLabel: text(settings, ["home", "editorial_read_label"], "خواندن راهنما"),
        slugs: [
          slug(settings, ["home", "editorial_1_slug"], "choose-food-gift-box"),
          slug(settings, ["home", "editorial_2_slug"], "cookie-storage-guide"),
          slug(settings, ["home", "editorial_3_slug"], "cookies-per-guest-guide"),
        ],
      },
    },
    gift: {
      metaTitle: text(settings, ["gift", "meta_title"], "باکس هدیه کوکی و شیرینی"),
      metaDescription: text(settings, ["gift", "meta_description"], "مشاهده محصولات هدیه و ثبت درخواست اختصاصی هدیه در وینیمی."),
      heroBadge: text(settings, ["gift", "hero_badge"], "محصولات و درخواست هدیه"),
      heroTitle: text(settings, ["gift", "hero_title"], "هدیه‌ای متناسب با مناسبت شما"),
      heroDescription: text(settings, ["gift", "hero_description"], "محصولات آماده را از فروشگاه انتخاب کنید. برای کارت، بسته‌بندی یا ترکیب اختصاصی، درخواست ثبت کنید تا امکان اجرا، هزینه و زمان آماده‌سازی بررسی شود."),
      primary: {
        label: text(settings, ["gift", "hero_primary_label"], "مشاهده محصولات هدیه"),
        href: internalPath(settings, ["gift", "hero_primary_href"], "/products"),
      },
      supportLabel: text(settings, ["gift", "hero_support_label"], "مشاوره پشتیبانی"),
      imageUrl: mediaUrl(settings, ["gift", "hero_image_url"], galleryGiftBoxes),
      imageAlt: text(settings, ["gift", "hero_image_alt"], "تصویر نمایشی بسته‌بندی هدیه وینیمی"),
      occasionsTitle: text(settings, ["gift", "occasions_title"], "برای مناسبت‌های مختلف"),
      occasions: giftOccasionFallbacks.map(([title, description], index) => ({
        title: text(settings, ["gift", `occasion_${index + 1}_title`], title),
        description: text(settings, ["gift", `occasion_${index + 1}_description`], description),
      })),
      productsTitle: text(settings, ["gift", "products_title"], "محصولات هدیه فعال"),
      inquiry: {
        title: text(settings, ["gift", "inquiry_title"], "ثبت درخواست هدیه اختصاصی"),
        description: text(settings, ["gift", "inquiry_description"], "مناسبت، تعداد، بودجه تقریبی، شهر مقصد و تاریخ موردنظر را بنویسید. ثبت فرم به معنی تأیید قطعی ظرفیت یا قیمت نیست."),
        subject: text(settings, ["gift", "inquiry_subject"], "درخواست هدیه اختصاصی"),
        messageLabel: text(settings, ["gift", "inquiry_message_label"], "جزئیات مناسبت و درخواست"),
      },
    },
    corporate: {
      metaTitle: text(settings, ["corporate", "meta_title"], "استعلام سفارش شرکتی و سازمانی"),
      metaDescription: text(settings, ["corporate", "meta_description"], "ثبت و پیگیری درخواست سفارش سازمانی وینیمی از طریق بک‌اند فروشگاه."),
      heroTitle: text(settings, ["corporate", "hero_title"], "استعلام هدیه و پذیرایی سازمانی"),
      heroDescription: text(settings, ["corporate", "hero_description"], "محصول، تعداد، بودجه، تاریخ و مقصد را در فرم ثبت کنید تا قابلیت اجرا و شرایط نهایی در پنل فروشگاه بررسی شود."),
      heroWarning: text(settings, ["corporate", "hero_warning"], "چاپ لوگو، تخفیف حجمی، نوع فاکتور و همکاری دوره‌ای فقط پس از تأیید کتبی جزئیات معتبر هستند."),
      supportLabel: text(settings, ["corporate", "support_label"], "سؤال از پشتیبانی"),
      requests: corporateRequestFallbacks.map(([title, description], index) => ({
        title: text(settings, ["corporate", `request_${index + 1}_title`], title),
        description: text(settings, ["corporate", `request_${index + 1}_description`], description),
      })),
      useCasesTitle: text(settings, ["corporate", "use_cases_title"], "موارد قابل بررسی"),
      useCases: corporateUseCaseFallbacks.map((value, index) =>
        text(settings, ["corporate", `use_case_${index + 1}`], value),
      ),
      inquiry: {
        title: text(settings, ["corporate", "inquiry_title"], "ثبت درخواست سازمانی"),
        description: text(settings, ["corporate", "inquiry_description"], "نام مجموعه، محصول یا نوع پذیرایی، تعداد، تاریخ تحویل، شهر مقصد و نیاز مربوط به فاکتور یا بسته‌بندی را ثبت کنید."),
        subject: text(settings, ["corporate", "inquiry_subject"], "استعلام سفارش سازمانی"),
        messageLabel: text(settings, ["corporate", "inquiry_message_label"], "جزئیات سفارش یا همکاری"),
      },
    },
  };
};
