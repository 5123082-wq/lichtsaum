import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

for (const viewport of viewports) {
  test(`Wirkung image viewing and keyboard navigation at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const section = page.locator("#wirkung");
    const cards = section.locator("a.transformation__media");
    const dialog = section.locator("dialog");
    const first = cards.first();

    await expect(cards).toHaveCount(3);
    await expect(section.locator(".transformation__disclosure")).toHaveText([
      "Konzeptvisualisierung", "Konzeptvisualisierung", "Konzeptvisualisierung"
    ]);
    await first.scrollIntoViewIfNeeded();
    await first.focus();
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Klassisch", exact: true })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Bild schließen" })).toBeFocused();
    await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
    await expect.poll(() => dialog.locator("img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("heading", { name: "High-Tech", exact: true })).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading", { name: "Klassisch", exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Nächstes Bild" }).click();
    await expect(dialog.getByRole("heading", { name: "Modern", exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Nächstes Bild" }).focus();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Bild schließen" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Nächstes Bild" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(first).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
    await expect(page.locator("html")).not.toHaveClass(/transformation-modal-open/);

    await cards.nth(1).click();
    await expect(dialog.getByRole("heading", { name: "Modern", exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Bild schließen" }).click();
    await expect(cards.nth(1)).toBeFocused();
    await cards.nth(2).click();
    await expect(dialog.getByRole("heading", { name: "High-Tech", exact: true })).toBeVisible();
    await dialog.click({ position: { x: 2, y: 2 } });
    await expect(dialog).not.toBeVisible();
    await expect(cards.nth(2)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("Wirkung dialog stays accessible with large text and a short mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await page.goto("/");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.locator("#wirkung a.transformation__media").first().click();
  const dialog = page.locator(".transformation-modal");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Bild schließen" })).toBeInViewport();
  await dialog.getByRole("button", { name: "Nächstes Bild" }).click();
  await expect(dialog.getByRole("heading", { name: "Modern", exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(await dialog.locator(".transformation-modal__surface").evaluate((surface) => surface.scrollWidth <= surface.clientWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

for (const fallback of ["JavaScript disabled", "dialog API unavailable"]) {
  test(`Wirkung image opens directly with ${fallback}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: fallback !== "JavaScript disabled" });
    const page = await context.newPage();
    if (fallback === "dialog API unavailable") {
      await page.addInitScript(() => {
        Object.defineProperty(HTMLDialogElement.prototype, "showModal", { value: undefined, configurable: true });
      });
    }
    await page.goto("/");
    const link = page.locator("#wirkung a.transformation__media").first();
    const href = await link.getAttribute("href");
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await context.close();
  });
}

test("Wirkung modified click opens the actual image in a new tab", async ({ page, context }) => {
  await page.goto("/");
  const card = page.locator("#wirkung a.transformation__media").first();
  const href = await card.getAttribute("href");
  const newPage = context.waitForEvent("page");
  await card.click({ modifiers: ["ControlOrMeta"] });
  const imagePage = await newPage;
  await expect(imagePage).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator(".transformation-modal")).not.toBeVisible();
  await imagePage.close();
});

test("Wirkung enlargement controls respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#wirkung .transformation__zoom").first()).toHaveCSS("transition-duration", "0s");
});
