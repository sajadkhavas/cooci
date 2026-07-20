import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeApiBaseUrl,
  resolveApiRequestUrl,
} from "../../src/lib/security/api-url.ts";
import { sanitizeInternalReturnPath } from "../../src/lib/security/navigation.ts";
import {
  isValidIranianMobileNumber,
  normalizeDigits,
  normalizeIranianMobile,
  normalizeOtpCode,
} from "../../src/lib/security/normalization.ts";

test("return paths stay inside the Winimi router", () => {
  assert.equal(
    sanitizeInternalReturnPath("/account/orders/WNM-123?tab=payment#latest"),
    "/account/orders/WNM-123?tab=payment#latest",
  );
  assert.equal(sanitizeInternalReturnPath("//evil.example/path"), "/account");
  assert.equal(sanitizeInternalReturnPath("https://evil.example"), "/account");
  assert.equal(sanitizeInternalReturnPath("/\\evil.example"), "/account");
  assert.equal(sanitizeInternalReturnPath("/account/login"), "/account");
  assert.equal(sanitizeInternalReturnPath("/account\n/orders"), "/account");
});

test("Persian and Arabic digits normalize without applying mobile rules to OTP", () => {
  assert.equal(normalizeDigits("۱۲٣۴"), "1234");
  assert.equal(normalizeOtpCode("کد: ۱۲٣-۴۵۶"), "123456");
  assert.equal(normalizeOtpCode("۹۸۹۱۲۳۴"), "989123");
});

test("Iranian mobile normalization supports local and international forms", () => {
  assert.equal(normalizeIranianMobile("۰۹۱۲ ۱۲۳ ۴۵۶۷"), "09121234567");
  assert.equal(normalizeIranianMobile("+98 912 123 4567"), "09121234567");
  assert.equal(normalizeIranianMobile("0098-912-123-4567"), "09121234567");
  assert.equal(isValidIranianMobileNumber("09121234567"), true);
  assert.equal(isValidIranianMobileNumber("08121234567"), false);
});

test("production API origins require HTTPS and never contain credentials", () => {
  assert.equal(
    normalizeApiBaseUrl("https://api.winimibakery.com/", {
      development: false,
    }),
    "https://api.winimibakery.com",
  );
  assert.equal(
    normalizeApiBaseUrl("http://127.0.0.1:8000", { development: true }),
    "http://127.0.0.1:8000",
  );
  assert.throws(
    () =>
      normalizeApiBaseUrl("http://api.winimibakery.com", {
        development: false,
      }),
    /HTTPS/,
  );
  assert.throws(
    () =>
      normalizeApiBaseUrl("https://user:pass@api.winimibakery.com", {
        development: false,
      }),
    /معتبر نیست/,
  );
});

test("API request paths cannot escape the configured origin", () => {
  const base = "https://api.winimibakery.com";
  assert.equal(
    resolveApiRequestUrl(base, "/api/catalog/products?page=2"),
    "https://api.winimibakery.com/api/catalog/products?page=2",
  );
  assert.throws(() => resolveApiRequestUrl(base, "//evil.example/api"));
  assert.throws(() => resolveApiRequestUrl(base, "https://evil.example/api"));
  assert.throws(() => resolveApiRequestUrl(base, "/\\evil.example/api"));
});
