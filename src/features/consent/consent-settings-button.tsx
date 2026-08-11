"use client";

import { requestConsentSettings } from "./consent-storage";

export function ConsentSettingsButton() {
  return (
    <button type="button" onClick={requestConsentSettings}>
      Cookie-Einstellungen
    </button>
  );
}
