import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("serves a substantive server-rendered configurator route", async ({
  page
}) => {
  const response = await page.goto("/konfigurator?utm_source=qa");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    "Leuchtvolant konfigurieren | LICHTSAUM"
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Leuchtvolant konfigurieren."
    })
  ).toBeVisible();
  await expect(
    page.getByText(/gewerbliches Projekt zusammen/i)
  ).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /vorläufigen Nettopreis/i
  );

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
    .getByRole("link", { name: "Im Konfigurator weiter" });

  await expect(teaserLink).toHaveAttribute("href", "/konfigurator");
  await expect(teaserLink).toHaveAttribute("aria-disabled", "false");
  await teaserLink.click();

  await expect(page).toHaveURL(/\/konfigurator$/);
  await expect(page.getByLabel("Beschriftung")).toHaveValue("ABENDLICHT");
  await expect(page.getByLabel("Schrift", { exact: true })).toHaveValue(
    "oswald"
  );
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
    .getByRole("link", { name: "Im Konfigurator weiter" });
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
  await expect(page.getByLabel("Beschriftung")).toHaveValue("CAFÉ LICHT");
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
    configurator.locator(".full-configurator-preview > svg")
  ).toBeVisible();

  const inscriptionInput = configurator.getByLabel("Beschriftung");
  await inscriptionInput.fill("LICHT  2026");
  await expect(configurator).toHaveAttribute(
    "data-calculation-status",
    "ready",
    { timeout: 15_000 }
  );
  const previewInscription = configurator.locator(
    ".full-configurator-preview text[data-configurator-text]"
  );
  await expect(previewInscription).toHaveText("LICHT  2026");
  await expect(previewInscription).toHaveAttribute("xml:space", "preserve");

  const initialPrice = await configurator
    .locator(".full-configurator__preview-price > strong")
    .textContent();
  const nextButton = configurator.getByRole("button", {
    name: "Weitere Optionen",
    exact: true
  });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  await expect(
    configurator.getByRole("heading", { name: "Weitere Optionen." })
  ).toBeFocused();

  const compositionDisclosure = configurator.getByRole("button", {
    name: /Komposition/
  });
  await expect(compositionDisclosure).toHaveAttribute("aria-expanded", "true");
  await compositionDisclosure.click();
  await expect(compositionDisclosure).toHaveAttribute("aria-expanded", "false");
  await compositionDisclosure.focus();
  await compositionDisclosure.press("Enter");
  await expect(compositionDisclosure).toBeFocused();
  await expect(compositionDisclosure).toHaveAttribute("aria-expanded", "true");
  await expect(
    configurator.getByRole("radio", { name: /Logo links/ })
  ).toBeVisible();

  const awningColorDisclosure = configurator.getByRole("button", {
    name: /Volantfarbe/
  });
  await awningColorDisclosure.click();
  const initialAwningColor = configurator.getByRole("radio", {
    name: "Anthrazit"
  });
  await initialAwningColor.focus();
  await initialAwningColor.press("ArrowRight");
  await expect(
    configurator.getByRole("radio", { name: "Tiefschwarz" })
  ).toBeChecked();
  await configurator.getByRole("radio", { name: "Nachtblau" }).check();
  await expect(
    configurator.locator(".configurator-preview__product > rect").first()
  ).toHaveAttribute("fill", "#263746");

  const servicesDisclosure = configurator.getByRole("button", {
    name: /Dienstleistungen/
  });
  await servicesDisclosure.click();
  const serviceCheckboxes = configurator.getByRole("checkbox");
  await expect(serviceCheckboxes).toHaveCount(6);
  await configurator.getByRole("checkbox", { name: "Gestaltung" }).check();
  await expect(
    configurator.locator(".full-configurator__preview-price > strong")
  ).toHaveText(initialPrice ?? "");

  const postalCode = configurator.getByLabel("PLZ des Objekts (optional)");
  const priceStepButton = configurator.getByRole("button", {
    name: "Preis & Projektanfrage",
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
    configurator.getByRole("heading", { name: "Preis & Projektanfrage." })
  ).toBeFocused();
  const summary = configurator.locator("#configuratorProject");
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
    .getByRole("button", { name: "Projekt prüfen lassen" })
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
      .locator(".full-configurator__calculation-message")
      .getByText(/passt nicht in die verfügbare Volantbreite/i)
  ).toBeVisible();
  await expect(
    configurator.locator(".full-configurator__preview-price > strong")
  ).toHaveText("—");
  await expect(
    configurator.getByRole("button", {
      name: "Weitere Optionen",
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
    page.getByRole("button", { name: "Weitere Optionen", exact: true })
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

test("keeps preview and controls reflowed across the required QA widths", async ({
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
      configurator.locator(".full-configurator-preview > svg")
    ).toBeVisible();

    const layout = await page.evaluate(() => {
      const preview = document.querySelector<HTMLElement>(
        ".full-configurator__preview-column"
      );
      const controls = document.querySelector<HTMLElement>(
        ".full-configurator__controls-column"
      );
      const sticky = document.querySelector<HTMLElement>(
        ".full-configurator__preview-sticky"
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
        previewBottom: previewRect?.bottom ?? -1,
        controlsLeft: controlsRect?.left ?? -1,
        controlsTop: controlsRect?.top ?? -1,
        stickyPosition: sticky ? getComputedStyle(sticky).position : ""
      };
    });

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

    if (viewport.width >= 1024) {
      expect(layout.previewLeft).toBeLessThan(layout.controlsLeft);
      expect(layout.stickyPosition).toBe("sticky");
    } else {
      expect(layout.previewBottom).toBeLessThanOrEqual(layout.controlsTop + 1);
    }
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
    .getByRole("button", { name: "Weitere Optionen", exact: true })
    .click();

  const motion = await page.evaluate(() => ({
    productAnimation: getComputedStyle(
      document.querySelector<SVGElement>(
        ".full-configurator-preview .configurator-preview__product"
      )!
    ).animationName,
    disclosureTransition: getComputedStyle(
      document.querySelector<SVGElement>(
        ".full-configurator__disclosure-trigger svg"
      )!
    ).transitionDuration
  }));

  expect(motion.productAnimation).toBe("none");
  expect(Number.parseFloat(motion.disclosureTransition)).toBeLessThanOrEqual(
    0.001
  );

  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await page
    .getByRole("button", { name: "Preis & Projektanfrage", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Preis & Projektanfrage." })
  ).toBeVisible();

  const reflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    )
  }));

  expect(reflow.scrollWidth).toBeLessThanOrEqual(reflow.viewport + 1);
  await expect(page.locator("#configuratorProject")).toBeVisible();
  await expect(page.locator("form.lead-form")).toBeVisible();
});
