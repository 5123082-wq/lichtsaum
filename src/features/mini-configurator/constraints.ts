export type MiniConfiguratorNumericConstraint = Readonly<{
  min: number;
  max?: number;
}>;

export const MINI_CONFIGURATOR_CONSTRAINTS = {
  valanceWidthMm: { min: 1 },
  valanceHeightMm: { min: 200, max: 300 },
  letterHeightMm: { min: 1, max: 180 }
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
