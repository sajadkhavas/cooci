export const brandConfig = {
  brandName: "کوکی",
  brandNameEn: "Cookie",
  tagline: "شیرینی‌فروشی تخصصی کوکی",
  slogan: "طعم خانگی، کیفیت حرفه‌ای",
  phone: "021-12345678",
  phoneClean: "02112345678",
  whatsappNumber: "989121234567",
  address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  city: "تهران",
  workingHours: {
    weekdays: "۹ صبح تا ۹ شب",
    weekends: "۱۰ صبح تا ۸ شب",
  },
  instagramUrl: "https://instagram.com/cookie_bakery",
  mapUrl: "https://maps.google.com/?q=35.7219,51.3347",
  defaultMeta: {
    title: "کوکی | شیرینی‌فروشی تخصصی کوکی - سفارش آنلاین کوکی تازه",
    description: "شیرینی‌فروشی تخصصی کوکی - کوکی‌های تازه و خانگی با بهترین مواد اولیه. سفارش تلفنی و واتساپ. ارسال به سراسر تهران.",
    image: "/og-image.jpg",
  },
  preparationTime: "۲۴ تا ۴۸ ساعت",
  deliveryInfo: "ارسال با پیک در تهران",
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
  return `سلام، من محصول ${productName} با کد ${productCode} را می‌خواهم.
تعداد: ...
تاریخ تحویل: ...
توضیحات: ...`;
};

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) => {
  return `tel:+98${phone.slice(1)}`;
};
