import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => {
  const limit = vi.fn();
  const where = vi.fn(() => ({ limit }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));

  return { from, limit, select, where };
});

vi.mock("../../src/db", () => ({
  getDb: () => ({ select: database.select })
}));

import { getProjectCheckSubmissionStatus } from "../../src/features/lead-form/submission-action";

describe("getProjectCheckSubmissionStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not query the database for an invalid lead ID", async () => {
    await expect(
      getProjectCheckSubmissionStatus("not-a-lead-id")
    ).resolves.toEqual({ status: "unknown" });
    expect(database.select).not.toHaveBeenCalled();
  });

  it.each([
    ["uploading", { status: "pending" }],
    [undefined, { status: "unknown" }]
  ] as const)("maps %s to %s", async (status, expected) => {
    database.limit.mockResolvedValueOnce(
      status ? [{ id: 42, status, createdAt: new Date("2026-08-10T12:00:00Z") }] : []
    );

    await expect(
      getProjectCheckSubmissionStatus("d9428888-122b-4f1b-b371-20c56a916459")
    ).resolves.toEqual(expected);
  });

  it("returns the public number for an accepted lead", async () => {
    database.limit.mockResolvedValueOnce([
      { id: 42, status: "new", createdAt: new Date("2026-08-10T12:00:00Z") }
    ]);

    await expect(
      getProjectCheckSubmissionStatus("d9428888-122b-4f1b-b371-20c56a916459")
    ).resolves.toEqual({
      status: "submitted",
      publicLeadNumber: "LS-2026-000042"
    });
  });
});
