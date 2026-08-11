import { z } from "zod";

import {
  CONFIGURATOR_AWNING_COLORS,
  CONFIGURATOR_COMPOSITION_MODES,
  CONFIGURATOR_CONSTRAINTS,
  CONFIGURATOR_FONTS,
  CONFIGURATOR_LIGHT_COLORS,
  CONFIGURATOR_SERVICES,
  SUPPORTED_CONFIGURATOR_TEXT
} from "@/features/configurator/options";
import { CONFIGURATOR_SCHEMA_VERSION } from "@/features/configurator/types";
import type {
  ConfiguratorConfigurationV1,
  ConfiguratorProjectSelection,
  ConfiguratorServiceId
} from "@/features/configurator/types";

const compositionModeIds = CONFIGURATOR_COMPOSITION_MODES.map(
  (option) => option.id
);
const fontIds = CONFIGURATOR_FONTS.map((option) => option.id);
const awningColorIds = CONFIGURATOR_AWNING_COLORS.map((option) => option.id);
const lightColorIds = CONFIGURATOR_LIGHT_COLORS.map((option) => option.id);
const serviceIds = CONFIGURATOR_SERVICES.map((option) => option.id);

const millimeterSchema = z.number().int().safe();

export const configuratorConfigurationSchema = z.strictObject({
  schemaVersion: z.literal(CONFIGURATOR_SCHEMA_VERSION),
  compositionMode: z.enum(compositionModeIds),
  text: z
    .string()
    .min(1)
    .max(60)
    .refine((value) => value.trim().length > 0)
    .refine((value) => !/[\u0000-\u001F\u007F]/u.test(value))
    .refine((value) => SUPPORTED_CONFIGURATOR_TEXT.test(value)),
  fontId: z.enum(fontIds),
  valanceWidthMm: millimeterSchema.min(
    CONFIGURATOR_CONSTRAINTS.valanceWidthMm.min
  ),
  valanceHeightMm: millimeterSchema
    .min(CONFIGURATOR_CONSTRAINTS.valanceHeightMm.min)
    .max(CONFIGURATOR_CONSTRAINTS.valanceHeightMm.max),
  letterHeightMm: millimeterSchema
    .min(CONFIGURATOR_CONSTRAINTS.letterHeightMm.min)
    .max(CONFIGURATOR_CONSTRAINTS.letterHeightMm.max),
  awningColorId: z.enum(awningColorIds),
  lightColorId: z.enum(lightColorIds)
}) satisfies z.ZodType<ConfiguratorConfigurationV1>;

export const configuratorServicesSchema = z
  .array(z.enum(serviceIds))
  .max(serviceIds.length)
  .refine((services) => new Set(services).size === services.length) satisfies z.ZodType<
  ConfiguratorServiceId[]
>;

export const configuratorProjectSelectionSchema = z.strictObject({
  configuration: configuratorConfigurationSchema,
  services: configuratorServicesSchema,
  postalCode: z.string().regex(/^\d{5}$/).optional()
}) satisfies z.ZodType<ConfiguratorProjectSelection>;

export function parseConfiguratorConfiguration(
  value: unknown
): ConfiguratorConfigurationV1 | null {
  const result = configuratorConfigurationSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function parseConfiguratorProjectSelection(
  value: unknown
): ConfiguratorProjectSelection | null {
  const result = configuratorProjectSelectionSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function getConfiguratorValidationIssuePaths(
  value: unknown
): readonly string[] {
  const result = configuratorConfigurationSchema.safeParse(value);

  if (result.success) {
    return [];
  }

  return [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
}
