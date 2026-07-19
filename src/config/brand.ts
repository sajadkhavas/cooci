export const brandConfig = {
  brandName: "وینیمی بیکری",
  brandNameEn: "Winimi Bakery",
  tagline: "کیک و کوکی خانگی",
  slogan: "انتخاب آنلاین محصول با اطلاعات روشن و مسیر سفارش مرحله‌به‌مرحله",
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
    title: "وینیمی بیکری | کاتالوگ کوکی، کیک و باکس هدیه",
    description:
      "مشاهده کاتالوگ وینیمی، مقایسه قیمت و گزینه‌های محصول، افزودن به سبد و تکمیل اطلاعات سفارش آنلاین.",
    image: "/og-image.jpg",
  },
  preparationTime: "پس از انتخاب محصول و روش تحویل اعلام می‌شود",
  deliveryInfo:
    "روش‌های قابل انتخاب تحویل براساس نوع محصول، شهر مقصد و تنظیمات فعال Checkout نمایش داده می‌شوند.",
  trustPillars: [
    "نمایش قیمت فعلی کاتالوگ",
    "اعلام نیاز به نگهداری سرد",
    "مشاهده آلرژن فقط پس از تأیید اطلاعات محصول",
    "تأیید نهایی مبلغ و موجودی توسط بک‌اند",
  ],
  contentNotice:
    "اطلاعات ثابت فرانت‌اند جایگزین تأیید نهایی موجودی، ترکیبات، زمان آماده‌سازی و محدوده تحویل توسط بک‌اند نیست.",
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
