import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIGURATOR_CONFIGURATION } from "@/features/configurator/options";
import { parseConfiguratorStoredState } from "@/features/configurator/storage";
import { CONFIGURATOR_STORAGE_VERSION } from "@/features/configurator/types";
import { parseConfiguratorConfiguration } from "@/features/configurator/validation";
import { prepareMiniProjectContext } from "@/features/lead-form/server-mini-project";
import { DEFAULT_MINI_CONFIGURATOR_CONFIG } from "@/features/mini-configurator/options";
import { parseMiniConfiguratorStoredState } from "@/features/mini-configurator/storage";
import { MINI_CONFIGURATOR_STATE_VERSION } from "@/features/mini-configurator/types";

describe("fabric palette compatibility", () => {
  it("restores legacy white in both saved drafts without losing their content", () => {
    const mini = { ...DEFAULT_MINI_CONFIGURATOR_CONFIG, text: "MEIN CAFÉ", awningColorId: "white" };
    expect(parseMiniConfiguratorStoredState(JSON.stringify({ version: MINI_CONFIGURATOR_STATE_VERSION, configuration: mini })))
      .toEqual({ ...mini, awningColorId: "cream-white" });
    const full = { ...DEFAULT_CONFIGURATOR_CONFIGURATION, text: "MEIN CAFÉ", awningColorId: "white" };
    expect(parseConfiguratorStoredState(JSON.stringify({ version: CONFIGURATOR_STORAGE_VERSION, configuration: full, services: ["design"] })))
      .toEqual({ configuration: { ...full, awningColorId: "cream-white" }, services: ["design"] });
  });

  it("accepts the retired white from an older open client at both server boundaries", () => {
    expect(parseConfiguratorConfiguration({ ...DEFAULT_CONFIGURATOR_CONFIGURATION, awningColorId: "white" })?.awningColorId)
      .toBe("cream-white");
    expect(prepareMiniProjectContext({ schemaVersion: 1, configuration: { ...DEFAULT_MINI_CONFIGURATOR_CONFIG, awningColorId: "white" } }))
      .toMatchObject({ kind: "ready", requestContext: { configuration: { awningColorId: "cream-white" } } });
  });

  it.each(["unknown", null, 42, {}, ["white"]])("continues to reject an invalid colour: %j", (awningColorId) => {
    expect(parseConfiguratorConfiguration({ ...DEFAULT_CONFIGURATOR_CONFIGURATION, awningColorId })).toBeNull();
    expect(prepareMiniProjectContext({ schemaVersion: 1, configuration: { ...DEFAULT_MINI_CONFIGURATOR_CONFIG, awningColorId } }).kind).toBe("invalid");
  });
});
