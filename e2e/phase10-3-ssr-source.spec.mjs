import { expect, test } from "@playwright/test";

const getSource = async (request, path) => {
  const response = await request.get(path);
  const html = await response.text();
  return { response, html };
};

test.describe("Phase 10.3 raw server-rendered public data", () => {
  test("homepage and shop contain Laravel catalog data before hydration", async ({ request }) => {
    const home = await getSource(request, "/");
    expect(home.response.status()).toBe(200);
    expect(home.html).toContain("کوکی شکلاتی تست");

    const shop = await getSource(request, "/products");
    expect(shop.response.status()).toBe(200);
    expect(shop.html).toContain("کوکی شکلاتی تست");
    expect(shop.html).toContain("کیک سرد تست");
    expect(shop.html).toContain('"@type":"CollectionPage"');
  });

  test("backend category is a crawlable server-rendered shop page", async ({ request }) => {
    const category = await getSource(request, "/products/category/staging-cookies");
    expect(category.response.status()).toBe(200);
    expect(category.html).toContain("کوکی‌های تست پذیرش");
    expect(category.html).toContain("کوکی شکلاتی تست");
    expect(category.html).toContain('rel="canonical"');
  });

  test("product detail contains product data and schema before hydration", async ({ request }) => {
    const product = await getSource(request, "/products/staging-chocolate-cookie");
    expect(product.response.status()).toBe(200);
    expect(product.html).toContain("کوکی شکلاتی تست");
    expect(product.html).toContain("محصول خشک برای تست ارسال سراسری");
    expect(product.html).toContain('"@type":"Product"');
    expect(product.html).not.toContain("دریافت محصول با مشکل روبه‌رو شد");
  });

  test("blog listing and detail contain published content before hydration", async ({ request }) => {
    const listing = await getSource(request, "/blog");
    expect(listing.response.status()).toBe(200);
    expect(listing.html).toContain("مقاله تست پذیرش وینیمی");
    expect(listing.html).toContain('"@type":"Blog"');

    const detail = await getSource(request, "/blog/staging-welcome");
    expect(detail.response.status()).toBe(200);
    expect(detail.html).toContain("مقاله تست پذیرش وینیمی");
    expect(detail.html).toContain("این نوشته فقط در محیط staging استفاده می‌شود");
    expect(detail.html).toContain('"@type":"BlogPosting"');
  });

  test("city content and featured products are rendered on the server", async ({ request }) => {
    const city = await getSource(request, "/city/staging-tehran");
    expect(city.response.status()).toBe(200);
    expect(city.html).toContain("سفارش کوکی تست در تهران");
    expect(city.html).toContain("محتوای تست پذیرش صفحه شهری");
    expect(city.html).toContain("کوکی شکلاتی تست");
  });

  test("missing public resources preserve real 404 responses", async ({ request }) => {
    const product = await request.get("/products/phase-10-3-missing-product");
    expect(product.status()).toBe(404);
    expect(await product.text()).toContain("این صفحه پیدا نشد");

    const post = await request.get("/blog/phase-10-3-missing-post");
    expect(post.status()).toBe(404);

    const city = await request.get("/city/phase-10-3-missing-city");
    expect(city.status()).toBe(404);
  });
});
