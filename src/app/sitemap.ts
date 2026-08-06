import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { isReferenceGalleryPublished } from "@/features/references/types";

const LAST_MATERIAL_UPDATE = new Date("2026-08-06T00:00:00.000Z");
const CORE_INDEXABLE_PATHS = ["/", "/kontakt", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) {
    return [];
  }

  const productionOrigin = siteUrl;
  const indexablePaths = isReferenceGalleryPublished(referenceGallery)
    ? [...CORE_INDEXABLE_PATHS, "/referenzen"]
    : CORE_INDEXABLE_PATHS;

  return indexablePaths.map((path) => ({
    url: new URL(path, productionOrigin).toString(),
    lastModified: LAST_MATERIAL_UPDATE
  }));
}
