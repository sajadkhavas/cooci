import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const write = (path, value) => writeFileSync(path, value, "utf8");

const replaceOrFail = (source, search, replacement, label) => {
  if (!source.includes(search)) {
    throw new Error(`Phase 8 migration could not find: ${label}`);
  }
  return source.replace(search, replacement);
};

const migrateProductDetail = () => {
  const path = "src/pages/ProductDetailPage.tsx";
  let source = read(path);
  if (source.includes("getPublicProductDescription")) return;

  source = replaceOrFail(
    source,
    'import { reviews } from "@/data/reviews";\n',
    "",
    "product reviews import",
  );

  source = replaceOrFail(
    source,
    `  getProductStock,\n  getStockPresentation,\n} from "@/lib/catalog";`,
    `  getProductStock,\n  getPublicAllergens,\n  getPublicIngredients,\n  getPublicProductBadges,\n  getPublicProductDescription,\n  getPublicShelfLife,\n  getPublicStorageTips,\n  getStockPresentation,\n  isProductContentVerified,\n  isProductInventoryVerified,\n} from "@/lib/catalog";`,
    "catalog imports",
  );

  source = replaceOrFail(
    source,
    `  const activeWeight = selectedVariant?.weight ?? product.weight;\n  const activeCode = selectedVariant?.productCode ?? product.productCode;\n  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;\n  const shippingText =\n    product.shippingNote ??\n    (product.requiresCooling\n      ? "ارسال یخچالی فقط تهران و کرج"\n      : "ارسال با بسته‌بندی محافظ به سراسر ایران");\n  const stockPresentation = getStockPresentation(activeStock);`,
    `  const contentVerified = isProductContentVerified(product);\n  const inventoryVerified = isProductInventoryVerified(product);\n  const publicDescription = getPublicProductDescription(product);\n  const publicBadges = getPublicProductBadges(product);\n  const publicIngredients = getPublicIngredients(product);\n  const publicAllergens = getPublicAllergens(product);\n  const publicShelfLife = getPublicShelfLife(product);\n  const publicStorageTips = getPublicStorageTips(product);\n  const activeWeight = contentVerified\n    ? selectedVariant?.weight ?? product.weight\n    : undefined;\n  const activeCode = selectedVariant?.productCode ?? product.productCode;\n  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;\n  const shippingText = product.requiresCooling\n    ? "این انتخاب نیازمند روش تحویل سرد است. محدوده و ظرفیت نهایی در Checkout و بک‌اند تأیید می‌شود."\n    : "روش تحویل قابل انتخاب بر اساس شهر مقصد و تنظیمات فعال Checkout نمایش داده می‌شود.";\n  const stockPresentation = getStockPresentation(\n    activeStock,\n    inventoryVerified,\n  );`,
    "public product facts",
  );

  source = source.replace(
    /\n  const productReviews = reviews[\s\S]*?\n  const avgRating = productReviews\.length[\s\S]*?\n    : 5;\n/,
    "\n",
  );

  source = replaceOrFail(
    source,
    "    description: product.longDescription,",
    "    description: publicDescription,",
    "schema description",
  );

  source = source.replace(
    /\n    aggregateRating: productReviews\.length[\s\S]*?\n      : undefined,/,
    "",
  );

  source = replaceOrFail(
    source,
    "                {product.badges.map((badge) => (",
    "                {publicBadges.map((badge) => (",
    "public badges",
  );

  source = replaceOrFail(
    source,
    "                {product.longDescription}",
    "                {publicDescription}",
    "public description",
  );

  source = replaceOrFail(
    source,
    `              <p className="text-base leading-8 text-muted-foreground md:text-lg">\n                {publicDescription}\n              </p>`,
    `              <p className="text-base leading-8 text-muted-foreground md:text-lg">\n                {publicDescription}\n              </p>\n\n              {!contentVerified && (\n                <div\n                  className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950"\n                  role="note"\n                >\n                  اطلاعات ترکیبات، آلرژن، وزن، ماندگاری و رسانه این محصول هنوز از منبع تأییدشده بک‌اند دریافت نشده‌اند و پیش از خرید حساس یا پزشکی باید جداگانه بررسی شوند.\n                </div>\n              )}`,
    "content verification notice",
  );

  source = replaceOrFail(
    source,
    `                  {selectedVariant?.description && (\n                    <p className="text-sm leading-7 text-muted-foreground">{selectedVariant.description}</p>\n                  )}`,
    `                  {contentVerified && selectedVariant?.description && (\n                    <p className="text-sm leading-7 text-muted-foreground">\n                      {selectedVariant.description}\n                    </p>\n                  )}`,
    "variant description",
  );

  source = replaceOrFail(
    source,
    `                <div className="rounded-2xl border border-border bg-gradient-to-l from-secondary to-muted p-5">\n                  <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground">\n                    <span className="h-1 w-8 rounded-full bg-primary" />\n                    مواد تشکیل‌دهنده\n                  </h2>\n                  <p className="leading-relaxed text-muted-foreground">{product.ingredients.join("، ")}</p>\n                </div>`,
    `                <div className="rounded-2xl border border-border bg-gradient-to-l from-secondary to-muted p-5">\n                  <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground">\n                    <span className="h-1 w-8 rounded-full bg-primary" />\n                    مواد تشکیل‌دهنده\n                  </h2>\n                  {publicIngredients.length > 0 ? (\n                    <p className="leading-relaxed text-muted-foreground">\n                      {publicIngredients.join("، ")}\n                    </p>\n                  ) : (\n                    <p className="leading-8 text-amber-900">\n                      فهرست ترکیبات تأییدشده هنوز از بک‌اند دریافت نشده است.\n                    </p>\n                  )}\n                </div>`,
    "ingredients panel",
  );

  source = replaceOrFail(
    source,
    "                {product.allergens.length > 0 && (",
    "                {publicAllergens.length > 0 && (",
    "allergen visibility",
  );
  source = replaceOrFail(
    source,
    "حاوی: {product.allergens.join(\"، \")}",
    "حاوی: {publicAllergens.join(\"، \")}",
    "allergen content",
  );

  source = replaceOrFail(
    source,
    "<p className=\"text-sm text-muted-foreground\">{product.shelfLife}</p>",
    "<p className=\"text-sm text-muted-foreground\">{publicShelfLife}</p>",
    "shelf life",
  );
  source = replaceOrFail(
    source,
    "<p className=\"text-sm text-muted-foreground\">{product.storageTips}</p>",
    "<p className=\"text-sm text-muted-foreground\">{publicStorageTips}</p>",
    "storage tips",
  );

  source = source.replace(
    /\n          \{productReviews\.length > 0 && \([\s\S]*?\n          \)\}\n\n          \{relatedProducts\.length > 0/,
    "\n          {relatedProducts.length > 0",
  );

  write(path, source);
};

const migrateHome = () => {
  const path = "src/pages/HomePage.tsx";
  let source = read(path);
  if (source.includes("داده نهایی با بک‌اند")) return;

  const replacements = [
    ["مواد اولیه باکیفیت", "اطلاعات قابل‌بررسی"],
    [
      "مواد اولیه تازه و شفاف؛ انتخاب‌شده با همان وسواسی که برای خانواده خودمان داریم.",
      "قیمت فعلی، نیاز به سرمایش و وضعیت تأیید هر بخش جداگانه نمایش داده می‌شود.",
    ],
    ["پخت نزدیک به سفارش", "زمان آماده‌سازی قابل تأیید"],
    [
      "محصولات با زمان آماده‌سازی مشخص ثبت می‌شوند تا تازگی و کیفیت بهتر حفظ شود.",
      "زمان آماده‌سازی پس از دریافت داده معتبر محصول و روش تحویل نهایی می‌شود.",
    ],
    ["ارسال و نگهداری روشن", "تحویل متناسب با محصول"],
    [
      "محصولات خشک سراسری ارسال می‌شوند و دسرهای یخچالی فقط تهران و کرج دارند.",
      "Checkout روش‌های قابل انتخاب را نمایش می‌دهد و بک‌اند محدوده و مبلغ نهایی را تأیید می‌کند.",
    ],
    [
      "محصول، نوع یا سایز دلخواه را از کاتالوگ انتخاب و موجودی آن را بررسی کنید.",
      "محصول و گزینه دلخواه را انتخاب کنید؛ موجودی نهایی در سمت سرور بررسی خواهد شد.",
    ],
    [
      "اطلاعات گیرنده و روش تحویل را ثبت کنید و سفارش را از مسیر پرداخت امن تکمیل کنید.",
      "اطلاعات گیرنده و روش تحویل را ثبت کنید؛ پرداخت واقعی بعد از اتصال امن بک‌اند فعال می‌شود.",
    ],
    ["همه‌چیز از", "کاتالوگ وینیمی"],
    ["بوی کیک تازه", "برای انتخاب روشن‌تر"],
    ["شروع شد", "آماده شده است"],
    [
      "{brandConfig.slogan}. محصول را آنلاین انتخاب کنید، موجودی و قیمت را ببینید و سفارش را از سبد خرید تکمیل کنید.",
      "{brandConfig.slogan}. قیمت فعلی را ببینید، محصول را به سبد اضافه کنید و موارد نیازمند تأیید را پیش از پرداخت بررسی کنید.",
    ],
    ['["پخت تازه", "نزدیک به زمان سفارش"]', '["قیمت کاتالوگ", "نمایش در فرانت‌اند"]'],
    ['["ارسال سراسری", "برای محصولات خشک"]', '["نیاز به سرمایش", "مشخص برای هر محصول"]'],
    ['["تهران و کرج", "برای دسرهای یخچالی"]', '["تأیید نهایی", "داده نهایی با بک‌اند"]'],
    ["انتخاب‌های محبوب وینیمی", "انتخاب‌های پیشنهادی کاتالوگ"],
    [
      "قیمت، موجودی، مواد اولیه و شرایط ارسال هر محصول پیش از افزودن به سبد مشخص است.",
      "قیمت فعلی و نیاز به سرمایش نمایش داده می‌شوند؛ موجودی، ترکیبات و تحویل نهایی نیازمند تأیید هستند.",
    ],
    ["اعتماد، قبل از اولین لقمه", "اطلاعات روشن، قبل از خرید"],
    [
      "تصویر زیبا مهم است، اما اطلاعات شفاف محصول، آلرژن، نگهداری و ارسال مهم‌تر است.",
      "تصویر نمایشی جای داده محصول را نمی‌گیرد؛ وضعیت تأیید اطلاعات باید برای کاربر روشن باشد.",
    ],
  ];

  for (const [search, replacement] of replacements) {
    source = replaceOrFail(source, search, replacement, `home: ${search}`);
  }
  write(path, source);
};

const migrateFooter = () => {
  const path = "src/components/layout/Footer.tsx";
  let source = read(path);
  if (source.includes("نظرهای تأییدشده")) return;

  const replacements = [
    ['{ name: "نظرات مشتریان", href: "/reviews" }', '{ name: "نظرهای تأییدشده", href: "/reviews" }'],
    ['{ name: "کوکی رژیمی و دیابتی", href: "/products/category/diet-diabetic" }', '{ name: "رژیمی و بدون قند", href: "/products/category/diet" }'],
    ['{ name: "چیزکیک", href: "/products/category/cheesecakes" }', '{ name: "کیک و دسر", href: "/products/category/cakes" }'],
    ['{ name: "باکس هدیه", href: "/products/category/gift-boxes" }', '{ name: "باکس هدیه", href: "/products/category/gift" }'],
    ["خرید آنلاین سریع و مطمئن", "مسیر سفارش مرحله‌به‌مرحله"],
    [
      "محصول دلخواه‌تان را انتخاب کنید و سفارش را آنلاین تکمیل کنید",
      "محصول را انتخاب کنید و موارد نیازمند تأیید را پیش از پرداخت ببینید",
    ],
    ["پخت تازه، مواد اولیه شفاف، وسواس در بهداشت.", "قیمت فعلی کاتالوگ و وضعیت تأیید اطلاعات به‌صورت جداگانه نمایش داده می‌شوند."],
    ["محصولات خشک سراسری؛ یخچالی فقط تهران و کرج.", "روش تحویل به نوع محصول، مقصد و تنظیمات فعال بک‌اند وابسته است."],
  ];

  for (const [search, replacement] of replacements) {
    source = replaceOrFail(source, search, replacement, `footer: ${search}`);
  }
  write(path, source);
};

migrateProductDetail();
migrateHome();
migrateFooter();
console.log("Phase 8 content migration completed.");
