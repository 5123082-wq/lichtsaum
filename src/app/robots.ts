import type { MetadataRoute } from "next";

import {
  isIndexable,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  if (!isIndexable || !siteUrl) {
    return {
      rules: {
        userAgent: "*",
        allow: "/"
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
