import { beforeEach, describe, expect, it } from "vitest";

import {
  emitGenerateLeadOnce,
  emitLeadAnalyticsEvent
} from "../../src/features/analytics/events";
import {
  CONSENT_COOKIE_NAME,
  createConsentRecord,
  persistConsentRecord
} from "../../src/features/consent/consent-storage";

type TestWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

const leadId = "d9428888-122b-4f1b-b371-20c56a916459";

function currentDataLayer() {
  return (window as TestWindow).dataLayer ?? [];
}

describe("lead analytics event boundary", () => {
  beforeEach(() => {
    delete (window as TestWindow).dataLayer;
    document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
    persistConsentRecord(
      createConsentRecord({ analytics: true, marketing: true })
    );
  });

  it("queues one sanitized Analytics and one Ads lead event per server lead ID", () => {
    expect(emitGenerateLeadOnce(leadId)).toBe(true);
    expect(emitGenerateLeadOnce(leadId)).toBe(false);

    expect(currentDataLayer()).toEqual([
      {
        event: "generate_lead",
        destination: "analytics",
        form_id: "main_inquiry",
        lead_type: "awning_inquiry"
      },
      {
        event: "generate_lead",
        destination: "ads",
        form_id: "main_inquiry",
        lead_id: leadId,
        lead_type: "awning_inquiry"
      }
    ]);
    expect(window.sessionStorage).toHaveLength(0);
  });

  it("does not queue invalid or identifying values", () => {
    expect(emitGenerateLeadOnce("person@example.test")).toBe(false);
    expect(
      emitLeadAnalyticsEvent({
        name: "generate_lead",
        form_id: "main_inquiry",
        lead_id: leadId,
        lead_type: "person@example.test"
      } as never)
    ).toBe(false);

    expect(currentDataLayer()).toEqual([]);
  });

  it("copies only allowlisted diagnostic fields with Analytics consent", () => {
    expect(
      emitLeadAnalyticsEvent({
        name: "lead_submit_error",
        form_id: "main_inquiry",
        error_group: "network",
        email: "person@example.test",
        projectContext: "private"
      } as never)
    ).toBe(true);

    expect(currentDataLayer()).toEqual([
      {
        event: "lead_submit_error",
        form_id: "main_inquiry",
        error_group: "network"
      }
    ]);
  });

  it("queues only the sanitized lead event with Analytics-only consent", () => {
    persistConsentRecord(
      createConsentRecord({ analytics: true, marketing: false })
    );

    expect(
      emitGenerateLeadOnce("4f63cf6a-1945-4602-855c-ecdd1a9b7a9c")
    ).toBe(true);
    expect(currentDataLayer()).toEqual([
      {
        event: "generate_lead",
        destination: "analytics",
        form_id: "main_inquiry",
        lead_type: "awning_inquiry"
      }
    ]);
  });

  it("queues only the transaction-ID lead event with Marketing-only consent", () => {
    persistConsentRecord(
      createConsentRecord({ analytics: false, marketing: true })
    );
    const marketingLeadId = "68560264-b490-4ff6-9480-57a471f44aef";

    expect(emitGenerateLeadOnce(marketingLeadId)).toBe(true);
    expect(currentDataLayer()).toEqual([
      {
        event: "generate_lead",
        destination: "ads",
        form_id: "main_inquiry",
        lead_id: marketingLeadId,
        lead_type: "awning_inquiry"
      }
    ]);
  });

  it("does not queue diagnostics without Analytics consent", () => {
    persistConsentRecord(
      createConsentRecord({ analytics: false, marketing: true })
    );

    expect(
      emitLeadAnalyticsEvent({
        name: "lead_submit_error",
        form_id: "main_inquiry",
        error_group: "network"
      })
    ).toBe(false);
    expect(currentDataLayer()).toEqual([]);
  });
});
