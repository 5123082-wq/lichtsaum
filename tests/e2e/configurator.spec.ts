import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("serves a substantive server-rendered configurator route", async ({
  page,
  request
}) => {
  const serverResponse = await request.get("/konfigurator?utm_source=qa");
  const serverHtml = await serverResponse.text();

  expect(serverResponse.status()).toBe(200);
  expect(serverHtml).toContain("Was der Konfigurator berechnet");
  expect(serverHtml).toContain(
    "Was der vorläufige Nettopreis nicht umfasst"
  );
  expect(serverHtml).toContain("Warum der Projekt-Check folgt");
  expect(serverHtml).toContain('href="/#eignung"');
  expect(serverHtml).toContain('href="/referenzen"');

  const response = await page.goto("/konfigurator?utm_source=qa");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    "Leuchtvolant konfigurieren: vorläufiger Preis | LICHTSAUM"
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Leuchtvolant konfigurieren"
    })
  ).toBeVisible();
  await expect(page.locator(".configurator-intro__image")).toHaveAttribute(
    "src",
    "/images/lichtsaum-konfigurator-header-technical.png"
  );
  await expect(page.locator(".configurator-intro__image")).toHaveAttribute(
    "alt",
    "Dunkle technische Konzeptzeichnung einer Markise mit Maßangaben für Volanthöhe und Volantlänge."
  );
  await expect(page.getByText(/gewerbliches Projekt zusammen/i)).toHaveCount(
    0
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Leuchtvolant für eine bestehende Gewerbemarkise konfigurieren, vorläufigen Nettopreis erhalten und das konkrete Projekt anschließend prüfen lassen."
  );
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Was der Konfigurator berechnet"
    })
  ).toBeVisible();
  await expect(
    page.locator(".full-configurator + .configurator-page__technical")
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Eignung bestehender Gewerbemarkisen einordnen"
    })
  ).toHaveAttribute("href", "/#eignung");
  await expect(
    page.getByRole("link", { name: "Beispiele für Leuchtvolants ansehen" })
  ).toHaveAttribute("href", "/referenzen");

  // Local development follows the central environment policy and adds no
  // deployment canonical. The route metadata supplies /konfigurator once the
  // production indexing gate is open.
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);

  const html = await page.content();
  expect(html).not.toMatch(/"@type"\s*:\s*"(?:Product|Offer)"/);
});

test("migrates the homepage teaser and opens the clean configurator URL", async ({
  page
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.sessionStorage.setItem(
      "lichtsaum:mini-configurator:v2",
      JSON.stringify({
        version: 2,
        configuration: {
          compositionMode: "logo-both",
          text: "ABENDLICHT",
          fontId: "oswald",
          valanceWidthMm: 2600,
          valanceHeightMm: 300,
          letterHeightMm: 140,
          awningColorId: "sand",
          lightColorId: "neutral-white",
          previewMode: "night"
        }
      })
    );
    window.sessionStorage.setItem(
      "lichtsaum:configurator:v1",
      JSON.stringify({
        version: 1,
        configuration: {
          schemaVersion: 1,
          compositionMode: "text-only",
          text: "VERALTET",
          fontId: "montserrat",
          valanceWidthMm: 3000,
          valanceHeightMm: 300,
          letterHeightMm: 120,
          awningColorId: "anthracite",
          lightColorId: "warm-white"
        },
        services: ["design"]
      })
    );
  });
  await page.reload();

  const teaserLink = page
    .locator("#konfigurator")
    .getByRole("link", { name: "Preis berechnen" });

  await expect(teaserLink).toHaveAttribute("href", "/konfigurator");
  await expect(teaserLink).toHaveAttribute("aria-disabled", "false");
  await teaserLink.click();

  await expect(page).toHaveURL(/\/konfigurator$/);
  await expect(page.getByLabel("Text auf dem Volant")).toHaveValue(
    "ABENDLICHT"
  );
  await expect(page.getByRole("button", { name: /Schriftstil: Oswald/ })).toBeVisible();
  await expect(page.getByLabel("Volantbreite")).toHaveValue("2600");

  await expect(page.locator(".full-configurator")).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );

  const migratedState = await page.evaluate(() =>
    JSON.parse(
      window.sessionStorage.getItem("lichtsaum:configurator:v1") ?? "null"
    )
  );

  expect(migratedState).toMatchObject({
    version: 1,
    services: [],
    configuration: {
      schemaVersion: 1,
      compositionMode: "logo-both",
      text: "ABENDLICHT",
      fontId: "oswald",
      valanceWidthMm: 2600,
      valanceHeightMm: 300,
      letterHeightMm: 140,
      awningColorId: "sand",
      lightColorId: "neutral-white"
    }
  });
});

