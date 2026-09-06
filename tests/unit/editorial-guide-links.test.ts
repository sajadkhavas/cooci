import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const guideSource = fs.readFileSync(
  new URL("../../src/components/home/EditorialGuides.tsx", import.meta.url),
  "utf8",
);
const storefrontContentSource = fs.readFileSync(
  new URL("../../src/lib/storefront-content.ts", import.meta.url),
  "utf8",
);

test("home editorial cards preserve dedicated canonical guide fallbacks", () => {
  for (const slug of [
    "choose-food-gift-box",
    "cookie-storage-guide",
    "cookies-per-guest-guide",
  ]) {
    assert.ok(
      storefrontContentSource.includes(`"${slug}"`),
      `missing dedicated guide fallback slug: ${slug}`,
    );
  }

  assert.match(guideSource, /loaderData\?\.relatedPosts \?\? \[\]/);
  assert.match(guideSource, /to=\{`\/blog\/\$\{guide\.slug\}`\}/);
});

test("individual editorial cards no longer use the generic blog hub destination", () => {
  assert.doesNotMatch(
    guideSource,
    /<Link\s+to=["']\/blog["'][^>]*className=["']editorial-guide/,
  );
});
