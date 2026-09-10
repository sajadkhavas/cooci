import type {
  StorefrontContent,
  StorefrontLink,
} from "@/lib/storefront-content";

const RETIRED_GIFT_PATH = "/gift";
const CONTACT_PATH = "/contact";
export const RETIRED_GIFT_CATEGORY_SLUGS = new Set(["gift", "gift-boxes"]);

export const isRetiredGiftCategory = (slug?: string | null) =>
  Boolean(slug && RETIRED_GIFT_CATEGORY_SLUGS.has(slug));

const referencesGift = (value: string) => value.includes("هدیه");

const isRetiredGiftLink = (link: StorefrontLink) =>
  link.href === RETIRED_GIFT_PATH || referencesGift(link.label);

const ensureContactNavigation = (
  links: ReadonlyArray<StorefrontLink>,
): StorefrontLink[] => {
  const publicLinks = links.filter((link) => !isRetiredGiftLink(link));
  if (publicLinks.some((link) => link.href === CONTACT_PATH)) {
    return [...publicLinks];
  }

  const contactLink: StorefrontLink = {
    label: "تماس با ما",
    href: CONTACT_PATH,
  };
  const aboutIndex = publicLinks.findIndex((link) => link.href === "/about");

  if (aboutIndex === -1) return [...publicLinks, contactLink];

  return [
    ...publicLinks.slice(0, aboutIndex),
    contactLink,
    ...publicLinks.slice(aboutIndex),
  ];
};

/**
 * Temporary production policy while Winimi does not offer a gift service.
 * Backend-authored content remains the source of truth, but public surfaces
 * must not advertise or link to a capability the business has not launched.
 * The dedicated gift content object is preserved so the feature can be
 * re-enabled later without reconstructing its editorial data.
 */
export const retireUnavailableGiftSurface = (
  content: StorefrontContent,
): StorefrontContent => {
  const occasionItems = content.home.occasion.items.filter(
    (item) =>
      item.href !== RETIRED_GIFT_PATH &&
      !referencesGift(item.shortTitle) &&
      !referencesGift(item.title) &&
      !referencesGift(item.description),
  );
  const decisionPaths = content.home.decision.paths.filter(
    (item) =>
      item.href !== RETIRED_GIFT_PATH &&
      !referencesGift(item.eyebrow) &&
      !referencesGift(item.title) &&
      !referencesGift(item.description),
  );
  const marquee = content.home.marquee.filter((item) => !referencesGift(item));

  return {
    ...content,
    navigation: {
      ...content.navigation,
      links: ensureContactNavigation(content.navigation.links),
      contextLine: referencesGift(content.navigation.contextLine)
        ? "کوکی، کیک و دسر؛ انتخاب بر اساس دسته و حال‌وهوای سفارش"
        : content.navigation.contextLine,
    },
    footer: {
      ...content.footer,
      aboutText: referencesGift(content.footer.aboutText)
        ? "کوکی، کیک و دسر؛ با جزئیاتی که پیش از سفارش می‌بینی."
        : content.footer.aboutText,
      discovery: {
        ...content.footer.discovery,
        links: content.footer.discovery.links.filter(
          (link) => !isRetiredGiftLink(link),
        ),
      },
      services: {
        ...content.footer.services,
        links: content.footer.services.links.filter(
          (link) => !isRetiredGiftLink(link),
        ),
      },
    },
    home: {
      ...content.home,
      metaTitle: referencesGift(content.home.metaTitle)
        ? "خرید کوکی، کیک و دسر وینیمی"
        : content.home.metaTitle,
      metaDescription: referencesGift(content.home.metaDescription)
        ? "محصولات فعال وینیمی را براساس دسته پیدا کنید؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببینید و آنلاین سفارش دهید."
        : content.home.metaDescription,
      hero: {
        ...content.home.hero,
        titleLine1: referencesGift(content.home.hero.titleLine1)
          ? "طعم خوب برای"
          : content.home.hero.titleLine1,
        titleLine2: referencesGift(content.home.hero.titleLine2)
          ? "پذیرایی و حال خوب."
          : content.home.hero.titleLine2,
        description: referencesGift(content.home.hero.description)
          ? "محصولات فعال وینیمی را براساس دسته پیدا کن؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببین و با خیال روشن‌تر سفارش بده."
          : content.home.hero.description,
        secondary:
          content.home.hero.secondary.href === RETIRED_GIFT_PATH ||
          referencesGift(content.home.hero.secondary.label)
            ? { label: "مشاهده دسته‌بندی‌ها", href: "/products" }
            : content.home.hero.secondary,
      },
      marquee:
        marquee.length > 0
          ? marquee
          : ["کوکی‌های خانگی", "مینی‌کوکی", "کیک و دسر", "رول و کروسان"],
      occasion: {
        ...content.home.occasion,
        items: occasionItems,
      },
      decision: {
        ...content.home.decision,
        paths: decisionPaths,
      },
    },
    corporate: {
      ...content.corporate,
      useCases: content.corporate.useCases.filter(
        (item) => !referencesGift(item),
      ),
    },
  };
};
