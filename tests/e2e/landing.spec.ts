import { expect, test, type Locator, type Page } from "@playwright/test";

const formSubmitLabel = "Projekt prüfen lassen";

const navigationItems = [
  { label: "Produkt", href: "/#wirkung" },
  { label: "Konfigurator", href: "/konfigurator" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Kontakt", href: "/kontakt" }
] as const;

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

const tinyPdf = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
  "utf8"
);

async function fillRequiredControls(form: Locator) {
  const controls = form.locator(
    "input[required], select[required], textarea[required]"
  );

  for (let index = 0; index < (await controls.count()); index += 1) {
    const control = controls.nth(index);

    if (!(await control.isVisible()) || !(await control.isEnabled())) {
      continue;
    }

    const tagName = await control.evaluate((element) =>
      element.tagName.toLowerCase()
    );

    if (tagName === "select") {
      const selectedValue = await control.inputValue();

      if (!selectedValue) {
        const firstAvailableValue = await control
          .locator("option")
          .evaluateAll((options) => {
            const option = options.find(
              (candidate) =>
                candidate instanceof HTMLOptionElement &&
                !candidate.disabled &&
                candidate.value !== ""
            );

            return option instanceof HTMLOptionElement ? option.value : null;
          });

        expect(firstAvailableValue).not.toBeNull();
        await control.selectOption(firstAvailableValue ?? "");
      }

      continue;
    }

    if (tagName === "textarea") {
      if (!(await control.inputValue()).trim()) {
        await control.fill(
          "Bitte prüfen Sie die vorhandene Markise anhand der beigefügten Angaben."
        );
      }

      continue;
    }

    const inputType = (await control.getAttribute("type")) ?? "text";

    if (inputType === "radio") {
      const groupName = await control.getAttribute("name");
      const checkedInGroup = groupName
        ? form.locator(
            `input[type="radio"][name="${groupName}"]:checked`
          )
        : form.locator('input[type="radio"]:checked');

      if ((await checkedInGroup.count()) === 0) {
        await control.check();
      }

      continue;
    }

    if (inputType === "checkbox") {
      await control.check();
      continue;
    }

    if (inputType === "file") {
      await control.setInputFiles({
        name: "bestehende-markise.png",
        mimeType: "image/png",
        buffer: tinyPng
      });
      continue;
    }

    if ((await control.inputValue()).trim()) {
      continue;
    }

    const valueByType: Record<string, string> = {
      email: "projekt@example.test",
      number: "300",
      tel: "030 12345678",
      text: "Café Muster"
    };

    await control.fill(valueByType[inputType] ?? "Projektangabe");
  }
}

async function generateLeadEvents(page: Page) {
  return page.evaluate(() => {
    const dataLayer = (
      window as Window & {
        dataLayer?: Array<Record<string, unknown>>;
      }
    ).dataLayer;

    return Array.isArray(dataLayer)
      ? dataLayer.filter((entry) => entry.event === "generate_lead")
      : [];
  });
}

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
});

