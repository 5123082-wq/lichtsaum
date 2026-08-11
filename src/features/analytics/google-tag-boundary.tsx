"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import {
  CONSENT_CHANGE_EVENT,
  readConsentRecord,
  type ConsentRecord
} from "@/features/consent/consent-storage";

type GoogleConsentValue = "denied" | "granted";

export const GOOGLE_CONSENT_DATA_LAYER_EVENT =
  "lichtsaum_consent_update" as const;

export type GoogleConsentSignals = Readonly<{
  analytics_storage: GoogleConsentValue;
  ad_storage: GoogleConsentValue;
  ad_user_data: GoogleConsentValue;
  ad_personalization: "denied";
}>;

export type GoogleConsentDataLayerEntry = Readonly<{
  event: typeof GOOGLE_CONSENT_DATA_LAYER_EVENT;
  consent_analytics: boolean;
  consent_marketing: boolean;
}>;

type GoogleTagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __lichtsaumConsentInitialized?: boolean;
  __lichtsaumConsentSignals?: string;
  __lichtsaumGtmLoaded?: boolean;
  __lichtsaumGtmRequested?: boolean;
};

const DENIED_SIGNALS: GoogleConsentSignals = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
};

export function toGoogleConsentSignals(
  consent: ConsentRecord | null
): GoogleConsentSignals {
  return {
    analytics_storage: consent?.analytics === true ? "granted" : "denied",
    ad_storage: consent?.marketing === true ? "granted" : "denied",
    ad_user_data: consent?.marketing === true ? "granted" : "denied",
    ad_personalization: "denied"
  };
}

export function hasOptionalGoogleConsent(consent: ConsentRecord | null) {
  return consent?.analytics === true || consent?.marketing === true;
}

export function toGoogleConsentDataLayerEntry(
  consent: ConsentRecord | null
): GoogleConsentDataLayerEntry {
  return {
    event: GOOGLE_CONSENT_DATA_LAYER_EVENT,
    consent_analytics: consent?.analytics === true,
    consent_marketing: consent?.marketing === true
  };
}

function googleTagWindow() {
  return window as GoogleTagWindow;
}

function ensureGoogleTagCommandQueue() {
  const target = googleTagWindow();

  if (!Array.isArray(target.dataLayer)) {
    target.dataLayer = [];
  }

  if (!target.gtag) {
    target.gtag = function gtag() {
      // Google Tag Manager expects the original arguments object in dataLayer.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer?.push(arguments);
    };
  }

  return target;
}

function applyGoogleConsent(consent: ConsentRecord | null) {
  const target = ensureGoogleTagCommandQueue();

  if (!target.__lichtsaumConsentInitialized) {
    target.gtag?.("consent", "default", DENIED_SIGNALS);
    target.__lichtsaumConsentInitialized = true;
    target.__lichtsaumConsentSignals = JSON.stringify(DENIED_SIGNALS);
  }

  const signals = toGoogleConsentSignals(consent);
  const serializedSignals = JSON.stringify(signals);

  if (serializedSignals !== target.__lichtsaumConsentSignals) {
    target.gtag?.("consent", "update", signals);
    target.__lichtsaumConsentSignals = serializedSignals;
  }
}

export function GoogleTagBoundary({
  containerId
}: {
  containerId: string;
}) {
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false);
  const reloadScheduledRef = useRef(false);

  useEffect(() => {
    const applyRecord = (consent: ConsentRecord | null) => {
      const target = googleTagWindow();
      applyGoogleConsent(consent);
      target.dataLayer?.push(toGoogleConsentDataLayerEntry(consent));

      if (hasOptionalGoogleConsent(consent)) {
        if (!target.__lichtsaumGtmRequested) {
          target.dataLayer?.push({
            "gtm.start": Date.now(),
            event: "gtm.js"
          });
          target.__lichtsaumGtmRequested = true;
        }

        setShouldLoadGtm(true);
        return;
      }

      setShouldLoadGtm(false);

      if (target.__lichtsaumGtmRequested && !reloadScheduledRef.current) {
        reloadScheduledRef.current = true;
        window.setTimeout(() => window.location.reload(), 0);
      }
    };

    applyRecord(readConsentRecord());

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CustomEvent<ConsentRecord>;
      applyRecord(consentEvent.detail);
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () =>
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
  }, []);

  if (!shouldLoadGtm) {
    return null;
  }

  return (
    <Script
      id="lichtsaum-google-tag-manager"
      src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`}
      strategy="afterInteractive"
      onLoad={() => {
        googleTagWindow().__lichtsaumGtmLoaded = true;
      }}
    />
  );
}
