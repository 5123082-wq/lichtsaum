import { describe, expect, it } from "vitest";

import { evaluateMiniConfiguratorGeometry } from "@/features/mini-configurator/geometry";
import { DEFAULT_MINI_CONFIGURATOR_CONFIG } from "@/features/mini-configurator/options";
import type {
  MiniConfiguratorCompositionMode,
  MiniConfiguratorTextMeasurement
} from "@/features/mini-configurator/types";

const measurement: MiniConfiguratorTextMeasurement = {
  text: "CAFÉ LICHT",
  fontId: "montserrat",
  visibleHeightMm: 120,
  widthMm: 760,
  svgFontSizeMm: 152,
  baselineOffsetMm: 42
};

describe("mini configurator geometry", () => {
  it("centers the inscription inside the physical valance width", () => {
    const geometry = evaluateMiniConfiguratorGeometry(
      DEFAULT_MINI_CONFIGURATOR_CONFIG,
      measurement
    );

    expect(geometry.issues).toEqual([]);
    expect(geometry.logoCentersMm).toEqual([]);
    expect(geometry.textCenterMm).toBe(1500);
    expect(geometry.textStartMm).toBe(1120);
  });

  it("keeps a left logo separate while the inscription stays centered", () => {
    const geometry = evaluateMiniConfiguratorGeometry(
      {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        compositionMode: "logo-left"
      },
      measurement
    );

    expect(geometry.issues).toEqual([]);
    expect(geometry.logoSizeMm).toBe(120);
    expect(geometry.logoCentersMm).toEqual([180]);
    expect(geometry.textCenterMm).toBe(1500);
  });

  it("places equal logos symmetrically without moving the inscription", () => {
    const geometry = evaluateMiniConfiguratorGeometry(
      {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        compositionMode: "logo-both"
      },
      measurement
    );

    expect(geometry.issues).toEqual([]);
    expect(geometry.logoSizeMm).toBe(120);
    expect(geometry.logoCentersMm).toEqual([180, 2820]);
    expect(geometry.logoCentersMm[0]! + geometry.logoCentersMm[1]!).toBe(3000);
    expect(geometry.textCenterMm).toBe(1500);
  });

  it("reports a letter height larger than the valance height", () => {
    const geometry = evaluateMiniConfiguratorGeometry(
      {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        valanceHeightMm: 200,
        letterHeightMm: 240
      },
      { ...measurement, visibleHeightMm: 240 }
    );

    expect(geometry.issues).toContain("LETTERS_TOO_TALL");
  });

  it("rejects logo layouts when the same centered text only just fits", () => {
    const narrowMeasurement = { ...measurement, widthMm: 760 };
    const textOnlyGeometry = evaluateMiniConfiguratorGeometry(
      {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        valanceWidthMm: 1000
      },
      narrowMeasurement
    );

    expect(textOnlyGeometry.issues).not.toContain("COMPOSITION_TOO_WIDE");

    for (const compositionMode of [
      "logo-left",
      "logo-both"
    ] as const satisfies readonly MiniConfiguratorCompositionMode[]) {
      const geometry = evaluateMiniConfiguratorGeometry(
        {
          ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
          compositionMode,
          valanceWidthMm: 1000
        },
        narrowMeasurement
      );

      expect(geometry.issues).toContain("COMPOSITION_TOO_WIDE");
    }
  });

  it("accepts an inscription exactly on both logo clearance boundaries", () => {
    const geometry = evaluateMiniConfiguratorGeometry(
      {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        compositionMode: "logo-both",
        valanceWidthMm: 1000,
        letterHeightMm: 100
      },
      {
        ...measurement,
        visibleHeightMm: 100,
        widthMm: 660
      }
    );

    expect(geometry.textStartMm).toBe(170);
    expect(geometry.issues).not.toContain("COMPOSITION_TOO_WIDE");
  });
});
