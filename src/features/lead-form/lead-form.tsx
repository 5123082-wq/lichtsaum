"use client";

import {
  Check,
  FilePdf,
  ImageSquare,
  Paperclip,
  Trash
} from "@phosphor-icons/react";
import { upload } from "@vercel/blob/client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent
} from "react";

import { emitGenerateLeadOnce, emitLeadAnalyticsEvent, type FormId, type FormLocation } from "@/features/analytics/events";
import type { ConfiguratorCalculation } from "@/features/configurator/types";

import {
  isAcceptedProjectFileType,
  MAX_PROJECT_FILES,
  MAX_PROJECT_FILE_SIZE,
  MAX_PROJECT_FILES_TOTAL_SIZE,
  PROJECT_FILE_ACCEPT
} from "./file-rules";
import type { ConfiguratorProjectSubmission, MiniProjectSubmission } from "./request-context";
import {
  confirmProjectFileUpload,
  finalizeProjectCheckSubmission,
  getProjectCheckSubmissionStatus,
  prepareProjectCheckSubmission
} from "./submission-action";
import {
  initialProjectCheckFormState,
  type ProjectCheckFieldName,
  type ProjectCheckFormState
} from "./types";

const fieldClassName =
  "min-h-14 w-full rounded-none border border-[rgb(229_226_225_/_24%)] bg-[var(--charcoal-deep)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[rgb(199_198_197_/_55%)] hover:border-[rgb(229_226_225_/_55%)] focus:border-[var(--accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-semibold text-[var(--text-primary)]";

const euroCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR"
});

type ConfiguratorPricingChange = Readonly<{
  pricingVersion: string;
  calculation: ConfiguratorCalculation;
}>;

type LeadFormProps = Readonly<{
  attachmentsEnabled?: boolean;
  configuratorProject?: ConfiguratorProjectSubmission;
  miniProject?: MiniProjectSubmission;
  formId?: FormId;
  formLocation?: FormLocation;
  onSubmittedChange?: (submitted: boolean) => void;
  submitLabel?: string;
  labelledById?: string;
  onConfiguratorPricingConfirmed?: (
    change: ConfiguratorPricingChange
  ) => void;
  onSubmissionPendingChange?: (isPending: boolean) => void;
}>;

function fileKey(file: File) {
  return [file.name, file.size, file.type, file.lastModified].join(":");
}

type ClientSubmissionAttempt = Readonly<{
  fingerprint: string;
  idempotencyKey: string;
  uploadToken: string;
}>;

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalize(entry)])
    );
  }

  return value;
}

function submissionFingerprint(value: unknown) {
  return JSON.stringify(canonicalize(value));
}

function createClientUploadToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
  }

  return (bytes / 1024 / 1024).toFixed(1).replace(".", ",") + " MB";
}

interface ProjectAttachment {
  file: File;
  previewUrl: string;
}

function AttachmentPreview({
  attachment
}: {
  attachment: ProjectAttachment;
}) {
  const { file, previewUrl } = attachment;
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  if (file.type === "application/pdf") {
    return (
      <span className="flex size-full items-center justify-center bg-[rgb(255_92_0_/_10%)] text-[var(--accent)]">
        <FilePdf aria-hidden="true" size={38} weight="light" />
      </span>
    );
  }

  if (imageLoadFailed) {
    return (
      <span className="flex size-full items-center justify-center bg-[var(--surface-high)] text-[var(--text-muted)]">
        <ImageSquare aria-hidden="true" size={34} weight="light" />
      </span>
    );
  }

  return previewUrl ? (
    // A blob URL is required for a local preview and is never sent to Next Image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="size-full object-cover"
      src={previewUrl}
      alt={"Vorschau für " + file.name}
      onError={() => setImageLoadFailed(true)}
    />
  ) : (
    <span className="size-16 shrink-0 animate-pulse bg-[var(--surface-high)]" />
  );
}

function errorsFor(
  state: ProjectCheckFormState,
  field: ProjectCheckFieldName
) {
  return state.fieldErrors[field] ?? [];
}

