from pathlib import Path
import subprocess

path = Path("e2e/phase18.spec.mjs")
source = path.read_text(encoding="utf-8")
marker = 'test("mobile navigation traps focus'
if marker in source:
    print("Phase 6 keyboard E2E patch is already applied.")
    raise SystemExit(0)

anchor = 'test("public content, city page, callback state and not-found route remain navigable", async ({ page }) => {'
if source.count(anchor) != 1:
    raise RuntimeError(f"Expected one E2E insertion anchor, found {source.count(anchor)}")

insertion = '''test("mobile navigation traps focus, restores dismissal focus and transfers route focus", async ({ page }, testInfo) => {
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
  await expect(dialog.getByRole("link", { name: "کوکی‌ها", exact: true })).not.toHaveAttribute("aria-current");

  await page.keyboard.press("Shift+Tab");
  await expect.poll(() => dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menuButton).toBeFocused();

  await menuButton.press("Enter");
  const giftLink = page.getByRole("dialog").getByRole("link", { name: "هدیه", exact: true });
  await giftLink.focus();
  await giftLink.press("Enter");
  await expect(page).toHaveURL(/\/gift$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main-content");
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

'''
path.write_text(source.replace(anchor, insertion + anchor, 1), encoding="utf-8")
subprocess.run(["git", "diff", "--check"], check=True)
subprocess.run(["git", "config", "user.name", "winimi-audit-bot"], check=True)
subprocess.run(["git", "config", "user.email", "actions@users.noreply.github.com"], check=True)
subprocess.run(["git", "add", str(path)], check=True)
subprocess.run(
    ["git", "commit", "-m", "Phase 6: test keyboard navigation and query focus"],
    check=True,
)
subprocess.run(
    ["git", "push", "origin", "HEAD:agent/frontend-full-audit-phase-6-components-accessibility"],
    check=True,
)
print("Phase 6 keyboard and query-focus E2E patch committed.")
