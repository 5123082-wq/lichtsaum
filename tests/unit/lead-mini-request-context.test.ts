import { describe, expect, it } from "vitest";
import { prepareMiniProjectContext } from "@/features/lead-form/server-mini-project";

const configuration = {
  compositionMode: "text-only", text: "CAFÉ LICHT", fontId: "montserrat",
  valanceWidthMm: 3000, valanceHeightMm: 300, letterHeightMm: 120,
  awningColorId: "anthracite", lightColorId: "warm-white", previewMode: "night"
};

function prepare(overrides: Record<string, unknown> = {}) {
  return prepareMiniProjectContext({ schemaVersion: 1, configuration: { ...configuration, ...overrides } });
}

describe("mini sketch server boundary", () => {
  it("preserves complete sketches for manual review without a price", () => {
    const result = prepare();
    expect(result).toEqual({ kind: "ready", requestContext: {
      schemaVersion: 1, origin: "mini_configurator", evaluation: "manual_review", configuration
    } });
    expect(JSON.stringify(result)).not.toMatch(/price|netTotal|calculation/i);
  });

  it("keeps absent dimensions absent rather than using preview defaults", () => {
    const result = prepare({ valanceWidthMm: undefined, letterHeightMm: undefined, text: "" });
    expect(result).toMatchObject({ kind: "ready", requestContext: { evaluation: "incomplete" } });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("valanceWidthMm");
    expect(serialized).not.toContain("letterHeightMm");
    expect(serialized).toContain('"valanceHeightMm":300');
  });

  it.each([{ valanceWidthMm: 100 }, { letterHeightMm: -1 }, { valanceHeightMm: 999 }, { text: "🚀" }])(
    "accepts technically invalid sketches with a server-owned invalid status: %j", (change) => {
      expect(prepare(change)).toMatchObject({ kind: "ready", requestContext: { evaluation: "invalid" } });
    }
  );

  it.each([
    { schemaVersion: 2, configuration },
    { schemaVersion: 1, configuration, evaluation: "valid" },
    { schemaVersion: 1, configuration, netTotalCents: 1 },
    { schemaVersion: 1, configuration: { ...configuration, fontId: "unknown" } },
    { schemaVersion: 1, configuration: { ...configuration, valanceWidthMm: "3000" } },
    { schemaVersion: 1, configuration: { ...configuration, letterHeightMm: Infinity } },
    { schemaVersion: 1, configuration: { ...configuration, text: "x".repeat(61) } },
    { schemaVersion: 1, configuration: { ...configuration, text: "line\nbreak" } },
    { schemaVersion: 1, configuration: { ...configuration, secret: "injected" } }
  ])("rejects untrusted fields, versions and malformed values", (input) => {
    expect(prepareMiniProjectContext(input).kind).toBe("invalid");
  });
});
