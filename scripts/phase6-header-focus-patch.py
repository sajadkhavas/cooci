from pathlib import Path
import subprocess

header_path = Path("src/components/layout/Header.tsx")
footer_path = Path("src/components/layout/Footer.tsx")
header = header_path.read_text(encoding="utf-8")
footer = footer_path.read_text(encoding="utf-8")

if 'isNavigationTargetActive(location.pathname, link)' not in header:
    raise RuntimeError("Core Header patch must be applied before the shared patch")

header_old = '''              <Link
                to="/products"
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 font-black text-accent-foreground"'''
header_new = '''              <Link
                to="/products"
                onClick={() => {
                  restoreMenuFocusRef.current = false;
                  setIsOpen(false);
                }}
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 font-black text-accent-foreground"'''

footer_import_anchor = '''} from "@/config/brand";
'''
footer_import_new = '''} from "@/config/brand";
import { getProgrammaticScrollBehavior } from "@/lib/accessibility/motion";
'''
footer_old = '  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });'
footer_new = '''  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: getProgrammaticScrollBehavior(),
    });'''

changes = False
if header_old in header:
    if header.count(header_old) != 1:
        raise RuntimeError("Expected one mobile store CTA")
    header = header.replace(header_old, header_new, 1)
    changes = True
elif 'restoreMenuFocusRef.current = false;\n                  setIsOpen(false);\n                }}\n                className="flex min-h-13' not in header:
    raise RuntimeError("Mobile store CTA is neither legacy nor patched")

if 'getProgrammaticScrollBehavior' not in footer:
    if footer.count(footer_import_anchor) != 1:
        raise RuntimeError("Expected one Footer brand import anchor")
    footer = footer.replace(footer_import_anchor, footer_import_new, 1)
    changes = True
if footer_old in footer:
    if footer.count(footer_old) != 1:
        raise RuntimeError("Expected one legacy Footer scroll function")
    footer = footer.replace(footer_old, footer_new, 1)
    changes = True
elif 'behavior: getProgrammaticScrollBehavior()' not in footer:
    raise RuntimeError("Footer scroll function is neither legacy nor patched")

if not changes:
    print("Phase 6 shared navigation and motion patch is already applied.")
    raise SystemExit(0)

header_path.write_text(header, encoding="utf-8")
footer_path.write_text(footer, encoding="utf-8")
subprocess.run(["git", "diff", "--check"], check=True)
subprocess.run(["git", "config", "user.name", "winimi-audit-bot"], check=True)
subprocess.run(["git", "config", "user.email", "actions@users.noreply.github.com"], check=True)
subprocess.run(["git", "add", str(header_path), str(footer_path)], check=True)
subprocess.run(
    ["git", "commit", "-m", "Phase 6: respect navigation focus and reduced motion"],
    check=True,
)
subprocess.run(
    [
        "git",
        "push",
        "origin",
        "HEAD:agent/frontend-full-audit-phase-6-components-accessibility",
    ],
    check=True,
)
print("Phase 6 shared navigation and motion patch committed.")
