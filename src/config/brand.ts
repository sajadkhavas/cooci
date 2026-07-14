export const brandConfig = {
  brandName: "وینیمی بیکری",
  brandNameEn: "Winimi Bakery",
  tagline: "کیک و کوکی مثل خانه",
  slogan: "پخت تازه، طعم خانگی، بسته‌بندی مطمئن",
  phone: "09212508746",
  phoneClean: "09212508746",
  whatsappNumber: "989212508746",
  email: "hello@winimibakery.com",
  address: "اندیشه، تهران — ارسال به سراسر ایران",
  city: "اندیشه",
  region: "تهران",
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
      "وینیمی بیکری — کوکی و کیک خانگی با پخت تازه، مواد اولیه درجه یک و بسته‌بندی محافظ. ارسال به تهران و سراسر ایران.",
    image: "/og-image.jpg",
  },
  preparationTime: "۲۴ تا ۴۸ ساعت",
  deliveryInfo: "ارسال با پیک در تهران و پست پیشتاز به سراسر ایران",
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
  productCode: string
) => {
  return `سلام، درباره محصول ${productName} (کد ${productCode}) سوال داشتم.`;
};

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) => {
  return `tel:+98${phone.replace(/^0/, "")}`;
};

export const SUPPORT_WHATSAPP_MESSAGE = "سلام، برای راهنمایی و پشتیبانی از وینیمی بیکری در خدمتم.";
