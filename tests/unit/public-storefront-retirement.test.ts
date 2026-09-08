import assert from "node:assert/strict";
import test from "node:test";
import { retireUnavailableGiftSurface } from "../../src/lib/public-storefront-retirement.ts";

type PublicStorefrontContent = Parameters<
  typeof retireUnavailableGiftSurface
>[0];

const storefrontFixture = () =>
  ({
    navigation: {
      links: [
        { label: "خانه", href: "/" },
        { label: "هدیه", href: "/gift" },
        { label: "داستان ما", href: "/about" },
      ],
      contextLine: "کوکی، کیک، دسر و هدیه",
    },
    footer: {
      aboutText: "کوکی و هدیه برای لحظه‌های خوب.",
      discovery: {
        links: [
          { label: "فروشگاه", href: "/products" },
          { label: "راهنمای هدیه", href: "/gift" },
        ],
      },
      services: {
        links: [{ label: "هدیه", href: "/gift" }],
      },
    },
    home: {
      metaTitle: "خرید کوکی و هدیه وینیمی",
      metaDescription: "کوکی، کیک، دسر و هدیه را در وینیمی ببینید.",
      hero: {
        titleLine1: "برای هدیه",
        titleLine2: "یک انتخاب شیرین.",
        description: "برای هدیه یا پذیرایی انتخاب کن.",
        primary: { label: "فروشگاه", href: "/products" },
        secondary: { label: "انتخاب هدیه", href: "/gift" },
      },
      marquee: ["کوکی‌های خانگی", "باکس هدیه"],
      occasion: {
        items: [
          {
            shortTitle: "هدیه",
            title: "برای هدیه",
            description: "انتخاب برای هدیه",
            href: "/gift",
            actionLabel: "مشاهده",
          },
          {
            shortTitle: "پذیرایی",
            title: "برای پذیرایی",
            description: "انتخاب برای پذیرایی",
            href: "/products",
            actionLabel: "مشاهده",
          },
        ],
      },
      decision: {
        paths: [
          {
            eyebrow: "هدیه",
            title: "راهنمای هدیه",
            description: "برای هدیه انتخاب کن",
            href: "/gift",
            actionLabel: "مشاهده",
          },
          {
            eyebrow: "فروشگاه",
            title: "انتخاب محصول",
            description: "محصولات را ببین",
            href: "/products",
            actionLabel: "مشاهده",
          },
        ],
      },
    },
    corporate: {
      useCases: ["پذیرایی سازمانی", "هدیه سازمانی"],
    },
  }) as unknown as PublicStorefrontContent;

const allPublicLinks = (content: PublicStorefrontContent) => [
  ...content.navigation.links,
  ...content.footer.discovery.links,
  ...content.footer.services.links,
  content.home.hero.primary,
  content.home.hero.secondary,
  ...content.home.occasion.items.map((item) => ({
    label: item.actionLabel,
    href: item.href,
  })),
  ...content.home.decision.paths.map((item) => ({
    label: item.actionLabel,
    href: item.href,
  })),
];

test("retired gift capability is absent from public navigation and calls to action", () => {
  const content = retireUnavailableGiftSurface(storefrontFixture());

  assert.equal(
    allPublicLinks(content).some(
      (link) => link.href === "/gift" || link.label.includes("هدیه"),
    ),
    false,
  );
  assert.equal(
    content.navigation.links.some((link) => link.href === "/contact"),
    true,
  );
  assert.equal(content.navigation.contextLine.includes("هدیه"), false);
  assert.equal(content.footer.aboutText.includes("هدیه"), false);
  assert.equal(content.home.metaTitle.includes("هدیه"), false);
  assert.equal(content.home.metaDescription.includes("هدیه"), false);
  assert.equal(content.home.marquee.some((item) => item.includes("هدیه")), false);
});

test("gift retirement also protects stale backend-authored public surfaces", () => {
  const fixture = storefrontFixture();
  fixture.navigation.links = [
    { label: "خانه", href: "/" },
    { label: "هدیه ویژه", href: "/gift" },
    { label: "داستان ما", href: "/about" },
  ];
  fixture.footer.discovery.links = [
    { label: "راهنمای هدیه", href: "/gift" },
  ];
  fixture.home.hero.secondary = {
    label: "انتخاب هدیه",
    href: "/gift",
  };

  const content = retireUnavailableGiftSurface(fixture);

  assert.equal(
    allPublicLinks(content).some((link) => link.href === "/gift"),
    false,
  );
  assert.deepEqual(content.home.hero.secondary, {
    label: "مشاهده دسته‌بندی‌ها",
    href: "/products",
  });
});
