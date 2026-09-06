import assert from "node:assert/strict";
import test from "node:test";
import type { CategoryContent } from "@/data/categoriesContent";
import type { CatalogCategory } from "@/lib/catalog-api";
import { buildVisibleCatalogCategories } from "@/lib/catalog-category-visibility";

const editorial: CategoryContent[] = [
  {
    slug: "cakes",
    productCategorySlug: "cakes",
    name: "کیک و دسر",
    eyebrow: "Cake",
    cardDescription: "کیک‌ها",
    seoTitle: "کیک",
    seoDescription: "کیک",
    heading: "کیک",
    intro: "کیک",
    sections: [],
    faq: [],
  },
  {
    slug: "cheesecakes",
    productCategorySlug: "cakes",
    catalogSearch: "چیزکیک",
    name: "چیزکیک",
    eyebrow: "Cheesecake",
    cardDescription: "چیزکیک‌ها",
    seoTitle: "چیزکیک",
    seoDescription: "چیزکیک",
    heading: "چیزکیک",
    intro: "چیزکیک",
    sections: [],
    faq: [],
  },
  {
    slug: "gift-boxes",
    productCategorySlug: "gift",
    name: "باکس هدیه",
    eyebrow: "Gift",
    cardDescription: "هدیه",
    seoTitle: "هدیه",
    seoDescription: "هدیه",
    heading: "هدیه",
    intro: "هدیه",
    sections: [],
    faq: [],
  },
];

const backend: CatalogCategory[] = [
  {
    id: "01",
    name: "کیک و دسر از بک‌اند",
    slug: "cakes",
    description: "توضیح بک‌اند کیک",
    image: "https://api.example.test/storage/cakes.jpg",
    productCount: 7,
    seo: { title: "SEO کیک", description: "SEO توضیح کیک" },
  },
  {
    id: "02",
    name: "دسته جدید",
    slug: "new-category",
    description: "دسته مدیریت‌شده",
    productCount: 2,
    seo: { title: "SEO جدید", description: "SEO توضیح جدید" },
  },
];

test("no backend categories means no public category navigation", () => {
  assert.deepEqual(buildVisibleCatalogCategories(editorial, []), []);
});

test("backend categories control visibility and preserve filtered editorial views", () => {
  const visible = buildVisibleCatalogCategories(editorial, backend);

  assert.deepEqual(
    visible.map((category) => category.routeSlug),
    ["cakes", "cheesecakes", "new-category"],
  );

  assert.equal(visible[0]?.name, "کیک و دسر از بک‌اند");
  assert.equal(visible[0]?.description, "توضیح بک‌اند کیک");
  assert.equal(visible[0]?.productCount, 7);

  assert.equal(visible[1]?.name, "چیزکیک");
  assert.equal(visible[1]?.productCount, undefined);
  assert.equal(visible[1]?.isFilteredView, true);

  assert.equal(visible[2]?.name, "دسته جدید");
  assert.equal(visible.some((category) => category.routeSlug === "gift-boxes"), false);
});