test("illuminates the footer wordmark on entry and keeps only legal links", async ({
  page
}) => {
  const wordmark = page.locator(".site-footer__brand");
  const footer = page.getByRole("contentinfo");

  await expect(wordmark).toHaveAttribute("data-illuminated", "false");
  await wordmark.scrollIntoViewIfNeeded();
  await expect(wordmark).toHaveAttribute("data-illuminated", "true");
  const transitionDelay = await wordmark.evaluate((element) =>
    getComputedStyle(element, "::after").transitionDelay
  );
  expect(transitionDelay).toBe("1.5s");

  await expect(
    footer.getByRole("navigation", { name: "Rechtliche Informationen" })
  ).toBeVisible();
  await expect(footer.getByRole("link", { name: "Impressum" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Datenschutz" })).toBeVisible();
  await expect(footer.getByRole("link")).toHaveCount(2);
});

test("renders only the selected hero statement in one H1", async ({
  page,
  request
}) => {
  const h1 = page.getByRole("heading", { level: 1 });

  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Markise wird Markenlicht");
  await expect(page.locator(".hero").getByRole("link")).toHaveCount(0);

  const serverResponse = await request.get("/");
  const serverHtml = await serverResponse.text();

  expect(serverResponse.status()).toBe(200);
  expect(serverHtml).not.toContain(
    "Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen."
  );
  expect(serverHtml).toContain("Markise wird");
  expect(serverHtml).toContain("Markenlicht</span>");
});

test("transitions the hero from day to night and respects reduced motion", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const media = page.locator("[data-parallax-media]");
  const dayImage = page.locator(".hero__image--day");
  const nightImage = page.locator("[data-hero-night]");
  const hero = page.locator(".hero");
  const heroContent = page.locator(".hero__content");
  const heroTitle = page.locator(".hero__title");
  const stage = page.locator(".hero__stage");
  const signalStrip = page.locator(".signal-strip");

  await expect(media).toHaveCount(1);
  await expect(nightImage).toHaveCount(1);
  await expect(stage).toHaveCSS("position", "sticky");
  expect(await hero.evaluate((element) => element.clientHeight)).toBeGreaterThan(
    900
  );
  await expect(nightImage).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));

  await expect
    .poll(() =>
      media.evaluate((element) => {
        const transform = getComputedStyle(element).transform;
        const matrix = new DOMMatrixReadOnly(transform);

        return matrix.m42;
      })
    )
    .toBeGreaterThan(25);

  await expect
    .poll(() =>
      nightImage.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).opacity)
      )
    )
    .toBeGreaterThan(0.3);

  await page.evaluate(() => window.scrollTo({ top: 520, behavior: "instant" }));

  await expect
    .poll(() =>
      nightImage.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).opacity)
      )
    )
    .toBeGreaterThan(0.9);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(stage).toHaveCSS("position", "sticky");
  await expect(heroContent).toHaveCSS("transform", "none");
  await expect
    .poll(() =>
      media.evaluate((element) => (element as HTMLElement).style.transform)
    )
    .not.toBe("");
  const mobileScrollTravel =
    (await hero.evaluate((element) => element.clientHeight)) - 844;

  expect(mobileScrollTravel).toBeGreaterThan(650);
  expect(mobileScrollTravel).toBeLessThan(700);
  await expect(nightImage).toHaveCSS("opacity", "0");
  const mobileImageBounds = await dayImage.boundingBox();

  expect(mobileImageBounds?.height).toBeGreaterThan(530);
  expect(mobileImageBounds?.height).toBeLessThan(550);
  expect(
    (mobileImageBounds?.y ?? 0) + (mobileImageBounds?.height ?? 0) * 0.66
  ).toBeGreaterThan(410);
  expect(
    (mobileImageBounds?.y ?? 0) + (mobileImageBounds?.height ?? 0) * 0.66
  ).toBeLessThan(440);
  await expect
    .poll(() => signalStrip.evaluate((element) => element.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(840);
  await expect
    .poll(async () => {
      const [signalBounds, titleBounds] = await Promise.all([
        signalStrip.boundingBox(),
        heroTitle.boundingBox()
      ]);

      if (!signalBounds || !titleBounds) {
        return 0;
      }

      return signalBounds.y - (titleBounds.y + titleBounds.height);
    })
    .toBeGreaterThanOrEqual(48);

  const mobileHeroTop = await hero.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY
  );

  await page.evaluate(
    (scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }),
    mobileHeroTop + mobileScrollTravel * 0.5
  );

  await expect
    .poll(() =>
      media.evaluate((element) => {
        const transform = getComputedStyle(element).transform;
        const matrix = new DOMMatrixReadOnly(transform);

        return matrix.m42;
      })
    )
    .toBeGreaterThan(40);
  await expect
    .poll(() =>
      nightImage.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).opacity)
      )
    )
    .toBeGreaterThan(0.9);
  await expect
    .poll(() => signalStrip.evaluate((element) => element.getBoundingClientRect().top))
    .toBeGreaterThan(500);
  await expect
    .poll(() => signalStrip.evaluate((element) => element.getBoundingClientRect().top))
    .toBeLessThan(520);
  await expect(heroContent).toHaveCSS("transform", "none");

  await page.evaluate(
    (scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }),
    mobileHeroTop + mobileScrollTravel
  );
  await expect
    .poll(async () => {
      const [signalTop, imageTop] = await Promise.all([
        signalStrip.evaluate((element) => element.getBoundingClientRect().top),
        dayImage.evaluate((element) => element.getBoundingClientRect().top)
      ]);

      return signalTop - imageTop;
    })
    .toBeLessThanOrEqual(0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  await expect
    .poll(() =>
      media.evaluate((element) => getComputedStyle(element).transform)
    )
    .toBe("none");
  await expect(nightImage).toHaveCSS("opacity", "0");
  await expect(stage).toHaveCSS("position", "relative");
});

test("keeps the LICHTSAUM lettering centered across hero breakpoints", async ({
  page
}) => {
  const image = page.locator(".hero__image--day");
  const focalPoint = 0.364;

  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 }
  ]) {
    await page.setViewportSize(viewport);

    await expect
      .poll(async () => {
        const bounds = await image.boundingBox();

        if (!bounds) {
          return Number.POSITIVE_INFINITY;
        }

        const letteringCenter = bounds.x + bounds.width * focalPoint;

        return Math.abs(letteringCenter - viewport.width / 2);
      })
      .toBeLessThan(2);
  }
});

test("keeps the mobile hero title above its boundary in a compact Safari viewport", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/");

  const hero = page.locator(".hero");
  const stage = page.locator(".hero__stage");
  const content = page.locator(".hero__content");
  const title = page.locator(".hero__title");
  const signalStrip = page.locator(".signal-strip");

  expect(await stage.evaluate((element) => element.clientHeight)).toBe(664);
  await expect(content).toHaveCSS("transform", "none");

  const assertTitleGap = async () => {
    const [titleBounds, signalBounds] = await Promise.all([
      title.boundingBox(),
      signalStrip.boundingBox()
    ]);

    expect(titleBounds).not.toBeNull();
    expect(signalBounds).not.toBeNull();
    expect(
      (signalBounds?.y ?? 0) -
        ((titleBounds?.y ?? 0) + (titleBounds?.height ?? 0))
    ).toBeGreaterThanOrEqual(48);
  };

  await assertTitleGap();

  const scrollTravel = await hero.evaluate(
    (element) =>
      element.clientHeight -
      (element.querySelector<HTMLElement>(".hero__stage")?.clientHeight ?? 0)
  );

  await page.evaluate(
    (distance) => window.scrollTo({ top: distance * 0.5, behavior: "instant" }),
    scrollTravel
  );
  await assertTitleGap();
});

