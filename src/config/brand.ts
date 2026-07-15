export const brandConfig = {
  brandName: "وینیمی بیکری",
  brandNameEn: "Winimi Bakery",
  tagline: "کیک و کوکی مثل خانه",
  slogan: "پخت تازه، مواد اولیه باکیفیت، وسواس در بهداشت",
  phone: "09212508746",
  phoneClean: "09212508746",
  whatsappNumber: "989212508746",
  email: "hello@winimibakery.com",
  address: "اندیشه، تهران",
  city: "اندیشه",
  region: "تهران",
  website: "https://winimibakery.com",
  workingHours: {
    weekdays: "۹ صبح تا ۹ شب",
    weekends: "۱۰ صبح تا ۸ شب",
  },
  instagramUrl: "https://www.instagram.com/winimi.bakery",
  instagramHandle: "winimi.bakery",
  mapUrl: "https://maps.google.com/?q=Andisheh+Tehran",
  defaultMeta: {
    title: "وینیمی بیکری | کیک و کوکی خانگی با پخت تازه",
    description:
      "وینیمی بیکری؛ کوکی، کیک، تیرامیسو، چیزکیک و محصولات بدون قند افزوده با پخت تازه، مواد اولیه باکیفیت و بسته‌بندی محافظ.",
    image: "/og-image.jpg",
  },
  preparationTime: "۲۴ تا ۴۸ ساعت",
  deliveryInfo:
    "محصولات خشک به سراسر ایران ارسال می‌شوند؛ کیک‌ها، تیرامیسو و دسرهای یخچالی فقط تهران و کرج.",
  trustPillars: [
    "پخت تازه نزدیک به زمان سفارش",
    "مواد اولیه باکیفیت و شفاف",
    "ارسال سراسری برای محصولات خشک",
    "دسرهای یخچالی فقط تهران و کرج",
  ],
};

export const generateWhatsAppUrl = (
  message: string,
  phone: string = brandConfig.whatsappNumber
) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const generateProductOrderMessage = (
  productName: string,
  productCode: string,
  variantName?: string
) => {
  const variantPart = variantName ? ` — ${variantName}` : "";
  return `سلام، درباره محصول ${productName}${variantPart} (کد ${productCode}) سوال داشتم.`;
};

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) => {
  return `tel:+98${phone.replace(/^0/, "")}`;
};

export const SUPPORT_WHATSAPP_MESSAGE =
  "سلام، برای راهنمایی و پشتیبانی از وینیمی بیکری در خدمتم.";
