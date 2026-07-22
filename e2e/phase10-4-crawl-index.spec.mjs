import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const getWithoutRedirect = (request, path) =>
  request.get(path, { maxRedirects: 0 });

test.describe("Phase 10.4 crawl, index and URL architecture", () => {
  test("dynamic sitemap contains authoritative Laravel public resources only", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const xml = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/xml");
    expect(xml).toContain(`${frontendOrigin}/products/staging-chocolate-cookie`);
    expect(xml).toContain(`${frontendOrigin}/products/category/staging-cookies`);
    expect(xml).toContain(`${frontendOrigin}/blog/staging-welcome`);
    expect(xml).toContain(`${frontendOrigin}/city/staging-tehran`);
    expect(xml).not.toContain("/account");
    expect(xml).not.toContain("/checkout");
    expect(xml).not.toContain("?q=");
  });

  test("robots advertises the sitemap and protects private routes", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const robots = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Disallow: /account");
    expect(robots).toContain("Disallow: /cart");
    expect(robots).toContain("Disallow: /checkout");
    expect(robots).toContain(`Sitemap: ${frontendOrigin}/sitemap.xml`);
  });

  test("filtered shop URLs remain crawlable but cannot be indexed", async ({ request }) => {
    const response = await request.get("/products?q=chocolate&sort=newest");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe("noindex,follow");
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain(`rel="canonical" href="${frontendOrigin}/products"`);
    expect(html).not.toContain('rel="canonical" href="' + frontendOrigin + '/products?q=');
  });

  test("pagination and legacy duplicates use permanent canonical redirects", async ({ request }) => {
    const pageOne = await getWithoutRedirect(request, "/products?page=1");
    expect(pageOne.status()).toBe(301);
    expect(pageOne.headers().location).toBe("/products");

    const legacyCategories = await getWithoutRedirect(request, "/categories");
    expect(legacyCategories.status()).toBe(301);
    expect(legacyCategories.headers().location).toBe("/products");
  });

  test("private and health surfaces expose HTTP noindex headers", async ({ request }) => {
    const cart = await request.get("/cart");
    expect(cart.headers()["x-robots-tag"]).toBe("noindex, nofollow");

    const health = await request.get("/__ssr_health");
    expect(health.status()).toBe(200);
    expect(health.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
});
