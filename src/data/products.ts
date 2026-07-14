// Product data — sourced from Winimi Bakery catalog, adapted to the current UI schema.
import productChocolateChip from "@/assets/cookies/product-chocolate-chip.jpg";
import productOatmealRaisin from "@/assets/cookies/product-oatmeal-raisin.jpg";
import productDoubleChocolate from "@/assets/cookies/product-double-chocolate.jpg";
import productPeanutButter from "@/assets/cookies/product-peanut-butter.jpg";
import productWhiteChocMacadamia from "@/assets/cookies/product-white-choc-macadamia.jpg";
import productRedVelvet from "@/assets/cookies/product-red-velvet.jpg";
import productSnickerdoodle from "@/assets/cookies/product-snickerdoodle.jpg";
import giftBoxImage from "@/assets/cookies/gallery-gift-boxes.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import heroAssorted from "@/assets/cookies/hero-assorted.jpg";
import heroBreaking from "@/assets/cookies/hero-breaking.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";

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
  { name: "کوکی‌ها", slug: "cookies" },
  { name: "کیک و دسر", slug: "cakes" },
  { name: "رژیمی و بدون قند", slug: "diet" },
  { name: "باکس هدیه", slug: "gift" },
];

const DEFAULT_STORAGE = "در ظرف دربسته، جای خشک و خنک و دور از نور مستقیم نگهداری شود.";
const CAKE_STORAGE = "در یخچال و ظرف دربسته نگهداری شود.";

