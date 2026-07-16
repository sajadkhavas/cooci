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
  website: "https://cooci.lovable.app",
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
      "وینیمی بیکری؛ سفارش کوکی خانگی، کیک، تیرامیسو، چیزکیک و باکس هدیه با پخت تازه، مواد اولیه درجه یک و ارسال سراسری. سفارش سریع از طریق واتساپ و تماس.",
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

export const SUPPORT_WHATSAPP_MESSAGE = `سلام، از سایت ${brandConfig.brandName} با شما تماس گرفتم. یک سؤال درباره محصولات دارم.`;

export const generatePhoneUrl = (phone: string = brandConfig.phoneClean) =>
  `tel:+98${phone.replace(/^0/, "")}`;

export const generateWhatsAppUrl = (message: string = SUPPORT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export interface OrderableVariant {
  name: string;
  price?: number;
  productCode?: string;
}

export const generateProductOrderMessage = (
  productName: string,
  productCode?: string,
  variant?: OrderableVariant,
  quantity: number = 1,
) => {
  const lines = [
    `سلام، می‌خواهم این محصول را از ${brandConfig.brandName} سفارش دهم:`,
    `🍪 محصول: ${productName}`,
  ];
  if (variant?.name) lines.push(`📦 نوع/سایز: ${variant.name}`);
  const code = variant?.productCode ?? productCode;
  if (code) lines.push(`🔖 کد محصول: ${code}`);
  const price = variant?.price;
  if (price) lines.push(`💰 قیمت: ${price.toLocaleString("fa-IR")} تومان`);
  if (quantity > 1) lines.push(`🔢 تعداد: ${quantity.toLocaleString("fa-IR")}`);
  lines.push("", "لطفاً برای هماهنگی سفارش و ارسال راهنمایی بفرمایید. ممنون 🙏");
  return lines.join("\n");
};

export const formatToman = (amount: number) =>
  `${amount.toLocaleString("fa-IR")} تومان`;
