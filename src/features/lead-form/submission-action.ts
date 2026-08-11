"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  acceptsProductionLeads,
  isProductionDeployment
} from "@/config/environment";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

import {
  normalizeProjectSourcePath,
  projectCheckContactSchema
} from "./schema";
import { formatPublicLeadNumber } from "./public-lead-number";
import {
  prepareConfiguratorProjectContext,
  type ConfiguratorPricingChangedResult
} from "./server-request-context";
import {
  confirmLeadFileUpload,
  createLeadUploadPlan,
  finalizeLeadUploadPlan,
  type LeadUploadPlan
} from "./upload-service";
import {
  leadSubmissionAttemptSchema,
  uploadManifestSchema
} from "./upload-contract";
import type { ConfiguratorProjectSubmission } from "./request-context";
import type {
  ProjectCheckFieldErrors,
  ProjectCheckFieldName,
  ProjectCheckFormState
} from "./types";

const submissionSchema = projectCheckContactSchema.extend({
  files: uploadManifestSchema,
  idempotencyKey: leadSubmissionAttemptSchema.shape.idempotencyKey,
  uploadToken: leadSubmissionAttemptSchema.shape.uploadToken,
  sourcePath: z.unknown().optional(),
  configuratorProject: z.unknown().optional()
}).strict();

const projectCheckFieldNames = new Set<ProjectCheckFieldName>([
  "email",
  "phone",
  "projectContext",
  "configuratorProject",
  "projectFiles"
]);

export interface ProjectCheckSubmissionInput {
  email: string;
  phone: string;
  projectContext: string;
  website: string;
  sourcePath: string;
  idempotencyKey: string;
  uploadToken: string;
  files: Array<{ name: string; type: string; size: number }>;
  configuratorProject?: ConfiguratorProjectSubmission;
}

export type PrepareProjectCheckResult =
  | { kind: "result"; state: ProjectCheckFormState }
  | { kind: "upload"; plan: LeadUploadPlan }
  | ConfiguratorPricingChangedResult;

function collectErrors(error: z.ZodError): ProjectCheckFieldErrors {
  const fieldErrors: ProjectCheckFieldErrors = {};

  for (const issue of error.issues) {
    const rawField = issue.path[0] === "files" ? "projectFiles" : issue.path[0];

    if (
      typeof rawField !== "string" ||
      !projectCheckFieldNames.has(rawField as ProjectCheckFieldName)
    ) {
      continue;
    }

    const field = rawField as ProjectCheckFieldName;
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return fieldErrors;
}

function leadIntakeUnavailableState(): ProjectCheckFormState {
  if (isProductionDeployment) {
    return {
      status: "prototype_unavailable",
      message:
        "Die Projektanfrage ist derzeit nicht verfügbar. Ihre Eingaben wurden nicht gespeichert oder weitergeleitet. Bitte versuchen Sie es später erneut.",
      fieldErrors: {}
    };
  }

  return {
    status: "prototype_validated",
    message:
      "Ihre Eingaben erfüllen die Formularregeln dieses Prototyps. Sie wurden nicht gespeichert und nicht als Projektanfrage weitergeleitet.",
    fieldErrors: {}
  };
}

export async function prepareProjectCheckSubmission(
  input: ProjectCheckSubmissionInput
): Promise<PrepareProjectCheckResult> {
  const parsed = submissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      kind: "result",
      state: {
        status: "invalid",
        message: "Bitte prüfen Sie die markierten Felder.",
        fieldErrors: collectErrors(parsed.error)
      }
    };
  }

  const preparedContext = await prepareConfiguratorProjectContext(
    parsed.data.configuratorProject
  );

  if (preparedContext.kind === "pricing_changed") {
    return preparedContext;
  }

  if (preparedContext.kind === "invalid") {
    return {
      kind: "result",
      state: {
        status: "invalid",
        message: "Bitte prüfen Sie die Konfiguration und Preisbestätigung.",
        fieldErrors: {
          configuratorProject: [preparedContext.message]
        }
      }
    };
  }

  if (preparedContext.kind === "unavailable") {
    return {
      kind: "result",
      state: {
        status: "prototype_unavailable",
        message:
          "Die Konfiguration konnte nicht sicher berechnet werden. Bitte versuchen Sie es später erneut.",
        fieldErrors: {}
      }
    };
  }

  if (!acceptsProductionLeads) {
    return {
      kind: "result",
      state: leadIntakeUnavailableState()
    };
  }

  const preparation = await createLeadUploadPlan(
    {
      email: parsed.data.email,
      phone: parsed.data.phone,
      projectContext: parsed.data.projectContext,
      requestContext:
        preparedContext.kind === "ready"
          ? preparedContext.requestContext
          : undefined,
      sourcePath: normalizeProjectSourcePath(input.sourcePath)
    },
    {
      idempotencyKey: parsed.data.idempotencyKey,
      uploadToken: parsed.data.uploadToken
    },
    parsed.data.files
  );

  if (preparation.kind === "submitted") {
    return {
      kind: "result",
      state: {
        status: "submitted",
        message:
          "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über den von Ihnen angegebenen Kontaktweg.",
        fieldErrors: {},
        leadId: preparation.leadId,
        publicLeadNumber: preparation.publicLeadNumber
      }
    };
  }

  return preparation;
}

export async function confirmProjectFileUpload(input: {
  leadId: string;
  fileId: string;
  uploadToken: string;
  contentType: string;
}) {
  await confirmLeadFileUpload(input);
}

export async function finalizeProjectCheckSubmission(
  leadId: string,
  uploadToken: string
): Promise<ProjectCheckFormState> {
  if (!acceptsProductionLeads) {
    return leadIntakeUnavailableState();
  }

  const { publicLeadNumber } = await finalizeLeadUploadPlan(
    leadId,
    uploadToken
  );

  return {
    status: "submitted",
    message:
      "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über den von Ihnen angegebenen Kontaktweg.",
    fieldErrors: {},
    leadId,
    publicLeadNumber
  };
}

export type ProjectCheckSubmissionStatus =
  | { status: "submitted"; publicLeadNumber: string }
  | { status: "pending" | "unknown" };

export async function getProjectCheckSubmissionStatus(
  leadIdInput: string
): Promise<ProjectCheckSubmissionStatus> {
  const parsedLeadId = z.string().uuid().safeParse(leadIdInput);

  if (!parsedLeadId.success) {
    return { status: "unknown" };
  }

  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      status: leads.status,
      createdAt: leads.createdAt
    })
    .from(leads)
    .where(eq(leads.leadId, parsedLeadId.data))
    .limit(1);

  if (lead?.status === "new") {
    return {
      status: "submitted",
      publicLeadNumber: formatPublicLeadNumber(lead.id, lead.createdAt)
    };
  }

  return { status: lead ? "pending" : "unknown" };
}
