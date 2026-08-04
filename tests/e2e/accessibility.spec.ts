import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("has no automatically detectable WCAG 2.2 A/AA violations", async ({
  page
}) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const results = await new AxeBuilder({ page })
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

test("exposes the core page landmarks and keyboard entry point", async ({
  page
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(
    page.getByRole("navigation", { name: "Hauptnavigation" })
  ).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveAttribute("id", "main-content");
  await expect(page.getByRole("contentinfo")).toHaveCount(1);

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", {
    name: "Zum Inhalt springen",
    exact: true
  });

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
});

test("keeps the open composition selector free of detectable A/AA violations", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("#konfigurator");
  await section.getByRole("button", { name: /Komposition:/ }).click();
  await expect(
    section.getByRole("listbox", { name: "Komposition auswählen" })
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("#konfigurator")
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
