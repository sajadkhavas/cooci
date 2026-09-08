import assert from "node:assert/strict";
import test from "node:test";
import { retireUnavailableGiftSurface } from "../../src/lib/public-storefront-retirement.ts";
import { resolveStorefrontContent } from "../../src/lib/storefront-content.ts";

const allPublicLinks = (content: ReturnType<typeof resolveStorefrontContent>) => [
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
  const content = retireUnavailableGiftSurface(resolveStorefrontContent());

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

test("backend-authored gift links are retired even when settings still contain them", () => {
  const content = retireUnavailableGiftSurface(
    resolveStorefrontContent({
      settings: {
        navigation: {
          header_1_label: "هدیه ویژه",
          header_1_href: "/gift",
        },
        footer: {
          group_3_link_1_label: "راهنمای هدیه",
          group_3_link_1_href: "/gift",
        },
        home: {
          hero_secondary_label: "انتخاب هدیه",
          hero_secondary_href: "/gift",
        },
      },
      trust: {
        enamad: {
          enabled: false,
          badgeCode: null,
        },
      },
    }),
  );

  assert.equal(
    allPublicLinks(content).some((link) => link.href === "/gift"),
    false,
  );
  assert.deepEqual(content.home.hero.secondary, {
    label: "مشاهده دسته‌بندی‌ها",
    href: "/products",
  });
});
