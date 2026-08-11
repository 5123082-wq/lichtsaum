import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/environment", () => ({
  displaysLeadAttachmentPicker: false,
  isIndexable: true,
  isPreviewDeployment: false,
  siteUrl: "https://www.lichtsaum.com"
}));

import { generateMetadata } from "@/app/konfigurator/page";

describe("configurator route metadata", () => {
  it("keeps canonical and social metadata specific to /konfigurator", () => {
    const metadata = generateMetadata();

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
  });
});
