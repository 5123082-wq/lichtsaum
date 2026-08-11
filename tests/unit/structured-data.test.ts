import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "@/lib/structured-data/json-ld";
import { buildSiteStructuredData } from "@/lib/structured-data/site-graph";

describe("site structured data", () => {
  it("publishes only verified site and provider facts", () => {
    const graph = buildSiteStructuredData("https://www.lichtsaum.com");
    const serialized = JSON.stringify(graph);

    expect(graph["@graph"].map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite"
    ]);
    expect(serialized).toContain("NVKV Werbeagentur Inh. Ivan Novikov");
    expect(serialized).toContain("https://www.lichtsaum.com/#organization");
    expect(serialized).not.toMatch(
      /LocalBusiness|Service|Product|Offer|AggregateRating/
    );
  });

  it("escapes markup-breaking characters before embedding JSON-LD", () => {
    const serialized = serializeJsonLd({ value: "</script><script>" });

    expect(serialized).toBe(
      '{"value":"\\u003c/script>\\u003cscript>"}'
    );
  });
});
