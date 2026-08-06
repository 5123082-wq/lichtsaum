import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/config/environment";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable || !siteUrl) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: [
      {
        userAgent: ["Googlebot", "AdsBot-Google"],
        allow: "/"
      },
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    host: siteUrl,
    sitemap: new URL("/sitemap.xml", siteUrl).toString()
  };
}
