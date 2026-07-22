import fs from "node:fs";
import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", ready: "#main-content" },
  { path: "/products", ready: "#catalog-results" },
];

const percentile = (values, ratio) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(sorted.length * ratio) - 1),
  );
  return sorted[index];
};

const profileScroll = async (page) =>
  page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: 0, behavior: "auto" });
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

    const frameDeltas = [];
    const durationMs = 2_600;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    let previousFrame;
    const startedAt = performance.now();

    await new Promise((resolve) => {
      const tick = (now) => {
        if (previousFrame !== undefined) frameDeltas.push(now - previousFrame);
        previousFrame = now;

        const elapsed = now - startedAt;
        const cycle = Math.min(1, elapsed / durationMs);
        const position = cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2;
        window.scrollTo({ top: maxScroll * position, behavior: "auto" });

        if (elapsed < durationMs) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    window.scrollTo({ top: 0, behavior: "auto" });
    const longTasks = Array.isArray(window.__winimiRuntimeLongTasks)
      ? window.__winimiRuntimeLongTasks
      : [];

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollHeight: document.documentElement.scrollHeight,
      maxScroll,
      frameDeltas,
      longTasks,
    };
  });

const assertNoHorizontalOverflow = async (page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(2);
};

test("mobile bottom navigation is responsive, accessible and route-aware", async ({
  page,
}, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const navigation = page.getByRole("navigation", {
    name: "ناوبری پایین موبایل",
  });

  if (testInfo.project.name === "desktop-chromium") {
    await expect(navigation).toBeHidden();
    return;
  }

  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(5);
  await expect(navigation.getByRole("link", { name: "خانه" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    navigation.getByRole("link", { name: "فروشگاه" }),
  ).toBeVisible();
  await expect(navigation.getByRole("link", { name: "حساب" })).toHaveAttribute(
    "href",
    "/account/login",
  );

  const viewport = page.viewportSize();
  const navigationBox = await navigation.boundingBox();
  const whatsappBox = await page
    .getByRole("link", { name: /بازکردن پشتیبانی واتساپ/ })
    .boundingBox();
  expect(navigationBox).not.toBeNull();
  expect(whatsappBox).not.toBeNull();
  const navigationBottom =
    (navigationBox?.y ?? Infinity) + (navigationBox?.height ?? 0);
  const whatsappBottom =
    (whatsappBox?.y ?? Infinity) + (whatsappBox?.height ?? 0);
  expect(navigationBottom).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);
  expect(whatsappBottom).toBeLessThanOrEqual((navigationBox?.y ?? 0) + 2);

  await navigation.getByRole("link", { name: "فروشگاه" }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("heading", { name: "محصولات وینیمی" })).toBeVisible();
  await expect(page.getByText("کوکی شکلاتی تست").first()).toBeVisible();
  await expect(
    navigation.getByRole("link", { name: "فروشگاه" }),
  ).toHaveAttribute("aria-current", "page");
});

test("homepage is product-led and exposes the category architecture", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /سفارش آنلاین کوکی، کیک و باکس هدیه/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /اول دسته را پیدا کن/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /مشاهده همه دسته‌بندی‌ها/ })).toBeAttached();
  await expect(page.getByRole("link", { name: /مشاهده دسته کوکی‌های خانگی/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /خرید بر اساس موقعیت/ })).toBeVisible();

  await assertNoHorizontalOverflow(page);
});

test("category index is crawlable and editorial slugs map to Laravel", async ({ page }) => {
  await page.goto("/categories", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /دسته‌بندی محصولات وینیمی/,
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "مسیر" })).toBeVisible();

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
    await expect(
      page.getByRole("link", { name: new RegExp(`مشاهده دسته ${name}`) }),
    ).toHaveAttribute("href", href);
  }

  await page.goto("/products/category/cookies", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { level: 1, name: /کوکی‌های وینیمی/ }),
  ).toBeVisible();
  await expect(page.getByText("کوکی شکلاتی تست").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "دسته‌بندی‌ها" })).toBeVisible();

  const dietResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/catalog/products") &&
      response.url().includes("category=diet") &&
      response.status() === 200,
  );
  await page.goto("/products/category/diet-diabetic", {
    waitUntil: "domcontentloaded",
  });
  await dietResponse;
  await expect(
    page.getByRole("heading", { level: 1, name: /رژیمی و بدون قند افزوده/ }),
  ).toBeVisible();

  await assertNoHorizontalOverflow(page);
});

test("profiles production scrolling on desktop and mobile", async ({ page }, testInfo) => {
  test.setTimeout(90_000);

  await page.addInitScript(() => {
    window.__winimiRuntimeLongTasks = [];
    if (!("PerformanceObserver" in window)) return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__winimiRuntimeLongTasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
          });
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch {
      // Long Task API is optional; frame cadence remains the primary signal.
    }
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const profiles = [];
  try {
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator(route.ready)).toBeVisible();
      if (route.path === "/products") {
        await expect(
          page.getByRole("heading", { name: "محصولات وینیمی" }),
        ).toBeVisible();
        await expect(page.getByText("کوکی شکلاتی تست").first()).toBeVisible();
      }

      const raw = await profileScroll(page);
      const frameDeltas = raw.frameDeltas.filter((value) => Number.isFinite(value));
      const longTaskDurations = raw.longTasks.map((entry) => entry.duration);
      const profile = {
        route: route.path,
        viewport: raw.viewport,
        scrollHeight: raw.scrollHeight,
        maxScroll: raw.maxScroll,
        frames: frameDeltas.length,
        averageFrameMs:
          frameDeltas.length > 0
            ? frameDeltas.reduce((sum, value) => sum + value, 0) /
              frameDeltas.length
            : 0,
        p95FrameMs: percentile(frameDeltas, 0.95),
        maxFrameMs: Math.max(0, ...frameDeltas),
        framesOver32ms: frameDeltas.filter((value) => value > 32).length,
        framesOver50ms: frameDeltas.filter((value) => value > 50).length,
        longTaskCount: longTaskDurations.length,
        longTaskTotalMs: longTaskDurations.reduce((sum, value) => sum + value, 0),
        maxLongTaskMs: Math.max(0, ...longTaskDurations),
      };
      profiles.push(profile);

      expect(profile.maxScroll, `${route.path} must be scrollable`).toBeGreaterThan(0);
      expect(
        Math.abs(profile.maxScroll - (profile.scrollHeight - profile.viewport.height)),
        `${route.path} must keep a stable document height during profiling`,
      ).toBeLessThanOrEqual(4);
      expect(
        profile.frames,
        `${route.path} must produce enough frame samples`,
      ).toBeGreaterThan(25);
      expect(
        profile.p95FrameMs,
        `${route.path} runtime is catastrophically janky`,
      ).toBeLessThan(250);
    }
  } finally {
    await cdp
      .send("Emulation.setCPUThrottlingRate", { rate: 1 })
      .catch(() => undefined);
    await cdp.detach().catch(() => undefined);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: "production-preview",
    cpuThrottlingRate: 4,
    project: testInfo.project.name,
    profiles,
  };
  const reportPath = `runtime-performance-${testInfo.project.name}.json`;
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`WINIMI_RUNTIME_PROFILE ${JSON.stringify(report)}`);
  await testInfo.attach("runtime-performance", {
    body: Buffer.from(JSON.stringify(report, null, 2)),
    contentType: "application/json",
  });
});
