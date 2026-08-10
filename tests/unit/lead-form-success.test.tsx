import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LeadForm } from "@/features/lead-form/lead-form";

vi.mock("@vercel/blob/client", () => ({
  upload: vi.fn()
}));

vi.mock("@/features/lead-form/submission-action", () => ({
  confirmProjectFileUpload: vi.fn(),
  getProjectCheckSubmissionStatus: vi.fn(),
  prepareProjectCheckSubmission: vi.fn(async () => ({
    kind: "upload",
    plan: {
      leadId: "00000000-0000-4000-8000-000000000001",
      uploadToken: "test-upload-token",
      files: []
    }
  })),
  finalizeProjectCheckSubmission: vi.fn(async () => ({
    status: "submitted",
    message: "Die Projektanfrage wurde gespeichert.",
    fieldErrors: {},
    leadId: "00000000-0000-4000-8000-000000000001",
    publicLeadNumber: "LS-2026-000042"
  }))
}));

describe("LeadForm success state", () => {
  it("replaces the fields with confirmation and restores a blank form", async () => {
    render(<LeadForm />);

    const email = screen.getByRole("textbox", { name: /E-Mail-Adresse/ });
    fireEvent.change(email, { target: { value: "test@example.com" } });
    fireEvent.submit(email.closest("form")!);

    const successTitle = await screen.findByRole("heading", {
      name: "Anfrage übermittelt."
    });

    expect(successTitle).toBeVisible();
    expect(successTitle.closest("[role='status']")).toHaveFocus();
    expect(
      screen.getByText(/Vielen Dank für Ihre Anfrage/)
    ).toBeInTheDocument();
    expect(screen.getByText("Anfragenummer: LS-2026-000042")).toBeVisible();

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
});
