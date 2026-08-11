import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the Berlin contact scene without unconfirmed service claims", async ({
  page
}) => {
  const response = await page.goto("/kontakt");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Kontakt \| LICHTSAUM/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Kontakt." })
  ).toBeVisible();
  await expect(page.locator(".contact-atlas__image")).toHaveAttribute(
    "src",
    /lichtsaum-europe-countries-10m\.svg/
  );
  await expect(page.getByText("Kartendaten / Natural Earth 1:10m")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "info@lichtsaum.com" })
  ).toHaveAttribute(
    "href",
    "mailto:info@lichtsaum.com"
  );
  await expect(
    page.getByRole("link", { name: "Projekt prüfen lassen", exact: true }).last()
  ).toHaveAttribute("href", "/#projekt-pruefen");
  await expect(
    page.getByRole("link", { name: "Anbieterangaben im Impressum" })
  ).toHaveAttribute("href", "/impressum");

  await expect(page.getByText("Dannenwalder Weg 110")).toHaveCount(0);
  await expect(page.getByText("Montage in Berlin und Brandenburg")).toHaveCount(0);
  await expect(page.getByText("Deutschlandweit")).toHaveCount(0);
  await expect(page.getByText(/Liefergebiet|Montagegebiet/)).toHaveCount(0);
});

test("keeps the contact scene inside the viewport across key widths", async ({ page }) => {
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/kontakt");

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));

    expect(overflow.scrollWidth, `horizontal overflow at ${width}px`).toBe(
      overflow.clientWidth
    );
    await expect(page.locator(".contact-atlas__image")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Projekt prüfen lassen", exact: true }).last()
    ).toBeVisible();
  }
});

test("keeps the contact scene free of detectable A/AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kontakt");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const results = await new AxeBuilder({ page })
    .include("#main-content")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const violationSummary = results.violations
    .map(
      (violation) =>
        `${violation.id} (${violation.impact ?? "impact unknown"}): ${
          violation.nodes.length
        } node(s)`
    )
    .join("\n");

  expect(results.violations, violationSummary).toEqual([]);
});
