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
export const acceptsProductionLeads = isProductionDeployment;

export const siteUrl = process.env.SITE_URL?.trim() || null;

export const isIndexable = isProductionDeployment && siteUrl !== null;