test("lets the following block fully cover the desktop hero scene", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const hero = page.locator(".hero");
  const media = page.locator("[data-parallax-media]");
  const heroContent = page.locator(".hero__content");
  const stage = page.locator(".hero__stage");
  const signalStrip = page.locator(".signal-strip");
  const heroHeight = await hero.evaluate(
    (element) => (element as HTMLElement).offsetHeight
  );
  const scrollTravel = heroHeight - 900;
  const firstOverlapScroll = scrollTravel * 0.5;
  const lateOverlapScroll = scrollTravel * 0.85;

  await page.evaluate(
    (scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }),
    firstOverlapScroll
  );

  const firstOffset = await media.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);

    return matrix.m42;
  });
  const firstContentTop = await heroContent.evaluate(
    (element) => element.getBoundingClientRect().top
  );

  await expect(stage).toHaveCSS("position", "sticky");

  const firstStripBounds = await signalStrip.boundingBox();

  expect(firstStripBounds).not.toBeNull();
  expect(firstStripBounds?.y).toBeLessThan(900);
  expect(firstStripBounds?.y).toBeGreaterThan(0);

  await page.evaluate(
    (scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }),
    lateOverlapScroll
  );

  await expect
    .poll(() =>
      media.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);

        return matrix.m42;
      })
    )
    .toBeGreaterThan(firstOffset + 40);

  await expect
    .poll(() =>
      heroContent.evaluate((element) => element.getBoundingClientRect().top)
    )
    .toBeLessThan(firstContentTop - 300);

  await page.evaluate(
    (scrollTop) => window.scrollTo({ top: scrollTop, behavior: "instant" }),
    scrollTravel + 120
  );

  const stripBounds = await signalStrip.boundingBox();
  const stripBackground = await signalStrip.evaluate(
    (element) => getComputedStyle(element).backgroundColor
  );

  expect(stripBounds).not.toBeNull();
  expect(stripBounds?.y).toBeLessThan(900);
  expect(stripBackground).not.toBe("rgba(0, 0, 0, 0)");
});

test("keeps all three Wirkung cards and reveals their color on hover, keyboard and touch", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const section = page.locator("#wirkung");
  const classicMedia = section.locator(
    ".transformation__figure--day .transformation__media--interactive"
  );
  const classicImage = classicMedia.locator(".transformation__image--reveal");
  const modernMedia = section.locator(
    ".transformation__figure--night .transformation__media--interactive"
  );
  const modernImage = modernMedia.locator(".transformation__image--reveal");
  const contextMedia = section.locator(
    ".transformation__figure--context .transformation__media--interactive"
  );
  const contextImage = contextMedia.locator(".transformation__image--reveal");

  await expect(section.locator(".transformation__figure")).toHaveCount(3);
  await expect(
    section.locator(".transformation__media--interactive")
  ).toHaveCount(3);
  await expect(section.getByRole("slider")).toHaveCount(0);
  await expect(
    section.locator(".transformation__figure--night img")
  ).toHaveCount(1);
  await expect(section.locator(".transformation__caption")).toHaveCount(0);
  await expect(section.locator(".transformation__marker")).toHaveText([
    "01 / Klassisch",
    "02 / Modern",
    "03 / High-Tech"
  ]);
  await expect(
    section.locator(".transformation__figure--day .transformation__media")
  ).toHaveCSS("aspect-ratio", "21 / 9");
  await expect(
    section.locator(".transformation__figure--night .transformation__media")
  ).toHaveCSS("aspect-ratio", "auto");
  await expect(
    section.locator(".transformation__figure--context .transformation__media")
  ).toHaveCSS("aspect-ratio", "21 / 7");
  await expect(classicMedia).toHaveAttribute("aria-pressed", "false");
  await expect(classicMedia).toHaveAttribute(
    "aria-label",
    /klassischen Restaurantfassade bei Nacht/
  );
  await expect(classicImage).toHaveAttribute(
    "alt",
    /klassischen Restaurantfassade bei Nacht/
  );
  await expect(classicImage).toHaveAttribute(
    "src",
    /lichtsaum-konzept-klassische-restaurantfassade-beleuchtete-markisenvolants-nacht/
  );
  await expect(modernMedia).toHaveAttribute("aria-pressed", "false");
  await expect(modernMedia).toHaveAttribute("aria-label", /bei Nacht/);
  await expect(contextMedia).toHaveAttribute("aria-pressed", "false");
  await expect(contextMedia).toHaveAttribute(
    "aria-label",
    /städtischen Café- und Bistrofassade/
  );
  await expect(contextImage).toHaveAttribute(
    "alt",
    /städtischen Café- und Bistrofassade/
  );
  await expect(contextImage).toHaveAttribute(
    "src",
    /lichtsaum-konzept-beleuchteter-markisenvolant-cafe-bistro-stadt-abend/
  );
  await expect(classicImage).toHaveCSS(
    "filter",
    "grayscale(1) contrast(1.03)"
  );
  await expect(modernImage).toHaveCSS(
    "filter",
    "grayscale(1) contrast(1.03)"
  );
  await expect(contextImage).toHaveCSS(
    "filter",
    "grayscale(1) contrast(1.03)"
  );

  await classicMedia.hover();
  await expect(classicImage).toHaveCSS("filter", "none");

  await section.locator(".section-heading").hover();
  await expect(classicImage).toHaveCSS(
    "filter",
    "grayscale(1) contrast(1.03)"
  );

  await modernMedia.hover();
  await expect(modernImage).toHaveCSS("filter", "none");

  await section.locator(".section-heading").hover();
  await expect(modernImage).toHaveCSS(
    "filter",
    "grayscale(1) contrast(1.03)"
  );

  await classicMedia.click();
  await section.locator(".section-heading").hover();
  await expect(classicMedia).toHaveAttribute("aria-pressed", "true");
  await expect(classicImage).toHaveCSS("filter", "none");

  await classicMedia.press("Enter");
  await expect(classicMedia).toHaveAttribute("aria-pressed", "false");

  await contextMedia.hover();
  await expect(contextImage).toHaveCSS("filter", "none");

  await contextMedia.click();

  await expect(contextMedia).toHaveAttribute("aria-pressed", "true");
  await expect(contextMedia).toHaveAttribute(
    "aria-label",
    /Schwarz-Weiß-Darstellung wiederherstellen/
  );
  await expect(contextImage).toHaveCSS("filter", "none");

  await contextMedia.press("Enter");
  await expect(contextMedia).toHaveAttribute("aria-pressed", "false");
});

