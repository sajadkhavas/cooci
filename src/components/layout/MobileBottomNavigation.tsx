import {
  Gift,
  Home,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { matchesRoutePrefix } from "@/lib/accessibility/navigation";

interface BottomNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: (pathname: string) => boolean;
  emphasized?: boolean;
  badge?: number;
}

export const MobileBottomNavigation = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const accountHref = isAuthenticated ? "/account" : "/account/login";

  const items: BottomNavigationItem[] = [
    {
      label: "خانه",
      href: "/",
      icon: Home,
      active: (pathname) => pathname === "/",
    },
    {
      label: "هدیه",
      href: "/gift",
      icon: Gift,
      active: (pathname) => matchesRoutePrefix(pathname, "/gift"),
    },
    {
      label: "فروشگاه",
      href: "/products",
      icon: ShoppingBag,
      emphasized: true,
      active: (pathname) => matchesRoutePrefix(pathname, "/products"),
    },
    {
      label: "سبد",
      href: "/cart",
      icon: ShoppingCart,
      badge: totalItems,
      active: (pathname) => matchesRoutePrefix(pathname, "/cart"),
    },
    {
      label: "حساب",
      href: accountHref,
      icon: UserRound,
      active: (pathname) => matchesRoutePrefix(pathname, "/account"),
    },
  ];

  return (
    <nav
      className="mobile-bottom-navigation md:hidden"
      aria-label="ناوبری پایین موبایل"
    >
      <div className="mobile-bottom-navigation__surface">
        {items.map((item) => {
          const active = item.active(location.pathname);
          const Icon = item.icon;
          const badgeLabel = item.badge
            ? `، ${item.badge.toLocaleString("fa-IR")} محصول`
            : "";

          return (
            <Link
              key={item.label}
              to={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={`${item.label}${badgeLabel}`}
              className={`mobile-bottom-navigation__item ${
                item.emphasized ? "is-emphasized" : ""
              } ${active ? "is-active" : ""}`}
            >
              <span className="mobile-bottom-navigation__icon-wrap">
                <Icon size={item.emphasized ? 23 : 20} aria-hidden="true" />
                {Boolean(item.badge) && (
                  <span
                    className="mobile-bottom-navigation__badge"
                    aria-hidden="true"
                  >
                    {Math.min(item.badge ?? 0, 99).toLocaleString("fa-IR")}
                  </span>
                )}
              </span>
              <span className="mobile-bottom-navigation__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
