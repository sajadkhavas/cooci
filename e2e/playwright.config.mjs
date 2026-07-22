import "../scripts/generate-phase18-e2e.mjs";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";
const allowLocalSelfSignedCertificate =
  process.env.CI === "true" && baseURL === "https://127.0.0.1:4443";
const localCertificateLaunchArgs = allowLocalSelfSignedCertificate
  ? ["--ignore-certificate-errors"]
  : [];

export default defineConfig({
  testDir: ".",
  testMatch: [
    "generated/phase18.spec.mjs",
    "phase7-pwa.spec.mjs",
    "phase9-adversarial.spec.mjs",
    "phase10-3-ssr-source.spec.mjs",
    "phase10-4-crawl-index.spec.mjs",
    "phase10-5-product-merchant-seo.spec.mjs",
    "runtime-performance.spec.mjs",
  ],
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
    ignoreHTTPSErrors: allowLocalSelfSignedCertificate,
    launchOptions: { args: localCertificateLaunchArgs },
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
