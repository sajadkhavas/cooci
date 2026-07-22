import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";

const extractJsonLd = (html) =>
  Array.from(
    html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ).map((match) => JSON.parse(match[1]));

const findSchema = (schemas, type) =>
  schemas.find((schema) => schema?.["@type"] === type);

test.describe("Phase 10.6 content and topical authority", () => {
  test("blog index publishes Laravel-derived topic links and Blog ItemList in raw SSR", async ({ request }) => {
    const response = await request.get("/blog");
    const html = await response.text();
    const blog = findSchema(extractJsonLd(html), "Blog");

    expect(response.status()).toBe(200);
    expect(html).toContain('href="/blog/topic/staging"');
    expect(html).toContain('href="/blog/staging-welcome"');
    expect(blog).toBeTruthy();
    expect(blog.url).toBe(`${frontendOrigin}/blog`);
    expect(blog.mainEntity.itemListElement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: `${frontendOrigin}/blog/staging-welcome`,
          name: "مقاله تست پذیرش وینیمی",
        }),
      ]),
    );
  });

  test("topic hub is crawlable, self-canonical and contains only its published articles", async ({ page, request }) => {
    const response = await request.get("/blog/topic/staging");
    const html = await response.text();
    const collection = findSchema(extractJsonLd(html), "CollectionPage");

    expect(response.status()).toBe(200);
    expect(html).toContain(
      `rel="canonical" href="${frontendOrigin}/blog/topic/staging"`,
    );
    expect(collection).toBeTruthy();
    expect(collection.about).toMatchObject({
      "@type": "DefinedTerm",
      name: "staging",
      url: `${frontendOrigin}/blog/topic/staging`,
    });
    expect(collection.mainEntity.itemListElement).toHaveLength(1);

    await page.goto("/blog/topic/staging");
    await expect(
      page.getByRole("heading", { name: "راهنماهای staging" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "مقاله تست پذیرش وینیمی",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("article BlogPosting links visibly and structurally to its topic without invented related content", async ({ page, request }) => {
    const response = await request.get("/blog/staging-welcome");
    const html = await response.text();
    const article = findSchema(extractJsonLd(html), "BlogPosting");

    expect(response.status()).toBe(200);
    expect(article).toBeTruthy();
    expect(article.articleSection).toBe("staging");
    expect(article.isPartOf).toMatchObject({
      "@type": "CollectionPage",
      name: "staging",
      url: `${frontendOrigin}/blog/topic/staging`,
    });
    expect(article.mainEntityOfPage["@id"]).toBe(
      `${frontendOrigin}/blog/staging-welcome`,
    );

    await page.goto("/blog/staging-welcome");
    await expect(
      page.getByRole("link", { name: "staging", exact: true }).first(),
    ).toHaveAttribute("href", "/blog/topic/staging");
    await expect(
      page.getByRole("heading", { name: "راهنماهای مرتبط" }),
    ).toHaveCount(0);
  });

  test("topic sitemap, canonical duplicate handling and unknown-topic noindex are enforced", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain(
      `${frontendOrigin}/blog/topic/staging`,
    );

    const pageOne = await request.get("/blog/topic/staging?page=1", {
      maxRedirects: 0,
    });
    expect(pageOne.status()).toBe(301);
    expect(pageOne.headers().location).toBe("/blog/topic/staging");

    const missing = await request.get("/blog/topic/not-published");
    expect(missing.status()).toBe(404);
    expect(missing.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
});
