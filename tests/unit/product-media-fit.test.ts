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

test("catalog cards preserve the subject over a filled adaptive backdrop", () => {
  assert.ok(
    cardSource.includes(
      'className="h-full w-full scale-110 object-cover opacity-35 blur-2xl transition duration-700 group-hover:scale-125 group-hover:opacity-45"',
    ),
  );
  assert.ok(
    cardSource.includes(
      'className="relative z-[1] h-full w-full object-contain p-3 transition duration-700 group-hover:scale-[1.04] sm:p-4"',
    ),
  );
  assert.ok(cardSource.includes('aria-hidden="true" className="absolute inset-0 overflow-hidden"'));
  assert.ok(cardSource.includes('import { OptimizedImage } from "@/components/media/OptimizedImage";'));
});
