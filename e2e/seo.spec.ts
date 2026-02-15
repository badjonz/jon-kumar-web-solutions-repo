import { test, expect } from "@playwright/test";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

test.describe("SEO Metadata", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Jon Kumar Web Solutions | Websites That Get You Found on Google",
    );
  });

  test("has the correct meta description", async ({ page }) => {
    const description = await page.getAttribute(
      'meta[name="description"]',
      "content",
    );
    expect(description).toBe(
      "Professional web solutions in Trinidad and Tobago. Fast, modern websites designed to get your business found on Google and convert visitors into customers.",
    );
    expect(description!.length).toBeGreaterThanOrEqual(150);
    expect(description!.length).toBeLessThanOrEqual(160);
  });

  test("has the correct canonical URL", async ({ page }) => {
    const canonical = await page.getAttribute(
      'link[rel="canonical"]',
      "href",
    );
    expect(canonical).toBe(siteUrl);
  });

  test("has the correct Open Graph title", async ({ page }) => {
    const ogTitle = await page.getAttribute(
      'meta[property="og:title"]',
      "content",
    );
    expect(ogTitle).toBe(
      "Jon Kumar Web Solutions | Websites That Get You Found on Google",
    );
  });

  test("has the correct Open Graph description", async ({ page }) => {
    const ogDescription = await page.getAttribute(
      'meta[property="og:description"]',
      "content",
    );
    expect(ogDescription).toBe(
      "Professional web solutions in Trinidad and Tobago. Fast, modern websites designed to get your business found on Google and convert visitors into customers.",
    );
  });

  test("has the correct Open Graph type", async ({ page }) => {
    const ogType = await page.getAttribute(
      'meta[property="og:type"]',
      "content",
    );
    expect(ogType).toBe("website");
  });

  test("has the correct Open Graph URL", async ({ page }) => {
    const ogUrl = await page.getAttribute('meta[property="og:url"]', "content");
    expect(ogUrl).toBe(siteUrl);
  });

  test("has the correct Open Graph image", async ({ page }) => {
    const ogImage = await page.getAttribute(
      'meta[property="og:image"]',
      "content",
    );
    expect(ogImage).toBe(`${siteUrl}/og-image.png`);
  });

  test("has the correct Open Graph site name", async ({ page }) => {
    const ogSiteName = await page.getAttribute(
      'meta[property="og:site_name"]',
      "content",
    );
    expect(ogSiteName).toBe("Jon Kumar Web Solutions");
  });

  test("has the correct Twitter card type", async ({ page }) => {
    const twitterCard = await page.getAttribute(
      'meta[name="twitter:card"]',
      "content",
    );
    expect(twitterCard).toBe("summary_large_image");
  });

  test("has the correct Twitter title", async ({ page }) => {
    const twitterTitle = await page.getAttribute(
      'meta[name="twitter:title"]',
      "content",
    );
    expect(twitterTitle).toBe(
      "Jon Kumar Web Solutions | Websites That Get You Found on Google",
    );
  });

  test("has the correct Twitter description", async ({ page }) => {
    const twitterDescription = await page.getAttribute(
      'meta[name="twitter:description"]',
      "content",
    );
    expect(twitterDescription).toBe(
      "Professional web solutions in Trinidad and Tobago. Fast, modern websites designed to get your business found on Google and convert visitors into customers.",
    );
  });

  test("has the correct Twitter image", async ({ page }) => {
    const twitterImage = await page.getAttribute(
      'meta[name="twitter:image"]',
      "content",
    );
    expect(twitterImage).toBe(`${siteUrl}/og-image.png`);
  });
});

test.describe("Sitemap & Robots.txt", () => {
  test("sitemap.xml returns 200 status and contains valid XML structure", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content).toContain("<urlset");
    expect(content).toContain("<url>");
    expect(content).toContain("<loc>");
    expect(content).toContain("<lastmod>");
    expect(content).toContain("<changefreq>");
    expect(content).toContain("<priority>");
  });

  test("sitemap.xml contains the site URL in <loc> tag", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    const content = await response.text();
    expect(content).toContain(`<loc>${siteUrl}</loc>`);
  });

  test("sitemap.xml contains priority 1.0 for home page", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    const content = await response.text();
    expect(content).toContain("<priority>1</priority>");
  });

  test("robots.txt returns 200 status and contains correct directives", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content).toContain("User-Agent: *");
    expect(content).toContain("Allow: /");
  });

  test("robots.txt contains sitemap directive", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const content = await response.text();
    expect(content).toContain("Sitemap:");
    expect(content).toContain(`${siteUrl}/sitemap.xml`);
  });
});