test("centers the compact Wirkung slogan without changing the photo grid", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const geometry = await page.evaluate(() => {
    const bounds = (selector: string) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();

      if (!rect) {
        throw new Error(`Missing element: ${selector}`);
      }

      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2
      };
    };
    const slogan = document.querySelector<HTMLElement>(
      ".transformation__slogan"
    );
    const copy = document.querySelector<HTMLElement>(
      ".transformation__slogan-copy"
    );

    if (!slogan || !copy) {
      throw new Error("Missing transformation slogan");
    }

    const markerStyle = getComputedStyle(slogan, "::before");

    return {
      viewportWidth: window.innerWidth,
      day: bounds(".transformation__figure--day"),
      night: bounds(".transformation__figure--night"),
      slogan: bounds(".transformation__slogan"),
      copy: bounds(".transformation__slogan-copy"),
      context: bounds(".transformation__figure--context"),
      fontSize: Number.parseFloat(getComputedStyle(copy).fontSize),
      markerMaskImage: markerStyle.maskImage,
      markerMaskSize: markerStyle.maskSize,
      markerOpacity: markerStyle.opacity,
      markerHeight: Number.parseFloat(markerStyle.height),
      markerWidth: Number.parseFloat(markerStyle.width)
    };
  });

  expect(geometry.copy.centerX).toBeLessThan(geometry.day.centerX - 12);
  expect(geometry.copy.centerX).toBeGreaterThan(geometry.day.centerX - 25);
  expect(geometry.slogan.top).toBeGreaterThanOrEqual(geometry.day.bottom + 31);
  expect(geometry.slogan.bottom).toBeLessThanOrEqual(
    geometry.context.top - 31
  );
  expect(geometry.night.top).toBeCloseTo(geometry.day.top, 0);
  expect(geometry.night.bottom).toBeCloseTo(geometry.slogan.bottom, 0);
  expect(geometry.fontSize, JSON.stringify(geometry)).toBeGreaterThanOrEqual(88);
  expect(geometry.fontSize, JSON.stringify(geometry)).toBeLessThan(89);
  expect(geometry.markerMaskSize).toBe("100% 100%");
  expect(geometry.markerMaskImage).toContain(
    "lichtsaum-marker-loop-mask.png"
  );
  expect(geometry.markerOpacity).toBe("0.8");
  expect(geometry.markerHeight).toBeGreaterThan(geometry.slogan.height * 2.1);
  expect(geometry.markerHeight).toBeLessThan(geometry.slogan.height * 2.13);
  expect(geometry.markerWidth).toBeCloseTo(geometry.slogan.width * 1.152, 0);
});

test("keeps the simplified hero free of CTAs and preserves the form target", async ({
  page
}) => {
  await expect(page.locator(".hero").getByRole("link")).toHaveCount(0);
  await expect(page.locator("#projekt-pruefen")).toHaveCount(1);
  await expect(page.locator("#project-check-form")).toHaveAttribute(
    "aria-labelledby",
    "project-check-title"
  );
});

test("uses crawlable navigation links with matching home targets", async ({
  page
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Hauptnavigation"
  });

  await expect(navigation).toBeVisible();

  for (const item of navigationItems) {
    const link = navigation.getByRole("link", {
      name: item.label,
      exact: true
    });

    await expect(link).toHaveAttribute("href", item.href);
    const fragment = item.href.split("#")[1];

    if (fragment) {
      const target = `#${fragment}`;
      await expect(
        page.locator(target),
        `Missing target ${target}`
      ).toHaveCount(1);
    }
  }

  await expect(navigation.getByRole("link")).toHaveCount(4);
});

test("renders the shortened homepage in the agreed section order", async ({
  page
}) => {
  const sectionOrder = await page.locator("main > section").evaluateAll(
    (sections) =>
      sections.map((section) =>
        section.classList.contains("signal-strip")
          ? "principles"
          : section.id
      )
  );

  expect(sectionOrder).toEqual([
    "produkt",
    "principles",
    "wirkung",
    "praezision",
    "eignung",
    "konfigurator",
    "referenzen",
    "faq",
    "projekt-pruefen"
  ]);

  for (const selector of [
    "#varianten",
    "#ablauf",
    "#grenzen",
    "#nachweise",
    "#alternativen"
  ]) {
    await expect(page.locator(selector)).toHaveCount(0);
  }
});