export const products: Product[] = [
  // ============ COOKIES ============
  {
    id: "c1",
    slug: "cookie-chocolate-walnut",
    name: "کوکی شکلاتی گردویی",
    shortDescription: "ترکیب شکلات تلخ و گردو توی هر گاز",
    longDescription:
      "کوکی شکلاتی گردویی وینیمی با شکلات تلخ باکیفیت و مغز گردوی تازه، برای عصرانه و پذیرایی خانگی انتخابی مطمئن است. بافت بیرون ترد و درون نرم.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "۲۵۰ گرم",
    badges: ["پرفروش"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات", "مغزها"],
    ingredients: ["آرد", "کره", "شکلات تلخ", "گردو", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productDoubleChocolate, alt: "کوکی شکلاتی گردویی وینیمی" }],
    isFeatured: true,
    productCode: "VIN-C1",
  },
  {
    id: "c2",
    slug: "cookie-diet",
    name: "کوکی رژیمی",
    shortDescription: "خوشمزه، سبک، همراه مسیر سلامتی‌ات",
    longDescription:
      "کوکی رژیمی وینیمی با آرد سبوس‌دار، جو دوسر و روغن گیاهی تهیه می‌شود. مناسب کسانی که به دنبال میان‌وعده سبک‌تر هستند. مصرف در رژیم درمانی باید با نظر متخصص باشد.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 110000,
    weight: "۲۵۰ گرم",
    badges: ["رژیمی"],
    allergens: ["گلوتن"],
    ingredients: ["آرد سبوس‌دار", "جو دوسر", "روغن گیاهی", "دارچین"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productOatmealRaisin, alt: "کوکی رژیمی وینیمی" }],
    isFeatured: true,
    productCode: "VIN-C2",
  },
  {
    id: "c3",
    slug: "cookie-crinkle",
    name: "کوکی ترک‌دار (کرینکل)",
    shortDescription: "ترک‌های پودر قند روی شکلات — انفجار خوشمزگی",
    longDescription:
      "کرینکل شکلاتی وینیمی با روکش پودر قند و بافت داخلی نرم و شکلاتی؛ یکی از محبوب‌ترین انتخاب‌های عصرانه.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 90000,
    weight: "۲۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "پودر کاکائو", "تخم‌مرغ", "کره", "پودر قند"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productDoubleChocolate, alt: "کوکی کرینکل شکلاتی" }],
    isFeatured: false,
    productCode: "VIN-C3",
  },
  {
    id: "c4",
    slug: "cookie-apple-cinnamon",
    name: "کوکی سیب و دارچین",
    shortDescription: "هر چی از طعمش بگم کمه",
    longDescription:
      "طعم گرم دارچین و شیرینی سیب در یک کوکی خانگی؛ همراه دلپذیر چای عصرانه.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 85000,
    weight: "۲۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "کره", "سیب", "دارچین", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productSnickerdoodle, alt: "کوکی سیب و دارچین" }],
    isFeatured: false,
    productCode: "VIN-C4",
  },
  {
    id: "c5",
    slug: "cookie-walnut",
    name: "کوکی گردویی",
    shortDescription: "کلاسیک، ساده، بی‌نظیر",
    longDescription:
      "کوکی گردویی کلاسیک وینیمی با مغز گردوی تازه؛ برای دوستداران طعم‌های خانگی و ساده.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 95000,
    weight: "۲۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات", "مغزها"],
    ingredients: ["آرد", "کره", "گردو", "تخم‌مرغ", "وانیل"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productChocolateChip, alt: "کوکی گردویی کلاسیک" }],
    isFeatured: false,
    productCode: "VIN-C5",
  },
  {
    id: "c6",
    slug: "cookie-red-velvet",
    name: "کوکی ردولوت",
    shortDescription: "با شکلات توت‌فرنگی که عاشقش میشی",
    longDescription:
      "ردولوت وینیمی با رنگ قرمز اشتها‌آور و طعم شکلات توت‌فرنگی؛ انتخابی خاص برای مناسبت‌های عاشقانه.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 105000,
    weight: "۲۵۰ گرم",
    badges: ["خاص"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "کره", "پودر کاکائو", "شکلات توت‌فرنگی", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productRedVelvet, alt: "کوکی ردولوت" }],
    isFeatured: true,
    productCode: "VIN-C6",
  },
  {
    id: "c7",
    slug: "cookie-snickers",
    name: "اسنیکرز در نقش کوکی",
    shortDescription: "وقتی اسنیکرز کوکی میشه — باید امتحانش کنی",
    longDescription:
      "کوکی وینیمی با الهام از اسنیکرز؛ ترکیب بادام‌زمینی، کارامل و شکلات که در هر گاز به تجربه‌ای متفاوت تبدیل می‌شود.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 120000,
    weight: "۲۵۰ گرم",
    badges: ["ویژه", "پرفروش"],
    allergens: ["گلوتن", "لبنیات", "بادام‌زمینی"],
    ingredients: ["آرد", "کره", "بادام‌زمینی", "کارامل", "شکلات"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productPeanutButter, alt: "کوکی اسنیکرز وینیمی" }],
    isFeatured: true,
    productCode: "VIN-C7",
  },
  {
    id: "c8",
    slug: "cookie-diabetic",
    name: "کوکی بدون قند افزوده",
    shortDescription: "بدون قند افزوده، با همان طعم شیرین",
    longDescription:
      "کوکی بدون قند افزوده وینیمی با شیرین‌کننده مجاز؛ اطلاعات این محصول توصیه پزشکی نیست و در بیماری‌های زمینه‌ای باید با متخصص مشورت کنید.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 115000,
    weight: "۲۵۰ گرم",
    badges: ["بدون قند افزوده"],
    allergens: ["گلوتن"],
    ingredients: ["آرد سبوس‌دار", "جو دوسر", "شیرین‌کننده مجاز", "روغن گیاهی"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productOatmealRaisin, alt: "کوکی بدون قند افزوده" }],
    isFeatured: false,
    productCode: "VIN-C8",
  },
  {
    id: "c9",
    slug: "cookie-mini-pack",
    name: "مینی کوکی (بسته ۱۰ عددی)",
    shortDescription: "ده تا مینی لذت توی یه بسته",
    longDescription:
      "بسته ۱۰ عددی مینی کوکی وینیمی با طعم‌های وانیل و شکلات؛ مناسب هدیه‌های کوچک و پذیرایی.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 80000,
    weight: "۱۸۰ گرم — ۱۰ عدد",
    badges: ["هدیه"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "کره", "شکلات", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: lifestyleTwine, alt: "بسته مینی کوکی وینیمی" }],
    isFeatured: true,
    productCode: "VIN-C9",
  },
  {
    id: "c10",
    slug: "croissant",
    name: "کروسان",
    shortDescription: "لایه‌لایه، تازه، کره‌ای",
    longDescription:
      "کروسان کره‌ای وینیمی با لایه‌های ترد؛ همراه ایده‌آل صبحانه و کافه‌های خانگی.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 140000,
    weight: "۱۲۰ گرم",
    badges: ["تازه"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "کره", "خمیرمایه", "شیر", "تخم‌مرغ"],
    shelfLife: "۳ روز در دمای اتاق",
    storageTips: DEFAULT_STORAGE,
    images: [{ url: productWhiteChocMacadamia, alt: "کروسان کره‌ای وینیمی" }],
    isFeatured: false,
    productCode: "VIN-C10",
  },

  // ============ CAKES ============
  {
    id: "k1",
    slug: "tiramisu",
    name: "تیرامیسو",
    shortDescription: "ایتالیایی، خامه‌ای، فراموش‌نشدنی",
    longDescription:
      "تیرامیسوی وینیمی با ماسکارپونه، قهوه اسپرسو و بیسکوئیت لیدی‌فینگر؛ دسر ایتالیایی کلاسیک برای دورهمی‌های خاص.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 420000,
    weight: "۷۰۰ گرم",
    badges: ["پرفروش", "ویژه"],
    allergens: ["گلوتن", "لبنیات", "تخم‌مرغ"],
    ingredients: ["بیسکوئیت لیدی‌فینگر", "قهوه", "پنیر ماسکارپونه", "خامه", "پودر کاکائو"],
    shelfLife: "۳ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: heroAssorted, alt: "تیرامیسو وینیمی" }],
    isFeatured: true,
    productCode: "VIN-K1",
  },
  {
    id: "k2",
    slug: "cheesecake",
    name: "چیزکیک",
    shortDescription: "کرمی و سنگین به بهترین شکل",
    longDescription:
      "چیزکیک وینیمی با پنیر خامه‌ای، بستر بیسکوئیتی و بافت لطیف؛ مناسب پذیرایی و مناسبت‌ها.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 350000,
    weight: "۶۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "لبنیات"],
    ingredients: ["پنیر خامه‌ای", "بیسکویت", "کره", "خامه", "وانیل"],
    shelfLife: "۳ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: lifestyleMilk, alt: "چیزکیک وینیمی" }],
    isFeatured: false,
    productCode: "VIN-K2",
  },
  {
    id: "k3",
    slug: "wet-chocolate-cake",
    name: "کیک خیس شکلاتی",
    shortDescription: "آنقدر مرطوب که قاشق توش فرو میره",
    longDescription:
      "کیک خیس شکلاتی وینیمی با بافت مرطوب و طعم غنی کاکائو؛ انتخابی مطمئن برای عاشقان شکلات.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 300000,
    weight: "۶۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "پودر کاکائو", "شیر", "تخم‌مرغ", "روغن"],
    shelfLife: "۴ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: heroBreaking, alt: "کیک خیس شکلاتی" }],
    isFeatured: true,
    productCode: "VIN-K3",
  },
  {
    id: "k4",
    slug: "red-velvet-cake",
    name: "کیک ردولوت",
    shortDescription: "قرمز، خامه‌ای، چشم‌نواز",
    longDescription:
      "کیک ردولوت وینیمی با فراستینگ پنیر خامه‌ای و رنگ قرمز مخملی؛ برای مناسبت‌های خاص.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 380000,
    weight: "۷۰۰ گرم",
    badges: ["ویژه"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "پودر کاکائو", "پنیر خامه‌ای", "خامه", "تخم‌مرغ"],
    shelfLife: "۳ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: productRedVelvet, alt: "کیک ردولوت وینیمی" }],
    isFeatured: false,
    productCode: "VIN-K4",
  },
  {
    id: "k5",
    slug: "carrot-walnut-cake",
    name: "کیک هویج گردو",
    shortDescription: "گرم، ادویه‌ای، خانگی",
    longDescription:
      "کیک هویج و گردوی وینیمی با ادویه‌های گرم و بافت خانگی؛ انتخابی مناسب برای عصرانه‌های پاییزی.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 280000,
    weight: "۶۰۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "مغزها"],
    ingredients: ["آرد", "هویج", "گردو", "دارچین", "تخم‌مرغ"],
    shelfLife: "۵ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: galleryBaking, alt: "کیک هویج و گردو" }],
    isFeatured: false,
    productCode: "VIN-K5",
  },
  {
    id: "k6",
    slug: "chocolate-cream-cake",
    name: "کیک شکلاتی خامه‌ای",
    shortDescription: "لایه‌های شکلات و خامه که تموم نمیشه",
    longDescription:
      "کیک لایه‌ای شکلاتی خامه‌ای وینیمی؛ ترکیبی متعادل از شکلات و خامه برای پذیرایی‌های ویژه.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 320000,
    weight: "۷۰۰ گرم",
    badges: ["پرفروش"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "خامه", "شکلات", "تخم‌مرغ", "شیر"],
    shelfLife: "۳ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: giftBoxImage, alt: "کیک شکلاتی خامه‌ای" }],
    isFeatured: true,
    productCode: "VIN-K6",
  },
  {
    id: "k7",
    slug: "baklava-cake",
    name: "کیک باقلوا",
    shortDescription: "عسل، خلال بادام، بافت منحصربه‌فرد",
    longDescription:
      "کیک باقلوای وینیمی با عسل و خلال بادام؛ ترکیب طعم‌های ایرانی در بافت یک کیک خانگی.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 290000,
    weight: "۶۰۰ گرم",
    badges: ["ایرانی"],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات", "مغزها"],
    ingredients: ["آرد", "عسل", "بادام", "کره", "تخم‌مرغ"],
    shelfLife: "۵ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: lifestyleBreaking, alt: "کیک باقلوا" }],
    isFeatured: false,
    productCode: "VIN-K7",
  },
  {
    id: "k8",
    slug: "three-milk-cake",
    name: "کیک سه شیر",
    shortDescription: "خیس از سه نوع شیر — سبک، لطیف، اعتیادآور",
    longDescription:
      "کیک سه شیر وینیمی؛ بافتی سبک و لطیف که در سه نوع شیر خیس می‌خورد و طعمی خنک و دلپذیر دارد.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 270000,
    weight: "۶۵۰ گرم",
    badges: [],
    allergens: ["گلوتن", "تخم‌مرغ", "لبنیات"],
    ingredients: ["آرد", "شیر", "خامه", "شیر عسلی", "تخم‌مرغ"],
    shelfLife: "۳ روز در یخچال",
    storageTips: CAKE_STORAGE,
    images: [{ url: galleryBakery, alt: "کیک سه شیر" }],
    isFeatured: false,
    productCode: "VIN-K8",
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.isFeatured);

export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === "all") return products;
  return products.filter((p) => p.categorySlug === categorySlug);
};

export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
