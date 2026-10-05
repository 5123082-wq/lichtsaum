import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectDownwardDriftUntilCovered(page: Page) {
  const { points, coveredByFollowingContent } = await page.evaluate(async () => {
    const hero = document.querySelector<HTMLElement>(".hero")!;
    const stage = document.querySelector<HTMLElement>(".hero__stage")!;
    const image = document.querySelector<HTMLElement>(".hero__image--day")!;
    const next = document.querySelector<HTMLElement>(".signal-strip")!;
    const header = document.querySelector<HTMLElement>(".site-header")!;
    const formerLimit = hero.offsetHeight - stage.offsetHeight;
    const coveredAt = next.getBoundingClientRect().top + window.scrollY;
    const points = [];
    const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(
      () => requestAnimationFrame(() => resolve())
    ));

    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      window.scrollTo({
        top: Math.floor(formerLimit + (coveredAt - formerLimit) * progress),
        behavior: "instant"
      });
      await waitForFrame();
      points.push({
        imageTop: image.getBoundingClientRect().top,
        stageTop: stage.getBoundingClientRect().top,
        nextTop: next.getBoundingClientRect().top
      });
    }
    window.scrollTo({ top: Math.ceil(coveredAt) + 40, behavior: "instant" });
    await waitForFrame();
    const foreground = document.elementFromPoint(
      24,
      header.getBoundingClientRect().bottom + 16
    );
    return {
      points,
      coveredByFollowingContent: Boolean(foreground) && !foreground!.closest(".hero")
    };
  });

  for (let index = 0; index < points.length; index += 1) {
    expect(Math.abs(points[index].stageTop)).toBeLessThan(1);
    if (index > 0) {
      expect(points[index].imageTop).toBeGreaterThan(points[index - 1].imageTop);
    }
  }
  expect(points.at(-1)?.nextTop).toBeLessThan(1);
  expect(coveredByFollowingContent).toBe(true);
}

const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1512, height: 780 },
  { width: 1920, height: 1080 }
];

for (const viewport of viewports) {
  test(`shows the lit lettering clear of the header and title at ${viewport.width}×${viewport.height}`, async ({
    page
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.querySelectorAll<HTMLImageElement>(".hero__image"))
          .map((image) => image.decode())
      );
    });

    const image = await page.locator(".hero__image--day").boundingBox();
    const title = await page.locator(".hero__title").boundingBox();
    const header = await page.locator(".site-header").boundingBox();

    expect(image).not.toBeNull();
    expect(title).not.toBeNull();
    expect(header).not.toBeNull();

    if (!image || !title || !header) {
      throw new Error("Hero image, title or header has no bounds");
    }

    // Conservative bounds of the perspective lettering in the 1672 × 941 SVG.
    const lettering = {
      left: image.x + image.width * (459 / 1672),
      right: image.x + image.width * (759 / 1672),
      top: image.y + image.height * (557 / 941),
      bottom: image.y + image.height * (639 / 941)
    };

    expect(lettering.left).toBeGreaterThan(16);
    expect(lettering.right).toBeLessThan(viewport.width - 16);
    expect(lettering.top).toBeGreaterThan(header.height + 24);
    expect(lettering.bottom).toBeLessThan(title.y - 24);
    await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "0.35");
    await expect(page.locator(".site-header")).toHaveAttribute("data-overlay-hero", "true");
    await expect.poll(() => page.locator(".site-header").evaluate(
      (element) => getComputedStyle(element, "::before").opacity
    )).toBe("0");
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewport.width);

    const nextBlock = await page.locator(".signal-strip").boundingBox();
    expect(nextBlock).not.toBeNull();
    const entryDistance = (nextBlock?.y ?? 0) - viewport.height;
    expect(entryDistance).toBeCloseTo(
      viewport.height * (viewport.width < 768 ? 0.1 : 0.2),
      0
    );

    await page.evaluate(() => window.scrollTo({ top: 100, behavior: "instant" }));
    await expect(page.locator(".hero__content")).toHaveCSS("opacity", "1");
    await expect.poll(async () => Math.abs(
      ((await page.locator(".hero__title").boundingBox())?.y ?? 0) - (title.y - 100)
    )).toBeLessThan(1);

    await page.evaluate(() => window.scrollTo({ top: 220, behavior: "instant" }));
    await expect.poll(() => page.locator(".hero__content").evaluate(
      (element) => Number(getComputedStyle(element).opacity)
    )).toBeGreaterThan(0.3);
    await expect.poll(() => page.locator(".hero__content").evaluate(
      (element) => Number(getComputedStyle(element).opacity)
    )).toBeLessThan(0.6);
    const litImage = await page.locator("[data-hero-night]").boundingBox();
    expect((litImage?.y ?? 0) - image.y).toBeGreaterThan(15);
    expect((litImage?.y ?? 0) - image.y).toBeLessThan(60);
    await expect(page.locator(".hero__content")).toHaveCSS("transform", "none");

    await page.evaluate(() => window.scrollTo({ top: 320, behavior: "instant" }));
    await expect(page.locator(".hero__content")).toHaveCSS("opacity", "0");
    expect((await page.locator(".signal-strip").boundingBox())?.y)
      .toBeLessThan(viewport.height - 80);
    await expectDownwardDriftUntilCovered(page);
  });
}