test("renders the concise object-specific FAQ with the approved marker treatment", async ({
  page
}) => {
  const section = page.locator("#faq");
  const details = section.locator("details");
  const summaries = details.locator("summary");

  await expect(section).toHaveAttribute("aria-labelledby", "faq-title");
  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Fragen",
      exact: true
    })
  ).toBeVisible();
  await expect(section.locator(".eyebrow--marker-loop")).toHaveText("FAQ");
  await expect(section.locator(".section-heading__intro")).toHaveCount(0);
  await expect(details).toHaveCount(6);
  await expect(summaries).toHaveText([
    "Passt ein Leuchtvolant an jede Markise?",
    "Welche Unterlagen helfen bei der ersten Prüfung?",
    "Welche Maße sind für Volant und Schriftzug möglich?",
    "Brauche ich eine Genehmigung oder Zustimmung?",
    "Wie werden Stromversorgung und elektrischer Anschluss geklärt?",
    "Wann ist ein Leuchtvolant nicht die passende Lösung?"
  ]);
  await expect(
    section.locator(".faq-list details > p")
  ).toHaveText([
    "Nein. Vorgesehen ist der Austausch des vorhandenen Volants nur bei einer geeigneten bestehenden Gewerbemarkise. Entscheidend sind die Austauschbarkeit des Volants, die Befestigungsart und die Maße, ein ungehinderter Bewegungsablauf, ein sicher planbarer Kabelweg sowie eine geeignete Stromversorgung. Die Eignung wird am konkreten Objekt geprüft.",
    "Für den ersten Kontakt genügt eine E-Mail-Adresse. Falls vorhanden, helfen Fotos der Markise und der Volantbefestigung, bekannte Maße, eine Logo- oder Schriftzugvorlage sowie Angaben zu Stromversorgung, Zugang und zum Zustimmungsstatus am Objekt.",
    "Im aktuellen Konfigurator kann die Volanthöhe zwischen 200 und 300 mm gewählt werden. Die Buchstabenhöhe ist auf maximal 180 mm begrenzt. Ob der gesamte Schriftzug bei der gewählten Schriftart und Höhe in die verfügbare Breite passt, wird anhand seiner tatsächlich gemessenen Länge geprüft. Die finale technische Ausführung bleibt objektbezogen.",
    "Das ist objekt- und standortabhängig. Zu prüfen sind insbesondere die erforderlichen Zustimmungen am Objekt sowie örtliche Vorgaben für Werbeanlagen. Bei denkmalgeschützten Gebäuden oder in geschützten Bereichen können zusätzliche denkmalrechtliche Anforderungen gelten.",
    "Vor der Ausführung müssen Kabelweg, Einbauort und erforderlicher Schutz des Netzteils beziehungsweise LED-Treibers, Anschlussart sowie die Verantwortung für erforderliche Elektroarbeiten am konkreten Objekt festgelegt werden.",
    "Nicht passend ist ein Leuchtvolant insbesondere, wenn der vorhandene Volant nicht separat austauschbar ist, die Markise beschädigt oder mechanisch ungeeignet ist oder kein sicherer Kabelweg möglich ist. Solange notwendige Zustimmungen oder örtliche Anforderungen ungeklärt sind, kann die Ausführung nicht freigegeben werden. Wenn keine Beleuchtung benötigt wird, kann ein bedruckter Volant genügen; muss die Markise selbst ersetzt werden, ist ein neues Markisensystem zu prüfen."
  ]);

  await summaries.nth(1).click();
  await expect(details.nth(1)).toHaveAttribute("open", "");
  await expect(details.nth(1).locator("p")).toContainText(
    "Für den ersten Kontakt genügt eine E-Mail-Adresse."
  );

  await page.setViewportSize({ width: 320, height: 800 });

  for (let index = 0; index < (await details.count()); index += 1) {
    const item = details.nth(index);

    if ((await item.getAttribute("open")) === null) {
      await item.locator("summary").click();
    }

    await expect(item.locator("p")).toBeVisible();
  }

  const sectionOverflow = await section.evaluate(
    (element) => element.scrollWidth - element.clientWidth
  );

  expect(sectionOverflow).toBeLessThanOrEqual(1);
});

test("shows the local reference review gallery on the homepage and dedicated route", async ({
  page,
  request
}) => {
  const section = page.locator("#referenzen");
  const cards = section.locator(".reference-card");

  await expect(
    section.getByRole("heading", { name: "Ausgewählte Ansichten" })
  ).toBeVisible();
  await expect(section.locator("#references-title")).toHaveCSS(
    "text-transform",
    "uppercase"
  );
  await expect(cards).toHaveCount(4);
  await expect(section.locator(".reference-card__badge")).toHaveCount(1);
  await expect(cards.nth(0)).toHaveAttribute(
    "href",
    "/referenzen#real-gastronomie-bar"
  );
  await expect(cards.nth(0).locator("img")).toHaveAttribute(
    "alt",
    "Abendliche Gastronomiefassade mit drei bordeauxroten Markisen und warm leuchtenden Schriftzügen „Bar“ über den Fenstern."
  );
  await expect(cards.nth(1)).toHaveAttribute(
    "href",
    "/referenzen#real-restaurant-garten"
  );
  await expect(cards.nth(1).locator("img")).toHaveAttribute(
    "alt",
    "Restaurantfassade mit mehreren dunkelgrünen Markisen und warm leuchtenden Schriftzügen „GARTEN“ über einer Außenterrasse."
  );
  await expect(cards.nth(2)).toHaveAttribute(
    "href",
    "/referenzen#real-gewerbefassade-ahouse"
  );
  await expect(cards.nth(2).locator("img")).toHaveAttribute(
    "alt",
    "Nächtliche Straßenansicht einer roten Backsteinfassade mit zwei dunklen Markisen und warm leuchtenden Schriftzügen „A-HOUSE“."
  );

  const firstCard = cards.first();
  await firstCard.focus();
  await firstCard.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Licht über drei Fenstern" })
  ).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(
    dialog.getByRole("heading", { name: "Licht entlang der Terrasse" })
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstCard).toBeFocused();

  const response = await request.get("/referenzen");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain("Referenzen</h1>");
  expect(html).toContain("references-page__context");
  expect(html).not.toContain("01 /");
  expect(html).not.toContain("02 /");
  expect(html).not.toContain("03 /");
  expect(html).not.toContain("04 /");
  expect(html).toContain("Konzeptvisualisierung");
  expect(html).toContain("Zwei Lichtfelder – eine Fassade");
  expect(html).toMatch(/noindex/i);
});

