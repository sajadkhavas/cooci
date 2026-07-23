import assert from "node:assert/strict";
import test from "node:test";
import { brandConfig } from "@/config/brand";
import type { StoreCityPage } from "@/lib/content";
import {
  createBrandGraphSchema,
  createBrandOrganizationEntity,
  createBrandWebsiteEntity,
  getBrandEntityIds,
} from "@/lib/seo/brand-entity";
import {
  createAboutPageSchema,
  createCityLocalServiceSchema,
  createContactPageSchema,
  createLocationsCollectionSchema,
  getCityPagePath,
} from "@/lib/seo/local-seo";

const siteOrigin = "https://winimibakery.com";
const city = (overrides: Partial<StoreCityPage> = {}): StoreCityPage => ({
  id: "01JLOCAL",
  city: "تهران",
  slug: "tehran",
  title: "سفارش کوکی در تهران",
  description: "صفحه منتشرشده تهران",
  content: "محتوای منتشرشده تهران",
  seo: { title: "سفارش کوکی در تهران", description: "ارسال در تهران" },
  ...overrides,
});

test("brand entity uses stable IDs and the single configured NAP source", () => {
  const ids = getBrandEntityIds(siteOrigin);
  const organization = createBrandOrganizationEntity(siteOrigin);
  const website = createBrandWebsiteEntity(siteOrigin);

  assert.equal(ids.organization, `${siteOrigin}/#organization`);
  assert.equal(ids.website, `${siteOrigin}/#website`);
  assert.equal(organization["@id"], ids.organization);
  assert.equal(organization.name, brandConfig.brandName);
  assert.equal(organization.telephone, "+989212508746");
  assert.equal(organization.email, brandConfig.email);
  assert.deepEqual(organization.address, {
    "@type": "PostalAddress",
    addressLocality: brandConfig.city,
    addressRegion: brandConfig.region,
    addressCountry: "IR",
  });
  assert.equal(website.publisher["@id"], ids.organization);

  const serialized = JSON.stringify(organization);
  assert.equal(serialized.includes("streetAddress"), false);
  assert.equal(serialized.includes("geo"), false);
  assert.equal(serialized.includes("openingHoursSpecification"), false);
  assert.equal(serialized.includes("branchOf"), false);
});

test("brand graph preserves page schema while deduplicating stable entities", () => {
  const graph = createBrandGraphSchema({
    siteOrigin,
    pageSchema: [
      { "@type": "WebPage", "@id": `${siteOrigin}/contact#webpage` },
      createBrandOrganizationEntity(siteOrigin),
    ],
  });
  const nodes = graph["@graph"] as Array<Record<string, unknown>>;

  assert.equal(nodes.filter((node) => node["@type"] === "Organization").length, 1);
  assert.equal(nodes.filter((node) => node["@type"] === "WebSite").length, 1);
  assert.equal(nodes.some((node) => node["@id"] === `${siteOrigin}/contact#webpage`), true);
});

test("location hub exposes only supplied published Laravel city pages", () => {
  const cities = [city(), city({ id: "02", city: "کرج", slug: "karaj", title: "سفارش کوکی در کرج" })];
  const [collection] = createLocationsCollectionSchema({
    siteOrigin,
    cities,
    title: "مناطق ارسال",
    description: "مناطق منتشرشده",
  });
  const itemList = collection.mainEntity as Record<string, unknown>;
  const items = itemList.itemListElement as Array<Record<string, unknown>>;

  assert.equal(collection["@type"], "CollectionPage");
  assert.equal(itemList.numberOfItems, 2);
  assert.deepEqual(
    items.map((item) => item.url),
    [`${siteOrigin}/city/tehran`, `${siteOrigin}/city/karaj`],
  );
  assert.equal(JSON.stringify(collection).includes("not-published"), false);
});

test("city service schema links the published area to the central organization", () => {
  const ids = getBrandEntityIds(siteOrigin);
  const schemas = createCityLocalServiceSchema({ siteOrigin, city: city() });
  const service = schemas.find((schema) => schema["@type"] === "Service");
  const place = schemas.find((schema) => schema["@type"] === "City");

  assert.ok(service);
  assert.ok(place);
  assert.equal(service.url, `${siteOrigin}${getCityPagePath("tehran")}`);
  assert.equal((service.provider as Record<string, unknown>)["@id"], ids.organization);
  assert.equal((service.areaServed as Record<string, unknown>)["@id"], place["@id"]);
  assert.equal(JSON.stringify(schemas).includes("LocalBusiness"), false);
  assert.equal(JSON.stringify(schemas).includes("Bakery"), false);
  assert.equal(JSON.stringify(schemas).includes("geo"), false);
});

test("about and contact pages reference the same brand entity", () => {
  const ids = getBrandEntityIds(siteOrigin);
  const [about] = createAboutPageSchema(siteOrigin);
  const [contact] = createContactPageSchema(siteOrigin);

  assert.equal((about.about as Record<string, unknown>)["@id"], ids.organization);
  assert.equal((contact.mainEntity as Record<string, unknown>)["@id"], ids.organization);
});
