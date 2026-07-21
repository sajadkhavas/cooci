import assert from "node:assert/strict";
import test from "node:test";
import { encodeBooleanQuery } from "@/lib/http-query";

test("boolean query values use Laravel-compatible 1 and 0", () => {
  assert.equal(encodeBooleanQuery(true), "1");
  assert.equal(encodeBooleanQuery(false), "0");
});
