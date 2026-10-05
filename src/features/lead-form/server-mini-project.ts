import "server-only";

import { measureConfiguratorTextOnServer } from "@/features/configurator/server-font-metrics";
import { MINI_CONFIGURATOR_CONSTRAINTS, isWithinMiniConfiguratorConstraint } from "@/features/mini-configurator/constraints";
import { evaluateMiniConfiguratorGeometry } from "@/features/mini-configurator/geometry";
import { z } from "zod";
import {
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_COMPOSITION_MODES,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS,
  MINI_CONFIGURATOR_PREVIEW_MODES,
  SUPPORTED_MINI_CONFIGURATOR_TEXT,
  normalizeAwningColorId
} from "@/features/mini-configurator/options";
import type { MiniProjectSubmission, MiniProjectSnapshot } from "./request-context";
import type { PreparedConfiguratorProjectContext } from "./server-request-context";

const dimension = z.number().finite().min(-Number.MAX_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER).optional();

const miniProjectSubmissionSchema = z.strictObject({
  schemaVersion: z.literal(1),
  configuration: z.strictObject({
    compositionMode: z.enum(MINI_CONFIGURATOR_COMPOSITION_MODES.map((option) => option.id)),
    text: z.string().max(60).refine((value) => !/[\u0000-\u001F\u007F]/u.test(value)),
    fontId: z.enum(MINI_CONFIGURATOR_FONTS.map((option) => option.id)),
    valanceWidthMm: dimension,
    valanceHeightMm: dimension,
    letterHeightMm: dimension,
    awningColorId: z.preprocess(normalizeAwningColorId, z.enum(MINI_CONFIGURATOR_AWNING_COLORS.map((option) => option.id))),
    lightColorId: z.enum(MINI_CONFIGURATOR_LIGHT_COLORS.map((option) => option.id)),
    previewMode: z.enum(MINI_CONFIGURATOR_PREVIEW_MODES.map((option) => option.id))
  })
}) satisfies z.ZodType<MiniProjectSubmission>;

export function prepareMiniProjectContext(input: unknown): PreparedConfiguratorProjectContext {
  const parsed = miniProjectSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { kind: "invalid", message: "Der angehängte Entwurf ist nicht gültig. Bitte prüfen oder entfernen Sie ihn." };
  }
  const configuration = parsed.data.configuration;
  const { valanceWidthMm, valanceHeightMm, letterHeightMm } = configuration;
  const invalidSize = Object.entries(MINI_CONFIGURATOR_CONSTRAINTS).some(([key, constraint]) => {
    const value = configuration[key as keyof typeof MINI_CONFIGURATOR_CONSTRAINTS];
    return value !== undefined && !isWithinMiniConfiguratorConstraint(value, constraint);
  });
  let evaluation: MiniProjectSnapshot["evaluation"] = "manual_review";
  if (invalidSize || !SUPPORTED_MINI_CONFIGURATOR_TEXT.test(configuration.text)) {
    evaluation = "invalid";
  } else if (!configuration.text.trim() || valanceWidthMm === undefined || valanceHeightMm === undefined || letterHeightMm === undefined) {
    evaluation = "incomplete";
  } else {
    const complete = { ...configuration, valanceWidthMm, valanceHeightMm, letterHeightMm };
    const measured = measureConfiguratorTextOnServer(complete);
    if (measured.status === "unsupported-glyph" || (measured.status === "ok" && evaluateMiniConfiguratorGeometry(complete, measured.measurement).issues.length > 0)) {
      evaluation = "invalid";
    }
    // A font-service failure leaves an unpriced draft for manual review.
  }
  return { kind: "ready", requestContext: { ...parsed.data, origin: "mini_configurator", evaluation } };
}
