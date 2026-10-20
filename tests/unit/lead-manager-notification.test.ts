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
let pricingVersion = "2026-08-20.v4";
let panelCounts: Record<number, number> = {};

describe("sendLeadNotification", () => {
  beforeEach(() => {
    pricingVersion = "2026-08-20.v4";
    panelCounts = { 600: 0, 1000: 1, 1200: 0 };
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
                      counts: panelCounts
                    }
                  },
                  pricingVersion,
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
    expect(message.text).not.toContain("Elektrische Ausstattung");
    expect(message).not.toHaveProperty("attachments");
  });

  it("includes larger panels and the electrical exclusion for historical v5 snapshots", async () => {
    pricingVersion = "2026-10-20.v5";
    panelCounts = { 600: 0, 1000: 0, 1200: 0, 1600: 1, 2000: 2 };
    await sendLeadNotification("00000000-0000-4000-8000-000000000001");
    const [message] = mocks.send.mock.calls[0]!;
    expect(message.text).toContain("1 × 1600 mm, 2 × 2000 mm");
    expect(message.text).toContain("Elektrische Ausstattung, Elektroanschluss");
    expect(message.html).toContain("Elektrische Ausstattung, Elektroanschluss");
  });
  it("includes one electrical set and excludes connection work for v6 snapshots", async () => {
    pricingVersion = "2026-10-20.v6";
    await sendLeadNotification("00000000-0000-4000-8000-000000000001");
    const [message] = mocks.send.mock.calls[0]!;
    for (const content of [message.text, message.html]) {
      expect(content).toContain("ein Elektroset (Netzteil, Dimmer, Handsender und Kabel)");
      expect(content).toContain("Elektroanschluss, Montage und angefragte Leistungen sind nicht enthalten");
      expect(content).not.toContain("Elektrische Ausstattung, Elektroanschluss");
    }
  });

});
