// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { ConsentManager } from "@/features/consent/consent-manager";
import {
  CONSENT_COOKIE_NAME,
  createConsentRecord,
  persistConsentRecord,
  readConsentRecord,
  requestConsentSettings
} from "@/features/consent/consent-storage";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

describe("ConsentManager", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
    document.documentElement.classList.remove("consent-modal-open");
  });

  afterEach(() => {
    cleanup();
  });

  it("offers equally direct accept and reject actions on first visit", async () => {
    render(<ConsentManager />);

    const banner = await screen.findByTestId("consent-banner");
    expect(banner).toHaveTextContent(
      "Notwendige Cookies und Funktionen bleiben immer aktiv"
    );
    expect(banner).toHaveTextContent("Auswahl anpassen");
    expect(banner).toHaveTextContent("Alle ablehnen");
    expect(banner).toHaveTextContent("Alle akzeptieren");

    fireEvent.click(screen.getByRole("button", { name: "Alle ablehnen" }));

    await waitFor(() => expect(banner).not.toBeInTheDocument());
    expect(readConsentRecord()?.analytics).toBe(false);
    expect(readConsentRecord()?.marketing).toBe(false);
  });

  it("restores a saved choice and lets the footer trigger change it", async () => {
    persistConsentRecord(
      createConsentRecord({ analytics: true, marketing: false })
    );
    render(<ConsentManager />);

    await waitFor(() =>
      expect(screen.queryByTestId("consent-banner")).not.toBeInTheDocument()
    );

    requestConsentSettings();

    const dialog = await screen.findByRole("dialog");
    const analytics = screen.getByRole("checkbox", { name: /Analytics/ });
    const marketing = screen.getByRole("checkbox", { name: /Marketing/ });
    expect(dialog).toBeVisible();
    expect(analytics).toBeChecked();
    expect(marketing).not.toBeChecked();

    fireEvent.click(analytics);
    fireEvent.click(marketing);
    fireEvent.click(screen.getByRole("button", { name: "Auswahl speichern" }));

    await waitFor(() => expect(dialog).not.toBeVisible());
    expect(readConsentRecord()?.analytics).toBe(false);
    expect(readConsentRecord()?.marketing).toBe(true);
  });
});
