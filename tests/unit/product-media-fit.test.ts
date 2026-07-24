import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const gallerySource = await readFile(
  new URL("../../src/components/catalog/ProductGallery.tsx", import.meta.url),
  "utf8",
);

const cardSource = await readFile(
  new URL("../../src/components/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("product detail gallery preserves the complete managed image", () => {
  assert.match(
    gallerySource,
    /className="h-full w-full object-contain p-4[^\"]*sm:p-6[^\"]*lg:p-8"/,
  );
  assert.doesNotMatch(
    gallerySource,
    /className="h-full w-full object-cover transition-transform/,
  );
});

test("catalog cards keep editorial cover treatment", () => {
  assert.match(
    cardSource,
    /className="h-full w-full object-cover transition duration-700 group-hover:scale-\[1\.07\]"/,
  );
});
