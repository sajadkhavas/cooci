export interface CommercialSeoMeta {
  title: string;
  description: string;
  primaryIntent: string;
}

const commercialSeoByPath: Readonly<Record<string, CommercialSeoMeta>> = {
  "/": {
    title: "خرید کوکی، کیک و باکس هدیه | وینیمی بیکری",
    description:
      "محصولات فعال وینیمی را براساس دسته یا مناسبت پیدا کنید؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببینید و آنلاین سفارش دهید.",
    primaryIntent: "فروشگاه آنلاین وینیمی / خرید آنلاین کوکی، کیک و باکس هدیه",
  },
  "/products": {
    title: "محصولات وینیمی | کوکی، کیک، دسر و شیرینی",
    description:
      "همه محصولات فعال وینیمی را یک‌جا ببینید و با جست‌وجو، دسته‌بندی، قیمت، موجودی و شرایط ارسال تأییدشده هر انتخاب را مقایسه کنید.",
    primaryIntent: "محصولات وینیمی / فروشگاه محصولات وینیمی",
  },
  "/gift": {
    title: "باکس هدیه کوکی و شیرینی | وینیمی",
    description:
      "برای انتخاب هدیه خوراکی و باکس هدیه وینیمی، محصولات فعال فروشگاه را ببینید یا برای کارت، بسته‌بندی و ترکیب اختصاصی درخواست ثبت کنید؛ امکان اجرا و هزینه پس از بررسی تأیید می‌شود.",
    primaryIntent: "باکس هدیه کوکی و شیرینی",
  },
  "/corporate": {
    title: "هدیه و پذیرایی سازمانی | استعلام سفارش وینیمی",
    description:
      "برای هدیه و پذیرایی سازمانی، محصول، تعداد، بودجه، تاریخ و مقصد را ثبت کنید تا امکان اجرا، قیمت، بسته‌بندی و شرایط سفارش تعداد بالا بررسی شود.",
    primaryIntent: "هدیه و پذیرایی سازمانی",
  },
};

export const resolveCommercialSeoMeta = (pathname: string) =>
  commercialSeoByPath[pathname];

export const COMMERCIAL_SEO_PATHS = Object.freeze(
  Object.keys(commercialSeoByPath),
);
