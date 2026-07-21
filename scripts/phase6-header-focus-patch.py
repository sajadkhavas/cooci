from pathlib import Path

path = Path("src/components/layout/Header.tsx")
source = path.read_text(encoding="utf-8")

if 'isNavigationTargetActive(location.pathname, link)' in source:
    print("Phase 6 Header patch is already applied.")
    raise SystemExit(0)

def replace_exact(old: str, new: str, label: str, expected: int = 1) -> None:
    global source
    count = source.count(old)
    print(f"{label}: expected={expected} found={count}")
    if count != expected:
        raise RuntimeError(f"{label}: expected {expected} occurrence(s), found {count}")
    source = source.replace(old, new)

replace_exact(
    'import { useCart } from "@/context/CartContext";\n',
    'import { useCart } from "@/context/CartContext";\nimport {\n  isNavigationTargetActive,\n  type NavigationMatch,\n} from "@/lib/accessibility/navigation";\n',
    "navigation helper import",
)
replace_exact(
    '''type NavMatch = "home" | "products" | "categories" | "prefix";

interface NavLink {
  name: string;
  href: string;
  match: NavMatch;
}''',
    '''interface NavLink {
  name: string;
  href: string;
  match: NavigationMatch;
}''',
    "navigation type",
)
replace_exact('''    match: "categories",
  },''', '''    match: "exact",
  },''', "cookie exact match")
replace_exact(
    '''const isNavLinkActive = (pathname: string, link: NavLink) => {
  if (link.match === "home") return pathname === "/";
  if (link.match === "products") {
    return (
      pathname === "/products" ||
      (pathname.startsWith("/products/") &&
        !pathname.startsWith("/products/category/"))
    );
  }
  if (link.match === "categories") {
    return pathname.startsWith("/products/category/");
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
};

''',
    "",
    "legacy active matcher",
)
replace_exact(
    '  const drawerRef = useRef<HTMLDivElement>(null);\n',
    '''  const drawerRef = useRef<HTMLDivElement>(null);
  const restoreMenuFocusRef = useRef(true);
  const previousLocationRef = useRef(
    `${location.pathname}${location.search}`,
  );
''',
    "focus restoration refs",
)
replace_exact(
    '''  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);''',
    '''  useEffect(() => {
    const locationKey = `${location.pathname}${location.search}`;
    if (previousLocationRef.current === locationKey) return;
    previousLocationRef.current = locationKey;
    if (!isOpen) return;
    restoreMenuFocusRef.current = false;
    setIsOpen(false);
  }, [isOpen, location.pathname, location.search]);''',
    "route close effect",
)
replace_exact(
    '''        setIsOpen(false);
        return;''',
    '''        restoreMenuFocusRef.current = true;
        setIsOpen(false);
        return;''',
    "escape focus restoration",
)
replace_exact(
    '      window.requestAnimationFrame(() => menuButtonRef.current?.focus());',
    '''      if (restoreMenuFocusRef.current) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }''',
    "conditional focus restoration",
)
replace_exact(
    'const active = isNavLinkActive(location.pathname, link);',
    'const active = isNavigationTargetActive(location.pathname, link);',
    "route matcher usage",
    expected=2,
)
replace_exact(
    'onClick={() => setIsOpen(true)}',
    '''onClick={() => {
                restoreMenuFocusRef.current = true;
                setIsOpen(true);
              }}''',
    "menu open intent",
)
replace_exact(
    '''onClick={() => setIsOpen(false)}
            aria-label="بستن منوی اصلی"''',
    '''onClick={() => {
              restoreMenuFocusRef.current = true;
              setIsOpen(false);
            }}
            aria-label="بستن منوی اصلی"''',
    "backdrop close intent",
)
replace_exact(
    '''onClick={() => setIsOpen(false)}
                className="touch-target flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"''',
    '''onClick={() => {
                  restoreMenuFocusRef.current = true;
                  setIsOpen(false);
                }}
                className="touch-target flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"''',
    "close button intent",
)
replace_exact(
    '''              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                className="mb-6 flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl"''',
    '''              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                onClick={() => {
                  restoreMenuFocusRef.current = false;
                  setIsOpen(false);
                }}
                className="mb-6 flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl"''',
    "account navigation intent",
)
replace_exact(
    '''                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-14''',
    '''                      to={link.href}
                      onClick={() => {
                        restoreMenuFocusRef.current = false;
                        setIsOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-14''',
    "mobile route navigation intent",
)

path.write_text(source, encoding="utf-8")
print("Phase 6 Header route and focus patch applied.")
