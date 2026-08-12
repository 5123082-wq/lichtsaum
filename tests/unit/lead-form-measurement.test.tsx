// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LeadForm } from "@/features/lead-form/lead-form";
import {
  CONSENT_COOKIE_NAME,
  createConsentRecord,
  persistConsentRecord
} from "@/features/consent/consent-storage";

const actions = vi.hoisted(() => ({
  confirmProjectFileUpload: vi.fn(),
  finalizeProjectCheckSubmission: vi.fn(),
  getProjectCheckSubmissionStatus: vi.fn(),
  prepareProjectCheckSubmission: vi.fn()
}));

vi.mock("@vercel/blob/client", () => ({ upload: vi.fn() }));

vi.mock("@/features/lead-form/submission-action", () => actions);

type TestWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

let leadId = "";

function generateLeadEvents(destination?: "analytics" | "ads") {
  return ((window as TestWindow).dataLayer ?? []).filter(
    (entry) =>
      entry.event === "generate_lead" &&
      (destination === undefined || entry.destination === destination)
  );
}

async function submitMinimalForm() {
  const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
  fireEvent.change(email, { target: { value: "test@example.test" } });
  fireEvent.submit(email.closest("form")!);
  await screen.findByRole("heading", { name: "Anfrage übermittelt." });
}

function PendingConfiguratorHarness() {
  const [isPending, setIsPending] = useState(false);
  const [showsForm, setShowsForm] = useState(true);

  return (
    <>
      <button
        disabled={isPending}
        onClick={() => setShowsForm(false)}
        type="button"
      >
        Grunddaten ändern
      </button>
      {showsForm ? (
        <LeadForm onSubmissionPendingChange={setIsPending} />
      ) : (
        <p>Formular entfernt</p>
      )}
    </>
  );
}

