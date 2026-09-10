import type { LoaderFunctionArgs } from "react-router";
import { isBackendEnabled } from "@/lib/api";
import { loadStoreSettings } from "@/lib/content";

const stringSetting = (
  settings: Record<string, unknown>,
  key: string,
  fallback: string,
) => {
  const value = settings[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const safeColor = (value: string, fallback: string) =>
  /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;

const safeShortcuts = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 4).flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object") return [];
    const item = candidate as Record<string, unknown>;
    if (
      typeof item.name !== "string" ||
      typeof item.url !== "string" ||
      !item.url.startsWith("/") ||
      item.url.startsWith("//")
    ) return [];
    return [{
      name: item.name.slice(0, 80),
      short_name: typeof item.short_name === "string"
        ? item.short_name.slice(0, 40)
        : item.name.slice(0, 40),
      description: typeof item.description === "string"
        ? item.description.slice(0, 160)
        : undefined,
      url: item.url,
      icons: [{
        src: "/icons/winimi-192.png",
        sizes: "192x192",
        type: "image/png",
      }],
    }];
  });
};

export const loader = async (_args: LoaderFunctionArgs) => {
  let settings: Record<string, unknown> = {};
  if (isBackendEnabled) {
    settings = (await loadStoreSettings().catch(() => undefined))?.settings ?? {};
  }

  const defaults = [
    { name: "فروشگاه وینیمی", short_name: "فروشگاه", description: "مشاهده محصولات وینیمی", url: "/products" },
    { name: "سبد خرید", short_name: "سبد", description: "مشاهده سبد خرید", url: "/cart" },
    { name: "حساب کاربری", short_name: "حساب", description: "سفارش‌ها و تنظیمات حساب", url: "/account" },
  ];
  const shortcuts = safeShortcuts(settings["pwa.shortcuts"]);
  const manifest = {
    id: "/",
    name: stringSetting(settings, "pwa.name", "وینیمی بیکری"),
    short_name: stringSetting(settings, "pwa.short_name", "وینیمی"),
    description: stringSetting(settings, "pwa.description", "فروشگاه آنلاین وینیمی بیکری"),
    lang: "fa-IR",
    dir: "rtl",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: safeColor(stringSetting(settings, "pwa.background_color", "#FFFDF7"), "#FFFDF7"),
    theme_color: safeColor(stringSetting(settings, "pwa.theme_color", "#D0E596"), "#D0E596"),
    categories: ["shopping", "food"],
    icons: [
      { src: "/icons/winimi-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/winimi-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
    shortcuts: shortcuts.length ? shortcuts : safeShortcuts(defaults),
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
