import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIGURATOR_CONFIGURATION } from "@/features/configurator/options";
import {
  CONFIGURATOR_STORAGE_KEY,
  LEGACY_MINI_CONFIGURATOR_STORAGE_KEY,
  parseConfiguratorStoredState,
  readOrMigrateConfiguratorStoredState,
  writeConfiguratorStoredState
} from "@/features/configurator/storage";

function createMemoryStorage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    value(key: string) {
      return values.get(key) ?? null;
    }
  };
}

describe("full configurator session storage", () => {
  it("round-trips only allowlisted configuration and services", () => {
    const storage = createMemoryStorage();

    expect(
      writeConfiguratorStoredState(storage, {
        configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
        services: ["design", "site-measurement"],
        postalCode: "10115"
      } as never)
    ).toBe(true);

    const raw = storage.value(CONFIGURATOR_STORAGE_KEY);
    expect(raw).not.toContain("10115");
    expect(parseConfiguratorStoredState(raw)).toEqual({
      configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
      services: ["design", "site-measurement"]
    });
  });

  it("fails closed for unknown or malformed stored fields", () => {
    expect(
      parseConfiguratorStoredState(
        JSON.stringify({
          version: 1,
          configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
          services: [],
          postalCode: "10115"
        })
      )
    ).toBeNull();
    expect(parseConfiguratorStoredState("{")) .toBeNull();
  });

  it("migrates the mini-configurator v2 payload and preserves no PLZ", () => {
    const storage = createMemoryStorage({
      [LEGACY_MINI_CONFIGURATOR_STORAGE_KEY]: JSON.stringify({
        version: 2,
        configuration: {
          compositionMode: "logo-left",
          text: "LICHTSAUM",
          fontId: "oswald",
          valanceWidthMm: 3600,
          valanceHeightMm: 280,
          letterHeightMm: 140,
          awningColorId: "night-blue",
          lightColorId: "neutral-white",
          previewMode: "night"
        }
      })
    });

    expect(readOrMigrateConfiguratorStoredState(storage)).toEqual({
      configuration: {
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        compositionMode: "logo-left",
        text: "LICHTSAUM",
        fontId: "oswald",
        valanceWidthMm: 3600,
        valanceHeightMm: 280,
        letterHeightMm: 140,
        awningColorId: "night-blue",
        lightColorId: "neutral-white"
      },
      services: []
    });
    expect(storage.value(CONFIGURATOR_STORAGE_KEY)).not.toBeNull();
  });
});
