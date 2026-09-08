import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeStorefrontRedirectLocation,
  parseStorefrontRedirectData,
} from "../../src/lib/seo/storefront-redirect-policy.ts";

test("storefront redirect policy accepts safe same-site locations", () => {
  assert.equal(
    normalizeStorefrontRedirectLocation("/products/cookie?from=legacy#details"),
    "/products/cookie?from=legacy#details",
  );
  assert.deepEqual(
    parseStorefrontRedirectData({
      found: true,
      location: "/products/cookie",
      statusCode: 301,
    }),
    {
      found: true,
      location: "/products/cookie",
      statusCode: 301,
    },
  );
});

test("storefront redirect policy rejects external and malformed locations", () => {
  for (const location of [
    "https://evil.example/path",
    "//evil.example/path",
    "/%2F%2Fevil.example/path",
    "/safe\\evil",
    "/bad\u0000path",
  ]) {
    assert.equal(normalizeStorefrontRedirectLocation(location), null);
  }
});

test("storefront redirect policy only permits redirect status codes", () => {
  for (const statusCode of [301, 302, 307, 308]) {
    assert.equal(
      parseStorefrontRedirectData({
        found: true,
        location: "/products",
        statusCode,
      })?.statusCode,
      statusCode,
    );
  }

  for (const statusCode of [200, 201, 304, 404, 500]) {
    assert.equal(
      parseStorefrontRedirectData({
        found: true,
        location: "/products",
        statusCode,
      }),
      null,
    );
  }
});

test("storefront redirect policy requires null redirect fields when not found", () => {
  assert.deepEqual(
    parseStorefrontRedirectData({
      found: false,
      location: null,
      statusCode: null,
    }),
    {
      found: false,
      location: null,
      statusCode: null,
    },
  );

  assert.equal(
    parseStorefrontRedirectData({
      found: false,
      location: "/products",
      statusCode: null,
    }),
    null,
  );
});
