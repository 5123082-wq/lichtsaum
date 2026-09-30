// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef, useState } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { InquiryDialog } from "@/features/lead-form/inquiry-dialog";
import { createConsentRecord, persistConsentRecord } from "@/features/consent/consent-storage";

const actions = vi.hoisted(() => ({ prepareProjectCheckSubmission: vi.fn(), confirmProjectFileUpload: vi.fn(), finalizeProjectCheckSubmission: vi.fn(), getProjectCheckSubmissionStatus: vi.fn() }));
vi.mock("@/features/lead-form/submission-action", () => actions);
vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));

function Harness() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("ENTWURF");
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={triggerRef} onClick={() => setOpen(true)}>Öffnen</button>
    <button onClick={() => setText("GEÄNDERT")}>Entwurf ändern</button>
    <InquiryDialog open={open} onClose={() => setOpen(false)} onEdit={() => setOpen(false)} triggerRef={triggerRef}
      formId="mini_configurator_inquiry" formLocation="mini_configurator" title="Entwurf anfragen"
      miniProject={{ schemaVersion: 1, configuration: { text, compositionMode: "text-only", fontId: "montserrat", awningColorId: "anthracite", lightColorId: "warm-white", previewMode: "night" } }}>
      <p>{text}</p>
    </InquiryDialog>
  </>;
}
function layer() { return (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []; }
function submit() { fireEvent.submit(document.querySelector("form")!); }

beforeEach(() => {
  vi.clearAllMocks();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  persistConsentRecord(createConsentRecord({ analytics: true, marketing: true }));
  (window as Window & { dataLayer?: unknown[] }).dataLayer = [];
});
afterEach(cleanup);

it("locks dismissal during submit and preserves success across reopen until explicit reset", async () => {
  let resolve!: (value: unknown) => void;
  actions.prepareProjectCheckSubmission.mockReturnValue(new Promise((done) => { resolve = done; }));
  render(<Harness />);
  fireEvent.click(screen.getByText("Öffnen"));
  fireEvent.change(screen.getByLabelText(/E-Mail-Adresse/), { target: { value: "draft@example.test" } });
  submit(); submit();
  await waitFor(() => expect(screen.getByRole("button", { name: "Anfrage schließen" })).toBeDisabled());
  expect(screen.getByRole("button", { name: "Ändern" })).toBeDisabled();
  fireEvent(document.querySelector("dialog")!, new Event("cancel", { bubbles: true, cancelable: true }));
  expect(document.querySelector("dialog")).toHaveAttribute("open");
  expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(1);
  resolve({ kind: "result", state: { status: "submitted", fieldErrors: {}, message: "Gespeichert", leadId: crypto.randomUUID(), publicLeadNumber: "LS-2026-000042" } });
  await screen.findByRole("heading", { name: "Anfrage übermittelt." });
  fireEvent.click(screen.getByRole("button", { name: "Anfrage schließen" }));
  fireEvent.click(screen.getByText("Öffnen"));
  expect(screen.getByText("Anfragenummer: LS-2026-000042")).toBeVisible();
  expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(1);
  expect(layer().filter((entry) => entry.event === "generate_lead" && entry.destination === "ads")).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Weitere Anfrage senden" }));
  expect(screen.getByLabelText(/E-Mail-Adresse/)).toHaveValue("");
  expect(JSON.stringify(layer())).not.toContain("draft@example.test");
});

it("reuses retry identity, rotates it for changed or removed context and emits diagnostics once per action", async () => {
  actions.prepareProjectCheckSubmission.mockResolvedValue({ kind: "result", state: { status: "prototype_unavailable", fieldErrors: {}, message: "Test error" } });
  render(<Harness />);
  fireEvent.click(screen.getByText("Öffnen"));
  fireEvent.change(screen.getByLabelText(/E-Mail-Adresse/), { target: { value: "draft@example.test" } });
  submit(); await screen.findByText("Test error");
  await waitFor(() => expect(screen.getByRole("button", { name: "Anfrage schließen" })).toBeEnabled());
  submit(); await waitFor(() => expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.getByRole("button", { name: "Anfrage schließen" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Anfrage schließen" }));
  fireEvent.click(screen.getByText("Entwurf ändern"));
  fireEvent.click(screen.getByText("Öffnen"));
  submit(); await waitFor(() => expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(3));
  await waitFor(() => expect(screen.getByRole("button", { name: "Anfrage schließen" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Ohne beigefügte Angaben anfragen" }));
  submit(); await waitFor(() => expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(4));
  await waitFor(() => expect(screen.getByRole("button", { name: "Anfrage schließen" })).toBeEnabled());
  const calls = actions.prepareProjectCheckSubmission.mock.calls.map(([input]) => input);
  expect(calls[0].idempotencyKey).toBe(calls[1].idempotencyKey);
  expect(calls[2].idempotencyKey).not.toBe(calls[0].idempotencyKey);
  expect(calls[2].miniProject.configuration.text).toBe("GEÄNDERT");
  expect(calls[3].miniProject).toBeUndefined();
  expect(calls[3].configuratorProject).toBeUndefined();
  expect(calls[3].idempotencyKey).not.toBe(calls[2].idempotencyKey);
  expect(layer().filter((entry) => entry.event === "lead_form_start")).toHaveLength(1);
  expect(layer().filter((entry) => entry.event === "lead_form_open")).toHaveLength(2);
  expect(layer().filter((entry) => entry.event === "lead_submit_attempt")).toHaveLength(4);
  expect(layer().filter((entry) => entry.event === "lead_submit_error")).toHaveLength(4);
  expect(layer().some((entry) => entry.event === "generate_lead")).toBe(false);
});
