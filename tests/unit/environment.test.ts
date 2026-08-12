import { afterEach, describe, expect, it, vi } from "vitest";

async function loadEnvironment() {
  vi.resetModules();
  return import("../../src/config/environment");
}

function stubLeadRuntimeConfiguration() {
  vi.stubEnv(
    "DATABASE_URL",
    "postgresql://user:password@example.test/lichtsaum?sslmode=require"
  );
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv(
    "LEAD_EMAIL_FROM",
    "LICHTSAUM Website <info@lichtsaum.com>"
  );
  vi.stubEnv("LEAD_NOTIFICATION_TO", "info@lichtsaum.com");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("deployment environment", () => {
  it("uses Vercel Production for public indexing while lead intake defaults off", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");

    const environment = await loadEnvironment();

    expect(environment.deploymentEnvironment).toBe("production");
    expect(environment.isIndexable).toBe(true);
    expect(environment.acceptsProductionLeads).toBe(false);
    expect(environment.acceptsProductionLeadAttachments).toBe(false);
    expect(environment.displaysLeadAttachmentPicker).toBe(false);
  });

  it.each([
    "http://www.lichtsaum.com",
    "https://lichtsaum.com",
    "https://www.lichtsaum.com/other-page",
    "https://www.lichtsaum.com/?preview=true"
  ])(
    "keeps production indexing fail-closed for noncanonical SITE_URL %s",
    async (configuredSiteUrl) => {
      vi.stubEnv("VERCEL_ENV", "production");
      vi.stubEnv("SITE_URL", configuredSiteUrl);
      vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");

      const environment = await loadEnvironment();

      expect(environment.isIndexable).toBe(false);
    }
  );

  it("enables production lead intake only through its explicit release flag", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");

    const environment = await loadEnvironment();

    expect(environment.acceptsProductionLeads).toBe(true);
    expect(environment.acceptsProductionLeadAttachments).toBe(false);
  });

  it("enables production attachments only through their explicit release flag", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");
    vi.stubEnv("LEAD_ATTACHMENTS_ENABLED", "true");

    const environment = await loadEnvironment();

    expect(environment.acceptsProductionLeads).toBe(true);
    expect(environment.acceptsProductionLeadAttachments).toBe(true);
    expect(environment.displaysLeadAttachmentPicker).toBe(true);
  });

  it("keeps production indexing fail-closed until the release gate is enabled", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");

    const environment = await loadEnvironment();

    expect(environment.isIndexable).toBe(false);
    expect(environment.acceptsProductionLeads).toBe(true);
  });

  it("keeps Vercel Preview isolated from indexing and lead intake", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");

    const environment = await loadEnvironment();

    expect(environment.isPreviewDeployment).toBe(true);
    expect(environment.isIndexable).toBe(false);
    expect(environment.acceptsProductionLeads).toBe(false);
    expect(environment.acceptsProductionLeadAttachments).toBe(false);
    expect(environment.displaysLeadAttachmentPicker).toBe(true);
  });

  it("treats a normal local process as development without SEO overrides", async () => {
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("SITE_URL", "");

    const environment = await loadEnvironment();

    expect(environment.deploymentEnvironment).toBe("development");
    expect(environment.isPreviewDeployment).toBe(false);
    expect(environment.isIndexable).toBe(false);
    expect(environment.acceptsProductionLeads).toBe(false);
    expect(environment.acceptsProductionLeadAttachments).toBe(false);
    expect(environment.displaysLeadAttachmentPicker).toBe(true);
  });

  it("keeps the consent UI dormant unless optional tags are explicitly enabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "false");
    expect((await loadEnvironment()).consentUiEnabled).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "true");
    expect((await loadEnvironment()).consentUiEnabled).toBe(true);
  });

  it("enables Google tags only in production with consent UI and a valid GTM container", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAGS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "GTM-ABC123");

    const environment = await loadEnvironment();

    expect(environment.googleTagManagerId).toBe("GTM-ABC123");
    expect(environment.googleTagsEnabled).toBe(true);
  });

  it("never loads a production GTM container in development or preview", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAGS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "GTM-ABC123");

    const environment = await loadEnvironment();

    expect(environment.googleTagManagerId).toBe("GTM-ABC123");
    expect(environment.googleTagsEnabled).toBe(false);
  });

  it("rejects incoherent production consent and Google tag flags", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAGS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "GTM-ABC123");

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertGoogleTagsConfigurationValidForProduction()
    ).toThrow("must be enabled or disabled together");
  });

  it("rejects a missing or malformed production GTM ID", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CONSENT_UI_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAGS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_GTM_CONTAINER_ID", "not-a-container");

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertGoogleTagsConfigurationValidForProduction()
    ).toThrow("valid NEXT_PUBLIC_GTM_CONTAINER_ID");
  });

  it("rejects an enabled production lead intake with incomplete runtime configuration", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("lichtsaumdatabase_DATABASE_URL", "");
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_EMAIL_FROM", "");
    vi.stubEnv("LEAD_NOTIFICATION_TO", "");

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertLeadIntakeConfigurationValidForProduction()
    ).toThrow(
      "Production lead intake requires: DATABASE_URL, RESEND_API_KEY, LEAD_EMAIL_FROM, LEAD_NOTIFICATION_TO."
    );
  });

  it("accepts a complete contact-only production lead configuration", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");
    stubLeadRuntimeConfiguration();

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertLeadIntakeConfigurationValidForProduction()
    ).not.toThrow();
  });

  it("rejects production attachments when lead intake is disabled", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "false");
    vi.stubEnv("LEAD_ATTACHMENTS_ENABLED", "true");

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertLeadIntakeConfigurationValidForProduction()
    ).toThrow("requires LEAD_INTAKE_ENABLED");
  });

  it("rejects an incomplete production attachment configuration", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("LEAD_INTAKE_ENABLED", "true");
    vi.stubEnv("LEAD_ATTACHMENTS_ENABLED", "true");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    vi.stubEnv("CRON_SECRET", "");
    vi.stubEnv("LEAD_DOWNLOAD_SECRET", "");
    vi.stubEnv("SITE_URL", "");
    stubLeadRuntimeConfiguration();

    const environment = await loadEnvironment();

    expect(() =>
      environment.assertLeadIntakeConfigurationValidForProduction()
    ).toThrow(
      "Production lead attachments require: BLOB_READ_WRITE_TOKEN, CRON_SECRET, LEAD_DOWNLOAD_SECRET, SITE_URL."
    );
  });
});
