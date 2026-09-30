import type {
  ConfiguratorCalculation,
  ConfiguratorConfigurationV1,
  ConfiguratorProjectSelection,
  ConfiguratorServiceId
} from "@/features/configurator/types";
import type { MiniConfiguratorConfig } from "@/features/mini-configurator/types";

export const CONFIGURATOR_PROJECT_SNAPSHOT_SCHEMA_VERSION = 1 as const;

/**
 * Raw, client-submitted configurator values. A calculated total is deliberately
 * absent: the server reproduces it before creating a lead.
 */
export interface ConfiguratorProjectSubmission
  extends ConfiguratorProjectSelection {
  confirmedPricingVersion: string;
}

/** Server-produced request context persisted together with the shared lead. */
export interface ConfiguratorProjectSnapshot {
  schemaVersion: typeof CONFIGURATOR_PROJECT_SNAPSHOT_SCHEMA_VERSION;
  origin: "full_configurator";
  evaluation: "valid";
  configuration: ConfiguratorConfigurationV1;
  services: readonly ConfiguratorServiceId[];
  postalCode?: string;
  calculation: ConfiguratorCalculation;
  pricingVersion: string;
  netTotalCents: number;
}

export type MiniProjectConfiguration = Omit<
  MiniConfiguratorConfig,
  "valanceWidthMm" | "valanceHeightMm" | "letterHeightMm"
> & Partial<Pick<MiniConfiguratorConfig,
  "valanceWidthMm" | "valanceHeightMm" | "letterHeightMm"
>>;

export interface MiniProjectSubmission {
  schemaVersion: 1;
  configuration: MiniProjectConfiguration;
}

export interface MiniProjectSnapshot extends MiniProjectSubmission {
  origin: "mini_configurator";
  evaluation: "incomplete" | "invalid" | "manual_review";
}

export type LeadRequestContext = ConfiguratorProjectSnapshot | MiniProjectSnapshot;