test("offers an explicit defaults path when teaser storage cannot be written", async ({
  page
}) => {
  await page.goto("/");

  const teaserLink = page
    .locator("#konfigurator")
    .getByRole("link", { name: "Preis berechnen" });
  await expect(teaserLink).toHaveAttribute("aria-disabled", "false", {
    timeout: 15_000
  });

  await page.evaluate(() => {
    window.sessionStorage.setItem(
      "lichtsaum:configurator:v1",
      JSON.stringify({ version: 1, configuration: { text: "VERALTET" } })
    );

    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "lichtsaum:mini-configurator:v2") {
        throw new DOMException("Storage is unavailable", "QuotaExceededError");
      }

      return nativeSetItem.call(this, key, value);
    };
  });

  await teaserLink.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByText(/Konfiguration konnte nicht übertragen werden/i)
  ).toBeVisible();
  const defaultContinuation = page.getByRole("link", {
    name: "Konfigurator mit Standardwerten öffnen"
  });
  await expect(defaultContinuation).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.sessionStorage.getItem("lichtsaum:configurator:v1")
      )
    )
    .toBeNull();

  await defaultContinuation.click();
  await expect(page).toHaveURL(/\/konfigurator$/);
  await expect(page.getByLabel("Text auf dem Volant")).toHaveValue(
    "CAFÉ LICHT"
  );
});

