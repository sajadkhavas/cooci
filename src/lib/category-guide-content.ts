import type { BackendStoreSettings } from "@/lib/backend-contract";

const read = (
  source: Record<string, unknown>,
  key: string,
  fallback: string,
) => {
  const group = source.category_guide;
  if (typeof group !== "object" || group === null || Array.isArray(group)) {
    return fallback;
  }
  const value = (group as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const resolveCategoryGuideContent = (payload?: BackendStoreSettings) => {
  const settings = payload?.settings ?? {};
  return {
    eyebrow: read(settings, "eyebrow", "راهنمای مرتبط"),
    title: read(settings, "title", "قبل از انتخاب، این راهنماها را ببین"),
    description: read(
      settings,
      "description",
      "لینک‌ها بر اساس موضوع همین دسته انتخاب شده‌اند و جایگزین اطلاعات قیمت، موجودی، ترکیبات یا شرایط نگهداری تأییدشده هر محصول نیستند.",
    ),
    readLabel: read(settings, "read_label", "خواندن راهنما"),
  };
};
