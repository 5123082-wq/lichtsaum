export type MiniConfiguratorNumericConstraint = Readonly<{
  min: number;
  max?: number;
}>;

export const VALANCE_HEIGHTS_MM = [200, 250, 300] as const;

export function isSupportedValanceHeight(value: unknown): value is number {
  return VALANCE_HEIGHTS_MM.some((height) => height === value);
}

export function maximumLetterHeightMm(valanceHeightMm: number): number {
  return isSupportedValanceHeight(valanceHeightMm) ? valanceHeightMm - 130 : 0;
}

export function isValidLetterHeight(value: unknown, valanceHeightMm: number): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) &&
    value >= 1 && value <= maximumLetterHeightMm(valanceHeightMm);
}

export const MINI_CONFIGURATOR_CONSTRAINTS = {
  valanceWidthMm: { min: 1 },
  valanceHeightMm: { min: 200, max: 300 },
  letterHeightMm: { min: 1, max: 170 }
} as const satisfies Readonly<
  Record<
    "valanceWidthMm" | "valanceHeightMm" | "letterHeightMm",
    MiniConfiguratorNumericConstraint
  >
>;

export function isWithinMiniConfiguratorConstraint(
  value: unknown,
  constraint: MiniConfiguratorNumericConstraint
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= constraint.min &&
    (constraint.max === undefined || value <= constraint.max)
  );
}
