import { expect, test } from "@playwright/test";

import { MINI_CONFIGURATOR_AWNING_COLORS } from "../../src/features/mini-configurator/options";

for (const width of [320, 390, 1440, 1920]) {
  test(`shares all fabric colours between mini and full configurators at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const appearances: unknown[][] = [];
    for (const route of ["/", "/konfigurator"]) {
      await page.goto(route);
      const section = page.locator(route === "/" ? "#konfigurator" : ".full-configurator");
      const trigger = section.getByRole("button", { name: /^Markisenfarbe:/ });
      const listbox = section.getByRole("listbox", { name: "Markisenfarbe auswählen" });
      const values = [];
      for (const colour of MINI_CONFIGURATOR_AWNING_COLORS) {
        await trigger.click();
        await expect(listbox.getByRole("option")).toHaveCount(10);
        const option = listbox.getByRole("option", { name: colour.label, exact: true });
        const optionColour = await option.locator(".configurator-color-swatch").evaluate(el => getComputedStyle(el).backgroundColor);
        await option.click();
        await expect(trigger).toHaveAccessibleName(`Markisenfarbe: ${colour.label}`);
        const product = section.locator(".configurator-preview__product:visible");
        await expect(product.locator(":scope > rect").first()).toHaveAttribute("fill", colour.value);
        const appearance = await product.evaluate(el => Array.from(el.children)
          .filter(node => node.tagName.toLowerCase() === "rect")
          .slice(0, 2).map(node => ({ fill: node.getAttribute("fill"), opacity: node.getAttribute("fill-opacity") })));
        const triggerColour = await trigger.locator(".configurator-color-swatch").evaluate(el => getComputedStyle(el).backgroundColor);
        expect(triggerColour).toBe(optionColour);
        values.push({ label: colour.label, optionColour, triggerColour, appearance });
      }
      appearances.push(values);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    expect(appearances[1]).toEqual(appearances[0]);
  });
}
