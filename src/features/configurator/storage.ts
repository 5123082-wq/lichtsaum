import { z } from "zod";

import {
  MINI_CONFIGURATOR_STORAGE_KEY,
  parseMiniConfiguratorStoredState
} from "@/features/mini-configurator/storage";
import type { MiniConfiguratorConfig } from "@/features/mini-configurator/types";
import { CONFIGURATOR_STORAGE_KEY } from "@/features/configurator/storage-key";
import {
  CONFIGURATOR_STORAGE_VERSION,
  CONFIGURATOR_SCHEMA_VERSION,
  type ConfiguratorConfigurationV1,
  type ConfiguratorStoredSelection,
  type ConfiguratorStoredStateV1
} from "@/features/configurator/types";
import {
  configuratorConfigurationSchema,
  configuratorServicesSchema,
  parseConfiguratorConfiguration
} from "@/features/configurator/validation";

export { CONFIGURATOR_STORAGE_KEY } from "@/features/configurator/storage-key";
export const LEGACY_MINI_CONFIGURATOR_STORAGE_KEY =
  MINI_CONFIGURATOR_STORAGE_KEY;

const configuratorStoredStateSchema = z.strictObject({
  version: z.literal(CONFIGURATOR_STORAGE_VERSION),
  configuration: configuratorConfigurationSchema,
  services: configuratorServicesSchema
}) satisfies z.ZodType<ConfiguratorStoredStateV1>;

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

export function parseConfiguratorStoredState(
  rawValue: string | null
): ConfiguratorStoredSelection | null {
  if (!rawValue) {
    return null;
  }

  try {
    const result = configuratorStoredStateSchema.safeParse(
      JSON.parse(rawValue) as unknown
    );

    if (!result.success) {
      return null;
    }

    return {
      configuration: result.data.configuration,
      services: result.data.services
    };
  } catch {
    return null;
  }
}

export function writeConfiguratorStoredState(
  storage: WritableStorage,
  selection: ConfiguratorStoredSelection
): boolean {
  const result = configuratorStoredStateSchema.safeParse({
    version: CONFIGURATOR_STORAGE_VERSION,
    configuration: selection.configuration,
    services: selection.services
  });

  if (!result.success) {
    return false;
  }

  try {
    storage.setItem(CONFIGURATOR_STORAGE_KEY, JSON.stringify(result.data));
    return true;
  } catch {
    return false;
  }
}

export function migrateMiniConfiguratorConfiguration(
  miniConfiguration: MiniConfiguratorConfig
): ConfiguratorConfigurationV1 | null {
  return parseConfiguratorConfiguration({
    schemaVersion: CONFIGURATOR_SCHEMA_VERSION,
    compositionMode: miniConfiguration.compositionMode,
    text: miniConfiguration.text,
    fontId: miniConfiguration.fontId,
    valanceWidthMm: miniConfiguration.valanceWidthMm,
    valanceHeightMm: miniConfiguration.valanceHeightMm,
    letterHeightMm: miniConfiguration.letterHeightMm,
    awningColorId: miniConfiguration.awningColorId,
    lightColorId: miniConfiguration.lightColorId
  });
}

export function readOrMigrateConfiguratorStoredState(
  storage: ReadableStorage & WritableStorage
): ConfiguratorStoredSelection | null {
  const currentState = parseConfiguratorStoredState(
    storage.getItem(CONFIGURATOR_STORAGE_KEY)
  );

  if (currentState) {
    return currentState;
  }

  const miniConfiguration = parseMiniConfiguratorStoredState(
    storage.getItem(LEGACY_MINI_CONFIGURATOR_STORAGE_KEY)
  );

  if (!miniConfiguration) {
    return null;
  }

  const configuration = migrateMiniConfiguratorConfiguration(
    miniConfiguration
  );

  if (!configuration) {
    return null;
  }

  const migratedState: ConfiguratorStoredSelection = {
    configuration,
    services: []
  };

  writeConfiguratorStoredState(storage, migratedState);

  return migratedState;
}
