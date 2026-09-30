"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { X } from "@phosphor-icons/react";
import { emitLeadAnalyticsEvent, type FormId, type FormLocation } from "@/features/analytics/events";
import { LeadForm } from "./lead-form";
import type { ConfiguratorProjectSubmission, MiniProjectSubmission } from "./request-context";
import type { ConfiguratorCalculation } from "@/features/configurator/types";

type InquiryDialogProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  formId: FormId;
  formLocation: FormLocation;
  title: string;
  miniProject?: MiniProjectSubmission;
  configuratorProject?: ConfiguratorProjectSubmission;
  attachmentsEnabled?: boolean;
  children: ReactNode;
  onSubmissionPendingChange?: (pending: boolean) => void;
  onConfiguratorPricingConfirmed?: (change: { pricingVersion: string; calculation: ConfiguratorCalculation }) => void;
};

export function InquiryDialog({ open, onClose, onEdit, triggerRef, formId, formLocation, title, children, miniProject, configuratorProject, attachmentsEnabled, onSubmissionPendingChange, onConfiguratorPricingConfirmed }: InquiryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const [attached, setAttached] = useState(true);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      headingRef.current?.focus({ preventScroll: true });
      if (!wasOpen.current) emitLeadAnalyticsEvent({ name: "lead_form_open", form_id: formId, form_location: formLocation });
      wasOpen.current = true;
      const overflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => { document.documentElement.style.overflow = overflow; };
    }
    if (dialog.open) dialog.close();
    if (wasOpen.current) triggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = false;
  }, [open, formId, formLocation, triggerRef]);

  function close() {
    if (!pending) onClose();
  }

  return (
    <dialog ref={dialogRef} className="inquiry-dialog" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className="inquiry-dialog__surface">
        <header className="inquiry-dialog__header">
          <h2 id={titleId} ref={headingRef} tabIndex={-1}>{submitted ? "Ihre Projektanfrage" : attached ? title : "Ihre Projektanfrage"}</h2>
          <button type="button" className="inquiry-dialog__close" onClick={close} disabled={pending} aria-label="Anfrage schließen">
            <X size={24} aria-hidden="true" />
          </button>
        </header>
        <div className="inquiry-dialog__body">
          {!submitted ? (
            <section className="inquiry-dialog__context" aria-label="Beigefügte Angaben">
              {attached ? children : <p>Sie senden eine Projektanfrage ohne Entwurf oder Konfiguration.</p>}
              <div className="inquiry-dialog__actions">
                {attached ? <button type="button" disabled={pending} onClick={() => { close(); onEdit(); }}>Ändern</button> : null}
                <button type="button" disabled={pending} onClick={() => setAttached(!attached)}>
                  {attached ? "Ohne beigefügte Angaben anfragen" : "Angaben wieder beifügen"}
                </button>
              </div>
            </section>
          ) : null}
          <LeadForm labelledById={titleId} miniProject={attached ? miniProject : undefined}
            configuratorProject={attached ? configuratorProject : undefined}
            attachmentsEnabled={attachmentsEnabled} formId={formId} formLocation={formLocation}
            submitLabel="Anfrage senden" onSubmittedChange={setSubmitted}
            onSubmissionPendingChange={(value) => { setPending(value); onSubmissionPendingChange?.(value); }}
            onConfiguratorPricingConfirmed={onConfiguratorPricingConfirmed} />
          <button type="button" className="inquiry-dialog__back" disabled={pending} onClick={close}>Zurück zur Konfiguration</button>
        </div>
      </div>
    </dialog>
  );
}