test("supports the three keyboard-accessible steps and one shared inquiry form", async ({
  page
}) => {
  await page.goto("/konfigurator");

  const configurator = page.locator(".full-configurator");
  await expect(configurator).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  await expect(
    configurator.locator(".full-configurator-preview:visible > svg")
  ).toBeVisible();

  const inscriptionInput = configurator.getByLabel("Text auf dem Volant");
  await inscriptionInput.fill("LICHT  2026");
  await expect(configurator).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  const previewInscription = configurator.locator(
    ".full-configurator-preview:visible text[data-configurator-text]"
  );
  await expect(previewInscription).toHaveText("LICHT  2026");
  await expect(previewInscription).toHaveAttribute("xml:space", "preserve");

  await expect(configurator.locator(".full-configurator__summary:not(dialog *)")).toHaveCount(0);
  await expect(
    configurator.getByText("Vorläufiger Nettopreis", { exact: true }).filter({ visible: true })
  ).toHaveCount(0);
  await expect(configurator.getByRole("group", { name: "Gestaltung", exact: true })).toBeVisible();
  await expect(configurator.getByRole("group", { name: "Maße", exact: true })).toBeVisible();
  await expect(configurator.getByRole("group", { name: "Farbe & Licht", exact: true })).toBeVisible();

  const fullCompositionTrigger = configurator.getByRole("button", {
    name: /Komposition:/
  });
  const fullCompositionListbox = configurator.getByRole("listbox", {
    name: "Komposition auswählen"
  });
  await fullCompositionTrigger.click();
  await expect(fullCompositionListbox).toBeVisible();
  await fullCompositionTrigger.click();
  await expect(fullCompositionListbox).toBeHidden();
  await fullCompositionTrigger.click();
  await fullCompositionListbox
    .getByRole("option", { name: /Logo links/ })
    .click();
  await expect(
    configurator.getByText("Komposition wird geprüft …", { exact: true })
  ).toHaveCount(0);
  await expect(configurator.locator(".full-configurator-preview:visible")).toBeVisible();

  const fullAwningColorTrigger = configurator.getByRole("button", {
    name: /Markisenfarbe:/
  });
  const fullAwningColorListbox = configurator.getByRole("listbox", {
    name: "Markisenfarbe auswählen"
  });
  await fullAwningColorTrigger.click();
  await fullAwningColorListbox
    .getByRole("option", { name: "Nachtblau" })
    .click();
  await expect(
    configurator.locator(".configurator-preview__product > rect").first()
  ).toHaveAttribute("fill", "#27283C");

  const basePanelHeight = await configurator.locator('.full-configurator__panel[data-active="true"]').evaluate((element) => element.getBoundingClientRect().height);
  const nextButton = configurator.getByRole("button", {
    name: "Schritt 2 von 3: Weitere Optionen",
    exact: true
  });
  await expect(nextButton).toBeEnabled();
  await nextButton.focus();
  await page.keyboard.press("Enter");

  await expect(
    configurator.getByRole("heading", { name: "Weitere Optionen" })
  ).toBeFocused();

  const optionsPanelHeight = await configurator.locator('.full-configurator__panel[data-active="true"]').evaluate((element) => element.getBoundingClientRect().height);
  expect(optionsPanelHeight).toBeCloseTo(basePanelHeight, 0);

  const serviceCheckboxes = configurator.getByRole("checkbox");
  await expect(serviceCheckboxes).toHaveCount(6);
  await expect(configurator.locator(".full-configurator__disclosure")).toHaveCount(
    0
  );
  await configurator.getByRole("checkbox", { name: "Gestaltung" }).check();
  await expect(
    configurator.getByText("Vorläufiger Nettopreis", { exact: true }).filter({ visible: true })
  ).toHaveCount(0);

  const postalCode = configurator.getByLabel("PLZ des Objekts (optional)");
  const priceStepButton = configurator.getByRole("button", {
    name: "Schritt 3 von 3: Preis & Projektanfrage",
    exact: true
  });
  await postalCode.fill("1234");
  await expect(postalCode).toHaveAttribute("aria-invalid", "true");
  await expect(priceStepButton).toBeDisabled();
  await postalCode.fill("12345");
  await expect(postalCode).toHaveAttribute("aria-invalid", "false");
  await expect(priceStepButton).toBeEnabled();
  await priceStepButton.click();

  await expect(
    configurator.getByRole("heading", { name: "Preis & Projektanfrage" })
  ).toBeFocused();
  const summary = configurator.locator(".full-configurator__summary:not(dialog *)");
  await expect(summary).toBeVisible();
  await expect(summary.getByText("12345", { exact: true })).toBeVisible();
  await expect(summary.getByText("Gestaltung", { exact: true })).toBeVisible();
  await expect(summary.getByText(/× (600|1000|1200) mm/)).toBeVisible();
  await expect(summary.getByText("Vorläufiger Nettopreis")).toBeVisible();
  await expect(
    summary.getByText("zzgl. gesetzlicher Umsatzsteuer")
  ).toBeVisible();
  await expect(
    summary.getByText("Das Ergebnis ist kein verbindliches Angebot.")
  ).toBeVisible();

  await expect(configurator.locator("form.lead-form")).toHaveCount(1);
  await configurator.getByRole("button", { name: "Konfiguration anfragen", exact: true }).click();
  const leadForm = configurator.locator("form.lead-form");
  await expect(
    leadForm.getByLabel("E-Mail-Adresse (Pflichtfeld)")
  ).toBeVisible();

  const stepThreeAudit = await new AxeBuilder({ page })
    .include(".full-configurator")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(stepThreeAudit.violations).toEqual([]);

  await leadForm
    .getByLabel("E-Mail-Adresse (Pflichtfeld)")
    .fill("projekt@example.com");
  await leadForm
    .getByRole("button", { name: "Anfrage senden" })
    .click();
  await expect(
    leadForm.getByText(/wurden nicht gespeichert und nicht als Projektanfrage/i)
  ).toBeVisible();
});

test("blocks preview, price and continuation for an impossible composition", async ({
  page
}) => {
  await page.goto("/konfigurator");
  const configurator = page.locator(".full-configurator");

  await expect(configurator).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  await page.getByLabel("Volantbreite").fill("100");

  await expect(configurator).toHaveAttribute(
    "data-calculation-status",
    "invalid",
    { timeout: 15_000 }
  );
  await expect(
    configurator
      .getByRole("status")
      .getByText(/passt nicht in die verfügbare Volantbreite/i)
  ).toBeVisible();
  await expect(configurator.locator(".full-configurator__summary:not(dialog *)")).toHaveCount(0);
  await expect(
    configurator.getByText("Vorläufiger Nettopreis", { exact: true }).filter({ visible: true })
  ).toHaveCount(0);
  await expect(
    configurator.getByRole("button", {
      name: "Schritt 2 von 3: Weitere Optionen",
      exact: true
    })
  ).toBeDisabled();
});

