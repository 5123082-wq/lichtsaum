import { afterEach, describe, expect, it, vi } from "vitest";

async function loadEnvironment() {
  vi.resetModules();
  return import("../../src/config/environment");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("deployment environment", () => {
  it("uses Vercel Production for public indexing and lead intake", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");

    const environment = await loadEnvironment();

    expect(environment.deploymentEnvironment).toBe("production");
    expect(environment.isIndexable).toBe(true);
    expect(environment.acceptsProductionLeads).toBe(true);
  });

  it("keeps Vercel Preview isolated from indexing and lead intake", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");

    const environment = await loadEnvironment();

    expect(environment.isPreviewDeployment).toBe(true);
    expect(environment.isIndexable).toBe(false);
    expect(environment.acceptsProductionLeads).toBe(false);
  });

  it("treats a normal local process as development without SEO overrides", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("SITE_URL", "");

    const environment = await loadEnvironment();

    expect(environment.deploymentEnvironment).toBe("development");
    expect(environment.isPreviewDeployment).toBe(false);
    expect(environment.isIndexable).toBe(false);
    expect(environment.acceptsProductionLeads).toBe(false);
  });
});