test("fades in the header, brightens the sign and restores the entry state on scroll back", async ({ page }) => {
  await page.setViewportSize({ width: 1512, height: 780 });
  await page.goto("/");
  const header = page.locator(".site-header");
  const surfaceOpacity = () => header.evaluate(
    (element) => Number(getComputedStyle(element, "::before").opacity)
  );

  await expect.poll(surfaceOpacity).toBe(0);
  await page.evaluate(() => window.scrollTo({ top: 80, behavior: "instant" }));
  await expect.poll(surfaceOpacity).toBeGreaterThan(0.2);
  await expect.poll(surfaceOpacity).toBeLessThan(0.8);
  await page.evaluate(() => window.scrollTo({ top: 440, behavior: "instant" }));
  await expect.poll(surfaceOpacity).toBe(1);
  await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero__content")).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(surfaceOpacity).toBe(0);
  await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "0.35");
  await expect(page.locator(".hero__content")).toHaveCSS("opacity", "1");

  await page.goto("/#wirkung");
  await expect.poll(surfaceOpacity).toBe(1);
});

test("loads the full source for the phone crop and changes only vector lettering", async ({ browser, baseURL }) => {
  const page = await browser.newPage({
    baseURL,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  try {
    await page.goto("/");
    const base = page.locator(".hero__image--day");
    const light = page.locator("[data-hero-night]");
    await base.evaluate((element) => (element as HTMLImageElement).decode());
    await light.evaluate((element) => (element as HTMLImageElement).decode());
    const source = await base.evaluate(async (element) => {
      const image = element as HTMLImageElement;
      const bitmap = await createImageBitmap(await (await fetch(image.currentSrc)).blob());
      const result = {
        url: image.currentSrc,
        pixelWidth: bitmap.width,
        displayWidth: image.getBoundingClientRect().width
      };
      bitmap.close();
      return result;
    });
    expect(source.displayWidth).toBeGreaterThan(1000);
    expect(source.pixelWidth).toBe(1672);
    expect(new URL(source.url).searchParams.get("q")).toBe("90");
    await expect(light).toHaveAttribute("src", "/images/lichtsaum-hero-lettering.svg");
    await expect(light).toHaveAttribute("alt", "");
    const svg = await (await page.request.get("/images/lichtsaum-hero-lettering.svg")).text();
    expect(svg).toContain('viewBox="0 0 1672 941"');
    expect(svg).toContain("<path ");
    expect(svg).not.toMatch(/<(?:image|text|script)\b|(?:href|src)=/);

    await page.evaluate(() => window.scrollTo({ top: 320, behavior: "instant" }));
    await expect(light).toHaveCSS("opacity", "1");
    await expect(base).toHaveCSS("opacity", "1");
    await expect(base).toHaveCSS("filter", "none");
    expect(await base.evaluate((element) => (element as HTMLImageElement).currentSrc))
      .toBe(source.url);
    expect(await page.locator(".hero__media img").count()).toBe(2);
  } finally {
    await page.close();
  }
});

for (const fallback of [false, true]) {
  test(`scrolls the hero title naturally while the background drifts with ${fallback ? "fallback" : "native"} animation`, async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 780 });
    if (fallback) {
      await page.addInitScript(() => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = ((...args: [string] | [string, string]) => {
          if (args[0].includes("animation-timeline")) {
            return false;
          }
          return args.length === 1 ? supports(args[0]) : supports(args[0], args[1]);
        }) as typeof CSS.supports;
      });
    }
    await page.goto("/");
    if (fallback) {
      // Simulate a browser without CSS timelines, including its stylesheet behavior.
      await page.addStyleTag({ content: `
        .hero__media, .hero__content, .hero__image--night, .site-header::before {
          animation: none !important;
        }
      ` });
    }
    await page.evaluate(() => document.fonts.ready);
    const samples = await page.evaluate(async () => {
      const content = document.querySelector<HTMLElement>(".hero__content")!;
      const media = document.querySelector<HTMLElement>(".hero__media")!;
      const stage = document.querySelector<HTMLElement>(".hero__stage")!;
      const night = document.querySelector<HTMLElement>("[data-hero-night]")!;
      const header = document.querySelector<HTMLElement>(".site-header")!;
      const sample = () => ({
        documentTop: content.getBoundingClientRect().top + window.scrollY,
        titleTransform: getComputedStyle(content).transform,
        titleOpacity: Number(getComputedStyle(content).opacity),
        mediaOffset: new DOMMatrix(getComputedStyle(media).transform).m42,
        stageTop: stage.getBoundingClientRect().top,
        nightOpacity: Number(getComputedStyle(night).opacity),
        headerOpacity: Number(getComputedStyle(header, "::before").opacity)
      });
      const results = [];
      for (const top of [0, 80, 100, 160, 220, 320, 260, 160, 80, 0]) {
        window.scrollTo({ top, behavior: "instant" });
        const immediate = sample();
        await new Promise<void>((resolve) => requestAnimationFrame(
          () => requestAnimationFrame(() => resolve())
        ));
        results.push({ top, immediate, settled: sample() });
      }
      return results;
    });
    for (const { immediate, settled } of samples) {
      expect(Math.abs(immediate.documentTop)).toBeLessThan(1);
      expect(Math.abs(settled.documentTop)).toBeLessThan(1);
      expect(settled.titleTransform).toBe("none");
      expect(settled.stageTop).toBe(0);
    }
    for (let index = 1; index < samples.length; index += 1) {
      const current = samples[index];
      const previous = samples[index - 1];
      const direction = Math.sign(current.top - previous.top);
      expect((current.settled.mediaOffset - previous.settled.mediaOffset) * direction)
        .toBeGreaterThan(0);
    }
    expect(samples[5].settled.mediaOffset).toBeGreaterThan(50);
    expect(samples[5].settled.mediaOffset).toBeLessThan(80);
    expect(samples[5].settled.titleOpacity).toBe(0);
    expect(samples[5].settled.nightOpacity).toBe(1);
    expect(samples[5].settled.headerOpacity).toBe(1);
    expect(samples[9].settled.mediaOffset).toBe(0);
    expect(samples[9].settled.titleOpacity).toBe(1);
    expect(samples[9].settled.nightOpacity).toBe(0.35);
    expect(samples[9].settled.headerOpacity).toBe(0);
    await expectDownwardDriftUntilCovered(page);
  });
}

test("keeps other routes opaque and mobile navigation operable over the hero", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("link", { name: "Konfigurator" }).click();
  await expect(page).toHaveURL(/\/konfigurator$/);
  await expect.poll(() => page.locator(".site-header").evaluate(
    (element) => getComputedStyle(element, "::before").opacity
  )).toBe("1");

  for (const route of ["/referenzen", "/kontakt", "/impressum"]) {
    await page.goto(route);
    await expect.poll(() => page.locator(".site-header").evaluate(
      (element) => getComputedStyle(element, "::before").opacity
    )).toBe("1");
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menü öffnen" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Hauptmenü" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Hauptmenü" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("shows a static illuminated hero with reduced motion and preserves navigation contrast", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero__media")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero__content")).toHaveCSS("opacity", "1");

  await page.evaluate(() => window.scrollTo({ top: 160, behavior: "instant" }));
  await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero__content")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero__media")).toHaveCSS("transform", "none");
  await expect.poll(() => page.locator(".site-header").evaluate(
    (element) => getComputedStyle(element, "::before").opacity
  )).toBe("1");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const results = await new AxeBuilder({ page })
    .include(".site-header")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
