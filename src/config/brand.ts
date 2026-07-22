export const brandConfig = {
  brandName: "وینیمی بیکری",
  brandNameEn: "Winimi Bakery",
  tagline: "کوکی، کیک و باکس هدیه",
  slogan:
    "انتخاب آنلاین کوکی، کیک، دسر و باکس هدیه بر اساس دسته، مناسبت و جزئیات محصول",
  logoPath: "/brand/winimi-logo.svg",
  primaryColor: "#D0E596",
  brandInkColor: "#27390C",
  phone: "09212508746",
  phoneClean: "09212508746",
  whatsappNumber: "989212508746",
  email: "hello@winimibakery.com",
  address: "محدوده اندیشه، استان تهران",
  city: "اندیشه",
  region: "تهران",
  website: "https://winimibakery.com",
  workingHours: {
    weekdays: "پاسخ‌گویی با هماهنگی",
    weekends: "پاسخ‌گویی با هماهنگی",
  },
  instagramUrl: "https://www.instagram.com/winimi.bakery",
  instagramHandle: "winimi.bakery",
  mapUrl: "https://maps.google.com/?q=Andisheh+Tehran",
  defaultMeta: {
    title: "خرید کوکی، کیک و باکس هدیه | وینیمی بیکری",
    description:
      "مشاهده و سفارش آنلاین کوکی، مینی کوکی، کیک، چیزکیک، رول و کروسان و باکس هدیه وینیمی با قیمت و گزینه‌های فعال کاتالوگ.",
    image: "/og-image.jpg",
  },
  preparationTime: "زمان آماده‌سازی هر محصول پس از انتخاب گزینه فعال اعلام می‌شود",
  deliveryInfo:
    "روش‌های قابل انتخاب تحویل براساس نیاز نگهداری محصول، شهر مقصد و تنظیمات فعال Checkout نمایش داده می‌شوند.",
  trustPillars: [
    "قیمت و گزینه‌های فعال کاتالوگ",
    "نمایش نیاز به نگهداری سرد",
    "ترکیبات و آلرژن فقط پس از تأیید",
    "تأیید نهایی موجودی و مبلغ پیش از پرداخت",
  ],
  contentNotice:
    "اطلاعات ثابت فرانت‌اند جایگزین داده تأییدشده موجودی، ترکیبات، زمان آماده‌سازی و محدوده تحویل در بک‌اند نیست.",
};

export const SUPPORT_WHATSAPP_MESSAGE = `سلام، از سایت ${brandConfig.brandName} با شما تماس گرفتم. یک سؤال درباره محصولات یا سفارش دارم.`;

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) =>
  `tel:+98${phone.replace(/^0/, "")}`;

export const generateWhatsAppUrl = (
  message: string = SUPPORT_WHATSAPP_MESSAGE,
) =>
  `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const formatToman = (amount: number) =>
  `${amount.toLocaleString("fa-IR")} تومان`;
