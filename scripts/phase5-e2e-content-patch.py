from pathlib import Path

path = Path("e2e/phase18.spec.mjs")
source = path.read_text(encoding="utf-8")
anchor = '''test("public content, city page, callback state and not-found route remain navigable", async ({ page }) => {'''
if source.count(anchor) != 1:
    raise RuntimeError(f"Expected exactly one public-content test anchor, found {source.count(anchor)}")

insertion = '''test("persisted inquiry, query-free canonical and disabled eNAMAD trust slot remain safe", async ({ page }, testInfo) => {
  const assertNoPageErrors = attachPageErrorGuard(page);

  await page.goto("/products?q=staging-cookie&diet=true");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBe("http://127.0.0.1:4173/products");

  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "تماس با ما" })).toBeVisible();
  await page.getByLabel("نام و نام خانوادگی").fill("مشتری تست محتوای فرانت");
  await page.getByLabel("شماره موبایل").fill("+98 912 345 6789");
  await page.getByLabel("موضوع درخواست").fill("تست پذیرش فرم تماس");
  await page.getByLabel("پیام شما").fill(
    `پیام یکتای پذیرش فاز پنج برای ${testInfo.project.name} در ${Date.now()}`,
  );
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
  await expect(page.getByText("درخواست با موفقیت ثبت شد")).toBeVisible();
  await expect(page.locator("strong[dir='ltr']")).toHaveText(/^[0-9A-HJKMNP-TV-Z]{26}$/);

  await expect(
    page.getByText(
      "جایگاه نماد اعتماد آماده است و فقط پس از فعال‌سازی رسمی سرور نمایش داده می‌شود.",
      { exact: true },
    ),
  ).toBeVisible();
  assertNoPageErrors();
});

'''
source = source.replace(anchor, insertion + anchor, 1)
path.write_text(source, encoding="utf-8")
print("Phase 5 content and inquiry E2E patch applied.")
