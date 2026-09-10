import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Home product autoplay never scrolls the document through scrollIntoView", () => {
  const source = readSource("src/components/home/HomeProductRail.tsx");

  assert.equal(source.includes("scrollIntoView("), false);
  assert.equal(source.includes("rail.scrollBy({"), true);
  assert.equal(source.includes("targetRect.right - railRect.right"), true);
  assert.equal(source.includes("targetRect.left - railRect.left"), true);
  assert.equal(source.includes("AUTOPLAY_DELAY = 6000"), true);
});
