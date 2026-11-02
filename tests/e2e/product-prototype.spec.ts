import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const route = "/produkt";
const key = "lichtsaum:configurator:v1";
const draft = {
  version: 1,
  configuration: { schemaVersion: 1, compositionMode: "logo-left", text: "ALTER NAME", fontId: "oswald", valanceWidthMm: 4200, valanceHeightMm: 300, letterHeightMm: 130, awningColorId: "sand", lightColorId: "neutral-white" },
  services: ["delivery", "design"]
};

test("integrated, substantive, noindex product; prototype remains available", async ({ page, request }) => {
  const response = await request.get(route);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("VERTRAUTE MARKISE.");
  expect(html).toContain("Bogenförmig");
  expect(html).toContain("Der textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt.");
  expect(html).not.toContain("Was ist bei Pflege und Betrieb zu beachten?");
  await page.goto(route);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  expect(await page.locator("main").innerText()).not.toMatch(/KI-generiert|Konzeptvisualisierung|Konzeptstudie|illustrativ/i);
  expect(await page.locator("main img").evaluateAll(images => images.map(image => image.getAttribute("alt")).join(" "))).not.toMatch(/Konzept|illustrativ/i);
  await expect(page.locator("[data-chapter]")).toHaveCount(5);
  expect(await page.locator("[data-chapter]").evaluateAll(elements => elements.map(el => el.getAttribute("data-chapter")))).toEqual(["opening", "fabric", "design", "questions", "project"]);
  await expect(page.locator("#licht img")).toBeVisible();
  await expect(page.locator("#licht video")).toHaveCount(1);
  await expect(page.locator("#gestaltung").getByRole("link", { name: "Jetzt konfigurieren" })).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/€|EUR|ab \d/);
  await page.getByText("Was zeigt mir der Konfigurator?", { exact: true }).click();
  await expect(page.getByText(/Im Konfigurator sehen Sie den vorläufigen Preis/)).toBeVisible();
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
  await page.getByText("Was zeigt mir der Konfigurator?", { exact: true }).click();
  const content = await page.locator("main").innerText();
  await page.goto("/prototyp/produkt");
  await expect(page.locator(".editorial-product")).toBeVisible();
  // Playback label and icon are time-dependent; compare the stable page content.
  const normalizePlayback = (text: string) => text.replace(/[▷Ⅱ]\s*Video (?:pausieren|abspielen|erneut abspielen)/g, "VIDEO");
  expect(normalizePlayback(await page.locator("main").innerText())).toBe(normalizePlayback(content));
});