test("has no detectable A/AA violations or horizontal overflow at 320px", async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/konfigurator");
  await expect(page.locator(".full-configurator")).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  await expect(
    page.getByRole("button", { name: "Schritt 2 von 3: Weitere Optionen", exact: true })
  ).toBeEnabled();
  await page.waitForTimeout(250);

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));

  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);

  const results = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const violationSummary = results.violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.nodes.length} node(s)`
    )
    .join("\n");

  expect(results.violations, violationSummary).toEqual([]);
});

test("keeps the full-width preview before the controls at the required QA widths", async ({
  page
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/konfigurator");
    const configurator = page.locator(".full-configurator");

    await expect(configurator).toHaveAttribute(
      "data-calculation-status",
      "ready",
      { timeout: 15_000 }
    );
    await expect(
      configurator.locator(".full-configurator-preview:visible > svg")
    ).toBeVisible();

    const layout = await page.evaluate(() => {
      const preview = document.querySelector<HTMLElement>(
        ".full-configurator__preview-stage"
      );
      const controls = document.querySelector<HTMLElement>(
        ".full-configurator__controls-column"
      );
      const previewRect = preview?.getBoundingClientRect();
      const controlsRect = controls?.getBoundingClientRect();

      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ),
        previewLeft: previewRect?.left ?? -1,
        previewRight: previewRect?.right ?? -1,
        previewBottom: previewRect?.bottom ?? -1,
        controlsLeft: controlsRect?.left ?? -1,
        controlsRight: controlsRect?.right ?? -1,
        controlsTop: controlsRect?.top ?? -1
      };
    });

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(Math.abs(layout.previewLeft - layout.controlsLeft)).toBeLessThanOrEqual(
      1
    );
    expect(
      Math.abs(layout.previewRight - layout.controlsRight)
    ).toBeLessThanOrEqual(1);
    expect(layout.previewBottom).toBeLessThanOrEqual(layout.controlsTop + 1);
  }
});

test("honors reduced motion and remains usable with enlarged text", async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/konfigurator");
  await expect(page.locator(".full-configurator")).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  await page
    .getByRole("button", { name: "Schritt 2 von 3: Weitere Optionen", exact: true })
    .click();

  const motion = await page.evaluate(() => ({
    productAnimation: getComputedStyle(
      document.querySelector<SVGElement>(
        ".full-configurator-preview .configurator-preview__product"
      )!
    ).animationName
  }));

  expect(motion.productAnimation).toBe("none");

  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await page
    .getByRole("button", { name: "Schritt 3 von 3: Preis & Projektanfrage", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Preis & Projektanfrage" })
  ).toBeVisible();

  const reflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    )
  }));

  expect(reflow.scrollWidth).toBeLessThanOrEqual(reflow.viewport + 1);
  await expect(page.locator(".full-configurator__summary:not(dialog *)")).toBeVisible();
  await page.getByRole("button", { name: "Konfiguration anfragen", exact: true }).click();
  await expect(page.locator("form.lead-form")).toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`panel deck keeps usable controls and visible progression at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/konfigurator");
    const configurator = page.locator(".full-configurator");
    await expect(configurator).toHaveAttribute("data-calculation-status", "ready");
    const tabs = configurator.locator(".full-configurator__panel-tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute("aria-current", "step");
    await expect(tabs.nth(1)).toBeEnabled();
    await expect(tabs.nth(2)).toBeDisabled();
    await expect(configurator.locator("#configurator-panel-1 .full-configurator__step-actions")).toHaveCount(0);
    await expect(configurator.locator('.full-configurator__panel[data-next="true"]')).toHaveCount(1);
    await expect(tabs.nth(1)).toHaveCSS("color", "rgb(255, 92, 0)");

    await configurator.evaluate((element) => {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 85, behavior: "instant" });
    });
    const layout = await configurator.evaluate((element) => {
      const deck = element.querySelector(".full-configurator__deck")!.getBoundingClientRect();
      const preview = element.querySelector(".full-configurator-preview")!.getBoundingClientRect();
      const panels = [...element.querySelectorAll(".full-configurator__panel")].map((panel) => {
        const bounds = panel.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width };
      });
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        deckBottom: deck.bottom,
        previewTop: preview.top,
        panels
      };
    });
    expect(layout.overflow).toBe(false);
    if (width >= 1024) {
      expect(layout.panels[0].right).toBeLessThanOrEqual(layout.panels[1].left);
      expect(layout.panels[1].width).toBeGreaterThanOrEqual(44);
      expect(layout.panels[2].width).toBeGreaterThanOrEqual(44);
      expect(layout.panels[1].width).toBeCloseTo(56 * 1.1, 1);
      expect(layout.panels[2].width).toBeCloseTo(56 * 0.9, 1);
    } else {
      expect(layout.panels[0].bottom).toBeLessThanOrEqual(layout.panels[1].top);
      expect(layout.panels[0].width).toBeGreaterThan(width * 0.85);
    }
    if (width >= 1440) {
      expect(layout.previewTop).toBeGreaterThanOrEqual(85);
      expect(layout.deckBottom).toBeLessThanOrEqual(900);
    }
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: testInfo.outputPath(`deck-${width}.png`), fullPage: width === 390, animations: "disabled" });
    }

    await page.getByLabel("Text auf dem Volant").fill("");
    await expect(tabs.nth(1)).toBeDisabled();
    await expect(configurator.locator('.full-configurator__panel[data-next="true"]')).toHaveCount(0);
    await page.getByLabel("Text auf dem Volant").fill("CAFE TEST");
    await expect(tabs.nth(1)).toBeEnabled();
    await tabs.nth(1).click();
    await expect(configurator).toHaveAttribute("data-active-step", "2");
    await expect(configurator.locator("#configurator-panel-2 .full-configurator__step-actions")).toHaveCount(0);
    await expect(configurator.locator("#configurator-panel-2 button")).toHaveCount(0);
    if (width >= 1024) {
      const nextPanel = await tabs.nth(2).boundingBox();
      expect(nextPanel!.width).toBeCloseTo(56 * 1.1 - 2, 1);
      const activePanel = await configurator.locator('.full-configurator__panel[data-active="true"]').boundingBox();
      expect(activePanel!.height).toBeCloseTo(layout.panels[0].bottom - layout.panels[0].top, 0);
      const serviceCell = await configurator.locator(".full-configurator__service-grid label").first().boundingBox();
      const postalInput = await page.getByLabel("PLZ des Objekts (optional)").boundingBox();
      expect(postalInput!.y).toBeCloseTo(serviceCell!.y, 0);
      expect(postalInput!.height).toBeCloseTo(serviceCell!.height, 0);
      expect(postalInput!.width).toBeCloseTo(serviceCell!.width, 0);
    }
    if (width >= 1440) {
      const deck = await configurator.locator(".full-configurator__deck").boundingBox();
      expect(deck!.y + deck!.height).toBeLessThanOrEqual(900);
    }
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: testInfo.outputPath(`deck-options-${width}.png`), fullPage: width === 390, animations: "disabled" });
    }
    await page.getByRole("checkbox", { name: "Gestaltung", exact: true }).check();
    await page.getByLabel("PLZ des Objekts (optional)").fill("1234");
    await expect(tabs.nth(2)).toBeDisabled();
    await tabs.nth(0).click();
    await expect(tabs.nth(1)).toBeEnabled();
    await tabs.nth(1).click();
    await expect(page.getByLabel("PLZ des Objekts (optional)")).toHaveValue("1234");
    await expect(tabs.nth(2)).toBeDisabled();
    await page.getByLabel("PLZ des Objekts (optional)").fill("12345");
    await expect(tabs.nth(2)).toBeEnabled();
    await tabs.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#configurator-inquiry-title")).toBeFocused();
    expect(await page.locator('.full-configurator__panel[data-active="true"]').evaluate((element) => element.getAnimations().filter((animation) => {
      const effect = animation.effect as KeyframeEffect | null;
      return effect?.target === element && effect.getKeyframes().some((frame) => frame.transform && frame.transform !== "none");
    }).length)).toBe(0);
    await expect(configurator).toHaveAttribute("data-active-step", "3");
    await expect(configurator.locator(".full-configurator__summary:not(dialog *)")).toBeVisible();
    await tabs.nth(0).click();
    await expect(tabs.nth(2)).toBeDisabled();
    await expect(page.getByLabel("Text auf dem Volant")).toHaveValue("CAFE TEST");
    await tabs.nth(1).click();
    await expect(page.getByRole("checkbox", { name: "Gestaltung", exact: true })).toBeChecked();
    await expect(page.getByLabel("PLZ des Objekts (optional)")).toHaveValue("12345");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("panel deck respects reduced motion and exposes an accessible active sheet", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/konfigurator");
  const configurator = page.locator(".full-configurator");
  const next = configurator.getByRole("button", { name: "Schritt 2 von 3: Weitere Optionen" });
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.locator("#configurator-step-2-title")).toBeFocused();
  expect(await page.locator('.full-configurator__panel[data-active="true"]').evaluate((element) => element.getAnimations().filter((animation) => {
      const effect = animation.effect as KeyframeEffect | null;
      return effect?.target === element && effect.getKeyframes().some((frame) => frame.transform && frame.transform !== "none");
    }).length)).toBe(0);
  const audit = await new AxeBuilder({ page }).include(".full-configurator")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});
