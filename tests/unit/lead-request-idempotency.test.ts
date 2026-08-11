import { beforeEach, describe, expect, it, vi } from "vitest";

const blobStorage = vi.hoisted(() => ({
  attachmentsAreEnabled: vi.fn(() => true),
  buildLeadBlobPath: vi.fn(
    (leadId: string, fileId: string) => `leads/${leadId}/${fileId}`
  ),
  deletePrivateBlob: vi.fn(),
  inspectPrivateBlob: vi.fn(),
  retentionUntilFrom: vi.fn(
    (now: Date) => new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  ),
  uploadExpiryFrom: vi.fn(
    (now: Date) => new Date(now.getTime() + 30 * 60 * 1000)
  )
}));

const database = vi.hoisted(() => {
  type StoredLead = Record<string, unknown> & {
    id: number;
    createdAt: Date;
    status: string;
  };
  type StoredFile = Record<string, unknown> & {
    id: number;
    status: string;
  };

  let lead: StoredLead | undefined;
  let files: StoredFile[] = [];
  let leadInsertCount = 0;

  const select = vi.fn((fields: Record<string, unknown>) => ({
    from: vi.fn(() => {
      if ("total" in fields) {
        return { where: vi.fn(async () => [{ total: 0 }]) };
      }

      if ("originalName" in fields) {
        return {
          where: vi.fn(() => ({
            orderBy: vi.fn(async () =>
              files.map((file) => ({
                fileId: file.fileId,
                storageKey: file.storageKey,
                originalName: file.originalName,
                mediaType: file.mediaType,
                byteSize: file.byteSize,
                status: file.status
              }))
            )
          }))
        };
      }

      if (Object.keys(fields).length === 1 && "status" in fields) {
        return {
          where: vi.fn(async () =>
            files.map((file) => ({ status: file.status }))
          )
        };
      }

      return {
        where: vi.fn(() => ({
          limit: vi.fn(async () => (lead ? [lead] : []))
        }))
      };
    })
  }));

  const insert = vi.fn(() => ({
    values: vi.fn((input: Record<string, unknown> | Record<string, unknown>[]) => {
      if (Array.isArray(input)) {
        files = input.map((file, index) => ({
          ...file,
          id: index + 1,
          status: String(file.status)
        }));
        return Promise.resolve();
      }

      leadInsertCount += 1;
      lead = {
        ...input,
        id: 42,
        createdAt: new Date("2026-08-11T12:00:00.000Z"),
        status: String(input.status)
      };

      return {
        returning: vi.fn(async () => [{ id: 42 }])
      };
    })
  }));

  const update = vi.fn(() => ({
    set: vi.fn((values: Record<string, unknown>) => ({
      where: vi.fn(async () => {
        if (lead) {
          lead = { ...lead, ...values };
        }
      })
    }))
  }));

  return {
    getLead: () => lead,
    getLeadInsertCount: () => leadInsertCount,
    markFirstFileUploaded() {
      if (files[0]) {
        files[0] = { ...files[0], status: "uploaded" };
      }
    },
    reset() {
      lead = undefined;
      files = [];
      leadInsertCount = 0;
    },
    insert,
    select,
    update
  };
});

vi.mock("@/db", () => ({
  getDb: () => ({
    insert: database.insert,
    select: database.select,
    update: database.update
  })
}));
vi.mock("@/features/lead-form/blob-storage", () => blobStorage);
vi.mock("@/features/lead-form/notification-service", () => ({
  sendLeadCustomerConfirmation: vi.fn(),
  sendLeadNotification: vi.fn()
}));

import {
  createLeadUploadPlan,
  finalizeLeadUploadPlan
} from "@/features/lead-form/upload-service";
import { hashUploadToken } from "@/features/lead-form/upload-security";

const attempt = {
  idempotencyKey: "00000000-0000-4000-8000-000000000321",
  uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
};
const contact = {
  email: "projekt@example.test",
  projectContext: "Bitte prüfen.",
  sourcePath: "/konfigurator"
};
const manifest = [
  { name: "ansicht.png", type: "image/png", size: 1_024 }
];

describe("lead request idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    database.reset();
  });

  it("recovers the same ordered upload plan and stores only the token hash", async () => {
    const first = await createLeadUploadPlan(contact, attempt, manifest);

    expect(first.kind).toBe("upload");
    database.markFirstFileUploaded();

    const retry = await createLeadUploadPlan(contact, attempt, manifest);

    expect(retry).toEqual(
      first.kind === "upload"
        ? {
            kind: "upload",
            plan: {
              ...first.plan,
              files: first.plan.files.map((file) => ({
                ...file,
                uploaded: true
              }))
            }
          }
        : first
    );
    expect(database.getLeadInsertCount()).toBe(1);
    expect(database.getLead()?.uploadTokenHash).toBe(
      hashUploadToken(attempt.uploadToken)
    );
    expect(database.getLead()?.uploadTokenHash).not.toBe(attempt.uploadToken);
  });

  it("returns the same accepted lead success without another insert", async () => {
    const first = await createLeadUploadPlan(contact, attempt, []);

    expect(first.kind).toBe("upload");

    if (first.kind !== "upload") {
      throw new Error("The first preparation must create an upload plan.");
    }

    await finalizeLeadUploadPlan(first.plan.leadId, first.plan.uploadToken);

    await expect(
      createLeadUploadPlan(contact, attempt, [])
    ).resolves.toEqual({
      kind: "submitted",
      leadId: first.plan.leadId,
      publicLeadNumber: "LS-2026-000042"
    });
    expect(database.getLeadInsertCount()).toBe(1);
    expect(database.getLead()?.uploadTokenHash).toBe(
      hashUploadToken(attempt.uploadToken)
    );
  });

  it("rejects reuse of the key for changed payload", async () => {
    await createLeadUploadPlan(contact, attempt, manifest);

    await expect(
      createLeadUploadPlan(
        { ...contact, projectContext: "Absichtlich geändert." },
        attempt,
        manifest
      )
    ).rejects.toMatchObject({ name: "LeadUploadPlanNotAuthorized" });
    expect(database.getLeadInsertCount()).toBe(1);
  });
});
