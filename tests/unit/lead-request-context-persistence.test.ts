import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LeadRequestContext } from "@/features/lead-form/request-context";

const database = vi.hoisted(() => {
  const returning = vi.fn();
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));
  const existingLimit = vi.fn();
  const existingWhere = vi.fn(() => ({ limit: existingLimit }));
  const rateWhere = vi.fn();
  const select = vi.fn((fields: Record<string, unknown>) => ({
    from: vi.fn(() => ({
      where: "total" in fields ? rateWhere : existingWhere
    }))
  }));

  return {
    existingLimit,
    insert,
    rateWhere,
    returning,
    select,
    values
  };
});

vi.mock("@/db", () => ({
  getDb: () => ({
    insert: database.insert,
    select: database.select
  })
}));

import { createLeadUploadPlan } from "@/features/lead-form/upload-service";

function sqlText(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  if ("value" in value && Array.isArray(value.value)) {
    return value.value.filter((entry) => typeof entry === "string").join("");
  }

  if ("queryChunks" in value && Array.isArray(value.queryChunks)) {
    return value.queryChunks.map(sqlText).join("");
  }

  return "";
}

describe("lead request-context persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    database.existingLimit.mockResolvedValue([]);
    database.rateWhere.mockResolvedValue([{ total: 0 }]);
    database.returning.mockResolvedValue([{ id: 42 }]);
  });

  it("writes the server-produced snapshot into the shared lead row", async () => {
    const requestContext = {
      schemaVersion: 1,
      origin: "full_configurator",
      evaluation: "valid",
      configuration: {
        schemaVersion: 1,
        compositionMode: "text-only",
        text: "CAFÉ LICHT",
        fontId: "montserrat",
        valanceWidthMm: 3000,
        valanceHeightMm: 300,
        letterHeightMm: 120,
        awningColorId: "anthracite",
        lightColorId: "warm-white"
      },
      services: [],
      calculation: {
        pricingVersion: "2026-08-11.v1",
        markupPercent: 0,
        netTotalCents: 67_000,
        measurement: {
          text: "CAFÉ LICHT",
          fontId: "montserrat",
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
          issues: []
        },
        panelAllocation: {
          requiredLengthMm: 900,
          totalLengthMm: 1000,
          wasteMm: 100,
          panelCount: 1,
          counts: { 600: 0, 1000: 1, 1200: 0 }
        }
      },
      pricingVersion: "2026-08-11.v1",
      netTotalCents: 67_000
    } as const satisfies LeadRequestContext;

    await createLeadUploadPlan(
      {
        email: "projekt@example.test",
        sourcePath: "/konfigurator",
        requestContext
      },
      {
        idempotencyKey: "00000000-0000-4000-8000-000000000321",
        uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      []
    );

    expect(database.values).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "projekt@example.test",
        sourcePath: "/konfigurator",
        requestContext
      })
    );
  });

  it("keeps the existing per-email rate limit ahead of configurator persistence", async () => {
    database.rateWhere.mockResolvedValueOnce([{ total: 3 }]);

    await expect(
      createLeadUploadPlan(
        {
          email: "projekt@example.test",
          sourcePath: "/konfigurator"
        },
        {
          idempotencyKey: "00000000-0000-4000-8000-000000000321",
          uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        },
        []
      )
    ).rejects.toThrow("Lead submission rate limit exceeded.");
    expect(database.insert).not.toHaveBeenCalled();
  });

  it("compares rate-limit email case-insensitively without rewriting storage", async () => {
    const email = "Projekt@Example.Test";

    await createLeadUploadPlan(
      { email, sourcePath: "/konfigurator" },
      {
        idempotencyKey: "00000000-0000-4000-8000-000000000321",
        uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      []
    );

    const rateCondition = database.rateWhere.mock.calls[0]?.[0];

    expect(sqlText(rateCondition)).toContain("lower(");
    expect(database.values).toHaveBeenCalledWith(
      expect.objectContaining({ email })
    );
  });
});
