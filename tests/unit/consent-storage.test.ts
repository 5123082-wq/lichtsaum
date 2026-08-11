import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  CONSENT_CHANGE_EVENT,
  CONSENT_COOKIE_NAME,
  CONSENT_POLICY_VERSION,
  createConsentRecord,
  parseConsentRecord,
  persistConsentRecord,
  readConsentRecord
} from "@/features/consent/consent-storage";

function removeCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/`;
}

describe("first-party consent storage", () => {
  beforeEach(() => {
    for (const cookie of document.cookie.split("; ")) {
      removeCookie(decodeURIComponent(cookie.split("=")[0] ?? ""));
    }
  });

  it("accepts only the current, complete policy record", () => {
    const record = createConsentRecord(
      { analytics: true, marketing: false },
      new Date("2026-08-10T12:00:00Z")
    );

    expect(parseConsentRecord(JSON.stringify(record))).toEqual(record);
    expect(
      parseConsentRecord(
        JSON.stringify({ ...record, version: "obsolete-policy" })
      )
    ).toBeNull();
    expect(
      parseConsentRecord(JSON.stringify({ ...record, analytics: "yes" }))
    ).toBeNull();
    expect(parseConsentRecord("not-json")).toBeNull();
  });

  it("persists the versioned choice and announces the change", () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, listener);
    const record = createConsentRecord(
      { analytics: false, marketing: false },
      new Date("2026-08-10T12:00:00Z")
    );

    persistConsentRecord(record);

    expect(readConsentRecord()).toEqual(record);
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=`);
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual(record);

    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
  });

  it("removes only analytics cookies when Analytics is rejected", () => {
    document.cookie = "_ga=test; Path=/";
    document.cookie = "_gcl_au=test; Path=/";
    document.cookie = "necessary_test=kept; Path=/";

    persistConsentRecord(
      createConsentRecord({ analytics: false, marketing: true })
    );

    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).toContain("_gcl_au=test");
    expect(document.cookie).toContain("necessary_test=kept");
    expect(readConsentRecord()?.version).toBe(CONSENT_POLICY_VERSION);
  });

  it("removes only advertising cookies when Marketing is rejected", () => {
    document.cookie = "_ga=test; Path=/";
    document.cookie = "_gcl_au=test; Path=/";

    persistConsentRecord(
      createConsentRecord({ analytics: true, marketing: false })
    );

    expect(document.cookie).toContain("_ga=test");
    expect(document.cookie).not.toContain("_gcl_au=");
  });
});