test("configures the physical SVG valance and enforces its height limits", async ({
  page
}) => {
  const section = page.locator("#konfigurator");
  const preview = section.locator(".configurator-preview");
  const previewImage = preview.getByRole("img");
  const continuationButton = section.getByRole("link", {
    name: "Im Konfigurator weiter"
  });

  await expect(
    section.getByRole("heading", { name: "LICHTSAUM STUDIO" })
  ).toBeVisible();
  await expect(section.locator("img")).toHaveCount(0);
  await expect(previewImage).toBeVisible();
  await expect(preview.locator("svg").first()).toHaveAttribute(
    "viewBox",
    "0 0 1600 357"
  );
  await expect(preview.locator("image")).toHaveCount(0);
  const fontTrigger = section.getByRole("button", { name: /Schriftstil:/ });
  const fontListbox = section.getByRole("listbox", {
    name: "Schriftstil auswählen"
  });
  const compositionTrigger = section.getByRole("button", {
    name: /Komposition:/
  });
  const compositionListbox = section.getByRole("listbox", {
    name: "Komposition auswählen"
  });
  const awningColorTrigger = section.getByRole("button", {
    name: /Markisenfarbe:/
  });
  const awningColorListbox = section.getByRole("listbox", {
    name: "Markisenfarbe auswählen"
  });
  const lightColorTrigger = section.getByRole("button", {
    name: /Lichtwirkung:/
  });
  const lightColorListbox = section.getByRole("listbox", {
    name: "Lichtwirkung auswählen"
  });
  const firstNumberInput = section.locator(".configurator-number-input").first();
  const textInput = section.getByLabel("Text auf dem Volant");

  await expect(section.getByText("Schriftvorschau", { exact: true })).toHaveCount(
    0
  );
  await expect(
    section.getByText("Schriftzug mittig, ohne Logo.", { exact: true })
  ).toBeHidden();
  const compositionTriggerHeight = await compositionTrigger.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  const numberInputHeight = await firstNumberInput.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  const textInputHeight = await textInput.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  expect(Math.abs(compositionTriggerHeight - numberInputHeight)).toBeLessThanOrEqual(
    1
  );
  expect(Math.abs(textInputHeight - numberInputHeight)).toBeLessThanOrEqual(1);

  await fontTrigger.click();
  await expect(fontListbox.getByRole("option")).toHaveCount(8);
  await fontTrigger.click();
  await compositionTrigger.focus();
  await compositionTrigger.press("Enter");
  await expect(compositionListbox.getByRole("option")).toHaveCount(3);
  await expect(
    section.getByText("Schriftzug mittig, ohne Logo.", { exact: true })
  ).toBeVisible();
  await expect(
    compositionListbox.getByText("Schriftzug mittig, ohne Logo.", {
      exact: true
    })
  ).toBeVisible();
  await expect(
    compositionListbox.getByRole("option", { name: /Nur Schrift/ })
  ).toBeFocused();
  await expect(section.getByText("Segmentiert", { exact: true })).toHaveCount(0);
  await page.keyboard.press("End");
  await expect(
    compositionListbox.getByRole("option", { name: /Logo beidseitig/ })
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(compositionListbox).toBeHidden();
  await expect(compositionTrigger).toBeFocused();
  await section.getByLabel("Text auf dem Volant").fill("ABENDLICHT");
  await section.getByLabel("Volantbreite").fill("2600");
  await section.getByLabel("Volanthöhe").fill("300");
  await section.getByLabel("Buchstabenhöhe").fill("140");
  await fontTrigger.click();
  await section
    .getByRole("option", { name: /Oswald/ })
    .click();
  const centeredTextX = await preview
    .locator("[data-configurator-text]")
    .getAttribute("x");
  await compositionTrigger.click();
  await compositionListbox
    .getByRole("option", { name: /Logo links/ })
    .click();
  await expect(preview.locator("[data-configurator-logo]")).toHaveCount(1);
  await expect(
    preview.locator('[data-configurator-logo][data-position="left"]')
  ).toHaveCount(1);
  await expect(preview.locator("[data-configurator-text]")).toHaveAttribute(
    "x",
    centeredTextX ?? ""
  );
  await compositionTrigger.click();
  await compositionListbox
    .getByRole("option", { name: /Logo beidseitig/ })
    .click();
  await expect(preview.locator("[data-configurator-logo]")).toHaveCount(2);
  await expect(
    preview.locator('[data-configurator-logo][data-position="right"]')
  ).toHaveCount(1);
  await expect(preview.locator("[data-configurator-text]")).toHaveAttribute(
    "x",
    centeredTextX ?? ""
  );
  await awningColorTrigger.click();
  await expect(awningColorListbox.getByRole("option")).toHaveCount(11);
  await awningColorListbox.getByRole("option", { name: "Sand" }).click();
  await expect(awningColorTrigger).toHaveAccessibleName("Markisenfarbe: Sand");
  await lightColorTrigger.click();
  await expect(lightColorListbox.getByRole("option")).toHaveCount(8);
  await lightColorListbox
    .getByRole("option", { name: "Neutralweiß" })
    .click();
  await expect(lightColorTrigger).toHaveAccessibleName(
    "Lichtwirkung: Neutralweiß"
  );
  await expect(section.getByText("Ansicht", { exact: true })).toHaveCount(0);
  await expect(section.getByRole("radio", { name: "Neutralweiß" })).toHaveCount(
    0
  );
  await expect(preview.locator("svg svg")).toHaveAttribute(
    "viewBox",
    "0 0 2600 300"
  );
  await expect(preview.locator("svg svg text").last()).toContainText(
    "ABENDLICHT"
  );
  await expect(preview).toHaveAttribute("data-mode", "night");

  await page.evaluate(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('a[href="/konfigurator"]')
        ) {
          event.preventDefault();
        }
      },
      { capture: true, once: true }
    );
  });
  await continuationButton.click();
  const storedConfiguration = await page.evaluate(() =>
    JSON.parse(
      window.sessionStorage.getItem("lichtsaum:mini-configurator:v2") ?? "null"
    )
  );

  expect(storedConfiguration).toMatchObject({
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
  });

  await page.reload();
  await expect(
    section.getByRole("button", { name: "Komposition: Logo beidseitig" })
  ).toBeVisible();
  await expect(preview.locator("[data-configurator-logo]")).toHaveCount(2);

  const valanceHeightInput = section.getByLabel("Volanthöhe");
  const letterHeightInput = section.getByLabel("Buchstabenhöhe");

  await expect(valanceHeightInput).toHaveAttribute("min", "200");
  await expect(valanceHeightInput).toHaveAttribute("max", "300");
  await expect(letterHeightInput).toHaveAttribute("min", "1");
  await expect(letterHeightInput).toHaveAttribute("max", "180");

  await valanceHeightInput.fill("199");
  await expect(
    section.getByText("Die Volanthöhe muss zwischen 200 und 300 mm liegen.")
  ).toBeVisible();
  await expect(valanceHeightInput).toHaveAttribute("aria-invalid", "true");
  await expect(continuationButton).toHaveAttribute("aria-disabled", "true");
  await expect(preview).toHaveAttribute("data-error", "true");

  await valanceHeightInput.fill("301");
  await expect(
    section.getByText("Die Volanthöhe muss zwischen 200 und 300 mm liegen.")
  ).toBeVisible();

  await valanceHeightInput.fill("300");
  await expect(
    section.getByText("Die Volanthöhe muss zwischen 200 und 300 mm liegen.")
  ).toHaveCount(0);

  await letterHeightInput.fill("181");
  await expect(
    section.getByText(
      "Die Buchstabenhöhe muss zwischen 1 und 180 mm liegen."
    )
  ).toBeVisible();
  await expect(letterHeightInput).toHaveAttribute("aria-invalid", "true");
  await expect(continuationButton).toHaveAttribute("aria-disabled", "true");
  await expect(preview).toHaveAttribute("data-error", "true");

  await letterHeightInput.fill("180");
  await expect(
    section.getByText("Die Buchstabenhöhe muss zwischen 1 und 180 mm liegen.")
  ).toHaveCount(0);
  await expect(continuationButton).toHaveAttribute("aria-disabled", "false");
});

