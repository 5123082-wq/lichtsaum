import { displaysLeadAttachmentPicker } from "@/config/environment";
import { LeadForm } from "@/features/lead-form/lead-form";

export function ProjectCheckSection() {
  return (
    <section
      className="border-b border-[var(--border)] bg-[var(--surface-low)] py-[var(--section-space)]"
      id="projekt-pruefen"
      aria-labelledby="project-check-title"
    >
      <div className="container">
        <div className="grid items-end gap-7 pb-9 desktop:grid-cols-[minmax(0,1fr)_auto] desktop:gap-16 desktop:pb-12">
          <div>
            <p className="eyebrow eyebrow--marker-loop">
              <span>Projekt-Check</span>
            </p>
            <h2
              className="m-0 text-[clamp(3rem,7vw,6.5rem)] font-[780] uppercase leading-[0.9] tracking-[-0.055em]"
              id="project-check-title"
            >
              Ihr Projekt.
            </h2>
          </div>
          <p className="m-0 max-w-[22ch] text-[clamp(1.2rem,2vw,1.6rem)] font-semibold leading-snug text-[var(--text-muted)] desktop:pb-1">
            {displaysLeadAttachmentPicker
              ? "E-Mail genügt. Dateien optional."
              : "E-Mail genügt."}
          </p>
        </div>

        <LeadForm attachmentsEnabled={displaysLeadAttachmentPicker} />
      </div>
    </section>
  );
}
