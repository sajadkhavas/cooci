// Product data — complete Winimi Bakery catalog adapted to the current visual UI schema.
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

export type ShippingScope = "nationwide" | "tehran-karaj";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categorySlug: string;
  price?: number;
  priceToman?: number;
  salePriceToman?: number;
  weight?: string;
  weightGrams?: number;
  quantityPerPack?: number;
  badges: string[];
  tags?: string[];
  flavors?: string[];
  allergens: string[];
  ingredients: string[];
  shelfLife: string;
  shelfLifeDays?: number;
  storageTips: string;
  preparationTimeDays?: number;
  stock?: number;
  requiresCooling?: boolean;
  shippingScope?: ShippingScope;
  shippingNote?: string;
  images: { url: string; alt: string }[];
  isFeatured: boolean;
  productCode: string;
  variants?: {
    id: string;
    name: string;
    price?: number;
    weight?: string;
    productCode?: string;
    description?: string;
  }[];
  seo?: {
    title: string;
    description: string;
  };
}

export const categories = [
  { name: "همه", slug: "all" },
  { name: "کوکی‌ها", slug: "cookies" },
  { name: "مینی کوکی", slug: "mini-cookies" },
  { name: "کیک و دسر", slug: "cakes" },
  { name: "رژیمی و بدون قند", slug: "diet" },
  { name: "رول و کروسان", slug: "pastry" },
  { name: "باکس هدیه", slug: "gift" },
];

const DRY_STORAGE = "در ظرف دربسته، جای خشک و خنک و دور از نور مستقیم نگهداری شود.";
const CHILLED_STORAGE = "در یخچال و ظرف دربسته نگهداری شود و تا زمان مصرف زنجیره سرد حفظ شود.";
const DRY_SHIPPING = "ارسال این محصول با بسته‌بندی محافظ به سراسر ایران امکان‌پذیر است.";
const CHILLED_SHIPPING = "این محصول یخچالی است و فقط در تهران و کرج قابل ارسال است.";
const DEFAULT_ALLERGENS = ["گلوتن", "تخم‌مرغ", "لبنیات"];

type ProductInput = Omit<
  Product,
  "storageTips" | "requiresCooling" | "shippingScope" | "shippingNote" | "shelfLifeDays" | "preparationTimeDays" | "stock" | "priceToman"
> &
  Partial<Pick<Product, "storageTips" | "requiresCooling" | "shippingScope" | "shippingNote" | "shelfLifeDays" | "preparationTimeDays" | "stock" | "priceToman" | "variants">>;

function dryProduct(input: ProductInput): Product {
  return {
    requiresCooling: false,
    shippingScope: "nationwide",
    shippingNote: DRY_SHIPPING,
    storageTips: DRY_STORAGE,
    shelfLifeDays: 7,
    preparationTimeDays: 1,
    stock: 20,
    priceToman: input.price,
    ...input,
  };
}

function chilledProduct(input: ProductInput): Product {
  return {
    requiresCooling: true,
    shippingScope: "tehran-karaj",
    shippingNote: CHILLED_SHIPPING,
    storageTips: CHILLED_STORAGE,
    shelfLifeDays: 3,
    preparationTimeDays: 1,
    stock: 10,
    priceToman: input.price,
    ...input,
  };
}

