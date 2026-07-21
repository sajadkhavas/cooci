export type NavigationMatch = "home" | "products" | "exact" | "prefix";

export interface NavigationTarget {
  href: string;
  match: NavigationMatch;
}

export const matchesRoutePrefix = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export const isNavigationTargetActive = (
  pathname: string,
  target: NavigationTarget,
) => {
  if (target.match === "home") return pathname === "/";
  if (target.match === "exact") return pathname === target.href;
  if (target.match === "prefix") {
    return matchesRoutePrefix(pathname, target.href);
  }
  return (
    pathname === "/products" ||
    (matchesRoutePrefix(pathname, "/products") &&
      !matchesRoutePrefix(pathname, "/products/category"))
  );
};
