import { describe, expect, it, vi } from "vitest";

const environment = vi.hoisted(() => ({ isProductionDeployment: false }));
vi.mock("@/config/environment", () => environment);
vi.mock("@/components/layout/global-site-header", () => ({ GlobalSiteHeader: () => null }));
vi.mock("@/components/layout/site-footer", () => ({ SiteFooter: () => null }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); } }));

import ProductEditorialPrototype, { metadata as prototypeMetadata } from "@/app/prototyp/produkt/page";

import ProductPage from "@/app/produkt/page";

describe("/prototyp/produkt publication boundary", () => {
  it("renders locally with noindex and no inherited canonical or social metadata", () => {
    environment.isProductionDeployment = false;
    expect(ProductEditorialPrototype()).toBeTruthy();
    expect(prototypeMetadata.robots).toMatchObject({ index: false, follow: false });
    expect(prototypeMetadata.alternates).toEqual({ canonical: null });
    expect(prototypeMetadata.openGraph).toBeNull();
  });
  it("returns not found in production", () => {
    environment.isProductionDeployment = true;
    expect(() => ProductEditorialPrototype()).toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    environment.isProductionDeployment = false;
  });
});

describe("/produkt availability", () => {
  it.each([false, true])("renders with production deployment set to %s", (production) => {
    environment.isProductionDeployment = production;
    expect(ProductPage()).toBeTruthy();
    environment.isProductionDeployment = false;
  });
});
