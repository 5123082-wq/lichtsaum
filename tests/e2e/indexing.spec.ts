import { expect, test } from "@playwright/test";

test("keeps the local prototype German and explicitly non-indexable", async ({
  page
}) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-robots-tag"]).toMatch(/\bnoindex\b/i);
  expect(response?.headers()["x-robots-tag"]).toMatch(/\bnofollow\b/i);

  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveCount(1);
  await expect(robots).toHaveAttribute("content", /\bnoindex\b/i);
  await expect(robots).toHaveAttribute("content", /\bnofollow\b/i);

  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("disallows crawling in the local robots.txt", async ({ request }) => {
  const response = await request.get("/robots.txt");
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(body).toMatch(/User-Agent:\s*\*/i);
  expect(body).toMatch(/Disallow:\s*\/(?:\s|$)/i);
  expect(body).not.toMatch(/^Allow:\s*\/(?:\s|$)/im);
  expect(body).not.toMatch(/Sitemap:/i);
});
