import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
] as const;

for (const viewport of viewports) {
  test(`has no page-level horizontal overflow at ${viewport.width}px`, async ({
    page
  }) => {
    await page.setViewportSize(viewport);

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const metrics = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const documentScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const offenders =
        Math.max(documentScrollWidth, bodyScrollWidth) > viewportWidth + 1
          ? Array.from(document.body.querySelectorAll<HTMLElement>("*"))
              .map((element) => {
                const rect = element.getBoundingClientRect();

                return {
                  selector:
                    element.id !== ""
                      ? `#${element.id}`
                      : `${element.tagName.toLowerCase()}${
                          element.classList.length > 0
                            ? `.${Array.from(element.classList).join(".")}`
                            : ""
                        }`,
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width)
                };
              })
              .filter(
                (element) =>
                  element.right > viewportWidth + 1 || element.left < -1
              )
              .slice(0, 12)
          : [];

      return {
        viewportWidth,
        documentScrollWidth,
        bodyScrollWidth,
        offenders
      };
    });

    const diagnostic = JSON.stringify(metrics, null, 2);

    expect(
      metrics.documentScrollWidth,
      `Document overflow at ${viewport.width}px:\n${diagnostic}`
    ).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(
      metrics.bodyScrollWidth,
      `Body overflow at ${viewport.width}px:\n${diagnostic}`
    ).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  });
}

for (const viewport of [
  { width: 320, height: 800 },
  { width: 390, height: 844 }
] as const) {
  test(`keeps the open composition selector inside ${viewport.width}px`, async ({
    page
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const section = page.locator("#konfigurator");
    const trigger = section.getByRole("button", { name: /Komposition:/ });
    const listbox = section.getByRole("listbox", {
      name: "Komposition auswählen"
    });

    await trigger.click();
    await expect(listbox).toBeVisible();

    const bounds = await listbox.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
      viewport.width + 1
    );

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(documentWidth).toBeLessThanOrEqual(viewport.width + 1);
  });
}
