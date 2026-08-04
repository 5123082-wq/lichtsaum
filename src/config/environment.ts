const knownEnvironments = ["local", "preview", "production"] as const;

export type AppEnvironment = (typeof knownEnvironments)[number];

const requestedEnvironment = process.env.APP_ENV ?? "local";

export const appEnvironment: AppEnvironment = knownEnvironments.includes(
  requestedEnvironment as AppEnvironment
)
  ? (requestedEnvironment as AppEnvironment)
  : "local";

export const siteUrl = process.env.SITE_URL?.trim() || null;

export const isIndexable =
  appEnvironment === "production" && siteUrl !== null;

export const isPrototype = !isIndexable;
