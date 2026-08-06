"use client";

import {
  FilePdf,
  ImageSquare,
  Paperclip,
  Trash
} from "@phosphor-icons/react";
import { upload } from "@vercel/blob/client";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent
} from "react";

import {
  isAcceptedProjectFileType,
  MAX_PROJECT_FILES,
  MAX_PROJECT_FILE_SIZE,
  MAX_PROJECT_FILES_TOTAL_SIZE,
  PROJECT_FILE_ACCEPT
} from "./file-rules";
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

function fileKey(file: File) {
  return [file.name, file.size, file.type, file.lastModified].join(":");
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

function describedBy(
  state: ProjectCheckFormState,
  field: ProjectCheckFieldName,
  hintId?: string
) {
  const ids = [
    hintId,
    errorsFor(state, field).length > 0 ? field + "-error" : undefined
  ].filter(Boolean);

  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldError({
  field,
  state
}: {
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
      id={field + "-error"}
    >
      {errors.join(" ")}
    </p>
  );
}

function ErrorSummary({ state }: { state: ProjectCheckFormState }) {
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
      aria-labelledby="project-check-error-title"
    >
      <h3
        className="m-0 text-lg font-bold text-[var(--text-primary)]"
        id="project-check-error-title"
      >
        Bitte prüfen Sie Ihre Angaben
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{state.message}</p>
      <ul className="mt-3 grid gap-2 pl-5 text-sm text-[var(--error)]">
        {fields.map(([field, errors]) => (
          <li key={field}>
            <a
              className="underline decoration-1 underline-offset-4"
              href={"#" + field}
            >
              {errors[0]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LeadForm() {
  const [state, setState] = useState(initialProjectCheckFormState);
  const [isPending, startTransition] = useTransition();
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [fileSelectionError, setFileSelectionError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());

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
    if (state.status !== "idle") {
      resultRef.current?.focus();
    }
  }, [state.status]);

  const hasResult =
    state.status === "prototype_validated" ||
    state.status === "prototype_unavailable" ||
    state.status === "submitted";

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      let leadIdForRecovery: string | null = null;

      try {
        const prepared = await prepareProjectCheckSubmission({
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          projectContext: String(formData.get("projectContext") ?? ""),
          website: String(formData.get("website") ?? ""),
          sourcePath: window.location.pathname,
          files: attachments.map((attachment) => ({
            name: attachment.file.name,
            type: attachment.file.type,
            size: attachment.file.size
          }))
        });

        if (prepared.kind === "result") {
          setState(prepared.state);
          return;
        }

        leadIdForRecovery = prepared.plan.leadId;

        setState({
          status: "uploading",
          message: "Ihre Dateien werden sicher übertragen.",
          fieldErrors: {}
        });

        for (const [index, plannedFile] of prepared.plan.files.entries()) {
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
            pathname: blob.pathname,
            contentType: blob.contentType
          });
        }

        setState(
          await finalizeProjectCheckSubmission(
            prepared.plan.leadId,
            prepared.plan.uploadToken
          )
        );
      } catch {
        if (leadIdForRecovery) {
          try {
            const recoveredStatus = await getProjectCheckSubmissionStatus(
              leadIdForRecovery
            );

            if (recoveredStatus === "submitted") {
              setState({
                status: "submitted",
                message:
                  "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über die angegebene Kontaktmöglichkeit.",
                fieldErrors: {},
                leadId: leadIdForRecovery
              });
              return;
            }
          } catch {
            // Keep the public fallback generic and free of technical details.
          }
        }

        setState({
          status: "prototype_unavailable",
          message:
            "Die Projektanfrage konnte nicht sicher gespeichert werden. Bitte versuchen Sie es später erneut.",
          fieldErrors: {}
        });
      }
    });
  }

  return (
    <form
      className="border-y border-[var(--border)]"
      id="project-check-form"
      name="project-check-form"
      onSubmit={submitForm}
      aria-labelledby="project-check-title"
      noValidate
    >
      <div className="grid desktop:grid-cols-2">
        <div className="grid content-start gap-6 border-b border-[var(--border)] py-8 desktop:border-b-0 desktop:border-r desktop:py-10 desktop:pr-10">
          <div>
            <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
              01 / Kontakt
            </p>
            <h3 className="mb-0 mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.035em]">
              Wie erreichen wir Sie?
            </h3>
          </div>

          {state.status !== "idle" ? (
            <div ref={resultRef} tabIndex={-1}>
              <ErrorSummary state={state} />
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
            <label className={labelClassName} htmlFor="email">
              E-Mail-Adresse{" "}
              <span className="font-normal text-[var(--accent)]">
                (Pflichtfeld)
              </span>
            </label>
            <input
              className={fieldClassName}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              placeholder="name@unternehmen.de"
              aria-invalid={errorsFor(state, "email").length > 0}
              aria-describedby={describedBy(state, "email")}
            />
            <FieldError field="email" state={state} />
          </div>

          <div>
            <label className={labelClassName} htmlFor="phone">
              Telefonnummer{" "}
              <span className="font-normal text-[var(--text-muted)]">
                (optional)
              </span>
            </label>
            <input
              className={fieldClassName}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={50}
              placeholder="Für einen Rückruf"
              aria-invalid={errorsFor(state, "phone").length > 0}
              aria-describedby={describedBy(state, "phone")}
            />
            <FieldError field="phone" state={state} />
          </div>

          <div>
            <label className={labelClassName} htmlFor="projectContext">
              Kurze Nachricht{" "}
              <span className="font-normal text-[var(--text-muted)]">
                (optional)
              </span>
            </label>
            <textarea
              className={fieldClassName + " min-h-32 resize-y"}
              id="projectContext"
              name="projectContext"
              maxLength={1000}
              placeholder="Was möchten Sie prüfen lassen?"
              aria-invalid={errorsFor(state, "projectContext").length > 0}
              aria-describedby={describedBy(
                state,
                "projectContext",
                "projectContext-hint"
              )}
            />
            <p
              className="mb-0 mt-2 text-sm leading-6 text-[var(--text-muted)]"
              id="projectContext-hint"
            >
              Bitte keine Zugangsdaten, Zahlungsdaten oder sensiblen Angaben.
            </p>
            <FieldError field="projectContext" state={state} />
          </div>
        </div>

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
                id="projectFiles"
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
                    ? "projectFiles-hint projectFiles-selection-error"
                    : "projectFiles-hint"
                )}
                onChange={(event) =>
                  selectFiles(Array.from(event.currentTarget.files ?? []))
                }
              />

              {attachments.length === 0 ? (
                <label
                  className="group flex min-h-40 cursor-pointer flex-col items-center justify-center p-5 text-center hover:border-[var(--accent)]"
                  htmlFor="projectFiles"
                >
                  <span className="flex size-12 items-center justify-center border border-[var(--border)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                    <Paperclip aria-hidden="true" size={24} weight="light" />
                  </span>
                  <span className="mt-4 text-base font-bold text-[var(--text-primary)]">
                    Dateien auswählen
                  </span>
                  <span
                    className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]"
                    id="projectFiles-hint"
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
                          htmlFor="projectFiles"
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
                    id="projectFiles-hint"
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
                id="projectFiles-selection-error"
                role="alert"
              >
                {fileSelectionError}
              </p>
            ) : null}
            <FieldError field="projectFiles" state={state} />
            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Bitte laden Sie nur projektbezogene Dateien hoch, die Sie uns
              zur Bearbeitung Ihrer Anfrage übermitteln dürfen.
            </p>
          </div>

        </div>
      </div>

      <div
        className="absolute left-[-10000px] top-auto size-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
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
            disabled={isPending}
          >
            {state.status === "uploading"
              ? "Dateien werden übertragen…"
              : isPending
                ? "Formular wird geprüft…"
                : "Projekt prüfen lassen"}
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
    </form>
  );
}
