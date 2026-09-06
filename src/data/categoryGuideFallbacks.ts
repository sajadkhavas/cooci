export interface CategoryGuideFallback {
  href: string;
  title: string;
  description: string;
}

// Frozen resilience fallback for the contextual links established in F29S.
// Backend category landing `guides` remain authoritative whenever available.
export const CATEGORY_GUIDE_FALLBACKS: Readonly<
  Record<string, readonly CategoryGuideFallback[]>
> = {
  cookies: [
    {
      href: "/blog/cookie-storage-guide",
      title: "راهنمای نگهداری و ماندگاری کوکی",
      description:
        "قبل و بعد از سفارش، اطلاعات نگهداری تأییدشده همان محصول را درست بخوانید.",
    },
    {
      href: "/blog/cookies-per-guest-guide",
      title: "برای پذیرایی چند کوکی در نظر بگیریم؟",
      description:
        "تعداد مهمان، اندازه محصول و نقش کوکی در میز را برای انتخاب بهتر کنار هم بگذارید.",
    },
  ],
  "mini-cookies": [
    {
      href: "/blog/cookies-per-guest-guide",
      title: "راهنمای تعداد کوکی برای پذیرایی",
      description:
        "برای سفارش چندنفره به‌جای عدد ثابت، تعداد مهمان و اندازه محصول فعال را مبنا قرار دهید.",
    },
  ],
  cakes: [
    {
      href: "/blog/cheesecake-cold-storage",
      title: "راهنمای نگهداری چیزکیک و محصولات یخچالی",
      description:
        "برای انتخاب‌های نیازمند سرمایش، دستور نگهداری تأییدشده محصول را پیش از سفارش بررسی کنید.",
    },
  ],
};

export const getCategoryGuideFallbacks = (slug?: string) =>
  slug ? CATEGORY_GUIDE_FALLBACKS[slug] ?? [] : [];
