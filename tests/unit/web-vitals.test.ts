import assert from "node:assert/strict";
import test from "node:test";
import {
  CORE_WEB_VITAL_THRESHOLDS,
  rateCoreWebVital,
  selectInpValue,
} from "@/lib/performance/web-vitals";

test("Core Web Vitals thresholds match the locked good-user-experience targets", () => {
  assert.deepEqual(CORE_WEB_VITAL_THRESHOLDS, {
    LCP: { good: 2_500, poor: 4_000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
  });
  assert.equal(rateCoreWebVital("LCP", 2_500), "good");
  assert.equal(rateCoreWebVital("LCP", 2_500.1), "needs-improvement");
  assert.equal(rateCoreWebVital("INP", 500.1), "poor");
  assert.equal(rateCoreWebVital("CLS", 0.1), "good");
});

test("INP selection ignores one worst interaction for every fifty interactions", () => {
  const durations = Array.from({ length: 50 }, (_, index) => index + 1);
  assert.equal(selectInpValue(durations), 49);
  assert.equal(selectInpValue([120, Number.NaN, -1, 80]), 120);
  assert.equal(selectInpValue([]), undefined);
});
