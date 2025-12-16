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
      { url: "/images/products/double-choco-1.jpg", alt: "کوکی دبل چاکلت چیپ" },
    ],
    isFeatured: true,
    productCode: "CK-101",
  },
  {
    id: "2",
    slug: "classic-vanilla",
    name: "کوکی وانیلی کلاسیک",
    shortDescription: "طعم اصیل و ساده وانیل ماداگاسکار",
    longDescription: "کوکی وانیلی ما با استفاده از غلاف وانیل طبیعی ماداگاسکار تهیه می‌شود. این کوکی ساده اما بی‌نظیر، همراه ایده‌آل چای عصرانه یا قهوه صبحگاهی شماست. بافت ترد و طعم ملایم آن، همه سنین را جذب می‌کند.",
    category: "کلاسیک",
    categorySlug: "classic",
    price: 35000,
    weight: "۷۰ گرم",
    badges: ["کلاسیک"],
    allergens: ["گلوتن", "تخم‌مرغ", "شیر"],
    ingredients: ["آرد گندم", "کره", "شکر", "تخم‌مرغ", "غلاف وانیل ماداگاسکار"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: "/images/products/vanilla-1.jpg", alt: "کوکی وانیلی کلاسیک" },
    ],
    isFeatured: true,
    productCode: "CK-102",
  },
  {
    id: "3",
    slug: "sugar-free-almond",
    name: "کوکی بادامی بدون شکر",
    shortDescription: "شیرینی سالم با شیره خرما و بادام ایرانی",
    longDescription: "این کوکی ویژه برای افرادی که به دنبال جایگزین سالم‌تر هستند طراحی شده. با استفاده از شیره خرمای طبیعی به جای شکر و بادام مرغوب ایرانی، طعمی دلپذیر و مقوی دارد. مناسب دیابتی‌ها و افرادی که رژیم کم‌قند دارند.",
    category: "رژیمی و بدون شکر",
    categorySlug: "diet",
    price: 55000,
    weight: "۷۵ گرم",
    badges: ["بدون شکر", "رژیمی"],
    allergens: ["گلوتن", "تخم‌مرغ", "مغزها"],
    ingredients: ["آرد گندم کامل", "شیره خرما", "بادام", "روغن نارگیل", "تخم‌مرغ", "دارچین"],
    shelfLife: "۵ روز در یخچال",
    storageTips: "در یخچال نگهداری کنید",
    images: [
      { url: "/images/products/almond-1.jpg", alt: "کوکی بادامی بدون شکر" },
    ],
    isFeatured: true,
    productCode: "CK-103",
  },
  {
    id: "4",
    slug: "pistachio-rose",
    name: "کوکی پسته و گلاب",
    shortDescription: "ترکیب اصیل ایرانی پسته کرمان و گلاب کاشان",
    longDescription: "این کوکی منحصربه‌فرد، ترکیبی از بهترین‌های ایران است. پسته تازه کرمان با عطر گلاب اصل کاشان، طعمی ایرانی و اصیل را خلق کرده که مناسب پذیرایی‌های خاص و هدیه است. تزئین شده با پسته‌های خرد شده روی آن.",
    category: "مغزدار",
    categorySlug: "nutty",
    price: 65000,
    weight: "۸۵ گرم",
    badges: ["پرفروش", "ایرانی اصیل"],
    allergens: ["گلوتن", "تخم‌مرغ", "مغزها"],
    ingredients: ["آرد گندم", "کره", "پسته کرمان", "گلاب کاشان", "شکر", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "در ظرف دربسته و خنک نگهداری کنید",
    images: [
      { url: "/images/products/pistachio-1.jpg", alt: "کوکی پسته و گلاب" },
    ],
    isFeatured: true,
    productCode: "CK-104",
  },
  {
    id: "5",
    slug: "walnut-maple",
    name: "کوکی گردویی با شیره افرا",
    shortDescription: "گردوی چهارمحال با شیره افرای کانادایی",
    longDescription: "ترکیبی بین‌المللی از گردوی مرغوب چهارمحال و بختیاری با شیره افرای اصل کانادا. این کوکی با بافتی نرم و طعمی کاراملی-مغزی، یکی از محبوب‌ترین انتخاب‌های مشتریان ماست.",
    category: "مغزدار",
    categorySlug: "nutty",
    price: 58000,
    weight: "۸۰ گرم",
    badges: ["جدید"],
    allergens: ["گلوتن", "تخم‌مرغ", "مغزها"],
    ingredients: ["آرد گندم", "کره", "گردو", "شیره افرا", "شکر قهوه‌ای", "تخم‌مرغ", "نمک دریایی"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: "/images/products/walnut-1.jpg", alt: "کوکی گردویی با شیره افرا" },
    ],
    isFeatured: false,
    productCode: "CK-105",
  },
  {
    id: "6",
    slug: "oatmeal-raisin",
    name: "کوکی جو پرک و کشمش",
    shortDescription: "کوکی سالم و مقوی با فیبر بالا",
    longDescription: "این کوکی سالم با جو پرک کامل و کشمش طلایی ایرانی تهیه می‌شود. سرشار از فیبر و انرژی، مناسب صبحانه سریع یا میان‌وعده ورزشکاران است. طعم دارچین و عسل آن را دلپذیرتر می‌کند.",
    category: "کلاسیک",
    categorySlug: "classic",
    price: 40000,
    weight: "۹۰ گرم",
    badges: ["سالم", "پرفیبر"],
    allergens: ["گلوتن", "تخم‌مرغ"],
    ingredients: ["جو پرک", "آرد گندم", "کشمش", "عسل", "کره", "تخم‌مرغ", "دارچین", "جوز هندی"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: "/images/products/oatmeal-1.jpg", alt: "کوکی جو پرک و کشمش" },
    ],
    isFeatured: false,
    productCode: "CK-106",
  },
  {
    id: "7",
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
      { url: "/images/products/white-choco-1.jpg", alt: "کوکی شکلات سفید و ماکادمیا" },
    ],
    isFeatured: true,
    productCode: "CK-107",
  },
  {
    id: "8",
    slug: "peanut-butter",
    name: "کوکی کره بادام‌زمینی",
    shortDescription: "طعم آمریکایی با کره بادام‌زمینی خالص",
    longDescription: "کوکی محبوب آمریکایی با کره بادام‌زمینی ۱۰۰٪ خالص و بدون افزودنی. بافت نرم و چسبناک با طعم غنی بادام‌زمینی، همراه ایده‌آل شیر سرد است.",
    category: "کلاسیک",
    categorySlug: "classic",
    price: 48000,
    weight: "۸۰ گرم",
    badges: ["پروتئین‌دار"],
    allergens: ["گلوتن", "تخم‌مرغ", "بادام‌زمینی"],
    ingredients: ["کره بادام‌زمینی", "آرد گندم", "شکر قهوه‌ای", "تخم‌مرغ", "کره", "جوش شیرین", "نمک"],
    shelfLife: "۷ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: "/images/products/peanut-1.jpg", alt: "کوکی کره بادام‌زمینی" },
    ],
    isFeatured: false,
    productCode: "CK-108",
  },
  {
    id: "9",
    slug: "gift-box-mixed",
    name: "باکس هدیه میکس",
    shortDescription: "۱۲ عدد کوکی منتخب در بسته‌بندی لوکس",
    longDescription: "این باکس هدیه شامل ۱۲ عدد از بهترین کوکی‌های ماست: دبل چاکلت، پسته گلاب، وانیلی، گردویی، شکلات سفید و جو پرک. در جعبه چوبی زیبا با روبان ساتن، آماده هدیه دادن است.",
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
      { url: "/images/products/gift-box-1.jpg", alt: "باکس هدیه میکس" },
    ],
    isFeatured: true,
    productCode: "CK-109",
  },
  {
    id: "10",
    slug: "vegan-coconut",
    name: "کوکی نارگیلی وگان",
    shortDescription: "بدون لبنیات و تخم‌مرغ، ۱۰۰٪ گیاهی",
    longDescription: "این کوکی وگان با نارگیل رنده و شیر نارگیل تهیه می‌شود. بدون هیچ محصول حیوانی، مناسب وگان‌ها و کسانی که به لبنیات حساسیت دارند. طعم شیرین و استوایی نارگیل در هر گاز.",
    category: "رژیمی و بدون شکر",
    categorySlug: "diet",
    price: 52000,
    weight: "۷۵ گرم",
    badges: ["وگان", "بدون لبنیات"],
    allergens: ["گلوتن", "نارگیل"],
    ingredients: ["آرد گندم", "نارگیل رنده", "شیر نارگیل", "روغن نارگیل", "شکر نارگیل", "جوش شیرین"],
    shelfLife: "۱۰ روز در دمای اتاق",
    storageTips: "در ظرف دربسته نگهداری کنید",
    images: [
      { url: "/images/products/coconut-1.jpg", alt: "کوکی نارگیلی وگان" },
    ],
    isFeatured: false,
    productCode: "CK-110",
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