test("material views wrap and work with keyboard and touch", async ({ page }) => {
  await page.goto(route);
  const card = page.getByRole("group", { name: "Tuch & Farbe", exact: true });
  const next = page.getByRole("button", { name: "Tuch & Farbe: nächste Ansicht" });
  const previous = page.getByRole("button", { name: "Tuch & Farbe: vorherige Ansicht" });
  await previous.click();
  await expect(card.getByRole("heading")).toHaveText("FARBEN KOMBINIEREN.");
  await next.press("Enter");
  await expect(card.getByRole("heading")).toHaveText("GEWEBE & STRUKTUR.");
  await next.press("Space");
  await expect(card.getByRole("heading")).toHaveText("KANTE & VERARBEITUNG.");
  await expect(next).toBeFocused();
  await expect(card.getByRole("img")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  const image = card.locator(".editorial-study-media");
  await image.dispatchEvent("pointerdown", { pointerType: "touch", clientX: 300, clientY: 250 });
  await image.dispatchEvent("pointerup", { pointerType: "touch", clientX: 180, clientY: 255 });
  await expect(card.getByRole("heading")).toHaveText("FARBEN KOMBINIEREN.");
  // A primarily vertical gesture must leave the chosen view alone.
  await image.dispatchEvent("pointerdown", { pointerType: "touch", clientX: 300, clientY: 250 });
  await image.dispatchEvent("pointerup", { pointerType: "touch", clientX: 260, clientY: 130 });
  await expect(card.getByRole("heading")).toHaveText("FARBEN KOMBINIEREN.");
});

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`editorial composition fits ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const studies = await page.locator(".editorial-hems figure").evaluateAll(elements => elements.map(el => {
      const rect = el.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, right: rect.right };
    }));
    expect(studies).toHaveLength(3);
    for (const study of studies) { expect(study.x).toBeGreaterThanOrEqual(0); expect(study.right).toBeLessThanOrEqual(width); }
    if (width <= 760) expect(studies[1].y).toBeGreaterThan(studies[0].y);
    else expect(studies[1].y).toBe(studies[0].y);
    await page.screenshot({ path: testInfo.outputPath(`opening-${width}.png`) });
    const hero = await page.locator(".editorial-video-hero").boundingBox();
    expect(hero?.y).toBe(0);
    expect(hero?.height).toBeGreaterThanOrEqual(900);
    const material = page.getByRole("group", { name: "Tuch & Farbe", exact: true });
    await material.scrollIntoViewIfNeeded();
    await expect(material.getByRole("img")).toBeVisible();
    await expect.poll(() => material.getByRole("img").evaluate(el => (el as HTMLImageElement).complete)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`material-${width}.png`) });
    await material.getByRole("button", { name: "Tuch & Farbe: nächste Ansicht" }).click();
    expect(await material.getByRole("heading").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator(".editorial-hems").scrollIntoViewIfNeeded();
    const forms = page.locator(".editorial-hems");
    await expect(forms.getByRole("img")).toHaveCount(width <= 760 ? 3 : 1);
    for (const image of await forms.getByRole("img").all()) {
      await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath(`forms-${width}.png`) });
    const invitation = page.locator(".editorial-personalize");
    await invitation.scrollIntoViewIfNeeded();
    const action = await invitation.getByRole("link", { name: "Jetzt konfigurieren" }).boundingBox();
    expect(action).not.toBeNull();
    expect(action!.x).toBeGreaterThanOrEqual(0);
    expect(action!.x + action!.width).toBeLessThanOrEqual(width);
    if (width >= 1024) {
      const headerAction = await page.locator(".site-header__cta").boundingBox();
      expect(headerAction).not.toBeNull();
      expect(Math.abs(action!.width - headerAction!.width)).toBeLessThan(1);
      expect(Math.abs(action!.height - headerAction!.height)).toBeLessThan(1);
      expect(Math.abs(action!.x + action!.width - headerAction!.x - headerAction!.width)).toBeLessThan(1);
    }
    await expect.poll(() => invitation.locator("img").evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`invitation-${width}.png`) });
    await page.locator(".editorial-project").scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`project-${width}.png`) });
  });
}

test("reduced motion keeps the static poster and disables material transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.locator("#licht img")).toBeVisible();
  await expect(page.locator("#licht video")).not.toHaveAttribute("src", /.+/);
  await expect(page.locator(".editorial-facade")).toHaveCount(0);
  await page.getByRole("button", { name: "Tuch & Farbe: nächste Ansicht" }).click();
  await expect(page.locator(".editorial-study-media__entering")).toHaveCSS("animation-name", "none");
});

test("hero video pauses, replays, resumes onscreen and shares the homepage header surface", async ({ page }) => {
  await page.goto(route);
  const video = page.locator("#product-hero-video");
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("loop", false);
  await page.getByRole("button", { name: "Video pausieren", exact: true }).click();
  await expect(video).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Video abspielen", exact: true }).press("Enter");
  await expect(video).toHaveJSProperty("paused", false);
  await video.evaluate(v => { (v as HTMLVideoElement).currentTime = (v as HTMLVideoElement).duration - .2; });
  await expect(page.getByRole("button", { name: "Video erneut abspielen" })).toBeVisible();
  await page.getByRole("button", { name: "Video erneut abspielen" }).click();
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeLessThan(2);
  const surface = () => page.locator(".site-header").evaluate(el => Number(getComputedStyle(el, "::before").opacity));
  await expect.poll(surface).toBe(0);
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
  await expect.poll(surface).toBe(1);
  await page.locator(".editorial-video-hero").evaluate(el => window.scrollTo({
    top: window.scrollY + el.getBoundingClientRect().bottom, behavior: "instant"
  }));
  await expect(video).toHaveJSProperty("paused", true);
  const pausedAt = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(surface).toBe(0);
  await expect(video).toHaveJSProperty("paused", false);
  expect(await video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(pausedAt);
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(pausedAt + .1);
});

for (const width of [390, 1440]) {
  test(`hero video resumes from its frame, respects manual pause and holds its ending at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    const video = page.locator("#product-hero-video");
    const leaveHero = () => page.locator(".editorial-video-hero").evaluate(el => window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().bottom, behavior: "instant"
    }));
    const returnToHero = () => page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
    await video.evaluate(v => { (v as HTMLVideoElement).currentTime = 3; });
    await leaveHero();
    await expect(video).toHaveJSProperty("paused", true);
    const offscreenAt = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
    await returnToHero();
    await expect(video).toHaveJSProperty("paused", false);
    expect(await video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(offscreenAt);
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(offscreenAt + .1);

    await page.getByRole("button", { name: "Video pausieren", exact: true }).click();
    await expect(video).toHaveJSProperty("paused", true);
    const manualPauseAt = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
    await leaveHero();
    await returnToHero();
    // Give an unintended automatic restart time to advance the video.
    await page.waitForTimeout(300);
    await expect(video).toHaveJSProperty("paused", true);
    await expect(video).toHaveJSProperty("currentTime", manualPauseAt);

    await page.getByRole("button", { name: "Video abspielen", exact: true }).press("Enter");
    await expect(video).toHaveJSProperty("paused", false);
    await video.evaluate(v => { (v as HTMLVideoElement).currentTime = (v as HTMLVideoElement).duration - .2; });
    await expect(page.getByRole("button", { name: "Video erneut abspielen", exact: true })).toBeVisible();
    const finalFrameAt = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
    await leaveHero();
    await returnToHero();
    await page.waitForTimeout(300);
    await expect(video).toHaveJSProperty("ended", true);
    await expect(video).toHaveJSProperty("paused", true);
    await expect(video).toHaveJSProperty("currentTime", finalFrameAt);
    await expect(video).toHaveCSS("opacity", "1");
    await page.screenshot({ path: testInfo.outputPath(`hero-ending-${width}.png`) });
  });
}

