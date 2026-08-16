"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent
} from "react";

import {
  ConfiguratorPicker,
  ConfiguratorPickerGroup
} from "@/features/configurator/configurator-picker";
import {
  MINI_CONFIGURATOR_CONSTRAINTS,
  isWithinMiniConfiguratorConstraint
} from "@/features/mini-configurator/constraints";
import { measureMiniConfiguratorText } from "@/features/mini-configurator/font-metrics";
import { evaluateMiniConfiguratorGeometry } from "@/features/mini-configurator/geometry";
import { MiniConfiguratorPreview } from "@/features/mini-configurator/mini-configurator-preview";
import { CONFIGURATOR_STORAGE_KEY } from "@/features/configurator/storage-key";
import {
  DEFAULT_MINI_CONFIGURATOR_CONFIG,
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_COMPOSITION_MODES,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS,
  SUPPORTED_MINI_CONFIGURATOR_TEXT
} from "@/features/mini-configurator/options";
import {
  MINI_CONFIGURATOR_STORAGE_KEY,
  parseMiniConfiguratorStoredState,
  writeMiniConfiguratorStoredState
} from "@/features/mini-configurator/storage";
import type {
  MiniConfiguratorConfig,
  MiniConfiguratorGeometry,
  MiniConfiguratorTextMeasurement
} from "@/features/mini-configurator/types";

type NumericDraft = number | "";

type MiniConfiguratorDraft = Omit<
  MiniConfiguratorConfig,
  "valanceWidthMm" | "valanceHeightMm" | "letterHeightMm"
> &
  Readonly<{
    valanceWidthMm: NumericDraft;
    valanceHeightMm: NumericDraft;
    letterHeightMm: NumericDraft;
  }>;

type MeasurementState =
  | Readonly<{ status: "idle" | "loading"; measurement: null }>
  | Readonly<{ status: "error"; measurement: null }>
  | Readonly<{
      status: "ready";
      measurement: MiniConfiguratorTextMeasurement;
    }>;

type NumberFieldProps = Readonly<{
  id: string;
  label: string;
  value: NumericDraft;
  onChange: (value: NumericDraft) => void;
  describedBy?: string;
  invalid?: boolean;
  min?: number;
  max?: number;
}>;

function NumberField({
  id,
  label,
  value,
  onChange,
  describedBy,
  invalid = false,
  min = 1,
  max
}: NumberFieldProps) {
  return (
    <div className="configurator-number-field">
      <label htmlFor={id}>{label}</label>
      <div className="configurator-number-input">
        <input
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          id={id}
          inputMode="decimal"
          max={max}
          min={min}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === "" ? "" : Number(nextValue));
          }}
          step="1"
          type="number"
          value={value}
        />
        <span aria-hidden="true">mm</span>
      </div>
    </div>
  );
}

function toDraft(configuration: MiniConfiguratorConfig): MiniConfiguratorDraft {
  return { ...configuration };
}

function isPositiveNumber(value: NumericDraft): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function configurationFromDraft(
  draft: MiniConfiguratorDraft
): MiniConfiguratorConfig | null {
  if (
    !isPositiveNumber(draft.valanceWidthMm) ||
    !isPositiveNumber(draft.valanceHeightMm) ||
    !isPositiveNumber(draft.letterHeightMm)
  ) {
    return null;
  }

  return {
    ...draft,
    valanceWidthMm: draft.valanceWidthMm,
    valanceHeightMm: draft.valanceHeightMm,
    letterHeightMm: draft.letterHeightMm
  };
}

function previewConfigurationFromDraft(
  draft: MiniConfiguratorDraft
): MiniConfiguratorConfig {
  return {
    ...draft,
    valanceWidthMm: isPositiveNumber(draft.valanceWidthMm)
      ? draft.valanceWidthMm
      : DEFAULT_MINI_CONFIGURATOR_CONFIG.valanceWidthMm,
    valanceHeightMm: isPositiveNumber(draft.valanceHeightMm)
      ? draft.valanceHeightMm
      : DEFAULT_MINI_CONFIGURATOR_CONFIG.valanceHeightMm,
    letterHeightMm: isPositiveNumber(draft.letterHeightMm)
      ? draft.letterHeightMm
      : DEFAULT_MINI_CONFIGURATOR_CONFIG.letterHeightMm
  };
}

