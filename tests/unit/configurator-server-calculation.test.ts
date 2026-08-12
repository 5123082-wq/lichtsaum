import { describe, expect, it } from "vitest";

import {
  CONFIGURATOR_FONTS,
  DEFAULT_CONFIGURATOR_CONFIGURATION
} from "@/features/configurator/options";
import { CONFIGURATOR_PRICING_VERSION } from "@/features/configurator/pricing";
import { calculateConfiguratorAuthoritatively } from "@/features/configurator/server-calculation";
import { measureConfiguratorTextOnServer } from "@/features/configurator/server-font-metrics";

describe("authoritative configurator calculation", () => {
  it("reads every allowlisted local WOFF2 with Latin and Cyrillic glyphs", () => {
    for (const font of CONFIGURATOR_FONTS) {
      const result = measureConfiguratorTextOnServer({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        fontId: font.id,
        text: "CAFÉ LICHT БЕРЛИН"
      });

      expect(result, font.id).toMatchObject({ status: "ok" });
    }
  });

  it("measures the local WOFF2 at explicit 400 weight with shaped metrics", () => {
    const compact = measureConfiguratorTextOnServer({
      ...DEFAULT_CONFIGURATOR_CONFIGURATION,
      text: "AV"
    });
    const spaced = measureConfiguratorTextOnServer({
      ...DEFAULT_CONFIGURATOR_CONFIGURATION,
      text: "A V"
    });

    expect(compact.status).toBe("ok");
    expect(spaced.status).toBe("ok");

    if (compact.status === "ok" && spaced.status === "ok") {
      expect(compact.measurement.widthMm).toBeGreaterThan(0);
      expect(compact.measurement.svgFontSizeMm).toBeGreaterThan(0);
      expect(compact.measurement.widthMm).toBeLessThan(
        spaced.measurement.widthMm
      );
    }
  });

  it("returns one serializable calculation whose geometry drives its panels", async () => {
    const result = await calculateConfiguratorAuthoritatively(
      DEFAULT_CONFIGURATOR_CONFIGURATION
    );

    expect(result.status).toBe("ok");

    if (result.status === "ok") {
      expect(result.calculation.pricingVersion).toBe(
        CONFIGURATOR_PRICING_VERSION
      );
      expect(result.calculation).not.toHaveProperty("markupPercent");
      expect(Number.isSafeInteger(result.calculation.netTotalCents)).toBe(true);
      expect(result.calculation.geometry.issues).toEqual([]);
      expect(result.calculation.panelAllocation.requiredLengthMm).toBe(
        result.calculation.geometry.compositionWidthMm
      );
      expect(result.calculation.panelAllocation.totalLengthMm).toBeGreaterThanOrEqual(
        result.calculation.geometry.compositionWidthMm
      );
      expect(() => JSON.stringify(result)).not.toThrow();
    }
  });

  it("requires reconfirmation when the pricing version is stale", async () => {
    const result = await calculateConfiguratorAuthoritatively(
      DEFAULT_CONFIGURATOR_CONFIGURATION,
      "outdated-version"
    );

    expect(result.status).toBe("pricing-changed");

    if (result.status === "pricing-changed") {
      expect(result.confirmedPricingVersion).toBe("outdated-version");
      expect(result.calculation.pricingVersion).toBe(
        CONFIGURATOR_PRICING_VERSION
      );
    }
  });

  it("rejects a client total and compositions that do not fit", async () => {
    await expect(
      calculateConfiguratorAuthoritatively({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        netTotalCents: 1
      })
    ).resolves.toMatchObject({ status: "invalid" });

    await expect(
      calculateConfiguratorAuthoritatively({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: "W".repeat(60),
        valanceWidthMm: 600,
        letterHeightMm: 180
      })
    ).resolves.toMatchObject({
      status: "invalid",
      issues: expect.arrayContaining([{ code: "COMPOSITION_TOO_WIDE" }])
    });
  });
});