describe("LeadForm measurement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as TestWindow).dataLayer;
    persistConsentRecord(
      createConsentRecord({ analytics: true, marketing: true })
    );
    leadId = crypto.randomUUID();
    actions.prepareProjectCheckSubmission.mockResolvedValue({
      kind: "upload",
      plan: { leadId, uploadToken: "test-upload-token", files: [] }
    });
    actions.finalizeProjectCheckSubmission.mockResolvedValue({
      status: "submitted",
      message: "Die Projektanfrage wurde gespeichert.",
      fieldErrors: {},
      leadId,
      publicLeadNumber: "LS-2026-000123"
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("queues one sanitized Analytics event and one Ads conversion after server success", async () => {
    render(<LeadForm />);

    expect(generateLeadEvents()).toEqual([]);
    await submitMinimalForm();

    const successTitle = screen.getByRole("heading", {
      name: "Anfrage übermittelt."
    });

    expect(successTitle).toBeVisible();
    expect(successTitle.closest("[role='status']")).toHaveFocus();
    expect(screen.getByText(/Vielen Dank für Ihre Anfrage/)).toBeInTheDocument();
    expect(screen.getByText("Anfragenummer: LS-2026-000123")).toBeVisible();

    await waitFor(() => expect(generateLeadEvents("ads")).toHaveLength(1));
    expect(generateLeadEvents("analytics")).toEqual([
      {
        event: "generate_lead",
        destination: "analytics",
        form_id: "main_inquiry",
        lead_type: "awning_inquiry"
      }
    ]);
    expect(generateLeadEvents("ads")[0]).toEqual({
      event: "generate_lead",
      destination: "ads",
      form_id: "main_inquiry",
      lead_id: leadId,
      lead_type: "awning_inquiry"
    });
    expect(window.sessionStorage).toHaveLength(0);

    fireEvent.click(
      screen.getByRole("button", { name: "Weitere Anfrage senden" })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /E-Mail-Adresse/ })
      ).toHaveValue("");
      expect(
        screen.getByRole("textbox", { name: /E-Mail-Adresse/ })
      ).toHaveFocus();
    });
    expect(
      screen.queryByRole("heading", { name: "Anfrage übermittelt." })
    ).not.toBeInTheDocument();
  });

  it("never copies configurator values, services or postal code into analytics", async () => {
    const configuratorProject = {
      configuration: {
        schemaVersion: 1,
        compositionMode: "text-only",
        text: "CAFÉ LICHT",
        fontId: "montserrat",
        valanceWidthMm: 3000,
        valanceHeightMm: 300,
        letterHeightMm: 120,
        awningColorId: "anthracite",
        lightColorId: "warm-white"
      },
      services: ["site-measurement"],
      postalCode: "10115",
      confirmedPricingVersion: "2026-08-12.v2"
    } as const;

    render(<LeadForm configuratorProject={configuratorProject} />);
    await submitMinimalForm();

    await waitFor(() => expect(generateLeadEvents("ads")).toHaveLength(1));
    expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ configuratorProject })
    );

    const analyticsPayload = JSON.stringify(
      (window as TestWindow).dataLayer ?? []
    );

    expect(analyticsPayload).not.toContain("CAFÉ LICHT");
    expect(analyticsPayload).not.toContain("site-measurement");
    expect(analyticsPayload).not.toContain("10115");
    expect(analyticsPayload).not.toContain("2026-08-12.v2");
  });

  it("does not queue a conversion while an updated price awaits reconfirmation", async () => {
    actions.prepareProjectCheckSubmission.mockResolvedValueOnce({
      kind: "pricing_changed",
      pricingVersion: "2026-08-12.v2",
      calculation: { netTotalCents: 71_000 }
    });

    render(<LeadForm />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    fireEvent.change(email, { target: { value: "test@example.test" } });
    fireEvent.submit(email.closest("form")!);

    await screen.findByRole("button", {
      name: "Aktualisierten Preis bestätigen"
    });
    expect(actions.finalizeProjectCheckSubmission).not.toHaveBeenCalled();
    expect(generateLeadEvents()).toEqual([]);
  });

  it("keeps configurator edit controls locked until an async submit settles", async () => {
    let resolvePreparation!: (value: {
      kind: "result";
      state: {
        status: "prototype_validated";
        message: string;
        fieldErrors: Record<string, never>;
      };
    }) => void;
    actions.prepareProjectCheckSubmission.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePreparation = resolve;
      })
    );

    render(<PendingConfiguratorHarness />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    const editButton = screen.getByRole("button", {
      name: "Grunddaten ändern"
    });

    fireEvent.change(email, { target: { value: "test@example.test" } });
    fireEvent.submit(email.closest("form")!);

    await waitFor(() => expect(editButton).toBeDisabled());
    fireEvent.click(editButton);
    expect(screen.queryByText("Formular entfernt")).not.toBeInTheDocument();
    expect(email).toBeInTheDocument();

    resolvePreparation({
      kind: "result",
      state: {
        status: "prototype_validated",
        message: "Die Angaben wurden lokal geprüft.",
        fieldErrors: {}
      }
    });

    await waitFor(() => expect(editButton).toBeEnabled());
  });

  it("guards synchronous double submit before React pending state commits", async () => {
    let resolvePreparation!: (value: {
      kind: "result";
      state: {
        status: "prototype_validated";
        message: string;
        fieldErrors: Record<string, never>;
      };
    }) => void;
    actions.prepareProjectCheckSubmission.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePreparation = resolve;
      })
    );

    render(<LeadForm />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    const form = email.closest("form")!;
    fireEvent.change(email, { target: { value: "test@example.test" } });
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(1);

    resolvePreparation({
      kind: "result",
      state: {
        status: "prototype_validated",
        message: "Die Angaben wurden lokal geprüft.",
        fieldErrors: {}
      }
    });
    await screen.findByText("Die Angaben wurden lokal geprüft.");
  });

  it("reuses one attempt for an unchanged retry and rotates it after an edit", async () => {
    const unavailable = {
      kind: "result",
      state: {
        status: "prototype_unavailable",
        message: "Die Anfrage konnte nicht gespeichert werden.",
        fieldErrors: {}
      }
    } as const;
    actions.prepareProjectCheckSubmission.mockResolvedValue(unavailable);

    render(<LeadForm />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    const phone = screen.getByRole("textbox", { name: /Telefonnummer/ });
    const form = email.closest("form")!;
    fireEvent.change(email, { target: { value: "test@example.test" } });

    fireEvent.submit(form);
    await waitFor(() =>
      expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(1)
    );
    const first = actions.prepareProjectCheckSubmission.mock.calls[0]?.[0];

    fireEvent.submit(form);
    await waitFor(() =>
      expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(2)
    );
    const retry = actions.prepareProjectCheckSubmission.mock.calls[1]?.[0];

    expect(retry?.idempotencyKey).toBe(first?.idempotencyKey);
    expect(retry?.uploadToken).toBe(first?.uploadToken);
    expect(first?.idempotencyKey).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(first?.uploadToken).toMatch(/^[A-Za-z0-9_-]{43}$/);

    fireEvent.change(phone, { target: { value: "+49 30 123456" } });
    fireEvent.submit(form);
    await waitFor(() =>
      expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledTimes(3)
    );
    const changed = actions.prepareProjectCheckSubmission.mock.calls[2]?.[0];

    expect(changed?.idempotencyKey).not.toBe(first?.idempotencyKey);
    expect(changed?.uploadToken).not.toBe(first?.uploadToken);
  });

  it("queues the same single Ads conversion when accepted status is recovered", async () => {
    actions.finalizeProjectCheckSubmission.mockRejectedValueOnce(
      new Error("lost Server Action response")
    );
    actions.getProjectCheckSubmissionStatus.mockResolvedValueOnce({
      status: "submitted",
      publicLeadNumber: "LS-2026-000123"
    });

    render(<LeadForm />);
    await submitMinimalForm();

    await waitFor(() => expect(generateLeadEvents("ads")).toHaveLength(1));
    expect(actions.getProjectCheckSubmissionStatus).toHaveBeenCalledWith(leadId);
    expect(generateLeadEvents("ads")[0]?.lead_id).toBe(leadId);
    expect(generateLeadEvents("analytics")).toHaveLength(1);
  });

  it("queues one conversion when prepare recovers an already accepted attempt", async () => {
    actions.prepareProjectCheckSubmission.mockResolvedValueOnce({
      kind: "result",
      state: {
        status: "submitted",
        message: "Die Projektanfrage wurde gespeichert.",
        fieldErrors: {},
        leadId,
        publicLeadNumber: "LS-2026-000123"
      }
    });

    render(<LeadForm />);
    await submitMinimalForm();

    await waitFor(() => expect(generateLeadEvents("ads")).toHaveLength(1));
    expect(actions.finalizeProjectCheckSubmission).not.toHaveBeenCalled();
    expect(generateLeadEvents("ads")[0]?.lead_id).toBe(leadId);
    expect(generateLeadEvents("analytics")).toHaveLength(1);
  });

  it("queues no conversion when finalization and status recovery both fail", async () => {
    actions.finalizeProjectCheckSubmission.mockRejectedValueOnce(
      new Error("integration unavailable")
    );
    actions.getProjectCheckSubmissionStatus.mockResolvedValueOnce({
      status: "pending"
    });

    render(<LeadForm />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    fireEvent.change(email, { target: { value: "test@example.test" } });
    fireEvent.submit(email.closest("form")!);

    await screen.findByText(
      /konnte nicht sicher gespeichert werden/i
    );
    expect(actions.getProjectCheckSubmissionStatus).toHaveBeenCalledWith(
      leadId
    );
    expect(generateLeadEvents()).toEqual([]);
  });

  it("does not queue a conversion for a rejected form", async () => {
    actions.prepareProjectCheckSubmission.mockResolvedValueOnce({
      kind: "result",
      state: {
        status: "invalid",
        message: "Bitte prüfen Sie die markierten Felder.",
        fieldErrors: { email: ["Bitte geben Sie eine E-Mail-Adresse ein."] }
      }
    });

    render(<LeadForm />);
    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    fireEvent.submit(email.closest("form")!);

    await screen.findByRole("heading", {
      name: "Bitte prüfen Sie Ihre Angaben"
    });
    expect(generateLeadEvents()).toEqual([]);
  });

  it("keeps the contact form usable while production attachments are disabled", async () => {
    render(<LeadForm attachmentsEnabled={false} />);

    expect(document.querySelector('input[name="projectFiles"]')).toBeNull();
    await submitMinimalForm();

    expect(actions.prepareProjectCheckSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ files: [] })
    );
    expect(screen.getByRole("heading", { name: "Anfrage übermittelt." })).toBeVisible();
  });

  it("keeps a successful form submission functional after marketing rejection", async () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
    persistConsentRecord(
      createConsentRecord({ analytics: false, marketing: false })
    );

    render(<LeadForm />);
    await submitMinimalForm();

    expect(screen.getByRole("heading", { name: "Anfrage übermittelt." })).toBeVisible();
    expect(generateLeadEvents()).toEqual([]);
  });
});
