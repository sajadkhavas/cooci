import assert from "node:assert/strict";
import test from "node:test";
import {
  faqAnswerToPlainText,
  faqTextAlignClass,
  resolveFaqTextAlign,
} from "@/lib/faq-rich-text";

test("FAQ Tiptap HTML is normalized to clean schema text", () => {
  const html = '<p style="text-align: center">محصولات وینیمی تازه آماده می‌شوند.</p><p><strong>زمان آماده‌سازی</strong> در صفحه محصول درج می‌شود.</p>';

  assert.equal(
    faqAnswerToPlainText(html),
    "محصولات وینیمی تازه آماده می‌شوند. زمان آماده‌سازی در صفحه محصول درج می‌شود.",
  );
  assert.equal(faqAnswerToPlainText(html).includes("<p"), false);
  assert.equal(faqAnswerToPlainText(html).includes("style="), false);
});

test("FAQ alignment only accepts the editor text-align contract", () => {
  assert.equal(resolveFaqTextAlign("text-align: center"), "center");
  assert.equal(resolveFaqTextAlign("color:red; text-align: justify; font-size:99px"), "justify");
  assert.equal(resolveFaqTextAlign("text-align: right"), "start");
  assert.equal(resolveFaqTextAlign("text-align: left"), "end");
  assert.equal(resolveFaqTextAlign("position: fixed; inset: 0"), "start");
  assert.equal(faqTextAlignClass(resolveFaqTextAlign("text-align: center")), "text-center");
});

test("FAQ plain-text conversion removes executable markup while keeping answer text", () => {
  const html = '<script>alert(1)</script><p onclick="evil()">پاسخ امن &amp; خوانا</p><iframe src="https://evil.example">x</iframe>';
  const text = faqAnswerToPlainText(html);

  assert.equal(text.includes("<script"), false);
  assert.equal(text.includes("onclick"), false);
  assert.equal(text.includes("<iframe"), false);
  assert.match(text, /پاسخ امن & خوانا/);
});
