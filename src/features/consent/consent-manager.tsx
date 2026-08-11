"use client";

/* eslint-disable react-hooks/set-state-in-effect -- consent is browser-cookie state read only after hydration. */

import { X } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  CONSENT_SETTINGS_OPEN_EVENT,
  createConsentRecord,
  persistConsentRecord,
  readConsentRecord,
  type ConsentRecord
} from "./consent-storage";

export function ConsentManager() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [choice, setChoice] = useState<ConsentRecord | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);
  const [marketingDraft, setMarketingDraft] = useState(false);

  const openSettings = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setAnalyticsDraft(choice?.analytics ?? false);
    setMarketingDraft(choice?.marketing ?? false);
    setIsSettingsOpen(true);
  }, [choice]);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  useEffect(() => {
    const stored = readConsentRecord();
    setChoice(stored);
    setAnalyticsDraft(stored?.analytics ?? false);
    setMarketingDraft(stored?.marketing ?? false);
    setIsReady(true);
  }, []);

  useEffect(() => {
    window.addEventListener(CONSENT_SETTINGS_OPEN_EVENT, openSettings);
    return () =>
      window.removeEventListener(CONSENT_SETTINGS_OPEN_EVENT, openSettings);
  }, [openSettings]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isSettingsOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("consent-modal-open");
    } else if (!isSettingsOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.classList.remove("consent-modal-open");
    };
  }, [isSettingsOpen]);

  const saveChoice = (analytics: boolean, marketing: boolean) => {
    const nextChoice = createConsentRecord({ analytics, marketing });
    persistConsentRecord(nextChoice);
    setChoice(nextChoice);
    setAnalyticsDraft(analytics);
    setMarketingDraft(marketing);
    closeSettings();
  };

  const handleDialogClose = () => {
    setIsSettingsOpen(false);
    document.documentElement.classList.remove("consent-modal-open");
    returnFocusRef.current?.focus();
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      {!choice ? (
        <section
          className="consent-banner"
          aria-labelledby="consent-banner-title"
          data-testid="consent-banner"
        >
          <div className="consent-banner__copy">
            <p className="consent-manager__eyebrow">Datenschutz</p>
            <h2 id="consent-banner-title">Ihre Auswahl. Ohne Umwege.</h2>
            <p>
              Notwendige Cookies und Funktionen bleiben immer aktiv. Google
              Analytics und Marketing-Technologien sind optional und bleiben
              ohne Ihre Zustimmung ausgeschaltet. Mit „Alle ablehnen“ lehnen
              Sie beide optionalen Kategorien ab. Mehr dazu in unserer{" "}
              <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
          </div>

          <div className="consent-banner__actions">
            <button
              className="consent-manager__settings"
              type="button"
              onClick={openSettings}
            >
              Auswahl anpassen
            </button>
            <button
              className="consent-manager__decision"
              type="button"
              onClick={() => saveChoice(false, false)}
            >
              Alle ablehnen
            </button>
            <button
              className="consent-manager__decision"
              type="button"
              onClick={() => saveChoice(true, true)}
            >
              Alle akzeptieren
            </button>
          </div>
        </section>
      ) : null}

      <dialog
        className="consent-dialog"
        aria-labelledby="consent-dialog-title"
        onCancel={closeSettings}
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeSettings();
          }
        }}
        ref={dialogRef}
      >
        <div className="consent-dialog__surface">
          <header className="consent-dialog__header">
            <div>
              <p className="consent-manager__eyebrow">Datenschutz</p>
              <h2 id="consent-dialog-title">Cookie-Einstellungen</h2>
            </div>
            <button
              className="consent-dialog__close"
              type="button"
              aria-label="Cookie-Einstellungen schließen"
              onClick={closeSettings}
            >
              <X aria-hidden="true" size={24} weight="light" />
            </button>
          </header>

          <div className="consent-dialog__body">
            <p className="consent-dialog__intro">
              Sie entscheiden getrennt über pseudonyme Nutzungsanalyse und
              Marketing-Messung. Ihre Auswahl gilt 180 Tage und kann jederzeit
              geändert werden.
            </p>

            <div className="consent-category">
              <div>
                <h3>Notwendig</h3>
                <p>
                  Speichert Ihre Auswahl und ermöglicht ausdrücklich genutzte
                  Website-Funktionen. Diese Kategorie ist immer aktiv.
                </p>
              </div>
              <span className="consent-category__status">Immer aktiv</span>
            </div>

            <label className="consent-category consent-category--toggle">
              <span>
                <strong>Analytics</strong>
                <span>
                  Erlaubt Google Analytics, die Nutzung der Website zu messen.
                  Formularinhalte und Kontaktdaten werden nicht als
                  Analytics-Parameter übermittelt.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analyticsDraft}
                onChange={(event) => setAnalyticsDraft(event.target.checked)}
              />
            </label>

            <label className="consent-category consent-category--toggle">
              <span>
                <strong>Marketing</strong>
                <span>
                  Erlaubt Google Ads, eine bestätigte Projektanfrage als
                  Conversion zu messen. Ohne Zustimmung werden keine
                  Google-Marketing-Tags geladen. Personalisierte Werbung und
                  Remarketing bleiben ausgeschaltet.
                </span>
              </span>
              <input
                type="checkbox"
                checked={marketingDraft}
                onChange={(event) => setMarketingDraft(event.target.checked)}
              />
            </label>

            <p className="consent-dialog__note">
              Externe Medien werden erst als eigene Kategorie ergänzt, wenn sie
              tatsächlich verwendet werden.
            </p>
          </div>

          <footer className="consent-dialog__footer">
            <button
              className="consent-manager__decision"
              type="button"
              onClick={() => saveChoice(false, false)}
            >
              Alle ablehnen
            </button>
            <button
              className="consent-manager__save"
              type="button"
              onClick={() => saveChoice(analyticsDraft, marketingDraft)}
            >
              Auswahl speichern
            </button>
            <button
              className="consent-manager__decision"
              type="button"
              onClick={() => saveChoice(true, true)}
            >
              Alle akzeptieren
            </button>
          </footer>
        </div>
      </dialog>
    </>
  );
}
