"use server";

import { parseProjectCheckFormData } from "./schema";
import {
  PROJECT_CHECK_FIELD_NAMES,
  type ProjectCheckFieldErrors,
  type ProjectCheckFieldName,
  type ProjectCheckFormState
} from "./types";

const projectCheckFieldNames = new Set<string>(PROJECT_CHECK_FIELD_NAMES);

function isProjectCheckFieldName(
  value: string
): value is ProjectCheckFieldName {
  return projectCheckFieldNames.has(value);
}

function collectFieldErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
  const fieldErrors: ProjectCheckFieldErrors = {};

  for (const issue of issues) {
    const [field] = issue.path;

    if (typeof field !== "string" || !isProjectCheckFieldName(field)) {
      continue;
    }

    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return fieldErrors;
}

export async function submitProjectCheck(
  _previousState: ProjectCheckFormState,
  formData: FormData
): Promise<ProjectCheckFormState> {
  if (process.env.APP_ENV === "production") {
    return {
      status: "prototype_unavailable",
      message:
        "Die Projektanfrage ist noch nicht freigeschaltet. Es wurden keine Daten gespeichert oder versendet.",
      fieldErrors: {}
    };
  }

  const honeypot = formData.get("website");

  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return {
      status: "prototype_unavailable",
      message:
        "Die Eingaben konnten nicht geprüft werden. Es wurden keine Daten gespeichert oder versendet.",
      fieldErrors: {}
    };
  }

  const parsed = parseProjectCheckFormData(formData);

  if (!parsed.success) {
    return {
      status: "invalid",
      message:
        "Bitte prüfen Sie die markierten Felder. Ihre Eingaben wurden nicht gespeichert und nicht als Projektanfrage weitergeleitet.",
      fieldErrors: collectFieldErrors(parsed.error.issues)
    };
  }

  return {
    status: "prototype_validated",
    message:
      "Ihre Eingaben erfüllen die Formularregeln dieses Prototyps. Sie wurden nicht gespeichert und nicht als Projektanfrage weitergeleitet.",
    fieldErrors: {}
  };
}
