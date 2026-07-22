import http from "node:http";

const host = process.env.FIXTURE_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.FIXTURE_PORT || "8001", 10);
const now = "2026-07-22T00:00:00+00:00";

const category = {
  id: "phase10-3-category",
  name: "دسته تست SSR",
  slug: "phase10-3-category",
  description: "داده قطعی برای تست انتشار SSR.",
  image: null,
  productCount: 1,
  seo: {
    title: "دسته تست SSR",
    description: "داده قطعی برای تست انتشار SSR.",
  },
};

const product = {
  id: "phase10-3-product",
  slug: "phase10-3-cookie",
  name: "کوکی تست انتشار SSR",
  productCode: "PHASE-10-3",
  shortDescription: "محصول قطعی برای تست HTML سمت سرور.",
  longDescription: "این محصول فقط در تست انتشار فرانت‌اند استفاده می‌شود.",
  category: category.name,
  categorySlug: category.slug,
  categoryData: category,
  priceToman: 180000,
  regularPriceToman: 180000,
  salePriceToman: null,
  weightGrams: 300,
  weight: "۳۰۰ گرم",
  stock: 12,
  available: true,
  requiresCooling: false,
  shippingScope: "nationwide",
  shippingNote: "ارسال تست سراسری.",
  ingredients: ["داده تست"],
  allergens: [],
  shelfLife: "تست",
  storageTips: "در محیط تست نگهداری شود.",
  preparationTimeDays: 1,
  badges: ["تست SSR"],
  images: [],
  isFeatured: true,
  contentVerified: true,
  mediaVerified: false,
  inventoryVerified: true,
  variants: [
    {
      id: "phase10-3-variant",
      name: "بسته تست",
      productCode: "PHASE-10-3-V1",
      weightGrams: 300,
      weight: "۳۰۰ گرم",
      priceToman: 180000,
      regularPriceToman: 180000,
      salePriceToman: null,
      stock: 12,
      available: true,
      lowStock: false,
      isDefault: true,
    },
  ],
  seo: {
    title: "کوکی تست انتشار SSR",
    description: "محصول قطعی برای تست HTML سمت سرور.",
  },
  updatedAt: now,
};

const approvedReview = {
  id: "phase10-5-review",
  rating: 5,
  title: "تازه و دقیق",
  body: "نظر تأییدشده قطعی برای تست Product merchant JSON-LD.",
  verifiedPurchase: true,
  customerName: "مشتری تست",
  publishedAt: now,
};

const post = {
  id: "phase10-4-post",
  slug: "phase10-4-crawl-guide",
  title: "راهنمای تست Crawl وینیمی",
  excerpt: "مقاله قطعی برای اعتبارسنجی Sitemap داینامیک.",
  category: "راهنما",
  tags: ["SEO"],
  coverUrl: null,
  author: "وینیمی",
  publishedAt: now,
};

const city = {
  id: "phase10-4-city",
  city: "تهران تست",
  slug: "phase10-4-city",
  title: "سفارش تست وینیمی در تهران",
  description: "صفحه شهری قطعی برای Sitemap داینامیک.",
  content: "محتوای شهر تست Phase 10.4",
  seo: {
    title: "سفارش تست وینیمی در تهران",
    description: "صفحه شهری قطعی برای Sitemap داینامیک.",
  },
};

const pagination = {
  page: 1,
  perPage: 12,
  total: 1,
  totalPages: 1,
  from: 1,
  to: 1,
  hasMore: false,
};

const postPagination = {
  ...pagination,
  perPage: 48,
};

const reviewPagination = {
  ...pagination,
  perPage: 10,
};

const envelope = (data, meta = {}) => ({
  success: true,
  data,
  meta: {
    apiVersion: "v1",
    contractVersion: "2026-07-20-phase-16",
    requestId: "phase10-3-fixture",
    ...meta,
  },
});

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");

  const url = new URL(request.url || "/", `http://${host}:${port}`);
  if (url.pathname === "/health") {
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }
  if (url.pathname === "/api/catalog/categories") {
    response.end(JSON.stringify(envelope([category])));
    return;
  }
  if (url.pathname === "/api/catalog/products") {
    response.end(JSON.stringify(envelope([product], { pagination })));
    return;
  }
  if (url.pathname === "/api/catalog/products/phase10-3-cookie") {
    response.end(JSON.stringify(envelope(product)));
    return;
  }
  if (url.pathname === "/api/catalog/products/phase10-3-cookie/reviews") {
    response.end(JSON.stringify(envelope([approvedReview], {
      summary: { count: 1, averageRating: 5 },
      pagination: reviewPagination,
    })));
    return;
  }
  if (url.pathname === "/api/store/posts") {
    response.end(JSON.stringify(envelope([post], { pagination: postPagination })));
    return;
  }
  if (url.pathname === "/api/store/cities/phase10-4-city") {
    response.end(JSON.stringify(envelope({ city })));
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({
    success: false,
    code: "resource_not_found",
    message: "Fixture resource not found.",
    errors: {},
    meta: {
      apiVersion: "v1",
      contractVersion: "2026-07-20-phase-16",
      requestId: "phase10-3-fixture",
    },
  }));
});

server.listen(port, host, () => {
  console.log(`Phase 10.3 catalog fixture listening on http://${host}:${port}`);
});

const shutdown = () => server.close(() => process.exit());
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
