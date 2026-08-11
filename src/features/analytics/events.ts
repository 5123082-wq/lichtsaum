"use client";

import { readConsentRecord } from "@/features/consent/consent-storage";

const FORM_IDS = ["main_inquiry", "contact_inquiry"] as const;
const FORM_LOCATIONS = ["landing", "contact"] as const;
const LEAD_TYPES = ["awning_inquiry"] as const;
const ERROR_GROUPS = [
  "validation",
  "rate_limited",
  "integration",
  "network",
  "unknown"
] as const;

type FormId = (typeof FORM_IDS)[number];
type FormLocation = (typeof FORM_LOCATIONS)[number];
type LeadType = (typeof LEAD_TYPES)[number];
type ErrorGroup = (typeof ERROR_GROUPS)[number];
type LeadEventDestination = "analytics" | "ads";

export type LeadAnalyticsEvent =
  | {
      name: "lead_form_start";
      form_id: FormId;
      form_location: FormLocation;
    }
  | {
      name: "lead_form_validation_error";
      form_id: FormId;
      error_group: "validation";
      error_count: number;
    }
  | { name: "lead_submit_attempt"; form_id: FormId }
  | {
      name: "generate_lead";
      form_id: FormId;
      lead_id: string;
      lead_type: LeadType;
    }
  | {
      name: "lead_submit_error";
      form_id: FormId;
      error_group: ErrorGroup;
    };

export type AnalyticsDataLayerEntry =
  | {
      event: "lead_form_start";
      form_id: FormId;
      form_location: FormLocation;
    }
  | {
      event: "lead_form_validation_error";
      form_id: FormId;
      error_group: "validation";
      error_count: number;
    }
  | { event: "lead_submit_attempt"; form_id: FormId }
  | {
      event: "generate_lead";
      destination: "analytics";
      form_id: FormId;
      lead_type: LeadType;
    }
  | {
      event: "generate_lead";
      destination: "ads";
      form_id: FormId;
      lead_id: string;
      lead_type: LeadType;
    }
  | {
      event: "lead_submit_error";
      form_id: FormId;
      error_group: ErrorGroup;
    };

type AnalyticsWindow = Window & { dataLayer?: unknown[] };

const emittedLeadIds = new Set<string>();
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isAllowedValue<const T extends readonly string[]>(
  values: T,
  value: unknown
): value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

function isLeadId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function toDataLayerEntry(
  event: Exclude<LeadAnalyticsEvent, { name: "generate_lead" }>
): AnalyticsDataLayerEntry | null {
  const candidate = event as unknown as Record<string, unknown>;

  switch (candidate.name) {
    case "lead_form_start":
      return isAllowedValue(FORM_IDS, candidate.form_id) &&
        isAllowedValue(FORM_LOCATIONS, candidate.form_location)
        ? {
            event: "lead_form_start",
            form_id: candidate.form_id,
            form_location: candidate.form_location
          }
        : null;
    case "lead_form_validation_error":
      return isAllowedValue(FORM_IDS, candidate.form_id) &&
        candidate.error_group === "validation" &&
        Number.isInteger(candidate.error_count) &&
        typeof candidate.error_count === "number" &&
        candidate.error_count > 0 &&
        candidate.error_count <= 100
        ? {
            event: "lead_form_validation_error",
            form_id: candidate.form_id,
            error_group: "validation",
            error_count: candidate.error_count
          }
        : null;
    case "lead_submit_attempt":
      return isAllowedValue(FORM_IDS, candidate.form_id)
        ? { event: "lead_submit_attempt", form_id: candidate.form_id }
        : null;
    case "lead_submit_error":
      return isAllowedValue(FORM_IDS, candidate.form_id) &&
        isAllowedValue(ERROR_GROUPS, candidate.error_group)
        ? {
            event: "lead_submit_error",
            form_id: candidate.form_id,
            error_group: candidate.error_group
          }
        : null;
    default:
      return null;
  }
}

function dataLayer() {
  const analyticsWindow = window as AnalyticsWindow;

  if (!Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer = [];
  }

  return analyticsWindow.dataLayer;
}

function toGenerateLeadEntry(
  event: Extract<LeadAnalyticsEvent, { name: "generate_lead" }>,
  destination: LeadEventDestination
): AnalyticsDataLayerEntry | null {
  const candidate = event as unknown as Record<string, unknown>;

  if (
    !isAllowedValue(FORM_IDS, candidate.form_id) ||
    !isLeadId(candidate.lead_id) ||
    !isAllowedValue(LEAD_TYPES, candidate.lead_type)
  ) {
    return null;
  }

  return destination === "analytics"
    ? {
        event: "generate_lead",
        destination,
        form_id: candidate.form_id,
        lead_type: candidate.lead_type
      }
    : {
        event: "generate_lead",
        destination,
        form_id: candidate.form_id,
        lead_id: candidate.lead_id,
        lead_type: candidate.lead_type
      };
}

export function emitLeadAnalyticsEvent(event: LeadAnalyticsEvent) {
  if (typeof window === "undefined") {
    return false;
  }

  const consent = readConsentRecord();

  if (event.name === "generate_lead") {
    const destinations: LeadEventDestination[] = [];

    if (consent?.analytics === true) {
      destinations.push("analytics");
    }

    if (consent?.marketing === true) {
      destinations.push("ads");
    }

    const entries = destinations
      .map((destination) => toGenerateLeadEntry(event, destination))
      .filter((entry): entry is AnalyticsDataLayerEntry => entry !== null);

    if (entries.length === 0) {
      return false;
    }

    dataLayer().push(...entries);
    return true;
  }

  const entry = toDataLayerEntry(event);

  if (!entry || consent?.analytics !== true) {
    return false;
  }

  dataLayer().push(entry);
  return true;
}

export function emitGenerateLeadOnce(leadId: string) {
  if (typeof window === "undefined" || !isLeadId(leadId)) {
    return false;
  }

  const alreadyQueued = dataLayer().some((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    const candidate = entry as Record<string, unknown>;
    return candidate.event === "generate_lead" && candidate.lead_id === leadId;
  });

  if (emittedLeadIds.has(leadId) || alreadyQueued) {
    return false;
  }

  emittedLeadIds.add(leadId);

  return emitLeadAnalyticsEvent({
    name: "generate_lead",
    form_id: "main_inquiry",
    lead_id: leadId,
    lead_type: "awning_inquiry"
  });
}
