import { expect, test } from "@playwright/test";

test.use({ contextOptions: { reducedMotion: "reduce" } });
const carouselName = "Tuch & Farbe";
const nextName = "Tuch & Farbe: nächste Ansicht";

test("neighbouring slides preload near the chapter after its first image decodes", async ({ page }) => {
  const requested: string[] = [];
  page.on("request", request => { if (/optimized\/(sand|palette)-/.test(request.url())) requested.push(request.url()); });
  await page.goto("/produkt");
  const images = page.locator(".editorial-study-media img");
  await expect(images.nth(1)).toHaveAttribute("loading", "lazy");
  await expect(images.nth(2)).toHaveAttribute("loading", "lazy");
  expect(requested).toHaveLength(0);
  await page.locator(".editorial-material-study").scrollIntoViewIfNeeded();
  await expect.poll(() => images.evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(requested).toHaveLength(2);
  expect(requested.some(url => url.includes("sand-") && url.endsWith(".webp"))).toBe(true);
  expect(requested.some(url => url.includes("palette-") && url.endsWith(".avif"))).toBe(true);
  await page.getByRole("button", { name: nextName, exact: true }).click();
  const card = page.getByRole("group", { name: carouselName, exact: true });
  await expect(card.getByRole("heading")).toHaveText("KANTE & VERARBEITUNG.");
  expect(await card.getByRole("img").evaluate(image => (image as HTMLImageElement).complete)).toBe(true);
});

test("a delayed slide keeps the decoded frame and cannot overwrite a later choice", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/optimized/sand-*", async route => { await gate; await route.continue(); });
  try {
    await page.goto("/produkt");
    const card = page.getByRole("group", { name: carouselName, exact: true });
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => card.getByRole("img").evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await page.getByRole("button", { name: nextName, exact: true }).click();
    await expect(card).toHaveAttribute("aria-busy", "true");
    await expect(card.getByRole("heading")).toHaveText("GEWEBE & STRUKTUR.");
    await expect(card.getByRole("img")).toBeVisible();
    await page.getByRole("button", { name: nextName, exact: true }).click();
    await expect(card.getByRole("heading")).toHaveText("FARBEN KOMBINIEREN.");
    release();
    await expect.poll(() => page.locator(".editorial-study-media img").nth(1).evaluate(image => (image as HTMLImageElement).complete)).toBe(true);
    await expect(card.getByRole("heading")).toHaveText("FARBEN KOMBINIEREN.");
    await expect(card).toHaveAttribute("aria-busy", "false");
  } finally { release(); }
});

test("an image failure keeps the previous frame and supports retry with the arrows", async ({ page }) => {
  await page.route("**/optimized/sand-*", route => route.abort());
  await page.goto("/produkt");
  const card = page.getByRole("group", { name: carouselName, exact: true });
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.getByRole("img").evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await page.getByRole("button", { name: nextName, exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Die Ansicht konnte nicht geladen werden." })).toBeVisible();
  await expect(card.getByRole("heading")).toHaveText("GEWEBE & STRUKTUR.");
  await expect(card).toHaveAttribute("aria-busy", "false");
  await page.unroute("**/optimized/sand-*");
  await page.getByRole("button", { name: nextName, exact: true }).click();
  await expect(card.getByRole("heading")).toHaveText("KANTE & VERARBEITUNG.");
  await expect(page.getByRole("status").filter({ hasText: "Die Ansicht konnte nicht geladen werden." })).toHaveCount(0);
});

for (const [width, dpr, variant] of [[320, 1, "mobile"], [390, 3, "mobile"], [768, 2, "tablet"], [1024, 2, "desktop"], [1440, 1, "desktop"], [1440, 2, "desktop"], [1920, 2, "desktop"]] as const) {
  test(`responsive cloth and shape sources at ${width}px DPR${dpr}`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, deviceScaleFactor: dpr, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(String(error)));
      await page.goto("/produkt");
      await page.locator(".editorial-material-study").scrollIntoViewIfNeeded();
      const images = page.locator(".editorial-study-media img");
      await expect.poll(() => images.evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      const sources = await images.evaluateAll(images => images.map(image => (image as HTMLImageElement).currentSrc));
      expect(sources.every(src => src.includes(`-${variant}-`))).toBe(true);
      expect(sources[0]).toMatch(/\.avif$/);
      expect(sources[1]).toMatch(/\.webp$/);
      expect(sources[2]).toMatch(/\.avif$/);
      if (width === 1440 && dpr === 1) expect(sources[0]).toMatch(/-1440\./);
      if (width === 390) expect(sources[0]).toMatch(/-1080\./);
      if (width === 1024) expect(sources[0]).toMatch(/-2880\./);
      if (width === 1920) expect(sources[0]).toMatch(/-3392\./);
      await page.locator(".editorial-material-study").screenshot({ path: testInfo.outputPath(`cloth-${width}-${dpr}.png`) });
      const forms = page.locator(".editorial-hems");
      await forms.scrollIntoViewIfNeeded();
      const visible = forms.getByRole("img");
      await expect(visible).toHaveCount(width <= 760 ? 3 : 1);
      for (const image of await visible.all()) {
        await expect.poll(() => image.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
        const src = await image.evaluate(image => (image as HTMLImageElement).currentSrc);
        expect(src).toMatch(width <= 760 ? /hems-(straight|wave|scallop)-/ : /hems-desktop-/);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    } finally { await context.close(); }
  });
}

test("server HTML selects WebP sources without JavaScript when AVIF is unsupported", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.route("**/produkt", async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: (await response.text()).replaceAll('type="image/avif"', 'type="image/unsupported"') });
    });
    await page.goto("/produkt");
    await page.locator(".editorial-material-study").scrollIntoViewIfNeeded();
    const image = page.locator(".editorial-study-media img").first();
    await expect.poll(() => image.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    expect(await image.evaluate(image => (image as HTMLImageElement).currentSrc)).toMatch(/graphite-mobile-.*\.webp$/);
  } finally { await context.close(); }
});
