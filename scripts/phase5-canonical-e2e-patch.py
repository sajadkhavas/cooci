from pathlib import Path

path = Path("e2e/phase18.spec.mjs")
source = path.read_text(encoding="utf-8")
old = '''  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBe("http://127.0.0.1:4173/products");'''
new = '''  const canonicals = page.locator('link[rel="canonical"]');
  await expect(canonicals).toHaveCount(1);
  await expect(canonicals).toHaveAttribute("href", "http://127.0.0.1:4173/products");'''
if source.count(old) != 1:
    raise RuntimeError(f"Expected exactly one canonical assertion block, found {source.count(old)}")
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Phase 5 single-canonical E2E patch applied.")
