import { getTableColumns } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { leads } from "@/db/schema";

describe("lead request-context database schema", () => {
  it("maps the optional server-produced snapshot to one JSONB column", () => {
    const columns = getTableColumns(leads);

    expect(columns.requestContext.name).toBe("request_context");
    expect(columns.requestContext.dataType).toBe("json");
    expect(columns.requestContext.notNull).toBe(false);
  });
});
