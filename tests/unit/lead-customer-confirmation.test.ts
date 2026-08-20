import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const send = vi.fn();
  const limit = vi.fn();
  const where = vi.fn(() => ({ limit }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));

  return { from, limit, select, send, where };
});

vi.mock("@/db", () => ({
  getDb: () => ({ select: mocks.select })
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  }
}));

import { sendLeadCustomerConfirmation } from "@/features/lead-form/notification-service";

const originalEnv = { ...process.env };

describe("sendLeadCustomerConfirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
    process.env.LEAD_EMAIL_FROM = "LICHTSAUM Website <info@lichtsaum.com>";
    process.env.LEAD_NOTIFICATION_TO = "info@lichtsaum.com";
    mocks.limit.mockResolvedValue([
      {
        id: 42,
        email: "kunde@example.com",
        idempotencyKey: "00000000-0000-4000-8000-000000000002",
        requestContext: null,
        createdAt: new Date("2026-08-10T12:00:00Z")
      }
    ]);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("sends an idempotent receipt containing only the public request number", async () => {
    mocks.send.mockResolvedValueOnce({
      data: { id: "email_123" },
      error: null
    });

    await expect(
      sendLeadCustomerConfirmation("00000000-0000-4000-8000-000000000001")
    ).resolves.toBe("email_123");

    expect(mocks.send).toHaveBeenCalledOnce();
    const [message, options] = mocks.send.mock.calls[0]!;

    expect(message).toMatchObject({
      from: "LICHTSAUM Website <info@lichtsaum.com>",
      to: "kunde@example.com",
      replyTo: "info@lichtsaum.com",
      subject: "Ihre Projektanfrage LS-2026-000042 ist eingegangen"
    });
    expect(options).toEqual({
      idempotencyKey:
        "lead-customer-confirmation/00000000-0000-4000-8000-000000000002"
    });
    expect(message.text).toContain("Ihre Anfragenummer: LS-2026-000042");
    expect(message.html).toContain("Ihre Anfragenummer: LS-2026-000042");
    expect(message.text).not.toContain(
      "00000000-0000-4000-8000-000000000001"
    );
    expect(message.html).not.toContain(
      "00000000-0000-4000-8000-000000000001"
    );
    expect(message.text).not.toContain("Datei");
    expect(message.html).not.toContain("Dateilink");
  });

  it("reports provider rejection to the caller", async () => {
    mocks.send.mockResolvedValueOnce({
      data: null,
      error: { message: "rejected" }
    });

    await expect(
      sendLeadCustomerConfirmation("00000000-0000-4000-8000-000000000001")
    ).rejects.toThrow(
      "Lead customer confirmation could not be delivered to Resend."
    );
  });

  it("includes the fixed configuration, services and net total without customer attachments", async () => {
    mocks.limit.mockResolvedValueOnce([
      {
        id: 42,
        email: "kunde@example.com",
        idempotencyKey: "00000000-0000-4000-8000-000000000002",
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
          services: ["design", "site-measurement"],
          postalCode: "10115",
          calculation: {
            panelAllocation: {
              counts: { 600: 0, 1000: 1, 1200: 0 }
            }
          },
          pricingVersion: "2026-08-20.v4",
          netTotalCents: 67_000
        },
        createdAt: new Date("2026-08-10T12:00:00Z")
      }
    ]);
    mocks.send.mockResolvedValueOnce({
      data: { id: "email_configurator" },
      error: null
    });

    await sendLeadCustomerConfirmation(
      "00000000-0000-4000-8000-000000000001"
    );

    const [message] = mocks.send.mock.calls[0]!;

    expect(message.text).toContain("Ihre Anfragenummer: LS-2026-000042");
    expect(message.text).toContain("Beschriftung: CAFÉ LICHT");
    expect(message.text).toContain("Aufmaß");
    expect(message.text).toContain("1 × 1000 mm");
    expect(message.text).toContain("Vorläufiger Nettopreis: 670,00");
    expect(message.html).toContain("CAFÉ LICHT");
    expect(message).not.toHaveProperty("attachments");
    expect(message.text).not.toContain("Datei");
  });
});
