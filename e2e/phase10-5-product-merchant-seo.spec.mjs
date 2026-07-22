import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const extractJsonLd = (html) =>
  Array.from(
    html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ).map((match) => JSON.parse(match[1]));

const findProductSchema = (schemas) =>
  schemas.find((schema) => schema?.["@type"] === "Product");

const findBreadcrumbSchema = (schemas) =>
  schemas.find((schema) => schema?.["@type"] === "BreadcrumbList");

test.describe("Phase 10.5 product and merchant SEO", () => {
  test("raw SSR contains authoritative Laravel Product Offer without invented policy", async ({ request }) => {
    const response = await request.get("/products/staging-chocolate-cookie");
    const html = await response.text();
    const product = findProductSchema(extractJsonLd(html));

    expect(response.status()).toBe(200);
    expect(product).toBeTruthy();
    expect(product.url).toBe(`${frontendOrigin}/products/staging-chocolate-cookie`);
    expect(product.sku).toBe("STG-COOKIE-CHOCO-6");
    expect(product.offers).toMatchObject({
      "@type": "Offer",
      price: 1_800_000,
      priceCurrency: "IRR",
      availability: "https://schema.org/InStock",
      url: `${frontendOrigin}/products/staging-chocolate-cookie`,
    });
    expect(product.offers.shippingDetails).toBeUndefined();
    expect(product.offers.hasMerchantReturnPolicy).toBeUndefined();
    expect(product["@type"]).not.toBe("ProductGroup");
  });

  test("empty approved-review response produces visible parity and no synthetic rating", async ({ page, request }) => {
    const response = await request.get("/products/staging-chocolate-cookie");
    const product = findProductSchema(extractJsonLd(await response.text()));

    expect(product.aggregateRating).toBeUndefined();
    expect(product.review).toBeUndefined();

    await page.goto("/products/staging-chocolate-cookie");
    await expect(page.getByRole("heading", { name: "نظر خریداران" })).toBeVisible();
    await expect(
      page.getByText("هنوز نظر تأییدشده‌ای برای این محصول ثبت نشده است."),
    ).toBeVisible();
  });

  test("product BreadcrumbList and visible category link use the crawlable category route", async ({ page, request }) => {
    const response = await request.get("/products/staging-chocolate-cookie");
    const breadcrumb = findBreadcrumbSchema(extractJsonLd(await response.text()));
    const categoryCrumb = breadcrumb.itemListElement.find(
      (item) => item.name === "کوکی‌های تست پذیرش",
    );

    expect(categoryCrumb.item).toBe(
      `${frontendOrigin}/products/category/staging-cookies`,
    );

    await page.goto("/products/staging-chocolate-cookie");
    await expect(
      page.getByRole("navigation", { name: "مسیر" }).getByRole("link", {
        name: "کوکی‌های تست پذیرش",
      }),
    ).toHaveAttribute("href", "/products/category/staging-cookies");
  });
});
