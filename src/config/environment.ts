const knownDeploymentEnvironments = [
  "development",
  "preview",
  "production"
] as const;

export type DeploymentEnvironment =
  (typeof knownDeploymentEnvironments)[number];

const vercelEnvironment = process.env.VERCEL_ENV;

export const deploymentEnvironment: DeploymentEnvironment =
  knownDeploymentEnvironments.includes(
    vercelEnvironment as DeploymentEnvironment
  )
    ? (vercelEnvironment as DeploymentEnvironment)
    : "development";

export const isProductionDeployment =
  deploymentEnvironment === "production";
export const isPreviewDeployment = deploymentEnvironment === "preview";
const productionLeadIntakeRequested =
  process.env.LEAD_INTAKE_ENABLED?.trim() === "true";
export const acceptsProductionLeads =
  isProductionDeployment && productionLeadIntakeRequested;
const productionLeadAttachmentsRequested =
  process.env.LEAD_ATTACHMENTS_ENABLED?.trim() === "true";
export const acceptsProductionLeadAttachments =
  acceptsProductionLeads && productionLeadAttachmentsRequested;
export const displaysLeadAttachmentPicker =
  !isProductionDeployment || acceptsProductionLeadAttachments;

export const siteUrl = process.env.SITE_URL?.trim() || null;
export const searchIndexingEnabled =
  process.env.SEARCH_INDEXING_ENABLED?.trim() === "true";
export const consentUiEnabled =
  process.env.NEXT_PUBLIC_CONSENT_UI_ENABLED?.trim() === "true";

const googleTagsRequested =
  process.env.NEXT_PUBLIC_GOOGLE_TAGS_ENABLED?.trim() === "true";
const configuredGoogleTagManagerId =
  process.env.NEXT_PUBLIC_GTM_CONTAINER_ID?.trim() || null;
const isValidGoogleTagManagerId =
  configuredGoogleTagManagerId !== null &&
  /^GTM-[A-Z0-9]+$/i.test(configuredGoogleTagManagerId);

export const googleTagManagerId = isValidGoogleTagManagerId
  ? configuredGoogleTagManagerId
  : null;
export const googleTagsEnabled =
  isProductionDeployment &&
  googleTagsRequested &&
  consentUiEnabled &&
  googleTagManagerId !== null;

export function assertGoogleTagsConfigurationValidForProduction() {
  if (!isProductionDeployment) {
    return;
  }

  const hasCompleteGoogleTagConfiguration =
    googleTagsRequested && googleTagManagerId !== null;

  if (googleTagsRequested && googleTagManagerId === null) {
    throw new Error(
      "Google tags require a valid NEXT_PUBLIC_GTM_CONTAINER_ID in production."
    );
  }

  if (consentUiEnabled !== hasCompleteGoogleTagConfiguration) {
    throw new Error(
      "Production consent UI and Google tags must be enabled or disabled together."
    );
  }
}

function configuredValue(name: string) {
  return process.env[name]?.trim() || null;
}

function runtimeDatabaseUrl() {
  return (
    configuredValue("lichtsaumdatabase_DATABASE_URL") ??
    configuredValue("DATABASE_URL")
  );
}

function isPostgresUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "postgres:" || url.protocol === "postgresql:") &&
      url.hostname.length > 0 &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

function isAbsoluteHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function assertLeadIntakeConfigurationValidForProduction() {
  if (!isProductionDeployment) {
    return;
  }

  if (productionLeadAttachmentsRequested && !productionLeadIntakeRequested) {
    throw new Error(
      "LEAD_ATTACHMENTS_ENABLED requires LEAD_INTAKE_ENABLED in production."
    );
  }

  if (!acceptsProductionLeads) {
    return;
  }

  const databaseUrl = runtimeDatabaseUrl();
  const requiredValues = [
    ["DATABASE_URL", databaseUrl],
    ["RESEND_API_KEY", configuredValue("RESEND_API_KEY")],
    ["LEAD_EMAIL_FROM", configuredValue("LEAD_EMAIL_FROM")],
    ["LEAD_NOTIFICATION_TO", configuredValue("LEAD_NOTIFICATION_TO")]
  ] as const;
  const missingValues = requiredValues
    .filter(([, value]) => value === null)
    .map(([name]) => name);

  if (missingValues.length > 0) {
    throw new Error(
      `Production lead intake requires: ${missingValues.join(", ")}.`
    );
  }

  if (!isPostgresUrl(databaseUrl!)) {
    throw new Error(
      "Production lead intake requires a valid PostgreSQL runtime database URL."
    );
  }

  if (!acceptsProductionLeadAttachments) {
    return;
  }

  const attachmentRequiredValues = [
    ["BLOB_READ_WRITE_TOKEN", configuredValue("BLOB_READ_WRITE_TOKEN")],
    ["CRON_SECRET", configuredValue("CRON_SECRET")],
    ["LEAD_DOWNLOAD_SECRET", configuredValue("LEAD_DOWNLOAD_SECRET")],
    ["SITE_URL", siteUrl]
  ] as const;
  const missingAttachmentValues = attachmentRequiredValues
    .filter(([, value]) => value === null)
    .map(([name]) => name);

  if (missingAttachmentValues.length > 0) {
    throw new Error(
      `Production lead attachments require: ${missingAttachmentValues.join(", ")}.`
    );
  }

  if (configuredValue("LEAD_DOWNLOAD_SECRET")!.length < 32) {
    throw new Error(
      "LEAD_DOWNLOAD_SECRET must contain at least 32 characters in production."
    );
  }

  if (!isAbsoluteHttpsUrl(siteUrl!)) {
    throw new Error(
      "Production lead attachments require an absolute HTTPS SITE_URL."
    );
  }
}

export const isIndexable =
  isProductionDeployment && siteUrl !== null && searchIndexingEnabled;
