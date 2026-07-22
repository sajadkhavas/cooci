import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const replace = (path, needle, replacement, expected = 1) => {
  const source = read(path);
  const count = source.split(needle).length - 1;
  if (count !== expected) {
    throw new Error(
      `${path}: expected ${expected} occurrence(s), found ${count}: ${needle}`,
    );
  }
  writeFileSync(path, source.split(needle).join(replacement), "utf8");
};

replace(
  "src/components/layout/Header.tsx",
  '  { name: "دسته‌بندی‌ها", href: "/categories", match: "prefix" },\n',
  "",
);

let footer = read("src/components/layout/Footer.tsx");
footer = footer
  .replace(
    '    { name: "دسته‌بندی محصولات", href: "/categories" },',
    '    { name: "فروشگاه و دسته‌بندی‌ها", href: "/products" },',
  )
  .replace(
    '    { name: "همه دسته‌بندی‌ها", href: "/categories" },',
    '    { name: "همه محصولات", href: "/products" },',
  )
  .replace('                to="/categories"', '                to="/products"')
  .replace("                  دسته‌بندی محصولات", "                  فروشگاه و دسته‌بندی‌ها");
if (footer.includes('href: "/categories"') || footer.includes('to="/categories"')) {
  throw new Error("Footer still contains a direct /categories link.");
}
writeFileSync("src/components/layout/Footer.tsx", footer, "utf8");

let home = read("src/pages/HomePage.tsx");
home = home
  .replaceAll('to="/categories"', 'to="/products"')
  .replace("انتخاب از دسته‌بندی‌ها", "ورود به فروشگاه و دسته‌ها")
  .replace("مشاهده همه دسته‌بندی‌ها", "مشاهده فروشگاه و دسته‌بندی‌ها");
if (home.includes('to="/categories"')) {
  throw new Error("Homepage still contains a direct /categories link.");
}
writeFileSync("src/pages/HomePage.tsx", home, "utf8");

replace(
  "scripts/generate-sitemap.mjs",
  '  { path: "/categories", changefreq: "weekly", priority: "0.85" },\n',
  "",
);
replace(
  "scripts/audit-frontend.mjs",
  '  \'route("categories", "./pages/CategoriesPage.tsx")\',\n',
  '  \'route("categories", "./routes/categories-redirect.tsx")\',\n',
);
replace(
  "scripts/audit-content-integrity.mjs",
  '  \'route("products/category/:slug", "./pages/ProductsPage.tsx")\',\n',
  '  \'route("products/category/:slug", "./routes/category-shop.tsx")\',\n',
);

let runtimeE2e = read("e2e/runtime-performance.spec.mjs");
const start = runtimeE2e.indexOf(
  'test("category index is crawlable and editorial slugs map to Laravel"',
);
const end = runtimeE2e.indexOf(
  'test("profiles production scrolling on desktop and mobile"',
  start,
);
if (start < 0 || end < 0) throw new Error("Unable to locate category E2E block.");
const unifiedTest = `test("shop unifies categories and filters while editorial slugs map to Laravel", async ({ page }) => {
  await page.goto("/categories", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\\/products$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "محصولات وینیمی" }),
  ).toBeVisible();

  const categoryNavigation = page.getByRole("navigation", {
    name: "دسته‌بندی محصولات",
  });
  await expect(categoryNavigation).toBeVisible();
  await expect(
    categoryNavigation.getByRole("link", { name: "همه محصولات" }),
  ).toHaveAttribute("aria-current", "page");

  const expectedDestinations = [
    ["کوکی‌های خانگی", "/products/category/cookies"],
    ["مینی کوکی", "/products/category/mini-cookies"],
    ["رژیمی و بدون قند افزوده", "/products/category/diet-diabetic"],
    ["کیک و دسر", "/products/category/cakes"],
    ["چیزکیک", "/products/category/cheesecakes"],
    ["رول و کروسان", "/products/category/pastry"],
    ["باکس هدیه", "/products/category/gift-boxes"],
  ];
  for (const [name, href] of expectedDestinations) {
    await expect(categoryNavigation.getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  }

  const cookiesResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/catalog/products") &&
      response.url().includes("category=cookies") &&
      response.status() === 200,
  );
  await categoryNavigation.getByRole("link", { name: "کوکی‌های خانگی" }).click();
  await cookiesResponse;
  await expect(page).toHaveURL(/\\/products\\/category\\/cookies$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /کوکی‌های وینیمی/ }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "دسته‌بندی محصولات" })
      .getByRole("link", { name: "کوکی‌های خانگی" }),
  ).toHaveAttribute("aria-current", "page");

  const dietResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/catalog/products") &&
      response.url().includes("category=diet") &&
      response.status() === 200,
  );
  await page.goto("/products?diet=true", { waitUntil: "domcontentloaded" });
  await dietResponse;
  await expect(page).toHaveURL(/\\/products\\/category\\/diet-diabetic$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /رژیمی و بدون قند افزوده/ }),
  ).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

`;
runtimeE2e = runtimeE2e.slice(0, start) + unifiedTest + runtimeE2e.slice(end);
writeFileSync("e2e/runtime-performance.spec.mjs", runtimeE2e, "utf8");

rmSync("src/pages/CategoriesPage.tsx", { force: true });
rmSync("src/pages/CategoryPage.tsx", { force: true });

const packageJson = JSON.parse(read("package.json"));
packageJson.scripts["audit:phase10-2"] =
  "node scripts/audit-frontend-phase-10-2.mjs";
if (!packageJson.scripts.check.includes("audit:phase10-2")) {
  packageJson.scripts.check = packageJson.scripts.check.replace(
    "npm run audit:ssr &&",
    "npm run audit:ssr && npm run audit:phase10-2 &&",
  );
}
writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

for (const required of [
  "src/routes/categories-redirect.tsx",
  "src/routes/category-shop.tsx",
  "scripts/audit-frontend-phase-10-2.mjs",
  "docs/FRONTEND_PHASE_10_2_UNIFIED_SHOP_CATEGORIES.md",
]) {
  if (!existsSync(required)) throw new Error(`Missing Phase 10.2 prerequisite: ${required}`);
}

console.log("Phase 10.2 remaining legacy references migrated.");
