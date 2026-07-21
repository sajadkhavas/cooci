import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

export default defineConfig({
  testDir: ".",
  testMatch: ["phase18.spec.mjs", "phase7-pwa.spec.mjs"],
  timeout: 45_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["line"], ["html", { outputFolder: "playwright-report", open: "never" }]]
    : "list",
  use: {
    baseURL,
    locale: "fa-IR",
    timezoneId: "Asia/Tehran",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  outputDir: "test-results",
});
