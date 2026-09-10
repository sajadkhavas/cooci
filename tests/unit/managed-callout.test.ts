import assert from "node:assert/strict";
import test from "node:test";
import {
  MANAGED_CALLOUT_CLASS,
  resolveManagedCallout,
} from "@/lib/content/managed-callout";

const tones = [
  "gray_light",
  "gray",
  "gray_dark",
  "primary",
  "secondary",
  "tertiary",
  "accent",
] as const;

test("managed editor callout accepts only the exact package class", () => {
  assert.equal(resolveManagedCallout(undefined, "primary"), null);
  assert.equal(resolveManagedCallout("other", "primary"), null);
  assert.equal(resolveManagedCallout(`${MANAGED_CALLOUT_CLASS} attacker`, "primary"), null);
});

test("managed editor callout preserves every supported package tone", () => {
  for (const tone of tones) {
    const result = resolveManagedCallout(MANAGED_CALLOUT_CLASS, tone);
    assert.equal(result?.tone, tone);
    assert.ok(result?.toneClass.length);
  }
});

test("managed editor callout fails closed to gray for unknown tones", () => {
  const result = resolveManagedCallout(MANAGED_CALLOUT_CLASS, "javascript:alert(1)");
  assert.equal(result?.tone, "gray");
  assert.equal(result?.toneClass, "border-muted-foreground/35 bg-secondary/35");
});
