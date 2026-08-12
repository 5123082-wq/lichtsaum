import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

type HostCondition = {
  type: string;
  value: string;
};

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: HostCondition[];
};

describe("Vercel routing contract", () => {
  it("redirects the apex host to the canonical HTTPS www host", () => {
    const config = JSON.parse(
      readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")
    ) as { redirects?: Redirect[] };
    const redirect = config.redirects?.find((candidate) =>
      candidate.has?.some((condition) => condition.type === "host")
    );

    expect(redirect).toMatchObject({
      source: "/:path*",
      destination: "https://www.lichtsaum.com/:path*",
      permanent: true,
      has: [{ type: "host", value: "lichtsaum.com" }]
    });
  });
});
