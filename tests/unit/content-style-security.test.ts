import assert from "node:assert/strict";
import test from "node:test";
import { parseSafeContentStyle } from "@/lib/security/content-style";

test("managed content keeps only safe text alignment and color styles", () => {
  assert.deepEqual(
    parseSafeContentStyle(
      "text-align: center; color: #27390c; background-color: rgb(245, 240, 230); font-size: 99px",
    ),
    {
      textAlign: "center",
      color: "#27390c",
      backgroundColor: "rgb(245, 240, 230)",
    },
  );
});

test("managed content rejects executable or URL-bearing inline CSS", () => {
  const style = parseSafeContentStyle(
    "background-image: url(javascript:alert(1)); color: expression(alert(1)); text-align: left; position: fixed",
  );

  assert.deepEqual(style, { textAlign: "left" });
  assert.equal(parseSafeContentStyle("background-image:url(https://evil.example/x)"), undefined);
});
