import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`mini inquiry preserves drafts, focus and files at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const reject = page.getByRole("button", { name: "Nur notwendige" });
    if (await reject.isVisible()) await reject.click();
    await expect(page.getByRole("link", { name: "Optionen wählen & Preis berechnen →" })).toHaveAttribute("aria-disabled", "false");
    const text = page.getByLabel("Text auf dem Volant");
    await text.fill("MEIN ENTWURF");
    await page.getByLabel("Volantbreite").fill("");
    const trigger = page.getByRole("button", { name: "Entwurf anfragen", exact: true });
    await trigger.click();
    const dialog = page.locator("dialog.inquiry-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toBeFocused();
    await expect(dialog.getByText("MEIN ENTWURF", { exact: true }).first()).toBeVisible();
    await dialog.getByText("Details anzeigen", { exact: true }).click();
    await expect(dialog.getByText("Noch nicht angegeben", { exact: true }).first()).toBeVisible();
    await dialog.getByLabel(/E-Mail-Adresse/).fill("draft@example.test");
    await dialog.locator('input[type="file"]').setInputFiles({ name: "skizze.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
    await trigger.click();
    await expect(dialog.getByLabel(/E-Mail-Adresse/)).toHaveValue("draft@example.test");
    await expect(dialog.getByText("skizze.pdf", { exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Ändern", exact: true }).click();
    await expect(text).toBeFocused();
    await text.fill("NEUER ENTWURF");
    await trigger.click();
    await expect(dialog.getByText("NEUER ENTWURF", { exact: true }).first()).toBeVisible();
    await expect(dialog.getByLabel(/E-Mail-Adresse/)).toHaveValue("draft@example.test");
    await expect(dialog.getByText("skizze.pdf", { exact: true })).toBeVisible();
    const geometry = await dialog.evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth, height: element.getBoundingClientRect().height }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1);
    expect(geometry.height).toBeLessThanOrEqual(900);
    if (width >= 1024) {
      await page.mouse.click(5, 5);
      await expect(dialog).toBeVisible();
    }
    const ids = await page.locator("[id]").evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(await page.locator("form form").count()).toBe(0);
    const audit = await new AxeBuilder({ page }).include("dialog[open]").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(audit.violations).toEqual([]);
    await dialog.getByRole("button", { name: "Ohne beigefügte Angaben anfragen" }).click();
    await expect(dialog.getByText(/ohne Entwurf oder Konfiguration/)).toBeVisible();
    await dialog.getByRole("button", { name: "Anfrage schließen" }).click();
    const plain = page.locator("#projekt-pruefen form.lead-form");
    await expect(plain.getByLabel(/E-Mail-Adresse/)).toHaveValue("");
    const storage = await page.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]));
    expect(storage).not.toContain("draft@example.test");
    expect(storage).not.toContain("skizze.pdf");
  });
}

test("reflows a dialog at 200% text size and a shortened keyboard viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Entwurf anfragen", exact: true }).click();
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.setViewportSize({ width: 390, height: 400 });
  const dialog = page.locator("dialog[open]");
  await dialog.getByLabel(/E-Mail-Adresse/).fill("keyboard@example.test");
  await dialog.getByRole("button", { name: "Anfrage senden", exact: true }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("button", { name: "Anfrage senden", exact: true })).toBeInViewport();
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
});

test("measures real transitions and inquiry actions without configuration data", async ({ page, context }) => {
  const { CONSENT_COOKIE_NAME, createConsentRecord } = await import("../../src/features/consent/consent-storage");
  await context.addCookies([{ name: CONSENT_COOKIE_NAME, value: encodeURIComponent(JSON.stringify(createConsentRecord({ analytics: true, marketing: false }))), url: "http://127.0.0.1:3000" }]);
  await page.goto("/konfigurator");
  const configurator = page.locator(".full-configurator");
  await expect(configurator).toHaveAttribute("data-calculation-status", "ready");
  await page.getByLabel("Text auf dem Volant").fill("TEST ENTWURF");
  await expect(configurator).toHaveAttribute("data-calculation-status", "ready");
  await page.getByRole("button", { name: "Weitere Optionen", exact: true }).click();
  await page.getByRole("checkbox", { name: "Gestaltung", exact: true }).check();
  await page.getByRole("button", { name: "Preis & Projektanfrage", exact: true }).click();
  await page.getByRole("button", { name: "Konfiguration anfragen", exact: true }).click();
  const dialog = page.locator("dialog[open]");
  await dialog.getByLabel(/E-Mail-Adresse/).fill("analytics@example.test");
  await dialog.getByLabel(/Telefonnummer/).fill("+49 30 123456");
  await dialog.getByRole("button", { name: "Anfrage schließen" }).click();
  await page.getByRole("button", { name: "Konfiguration anfragen", exact: true }).click();
  const events = await page.evaluate(() => ((window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((entry) => typeof entry.event === "string" && /^(configurator_|lead_form_)/.test(entry.event)));
  expect(events).toEqual([
    { event: "configurator_step_view", configurator_type: "full", step: 1 },
    { event: "configurator_start", configurator_type: "full" },
    { event: "configurator_step_view", configurator_type: "full", step: 2 },
    { event: "configurator_step_view", configurator_type: "full", step: 3 },
    { event: "configurator_result_view", configurator_type: "full", step: 3 },
    { event: "lead_form_open", form_id: "full_configurator_inquiry", form_location: "full_configurator" },
    { event: "lead_form_start", form_id: "full_configurator_inquiry", form_location: "full_configurator" },
    { event: "lead_form_open", form_id: "full_configurator_inquiry", form_location: "full_configurator" }
  ]);
});

test("does not replay mini start or form start after late Analytics consent", async ({ page, context }) => {
  const { CONSENT_COOKIE_NAME, createConsentRecord } = await import("../../src/features/consent/consent-storage");
  const cookie = (analytics: boolean) => ({ name: CONSENT_COOKIE_NAME, value: encodeURIComponent(JSON.stringify(createConsentRecord({ analytics, marketing: false }))), url: "http://127.0.0.1:3000" });
  await context.addCookies([cookie(false)]);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Optionen wählen & Preis berechnen →" })).toHaveAttribute("aria-disabled", "false");
  await page.getByLabel("Text auf dem Volant").fill("ERSTER ENTWURF");
  await page.getByRole("button", { name: "Entwurf anfragen", exact: true }).click();
  await page.locator("dialog[open]").getByLabel(/E-Mail-Adresse/).fill("private@example.test");
  await page.getByRole("button", { name: "Anfrage schließen" }).click();
  await context.addCookies([cookie(true)]);
  await page.getByLabel("Text auf dem Volant").fill("ZWEITER ENTWURF");
  await page.getByRole("button", { name: "Entwurf anfragen", exact: true }).click();
  await page.locator("dialog[open]").getByLabel(/Telefonnummer/).fill("+49 30 123456");
  const events = await page.evaluate(() => ((window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter((entry) => typeof entry.event === "string" && /^(configurator_|lead_form_)/.test(entry.event)));
  expect(events).toEqual([{ event: "lead_form_open", form_id: "mini_configurator_inquiry", form_location: "mini_configurator" }]);
});
