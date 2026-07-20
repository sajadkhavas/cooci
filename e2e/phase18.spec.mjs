import { expect, test } from "@playwright/test";

const apiOrigin = process.env.PHASE18_API_URL || "http://127.0.0.1:8000";

const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () => expect(errors, `Unhandled browser errors: ${errors.join(" | ")}`).toEqual([]);
};

const loginWithTestingOtp = async (page) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/account\/login$/);
  await page.locator("#login-mobile").fill("09000000000");
  await page.getByRole("button", { name: "ارسال کد تأیید" }).click();
  await expect(page.getByText("کد آزمایشی توسعه")).toBeVisible();

  const code = (await page.locator("strong[dir='ltr']").filter({ hasText: /^\d{6}$/ }).first().textContent())?.trim();
  expect(code).toMatch(/^\d{6}$/);

  await page.locator("#login-code").fill(code);
  await page.locator("#login-code").press("Enter");
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: "مشتری تست پذیرش" })).toBeVisible();
};

test("frozen contract and Phase 18 gates are visible to the integrated client", async ({ request }) => {
  const response = await request.get(`${apiOrigin}/api/system/contracts`, {
    headers: {
      Origin: "http://127.0.0.1:4173",
      Referer: "http://127.0.0.1:4173/",
    },
  });
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();

  expect(payload.success).toBe(true);
  expect(payload.meta.contractVersion).toBe("2026-07-20-phase-16");
  expect(payload.data.launch.roadmap_version).toBe("2026-07-20-phase-18");
  expect(payload.data.launch.internal_gates.frontend_integrated.status).toBe("ready");
  expect(payload.data.launch.internal_gates.end_to_end_verified.status).toBe("ready");
  expect(payload.data.launch.internal_gates.production_deployed.status).toBe("not-started");
  expect(Object.keys(payload.data.launch.external_only)).toHaveLength(3);
});

test("catalog renders backend staging products and search narrows results", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "محصولات وینیمی" })).toBeVisible();
  await expect(page.getByText("کوکی شکلاتی تست")).toBeVisible();
  await expect(page.getByText("کیک سرد تست")).toBeVisible();

  const search = page.getByRole("searchbox", { name: "جستجو در محصولات" });
  await search.fill("کیک سرد");
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByText("کیک سرد تست")).toBeVisible();
  await expect(page.getByText("کوکی شکلاتی تست")).toHaveCount(0);

  await page.getByRole("button", { name: "پاک کردن جستجو" }).click();
  await expect(page.getByText("کوکی شکلاتی تست")).toBeVisible();
  assertNoPageErrors();
});

test("protected account route completes real Sanctum OTP session and logout", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await loginWithTestingOtp(page);
  await expect(page.getByText("سفارش‌های من")).toBeVisible();
  await expect(page.getByText("آدرس‌های من")).toBeVisible();

  const me = await page.evaluate(async (origin) => {
    const response = await fetch(`${origin}/api/auth/me`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    return { status: response.status, payload: await response.json() };
  }, apiOrigin);
  expect(me.status).toBe(200);
  expect(me.payload.data.user.mobile).toBe("09000000000");

  await page.getByRole("button", { name: "خروج" }).click();
  await expect(page).toHaveURL(/\/account\/login$/);

  const afterLogout = await page.evaluate(async (origin) => {
    const response = await fetch(`${origin}/api/auth/me`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    return response.status;
  }, apiOrigin);
  expect(afterLogout).toBe(401);
  assertNoPageErrors();
});

test("public content, city page, callback state and not-found route remain navigable", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/blog/staging-welcome");
  await expect(page.getByRole("heading", { name: "مقاله تست پذیرش وینیمی" })).toBeVisible();

  await page.goto("/city/staging-tehran");
  await expect(page.getByRole("heading", { name: "سفارش کوکی تست در تهران" })).toBeVisible();

  await page.goto("/payment/callback?Status=NOK");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/phase18-route-does-not-exist");
  await expect(page).toHaveURL(/phase18-route-does-not-exist/);
  await expect(page.getByRole("heading").first()).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(horizontalOverflow).toBe(false);
  assertNoPageErrors();
});
