from pathlib import Path

path = Path("src/lib/checkout.ts")
source = path.read_text(encoding="utf-8")

import_anchor = 'import type { CartItem } from "@/lib/cart";\n'
import_line = 'import { encodeBooleanQuery } from "@/lib/http-query";\n'
if source.count(import_anchor) != 1:
    raise RuntimeError("Expected one CartItem import anchor")
if import_line not in source:
    source = source.replace(import_anchor, import_anchor + import_line, 1)

old = '    requiresCooling: String(requiresCooling),'
new = '    requiresCooling: encodeBooleanQuery(requiresCooling),'
if source.count(old) != 1:
    raise RuntimeError(f"Expected one legacy boolean query value, found {source.count(old)}")
source = source.replace(old, new, 1)

path.write_text(source, encoding="utf-8")
print("Laravel-compatible delivery boolean patch applied.")