test("reduced motion does not fetch video until explicit play and live preference changes restore the poster", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (request.url().includes("lichtsaum-orbit-v1.mp4")) requests.push(request.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  const video = page.locator("#product-hero-video");
  await expect(page.getByRole("button", { name: "Video abspielen", exact: true })).toBeVisible();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Video abspielen", exact: true }).click();
  await expect(video).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Let WebKit render the intermediate preference instead of coalescing both changes.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveJSProperty("paused", true);
  await expect(page.locator(".editorial-video-hero__media")).toHaveAttribute("data-playing", "false");
});

test("unavailable hero video keeps the illuminated poster and content", async ({ page }) => {
  await page.route("**/videos/product/lichtsaum-orbit-v1.mp4", request => request.abort());
  await page.goto(route);
  await expect(page.getByText("Video nicht verfügbar · Standbild")).toBeVisible();
  await expect(page.locator(".editorial-video-hero__media")).toHaveAttribute("data-playing", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".editorial-video-hero__poster")).toBeVisible();
  await expect(page.getByRole("link", { name: "Jetzt konfigurieren" })).toHaveAttribute("href", "/konfigurator");
});

test("menu, configurator draft and enquiry/contact destinations remain functional", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(({ key, draft }) => {
    if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, JSON.stringify(draft));
  }, { key, draft });
  await page.goto("/");
  await page.locator(".site-header").getByRole("link", { name: "Produkt", exact: true }).click();
  await expect(page).toHaveURL(/\/produkt$/);
  await expect(page.locator("#product-hero-video")).toHaveCount(1);
  await page.getByRole("link", { name: "Jetzt konfigurieren" }).click();
  await expect(page).toHaveURL(/\/konfigurator$/);
  await expect(page.getByLabel("Text auf dem Volant")).toHaveValue("ALTER NAME");
  expect(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)!), key)).toEqual(draft);
  await page.goBack();
  await page.getByRole("link", { name: "Reinigung, Neubespannung oder Reparatur besprechen" }).click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await page.goBack();
  await page.locator("main").getByRole("link", { name: "Anfrageformular öffnen", exact: true }).click();
  await expect(page).toHaveURL(/\/#projekt-pruefen$/);
  await expect(page.locator("#projekt-pruefen")).toBeVisible();
  expect(errors).toEqual([]);
});
