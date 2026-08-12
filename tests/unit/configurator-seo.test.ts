import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("configurator search contract", () => {
  it("publishes one clean self-canonical and sitemap URL behind the indexing gate", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    vi.resetModules();

    const [{ generateMetadata }, { default: sitemap }] = await Promise.all([
      import("@/app/konfigurator/page"),
      import("@/app/sitemap")
    ]);
    const metadata = generateMetadata();
    const entries = sitemap();

    expect(metadata.title).toBe("Leuchtvolant konfigurieren | LICHTSAUM");
    expect(metadata.alternates).toEqual({ canonical: "/konfigurator" });
    expect(metadata.openGraph).toMatchObject({
      title: "Leuchtvolant konfigurieren | LICHTSAUM",
      url: "/konfigurator"
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Leuchtvolant konfigurieren | LICHTSAUM"
    });
    expect(
      entries.filter(
        (entry) => entry.url === "https://www.lichtsaum.com/konfigurator"
      )
    ).toHaveLength(1);
    expect(entries.some((entry) => entry.url.includes("?"))).toBe(false);
  });

  it("publishes route-specific Twitter metadata for public routes", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    vi.resetModules();

    const [
      { generateMetadata: getContactMetadata },
      { generateMetadata: getReferencesMetadata },
      { generateMetadata: getImpressumMetadata },
      { generateMetadata: getPrivacyMetadata }
    ] = await Promise.all([
      import("@/app/kontakt/page"),
      import("@/app/referenzen/page"),
      import("@/app/impressum/page"),
      import("@/app/datenschutz/page")
    ]);

    const routeMetadata = [
      getContactMetadata(),
      getReferencesMetadata(),
      getImpressumMetadata(),
      getPrivacyMetadata()
    ];
    const expectedTitles = [
      "Kontakt | LICHTSAUM",
      "Galerie | LICHTSAUM",
      "Impressum | LICHTSAUM",
      "Datenschutzerklärung | LICHTSAUM"
    ];

    routeMetadata.forEach((metadata, index) => {
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: expectedTitles[index]
      });
    });
  });

  it("keeps deployment SEO output fail-closed outside the indexing gate", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "false");
    vi.resetModules();

    const [{ generateMetadata }, { default: sitemap }] = await Promise.all([
      import("@/app/konfigurator/page"),
      import("@/app/sitemap")
    ]);
    const metadata = generateMetadata();

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(sitemap()).toEqual([]);
  });
});