function fieldDescribedBy(
  idPrefix: string,
  state: ProjectCheckFormState,
  field: ProjectCheckFieldName,
  hintId?: string
) {
  const ids = [
    hintId,
    errorsFor(state, field).length > 0 ? idPrefix + field + "-error" : undefined
  ].filter(Boolean);

  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldError({
  field,
  state,
  idPrefix
}: {
  idPrefix: string;
  field: ProjectCheckFieldName;
  state: ProjectCheckFormState;
}) {
  const errors = errorsFor(state, field);

  if (errors.length === 0) {
    return null;
  }

  return (
    <p
      className="mt-2 text-sm font-semibold text-[var(--error)]"
      id={idPrefix + field + "-error"}
    >
      {errors.join(" ")}
    </p>
  );
}

function ErrorSummary({ state, idPrefix }: { state: ProjectCheckFormState; idPrefix: string }) {
  const fields = Object.entries(state.fieldErrors) as Array<
    [ProjectCheckFieldName, string[]]
  >;

  if (state.status !== "invalid" || fields.length === 0) {
    return null;
  }

  return (
    <div
      className="border-l-4 border-[var(--error)] bg-[rgb(255_180_171_/_8%)] p-5"
      role="alert"
      aria-labelledby={idPrefix + "project-check-error-title"}
    >
      <h3
        className="m-0 text-lg font-bold text-[var(--text-primary)]"
        id={idPrefix + "project-check-error-title"}
      >
        Bitte prüfen Sie Ihre Angaben
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{state.message}</p>
      <ul className="mt-3 grid gap-2 pl-5 text-sm text-[var(--error)]">
        {fields.map(([field, errors]) => (
          <li key={field}>
            <a
              className="underline decoration-1 underline-offset-4"
              href={"#" + idPrefix + field}
            >
              {errors[0]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubmissionLoader({ active }: { active: boolean }) {
  return (
    <div
      className="lead-form__loader"
      data-active={active}
      aria-hidden={!active}
    >
      <svg
        className="lead-form__loader-mark"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <g className="lead-form__loader-pieces" fill="currentColor">
          <path
            className="lead-form__loader-piece lead-form__loader-piece--a"
            d="M96 96h320L96 416V96Z"
          />
          <path
            className="lead-form__loader-piece lead-form__loader-piece--b"
            d="M116 416h212V208L116 416Z"
          />
          <path
            className="lead-form__loader-piece lead-form__loader-piece--c"
            d="M348 188v228h72V116l-72 72Z"
          />
        </g>
      </svg>
      <span className="sr-only" aria-live="polite">
        {active ? "Ihre Anfrage wird verarbeitet." : ""}
      </span>
    </div>
  );
}

export function LeadForm({
  attachmentsEnabled = true,
  configuratorProject,
  miniProject,
  formId = "main_inquiry",
  formLocation = "landing",
  onSubmittedChange,
  submitLabel = "Projekt prüfen lassen",
  labelledById = "project-check-title",
  onConfiguratorPricingConfirmed,
  onSubmissionPendingChange
}: LeadFormProps) {
  const idPrefix = useId().replaceAll(":", "") + "-";
  const startedRef = useRef(false);
  const describedBy = (state: ProjectCheckFormState, field: ProjectCheckFieldName, hintId?: string) => fieldDescribedBy(idPrefix, state, field, hintId);
  const [state, setState] = useState(initialProjectCheckFormState);
  function updateState(next: ProjectCheckFormState) {
    setState(next);
    onSubmittedChange?.(next.status === "submitted");
    if (next.status === "invalid") {
      emitLeadAnalyticsEvent({ name: "lead_form_validation_error", form_id: formId, error_group: "validation", error_count: Math.max(1, Object.values(next.fieldErrors).flat().length) });
    } else if (next.status === "prototype_unavailable") {
      emitLeadAnalyticsEvent({ name: "lead_submit_error", form_id: formId, error_group: "integration" });
    }
  }
  function markStarted(event: FormEvent<HTMLFormElement>) {
    if (startedRef.current || !(event.target instanceof HTMLElement) || event.target.getAttribute("name") === "website") return;
    startedRef.current = true;
    emitLeadAnalyticsEvent({ name: "lead_form_start", form_id: formId, form_location: formLocation });
  }
  const [pendingPricingChange, setConfiguratorPricingChange] =
    useState<(ConfiguratorPricingChange & { submissionKey: string }) | null>(null);
  const configuratorPricingChange = pendingPricingChange?.submissionKey === submissionFingerprint(configuratorProject)
    ? pendingPricingChange : null;
  const [isPending, startTransition] = useTransition();
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [fileSelectionError, setFileSelectionError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const submissionAttemptRef = useRef<ClientSubmissionAttempt | null>(null);
  const submissionLockRef = useRef(false);

  function syncFileInput(files: File[]) {
    if (!fileInputRef.current) {
      return;
    }

    const transfer = new DataTransfer();

    for (const file of files) {
      transfer.items.add(file);
    }

    fileInputRef.current.files = transfer.files;
  }

  function selectFiles(incomingFiles: File[]) {
    const existingKeys = new Set(
      attachments.map((attachment) => fileKey(attachment.file))
    );
    const uniqueFiles = incomingFiles.filter(
      (file) => !existingKeys.has(fileKey(file))
    );
    const rejectedType = uniqueFiles.some(
      (file) => !isAcceptedProjectFileType(file.type)
    );
    const rejectedSize = uniqueFiles.some(
      (file) => file.size > MAX_PROJECT_FILE_SIZE
    );
    const acceptedFiles = uniqueFiles.filter(
      (file) =>
        isAcceptedProjectFileType(file.type) &&
        file.size <= MAX_PROJECT_FILE_SIZE
    );
    const availableSlots = Math.max(
      0,
      MAX_PROJECT_FILES - attachments.length
    );
    const availableBytes = Math.max(
      0,
      MAX_PROJECT_FILES_TOTAL_SIZE -
        attachments.reduce((total, attachment) => total + attachment.file.size, 0)
    );
    let selectedBytes = 0;
    const filesWithinTotalLimit = acceptedFiles
      .slice(0, availableSlots)
      .filter((file) => {
        if (selectedBytes + file.size > availableBytes) {
          return false;
        }

        selectedBytes += file.size;
        return true;
      });
    const rejectedTotalSize = filesWithinTotalLimit.length < Math.min(
      acceptedFiles.length,
      availableSlots
    );
    const addedAttachments = filesWithinTotalLimit
      .map((file) => {
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "";

        if (previewUrl) {
          previewUrlsRef.current.add(previewUrl);
        }

        return { file, previewUrl };
      });
    const nextAttachments = [...attachments, ...addedAttachments];
    const nextFiles = nextAttachments.map((attachment) => attachment.file);

    if (rejectedTotalSize) {
      setFileSelectionError(
        "Alle Dateien zusammen dürfen höchstens 50 MB groß sein."
      );
    } else if (rejectedSize) {
      setFileSelectionError(
        "Dateien über 15 MB wurden nicht hinzugefügt."
      );
    } else if (rejectedType) {
      setFileSelectionError(
        "Bitte verwenden Sie nur JPG, PNG, WebP oder PDF."
      );
    } else if (attachments.length + acceptedFiles.length > MAX_PROJECT_FILES) {
      setFileSelectionError(
        "Sie können höchstens fünf Dateien auswählen."
      );
    } else {
      setFileSelectionError("");
    }

    setAttachments(nextAttachments);
    syncFileInput(nextFiles);
  }

  function removeFile(attachmentToRemove: ProjectAttachment) {
    const keyToRemove = fileKey(attachmentToRemove.file);
    const nextAttachments = attachments.filter(
      (attachment) => fileKey(attachment.file) !== keyToRemove
    );
    const nextFiles = nextAttachments.map((attachment) => attachment.file);

    if (attachmentToRemove.previewUrl) {
      URL.revokeObjectURL(attachmentToRemove.previewUrl);
      previewUrlsRef.current.delete(attachmentToRemove.previewUrl);
    }

    setAttachments(nextAttachments);
    setFileSelectionError("");
    syncFileInput(nextFiles);
  }

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      for (const previewUrl of previewUrls) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (state.status === "submitted") {
      successRef.current?.focus();
    } else if (state.status !== "idle") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  useEffect(() => {
    if (!isPending || formRef.current?.closest("dialog")) {
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isPending]);

  const hasResult =
    state.status === "prototype_validated" ||
    state.status === "prototype_unavailable";
  const isSubmitted = state.status === "submitted";

  function resetForm() {
    for (const previewUrl of previewUrlsRef.current) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrlsRef.current.clear();
    formRef.current?.reset();
    setAttachments([]);
    setFileSelectionError("");
    setConfiguratorPricingChange(null);
    updateState(initialProjectCheckFormState);
    startedRef.current = false;
    submissionAttemptRef.current = null;

    requestAnimationFrame(() => emailInputRef.current?.focus());
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionLockRef.current) {
      return;
    }

    submissionLockRef.current = true;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const sourcePath = window.location.pathname;
    const files = attachments.map((attachment) => ({
      name: attachment.file.name,
      type: attachment.file.type,
      size: attachment.file.size
    }));
    const fingerprint = submissionFingerprint({
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      projectContext: String(formData.get("projectContext") ?? ""),
      website: String(formData.get("website") ?? ""),
      sourcePath,
      configuratorProject,
      miniProject,
      files: attachments.map((attachment) => ({
        name: attachment.file.name,
        type: attachment.file.type,
        size: attachment.file.size,
        lastModified: attachment.file.lastModified
      }))
    });
    let attempt = submissionAttemptRef.current;

    if (!attempt || attempt.fingerprint !== fingerprint) {
      attempt = {
        fingerprint,
        idempotencyKey: crypto.randomUUID(),
        uploadToken: createClientUploadToken()
      };
      submissionAttemptRef.current = attempt;
    }

    emitLeadAnalyticsEvent({ name: "lead_submit_attempt", form_id: formId });
    onSubmissionPendingChange?.(true);
    startTransition(async () => {
      let leadIdForRecovery: string | null = null;

      try {
        const prepared = await prepareProjectCheckSubmission({
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          projectContext: String(formData.get("projectContext") ?? ""),
          website: String(formData.get("website") ?? ""),
          sourcePath,
          idempotencyKey: attempt.idempotencyKey,
          uploadToken: attempt.uploadToken,
          configuratorProject,
          miniProject,
          files
        });

        if (prepared.kind === "result") {
          if (prepared.state.status === "submitted" && prepared.state.leadId) {
            emitGenerateLeadOnce(prepared.state.leadId, formId);
          }

          updateState(prepared.state);
          return;
        }

        if (prepared.kind === "pricing_changed") {
          setConfiguratorPricingChange({
            submissionKey: submissionFingerprint(configuratorProject),
            pricingVersion: prepared.pricingVersion,
            calculation: prepared.calculation
          });
          requestAnimationFrame(() => resultRef.current?.focus());
          return;
        }

        leadIdForRecovery = prepared.plan.leadId;

        updateState({
          status: "uploading",
          message: "Ihre Dateien werden sicher übertragen.",
          fieldErrors: {}
        });

        for (const [index, plannedFile] of prepared.plan.files.entries()) {
          if (plannedFile.uploaded) {
            continue;
          }

          const attachment = attachments[index];

          if (!attachment) {
            throw new Error("The local file selection changed during upload.");
          }

          const blob = await upload(plannedFile.pathname, attachment.file, {
            access: "private",
            handleUploadUrl: "/api/lead-files/upload",
            clientPayload: JSON.stringify({
              leadId: prepared.plan.leadId,
              fileId: plannedFile.fileId,
              uploadToken: prepared.plan.uploadToken
            })
          });

          await confirmProjectFileUpload({
            leadId: prepared.plan.leadId,
            fileId: plannedFile.fileId,
            uploadToken: prepared.plan.uploadToken,
            contentType: blob.contentType
          });
        }

        const finalizedState = await finalizeProjectCheckSubmission(
          prepared.plan.leadId,
          prepared.plan.uploadToken
        );

        if (finalizedState.status === "submitted" && finalizedState.leadId) {
          emitGenerateLeadOnce(finalizedState.leadId, formId);
        }

        updateState(finalizedState);
      } catch {
        if (leadIdForRecovery) {
          try {
            const recoveredStatus = await getProjectCheckSubmissionStatus(
              leadIdForRecovery
            );

            if (recoveredStatus.status === "submitted") {
              emitGenerateLeadOnce(leadIdForRecovery, formId);
              updateState({
                status: "submitted",
                message:
                  "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über den von Ihnen angegebenen Kontaktweg.",
                fieldErrors: {},
                leadId: leadIdForRecovery,
                publicLeadNumber: recoveredStatus.publicLeadNumber
              });
              return;
            }
          } catch {
            // Keep the public fallback generic and free of technical details.
          }
        }

        updateState({
          status: "prototype_unavailable",
          message:
            "Die Projektanfrage konnte nicht sicher gespeichert werden. Bitte versuchen Sie es später erneut.",
          fieldErrors: {}
        });
      } finally {
        submissionLockRef.current = false;
        onSubmissionPendingChange?.(false);
      }
    });
  }

  return (
    <form
      className="lead-form border-y border-[var(--border)]"
      id={idPrefix + "project-check-form"}
      name="project-check-form"
      ref={formRef}
      onSubmit={submitForm}
      onChangeCapture={markStarted}
      aria-labelledby={labelledById}
      aria-busy={isPending}
      noValidate
    >
      <span id={idPrefix + "miniProject"} tabIndex={-1} />
      <span id={idPrefix + "configuratorProject"} tabIndex={-1} />
      <div className="lead-form__stage" data-submitted={isSubmitted}>
        <div
          className="lead-form__entry"
          aria-hidden={isSubmitted}
          inert={isSubmitted || isPending}
        >
      <div className={attachmentsEnabled ? "grid desktop:grid-cols-2" : "grid"}>
        <div
          className={
            attachmentsEnabled
              ? "grid content-start gap-6 border-b border-[var(--border)] py-8 desktop:border-b-0 desktop:border-r desktop:py-10 desktop:pr-10"
              : "grid content-start gap-6 py-8 desktop:py-10"
          }
        >
          <div>
            <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
              01 / Kontakt
            </p>
            <h3 className="mb-0 mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.035em]">
              Wie erreichen wir Sie?
            </h3>
          </div>

          {state.status !== "idle" || (configuratorProject && configuratorPricingChange) ? (
            <div ref={resultRef} tabIndex={-1}>
              <ErrorSummary state={state} idPrefix={idPrefix} />
              {configuratorProject && configuratorPricingChange ? (
                <div
                  className="border-l-4 border-[var(--accent)] bg-[rgb(255_92_0_/_8%)] p-5"
                  role="alert"
                  aria-labelledby={idPrefix + "configurator-pricing-change-title"}
                >
                  <h3
                    className="m-0 text-lg font-bold text-[var(--text-primary)]"
                    id={idPrefix + "configurator-pricing-change-title"}
                  >
                    Kalkulation wurde aktualisiert
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Der neue vorläufige Nettopreis beträgt{" "}
                    {euroCurrencyFormatter.format(
                      configuratorPricingChange.calculation.netTotalCents / 100
                    )}
                    . Bitte übernehmen Sie die Aktualisierung und senden Sie
                    die Anfrage danach erneut.
                  </p>
                  <button
                    className="button button--secondary mt-4"
                    onClick={() => {
                      onConfiguratorPricingConfirmed?.(
                        configuratorPricingChange
                      );
                      setConfiguratorPricingChange(null);
                      updateState(initialProjectCheckFormState);
                    }}
                    type="button"
                  >
                    Aktualisierten Preis bestätigen
                  </button>
                </div>
              ) : null}
              {hasResult ? (
                <div
                  className="border-l-4 border-[var(--accent)] bg-[rgb(255_92_0_/_8%)] p-5"
                  role="status"
                  aria-live="polite"
                >
                  <h3 className="m-0 text-lg font-bold text-[var(--text-primary)]">
                    {state.status === "submitted"
                      ? "Projektanfrage übermittelt"
                      : state.status === "prototype_validated"
                        ? "Prototyp-Prüfung abgeschlossen"
                        : "Übermittlung nicht bestätigt"}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {state.message}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className={labelClassName} htmlFor={idPrefix + "email"}>
              E-Mail-Adresse{" "}
              <span className="font-normal text-[var(--accent)]">
                (Pflichtfeld)
              </span>
            </label>
            <input
              className={fieldClassName}
              id={idPrefix + "email"}
              name="email"
              ref={emailInputRef}
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              placeholder="name@unternehmen.de"
              aria-invalid={errorsFor(state, "email").length > 0}
              aria-describedby={describedBy(state, "email")}
            />
            <FieldError idPrefix={idPrefix} field="email" state={state} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={idPrefix + "phone"}>
              Telefonnummer{" "}
              <span className="font-normal text-[var(--text-muted)]">
                (optional)
              </span>
            </label>
            <input
              className={fieldClassName}
              id={idPrefix + "phone"}
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={50}
              placeholder="Für einen Rückruf"
              aria-invalid={errorsFor(state, "phone").length > 0}
              aria-describedby={describedBy(state, "phone")}
            />
            <FieldError idPrefix={idPrefix} field="phone" state={state} />
          </div>

          <div>
            <label className={labelClassName} htmlFor={idPrefix + "projectContext"}>
              Kurze Nachricht{" "}
              <span className="font-normal text-[var(--text-muted)]">
                (optional)
              </span>
            </label>
            <textarea
              className={fieldClassName + " min-h-32 resize-y"}
              id={idPrefix + "projectContext"}
              name="projectContext"
              maxLength={1000}
              placeholder="Was möchten Sie prüfen lassen?"
              aria-invalid={errorsFor(state, "projectContext").length > 0}
              aria-describedby={describedBy(
                state,
                "projectContext",
                idPrefix + "projectContext-hint"
              )}
            />
            <p
              className="mb-0 mt-2 text-sm leading-6 text-[var(--text-muted)]"
              id={idPrefix + "projectContext-hint"}
            >
              Bitte keine Zugangsdaten, Zahlungsdaten oder sensiblen Angaben.
            </p>
            <FieldError idPrefix={idPrefix} field="projectContext" state={state} />
          </div>
        </div>

        {attachmentsEnabled ? (
          <div className="grid content-start gap-6 py-8 desktop:py-10 desktop:pl-10">
          <div>
            <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
              02 / Dateien
            </p>
            <h3 className="mb-0 mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.035em]">
              Dateien anhängen.
            </h3>
          </div>

          <div className="desktop:mt-7">
            <div
              className="border border-dashed border-[rgb(229_226_225_/_34%)] bg-[var(--charcoal-deep)] transition-colors focus-within:border-[var(--accent)] focus-within:shadow-[var(--focus-ring)]"
            >
              <input
                className="sr-only"
                id={idPrefix + "projectFiles"}
                name="projectFiles"
                type="file"
                multiple
                ref={fileInputRef}
                accept={PROJECT_FILE_ACCEPT}
                aria-invalid={
                  fileSelectionError.length > 0 ||
                  errorsFor(state, "projectFiles").length > 0
                }
                aria-describedby={describedBy(
                  state,
                  "projectFiles",
                  fileSelectionError
                    ? idPrefix + "projectFiles-hint " + idPrefix + "projectFiles-selection-error"
                    : idPrefix + "projectFiles-hint"
                )}
                onChange={(event) =>
                  selectFiles(Array.from(event.currentTarget.files ?? []))
                }
              />

              {attachments.length === 0 ? (
                <label
                  className="group flex min-h-40 cursor-pointer flex-col items-center justify-center p-5 text-center hover:border-[var(--accent)]"
                  htmlFor={idPrefix + "projectFiles"}
                >
                  <span className="flex size-12 items-center justify-center border border-[var(--border)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                    <Paperclip aria-hidden="true" size={24} weight="light" />
                  </span>
                  <span className="mt-4 text-base font-bold text-[var(--text-primary)]">
                    Dateien auswählen
                  </span>
                  <span
                    className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]"
                    id={idPrefix + "projectFiles-hint"}
                  >
                    JPG, PNG, WebP oder PDF · maximal 15 MB je Datei · bis zu 5
                    Dateien · zusammen maximal 50 MB · optional
                  </span>
                </label>
              ) : (
                <div className="p-3 tablet:p-4">
                  <ul
                    className="m-0 grid list-none grid-cols-2 gap-3 p-0 tablet:grid-cols-3"
                    aria-label="Ausgewählte Dateien"
                  >
                    {attachments.map((attachment) => (
                      <li
                        className="relative aspect-square min-w-0 overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
                        key={fileKey(attachment.file)}
                      >
                        <AttachmentPreview attachment={attachment} />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(15_15_15_/_94%)_38%)] px-2 pb-2 pt-8">
                          <span className="block truncate text-xs font-bold text-[var(--text-primary)]">
                            {attachment.file.name}
                          </span>
                          <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            {attachment.file.type === "application/pdf"
                              ? "PDF"
                              : "Bild"}{" "}
                            · {formatFileSize(attachment.file.size)}
                          </span>
                        </span>
                        <button
                          className="absolute right-1.5 top-1.5 z-10 flex size-11 items-center justify-center border border-[rgb(229_226_225_/_24%)] bg-[rgb(15_15_15_/_88%)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          type="button"
                          aria-label={
                            "Datei " + attachment.file.name + " entfernen"
                          }
                          onClick={() => removeFile(attachment)}
                        >
                          <Trash
                            aria-hidden="true"
                            size={19}
                            weight="light"
                          />
                        </button>
                      </li>
                    ))}

                    {attachments.length < MAX_PROJECT_FILES ? (
                      <li className="aspect-square">
                        <label
                          className="group flex size-full cursor-pointer flex-col items-center justify-center border border-[var(--border)] bg-[var(--surface)] p-3 text-center transition-colors hover:border-[var(--accent)]"
                          htmlFor={idPrefix + "projectFiles"}
                        >
                          <span className="flex size-11 items-center justify-center border border-[var(--border)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                            <Paperclip
                              aria-hidden="true"
                              size={21}
                              weight="light"
                            />
                          </span>
                          <span className="mt-3 text-xs font-bold text-[var(--text-primary)]">
                            Weitere Dateien
                          </span>
                        </label>
                      </li>
                    ) : null}
                  </ul>
                  <p
                    className="mb-0 mt-3 text-center text-xs leading-5 text-[var(--text-muted)]"
                    id={idPrefix + "projectFiles-hint"}
                  >
                    {attachments.length}/5 Dateien · maximal 15 MB je Datei ·
                    zusammen maximal 50 MB
                  </p>
                </div>
              )}
            </div>
            {fileSelectionError ? (
              <p
                className="mt-2 text-sm font-semibold text-[var(--error)]"
                id={idPrefix + "projectFiles-selection-error"}
                role="alert"
              >
                {fileSelectionError}
              </p>
            ) : null}
            <FieldError idPrefix={idPrefix} field="projectFiles" state={state} />
            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Bitte laden Sie nur projektbezogene Dateien hoch, die Sie uns
              zur Bearbeitung Ihrer Anfrage übermitteln dürfen.
            </p>
          </div>
          </div>
        ) : null}
      </div>

      <div
        className="absolute left-[-10000px] top-auto size-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={idPrefix + "website"}>Website</label>
        <input
          id={idPrefix + "website"}
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div className="grid gap-5 border-t border-[var(--border)] py-7 desktop:grid-cols-[minmax(0,1fr)_auto] desktop:items-center">
        <p className="m-0 text-sm leading-6 text-[var(--text-muted)]">
          Informationen zur Verarbeitung Ihrer Angaben finden Sie in der{" "}
          <a
            className="underline decoration-1 underline-offset-4 hover:text-[var(--text-primary)]"
            href="/datenschutz"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
        <div className="grid justify-items-start desktop:justify-items-end">
          <button
            className="button button--primary min-w-60 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isPending || (configuratorProject !== undefined && configuratorPricingChange !== null)}
          >
            {state.status === "uploading"
              ? "Dateien werden übertragen…"
              : isPending
                ? "Formular wird geprüft…"
                : submitLabel}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {state.status === "uploading"
            ? "Dateien werden sicher übertragen."
            : isPending
              ? "Formular wird geprüft."
              : ""}
        </p>
      </div>
        </div>

        <div
          className="lead-form__success"
          ref={successRef}
          role="status"
          aria-live="polite"
          aria-hidden={!isSubmitted}
          inert={!isSubmitted}
          tabIndex={-1}
        >
          {isSubmitted ? (
            <>
              <div className="lead-form__success-icon" aria-hidden="true">
                <Check size={64} weight="light" />
              </div>
              <p className="lead-form__success-eyebrow">Projekt-Check</p>
              <h3 className="lead-form__success-title">
                Anfrage übermittelt.
              </h3>
              <p className="lead-form__success-copy">
                Vielen Dank für Ihre Anfrage. Ihre Angaben
                {attachments.length > 0 ? " und Dateien" : ""} wurden sicher
                übermittelt. Wir melden uns über den von Ihnen angegebenen
                Kontaktweg.
              </p>
              {state.publicLeadNumber ? (
                <p className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-primary)]">
                  Anfragenummer: {state.publicLeadNumber}
                </p>
              ) : null}
              <button
                className="button button--secondary lead-form__success-reset"
                type="button"
                onClick={resetForm}
              >
                Weitere Anfrage senden
              </button>
            </>
          ) : null}
        </div>

        <SubmissionLoader active={isPending && !isSubmitted} />
      </div>
    </form>
  );
}
