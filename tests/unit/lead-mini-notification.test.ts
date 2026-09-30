import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn(), lead: {} as Record<string, unknown> }));
vi.mock("@/db", () => ({ getDb: () => ({ select: (fields: Record<string, unknown>) => ({
  from: () => ({ where: () => "originalName" in fields ? Promise.resolve([]) : { limit: async () => [mocks.lead] } })
}) }) }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
import { sendLeadCustomerConfirmation, sendLeadNotification } from "@/features/lead-form/notification-service";

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("LEAD_EMAIL_FROM", "test@example.test");
  vi.stubEnv("LEAD_NOTIFICATION_TO", "manager@example.test");
  mocks.send.mockReset().mockResolvedValue({ data: { id: "test-email" }, error: null });
  mocks.lead = { id: 42, leadId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID(), email: "test@example.test", sourcePath: "/", createdAt: new Date("2026-09-25"), requestContext: {
    schemaVersion: 1, origin: "mini_configurator", evaluation: "incomplete", configuration: {
      text: "<ENTWURF>", compositionMode: "text-only", fontId: "montserrat", awningColorId: "anthracite", lightColorId: "warm-white", previewMode: "night"
    }
  } };
});
afterEach(() => vi.unstubAllEnvs());
it.each([sendLeadNotification, sendLeadCustomerConfirmation])("explains unpriced sketches and escapes their text in both emails", async (send) => {
  await send(String(mocks.lead.leadId));
  const [message] = mocks.send.mock.calls[0]!;
  expect(message.text).toContain("Entwurf aus dem Mini-Konfigurator");
  expect(message.text).toContain("Keine Preisberechnung");
  expect(message.text).toContain("Noch nicht angegeben");
  expect(message.text).not.toContain("Vorläufiger Nettopreis");
  expect(message.html).toContain("&lt;ENTWURF&gt;");
  expect(message.html).not.toContain("<ENTWURF>");
});