export function MiniConfigurator() {
  const [draft, setDraft] = useState<MiniConfiguratorDraft>(() =>
    toDraft(DEFAULT_MINI_CONFIGURATOR_CONFIG)
  );
  const [storageIsReady, setStorageIsReady] = useState(false);
  const [continuationMessage, setContinuationMessage] = useState("");
  const [measurementState, setMeasurementState] = useState<MeasurementState>({
    status: "idle",
    measurement: null
  });
  const userHasInteractedRef = useRef(false);
  const deferredText = useDeferredValue(draft.text);
  const configuration = useMemo(() => configurationFromDraft(draft), [draft]);
  const previewConfiguration = useMemo(
    () => previewConfigurationFromDraft(draft),
    [draft]
  );
  const selectedFont =
    MINI_CONFIGURATOR_FONTS.find((font) => font.id === draft.fontId) ??
    MINI_CONFIGURATOR_FONTS[0];
  const letterHeightMm = configuration?.letterHeightMm ?? null;
  const textIsSupported = SUPPORTED_MINI_CONFIGURATOR_TEXT.test(draft.text);
  const textIsEmpty = draft.text.trim().length === 0;
  const valanceHeightIsValid = isWithinMiniConfiguratorConstraint(
    draft.valanceHeightMm,
    MINI_CONFIGURATOR_CONSTRAINTS.valanceHeightMm
  );
  const letterHeightIsValid = isWithinMiniConfiguratorConstraint(
    draft.letterHeightMm,
    MINI_CONFIGURATOR_CONSTRAINTS.letterHeightMm
  );

  useEffect(() => {
    let storedConfiguration: MiniConfiguratorConfig | null = null;

    try {
      storedConfiguration = parseMiniConfiguratorStoredState(
        window.sessionStorage.getItem(MINI_CONFIGURATOR_STORAGE_KEY)
      );
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    queueMicrotask(() => {
      if (storedConfiguration) {
        setDraft(toDraft({ ...storedConfiguration, previewMode: "night" }));
      }
      setStorageIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!storageIsReady || !configuration || !userHasInteractedRef.current) {
      return;
    }

    try {
      writeMiniConfiguratorStoredState(window.sessionStorage, configuration);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }, [configuration, storageIsReady]);

  useEffect(() => {
    let cancelled = false;

    if (!letterHeightMm || !deferredText.trim() || !textIsSupported) {
      queueMicrotask(() => {
        if (!cancelled) {
          setMeasurementState({ status: "idle", measurement: null });
        }
      });

      return () => {
        cancelled = true;
      };
    }

    queueMicrotask(() => {
      if (!cancelled) {
        setMeasurementState({ status: "loading", measurement: null });
      }
    });

    measureMiniConfiguratorText(deferredText, selectedFont, letterHeightMm)
      .then((measurement) => {
        if (cancelled) {
          return;
        }

        setMeasurementState(
          measurement
            ? { status: "ready", measurement }
            : { status: "error", measurement: null }
        );
      })
      .catch(() => {
        if (!cancelled) {
          setMeasurementState({ status: "error", measurement: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deferredText, letterHeightMm, selectedFont, textIsSupported]);

  const matchingMeasurement =
    configuration &&
    measurementState.status === "ready" &&
    measurementState.measurement.text === configuration.text &&
    measurementState.measurement.fontId === configuration.fontId &&
    measurementState.measurement.visibleHeightMm ===
      configuration.letterHeightMm
      ? measurementState.measurement
      : null;
  const geometry = useMemo<MiniConfiguratorGeometry | null>(() => {
    if (!configuration || !matchingMeasurement) {
      return null;
    }

    return evaluateMiniConfiguratorGeometry(configuration, matchingMeasurement);
  }, [configuration, matchingMeasurement]);
  const valanceHeightOutOfRange =
    draft.valanceHeightMm !== "" && !valanceHeightIsValid;
  const letterHeightOutOfRange =
    draft.letterHeightMm !== "" && !letterHeightIsValid;
  const compositionTooWide =
    geometry?.issues.includes("COMPOSITION_TOO_WIDE") ?? false;
  const numericValuesAreValid = configuration !== null;
  const isMeasuring =
    Boolean(
      configuration &&
        !textIsEmpty &&
        textIsSupported &&
        valanceHeightIsValid &&
        letterHeightIsValid
    ) &&
    !matchingMeasurement &&
    measurementState.status !== "error";
  const canContinue =
    storageIsReady &&
    numericValuesAreValid &&
    !textIsEmpty &&
    textIsSupported &&
    valanceHeightIsValid &&
    letterHeightIsValid &&
    measurementState.status === "ready" &&
    geometry !== null &&
    geometry.issues.length === 0;

  let statusState = "incomplete";
  let statusText = "Weitere Angaben erforderlich";

  if (isMeasuring) {
    statusState = "loading";
    statusText = "Vorschau wird berechnet";
  } else if (measurementState.status === "error") {
    statusState = "error";
    statusText = "Schrift konnte nicht geladen werden";
  } else if (
    !numericValuesAreValid ||
    !textIsSupported ||
    !valanceHeightIsValid ||
    !letterHeightIsValid ||
    compositionTooWide
  ) {
    statusState = "error";
    statusText = "Eingaben korrigieren";
  } else if (canContinue) {
    statusState = "ready";
    statusText = "Bereit zum Speichern";
  }

  function updateDraft<Key extends keyof MiniConfiguratorDraft>(
    key: Key,
    value: MiniConfiguratorDraft[Key]
  ) {
    userHasInteractedRef.current = true;
    setContinuationMessage("");
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  }

  function clearConfiguratorDrafts() {
    for (const storageKey of [
      CONFIGURATOR_STORAGE_KEY,
      MINI_CONFIGURATOR_STORAGE_KEY
    ]) {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // The destination also falls back to defaults when storage is unavailable.
      }
    }
  }

  function saveForContinuation(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!canContinue || !configuration) {
      event.preventDefault();
      return;
    }

    try {
      window.sessionStorage.removeItem(CONFIGURATOR_STORAGE_KEY);
      writeMiniConfiguratorStoredState(window.sessionStorage, configuration);
    } catch {
      event.preventDefault();
      clearConfiguratorDrafts();
      setContinuationMessage(
        "Die Konfiguration konnte nicht übertragen werden. Öffnen Sie den vollständigen Konfigurator mit Standardwerten."
      );
    }
  }

  return (
    <form
      className="mini-configurator"
      onSubmit={(event) => event.preventDefault()}
    >
      <MiniConfiguratorPreview
        configuration={previewConfiguration}
        geometry={geometry}
        hasError={statusState === "error"}
        measurement={matchingMeasurement}
        statusText={statusText}
      />

      <ConfiguratorPickerGroup>
      <div className="configurator-controls">
        <fieldset
          aria-label="01 Gestaltung"
          className="configurator-control-group"
        >
          <legend>
            <span>01</span> Gestaltung
          </legend>

          <div className="configurator-composition-field">
            <span id="configurator-composition-label">Komposition</span>
            <ConfiguratorPicker
              ariaLabel={`Komposition: ${MINI_CONFIGURATOR_COMPOSITION_MODES.find((option) => option.id === draft.compositionMode)?.label ?? draft.compositionMode}`}
              describedBy={
                draft.compositionMode === "text-only"
                  ? undefined
                  : "configurator-composition-note"
              }
              id="configurator-composition"
              kind="composition"
              onChange={(value) =>
                updateDraft(
                  "compositionMode",
                  value as MiniConfiguratorConfig["compositionMode"]
                )
              }
              options={MINI_CONFIGURATOR_COMPOSITION_MODES}
              value={draft.compositionMode}
            />
          </div>

          <div className="configurator-text-field">
            <label htmlFor="configurator-text">Text auf dem Volant</label>
            <input
              aria-describedby={
                !textIsSupported || textIsEmpty
                  ? "configurator-text-error"
                  : undefined
              }
              aria-invalid={!textIsSupported || textIsEmpty || undefined}
              id="configurator-text"
              maxLength={60}
              onChange={(event) => updateDraft("text", event.target.value)}
              spellCheck="false"
              type="text"
              value={draft.text}
            />
            {!textIsSupported || textIsEmpty ? (
              <p className="configurator-field-error" id="configurator-text-error">
                {textIsEmpty
                  ? "Bitte einen Schriftzug eingeben."
                  : "Bitte nur lateinische oder kyrillische Buchstaben, Zahlen und übliche Satzzeichen verwenden."}
              </p>
            ) : null}
          </div>

          <div className="configurator-select-field">
            <span id="configurator-font-label">Schriftstil</span>
            <ConfiguratorPicker
              ariaLabel={`Schriftstil: ${selectedFont.label} · ${selectedFont.direction}`}
              id="configurator-font"
              kind="font"
              onChange={(value) =>
                updateDraft(
                  "fontId",
                  value as MiniConfiguratorConfig["fontId"]
                )
              }
              options={MINI_CONFIGURATOR_FONTS}
              value={draft.fontId}
            />
          </div>

          {draft.compositionMode !== "text-only" ? (
            <p
              className="configurator-composition-note"
              id="configurator-composition-note"
            >
              Das Logo wird hier schematisch dargestellt. Die finale Datei wird
              separat geprüft.
            </p>
          ) : null}
        </fieldset>

        <fieldset aria-label="02 Maße" className="configurator-control-group">
          <legend>
            <span>02</span> Maße
          </legend>
          <div className="configurator-number-grid">
            <NumberField
              id="configurator-width"
              invalid={!isPositiveNumber(draft.valanceWidthMm)}
              label="Volantbreite"
              min={MINI_CONFIGURATOR_CONSTRAINTS.valanceWidthMm.min}
              onChange={(value) => updateDraft("valanceWidthMm", value)}
              value={draft.valanceWidthMm}
            />
            <NumberField
              describedBy={
                valanceHeightOutOfRange
                  ? "configurator-valance-height-error"
                  : undefined
              }
              id="configurator-height"
              invalid={!valanceHeightIsValid}
              label="Volanthöhe"
              max={MINI_CONFIGURATOR_CONSTRAINTS.valanceHeightMm.max}
              min={MINI_CONFIGURATOR_CONSTRAINTS.valanceHeightMm.min}
              onChange={(value) => updateDraft("valanceHeightMm", value)}
              value={draft.valanceHeightMm}
            />
            <NumberField
              describedBy={
                letterHeightOutOfRange
                  ? "configurator-letter-height-error"
                  : undefined
              }
              id="configurator-letter-height"
              invalid={!letterHeightIsValid}
              label="Buchstabenhöhe"
              max={MINI_CONFIGURATOR_CONSTRAINTS.letterHeightMm.max}
              min={MINI_CONFIGURATOR_CONSTRAINTS.letterHeightMm.min}
              onChange={(value) => updateDraft("letterHeightMm", value)}
              value={draft.letterHeightMm}
            />
          </div>
          {valanceHeightOutOfRange ? (
            <p
              className="configurator-field-error"
              id="configurator-valance-height-error"
            >
              Die Volanthöhe muss zwischen 200 und 300 mm liegen.
            </p>
          ) : null}
          {letterHeightOutOfRange ? (
            <p
              className="configurator-field-error"
              id="configurator-letter-height-error"
            >
              Die Buchstabenhöhe muss zwischen 1 und 180 mm liegen.
            </p>
          ) : null}
          {compositionTooWide ? (
            <p className="configurator-field-error">
              Schrift und Zeichen passen bei dieser Buchstabenhöhe nicht in die
              angegebene Breite.
            </p>
          ) : null}

        </fieldset>

        <fieldset
          aria-label="03 Farbe & Licht"
          className="configurator-control-group"
        >
          <legend>
            <span>03</span> Farbe &amp; Licht
          </legend>

          <div className="configurator-option-block">
            <span className="configurator-option-label">Markisenfarbe</span>
            <ConfiguratorPicker
              ariaLabel={`Markisenfarbe: ${MINI_CONFIGURATOR_AWNING_COLORS.find((option) => option.id === draft.awningColorId)?.label ?? draft.awningColorId}`}
              id="configurator-awning-color"
              kind="color"
              listboxLabel="Markisenfarbe auswählen"
              onChange={(value) =>
                updateDraft(
                  "awningColorId",
                  value as MiniConfiguratorConfig["awningColorId"]
                )
              }
              options={MINI_CONFIGURATOR_AWNING_COLORS}
              value={draft.awningColorId}
            />
          </div>

          <div className="configurator-option-block">
            <span className="configurator-option-label">Lichtwirkung</span>
            <ConfiguratorPicker
              ariaLabel={`Lichtwirkung: ${MINI_CONFIGURATOR_LIGHT_COLORS.find((option) => option.id === draft.lightColorId)?.label ?? draft.lightColorId}`}
              id="configurator-light-color"
              kind="color"
              listboxLabel="Lichtwirkung auswählen"
              onChange={(value) =>
                updateDraft(
                  "lightColorId",
                  value as MiniConfiguratorConfig["lightColorId"]
                )
              }
              options={MINI_CONFIGURATOR_LIGHT_COLORS}
              value={draft.lightColorId}
            />
          </div>

        </fieldset>
      </div>
      </ConfiguratorPickerGroup>

      <div className="configurator-footer">
        <p aria-live="polite" className="visually-hidden">
          {statusText}
        </p>
        <div className="configurator-actions">
          <a
            aria-disabled={!canContinue}
            className="button button--primary"
            href="/konfigurator"
            onClick={saveForContinuation}
            tabIndex={canContinue ? undefined : -1}
          >
            Im Konfigurator weiter
          </a>
          <a className="configurator-actions__project-link" href="#projekt-pruefen">
            Projekt prüfen lassen
          </a>
        </div>
      </div>

      <p className="configurator-disclaimer">
        Diese Vorschau zeigt eine Gestaltungsrichtung. Konstruktion, Maße und
        technische Umsetzung werden objektbezogen geprüft.
      </p>
      <p aria-live="polite" className="configurator-continuation-message">
        {continuationMessage}
      </p>
      {continuationMessage ? (
        <a
          className="configurator-actions__project-link"
          href="/konfigurator"
          onClick={clearConfiguratorDrafts}
        >
          Konfigurator mit Standardwerten öffnen
        </a>
      ) : null}
    </form>
  );
}
