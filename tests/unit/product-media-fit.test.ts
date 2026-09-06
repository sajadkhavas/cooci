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
    /className="h-full w-full object-contain p-4[^"]*sm:p-6[^"]*lg:p-8"/,
  );
  assert.doesNotMatch(
    gallerySource,
    /className="h-full w-full object-cover transition-transform/,
  );
});

test("catalog cards use a full-bleed product image without a blurred duplicate", () => {
  assert.ok(
    cardSource.includes(
      'className="relative z-[1] h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"',
    ),
  );
  assert.doesNotMatch(cardSource, /object-contain p-3/);
  assert.doesNotMatch(cardSource, /opacity-35 blur-2xl/);
  assert.ok(cardSource.includes('import { OptimizedImage } from "@/components/media/OptimizedImage";'));
});
