import assert from "node:assert/strict";
import test from "node:test";

import {
  categoryContents,
  resolveCategoryRouteSlug,
} from "@/data/categoriesContent";
import { buildVisibleCatalogCategories } from "@/lib/catalog-category-visibility";

const backendCategories = [
  {
    id: "1",
    slug: "kokyhay-khangy",
    name: "کوکی‌های خانگی",
    description: null,
    image: null,
    productCount: 6,
    seo: { title: "کوکی‌های خانگی", description: null },
  },
  {
    id: "2",
    slug: "myny-koky",
    name: "مینی کوکی",
    description: null,
    image: null,
    productCount: 0,
    seo: { title: "مینی کوکی", description: null },
  },
  {
    id: "3",
    slug: "kyk-o-dsr",
    name: "کیک و دسر",
    description: null,
    image: null,
    productCount: 5,
    seo: { title: "کیک و دسر", description: null },
  },
  {
    id: "4",
    slug: "rzhymy-o-bdon-knd-afzodh",
    name: "رژیمی و بدون قند افزوده",
    description: null,
    image: null,
    productCount: 0,
    seo: {
      title: "رژیمی و بدون قند افزوده",
      description: null,
    },
  },
  {
    id: "5",
    slug: "rol-o-krosan",
    name: "رول و کروسان",
    description: null,
    image: null,
    productCount: 0,
    seo: { title: "رول و کروسان", description: null },
  },
];

test("editorial category routes resolve only through published backend categories", () => {
  const visible = buildVisibleCatalogCategories(
    categoryContents,
    backendCategories,
  );

  const routes = new Map(
    visible.map((category) => [
      category.routeSlug,
      category.backendCategorySlug,
    ]),
  );

  assert.equal(routes.get("cookies"), "kokyhay-khangy");
  assert.equal(routes.get("mini-cookies"), "myny-koky");
  assert.equal(routes.get("diet-diabetic"), "rzhymy-o-bdon-knd-afzodh");
  assert.equal(routes.get("cakes"), "kyk-o-dsr");
  assert.equal(routes.get("cheesecakes"), "kyk-o-dsr");
  assert.equal(routes.get("pastry"), "rol-o-krosan");

  assert.equal(
    routes.has("gift-boxes"),
    false,
    "gift-boxes must stay hidden until the backend publishes a matching category",
  );

  assert.equal(resolveCategoryRouteSlug("kokyhay-khangy"), "cookies");
  assert.equal(resolveCategoryRouteSlug("myny-koky"), "mini-cookies");
  assert.equal(
    resolveCategoryRouteSlug("rzhymy-o-bdon-knd-afzodh"),
    "diet-diabetic",
  );
  assert.equal(resolveCategoryRouteSlug("kyk-o-dsr"), "cakes");
  assert.equal(resolveCategoryRouteSlug("rol-o-krosan"), "pastry");

  assert.equal(
    resolveCategoryRouteSlug("backend-only-category"),
    "backend-only-category",
  );
});
