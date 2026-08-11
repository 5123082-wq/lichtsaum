import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.skip(
  process.env.NEXT_PUBLIC_CONSENT_UI_ENABLED !== "true",
  "Consent UI is intentionally dormant while optional tags are disabled."
);

const googleHosts = [
  "googletagmanager.com",
  "google-analytics.com",
  "googleadservices.com",
  "doubleclick.net"
];

const googleTagsConfigured =
  process.env.NEXT_PUBLIC_GOOGLE_TAGS_ENABLED === "true" &&
  /^GTM-[A-Z0-9]+$/i.test(process.env.NEXT_PUBLIC_GTM_CONTAINER_ID ?? "");

async function latestConsentSignals(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const entries = (
      window as Window & { dataLayer?: ArrayLike<unknown>[] }
    ).dataLayer ?? [];
    const commands = entries
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === "consent");

    return commands.at(-1)?.[2] as
      | {
          analytics_storage: "denied" | "granted";
          ad_storage: "denied" | "granted";
          ad_user_data: "denied" | "granted";
          ad_personalization: "denied";
        }
      | undefined;
  });
}

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test("keeps optional Google traffic blocked and supports reject, revoke and accept", async ({
  page
}) => {
  test.skip(
    googleTagsConfigured,
    "The configured-boundary scenario has its own intercepted-network test."
  );

  const optionalRequests: string[] = [];
  page.on("request", (request) => {
    if (googleHosts.some((host) => request.url().includes(host))) {
      optionalRequests.push(request.url());
    }
  });

  await page.goto("/");

  const banner = page.getByTestId("consent-banner");
  await expect(banner).toBeVisible();
  await expect(
    banner.getByRole("button", { name: "Auswahl anpassen" })
  ).toBeVisible();
  await expect(
    banner.getByRole("button", { name: "Alle ablehnen" })
  ).toBeVisible();
  await expect(
    banner.getByRole("button", { name: "Alle akzeptieren" })
  ).toBeVisible();

  const bannerBox = await banner.boundingBox();
  const viewport = page.viewportSize();
  expect(bannerBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(bannerBox!.x).toBeGreaterThan(viewport!.width / 2);
  expect(viewport!.width - bannerBox!.x - bannerBox!.width).toBeLessThanOrEqual(
    40
  );
  expect(bannerBox!.width).toBeLessThanOrEqual(560);

  const bannerAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(bannerAudit.violations).toEqual([]);

  await banner.getByRole("button", { name: "Alle ablehnen" }).click();
  await expect(banner).toBeHidden();
  expect(optionalRequests).toEqual([]);

  await page.reload();
  await expect(banner).toHaveCount(0);
  await page
    .getByRole("button", { name: "Cookie-Einstellungen" })
    .click();

  const dialog = page.getByRole("dialog", { name: "Cookie-Einstellungen" });
  const analytics = dialog.getByRole("checkbox", { name: /Analytics/ });
  const marketing = dialog.getByRole("checkbox", { name: /Marketing/ });
  await expect(dialog).toBeVisible();
  await expect(analytics).not.toBeChecked();
  await expect(marketing).not.toBeChecked();

  const dialogAudit = await new AxeBuilder({ page })
    .include(".consent-dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(dialogAudit.violations).toEqual([]);

  await analytics.check();
  await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
  await expect(dialog).toBeHidden();

  await page
    .getByRole("button", { name: "Cookie-Einstellungen" })
    .click();
  await expect(analytics).toBeChecked();
  await expect(marketing).not.toBeChecked();
  await dialog.getByRole("button", { name: "Alle akzeptieren" }).click();
  await expect(dialog).toBeHidden();
  expect(optionalRequests).toEqual([]);
});

test("loads a configured GTM boundary only after consent and applies independent signals", async ({
  page
}) => {
  test.skip(
    !googleTagsConfigured,
    "Runs only in the isolated dummy-GTM consent-boundary configuration."
  );

  const googleRequests: string[] = [];
  page.on("request", (request) => {
    if (googleHosts.some((host) => request.url().includes(host))) {
      googleRequests.push(request.url());
    }
  });
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.__lichtsaumDummyGtmExecuted = true;"
    })
  );

  await page.goto("/");
  await expect(page.getByTestId("consent-banner")).toBeVisible();
  expect(googleRequests).toEqual([]);
  expect(await latestConsentSignals(page)).toEqual({
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  await page
    .getByTestId("consent-banner")
    .getByRole("button", { name: "Auswahl anpassen" })
    .click();
  let dialog = page.getByRole("dialog", { name: "Cookie-Einstellungen" });
  await dialog.getByRole("checkbox", { name: /Analytics/ }).check();
  await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
  await expect.poll(() => googleRequests.length).toBe(1);
  expect(
    await page.evaluate(() =>
      (
        (window as Window & { dataLayer?: unknown[] }).dataLayer ?? []
      ).some(
        (entry) =>
          typeof entry === "object" &&
          entry !== null &&
          (entry as Record<string, unknown>).event === "gtm.js"
      )
    )
  ).toBe(true);
  expect(await latestConsentSignals(page)).toEqual({
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  dialog = page.getByRole("dialog", { name: "Cookie-Einstellungen" });
  await dialog.getByRole("checkbox", { name: /Analytics/ }).uncheck();
  await dialog.getByRole("checkbox", { name: /Marketing/ }).check();
  await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
  expect(await latestConsentSignals(page)).toEqual({
    analytics_storage: "denied",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "denied"
  });

  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  await page
    .getByRole("dialog", { name: "Cookie-Einstellungen" })
    .getByRole("button", { name: "Alle akzeptieren" })
    .click();
  expect(await latestConsentSignals(page)).toEqual({
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "denied"
  });

  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  dialog = page.getByRole("dialog", { name: "Cookie-Einstellungen" });
  await dialog.getByRole("checkbox", { name: /Analytics/ }).uncheck();
  await dialog.getByRole("button", { name: "Auswahl speichern" }).click();
  expect(await latestConsentSignals(page)).toEqual({
    analytics_storage: "denied",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "denied"
  });

  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  const reloaded = page.waitForEvent("load");
  await page
    .getByRole("dialog", { name: "Cookie-Einstellungen" })
    .getByRole("button", { name: "Alle ablehnen" })
    .click();
  await reloaded;
  await expect(page.getByTestId("consent-banner")).toHaveCount(0);
  expect(googleRequests).toHaveLength(1);
  await expect.poll(() => latestConsentSignals(page)).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
});
