import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const checkoutPageSource = readFileSync(
  new URL("../../src/pages/CheckoutPage.tsx", import.meta.url),
  "utf8",
);

test("checkout submit tolerates an empty persisted order note", () => {
  assert.match(
    checkoutPageSource,
    /notes:\s*\(recipient\.notes \?\? ""\)\.trim\(\) \|\| undefined/,
  );
  assert.doesNotMatch(
    checkoutPageSource,
    /notes:\s*recipient\.notes\.trim\(\)/,
  );
});
