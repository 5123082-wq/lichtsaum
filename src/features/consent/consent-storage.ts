"use client";

export const CONSENT_POLICY_VERSION = "2026-08-11.1";
export const CONSENT_COOKIE_NAME = "lichtsaum_consent";
export const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
export const CONSENT_SETTINGS_OPEN_EVENT = "lichtsaum-consent-settings-open";
export const CONSENT_CHANGE_EVENT = "lichtsaum-consent-change";

export type ConsentRecord = Readonly<{
  version: typeof CONSENT_POLICY_VERSION;
  decidedAt: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  externalMedia: false;
}>;

export type OptionalConsentChoice = Readonly<{
  analytics: boolean;
  marketing: boolean;
}>;

const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];
const MARKETING_COOKIE_PREFIXES = ["_gcl_", "_gac_"];

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(encodedName));

  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(match.slice(encodedName.length));
  } catch {
    return null;
  }
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const decidedAt = candidate.decidedAt;

  return (
    candidate.version === CONSENT_POLICY_VERSION &&
    typeof decidedAt === "string" &&
    !Number.isNaN(Date.parse(decidedAt)) &&
    candidate.necessary === true &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.marketing === "boolean" &&
    candidate.externalMedia === false
  );
}

export function createConsentRecord(
  choice: OptionalConsentChoice,
  decidedAt = new Date()
): ConsentRecord {
  return {
    version: CONSENT_POLICY_VERSION,
    decidedAt: decidedAt.toISOString(),
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    externalMedia: false
  };
}

export function parseConsentRecord(value: string | null): ConsentRecord | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return isConsentRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readConsentRecord() {
  return parseConsentRecord(readCookie(CONSENT_COOKIE_NAME));
}

function cookieRemovalDomains() {
  if (typeof window === "undefined") {
    return [undefined] as Array<string | undefined>;
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return [undefined];
  }

  const parts = hostname.split(".");
  const parentDomain = parts.length > 2 ? `.${parts.slice(-2).join(".")}` : `.${hostname}`;

  return [undefined, hostname, parentDomain];
}

function removeCookie(name: string, domain?: string) {
  const attributes = [
    `${encodeURIComponent(name)}=`,
    "Max-Age=0",
    "Path=/",
    "SameSite=Lax"
  ];

  if (domain) {
    attributes.push(`Domain=${domain}`);
  }

  if (window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  document.cookie = attributes.join("; ");
}

function removeGoogleCookies(prefixes: readonly string[]) {
  if (typeof document === "undefined") {
    return;
  }

  const optionalNames = document.cookie
    .split("; ")
    .map((part) => {
      const separator = part.indexOf("=");
      const encodedName = separator >= 0 ? part.slice(0, separator) : part;

      try {
        return decodeURIComponent(encodedName);
      } catch {
        return encodedName;
      }
    })
    .filter((name) => prefixes.some((prefix) => name.startsWith(prefix)));

  for (const name of optionalNames) {
    for (const domain of cookieRemovalDomains()) {
      removeCookie(name, domain);
    }
  }
}

export function persistConsentRecord(record: ConsentRecord) {
  if (typeof document === "undefined") {
    return;
  }

  const attributes = [
    `${encodeURIComponent(CONSENT_COOKIE_NAME)}=${encodeURIComponent(JSON.stringify(record))}`,
    `Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax"
  ];

  if (window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  document.cookie = attributes.join("; ");

  if (!record.analytics) {
    removeGoogleCookies(ANALYTICS_COOKIE_PREFIXES);
  }

  if (!record.marketing) {
    removeGoogleCookies(MARKETING_COOKIE_PREFIXES);
  }

  window.dispatchEvent(
    new CustomEvent<ConsentRecord>(CONSENT_CHANGE_EVENT, { detail: record })
  );
}

export function requestConsentSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONSENT_SETTINGS_OPEN_EVENT));
  }
}
