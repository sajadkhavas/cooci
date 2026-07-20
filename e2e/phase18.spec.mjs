import { expect, test } from "@playwright/test";

const apiOrigin = process.env.PHASE18_API_URL || "http://127.0.0.1:8000";

const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () => expect(errors, `Unhandled browser errors: ${errors.join(" | ")}`).toEqual([]);
};

const completeTestingOtp = async (page) => {
  await page.locator("#login-mobile").fill("09000000000");
  await page.getByRole("button", { name: "ارسال کد تأیید" }).click();
  await expect(page.getByText("کد آزمایشی توسعه")).toBeVisible();

  const code = (await page.locator("strong[dir='ltr']").filter({ hasText: /^\d{6}$/ }).first().textContent())?.trim();
  expect(code).toMatch(/^\d{6}$/);

  await page.locator("#login-code").fill(code);
  await page.locator("#login-code").press("Enter");
};

const loginWithTestingOtp = async (page) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/account\/login$/);
  await completeTestingOtp(page);
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: "مشتری تست پذیرش" })).toBeVisible();
};

const addStagingCookieToCart = async (page) => {
  await page.goto("/products/staging-chocolate-cookie");
  await expect(page.getByRole("heading", { name: "کوکی شکلاتی تست" })).toBeVisible();
  const addButton = page.getByRole("button", { name: "افزودن به سبد خرید" });
  await expect(addButton).toBeEnabled();
  await addButton.click();
  await page.locator("#main-content").getByRole("link", { name: "مشاهده سبد خرید" }).click();
  await expect(page).toHaveURL(/\/cart$/);
};

const expireServerSessionWithoutUpdatingReact = async (page) =>
  page.evaluate(async (origin) => {
    const tokenCookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("XSRF-TOKEN="));
    const xsrf = tokenCookie
      ? decodeURIComponent(tokenCookie.slice("XSRF-TOKEN=".length))
      : "";
    const response = await fetch(`${origin}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrf,
      },
    });
    return response.status;
  }, apiOrigin);

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

test("diet and category filters update atomically without restoring stale URL state", async ({ page, request }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  const response = await request.get(`${apiOrigin}/api/catalog/categories`, {
    headers: {
      Origin: "http://127.0.0.1:4173",
      Referer: "http://127.0.0.1:4173/",
    },
  });
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  const category = payload.data.find(
    (item) => item.slug !== "diet" && !item.name.includes("رژیمی") && !item.name.includes("بدون قند"),
  );
  expect(category).toBeTruthy();

  await page.goto("/products?diet=true");
  await page.getByRole("button", { name: category.name, exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("category")).toBe(category.slug);
  await expect.poll(() => new URL(page.url()).searchParams.get("diet")).toBeNull();
  assertNoPageErrors();
});

test("product detail sends the server Variant stock snapshot into the reconciled cart", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await addStagingCookieToCart(page);
  await expect(page.getByText("کوکی شکلاتی تست")).toBeVisible();
  await expect(page.getByRole("button", { name: "ادامه و ثبت اطلاعات ارسال" })).toBeEnabled();
  assertNoPageErrors();
});

test("a tampered stale cart cannot bypass exact server reconciliation", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  await page.addInitScript(() => {
    localStorage.setItem(
      "winimi_cart_v2",
      JSON.stringify({
        version: 2,
        updatedAt: new Date().toISOString(),
        items: [
          {
            id: "tampered-product",
            slug: "phase3-product-does-not-exist",
            name: "محصول دستکاری‌شده",
            productCode: "TAMPERED-1",
            priceToman: 1,
            quantity: 999999,
            stock: 999999,
            requiresCooling: false,
            image: "javascript:alert(1)",
            availability: "available",
          },
        ],
      }),
    );
  });

  await page.goto("/cart");
  await expect(page.getByText("به‌روزرسانی سبد ناموفق بود")).toBeVisible();
  await expect(page.getByRole("button", { name: "ادامه و ثبت اطلاعات ارسال" })).toBeDisabled();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("winimi_cart_v2")));
  expect(stored.items[0].image).toBe("");
  expect(stored.items[0].quantity).toBeLessThanOrEqual(1000);
  assertNoPageErrors();
});

test("real Laravel checkout verifies testing payment and clears cart only after server success", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await loginWithTestingOtp(page);
  await addStagingCookieToCart(page);
  await page.getByRole("button", { name: "ادامه و ثبت اطلاعات ارسال" }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel("نام گیرنده").fill("مشتری تست پذیرش");
  await page.getByLabel("موبایل گیرنده").fill("09000000000");
  await page.getByLabel("استان").fill("تهران");
  await page.getByLabel("شهر").fill("تهران");
  await page.getByLabel("نشانی کامل").fill("تهران، خیابان تست، پلاک ۱۰");
  await page.getByLabel("کد پستی").fill("1234567890");

  const standardDelivery = page.getByRole("button", { name: /ارسال استاندارد/ });
  await expect(standardDelivery).toBeEnabled();
  await standardDelivery.click();
  await page.getByRole("button", { name: "ثبت سفارش و ادامه پرداخت" }).click();

  await expect(page).toHaveURL(/\/payment\/callback\?/);
  await expect(page.getByRole("heading", { name: "پرداخت از سمت سرور تأیید شد" })).toBeVisible();
  const verifiedCallbackUrl = page.url();
  const orderLink = page.getByRole("link", { name: "مشاهده سفارش" });
  await expect(orderLink).toBeVisible();

  await page.goto(verifiedCallbackUrl);
  await expect(page.getByRole("heading", { name: "پرداخت از سمت سرور تأیید شد" })).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "سبد شما خالی است" })).toBeVisible();
  assertNoPageErrors();
});

test("forged callback authority never clears an existing cart", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await loginWithTestingOtp(page);
  await addStagingCookieToCart(page);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("winimi_cart_v2")));
  expect(before.items.length).toBeGreaterThan(0);

  await page.goto("/payment/callback?Status=OK&Authority=FORGED-AUTHORITY");
  await expect(page.getByRole("heading", { name: "وضعیت پرداخت مشخص نیست" })).toBeVisible();

  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("winimi_cart_v2")));
  expect(after.items.length).toBe(before.items.length);
  await page.goto("/cart");
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

test("protocol-relative login return state is replaced with a safe internal destination", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/account/login");
  await page.evaluate(() => {
    window.history.replaceState(
      { ...window.history.state, usr: { from: "//evil.example/phish" } },
      "",
      "/account/login",
    );
  });
  await page.reload();
  await expect(page.locator("#login-mobile")).toBeVisible();

  const sanitizedDestination = await page.evaluate(
    () => window.history.state?.usr?.from,
  );
  expect(sanitizedDestination).toBe("/account");

  await completeTestingOtp(page);
  await expect(page).toHaveURL(/\/account$/);
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4173");
  assertNoPageErrors();
});

test("a protected API 401 invalidates stale React auth state and returns to login", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await loginWithTestingOtp(page);
  expect(await expireServerSessionWithoutUpdatingReact(page)).toBe(200);

  await page.getByRole("button", { name: "ویرایش پروفایل" }).click();
  await page.getByRole("button", { name: "ذخیره تغییرات" }).click();
  await expect(page).toHaveURL(/\/account\/login$/);
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
