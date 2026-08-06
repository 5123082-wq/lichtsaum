"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent
} from "react";
import { CaretDown, Check, Diamond } from "@phosphor-icons/react";

import {
  MINI_CONFIGURATOR_CONSTRAINTS,
  isWithinMiniConfiguratorConstraint
} from "@/features/mini-configurator/constraints";
import { measureMiniConfiguratorText } from "@/features/mini-configurator/font-metrics";
import { evaluateMiniConfiguratorGeometry } from "@/features/mini-configurator/geometry";
import { MiniConfiguratorPreview } from "@/features/mini-configurator/mini-configurator-preview";
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
  MiniConfiguratorCompositionMode,
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

type CompositionDiagramProps = Readonly<{
  mode: MiniConfiguratorCompositionMode;
}>;

function CompositionDiagram({ mode }: CompositionDiagramProps) {
  const hasLeftLogo = mode !== "text-only";
  const hasRightLogo = mode === "logo-both";

  return (
    <span
      aria-hidden="true"
      className="configurator-composition-diagram"
      data-mode={mode}
    >
      <span>
        {hasLeftLogo ? <Diamond size={15} weight="bold" /> : null}
      </span>
      <span>NAME</span>
      <span>
        {hasRightLogo ? <Diamond size={15} weight="bold" /> : null}
      </span>
    </span>
  );
}

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
  const [compositionMenuIsOpen, setCompositionMenuIsOpen] = useState(false);
  const [fontMenuIsOpen, setFontMenuIsOpen] = useState(false);
  const [awningColorMenuIsOpen, setAwningColorMenuIsOpen] = useState(false);
  const [lightColorMenuIsOpen, setLightColorMenuIsOpen] = useState(false);
  const [measurementState, setMeasurementState] = useState<MeasurementState>({
    status: "idle",
    measurement: null
  });
  const compositionPickerRef = useRef<HTMLDivElement>(null);
  const compositionTriggerRef = useRef<HTMLButtonElement>(null);
  const fontPickerRef = useRef<HTMLDivElement>(null);
  const fontTriggerRef = useRef<HTMLButtonElement>(null);
  const awningColorPickerRef = useRef<HTMLDivElement>(null);
  const awningColorTriggerRef = useRef<HTMLButtonElement>(null);
  const lightColorPickerRef = useRef<HTMLDivElement>(null);
  const lightColorTriggerRef = useRef<HTMLButtonElement>(null);
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
  const selectedComposition =
    MINI_CONFIGURATOR_COMPOSITION_MODES.find(
      (option) => option.id === draft.compositionMode
    ) ?? MINI_CONFIGURATOR_COMPOSITION_MODES[0];
  const selectedAwningColor =
    MINI_CONFIGURATOR_AWNING_COLORS.find(
      (option) => option.id === draft.awningColorId
    ) ?? MINI_CONFIGURATOR_AWNING_COLORS[0];
  const selectedLightColor =
    MINI_CONFIGURATOR_LIGHT_COLORS.find(
      (option) => option.id === draft.lightColorId
    ) ?? MINI_CONFIGURATOR_LIGHT_COLORS[0];
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

  useEffect(() => {
    if (!compositionMenuIsOpen) {
      return;
    }

    const selectedOption = compositionPickerRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );

    selectedOption?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !compositionPickerRef.current?.contains(event.target)
      ) {
        setCompositionMenuIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCompositionMenuIsOpen(false);
        compositionTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [compositionMenuIsOpen]);

  useEffect(() => {
    if (!fontMenuIsOpen) {
      return;
    }

    const selectedOption = fontPickerRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );

    selectedOption?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !fontPickerRef.current?.contains(event.target)
      ) {
        setFontMenuIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFontMenuIsOpen(false);
        fontTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [fontMenuIsOpen]);

  useEffect(() => {
    if (!awningColorMenuIsOpen) {
      return;
    }

    const selectedOption = awningColorPickerRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );

    selectedOption?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !awningColorPickerRef.current?.contains(event.target)
      ) {
        setAwningColorMenuIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAwningColorMenuIsOpen(false);
        awningColorTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [awningColorMenuIsOpen]);

  useEffect(() => {
    if (!lightColorMenuIsOpen) {
      return;
    }

    const selectedOption = lightColorPickerRef.current?.querySelector<HTMLElement>(
      '[role="option"][aria-selected="true"]'
    );

    selectedOption?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !lightColorPickerRef.current?.contains(event.target)
      ) {
        setLightColorMenuIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightColorMenuIsOpen(false);
        lightColorTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightColorMenuIsOpen]);

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
    statusText = "Bereit für die ausführliche Konfiguration";
  }

  function updateDraft<Key extends keyof MiniConfiguratorDraft>(
    key: Key,
    value: MiniConfiguratorDraft[Key]
  ) {
    userHasInteractedRef.current = true;
    setContinuationMessage("");
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  }

  function saveForContinuation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue || !configuration) {
      return;
    }

    try {
      writeMiniConfiguratorStoredState(window.sessionStorage, configuration);
      setContinuationMessage(
        "Konfiguration gespeichert. Der ausführliche Konfigurator folgt nach Freigabe dieses Moduls."
      );
    } catch {
      setContinuationMessage(
        "Die Konfiguration konnte in diesem Browser nicht gespeichert werden."
      );
    }
  }

  function moveListboxOptionFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')
    );
    const currentIndex = options.indexOf(document.activeElement as HTMLElement);
    let nextIndex = currentIndex;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    } else if (event.key === "ArrowDown") {
      nextIndex = Math.min(options.length - 1, Math.max(0, currentIndex + 1));
    } else if (event.key === "ArrowUp") {
      nextIndex = Math.max(0, currentIndex <= 0 ? 0 : currentIndex - 1);
    }

    event.preventDefault();
    options[nextIndex]?.focus();
  }

  return (
    <form className="mini-configurator" onSubmit={saveForContinuation}>
      <MiniConfiguratorPreview
        configuration={previewConfiguration}
        geometry={geometry}
        hasError={statusState === "error"}
        measurement={matchingMeasurement}
        statusText={statusText}
      />

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
            <div
              className="configurator-composition-picker"
              data-open={compositionMenuIsOpen || undefined}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setCompositionMenuIsOpen(false);
                }
              }}
              ref={compositionPickerRef}
            >
              <button
                aria-controls="configurator-composition-listbox"
                aria-describedby={
                  draft.compositionMode === "text-only"
                    ? undefined
                    : "configurator-composition-note"
                }
                aria-expanded={compositionMenuIsOpen}
                aria-haspopup="listbox"
                aria-label={`Komposition: ${selectedComposition.label}`}
                className="configurator-composition-trigger"
                onClick={() => {
                  setFontMenuIsOpen(false);
                  setAwningColorMenuIsOpen(false);
                  setLightColorMenuIsOpen(false);
                  setCompositionMenuIsOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setFontMenuIsOpen(false);
                    setAwningColorMenuIsOpen(false);
                    setLightColorMenuIsOpen(false);
                    setCompositionMenuIsOpen(true);
                  }
                }}
                ref={compositionTriggerRef}
                type="button"
              >
                <CompositionDiagram mode={selectedComposition.id} />
                <span className="configurator-composition-copy">
                  <strong>{selectedComposition.label}</strong>
                </span>
                <CaretDown aria-hidden="true" size={18} weight="bold" />
              </button>
              <div
                aria-label="Komposition auswählen"
                className="configurator-composition-listbox"
                hidden={!compositionMenuIsOpen}
                id="configurator-composition-listbox"
                onKeyDown={moveListboxOptionFocus}
                role="listbox"
              >
                {MINI_CONFIGURATOR_COMPOSITION_MODES.map((option) => (
                  <button
                    aria-selected={draft.compositionMode === option.id}
                    key={option.id}
                    onClick={() => {
                      updateDraft("compositionMode", option.id);
                      setCompositionMenuIsOpen(false);
                      compositionTriggerRef.current?.focus();
                    }}
                    role="option"
                    tabIndex={draft.compositionMode === option.id ? 0 : -1}
                    type="button"
                  >
                    <CompositionDiagram mode={option.id} />
                    <span className="configurator-composition-copy">
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                    </span>
                    <Check
                      aria-hidden="true"
                      className="configurator-composition-check"
                      size={18}
                      weight="bold"
                    />
                  </button>
                ))}
              </div>
            </div>
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
            <div
              className="configurator-font-picker"
              data-open={fontMenuIsOpen || undefined}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setFontMenuIsOpen(false);
                }
              }}
              ref={fontPickerRef}
            >
              <button
                aria-controls="configurator-font-listbox"
                aria-expanded={fontMenuIsOpen}
                aria-haspopup="listbox"
                aria-label={`Schriftstil: ${selectedFont.label} · ${selectedFont.direction}`}
                className="configurator-font-trigger"
                onClick={() => {
                  setCompositionMenuIsOpen(false);
                  setAwningColorMenuIsOpen(false);
                  setLightColorMenuIsOpen(false);
                  setFontMenuIsOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setCompositionMenuIsOpen(false);
                    setAwningColorMenuIsOpen(false);
                    setLightColorMenuIsOpen(false);
                    setFontMenuIsOpen(true);
                  }
                }}
                ref={fontTriggerRef}
                type="button"
              >
                <span>
                  {selectedFont.label} · {selectedFont.direction}
                </span>
                <CaretDown aria-hidden="true" size={18} weight="bold" />
              </button>
              <div
                aria-label="Schriftstil auswählen"
                className="configurator-font-listbox"
                hidden={!fontMenuIsOpen}
                id="configurator-font-listbox"
                onKeyDown={moveListboxOptionFocus}
                role="listbox"
              >
                {MINI_CONFIGURATOR_FONTS.map((font) => (
                  <button
                    aria-selected={draft.fontId === font.id}
                    key={font.id}
                    onClick={() => {
                      updateDraft("fontId", font.id);
                      setFontMenuIsOpen(false);
                      fontTriggerRef.current?.focus();
                    }}
                    role="option"
                    tabIndex={draft.fontId === font.id ? 0 : -1}
                    type="button"
                  >
                    <strong>{font.label}</strong>
                    <span>{font.direction}</span>
                  </button>
                ))}
              </div>
            </div>
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
            <span
              className="configurator-option-label"
              id="configurator-awning-color-label"
            >
              Markisenfarbe
            </span>
            <div
              className="configurator-awning-color-picker"
              data-open={awningColorMenuIsOpen || undefined}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setAwningColorMenuIsOpen(false);
                }
              }}
              ref={awningColorPickerRef}
            >
              <button
                aria-controls="configurator-awning-color-listbox"
                aria-expanded={awningColorMenuIsOpen}
                aria-haspopup="listbox"
                aria-label={`Markisenfarbe: ${selectedAwningColor.label}`}
                className="configurator-awning-color-trigger"
                onClick={() => {
                  setCompositionMenuIsOpen(false);
                  setFontMenuIsOpen(false);
                  setLightColorMenuIsOpen(false);
                  setAwningColorMenuIsOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setCompositionMenuIsOpen(false);
                    setFontMenuIsOpen(false);
                    setLightColorMenuIsOpen(false);
                    setAwningColorMenuIsOpen(true);
                  }
                }}
                ref={awningColorTriggerRef}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="configurator-color-swatch"
                  style={{ backgroundColor: selectedAwningColor.value }}
                />
                <span>{selectedAwningColor.label}</span>
                <CaretDown aria-hidden="true" size={18} weight="bold" />
              </button>
              <div
                aria-label="Markisenfarbe auswählen"
                className="configurator-awning-color-listbox"
                hidden={!awningColorMenuIsOpen}
                id="configurator-awning-color-listbox"
                onKeyDown={moveListboxOptionFocus}
                role="listbox"
              >
                {MINI_CONFIGURATOR_AWNING_COLORS.map((option) => (
                  <button
                    aria-selected={draft.awningColorId === option.id}
                    key={option.id}
                    onClick={() => {
                      updateDraft("awningColorId", option.id);
                      setAwningColorMenuIsOpen(false);
                      awningColorTriggerRef.current?.focus();
                    }}
                    role="option"
                    tabIndex={draft.awningColorId === option.id ? 0 : -1}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="configurator-color-swatch"
                      style={{ backgroundColor: option.value }}
                    />
                    <span>{option.label}</span>
                    <Check
                      aria-hidden="true"
                      className="configurator-awning-color-check"
                      size={18}
                      weight="bold"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="configurator-option-block">
            <span
              className="configurator-option-label"
              id="configurator-light-color-label"
            >
              Lichtwirkung
            </span>
            <div
              className="configurator-light-color-picker"
              data-open={lightColorMenuIsOpen || undefined}
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setLightColorMenuIsOpen(false);
                }
              }}
              ref={lightColorPickerRef}
            >
              <button
                aria-controls="configurator-light-color-listbox"
                aria-expanded={lightColorMenuIsOpen}
                aria-haspopup="listbox"
                aria-label={`Lichtwirkung: ${selectedLightColor.label}`}
                className="configurator-light-color-trigger"
                onClick={() => {
                  setCompositionMenuIsOpen(false);
                  setFontMenuIsOpen(false);
                  setAwningColorMenuIsOpen(false);
                  setLightColorMenuIsOpen((current) => !current);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setCompositionMenuIsOpen(false);
                    setFontMenuIsOpen(false);
                    setAwningColorMenuIsOpen(false);
                    setLightColorMenuIsOpen(true);
                  }
                }}
                ref={lightColorTriggerRef}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="configurator-color-swatch"
                  style={{ backgroundColor: selectedLightColor.value }}
                />
                <span>{selectedLightColor.label}</span>
                <CaretDown aria-hidden="true" size={18} weight="bold" />
              </button>
              <div
                aria-label="Lichtwirkung auswählen"
                className="configurator-light-color-listbox"
                hidden={!lightColorMenuIsOpen}
                id="configurator-light-color-listbox"
                onKeyDown={moveListboxOptionFocus}
                role="listbox"
              >
                {MINI_CONFIGURATOR_LIGHT_COLORS.map((option) => (
                  <button
                    aria-selected={draft.lightColorId === option.id}
                    key={option.id}
                    onClick={() => {
                      updateDraft("lightColorId", option.id);
                      setLightColorMenuIsOpen(false);
                      lightColorTriggerRef.current?.focus();
                    }}
                    role="option"
                    tabIndex={draft.lightColorId === option.id ? 0 : -1}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="configurator-color-swatch"
                      style={{ backgroundColor: option.value }}
                    />
                    <span>{option.label}</span>
                    <Check
                      aria-hidden="true"
                      className="configurator-light-color-check"
                      size={18}
                      weight="bold"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </fieldset>
      </div>

      <div className="configurator-footer">
        <p aria-live="polite" className="visually-hidden">
          {statusText}
        </p>
        <div className="configurator-actions">
          <button
            className="button button--primary"
            disabled={!canContinue}
            type="submit"
          >
            Ausführlich konfigurieren
          </button>
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
    </form>
  );
}
