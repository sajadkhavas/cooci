import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const extractJsonLd = (html) =>
  Array.from(
    html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ).map((match) => JSON.parse(match[1]));

const flattenSchemas = (schemas) =>
  schemas.flatMap((schema) =>
    Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema],
  );

const findSchema = (schemas, type) =>
  flattenSchemas(schemas).find((schema) => schema?.["@type"] === type);

const expectNoInventedPhysicalLocation = (schemas) => {
  const serialized = JSON.stringify(schemas);
  expect(serialized).not.toContain('"@type":"LocalBusiness"');
  expect(serialized).not.toContain('"@type":"Bakery"');
  expect(serialized).not.toContain('"geo"');
  expect(serialized).not.toContain('"openingHoursSpecification"');
  expect(serialized).not.toContain('"streetAddress"');
};

test.describe("Phase 10.7 local SEO and brand entity", () => {
  test("location hub exposes only published Laravel city pages and the stable brand entity", async ({ page, request }) => {
    const response = await request.get("/locations");
    const html = await response.text();
    const schemas = extractJsonLd(html);
    const organization = findSchema(schemas, "Organization");
    const website = findSchema(schemas, "WebSite");
    const collection = findSchema(schemas, "CollectionPage");

    expect(response.status()).toBe(200);
    expect(html).toContain(
      `rel="canonical" href="${frontendOrigin}/locations"`,
    );
    expect(html).toContain('href="/city/staging-tehran"');
    expect(html).not.toContain('href="/city/tehran"');
    expect(organization).toMatchObject({
      "@id": `${frontendOrigin}/#organization`,
      name: "وینیمی بیکری",
      telephone: "+989212508746",
      email: "hello@winimibakery.com",
    });
    expect(organization.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "اندیشه",
      addressRegion: "تهران",
      addressCountry: "IR",
    });
    expect(website.publisher).toEqual({
      "@id": `${frontendOrigin}/#organization`,
    });
    expect(collection.mainEntity.numberOfItems).toBe(1);
    expect(collection.mainEntity.itemListElement[0]).toMatchObject({
      name: "سفارش کوکی تست در تهران",
      url: `${frontendOrigin}/city/staging-tehran`,
    });
    expectNoInventedPhysicalLocation(schemas);

    await page.goto("/locations");
    await expect(
      page.getByRole("heading", { name: "مناطق منتشرشده ارسال وینیمی" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "سفارش کوکی تست در تهران", exact: true }),
    ).toHaveAttribute("href", "/city/staging-tehran");
  });

  test("city page links Service and areaServed to the central entity without claiming a branch", async ({ page, request }) => {
    const response = await request.get("/city/staging-tehran");
    const html = await response.text();
    const schemas = extractJsonLd(html);
    const service = findSchema(schemas, "Service");
    const city = findSchema(schemas, "City");
    const webPage = findSchema(schemas, "WebPage");

    expect(response.status()).toBe(200);
    expect(html).toContain(
      `rel="canonical" href="${frontendOrigin}/city/staging-tehran"`,
    );
    expect(service.provider).toEqual({
      "@id": `${frontendOrigin}/#organization`,
    });
    expect(service.areaServed).toEqual({ "@id": city["@id"] });
    expect(webPage.mainEntity).toEqual({ "@id": service["@id"] });
    expect(html).toContain("محدوده اندیشه، استان تهران");
    expect(html).toContain("09212508746");
    expect(html).toContain("hello@winimibakery.com");
    expectNoInventedPhysicalLocation(schemas);

    await page.goto("/city/staging-tehran");
    await expect(
      page.getByRole("link", { name: "همه مناطق منتشرشده" }),
    ).toHaveAttribute("href", "/locations");
    await expect(
      page.getByText("به معنی وجود شعبه فیزیکی", { exact: false }),
    ).toBeVisible();
  });

  test("local duplicate URLs redirect and unknown cities remain 404 noindex", async ({ request }) => {
    const duplicateHub = await request.get("/locations?utm_source=test", {
      maxRedirects: 0,
    });
    expect(duplicateHub.status()).toBe(301);
    expect(duplicateHub.headers().location).toBe("/locations");

    const duplicateCity = await request.get(
      "/city/staging-tehran?utm_source=test",
      { maxRedirects: 0 },
    );
    expect(duplicateCity.status()).toBe(301);
    expect(duplicateCity.headers().location).toBe("/city/staging-tehran");

    const missing = await request.get("/city/not-published");
    expect(missing.status()).toBe(404);
    expect(missing.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });

  test("sitemap, contact page and NAP all point to the same published brand identity", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    const sitemapXml = await sitemap.text();
    expect(sitemap.status()).toBe(200);
    expect(sitemapXml).toContain(`${frontendOrigin}/locations`);
    expect(sitemapXml).toContain(`${frontendOrigin}/city/staging-tehran`);
    expect(sitemapXml).not.toContain(`${frontendOrigin}/city/tehran`);

    const contact = await request.get("/contact");
    const html = await contact.text();
    const schemas = extractJsonLd(html);
    const contactPage = findSchema(schemas, "ContactPage");
    const organization = findSchema(schemas, "Organization");

    expect(contact.status()).toBe(200);
    expect(contactPage.mainEntity).toEqual({
      "@id": `${frontendOrigin}/#organization`,
    });
    expect(organization.telephone).toBe("+989212508746");
    expect(html).toContain("09212508746");
    expect(html).toContain("hello@winimibakery.com");
    expect(html).toContain("محدوده اندیشه، استان تهران");
    expectNoInventedPhysicalLocation(schemas);
  });
});
