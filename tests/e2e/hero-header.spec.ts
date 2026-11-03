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
  { width: 320, height: 568 },
  { width: 320, height: 720 },
  { width: 390, height: 664 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 900 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1512, height: 780 },
  { width: 1920, height: 1080 }
];

for (const [width, height] of [[390, 844], [820, 1180], [1024, 1366], [1512, 844]]) {
  test(`camera entrance keeps the facade and lettering registered at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const camera = page.locator(".hero__camera");
    await expect.poll(() => camera.evaluate(el => el.getAnimations().length)).toBe(1);
    const frames = await camera.evaluate(el => {
      const animation = el.getAnimations()[0];
      animation.pause();
      return [0, 900, 1800].map(time => {
        animation.currentTime = time;
        const [day, night] = Array.from(el.querySelectorAll("img"), image => {
          const box = image.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        });
        return { day, night, scale: new DOMMatrix(getComputedStyle(el).transform).a };
      });
    });
    // Browser image-size rounding can differ by a subpixel between raster and SVG.
    for (const frame of frames) {
      for (const key of ["x", "y", "width", "height"] as const) {
        expect(Math.abs(frame.day[key] - frame.night[key])).toBeLessThan(1);
      }
    }
    expect(frames[0].scale).toBe(1);
    expect(frames[1].scale).toBeGreaterThan(1);
    expect(frames[2].scale).toBeCloseTo(width < height ? 1.04 : 1.06);
    await expect(page.locator(".hero__content")).toHaveCSS("transform", "none");
    await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "0.35");
    await camera.evaluate(el => { const animation = el.getAnimations()[0]; animation.currentTime = 900; animation.play(); });
    await expect.poll(() => camera.evaluate(el => el.getAnimations().length)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`camera-rest-${width}.png`) });
    await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.3, behavior: "instant" }));
    await expect(page.locator("[data-hero-night]")).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(await camera.evaluate(el => el.getAnimations().length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("early scrolling settles the camera without restarting or blocking scroll", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const camera = page.locator(".hero__camera");
  await expect.poll(() => camera.evaluate(el => el.getAnimations().length)).toBe(1);
  const before = await camera.evaluate(el => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 500;
    return new DOMMatrix(getComputedStyle(el).transform).a;
  });
  await page.evaluate(() => window.scrollTo({ top: 160, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(160);
  await expect.poll(() => camera.evaluate(el => el.getAnimations().length)).toBe(0);
  expect(await camera.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeGreaterThan(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(camera).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(await camera.evaluate(el => el.getAnimations().length)).toBe(0);
});

test("camera skips entrance for anchor navigation and reduced motion", async ({ page }) => {
  await page.goto("/#wirkung");
  expect(await page.locator(".hero__camera").evaluate(el => el.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero__camera")).toHaveCSS("transform", "none");
  expect(await page.locator(".hero__camera").evaluate(el => el.getAnimations().length)).toBe(0);
});

test("iPad rotation changes framing without replaying the entrance", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  const camera = page.locator(".hero__camera");
  await expect.poll(() => camera.evaluate(el => el.getAnimations().length)).toBe(0);
  await page.setViewportSize({ width: 1180, height: 820 });
  await expect(camera).toHaveCSS("transform", "matrix(1.06, 0, 0, 1.06, 0, 0)");
  await page.setViewportSize({ width: 820, height: 1180 });
  await expect(camera).toHaveCSS("transform", "matrix(1.04, 0, 0, 1.04, 0, 0)");
  expect(await camera.evaluate(el => el.getAnimations().length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("scrolling before the image loads prevents a delayed camera entrance", async ({ page }) => {
  let releaseImage!: () => void;
  const gate = new Promise<void>(resolve => { releaseImage = resolve; });
  await page.route(/lichtsaum-hero-clean-facade/, async route => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo({ top: 320, behavior: "instant" }));
  } finally {
    releaseImage();
  }
  await page.locator(".hero__image--day").evaluate(el => (el as HTMLImageElement).decode());
  await expect(page.locator(".hero__camera")).toHaveCSS("transform", "matrix(1.06, 0, 0, 1.06, 0, 0)");
  expect(await page.locator(".hero__camera").evaluate(el => el.getAnimations().length)).toBe(0);
});

for (const { width, textScale, desktop } of [
  { width: 768, textScale: 1, desktop: false },
  { width: 820, textScale: 1, desktop: false },
  { width: 960, textScale: 1, desktop: false },
  { width: 1024, textScale: 1, desktop: true },
  { width: 1440, textScale: 1, desktop: true },
  { width: 1280, textScale: 2, desktop: false },
  { width: 1440, textScale: 2, desktop: false },
  { width: 2048, textScale: 2, desktop: true }
]) {
  test(`keeps every header destination readable at ${width}px and ${textScale * 100}% text`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    if (textScale > 1) {
      await page.addStyleTag({ content: `html { font-size: ${textScale * 100}% !important; }` });
    }
    const navigation = page.getByRole("navigation", { name: "Hauptnavigation", includeHidden: true });
    const destinations = await navigation.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    const trigger = page.getByRole("button", { name: "Menü öffnen", includeHidden: true });
    if (desktop) {
      await expect(navigation).toBeVisible();
      await expect(trigger).toBeHidden();
      const bounds = await navigation.evaluate(element => {
        const nav = element.getBoundingClientRect();
        return {
          clipped: element.scrollWidth > element.clientWidth + 1,
          links: Array.from(element.querySelectorAll("a")).map(link => {
            const rect = link.getBoundingClientRect();
            return rect.left >= nav.left - 1 && rect.right <= nav.right + 1;
          })
        };
      });
      expect(bounds.clipped).toBe(false);
      expect(bounds.links.every(Boolean)).toBe(true);
    } else {
      await expect(navigation).toBeHidden();
      await expect(trigger).toBeVisible();
      await trigger.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
      await expect(dialog).toBeVisible();
      const links = dialog.getByRole("navigation", { name: "Mobiles Hauptmenü" }).locator("a");
      expect(await links.evaluateAll(elements => elements.map(link => link.getAttribute("href")))).toEqual(destinations);
      for (const link of await links.all()) {
        await expect(link).toBeVisible();
        expect(await link.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`header-${width}-text-${textScale * 100}.png`) });
  });
}

test("closes the open mobile menu when navigation gains enough room", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menü öffnen" });
  const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect.poll(() => page.locator("#mobile-main-menu").evaluate(element => (element as HTMLDialogElement).open)).toBe(false);
  await expect(page.locator("html")).not.toHaveClass(/mobile-menu-open/);
  await expect(page.getByRole("navigation", { name: "Hauptnavigation" })).toBeVisible();

  await page.setViewportSize({ width: 1280, height: 900 });
  const enlargedText = await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(dialog).toBeVisible();
  await enlargedText.evaluate(element => element.parentNode?.removeChild(element));
  await expect.poll(() => page.locator("#mobile-main-menu").evaluate(element => (element as HTMLDialogElement).open)).toBe(false);
  await expect(page.locator("html")).not.toHaveClass(/mobile-menu-open/);
});

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

    // Measure scroll drift from the resting camera crop, not a moving entrance frame.
    await expect.poll(() => page.locator(".hero__camera").evaluate(el => el.getAnimations().length)).toBe(0);
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
    if (viewport.height > viewport.width) {
      // Both ends of the physical front valance must fit, not just the lettering.
      expect(image.x + image.width * (350 / 1672)).toBeGreaterThan(16);
      expect(image.x + image.width * (940 / 1672)).toBeLessThan(viewport.width - 16);
      expect(title.y + title.height).toBeLessThanOrEqual(viewport.height + 1);
    }
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
    const stageHeight = (await page.locator(".hero__stage").boundingBox())!.height;
    expect(entryDistance).toBeCloseTo(
      viewport.height > viewport.width
        ? stageHeight - viewport.height + viewport.height * 0.1
        : viewport.height * (viewport.width < 768 ? 0.1 : 0.2),
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
    expect((litImage?.y ?? 0) - image.y).toBeGreaterThan(10);
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
    expect(source.displayWidth).toBeGreaterThanOrEqual(390 * 1.6 - 1);
    expect(source.displayWidth).toBeLessThan(390 * 1.67);
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
