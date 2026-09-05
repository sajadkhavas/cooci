import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(
  new URL("../../src/components/home/EditorialGuides.tsx", import.meta.url),
  "utf8",
);

test("home editorial cards link to dedicated canonical guide articles", () => {
  for (const path of [
    "/blog/choose-food-gift-box",
    "/blog/cookie-storage-guide",
    "/blog/cookies-per-guest-guide",
  ]) {
    assert.match(source, new RegExp(`href: \\"${path.replaceAll("/", "\\/")}\\"`));
  }
});

test("individual editorial cards no longer use the generic blog hub destination", () => {
  const guideArray = source.slice(source.indexOf("const guides = ["), source.indexOf("] as const;") + 11);
  assert.doesNotMatch(guideArray, /href:\s*["']\/blog["']/);
});
