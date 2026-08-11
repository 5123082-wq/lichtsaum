import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { isReferenceGalleryPublished } from "@/features/references/types";

const CORE_INDEXABLE_ROUTES = [
  { path: "/", lastModified: new Date("2026-08-10T00:00:00.000Z") },
  {
    path: "/kontakt",
    lastModified: new Date("2026-08-06T00:00:00.000Z")
  },
  {
    path: "/konfigurator",
    lastModified: new Date("2026-08-11T00:00:00.000Z")
  },
  {
    path: "/impressum",
    lastModified: new Date("2026-08-06T00:00:00.000Z")
  },
  {
    path: "/datenschutz",
    lastModified: new Date("2026-08-10T00:00:00.000Z")
  }
] as const;

const REFERENCE_ROUTE = {
  path: "/referenzen",
  lastModified: new Date("2026-08-09T00:00:00.000Z")
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) {
    return [];
  }

  const productionOrigin = siteUrl;
  const indexableRoutes = isReferenceGalleryPublished(referenceGallery)
    ? [...CORE_INDEXABLE_ROUTES, REFERENCE_ROUTE]
    : CORE_INDEXABLE_ROUTES;

  return indexableRoutes.map(({ path, lastModified }) => ({
    url: new URL(path, productionOrigin).toString(),
    lastModified
  }));
}
