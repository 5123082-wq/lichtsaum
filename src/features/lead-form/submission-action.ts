"use server";

import { z } from "zod";

import { projectCheckContactSchema } from "./schema";
import {
  confirmLeadFileUpload,
  createLeadUploadPlan,
  finalizeLeadUploadPlan,
  type LeadUploadPlan
} from "./upload-service";
import { uploadManifestSchema } from "./upload-contract";
import type {
  ProjectCheckFieldErrors,
  ProjectCheckFieldName,
  ProjectCheckFormState
} from "./types";

const submissionSchema = projectCheckContactSchema.extend({
  files: uploadManifestSchema
});

const projectCheckFieldNames = new Set<ProjectCheckFieldName>([
  "email",
  "phone",
  "projectContext",
  "projectFiles"
]);

export interface ProjectCheckSubmissionInput {
  email: string;
  phone: string;
  projectContext: string;
  website: string;
  sourcePath: string;
  files: Array<{ name: string; type: string; size: number }>;
}

export type PrepareProjectCheckResult =
  | { kind: "result"; state: ProjectCheckFormState }
  | { kind: "upload"; plan: LeadUploadPlan };

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

  if (
    process.env.LEAD_INTAKE_ENABLED !== "true" ||
    process.env.LEAD_ATTACHMENTS_ENABLED !== "true"
  ) {
    return {
      kind: "result",
      state: {
        status: "prototype_validated",
        message:
          "Ihre Eingaben erfüllen die Formularregeln dieses Prototyps. Sie wurden nicht gespeichert und nicht als Projektanfrage weitergeleitet.",
        fieldErrors: {}
      }
    };
  }

  const plan = await createLeadUploadPlan(
    {
      email: parsed.data.email,
      phone: parsed.data.phone,
      projectContext: parsed.data.projectContext,
      sourcePath: input.sourcePath
    },
    parsed.data.files
  );

  return { kind: "upload", plan };
}

export async function confirmProjectFileUpload(input: {
  leadId: string;
  fileId: string;
  uploadToken: string;
  pathname: string;
  contentType: string;
}) {
  await confirmLeadFileUpload(input);
}

export async function finalizeProjectCheckSubmission(
  leadId: string,
  uploadToken: string
): Promise<ProjectCheckFormState> {
  await finalizeLeadUploadPlan(leadId, uploadToken);

  return {
    status: "submitted",
    message:
      "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über die angegebene Kontaktmöglichkeit.",
    fieldErrors: {},
    leadId
  };
}
