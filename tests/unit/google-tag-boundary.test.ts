import { describe, expect, it } from "vitest";

import {
  hasOptionalGoogleConsent,
  toGoogleConsentDataLayerEntry,
  toGoogleConsentSignals
} from "@/features/analytics/google-tag-boundary";
import { createConsentRecord } from "@/features/consent/consent-storage";

describe("Google tag consent boundary", () => {
  it("keeps every Consent Mode signal denied before a choice", () => {
    expect(toGoogleConsentSignals(null)).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    expect(hasOptionalGoogleConsent(null)).toBe(false);
    expect(toGoogleConsentDataLayerEntry(null)).toEqual({
      event: "lichtsaum_consent_update",
      consent_analytics: false,
      consent_marketing: false
    });
  });

  it("maps Analytics and Marketing independently while personalization stays denied", () => {
    const analyticsOnly = createConsentRecord({
      analytics: true,
      marketing: false
    });
    const marketingOnly = createConsentRecord({
      analytics: false,
      marketing: true
    });

    expect(toGoogleConsentSignals(analyticsOnly)).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    expect(toGoogleConsentSignals(marketingOnly)).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "denied"
    });
    expect(hasOptionalGoogleConsent(analyticsOnly)).toBe(true);
    expect(hasOptionalGoogleConsent(marketingOnly)).toBe(true);
    expect(toGoogleConsentDataLayerEntry(analyticsOnly)).toEqual({
      event: "lichtsaum_consent_update",
      consent_analytics: true,
      consent_marketing: false
    });
    expect(toGoogleConsentDataLayerEntry(marketingOnly)).toEqual({
      event: "lichtsaum_consent_update",
      consent_analytics: false,
      consent_marketing: true
    });
  });
});
