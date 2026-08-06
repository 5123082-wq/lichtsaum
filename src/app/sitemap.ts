import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/config/environment";

const LAST_MATERIAL_UPDATE = new Date("2026-08-06T00:00:00.000Z");
const INDEXABLE_PATHS = ["/", "/kontakt", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) {
    return [];
  }

  const productionOrigin = siteUrl;

  return INDEXABLE_PATHS.map((path) => ({
    url: new URL(path, productionOrigin).toString(),
    lastModified: LAST_MATERIAL_UPDATE
  }));
}
