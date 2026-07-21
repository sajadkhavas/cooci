import { expect, test } from "@playwright/test";

const waitForServiceWorkerControl = async (page) => {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) return;

    await new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(
        () => reject(new Error("Service worker did not claim the page")),
        10_000,
      );
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          window.clearTimeout(timeoutId);
          resolve();
        },
        { once: true },
      );
    });
  });
};

test("production PWA is versioned and transactional routes fail closed offline", async ({
  context,
  page,
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "single production PWA acceptance");

  const workerResponse = await request.get("/sw.js");
  expect(workerResponse.ok()).toBeTruthy();
  const worker = await workerResponse.text();
  expect(worker).toMatch(/const BUILD_VERSION = "[a-f0-9]{16}";/);
  expect(worker).not.toContain("__WINIMI_BUILD_VERSION__");
  expect(worker).toContain('"/checkout"');
  expect(worker).toContain('"/payment"');
  expect(worker).toContain('"/account"');
  expect(worker).toContain('cache: "no-store"');

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBeTruthy();
  const manifest = await manifestResponse.json();
  expect(manifest.id).toBe("/");
  expect(manifest.scope).toBe("/");
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        src: "/icons/winimi-192.png",
        sizes: "192x192",
        type: "image/png",
      }),
      expect.objectContaining({
        src: "/icons/winimi-512.png",
        sizes: "512x512",
        type: "image/png",
      }),
    ]),
  );

  await page.goto("/");
  await waitForServiceWorkerControl(page);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  try {
    await context.setOffline(true);
    await page.goto("/checkout", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "اتصال اینترنت در دسترس نیست" }),
    ).toBeVisible();
    await expect(page.locator("#root")).toHaveCount(0);
  } finally {
    await context.setOffline(false);
  }
});