test("opens an accessible mobile navigation drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Menü öffnen" });
  const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
  const header = page.locator(".site-header");
  const brand = page.getByRole("link", { name: "LICHTSAUM Startseite" });
  const mobileNavigation = page.getByRole("navigation", {
    name: "Mobiles Hauptmenü"
  });

  await expect(trigger).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(brand).toHaveCount(1);
  await expect(header.getByText("LICHTSAUM", { exact: true })).toHaveCount(1);
  const closedBrandBox = await brand.boundingBox();
  await trigger.click();

  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-state", "open");
  await expect(page.locator("html")).toHaveClass(/mobile-menu-open/);
  await expect(brand).toHaveCount(1);
  await expect(header.getByText("LICHTSAUM", { exact: true })).toHaveCount(1);
  expect(await brand.boundingBox()).toEqual(closedBrandBox);

  for (const item of navigationItems) {
    await expect(
      mobileNavigation.getByRole("link", { name: item.label, exact: true })
    ).toHaveAttribute("href", item.href);
  }

  await expect(mobileNavigation.getByRole("link")).toHaveCount(4);

  await expect(
    dialog.getByRole("link", { name: formSubmitLabel, exact: true })
  ).toHaveAttribute("href", "/#projekt-pruefen");

  await dialog.getByRole("button", { name: "Menü schließen" }).click();
  await expect(dialog).toHaveAttribute("data-state", "closed");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(dialog).toHaveAttribute("data-state", "open");
  await dialog.click({ position: { x: 24, y: 320 } });
  await expect(dialog).toHaveAttribute("data-state", "closed");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(dialog).toHaveAttribute("data-state", "open");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveAttribute("data-state", "closed");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/mobile-menu-open/);
});

test("combines retrofit and compatibility into one Eignung section", async ({
  page
}) => {
  const section = page.locator("#eignung");

  await expect(section).toHaveCount(1);
  await expect(page.locator("#retrofit")).toHaveCount(0);
  await expect(
    section.getByRole("heading", {
      name: "Konstruktion prüfen Volant erneuern",
      exact: true
    })
  ).toBeVisible();
  await expect(section.locator(".eyebrow--marker-loop")).toHaveText("Eignung");
  await expect(section.locator(".eligibility__sequence li")).toHaveCount(3);
  await expect(section.locator(".eligibility__point")).toHaveText([
    "Was wir prüfenBefestigung, Maße und die Möglichkeit der Stromzuführung.",
    "Was sich ändertDer textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt.",
    "Was bleibtKonstruktion, Markisentuch und Mechanik der Markise."
  ]);
  await expect(section.locator(".eligibility__inputs")).toHaveCount(0);
  await expect(section.locator(".eligibility__cta")).toHaveCount(0);
});

