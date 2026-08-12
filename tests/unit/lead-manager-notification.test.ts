import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  select: vi.fn()
}));

vi.mock("@/db", () => ({
  getDb: () => ({ select: mocks.select })
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  }
}));

import { sendLeadNotification } from "@/features/lead-form/notification-service";

const originalEnv = { ...process.env };

describe("sendLeadNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
    process.env.LEAD_EMAIL_FROM = "LICHTSAUM Website <info@lichtsaum.com>";
    process.env.LEAD_NOTIFICATION_TO = "info@lichtsaum.com";
    mocks.select
      .mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: async () => [
              {
                id: 42,
                leadId: "00000000-0000-4000-8000-000000000001",
                idempotencyKey: "00000000-0000-4000-8000-000000000002",
                email: "kunde@example.com",
                phone: null,
                projectContext: null,
                requestContext: {
                  schemaVersion: 1,
                  origin: "full_configurator",
                  evaluation: "valid",
                  configuration: {
                    schemaVersion: 1,
                    compositionMode: "text-only",
                    text: "CAFÉ LICHT",
                    fontId: "montserrat",
                    valanceWidthMm: 3000,
                    valanceHeightMm: 300,
                    letterHeightMm: 120,
                    awningColorId: "anthracite",
                    lightColorId: "warm-white"
                  },
                  services: ["design"],
                  calculation: {
                    panelAllocation: {
                      counts: { 600: 0, 1000: 1, 1200: 0 }
                    }
                  },
                  pricingVersion: "2026-08-12.v2",
                  netTotalCents: 67_000
                },
                sourcePath: "/konfigurator",
                createdAt: new Date("2026-08-10T12:00:00Z")
              }
            ]
          })
        })
      })
      .mockReturnValueOnce({
        from: () => ({ where: async () => [] })
      });
    mocks.send.mockResolvedValue({
      data: { id: "email_manager" },
      error: null
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("includes the public request number and authoritative configurator summary", async () => {
    await expect(
      sendLeadNotification("00000000-0000-4000-8000-000000000001")
    ).resolves.toBe("email_manager");

    const [message] = mocks.send.mock.calls[0]!;

    expect(message.subject).toContain("LS-2026-000042");
    expect(message.text).toContain("Anfragenummer: LS-2026-000042");
    expect(message.text).toContain("Beschriftung: CAFÉ LICHT");
    expect(message.text).toContain("Gestaltung");
    expect(message.text).toContain("Vorläufiger Nettopreis: 670,00");
    expect(message.html).toContain("LS-2026-000042");
    expect(message).not.toHaveProperty("attachments");
  });
});
