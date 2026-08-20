import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ConfiguratorCalculation,
  ConfiguratorConfigurationV1
} from "@/features/configurator/types";

const calculationMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/configurator/server-calculation", () => ({
  calculateConfiguratorAuthoritatively: calculationMock
}));

import { prepareConfiguratorProjectContext } from "@/features/lead-form/server-request-context";

const configuration = {
  schemaVersion: 1,
  compositionMode: "text-only",
  text: "CAFÉ LICHT",
  fontId: "montserrat",
  valanceWidthMm: 3000,
  valanceHeightMm: 300,
  letterHeightMm: 120,
  awningColorId: "anthracite",
  lightColorId: "warm-white"
} as const satisfies ConfiguratorConfigurationV1;

const calculation = {
  pricingVersion: "2026-08-20.v4",
  netTotalCents: 67_000,
  measurement: {
    text: configuration.text,
    fontId: configuration.fontId,
    visibleHeightMm: 120,
    widthMm: 900,
    svgFontSizeMm: 140,
    baselineOffsetMm: 20
  },
  geometry: {
    safeMarginMm: 120,
    availableWidthMm: 2760,
    compositionWidthMm: 900,
    compositionStartMm: 1050,
    compositionEndMm: 1950,
    textStartMm: 1050,
    textCenterMm: 1500,
    textBaselineMm: 170,
    logoCentersMm: [],
    logoSizeMm: 0,
    logoGapMm: 0,
    lightSegmentLengthsMm: [900],
    issues: []
  },
  panelAllocation: {
    requiredLengthMm: 900,
    totalLengthMm: 1000,
    wasteMm: 100,
    panelCount: 1,
    counts: { 600: 0, 1000: 1, 1200: 0 }
  }
} as const satisfies ConfiguratorCalculation;

const validSubmission = {
  configuration,
  services: ["design", "site-measurement"] as const,
  postalCode: "10115",
  confirmedPricingVersion: calculation.pricingVersion
};

describe("prepareConfiguratorProjectContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calculationMock.mockResolvedValue({ status: "ok", calculation });
  });

  it("keeps a plain lead free of configurator context", async () => {
    await expect(prepareConfiguratorProjectContext(undefined)).resolves.toEqual({
      kind: "absent"
    });
    expect(calculationMock).not.toHaveBeenCalled();
  });

  it("persists only the validated selection and authoritative calculation", async () => {
    const result = await prepareConfiguratorProjectContext(validSubmission);

    expect(calculationMock).toHaveBeenCalledWith(
      configuration,
      calculation.pricingVersion
    );
    expect(result).toEqual({
      kind: "ready",
      requestContext: {
        schemaVersion: 1,
        origin: "full_configurator",
        evaluation: "valid",
        configuration,
        services: ["design", "site-measurement"],
        postalCode: "10115",
        calculation,
        pricingVersion: calculation.pricingVersion,
        netTotalCents: calculation.netTotalCents
      }
    });
  });

  it("rejects a forged client total instead of accepting or persisting it", async () => {
    const result = await prepareConfiguratorProjectContext({
      ...validSubmission,
      netTotalCents: 1
    });

    expect(result).toEqual({
      kind: "invalid",
      message: "Die angehängte Konfiguration ist nicht gültig."
    });
    expect(calculationMock).not.toHaveBeenCalled();
  });

  it("rejects unknown fields inside the raw configuration", async () => {
    const result = await prepareConfiguratorProjectContext({
      ...validSubmission,
      configuration: { ...configuration, calculation: { netTotalCents: 1 } }
    });

    expect(result.kind).toBe("invalid");
    expect(calculationMock).not.toHaveBeenCalled();
  });

  it("validates the optional German postal code", async () => {
    const result = await prepareConfiguratorProjectContext({
      ...validSubmission,
      postalCode: "1011"
    });

    expect(result.kind).toBe("invalid");
    expect(calculationMock).not.toHaveBeenCalled();
  });

  it("returns an updated authoritative result and no snapshot on a pricing-version mismatch", async () => {
    calculationMock.mockResolvedValueOnce({
      status: "pricing-changed",
      confirmedPricingVersion: "2026-08-10.v0",
      calculation
    });

    await expect(
      prepareConfiguratorProjectContext({
        ...validSubmission,
        confirmedPricingVersion: "2026-08-10.v0"
      })
    ).resolves.toEqual({
      kind: "pricing_changed",
      pricingVersion: calculation.pricingVersion,
      calculation
    });
  });

  it("does not let requested services change the calculation input", async () => {
    await prepareConfiguratorProjectContext({
      ...validSubmission,
      services: ["electrical-connection"]
    });

    expect(calculationMock).toHaveBeenCalledWith(
      configuration,
      calculation.pricingVersion
    );
  });
});