test("shows the selected precision explanation only in the left accordion", async ({
  page
}) => {
  const section = page.locator("#praezision");
  const controls = section.getByRole("group", {
    name: "Schematische Ansicht wählen"
  });
  const lightView = controls.getByRole("button", { name: /Lichtbild/ });
  const designView = controls.getByRole("button", { name: /Gestaltung/ });
  const measurementView = controls.getByRole("button", { name: /Aufmaß/ });

  await expect(lightView).toHaveAttribute("aria-expanded", "true");
  await expect(
    section.locator("#precision-description-lichtbild")
  ).toBeVisible();
  await expect(
    section.locator("#precision-description-lichtbild")
  ).toHaveAttribute("aria-hidden", "false");
  await expect(section.locator("figcaption")).toHaveCount(0);

  await designView.click();

  await expect(lightView).toHaveAttribute("aria-expanded", "false");
  await expect(designView).toHaveAttribute("aria-expanded", "true");
  await expect(
    section.locator("#precision-description-lichtbild")
  ).toHaveAttribute("aria-hidden", "true");
  await expect(
    section.locator("#precision-description-gestaltung")
  ).toContainText("Projektkosten");
  await expect(
    section.locator('.engineered-precision__image[data-state="active"]')
  ).toHaveAttribute(
    "src",
    /lichtsaum-engineered-gestaltung-lichtfeld\.webp/
  );
  await expect(section.locator(".engineered-precision__image")).toHaveCount(3);
  await expect(
    section.locator(
      '.engineered-precision__image[data-state="inactive"][src*="lichtsaum-engineered-lichtbild"]'
    )
  ).toHaveAttribute("src", /lichtsaum-engineered-lichtbild\.webp/);

  await measurementView.click();

  await expect(designView).toHaveAttribute("aria-expanded", "false");
  await expect(measurementView).toHaveAttribute("aria-expanded", "true");
  await expect(
    section.locator("#precision-description-aufmass")
  ).toBeVisible();
  await expect(
    section.locator('.engineered-precision__image[data-state="active"]')
  ).toHaveAttribute(
    "src",
    /lichtsaum-engineered-aufmass-volant\.webp/
  );
  await expect(section.locator(".engineered-precision__image")).toHaveCount(3);
  await expect(
    section.locator(
      '.engineered-precision__image[data-state="inactive"][src*="lichtsaum-engineered-gestaltung-lichtfeld"]'
    )
  ).toHaveAttribute(
    "src",
    /lichtsaum-engineered-gestaltung-lichtfeld\.webp/
  );
  await expect(
    section.locator('.engineered-precision__image[data-state="inactive"]')
  ).toHaveCount(2);
});

test("anchors precision imagery to the left edge", async ({ page }) => {
  const image = page.locator(
    '#praezision .engineered-precision__image[data-state="active"]'
  );

  await expect(image).toHaveCSS("object-position", "0% 50%");
});

test("uses opacity-only precision transitions with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#praezision");

  const image = page.locator(
    '.engineered-precision__image[data-state="active"]'
  );

  await expect(image).toHaveCSS("transform", "none");
  await expect(image).toHaveCSS("transition-property", "opacity");
});

test("reports accessible validation errors for an empty project check", async ({
  page
}) => {
  const form = page.locator("#project-check-form");

  await expect(form).toBeVisible();
  await expect(
    form.getByRole("link", { name: "Datenschutzerklärung" })
  ).toBeVisible();

  await form
    .getByRole("button", { name: formSubmitLabel, exact: true })
    .click();

  await expect(
    form.getByRole("heading", {
      name: "Bitte prüfen Sie Ihre Angaben",
      exact: true
    })
  ).toBeVisible();
  expect(await form.locator('[aria-invalid="true"]').count()).toBeGreaterThan(0);
  await expect(form.locator('[aria-invalid="true"]').first()).toHaveAttribute(
    "aria-describedby",
    /-error\b/
  );
});

test("validates complete prototype input without claiming lead success", async ({
  page
}) => {
  const form = page.locator("#project-check-form");

  await form
    .getByLabel(/^(Geschäftliche )?E-Mail-Adresse\b/)
    .fill("projekt@example.test");

  await fillRequiredControls(form);
  await form.locator('input[name="projectFiles"]').setInputFiles({
    name: "zu-gross.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.alloc(15 * 1024 * 1024 + 1)
  });
  await expect(
    form.getByText("Dateien über 15 MB wurden nicht hinzugefügt.", {
      exact: true
    })
  ).toBeVisible();
  expect(
    await form
      .locator('input[name="projectFiles"]')
      .evaluate((input) => (input as HTMLInputElement).files?.length)
  ).toBe(0);

  await form
    .locator('input[name="projectFiles"]')
    .setInputFiles(
      "DesignPrototip/assets/review-optimized/concept-eingang-detail-wide.webp"
    );
  await expect(
    form.getByText("concept-eingang-detail-wide.webp")
  ).toBeVisible();
  await expect(
    form.getByRole("img", {
      name: "Vorschau für concept-eingang-detail-wide.webp",
      exact: true
    })
  ).toBeVisible();

  await form.locator('input[name="projectFiles"]').setInputFiles({
    name: "logo-entwurf.pdf",
    mimeType: "application/pdf",
    buffer: tinyPdf
  });
  await expect(form.getByText("logo-entwurf.pdf")).toBeVisible();

  await form
    .getByRole("button", {
      name: "Datei concept-eingang-detail-wide.webp entfernen",
      exact: true
    })
    .click();
  await expect(
    form.getByText("concept-eingang-detail-wide.webp")
  ).toHaveCount(0);
  await expect(form.getByText("logo-entwurf.pdf")).toBeVisible();
  expect(
    await form
      .locator('input[name="projectFiles"]')
      .evaluate((input) => (input as HTMLInputElement).files?.length)
  ).toBe(1);

  expect(await form.locator(":invalid").count()).toBe(0);
  await form
    .getByRole("button", { name: formSubmitLabel, exact: true })
    .click();

  await expect(
    form.getByText(
      "Ihre Eingaben erfüllen die Formularregeln dieses Prototyps. Sie wurden nicht gespeichert und nicht als Projektanfrage weitergeleitet.",
      { exact: true }
    )
  ).toBeVisible();
  await expect(
    form.getByText(/Anfrage (erfolgreich )?(gesendet|übermittelt)/i)
  ).toHaveCount(0);
  await expect(
    form.locator('[data-lead-success="true"], [data-lead-id]')
  ).toHaveCount(0);
  expect(await generateLeadEvents(page)).toEqual([]);
});
