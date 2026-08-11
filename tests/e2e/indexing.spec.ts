import { expect, test } from "@playwright/test";

test("keeps local development free of deployment SEO overrides", async ({
  page
}) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-robots-tag"]).toBeUndefined();

  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveCount(0);

  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("serves a neutral local robots.txt", async ({ request }) => {
  const response = await request.get("/robots.txt");
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(body).toMatch(/User-Agent:\s*\*/i);
  expect(body).toMatch(/Allow:\s*\/(?:\s|$)/i);
  expect(body).not.toMatch(/^Disallow:\s*\/(?:\s|$)/im);
  expect(body).not.toMatch(/Sitemap:/i);
});

test("keeps truthful 404 responses out of the index without a home canonical", async ({
  page
}) => {
  const response = await page.goto("/not-a-real-page");

  expect(response?.status()).toBe(404);
  expect(
    await page.locator('meta[name="robots"][content*="noindex"]').count()
  ).toBeGreaterThan(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
