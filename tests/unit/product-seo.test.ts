import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("product search contract", () => {
  it("publishes clean product metadata, navigation and one sitemap URL behind the indexing gate", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_URL", "https://www.lichtsaum.com");
    vi.stubEnv("SEARCH_INDEXING_ENABLED", "true");
    vi.resetModules();

    const [{ generateMetadata }, { default: sitemap }, { GlobalSiteHeader }] = await Promise.all([
      import("@/app/produkt/page"),
      import("@/app/sitemap"),
      import("@/components/layout/global-site-header")
    ]);
    const metadata = generateMetadata();
    const entries = sitemap();
    const productEntries = entries.filter((entry) => entry.url === "https://www.lichtsaum.com/produkt");

    expect(metadata.title).toBe("Leuchtvolant für Markisen: Stoff, Form & Licht | LICHTSAUM");
    expect(metadata.description).toContain("Stoff, Farbe, Form und Lichtwirkung");
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates).toEqual({ canonical: "https://www.lichtsaum.com/produkt" });
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: metadata.description,
      url: "https://www.lichtsaum.com/produkt",
      images: [{ url: "/brand/lichtsaum-og-1200x630.png", width: 1200, height: 630 }]
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description
    });
    expect(productEntries).toHaveLength(1);
    expect(productEntries[0]?.lastModified).toEqual(new Date("2026-11-02T00:00:00.000Z"));
    expect(entries.some((entry) => entry.url.includes("?") || entry.url.includes("/prototyp/"))).toBe(false);
    expect(GlobalSiteHeader({}).props.productHref).toBe("/produkt");
  });

  it.each([
    ["development", "true", "https://www.lichtsaum.com"],
    ["preview", "true", "https://www.lichtsaum.com"],
    ["production", "false", "https://www.lichtsaum.com"],
    ["production", "true", "https://preview.example.com"],
    ["production", "true", ""]
  ])("keeps search output fail-closed for %s, indexing %s, origin %s", async (environment, indexing, origin) => {
    vi.stubEnv("VERCEL_ENV", environment);
    vi.stubEnv("SITE_URL", origin);
    vi.stubEnv("SEARCH_INDEXING_ENABLED", indexing);
    vi.resetModules();

    const [{ generateMetadata }, { default: sitemap }] = await Promise.all([
      import("@/app/produkt/page"),
      import("@/app/sitemap")
    ]);
    const metadata = generateMetadata();

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.alternates).toEqual({ canonical: null });
    expect(metadata.openGraph).toBeNull();
    expect(metadata.twitter).toBeNull();
    expect(sitemap()).toEqual([]);
  });
});
