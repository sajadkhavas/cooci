import { readFileSync, writeFileSync } from "node:fs";

const path = "e2e/phase18.spec.mjs";
const source = readFileSync(path, "utf8");
const start = source.indexOf(
  'test("diet and category filters update atomically without restoring stale URL state"',
);
const end = source.indexOf(
  'test("product detail sends the server Variant stock snapshot into the reconciled cart"',
  start,
);

if (start < 0 || end < 0) {
  throw new Error("Unable to locate the legacy category-filter Phase 18 test.");
}

const replacement = `test("legacy diet URLs and category links resolve to clean unified-shop routes", async ({ page, request }) => {
  const assertNoPageErrors = attachPageErrorGuard(page);
  const response = await request.get(\`\${apiOrigin}/api/catalog/categories\`, {
    headers: {
      Origin: "http://127.0.0.1:4173",
      Referer: "http://127.0.0.1:4173/",
    },
  });
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  const category = payload.data.find(
    (item) =>
      item.slug !== "diet" &&
      !item.name.includes("رژیمی") &&
      !item.name.includes("بدون قند"),
  );
  expect(category).toBeTruthy();

  await page.goto("/products?diet=true");
  await expect(page).toHaveURL(/\\/products\\/category\\/diet-diabetic$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /رژیمی و بدون قند افزوده/,
    }),
  ).toBeVisible();

  const categoryNavigation = page.getByRole("navigation", {
    name: "دسته‌بندی محصولات",
  });
  const categoryLink = categoryNavigation.getByRole("link", {
    name: category.name,
    exact: true,
  });
  await expect(categoryLink).toHaveAttribute(
    "href",
    \`/products/category/\${category.slug}\`,
  );
  await categoryLink.click();

  await expect(page).toHaveURL(
    new RegExp(\`/products/category/\${category.slug}$\`),
  );
  await expect
    .poll(() => new URL(page.url()).searchParams.get("category"))
    .toBeNull();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("diet"))
    .toBeNull();
  await expect(categoryNavigation).toBeVisible();
  assertNoPageErrors();
});

`;

writeFileSync(path, source.slice(0, start) + replacement + source.slice(end), "utf8");
console.log("Phase 18 category journey migrated to unified-shop URLs.");
