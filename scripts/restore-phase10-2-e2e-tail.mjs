import { readFileSync, writeFileSync } from "node:fs";

const path = "e2e/phase18.spec.mjs";
const source = readFileSync(path, "utf8");
const start = source.indexOf(
  'test("mobile navigation traps focus, restores dismissal focus and transfers route focus"',
);

if (start < 0) {
  throw new Error("Unable to locate the Phase 18 mobile navigation test.");
}

const tail = `test("mobile navigation traps focus, restores dismissal focus and transfers route focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "mobile drawer behavior");
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/products/category/diet");
  const menuButton = page.getByRole("button", { name: "باز کردن منوی اصلی" });
  await menuButton.focus();
  await menuButton.press("Enter");

  const dialog = page.getByRole("dialog", { name: "وینیمی بیکری" });
  await expect(dialog).toBeVisible();
  const closeButton = dialog.getByRole("button", { name: "بستن منوی اصلی" });
  await expect(closeButton).toBeFocused();
  await expect(
    dialog.getByRole("link", { name: "فروشگاه", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menuButton).toBeFocused();

  await menuButton.press("Enter");
  const giftLink = page
    .getByRole("dialog")
    .getByRole("link", { name: "هدیه", exact: true });
  await giftLink.focus();
  await giftLink.press("Enter");
  await expect(page).toHaveURL(/\\/gift$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.id))
    .toBe("main-content");
  assertNoPageErrors();
});

test("query-string updates do not steal search focus or announce a new page", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  await page.goto("/products");
  const search = page.getByRole("searchbox", { name: "جستجو در محصولات" });
  await search.focus();
  await search.fill("کیک سرد");
  await expect(page).toHaveURL(/q=/);
  await expect(search).toBeFocused();
  await expect(page.getByText("کیک سرد تست")).toBeVisible();
  assertNoPageErrors();
});

test("public content, city page, callback state and not-found route remain navigable", async ({ page }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/blog/staging-welcome");
  await expect(
    page.getByRole("heading", { name: "مقاله تست پذیرش وینیمی" }),
  ).toBeVisible();

  await page.goto("/city/staging-tehran");
  await expect(
    page.getByRole("heading", { name: "سفارش کوکی تست در تهران" }),
  ).toBeVisible();

  await page.goto("/payment/callback?Status=NOK");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/phase18-route-does-not-exist");
  await expect(page).toHaveURL(/phase18-route-does-not-exist/);
  await expect(page.getByRole("heading").first()).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  );
  expect(horizontalOverflow).toBe(false);
  assertNoPageErrors();
});
`;

writeFileSync(path, source.slice(0, start) + tail, "utf8");
console.log("Complete Phase 18 acceptance tail restored for the unified shop.");
