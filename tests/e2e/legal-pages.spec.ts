import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the adapted Impressum with verified provider details", async ({
  page
}) => {
  const response = await page.goto("/impressum");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Impressum");
  await expect(page.getByText("NVKV Werbeagentur Inh. Ivan Novikov").first()).toBeVisible();
  await expect(page.getByText("Dannenwalder Weg 110")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "info@lichtsaum.com" })
  ).toBeVisible();
  await expect(page.getByText("DE367887602")).toBeVisible();

  const content = await page.locator("main").textContent();
  expect(content).not.toContain("Verbraucherstreitbeilegung");
  expect(content).not.toContain("Haftung für Inhalte");
  expect(content).not.toContain("pixel-ring.com");
  expect(content).not.toContain("ec.europa.eu/consumers/odr");
});

test("describes the confirmed LICHTSAUM data flows", async ({ page }) => {
  const response = await page.goto("/datenschutz");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Datenschutzerklärung"
  );
  await expect(
    page.getByText("sessionStorage", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "4. Google Tag Manager, Analytics und Ads"
    })
  ).toBeVisible();
  await expect(page.getByText("lichtsaum_consent")).toBeVisible();
  await expect(
    page.locator("main p").filter({
      hasText: "Das Projektformular ist in dieser Umgebung eine Prototypfunktion."
    })
  ).toContainText("nicht dauerhaft gespeichert");
  await expect(
    page.getByText("Berliner Beauftragte für Datenschutz und Informationsfreiheit")
  ).toBeVisible();

  const content = await page.locator("main").textContent();
  expect(content).not.toContain("OpenAI");
  expect(content).not.toContain("PixelRing");
  expect(content).not.toContain("Diese Erklärung beschreibt den aktuellen");
});

for (const route of ["/impressum", "/datenschutz"] as const) {
  test(`${route} remains accessible and responsive`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 780 });
    await page.goto(route);
    await page.evaluate(async () => document.fonts.ready);

    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
    await expect(page.getByRole("contentinfo")).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
