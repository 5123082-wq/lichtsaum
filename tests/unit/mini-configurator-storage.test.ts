import { describe, expect, it, vi } from "vitest";

import { DEFAULT_MINI_CONFIGURATOR_CONFIG } from "@/features/mini-configurator/options";
import {
  MINI_CONFIGURATOR_STORAGE_KEY,
  parseMiniConfiguratorStoredState,
  writeMiniConfiguratorStoredState
} from "@/features/mini-configurator/storage";

describe("mini configurator storage", () => {
  it.each(["text-only", "logo-left", "logo-both"] as const)(
    "writes and restores the %s composition",
    (compositionMode) => {
      const setItem = vi.fn();
      const configuration = {
        ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
        compositionMode
      };

      writeMiniConfiguratorStoredState({ setItem }, configuration);

      expect(setItem).toHaveBeenCalledOnce();
      expect(setItem).toHaveBeenCalledWith(
        MINI_CONFIGURATOR_STORAGE_KEY,
        expect.any(String)
      );

      const rawValue = setItem.mock.calls[0]?.[1];
      expect(parseMiniConfiguratorStoredState(rawValue)).toEqual(configuration);
      expect(rawValue).toContain('"version":2');
      expect(rawValue).toContain(`"compositionMode":"${compositionMode}"`);
      expect(rawValue).not.toContain("brandingMode");
    }
  );

  it("rejects unknown versions", () => {
    expect(
      parseMiniConfiguratorStoredState(
        JSON.stringify({
          version: 3,
          configuration: DEFAULT_MINI_CONFIGURATOR_CONFIG
        })
      )
    ).toBeNull();
  });

  it.each([
    ["valanceWidthMm", 0],
    ["valanceHeightMm", 199],
    ["valanceHeightMm", 301],
    ["letterHeightMm", 0],
    ["letterHeightMm", 181]
  ] as const)("rejects %s=%i from version 2 storage", (key, value) => {
    expect(
      parseMiniConfiguratorStoredState(
        JSON.stringify({
          version: 2,
          configuration: {
            ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
            [key]: value
          }
        })
      )
    ).toBeNull();
  });

  it.each([
    { valanceHeightMm: 200, letterHeightMm: 1 },
    { valanceHeightMm: 300, letterHeightMm: 180 }
  ])("accepts the inclusive physical boundaries: %o", (boundaries) => {
    const configuration = {
      ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
      ...boundaries
    };

    expect(
      parseMiniConfiguratorStoredState(
        JSON.stringify({ version: 2, configuration })
      )
    ).toEqual(configuration);
  });

  it("rejects legacy and unknown composition modes", () => {
    expect(
      parseMiniConfiguratorStoredState(
        JSON.stringify({
          version: 1,
          configuration: {
            ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
            compositionMode: undefined,
            brandingMode: "logo-name"
          }
        })
      )
    ).toBeNull();

    for (const compositionMode of ["segmented", "logo-name", "unknown"]) {
      expect(
        parseMiniConfiguratorStoredState(
          JSON.stringify({
            version: 2,
            configuration: {
              ...DEFAULT_MINI_CONFIGURATOR_CONFIG,
              compositionMode
            }
          })
        )
      ).toBeNull();
    }
  });
});
