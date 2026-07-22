import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () =>
    expect(errors, `Unhandled browser errors: ${errors.join(" | ")}`).toEqual([]);
};

test("rate-limited server render fails closed and recovers on clean request", async ({
  page,
}) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  const limitedResponse = await page.goto(
    "/products?q=__phase9_rate_limit__",
  );

  expect(limitedResponse?.status()).toBe(503);
  expect(limitedResponse?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(limitedResponse?.headers()["retry-after"]).toBe("60");
  await expect(
    page.getByRole("heading", { name: "دریافت اطلاعات موقتاً ممکن نیست" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );

  const recoveredResponse = await page.goto("/products");
  expect(recoveredResponse?.status()).toBe(200);
  await expect(page.getByText("کوکی شکلاتی تست").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "دریافت اطلاعات موقتاً ممکن نیست" }),
  ).toHaveCount(0);
  assertNoPageErrors();
});

test("hostile encoded query values remain inert and same-origin", async ({
  page,
}) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  const externalRequests = [];
  page.on("request", (request) => {
    if (request.url().startsWith("https://evil.example")) {
      externalRequests.push(request.url());
    }
  });

  const payload = '<img src=x onerror="window.__phase9Xss=1">';
  const query = new URLSearchParams({
    q: payload,
    category: "//evil.example/phish",
    sort: "javascript:alert(1)",
    page: "999999999",
  });

  await page.goto(`/products?${query.toString()}`);
  await expect(page.getByRole("heading", { name: "محصولات وینیمی" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "جستجو در محصولات" })).toHaveValue(
    payload,
  );
  await expect(page.getByLabel("مرتب‌سازی محصولات")).toHaveValue("featured");
  expect(new URL(page.url()).origin).toBe(new URL(frontendOrigin).origin);
  expect(await page.evaluate(() => window.__phase9Xss)).toBeUndefined();
  expect(externalRequests).toEqual([]);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute("href", `${frontendOrigin}/products`);
  assertNoPageErrors();
});