export const products: Product[] = [
  dryProduct({
    id: "cookie-001",
    slug: "cookie-chocolate-walnut",
    name: "کوکی شکلاتی گردویی",
    shortDescription: "کوکی شکلاتی با تکه‌های گردو و شکلات، یکی از طعم‌های محبوب وینیمی.",
    longDescription:
      "کوکی شکلاتی گردویی وینیمی با بافت نرم، تکه‌های شکلات و گردوی تازه آماده می‌شود. این محصول برای عصرانه، پذیرایی و سفارش‌های روزمره انتخابی مطمئن است و طبق اطلاعات برند، قیمت هر عدد آن ۱۰۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["پرفروش"],
    tags: ["کوکی", "شکلات", "گردو", "پرفروش"],
    flavors: ["شکلات", "گردو"],
    allergens: [...DEFAULT_ALLERGENS, "گردو"],
    ingredients: ["آرد", "کره", "شکلات", "گردو", "تخم‌مرغ"],
    shelfLife: "۷ روز مثل روز اول تازه و باکیفیت",
    images: [{ url: productDoubleChocolate, alt: "کوکی شکلاتی گردویی وینیمی" }],
    isFeatured: true,
    productCode: "VIN-CW-001",
  }),
  dryProduct({
    id: "cookie-002",
    slug: "cookie-red-velvet",
    name: "کوکی ردولوت",
    shortDescription: "کوکی ردولوت با طعم خاص و ظاهر مناسب هدیه‌های کوچک.",
    longDescription:
      "کوکی ردولوت وینیمی با رنگ جذاب، بافت نرم و طعم شیرین متعادل تهیه می‌شود. این محصول برای هدیه‌های کوچک، پک‌های ترکیبی و پذیرایی مناسب است. قیمت اعلام‌شده برای هر عدد ۱۰۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["محبوب"],
    tags: ["کوکی", "ردولوت", "هدیه"],
    flavors: ["ردولوت", "شکلات"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "پودر کاکائو", "تخم‌مرغ", "وانیل"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productRedVelvet, alt: "کوکی ردولوت وینیمی" }],
    isFeatured: true,
    productCode: "VIN-CR-002",
  }),
  dryProduct({
    id: "cookie-003",
    slug: "cookie-oreo",
    name: "کوکی اورئو",
    shortDescription: "کوکی با طعم اورئو برای طرفداران شکلات و بیسکویت.",
    longDescription:
      "کوکی اورئو وینیمی برای دوستداران طعم بیسکویتی و شکلاتی طراحی شده است. ترکیب خمیر کوکی با تکه‌های اورئو، بافتی متفاوت و مناسب سفارش‌های تک‌نفره ایجاد می‌کند. قیمت اعلام‌شده برای هر عدد ۱۱۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 110000,
    weight: "هر عدد",
    weightGrams: 85,
    badges: ["جدید"],
    tags: ["کوکی", "اورئو", "شکلاتی"],
    flavors: ["اورئو", "شکلات"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "اورئو", "شکلات", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productChocolateChip, alt: "کوکی اورئو وینیمی" }],
    isFeatured: false,
    productCode: "VIN-CO-003",
  }),
  dryProduct({
    id: "cookie-004",
    slug: "cookie-hazelnut-white-chocolate",
    name: "کوکی فندقی با مغزی شکلات سفید",
    shortDescription: "کوکی فندقی با مغزی شکلات سفید در مرکز کوکی.",
    longDescription:
      "کوکی فندقی وینیمی با مغزی شکلات سفید در وسط، برای کسانی مناسب است که طعم مغزدار و بافت غنی‌تر را دوست دارند. قیمت اعلام‌شده برای هر عدد ۱۳۸ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 138000,
    weight: "هر عدد",
    weightGrams: 90,
    badges: ["ویژه"],
    tags: ["کوکی", "فندق", "شکلات سفید"],
    flavors: ["فندق", "شکلات سفید"],
    allergens: [...DEFAULT_ALLERGENS, "فندق"],
    ingredients: ["آرد", "کره", "فندق", "شکلات سفید", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productWhiteChocMacadamia, alt: "کوکی فندقی با مغزی شکلات سفید" }],
    isFeatured: true,
    productCode: "VIN-CH-004",
  }),
  dryProduct({
    id: "cookie-005",
    slug: "cookie-apple-cinnamon",
    name: "کوکی سیب دارچین",
    shortDescription: "کوکی گرم و عطری با طعم سیب و دارچین.",
    longDescription:
      "کوکی سیب دارچین وینیمی با عطر دارچین و شیرینی ملایم سیب آماده می‌شود. برای کنار چای و عصرانه خانگی گزینه‌ای گرم و دلنشین است. قیمت اعلام‌شده برای هر عدد ۱۰۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: [],
    tags: ["کوکی", "سیب", "دارچین"],
    flavors: ["سیب", "دارچین"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "سیب", "دارچین", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productSnickerdoodle, alt: "کوکی سیب دارچین" }],
    isFeatured: false,
    productCode: "VIN-CA-005",
  }),
  dryProduct({
    id: "cookie-006",
    slug: "cookie-snickers",
    name: "کوکی اسنیکرز",
    shortDescription: "کوکی الهام‌گرفته از اسنیکرز با طعم شکلات و مغزیجات.",
    longDescription:
      "کوکی اسنیکرز وینیمی با طعمی نزدیک به شکلات، مغزیجات و کارامل آماده می‌شود. این محصول برای طرفداران طعم‌های پرانرژی و شیرین انتخاب خاصی است. قیمت اعلام‌شده برای هر عدد ۱۰۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 85,
    badges: ["خاص"],
    tags: ["کوکی", "اسنیکرز", "شکلات"],
    flavors: ["شکلات", "کارامل", "مغزیجات"],
    allergens: [...DEFAULT_ALLERGENS, "بادام‌زمینی"],
    ingredients: ["آرد", "کره", "شکلات", "کارامل", "بادام‌زمینی"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productPeanutButter, alt: "کوکی اسنیکرز وینیمی" }],
    isFeatured: false,
    productCode: "VIN-CS-006",
  }),
  dryProduct({
    id: "cookie-007",
    slug: "cookie-crinkle",
    name: "کوکی کرینکل",
    shortDescription: "کوکی ترک‌دار شکلاتی با ظاهر کلاسیک و جذاب.",
    longDescription:
      "کوکی کرینکل وینیمی با ظاهر ترک‌دار، بافت نرم و طعم شکلاتی آماده می‌شود. برای پذیرایی، هدیه‌های کوچک و سفارش‌های ترکیبی گزینه‌ای جذاب است. قیمت اعلام‌شده برای هر عدد ۱۰۰ هزار تومان است.",
    category: "کوکی‌ها",
    categorySlug: "cookies",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: [],
    tags: ["کوکی", "کرینکل", "شکلات"],
    flavors: ["شکلات"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "پودر کاکائو", "کره", "تخم‌مرغ", "پودر قند"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productDoubleChocolate, alt: "کوکی کرینکل شکلاتی" }],
    isFeatured: false,
    productCode: "VIN-CC-007",
  }),
  dryProduct({
    id: "mini-001",
    slug: "mini-cookie-vanilla-chocolate-chip",
    name: "مینی کوکی وانیلی با تکه‌های شکلات",
    shortDescription: "مینی کوکی وانیلی، کیلویی ۱ میلیون و ۲۰۰ هزار تومان، حدود ۱۰۰ عدد در هر کیلو.",
    longDescription:
      "مینی کوکی وانیلی وینیمی با تکه‌های شکلات برای پذیرایی، هدیه و سفارش‌های تعداد بالا مناسب است. طبق اطلاعات برند، هر کیلو حدود ۱۰۰ عدد دارد و قیمت هر کیلو ۱ میلیون و ۲۰۰ هزار تومان است.",
    category: "مینی کوکی",
    categorySlug: "mini-cookies",
    price: 1200000,
    weight: "۱ کیلو — حدود ۱۰۰ عدد",
    weightGrams: 1000,
    quantityPerPack: 100,
    badges: ["کیلویی"],
    tags: ["مینی کوکی", "وانیلی", "شکلات"],
    flavors: ["وانیل", "شکلات"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "وانیل", "تکه‌های شکلات", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: lifestyleTwine, alt: "مینی کوکی وانیلی با تکه‌های شکلات" }],
    isFeatured: true,
    productCode: "VIN-MV-008",
  }),
  dryProduct({
    id: "mini-002",
    slug: "mini-cookie-chocolate-chip",
    name: "مینی کوکی شکلاتی با تکه‌های شکلات",
    shortDescription: "مینی کوکی شکلاتی کیلویی، حدود ۱۰۰ عدد در هر کیلو.",
    longDescription:
      "مینی کوکی شکلاتی وینیمی با تکه‌های شکلات برای پک‌های پذیرایی، سفارش سازمانی و کافه مناسب است. قیمت هر کیلو ۱ میلیون و ۲۰۰ هزار تومان و هر کیلو حدود ۱۰۰ عدد است.",
    category: "مینی کوکی",
    categorySlug: "mini-cookies",
    price: 1200000,
    weight: "۱ کیلو — حدود ۱۰۰ عدد",
    weightGrams: 1000,
    quantityPerPack: 100,
    badges: ["کیلویی"],
    tags: ["مینی کوکی", "شکلاتی"],
    flavors: ["شکلات"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "پودر کاکائو", "تکه‌های شکلات", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: lifestyleBreaking, alt: "مینی کوکی شکلاتی وینیمی" }],
    isFeatured: false,
    productCode: "VIN-MC-009",
  }),
  dryProduct({
    id: "mini-003",
    slug: "mini-cookie-red-velvet",
    name: "مینی کوکی ردولوت",
    shortDescription: "مینی کوکی ردولوت کیلویی، مناسب پذیرایی و هدیه.",
    longDescription:
      "مینی کوکی ردولوت وینیمی برای کسانی که طعم ردولوت را در اندازه کوچک و تعداد بالا می‌خواهند مناسب است. هر کیلو حدود ۱۰۰ عدد دارد و قیمت هر کیلو ۱ میلیون و ۲۰۰ هزار تومان است.",
    category: "مینی کوکی",
    categorySlug: "mini-cookies",
    price: 1200000,
    weight: "۱ کیلو — حدود ۱۰۰ عدد",
    weightGrams: 1000,
    quantityPerPack: 100,
    badges: ["کیلویی"],
    tags: ["مینی کوکی", "ردولوت"],
    flavors: ["ردولوت"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "پودر کاکائو", "وانیل", "تخم‌مرغ"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productRedVelvet, alt: "مینی کوکی ردولوت" }],
    isFeatured: false,
    productCode: "VIN-MR-010",
  }),
  dryProduct({
    id: "diet-001",
    slug: "cookie-diet-oat-raisin",
    name: "کوکی رژیمی جو پرک و کشمش",
    shortDescription: "کوکی رژیمی با جو پرک و کشمش، مناسب انتخاب سبک‌تر.",
    longDescription:
      "کوکی رژیمی وینیمی با جو پرک و کشمش تهیه می‌شود و برای کسانی مناسب است که می‌خواهند میان‌وعده‌ای سبک‌تر انتخاب کنند. قیمت اعلام‌شده برای هر عدد ۱۰۰ هزار تومان است.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["رژیمی"],
    tags: ["رژیمی", "جو پرک", "کشمش"],
    flavors: ["جو پرک", "کشمش"],
    allergens: ["گلوتن"],
    ingredients: ["جو پرک", "کشمش", "آرد سبوس‌دار", "روغن گیاهی", "دارچین"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productOatmealRaisin, alt: "کوکی رژیمی جو پرک و کشمش" }],
    isFeatured: true,
    productCode: "VIN-DO-011",
  }),
  dryProduct({
    id: "diet-002",
    slug: "diabetic-cookie-pistachio",
    name: "کوکی دیابتی پسته‌ای",
    shortDescription: "کوکی بدون قند افزوده با طعم پسته‌ای، از پرفروش‌های وینیمی.",
    longDescription:
      "کوکی دیابتی پسته‌ای وینیمی طبق توضیح برند، از محصولات پرفروش برای افرادی است که دنبال گزینه بدون قند افزوده هستند. این محصول توصیه پزشکی نیست و مصرف آن برای بیماران باید با نظر پزشک یا متخصص انجام شود.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["بدون قند افزوده", "پرفروش"],
    tags: ["دیابتی", "بدون قند افزوده", "پسته"],
    flavors: ["پسته"],
    allergens: ["گلوتن", "پسته"],
    ingredients: ["آرد سبوس‌دار", "پسته", "شیرین‌کننده مجاز", "روغن گیاهی"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productOatmealRaisin, alt: "کوکی دیابتی پسته‌ای" }],
    isFeatured: true,
    productCode: "VIN-DP-012",
  }),
  dryProduct({
    id: "diet-003",
    slug: "diabetic-cookie-walnut",
    name: "کوکی دیابتی گردویی",
    shortDescription: "کوکی بدون قند افزوده با طعم گردویی.",
    longDescription:
      "کوکی دیابتی گردویی وینیمی برای افرادی طراحی شده که به دنبال گزینه بدون قند افزوده با طعم مغزدار هستند. مواد اولیه و آلرژن‌ها شفاف اعلام می‌شود و مصرف آن برای رژیم درمانی باید با نظر متخصص باشد.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["بدون قند افزوده"],
    tags: ["دیابتی", "گردویی", "بدون قند افزوده"],
    flavors: ["گردو"],
    allergens: ["گلوتن", "گردو"],
    ingredients: ["آرد سبوس‌دار", "گردو", "شیرین‌کننده مجاز", "روغن گیاهی"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productChocolateChip, alt: "کوکی دیابتی گردویی" }],
    isFeatured: false,
    productCode: "VIN-DW-013",
  }),
  dryProduct({
    id: "diet-004",
    slug: "diabetic-cookie-coconut",
    name: "کوکی دیابتی نارگیلی",
    shortDescription: "کوکی بدون قند افزوده با طعم نارگیلی.",
    longDescription:
      "کوکی دیابتی نارگیلی وینیمی یکی از سه طعم کوکی‌های دیابتی برند است. این محصول بدون قند افزوده معرفی می‌شود اما جایگزین توصیه پزشکی نیست و برای بیماران باید با مشورت متخصص مصرف شود.",
    category: "رژیمی و بدون قند",
    categorySlug: "diet",
    price: 100000,
    weight: "هر عدد",
    weightGrams: 80,
    badges: ["بدون قند افزوده"],
    tags: ["دیابتی", "نارگیلی", "بدون قند افزوده"],
    flavors: ["نارگیل"],
    allergens: ["گلوتن"],
    ingredients: ["آرد سبوس‌دار", "نارگیل", "شیرین‌کننده مجاز", "روغن گیاهی"],
    shelfLife: "۷ روز در دمای اتاق",
    images: [{ url: productWhiteChocMacadamia, alt: "کوکی دیابتی نارگیلی" }],
    isFeatured: false,
    productCode: "VIN-DC-014",
  }),
  chilledProduct({
    id: "cake-001",
    slug: "san-sebastian-cheesecake-slice",
    name: "چیزکیک سن سباستین",
    shortDescription: "اسلایس چیزکیک سن سباستین با بافت کرمی و رویه کاراملی.",
    longDescription:
      "چیزکیک سن سباستین وینیمی به صورت اسلایس عرضه می‌شود و به دلیل بافت کرمی و نیاز به نگهداری سرد، فقط در تهران و کرج ارسال می‌شود. قیمت اعلام‌شده برای هر اسلایس ۱۹۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 190000,
    weight: "هر اسلایس",
    weightGrams: 150,
    badges: ["یخچالی", "پرفروش"],
    tags: ["چیزکیک", "سن سباستین", "یخچالی"],
    flavors: ["پنیر خامه‌ای", "کارامل"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["پنیر خامه‌ای", "خامه", "تخم‌مرغ", "شکر", "وانیل"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: lifestyleMilk, alt: "چیزکیک سن سباستین وینیمی" }],
    isFeatured: true,
    productCode: "VIN-SS-015",
  }),
  chilledProduct({
    id: "cake-002",
    slug: "pomegranate-cheesecake-single",
    name: "چیزکیک انار تک‌نفره",
    shortDescription: "چیزکیک تک‌نفره با طعم انار و ظاهر مناسب پذیرایی.",
    longDescription:
      "چیزکیک انار تک‌نفره وینیمی برای پذیرایی‌های خاص و سفارش‌های مناسبتی آماده می‌شود. این محصول یخچالی است و فقط در تهران و کرج ارسال می‌شود. قیمت اعلام‌شده ۲۳۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 230000,
    weight: "تک‌نفره",
    weightGrams: 160,
    badges: ["یخچالی", "خاص"],
    tags: ["چیزکیک", "انار", "تک‌نفره"],
    flavors: ["انار", "پنیر خامه‌ای"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["پنیر خامه‌ای", "خامه", "انار", "بیسکویت", "کره"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: heroAssorted, alt: "چیزکیک انار تک‌نفره" }],
    isFeatured: false,
    productCode: "VIN-PC-016",
  }),
  chilledProduct({
    id: "cake-003",
    slug: "classic-cheesecake-single",
    name: "چیزکیک تک‌نفره",
    shortDescription: "چیزکیک تک‌نفره کلاسیک با بافت لطیف.",
    longDescription:
      "چیزکیک تک‌نفره وینیمی با بافت لطیف و طعم کرمی آماده می‌شود. این محصول جزو شیرینی تر است و باید در یخچال نگهداری شود. قیمت اعلام‌شده برای هر عدد ۱۵۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 150000,
    weight: "تک‌نفره",
    weightGrams: 150,
    badges: ["یخچالی"],
    tags: ["چیزکیک", "تک‌نفره"],
    flavors: ["پنیر خامه‌ای", "وانیل"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["پنیر خامه‌ای", "بیسکویت", "کره", "خامه", "وانیل"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: lifestyleMilk, alt: "چیزکیک تک‌نفره وینیمی" }],
    isFeatured: false,
    productCode: "VIN-CK-017",
  }),
  chilledProduct({
    id: "cake-004",
    slug: "tiramisu-single",
    name: "تیرامیسو تک‌نفره",
    shortDescription: "لیدی فینگر دیپ‌شده در قهوه دمی با خامه پنیر و پودر کاکائو.",
    longDescription:
      "تیرامیسوی تک‌نفره وینیمی با لیدی فینگرهای دیپ‌شده در قهوه دمی، خامه پنیر و پودر کاکائو آماده می‌شود. به دلیل ماهیت یخچالی، ارسال آن فقط در تهران و کرج انجام می‌شود. قیمت اعلام‌شده ۱۵۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 150000,
    weight: "تک‌نفره یا ۲۴ سانتی (۸ تا ۱۰ نفر)",
    weightGrams: 160,
    badges: ["یخچالی", "پرفروش"],
    tags: ["تیرامیسو", "قهوه", "یخچالی"],
    flavors: ["قهوه", "کاکائو", "خامه پنیر"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["لیدی فینگر", "قهوه دمی", "خامه پنیر", "پودر کاکائو"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: heroAssorted, alt: "تیرامیسو وینیمی" }],
    isFeatured: true,
    productCode: "VIN-TS-018",
    variants: [
      { id: "single", name: "تک‌نفره", price: 150000, weight: "تک‌نفره", productCode: "VIN-TS-018" },
      { id: "24cm", name: "۲۴ سانتی — مناسب ۸ تا ۱۰ نفر", price: 1500000, weight: "۲۴ سانتی", productCode: "VIN-TL-019" },
    ],
  }),
  chilledProduct({
    id: "cake-005",
    slug: "tiramisu-24cm",
    name: "تیرامیسو ۲۴ سانتی",
    shortDescription: "تیرامیسوی ۲۴ سانتی مناسب ۸ تا ۱۰ نفر.",
    longDescription:
      "تیرامیسوی ۲۴ سانتی وینیمی با لیدی فینگرهای دیپ‌شده در قهوه دمی، خامه پنیر و پودر کاکائو آماده می‌شود. مناسب ۸ تا ۱۰ نفر است و قیمت اعلام‌شده ۱ میلیون و ۵۰۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 1500000,
    weight: "۲۴ سانتی — مناسب ۸ تا ۱۰ نفر",
    weightGrams: 1200,
    badges: ["یخچالی", "دورهمی"],
    tags: ["تیرامیسو", "۲۴ سانتی", "مهمانی"],
    flavors: ["قهوه", "کاکائو", "خامه پنیر"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["لیدی فینگر", "قهوه دمی", "خامه پنیر", "پودر کاکائو"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: galleryBakery, alt: "تیرامیسو ۲۴ سانتی وینیمی" }],
    isFeatured: false,
    productCode: "VIN-TL-019",
  }),
  chilledProduct({
    id: "cake-006",
    slug: "chocolate-cream-cake-single",
    name: "کیک خامه‌ای شکلاتی",
    shortDescription: "کیک خامه‌ای شکلاتی تک‌نفره.",
    longDescription:
      "کیک خامه‌ای شکلاتی وینیمی به صورت تک‌نفره آماده می‌شود و برای مصرف تازه، باید در یخچال نگهداری شود. قیمت اعلام‌شده برای هر عدد ۱۲۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 120000,
    weight: "تک‌نفره",
    weightGrams: 150,
    badges: ["یخچالی"],
    tags: ["کیک", "خامه‌ای", "شکلاتی"],
    flavors: ["شکلات", "خامه"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "خامه", "شکلات", "تخم‌مرغ", "شیر"],
    shelfLife: "۳ روز در یخچال",
    images: [{ url: giftBoxImage, alt: "کیک خامه‌ای شکلاتی" }],
    isFeatured: false,
    productCode: "VIN-CHC-020",
  }),
  chilledProduct({
    id: "cake-007",
    slug: "wet-chocolate-cake-slice",
    name: "کیک خیس شکلاتی",
    shortDescription: "کیک خیس شکلاتی تک‌نفره اسلایسی.",
    longDescription:
      "کیک خیس شکلاتی وینیمی با بافت مرطوب و طعم پررنگ کاکائو آماده می‌شود. این محصول به صورت تک‌نفره اسلایسی عرضه می‌شود و قیمت اعلام‌شده ۱۵۰ هزار تومان است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 150000,
    weight: "تک‌نفره اسلایسی",
    weightGrams: 160,
    badges: ["یخچالی"],
    tags: ["کیک", "شکلاتی", "اسلایسی"],
    flavors: ["شکلات", "کاکائو"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "پودر کاکائو", "شیر", "تخم‌مرغ", "روغن"],
    shelfLife: "۴ روز در یخچال",
    images: [{ url: heroBreaking, alt: "کیک خیس شکلاتی" }],
    isFeatured: true,
    productCode: "VIN-WC-021",
  }),
  chilledProduct({
    id: "cake-008",
    slug: "baklava-cake-slice",
    name: "کیک باقلوا اسلایسی",
    shortDescription: "کیک باقلوا حاوی زعفران، اسلایسی یا رینگ کامل.",
    longDescription:
      "کیک باقلوای وینیمی حاوی زعفران است و به صورت اسلایسی یا رینگ کامل ارائه می‌شود. قیمت اسلایس ۱۵۰ هزار تومان و رینگ کامل ۱۰ اسلایسی ۱ میلیون و ۵۰۰ هزار تومان اعلام شده است.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    price: 150000,
    weight: "اسلایسی — رینگ کامل ۱۰ اسلایس: ۱,۵۰۰,۰۰۰ تومان",
    weightGrams: 150,
    badges: ["ایرانی", "زعفرانی"],
    tags: ["کیک باقلوا", "زعفران", "اسلایسی"],
    flavors: ["زعفران", "باقلوا"],
    allergens: [...DEFAULT_ALLERGENS, "مغزها"],
    ingredients: ["آرد", "زعفران", "کره", "تخم‌مرغ", "مغزها"],
    shelfLife: "۵ روز در یخچال",
    images: [{ url: lifestyleBreaking, alt: "کیک باقلوا وینیمی" }],
    isFeatured: false,
    productCode: "VIN-BC-022",
    variants: [
      { id: "slice", name: "اسلایس", price: 150000, weight: "یک اسلایس", productCode: "VIN-BC-022" },
      { id: "ring", name: "رینگ کامل — ۱۰ اسلایس", price: 1500000, weight: "۱۰ اسلایس", productCode: "VIN-BC-022-R" },
    ],
  }),
  chilledProduct({
    id: "cake-009",
    slug: "carrot-walnut-cake",
    name: "کیک هویج گردو",
    shortDescription: "کیک هویج گردو با طعم خانگی و ادویه‌های گرم.",
    longDescription:
      "کیک هویج گردو وینیمی با هویج تازه، گردو و ادویه‌های گرم آماده می‌شود. قیمت نهایی این محصول باید هنگام ثبت سفارش از وینیمی استعلام شود.",
    category: "کیک و دسر",
    categorySlug: "cakes",
    weight: "قیمت با هماهنگی سفارش",
    weightGrams: 600,
    badges: ["خانگی"],
    tags: ["کیک هویج", "گردو"],
    flavors: ["هویج", "گردو", "دارچین"],
    allergens: ["گلوتن", "تخم‌مرغ", "گردو"],
    ingredients: ["آرد", "هویج", "گردو", "دارچین", "تخم‌مرغ"],
    shelfLife: "۵ روز در یخچال",
    images: [{ url: galleryBaking, alt: "کیک هویج گردو" }],
    isFeatured: false,
    productCode: "VIN-CWC-023",
  }),
  dryProduct({
    id: "pastry-001",
    slug: "cinnamon-roll",
    name: "رول دارچینی",
    shortDescription: "رول دارچینی حاوی گردو، شکلات و کرمفیل وانیلی.",
    longDescription:
      "رول دارچینی وینیمی با گردو، شکلات و کرمفیل وانیلی آماده می‌شود. برای صبحانه، عصرانه و سفارش‌های خانگی گزینه‌ای گرم و خوش‌عطر است. قیمت اعلام‌شده ۱۵۰ هزار تومان است.",
    category: "رول و کروسان",
    categorySlug: "pastry",
    price: 150000,
    weight: "هر عدد",
    weightGrams: 120,
    badges: ["تازه"],
    tags: ["رول دارچینی", "گردو", "کرمفیل"],
    flavors: ["دارچین", "وانیل", "گردو"],
    allergens: [...DEFAULT_ALLERGENS, "گردو"],
    ingredients: ["آرد", "دارچین", "گردو", "شکلات", "کرمفیل وانیلی"],
    shelfLife: "۳ روز در دمای اتاق",
    images: [{ url: galleryBaking, alt: "رول دارچینی وینیمی" }],
    isFeatured: true,
    productCode: "VIN-CRL-024",
  }),
  dryProduct({
    id: "pastry-002",
    slug: "mini-croissant",
    name: "مینی کروسان",
    shortDescription: "مینی کروسان کره‌ای برای صبحانه و پذیرایی سبک.",
    longDescription:
      "مینی کروسان وینیمی با بافت لایه‌لایه و طعم کره‌ای آماده می‌شود. قیمت اعلام‌شده برای هر عدد ۷۰ هزار تومان است.",
    category: "رول و کروسان",
    categorySlug: "pastry",
    price: 70000,
    weight: "هر عدد",
    weightGrams: 70,
    badges: ["صبحانه"],
    tags: ["کروسان", "مینی کروسان"],
    flavors: ["کره‌ای"],
    allergens: DEFAULT_ALLERGENS,
    ingredients: ["آرد", "کره", "خمیرمایه", "شیر", "تخم‌مرغ"],
    shelfLife: "۳ روز در دمای اتاق",
    images: [{ url: productWhiteChocMacadamia, alt: "مینی کروسان وینیمی" }],
    isFeatured: false,
    productCode: "VIN-MCRO-025",
  }),
  dryProduct({
    id: "gift-001",
    slug: "winimi-gift-box",
    name: "باکس هدیه وینیمی",
    shortDescription: "باکس هدیه از محصولات منتخب وینیمی برای مناسبت‌های کوچک و سازمانی.",
    longDescription:
      "باکس هدیه وینیمی برای هدیه دادن، سفارش‌های سازمانی و پذیرایی خاص آماده می‌شود. ترکیب داخل باکس می‌تواند با هماهنگی واتساپ انتخاب شود و برای خریدهای بعدی کارت هدیه یا تخفیف نیز قابل ارائه است.",
    category: "باکس هدیه",
    categorySlug: "gift",
    price: 350000,
    weight: "باکس ترکیبی — قیمت پایه",
    weightGrams: 500,
    quantityPerPack: 1,
    badges: ["هدیه", "سازمانی"],
    tags: ["باکس هدیه", "سفارش سازمانی", "کوکی"],
    flavors: ["ترکیبی"],
    allergens: [...DEFAULT_ALLERGENS, "مغزها"],
    ingredients: ["ترکیبی از محصولات منتخب وینیمی"],
    shelfLife: "بسته به ترکیب محصول داخل باکس",
    images: [{ url: giftBoxImage, alt: "باکس هدیه وینیمی" }],
    isFeatured: true,
    productCode: "VIN-GF-026",
  }),
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
