import { isIndexable, siteUrl } from "@/config/environment";
import { serializeJsonLd } from "@/lib/structured-data/json-ld";
import { buildSiteStructuredData } from "@/lib/structured-data/site-graph";

export function SiteStructuredData() {
  if (!isIndexable || !siteUrl) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildSiteStructuredData(siteUrl))
      }}
      id="site-structured-data"
      type="application/ld+json"
    />
  );
}
