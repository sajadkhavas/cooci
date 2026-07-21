import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () =>
    expect(errors, `Unhandled browser errors: ${errors.join(" | ")}`).toEqual([]);
};

test("rate-limited catalog fails visibly and recovers after retry", async ({
  page,
}) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  let limited = true;
  let rateLimitedRequests = 0;

  await page.route("**/api/catalog/products**", async (route) => {
    if (!limited) {
      await route.continue();
      return;
    }

    rateLimitedRequests += 1;
    await route.fulfill({
      status: 429,
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-origin": frontendOrigin,
        "content-type": "application/json; charset=utf-8",
        "retry-after": "60",
        "x-request-id": "phase9-rate-limit",
      },
      body: JSON.stringify({
        success: false,
        code: "rate_limited",
        message: "درخواست‌های زیادی ارسال شده است. کمی صبر کنید.",
        errors: {},
        meta: {
          requestId: "phase9-rate-limit",
          apiVersion: "v1",
          contractVersion: "2026-07-20-phase-16",
        },
      }),
    });
  });

  await page.goto("/products");
  await expect(
    page.getByRole("heading", { name: "دریافت محصولات با مشکل روبه‌رو شد" }),
  ).toBeVisible();
  await expect(
    page.getByText("درخواست‌های زیادی ارسال شده است. کمی صبر کنید."),
  ).toBeVisible();
  expect(rateLimitedRequests).toBeGreaterThan(0);

  limited = false;
  await page.getByRole("button", { name: "تلاش دوباره" }).click();
  await expect(page.getByText("کوکی شکلاتی تست")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "دریافت محصولات با مشکل روبه‌رو شد" }),
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
