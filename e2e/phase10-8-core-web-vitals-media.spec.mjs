import { expect, test } from "@playwright/test";

const installVitalObservers = async (page) => {
  await page.addInitScript(() => {
    window.__phase108Vitals = {
      lcp: 0,
      cls: 0,
      eventDurations: [],
    };

    if (!("PerformanceObserver" in window)) return;
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) window.__phase108Vitals.lcp = last.startTime;
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Optional browser entry type.
    }
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__phase108Vitals.cls += entry.value;
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Optional browser entry type.
    }
    try {
      const eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.interactionId) {
            window.__phase108Vitals.eventDurations.push(entry.duration);
          }
        }
      });
      eventObserver.observe({
        type: "event",
        buffered: true,
        durationThreshold: 40,
      });
    } catch {
      // Optional browser entry type.
    }
  });
};

const waitForTwoFrames = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

test.describe("Phase 10.8 Core Web Vitals and media", () => {
  test("raw SSR exposes a preloaded high-priority LCP image with intrinsic dimensions", async ({
    request,
  }) => {
    const response = await request.get("/");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toMatch(
      /<link[^>]+rel="preload"[^>]+as="image"[^>]+fetchpriority="high"/i,
    );
    expect(html).toMatch(
      /<img[^>]+alt="نمایی از کوکی، کیک و محصولات وینیمی"[^>]+loading="eager"[^>]+fetchpriority="high"[^>]+width="1200"[^>]+height="1450"/i,
    );
    expect(html).not.toMatch(
      /<img[^>]+alt="نمایی از کوکی، کیک و محصولات وینیمی"[^>]+loading="lazy"/i,
    );
  });

  test("homepage lab signals stay inside the locked good Core Web Vitals targets", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await installVitalObservers(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await waitForTwoFrames(page);

    const hero = page.getByRole("img", {
      name: "نمایی از کوکی، کیک و محصولات وینیمی",
    });
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("loading", "eager");
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    await expect(hero).toHaveAttribute("width", "1200");
    await expect(hero).toHaveAttribute("height", "1450");

    const lazyImages = page.locator('img[loading="lazy"]');
    expect(await lazyImages.count()).toBeGreaterThan(2);

    const interactionMs = await page.evaluate(async () => {
      const target = Array.from(document.querySelectorAll("button")).find((button) =>
        button.getAttribute("aria-label")?.startsWith("افزودن"),
      );
      if (!target) return 0;
      target.scrollIntoView({ block: "center", behavior: "auto" });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const startedAt = performance.now();
      target.click();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      return performance.now() - startedAt;
    });

    const metrics = await page.evaluate(() => ({
      lcp: window.__phase108Vitals?.lcp ?? 0,
      cls: window.__phase108Vitals?.cls ?? 0,
      eventDurations: window.__phase108Vitals?.eventDurations ?? [],
    }));

    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThanOrEqual(2_500);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    expect(interactionMs).toBeLessThanOrEqual(200);
    for (const duration of metrics.eventDurations) {
      expect(duration).toBeLessThanOrEqual(200);
    }
  });

  test("Web Vitals ingestion is private, no-store and rejects malformed payloads", async ({
    request,
  }) => {
    const accepted = await request.post("/__web_vitals", {
      data: {
        name: "LCP",
        value: 1_240.5,
        rating: "good",
        route: "/products",
        navigationType: "navigate",
        viewport: { width: 412, height: 915 },
        pageId: "phase10-8-acceptance",
        recordedAt: "2026-07-23T00:00:00.000Z",
      },
    });
    expect(accepted.status()).toBe(204);
    expect(accepted.headers()["cache-control"]).toContain("no-store");
    expect(accepted.headers()["x-robots-tag"]).toBe("noindex, nofollow");

    const rejected = await request.post("/__web_vitals", {
      data: {
        name: "UNKNOWN",
        value: -1,
        rating: "good",
        route: "https://example.com",
      },
    });
    expect(rejected.status()).toBe(400);
  });

  test("product and article media reserve layout space and remain low-priority below fold", async ({
    page,
  }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    const articleImages = page.locator('article img[loading="lazy"]');
    const count = await articleImages.count();
    if (count > 0) {
      const first = articleImages.first();
      await expect(first).toHaveAttribute("width", "800");
      await expect(first).toHaveAttribute("height", "500");
      await expect(first).toHaveAttribute("fetchpriority", "low");
    }

    await page.goto("/products", { waitUntil: "domcontentloaded" });
    const productImages = page.locator('article img[loading="lazy"]');
    expect(await productImages.count()).toBeGreaterThan(0);
    const firstProduct = productImages.first();
    await expect(firstProduct).toHaveAttribute("width");
    await expect(firstProduct).toHaveAttribute("height");
  });
});
