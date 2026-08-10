import { describe, expect, it } from "vitest";

import { formatPublicLeadNumber } from "@/features/lead-form/public-lead-number";

describe("formatPublicLeadNumber", () => {
  it("formats the database ID with the Berlin calendar year", () => {
    expect(
      formatPublicLeadNumber(42, new Date("2026-12-31T23:30:00Z"))
    ).toBe("LS-2027-000042");
  });

  it("does not truncate IDs longer than the minimum width", () => {
    expect(
      formatPublicLeadNumber(1234567, new Date("2026-08-10T12:00:00Z"))
    ).toBe("LS-2026-1234567");
  });
});
