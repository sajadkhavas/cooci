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
  founder: {
    name: "تیم وینیمی",
    role: "بنیان‌گذار و سرآشپز",
    bio: "با بیش از ۵ سال تجربه در پخت کوکی و کیک خانگی، وینیمی از دل عشق به شیرینی‌های خانگی متولد شد.",
  },
  defaultMeta: {
    title: "وینیمی بیکری | کوکی خانگی، کیک تازه و باکس هدیه",
    description:
      "خرید آنلاین کوکی خانگی، کیک، تیرامیسو، چیزکیک و باکس هدیه وینیمی با پخت تازه، قیمت و موجودی شفاف، سبد خرید و تکمیل سفارش آنلاین.",
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

export const SUPPORT_WHATSAPP_MESSAGE = `سلام، از سایت ${brandConfig.brandName} با شما تماس گرفتم. یک سؤال درباره محصولات یا سفارش دارم.`;

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) =>
  `tel:+98${phone.replace(/^0/, "")}`;

export const generateWhatsAppUrl = (message: string = SUPPORT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const formatToman = (amount: number) =>
  `${amount.toLocaleString("fa-IR")} تومان`;
