import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../../src/components/content/StructuredText.tsx", import.meta.url),
  "utf8",
);

const tones = [
  "gray_light",
  "gray",
  "gray_dark",
  "primary",
  "secondary",
  "tertiary",
  "accent",
] as const;

test("production StructuredText recognizes only the exact managed Tiptap callout class", () => {
  assert.match(source, /const CALLOUT_CLASS = "filament-tiptap-hurdle";/);
  assert.match(source, /if \(className === CALLOUT_CLASS\)/);
  assert.doesNotMatch(source, /includes\(CALLOUT_CLASS\)/);
});

test("production StructuredText contains every package-supported callout tone", () => {
  for (const tone of tones) {
    assert.match(source, new RegExp(`\\b${tone}:?\\b|"${tone}"`));
  }

  assert.match(source, /CALLOUT_COLORS\.has\(requestedColor\)/);
  assert.match(source, /:\s*"gray";/);
});

test("production StructuredText renders the callout as a dedicated accessible element", () => {
  assert.match(source, /<aside/);
  assert.match(source, /data-callout-tone=\{color\}/);
  assert.match(source, /aria-label="نکته"/);
  assert.match(source, /CALLOUT_TONE_CLASSES\[color\]/);
});
