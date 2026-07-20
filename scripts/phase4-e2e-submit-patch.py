from pathlib import Path

path = Path("e2e/phase18.spec.mjs")
source = path.read_text(encoding="utf-8")
old = '''  const standardDelivery = page.getByRole("button", { name: /ارسال معمولی/ });
  await expect(standardDelivery).toBeEnabled();
  await standardDelivery.click();
  await page.getByRole("button", { name: "ثبت سفارش و ادامه پرداخت" }).click();'''
new = '''  const submitOrder = page.getByRole("button", { name: "ثبت سفارش و ادامه پرداخت" });
  await expect(submitOrder).toBeEnabled();
  await submitOrder.click();'''
count = source.count(old)
if count != 1:
    raise RuntimeError(f"Expected exactly one checkout delivery block, found {count}")
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Phase 4 E2E submit gate patch applied.")
