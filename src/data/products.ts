import productChocolateChip from "@/assets/cookies/product-chocolate-chip.jpg";
import productOatmealRaisin from "@/assets/cookies/product-oatmeal-raisin.jpg";
import productDoubleChocolate from "@/assets/cookies/product-double-chocolate.jpg";
import productPeanutButter from "@/assets/cookies/product-peanut-butter.jpg";
import productWhiteChocMacadamia from "@/assets/cookies/product-white-choc-macadamia.jpg";
import productRedVelvet from "@/assets/cookies/product-red-velvet.jpg";
import productSnickerdoodle from "@/assets/cookies/product-snickerdoodle.jpg";
import giftBoxImage from "@/assets/cookies/gallery-gift-boxes.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categorySlug: string;
  price?: number;
  weight?: string;
  badges: string[];
  allergens: string[];
  ingredients: string[];
  shelfLife: string;
  storageTips: string;
  images: { url: string; alt: string }[];
  isFeatured: boolean;
  productCode: string;
}

export const categories = [
  { name: "همه", slug: "all" },
  { name: "شکلاتی", slug: "chocolate" },
  { name: "کلاسیک", slug: "classic" },
  { name: "رژیمی و بدون شکر", slug: "diet" },
  { name: "مغزدار", slug: "nutty" },
  { name: "مناسب هدیه", slug: "gift" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "double-chocolate-chip",
    name: "کوکی دبل چاکلت چیپ",
    shortDescription: "کوکی شکلاتی غلیظ با تکه‌های شکلات تلخ بلژیکی",
    longDescription: "این کوکی برای عاشقان واقعی شکلات ساخته شده است. با استفاده از شکلات تلخ ۷۰٪ بلژیکی و پودر کاکائوی هلندی، طعمی عمیق و غنی دارد که در دهان آب می‌شود. بافت بیرونی ترد و درون نرم و چسبناک آن، تجربه‌ای فراموش‌نشدنی را رقم می‌زند.",
    category: "شکلاتی",
    categorySlug: "chocolate",
    price: 45000,
    weight: "۸۰ گرم",
    badges: ["پرفروش", "محبوب"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر"],
    ingredients: ["آرد گندم", "کره", "شکر قهوه‌ای", "تخم‌مرغ", "شکلات تلخ ۷۰٪", "پودر کاکائو", "وانیل طبیعی"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "در ظرف دربسته و دور از نور مستقیم نگهداری کنید",
    images: [
      { url: productDoubleChocolate, alt: "کوکی دبل چاکلت چیپ" },
    ],
    isFeatured: true,
    productCode: "CK-101",
  },
  {
    id: "2",
    slug: "classic-chocolate-chip",
    name: "کوکی شکلات چیپ کلاسیک",
    shortDescription: "طعم اصیل و کلاسیک با تکه‌های شکلات",
    longDescription: "کوکی شکلات چیپ کلاسیک ما با استفاده از شکلات مرغوب تهیه می‌شود. این کوکی ساده اما بی‌نظیر، همراه ایده‌آل چای عصرانه یا قهوه صبحگاهی شماست. بافت ترد بیرون و نرم داخل آن، همه سنین را جذب می‌کند.",
    category: "کلاسیک",
    categorySlug: "classic",
    price: 35000,
    weight: "۷۰ گرم",
    badges: ["کلاسیک"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر"],
    ingredients: ["آرد گندم", "کره", "شکر", "تخم‌مرغ", "شکلات چیپ", "وانیل طبیعی"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: productChocolateChip, alt: "کوکی شکلات چیپ کلاسیک" },
    ],
    isFeatured: true,
    productCode: "CK-102",
  },
  {
    id: "3",
    slug: "oatmeal-raisin",
    name: "کوکی جو پرک و کشمش",
    shortDescription: "کوکی سالم و مقوی با فیبر بالا",
    longDescription: "این کوکی سالم با جو پرک کامل و کشمش طلایی ایرانی تهیه می‌شود. سرشار از فیبر و انرژی، مناسب صبحانه سریع یا میان‌وعده ورزشکاران است. طعم دارچین و عسل آن را دلپذیرتر می‌کند.",
    category: "رژیمی و بدون شکر",
    categorySlug: "diet",
    price: 40000,
    weight: "۹۰ گرم",
    badges: ["سالم", "پرفیبر"],
    allergens: ["گلوتن", "تخم‌مرغ"],
    ingredients: ["جو پرک", "آرد گندم", "کشمش", "عسل", "کره", "تخم‌مرغ", "دارچین", "جوز هندی"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: productOatmealRaisin, alt: "کوکی جو پرک و کشمش" },
    ],
    isFeatured: true,
    productCode: "CK-103",
  },
  {
    id: "4",
    slug: "peanut-butter",
    name: "کوکی کره بادام‌زمینی",
    shortDescription: "طعم آمریکایی با کره بادام‌زمینی خالص",
    longDescription: "کوکی محبوب آمریکایی با کره بادام‌زمینی ۱۰۰٪ خالص و بدون افزودنی. بافت نرم و چسبناک با طعم غنی بادام‌زمینی، همراه ایده‌آل شیر سرد است.",
    category: "مغزدار",
    categorySlug: "nutty",
    price: 48000,
    weight: "۸۰ گرم",
    badges: ["پروتئین‌دار"],
    allergens: ["گلوتن", "تخم‌مرغ", "بادام‌زمینی"],
    ingredients: ["کره بادام‌زمینی", "آرد گندم", "شکر قهوه‌ای", "تخم‌مرغ", "کره", "جوش شیرین", "نمک"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: productPeanutButter, alt: "کوکی کره بادام‌زمینی" },
    ],
    isFeatured: false,
    productCode: "CK-104",
  },
  {
    id: "5",
    slug: "white-chocolate-macadamia",
    name: "کوکی شکلات سفید و ماکادمیا",
    shortDescription: "لوکس‌ترین کوکی با مغز ماکادمیا",
    longDescription: "این کوکی لوکس با شکلات سفید بلژیکی و مغز ماکادمیای استرالیایی، انتخابی عالی برای مناسبت‌های خاص است. بافت کرمی شکلات سفید با ترد بودن ماکادمیا، تجربه‌ای منحصربه‌فرد خلق می‌کند.",
    category: "مناسب هدیه",
    categorySlug: "gift",
    price: 75000,
    weight: "۸۵ گرم",
    badges: ["لوکس", "هدیه"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر", "مغزها"],
    ingredients: ["آرد گندم", "کره", "شکلات سفید بلژیکی", "ماکادمیا", "شکر", "تخم‌مرغ", "وانیل"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "دور از گرما و در ظرف دربسته نگهداری کنید",
    images: [
      { url: productWhiteChocMacadamia, alt: "کوکی شکلات سفید و ماکادمیا" },
    ],
    isFeatured: true,
    productCode: "CK-105",
  },
  {
    id: "6",
    slug: "red-velvet",
    name: "کوکی رد ولوت",
    shortDescription: "کوکی قرمز مخملی با تکه‌های کرم‌پنیر",
    longDescription: "این کوکی خاص با رنگ قرمز مخملی زیبا و تکه‌های کرم‌پنیر، ترکیبی منحصربه‌فرد از طعم و ظاهر است. مناسب برای مناسبت‌های ویژه و عاشقانه.",
    category: "شکلاتی",
    categorySlug: "chocolate",
    price: 55000,
    weight: "۸۰ گرم",
    badges: ["جدید", "خاص"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر"],
    ingredients: ["آرد گندم", "کره", "پودر کاکائو", "کرم‌پنیر", "شکر", "تخم‌مرغ", "وانیل", "رنگ خوراکی قرمز"],
    shelfLife: "۵ روز در یخچال",
    storageTips: "در یخچال نگهداری کنید",
    images: [
      { url: productRedVelvet, alt: "کوکی رد ولوت" },
    ],
    isFeatured: true,
    productCode: "CK-106",
  },
  {
    id: "7",
    slug: "snickerdoodle",
    name: "کوکی اسنیکردودل",
    shortDescription: "کوکی دارچینی با روکش شکر و دارچین",
    longDescription: "کوکی کلاسیک آمریکایی با روکش شکر و دارچین که بافتی نرم و کمی چسبناک دارد. طعم شیرین و معطر دارچین آن را به انتخابی عالی برای پاییز و زمستان تبدیل کرده.",
    category: "کلاسیک",
    categorySlug: "classic",
    price: 38000,
    weight: "۷۵ گرم",
    badges: ["کلاسیک", "محبوب"],
    allergens: ["گلوتن", "تخم‌مرغ"],
    ingredients: ["آرد گندم", "کره", "شکر", "تخم‌مرغ", "دارچین", "خامه ترش", "وانیل"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: productSnickerdoodle, alt: "کوکی اسنیکردودل" },
    ],
    isFeatured: false,
    productCode: "CK-107",
  },
  {
    id: "8",
    slug: "gift-box-mixed",
    name: "باکس هدیه میکس",
    shortDescription: "۱۲ عدد کوکی منتخب در بسته‌بندی لوکس",
    longDescription: "این باکس هدیه شامل ۱۲ عدد از بهترین کوکی‌های ماست: دبل چاکلت، کلاسیک، جو پرک، شکلات سفید و اسنیکردودل. در جعبه زیبا با روبان، آماده هدیه دادن است.",
    category: "مناسب هدیه",
    categorySlug: "gift",
    price: 320000,
    weight: "۱ کیلوگرم",
    badges: ["هدیه", "پرفروش", "ویژه"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر", "مغزها"],
    ingredients: ["مجموعه‌ای از بهترین کوکی‌ها"],
    shelfLife: "۷ روز",
    storageTips: "در جای خنک و خشک نگهداری کنید",
    images: [
      { url: giftBoxImage, alt: "باکس هدیه میکس" },
    ],
    isFeatured: true,
    productCode: "CK-108",
  },
  {
    id: "9",
    slug: "assorted-pack",
    name: "پک متنوع خانوادگی",
    shortDescription: "مجموعه ۶ عددی از طعم‌های مختلف",
    longDescription: "یک پک کامل برای چشیدن طعم‌های مختلف کوکی‌های ما. شامل: شکلات چیپ، دبل چاکلت، جو پرک، کره بادام‌زمینی، اسنیکردودل و شکلات سفید.",
    category: "مناسب هدیه",
    categorySlug: "gift",
    price: 180000,
    weight: "۵۰۰ گرم",
    badges: ["متنوع", "خانوادگی"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر", "مغزها", "بادام‌زمینی"],
    ingredients: ["مجموعه متنوع کوکی‌ها"],
    shelfLife: "۷ روز",
    storageTips: "در جای خنک و خشک نگهداری کنید",
    images: [
      { url: lifestyleTwine, alt: "پک متنوع خانوادگی" },
    ],
    isFeatured: false,
    productCode: "CK-109",
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.isFeatured);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === "all") return products;
  return products.filter((p) => p.categorySlug === categorySlug);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
};
