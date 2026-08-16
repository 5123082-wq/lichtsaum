"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";

import { calculateConfigurator } from "@/features/configurator/actions";
import { loadConfiguratorFont } from "@/features/configurator/client-font";
import {
  ConfiguratorPicker,
  ConfiguratorPickerGroup
} from "@/features/configurator/configurator-picker";
import { ConfiguratorPreview } from "@/features/configurator/configurator-preview";
import {
  CONFIGURATOR_AWNING_COLORS,
  CONFIGURATOR_COMPOSITION_MODES,
  CONFIGURATOR_FONTS,
  CONFIGURATOR_LIGHT_COLORS,
  CONFIGURATOR_SERVICES,
  SUPPORTED_CONFIGURATOR_TEXT
} from "@/features/configurator/options";
import {
  readOrMigrateConfiguratorStoredState,
  writeConfiguratorStoredState
} from "@/features/configurator/storage";
import type {
  ConfiguratorAuthoritativeResult,
  ConfiguratorCalculation,
  ConfiguratorConfigurationV1,
  ConfiguratorServiceId
} from "@/features/configurator/types";
import { parseConfiguratorConfiguration } from "@/features/configurator/validation";
import { LeadForm } from "@/features/lead-form/lead-form";
import type { ConfiguratorProjectSubmission } from "@/features/lead-form/request-context";

type NumericDraft = number | "";

type ConfiguratorDraft = Omit<
  ConfiguratorConfigurationV1,
  "valanceWidthMm" | "valanceHeightMm" | "letterHeightMm"
> &
  Readonly<{
    valanceWidthMm: NumericDraft;
    valanceHeightMm: NumericDraft;
    letterHeightMm: NumericDraft;
  }>;

type ReadyCalculationState = Readonly<{
  status: "ready";
  configuration: ConfiguratorConfigurationV1;
  calculation: ConfiguratorCalculation;
}>;

type CalculationState =
  | ReadyCalculationState
  | Readonly<{
      status: "loading";
      previous: ReadyCalculationState | null;
    }>
  | Readonly<{ status: "invalid"; message: string }>
  | Readonly<{ status: "unavailable"; message: string }>;

type FontState = "loading" | "ready" | "error";
type StepNumber = 1 | 2 | 3;

type ConfiguratorWizardProps = Readonly<{
  attachmentsEnabled: boolean;
  initialConfiguration: ConfiguratorConfigurationV1;
  initialResult: ConfiguratorAuthoritativeResult;
}>;

const STEPS = [
  { number: 1, label: "Grundkonfiguration" },
  { number: 2, label: "Weitere Optionen" },
  { number: 3, label: "Preis & Projektanfrage" }
] as const satisfies ReadonlyArray<{
  number: StepNumber;
  label: string;
}>;

const POSTAL_CODE_PATTERN = /^\d{5}$/;
const PANEL_LENGTHS = [600, 1000, 1200] as const;
const euroCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR"
});
const millimeterFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1
});

const fontsById = new Map(
  CONFIGURATOR_FONTS.map((option) => [option.id, option])
);
const compositionsById = new Map(
  CONFIGURATOR_COMPOSITION_MODES.map((option) => [option.id, option])
);
const awningColorsById = new Map(
  CONFIGURATOR_AWNING_COLORS.map((option) => [option.id, option])
);
const lightColorsById = new Map(
  CONFIGURATOR_LIGHT_COLORS.map((option) => [option.id, option])
);
const servicesById = new Map(
  CONFIGURATOR_SERVICES.map((option) => [option.id, option])
);

function toDraft(
  configuration: ConfiguratorConfigurationV1
): ConfiguratorDraft {
  return configuration;
}

function toConfiguration(
  draft: ConfiguratorDraft
): ConfiguratorConfigurationV1 | null {
  return parseConfiguratorConfiguration(draft);
}

function configurationKey(configuration: ConfiguratorConfigurationV1) {
  return JSON.stringify(configuration);
}

function loadingCalculationState(
  state: CalculationState
): Extract<CalculationState, { status: "loading" }> {
  return {
    status: "loading",
    previous:
      state.status === "ready"
        ? state
        : state.status === "loading"
          ? state.previous
          : null
  };
}

function initialCalculationState(
  configuration: ConfiguratorConfigurationV1,
  result: ConfiguratorAuthoritativeResult
): CalculationState {
  if (result.status === "ok" || result.status === "pricing-changed") {
    return {
      status: "ready",
      configuration,
      calculation: result.calculation
    };
  }

  if (result.status === "invalid") {
    return {
      status: "invalid",
      message: "Die Grundkonfiguration ist noch nicht vollständig gültig."
    };
  }

  return {
    status: "unavailable",
    message:
      "Vorschau und Preis können im Moment nicht zuverlässig berechnet werden."
  };
}

function calculationErrorMessage(result: ConfiguratorAuthoritativeResult) {
  if (result.status === "ok" || result.status === "pricing-changed") {
    return "";
  }

  if (result.status === "unavailable") {
    return "Vorschau und Preis können im Moment nicht zuverlässig berechnet werden.";
  }

  if (
    result.issues.some((issue) => issue.code === "COMPOSITION_TOO_WIDE")
  ) {
    return "Die gewählte Komposition passt nicht in die verfügbare Volantbreite.";
  }

  if (result.issues.some((issue) => issue.code === "UNSUPPORTED_GLYPH")) {
    return "Die Beschriftung enthält ein Zeichen, das mit der gewählten Schrift nicht berechnet werden kann.";
  }

  return "Bitte prüfen Sie die markierten Angaben.";
}

function PriceScopeNotice() {
  return (
    <ul className="full-configurator__price-notes">
      <li>Vorschau und Nettopreis sind vorläufig.</li>
      <li>zzgl. gesetzlicher Umsatzsteuer</li>
      <li>
        Gewählte Dienstleistungen werden manuell kalkuliert und sind nicht
        enthalten.
      </li>
      <li>Das Ergebnis ist kein verbindliches Angebot.</li>
    </ul>
  );
}

function PriceSummary({
  calculation,
  configuration,
  postalCode,
  services
}: {
  calculation: ConfiguratorCalculation;
  configuration: ConfiguratorConfigurationV1;
  postalCode: string;
  services: readonly ConfiguratorServiceId[];
}) {
  const font = fontsById.get(configuration.fontId);
  const composition = compositionsById.get(configuration.compositionMode);
  const awningColor = awningColorsById.get(configuration.awningColorId);
  const lightColor = lightColorsById.get(configuration.lightColorId);
  const selectedServiceLabels = services.map(
    (serviceId) => servicesById.get(serviceId)?.label ?? serviceId
  );
  const panelDistribution = PANEL_LENGTHS.flatMap((lengthMm) => {
    const count = calculation.panelAllocation.counts[lengthMm];

    return count > 0 ? [`${count} × ${lengthMm} mm`] : [];
  }).join(" · ");

  return (
    <div
      aria-label="Konfigurationsübersicht"
      className="full-configurator__summary"
      id="configuratorProject"
      tabIndex={-1}
    >
      <div className="full-configurator__summary-heading">
        <p>Unveränderliche Zusammenfassung</p>
        <h3>Ihre Konfiguration.</h3>
      </div>

      <dl>
        <div>
          <dt>Maße</dt>
          <dd>
            {configuration.valanceWidthMm} × {configuration.valanceHeightMm} mm
          </dd>
        </div>
        <div>
          <dt>Buchstabenhöhe</dt>
          <dd>{configuration.letterHeightMm} mm</dd>
        </div>
        <div>
          <dt>Beschriftung</dt>
          <dd>{configuration.text}</dd>
        </div>
        <div>
          <dt>Schrift</dt>
          <dd>{font?.label ?? configuration.fontId}</dd>
        </div>
        <div>
          <dt>Komposition</dt>
          <dd>{composition?.label ?? configuration.compositionMode}</dd>
        </div>
        <div>
          <dt>Volantfarbe</dt>
          <dd>{awningColor?.label ?? configuration.awningColorId}</dd>
        </div>
        <div>
          <dt>Lichtfarbe</dt>
          <dd>{lightColor?.label ?? configuration.lightColorId}</dd>
        </div>
        <div>
          <dt>Lichtfelder</dt>
          <dd>{panelDistribution}</dd>
        </div>
        <div>
          <dt>Ermittelte Lichtlänge</dt>
          <dd>
            {millimeterFormatter.format(
              calculation.panelAllocation.requiredLengthMm
            )} mm
          </dd>
        </div>
        <div>
          <dt>Dienstleistungen</dt>
          <dd>
            {selectedServiceLabels.length > 0
              ? selectedServiceLabels.join(", ")
              : "Keine ausgewählt"}
          </dd>
        </div>
        {postalCode ? (
          <div>
            <dt>PLZ des Objekts</dt>
            <dd>{postalCode}</dd>
          </div>
        ) : null}
      </dl>

      <div className="full-configurator__summary-price">
        <p>Vorläufiger Nettopreis</p>
        <strong>
          {euroCurrencyFormatter.format(calculation.netTotalCents / 100)}
        </strong>
        <PriceScopeNotice />
      </div>
    </div>
  );
}

export function ConfiguratorWizard({
  attachmentsEnabled,
  initialConfiguration,
  initialResult
}: ConfiguratorWizardProps) {
  const [draft, setDraft] = useState<ConfiguratorDraft>(() =>
    toDraft(initialConfiguration)
  );
  const [services, setServices] = useState<readonly ConfiguratorServiceId[]>([]);
  const [postalCode, setPostalCode] = useState("");
  const [submissionIsPending, setSubmissionIsPending] = useState(false);
  const [activeStep, setActiveStep] = useState<StepNumber>(1);
  const [highestAvailableStep, setHighestAvailableStep] =
    useState<StepNumber>(1);
  const [storageIsReady, setStorageIsReady] = useState(false);
  const [fontState, setFontState] = useState<FontState>("loading");
  const [calculationState, setCalculationState] = useState<CalculationState>(
    () => initialCalculationState(initialConfiguration, initialResult)
  );
  const [confirmedPricingVersion, setConfirmedPricingVersion] = useState(
    initialResult.status === "ok" || initialResult.status === "pricing-changed"
      ? initialResult.calculation.pricingVersion
      : ""
  );
  const [, startCalculationTransition] = useTransition();
  const activeStepHeadingRef = useRef<HTMLHeadingElement>(null);
  const userHasInteractedRef = useRef(false);
  const calculationRequestIdRef = useRef(0);
  const calculatedConfigurationKeyRef = useRef(
    initialResult.status === "ok" || initialResult.status === "pricing-changed"
      ? configurationKey(initialConfiguration)
      : null
  );
  const configuration = useMemo(() => toConfiguration(draft), [draft]);
  const currentConfigurationKey = configuration
    ? configurationKey(configuration)
    : null;
  const selectedFont = fontsById.get(draft.fontId) ?? CONFIGURATOR_FONTS[0];
  const postalCodeIsValid =
    postalCode.length === 0 || POSTAL_CODE_PATTERN.test(postalCode);
  const calculationIsReady =
    calculationState.status === "ready" &&
    currentConfigurationKey !== null &&
    configurationKey(calculationState.configuration) === currentConfigurationKey;
  const previewCalculation =
    calculationState.status === "ready"
      ? calculationState
      : calculationState.status === "loading"
        ? calculationState.previous
        : null;
  const showPreview =
    previewCalculation !== null &&
    fontState !== "error" &&
    (calculationIsReady || calculationState.status === "loading");
  const canContinue =
    calculationIsReady && fontState === "ready" && postalCodeIsValid;

  useEffect(() => {
    let cancelled = false;
    let storedSelection: ReturnType<
      typeof readOrMigrateConfiguratorStoredState
    > = null;

    try {
      storedSelection = readOrMigrateConfiguratorStoredState(
        window.sessionStorage
      );
    } catch {
      // Storage may be unavailable in a privacy-restricted browsing context.
    }

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (storedSelection) {
        const storedKey = configurationKey(storedSelection.configuration);
        const initialKey = configurationKey(initialConfiguration);

        setDraft(toDraft(storedSelection.configuration));
        setServices(storedSelection.services);

        if (storedKey !== initialKey) {
          calculationRequestIdRef.current += 1;
          calculatedConfigurationKeyRef.current = null;
          setCalculationState((currentState) =>
            loadingCalculationState(currentState)
          );
        }
      }

      setStorageIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [initialConfiguration]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        setFontState("loading");
      }
    });

    loadConfiguratorFont(selectedFont)
      .then(() => {
        if (!cancelled) {
          setFontState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFontState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFont]);

  useEffect(() => {
    if (!storageIsReady) {
      return;
    }

    if (!configuration || !currentConfigurationKey) {
      const requestId = ++calculationRequestIdRef.current;

      queueMicrotask(() => {
        if (requestId === calculationRequestIdRef.current) {
          setCalculationState({
            status: "invalid",
            message: "Bitte prüfen Sie die markierten Angaben."
          });
        }
      });
      return;
    }

    if (calculatedConfigurationKeyRef.current === currentConfigurationKey) {
      return;
    }

    const requestId = ++calculationRequestIdRef.current;
    const timeout = window.setTimeout(() => {
      startCalculationTransition(async () => {
        try {
          const result = await calculateConfigurator(configuration);

          if (requestId !== calculationRequestIdRef.current) {
            return;
          }

          if (result.status === "ok" || result.status === "pricing-changed") {
            calculatedConfigurationKeyRef.current = currentConfigurationKey;
            setCalculationState({
              status: "ready",
              configuration,
              calculation: result.calculation
            });
            setConfirmedPricingVersion(result.calculation.pricingVersion);
            return;
          }

          setCalculationState({
            status:
              result.status === "unavailable" ? "unavailable" : "invalid",
            message: calculationErrorMessage(result)
          });
        } catch {
          if (requestId === calculationRequestIdRef.current) {
            setCalculationState({
              status: "unavailable",
              message:
                "Vorschau und Preis können im Moment nicht zuverlässig berechnet werden."
            });
          }
        }
      });
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [
    configuration,
    currentConfigurationKey,
    startCalculationTransition,
    storageIsReady
  ]);

  useEffect(() => {
    if (
      !storageIsReady ||
      !userHasInteractedRef.current ||
      !configuration
    ) {
      return;
    }

    writeConfiguratorStoredState(window.sessionStorage, {
      configuration,
      services
    });
  }, [configuration, services, storageIsReady]);

  function updateDraft<Key extends keyof ConfiguratorDraft>(
    key: Key,
    value: ConfiguratorDraft[Key]
  ) {
    const nextDraft = { ...draft, [key]: value };
    const nextConfiguration = toConfiguration(nextDraft);

    userHasInteractedRef.current = true;
    calculationRequestIdRef.current += 1;
    calculatedConfigurationKeyRef.current = null;
    setDraft(nextDraft);
    setCalculationState((currentState) =>
      nextConfiguration
        ? loadingCalculationState(currentState)
        : {
            status: "invalid",
            message: "Bitte prüfen Sie die markierten Angaben."
          }
    );
  }

  function toggleService(serviceId: ConfiguratorServiceId) {
    userHasInteractedRef.current = true;
    setServices((currentServices) =>
      currentServices.includes(serviceId)
        ? currentServices.filter((id) => id !== serviceId)
        : [...currentServices, serviceId]
    );
  }

  function showStep(step: StepNumber) {
    if (submissionIsPending) {
      return;
    }

    setActiveStep(step);
    setHighestAvailableStep((current) =>
      Math.max(current, step) as StepNumber
    );
    requestAnimationFrame(() => activeStepHeadingRef.current?.focus());
  }

  const textIsInvalid =
    draft.text.trim().length === 0 ||
    draft.text.length > 60 ||
    !SUPPORTED_CONFIGURATOR_TEXT.test(draft.text);
  const widthIsInvalid =
    draft.valanceWidthMm === "" ||
    !Number.isSafeInteger(draft.valanceWidthMm) ||
    draft.valanceWidthMm < 1;
  const valanceHeightIsInvalid =
    draft.valanceHeightMm === "" ||
    !Number.isSafeInteger(draft.valanceHeightMm) ||
    draft.valanceHeightMm < 200 ||
    draft.valanceHeightMm > 300;
  const letterHeightIsInvalid =
    draft.letterHeightMm === "" ||
    !Number.isSafeInteger(draft.letterHeightMm) ||
    draft.letterHeightMm < 1 ||
    draft.letterHeightMm > 180;
  const submission: ConfiguratorProjectSubmission | undefined =
    calculationIsReady && configuration && postalCodeIsValid
      ? {
          configuration,
          services,
          ...(postalCode ? { postalCode } : {}),
          confirmedPricingVersion:
            confirmedPricingVersion ||
            calculationState.calculation.pricingVersion
        }
      : undefined;

  return (
    <div
      className="full-configurator"
      data-active-step={activeStep}
      data-calculation-status={calculationState.status}
      aria-busy={submissionIsPending}
    >
      <div className="full-configurator__layout container">
        <section
          aria-label="Live-Vorschau"
          className="full-configurator__preview-stage"
        >
          <p className="full-configurator__preview-kicker eyebrow--marker-loop">
            <span>Live / serverberechnet</span>
          </p>

          {showPreview && previewCalculation ? (
            <ConfiguratorPreview
              configuration={previewCalculation.configuration}
              geometry={previewCalculation.calculation.geometry}
              measurement={previewCalculation.calculation.measurement}
              statusText={
                calculationState.status === "loading"
                  ? "Vorschau wird aktualisiert."
                  : "Vorschau ist berechnet."
              }
            />
          ) : (
            <div
              className="full-configurator__preview-status"
              role="status"
              aria-live="polite"
            >
              <p>
                {fontState === "error"
                  ? "Die ausgewählte Schrift konnte nicht geladen werden."
                  : calculationState.status === "invalid" ||
                      calculationState.status === "unavailable"
                    ? calculationState.message
                    : "Vorschau wird berechnet …"}
              </p>
            </div>
          )}
        </section>

        <div className="full-configurator__controls-column">
          <nav aria-label="Konfigurationsschritte">
            <ol className="full-configurator__steps">
              {STEPS.map((step) => {
                const isAvailable =
                  step.number <= highestAvailableStep &&
                  (step.number !== 3 || canContinue);

                return (
                  <li key={step.number}>
                    <button
                      aria-current={
                        activeStep === step.number ? "step" : undefined
                      }
                      disabled={!isAvailable || submissionIsPending}
                      onClick={() => showStep(step.number)}
                      type="button"
                    >
                      <span>{String(step.number).padStart(2, "0")}</span>
                      {step.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {activeStep === 1 ? (
            <section
              aria-labelledby="configurator-step-1-title"
              className="full-configurator__step"
            >
              <div className="full-configurator__step-heading">
                <p>01 / Basis</p>
                <h2
                  id="configurator-step-1-title"
                  ref={activeStepHeadingRef}
                  tabIndex={-1}
                >
                  Grundkonfiguration
                </h2>
                <p>
                  Geben Sie die sichtbare Beschriftung und die Grundmaße des
                  Volants ein.
                </p>
              </div>

              <ConfiguratorPickerGroup>
              <div className="configurator-controls full-configurator__base-controls">
                <fieldset
                  aria-label="01 Gestaltung"
                  className="configurator-control-group"
                >
                  <legend>
                    <span>01</span> Gestaltung
                  </legend>

                  <div className="configurator-composition-field">
                    <span>Komposition</span>
                    <ConfiguratorPicker
                      ariaLabel={`Komposition: ${compositionsById.get(draft.compositionMode)?.label ?? draft.compositionMode}`}
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
                          value as ConfiguratorConfigurationV1["compositionMode"]
                        )
                      }
                      options={CONFIGURATOR_COMPOSITION_MODES}
                      value={draft.compositionMode}
                    />
                  </div>

                  <div className="configurator-text-field">
                    <label htmlFor="configurator-text">
                      Text auf dem Volant
                    </label>
                    <input
                      aria-describedby={
                        textIsInvalid ? "configurator-text-error" : undefined
                      }
                      aria-invalid={textIsInvalid}
                      id="configurator-text"
                      maxLength={60}
                      onChange={(event) =>
                        updateDraft("text", event.currentTarget.value)
                      }
                      spellCheck="false"
                      type="text"
                      value={draft.text}
                    />
                    {textIsInvalid ? (
                      <p
                        className="configurator-field-error"
                        id="configurator-text-error"
                      >
                        Bitte geben Sie bis zu 60 unterstützte Zeichen ein.
                      </p>
                    ) : null}
                  </div>

                  <div className="configurator-select-field">
                    <span>Schriftstil</span>
                    <ConfiguratorPicker
                      ariaLabel={`Schriftstil: ${selectedFont.label} · ${selectedFont.direction}`}
                      id="configurator-font"
                      kind="font"
                      onChange={(value) =>
                        updateDraft(
                          "fontId",
                          value as ConfiguratorConfigurationV1["fontId"]
                        )
                      }
                      options={CONFIGURATOR_FONTS}
                      value={draft.fontId}
                    />
                  </div>

                  {draft.compositionMode !== "text-only" ? (
                    <p
                      className="configurator-composition-note"
                      id="configurator-composition-note"
                    >
                      Das Logo wird schematisch dargestellt. Die finale Datei
                      wird separat geprüft.
                    </p>
                  ) : null}
                </fieldset>

                <fieldset
                  aria-label="02 Maße"
                  className="configurator-control-group"
                >
                  <legend>
                    <span>02</span> Maße
                  </legend>
                  <div className="configurator-number-grid">
                    <div className="configurator-number-field">
                      <label htmlFor="configurator-width">Volantbreite</label>
                      <span className="configurator-number-input">
                        <input
                          aria-describedby={
                            widthIsInvalid
                              ? "configurator-width-error"
                              : undefined
                          }
                          aria-invalid={widthIsInvalid}
                          id="configurator-width"
                          inputMode="numeric"
                          min={1}
                          onChange={(event) =>
                            updateDraft(
                              "valanceWidthMm",
                              event.currentTarget.value === ""
                                ? ""
                                : event.currentTarget.valueAsNumber
                            )
                          }
                          step={1}
                          type="number"
                          value={draft.valanceWidthMm}
                        />
                        <span>mm</span>
                      </span>
                      {widthIsInvalid ? (
                        <p
                          className="configurator-field-error"
                          id="configurator-width-error"
                        >
                          Bitte geben Sie eine ganze Breite ab 1 mm ein.
                        </p>
                      ) : null}
                    </div>

                    <div className="configurator-number-field">
                      <label htmlFor="configurator-height">Volanthöhe</label>
                      <span className="configurator-number-input">
                        <input
                          aria-describedby={
                            valanceHeightIsInvalid
                              ? "configurator-height-error"
                              : undefined
                          }
                          aria-invalid={valanceHeightIsInvalid}
                          id="configurator-height"
                          inputMode="numeric"
                          max={300}
                          min={200}
                          onChange={(event) =>
                            updateDraft(
                              "valanceHeightMm",
                              event.currentTarget.value === ""
                                ? ""
                                : event.currentTarget.valueAsNumber
                            )
                          }
                          step={1}
                          type="number"
                          value={draft.valanceHeightMm}
                        />
                        <span>mm</span>
                      </span>
                      {valanceHeightIsInvalid ? (
                        <p
                          className="configurator-field-error"
                          id="configurator-height-error"
                        >
                          Die Volanthöhe muss zwischen 200 und 300 mm liegen.
                        </p>
                      ) : null}
                    </div>

                    <div className="configurator-number-field">
                      <label htmlFor="configurator-letter-height">
                        Buchstabenhöhe
                      </label>
                      <span className="configurator-number-input">
                        <input
                          aria-describedby={
                            letterHeightIsInvalid
                              ? "configurator-letter-height-error"
                              : undefined
                          }
                          aria-invalid={letterHeightIsInvalid}
                          id="configurator-letter-height"
                          inputMode="numeric"
                          max={180}
                          min={1}
                          onChange={(event) =>
                            updateDraft(
                              "letterHeightMm",
                              event.currentTarget.value === ""
                                ? ""
                                : event.currentTarget.valueAsNumber
                            )
                          }
                          step={1}
                          type="number"
                          value={draft.letterHeightMm}
                        />
                        <span>mm</span>
                      </span>
                      {letterHeightIsInvalid ? (
                        <p
                          className="configurator-field-error"
                          id="configurator-letter-height-error"
                        >
                          Die Buchstabenhöhe muss zwischen 1 und 180 mm liegen.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </fieldset>

                <fieldset
                  aria-label="03 Farbe & Licht"
                  className="configurator-control-group"
                >
                  <legend>
                    <span>03</span> Farbe &amp; Licht
                  </legend>

                  <div className="configurator-option-block">
                    <span className="configurator-option-label">
                      Markisenfarbe
                    </span>
                    <ConfiguratorPicker
                      ariaLabel={`Markisenfarbe: ${awningColorsById.get(draft.awningColorId)?.label ?? draft.awningColorId}`}
                      id="configurator-awning-color"
                      kind="color"
                      listboxLabel="Markisenfarbe auswählen"
                      onChange={(value) =>
                        updateDraft(
                          "awningColorId",
                          value as ConfiguratorConfigurationV1["awningColorId"]
                        )
                      }
                      options={CONFIGURATOR_AWNING_COLORS}
                      value={draft.awningColorId}
                    />
                  </div>

                  <div className="configurator-option-block">
                    <span className="configurator-option-label">
                      Lichtwirkung
                    </span>
                    <ConfiguratorPicker
                      ariaLabel={`Lichtwirkung: ${lightColorsById.get(draft.lightColorId)?.label ?? draft.lightColorId}`}
                      id="configurator-light-color"
                      kind="color"
                      listboxLabel="Lichtwirkung auswählen"
                      onChange={(value) =>
                        updateDraft(
                          "lightColorId",
                          value as ConfiguratorConfigurationV1["lightColorId"]
                        )
                      }
                      options={CONFIGURATOR_LIGHT_COLORS}
                      value={draft.lightColorId}
                    />
                  </div>
                </fieldset>
              </div>
              </ConfiguratorPickerGroup>

              <div className="full-configurator__step-actions full-configurator__step-actions--forward">
                <button
                  className="button button--primary"
                  disabled={!canContinue}
                  onClick={() => showStep(2)}
                  type="button"
                >
                  Weitere Optionen
                </button>
              </div>
            </section>
          ) : null}

          {activeStep === 2 ? (
            <section
              aria-labelledby="configurator-step-2-title"
              className="full-configurator__step"
            >
              <div className="full-configurator__step-heading">
                <p>02 / Auswahl</p>
                <h2
                  id="configurator-step-2-title"
                  ref={activeStepHeadingRef}
                  tabIndex={-1}
                >
                  Weitere Optionen
                </h2>
                <p>
                  Wählen Sie die gewünschten Dienstleistungen für die manuelle
                  Projektprüfung aus.
                </p>
              </div>

              <fieldset className="full-configurator__services-block">
                <legend>Dienstleistungen</legend>
                <div className="full-configurator__service-grid">
                  {CONFIGURATOR_SERVICES.map((service) => (
                    <label key={service.id}>
                      <input
                        checked={services.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        type="checkbox"
                        value={service.id}
                      />
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
                <p className="full-configurator__option-note">
                  Diese Leistungen werden manuell kalkuliert und sind nicht im
                  vorläufigen Nettopreis enthalten.
                </p>
              </fieldset>

              <div className="full-configurator__postal-code">
                <label htmlFor="configurator-postal-code">
                  PLZ des Objekts <span>(optional)</span>
                </label>
                <input
                  aria-describedby={
                    postalCodeIsValid
                      ? "configurator-postal-code-hint"
                      : "configurator-postal-code-hint configurator-postal-code-error"
                  }
                  aria-invalid={!postalCodeIsValid}
                  autoComplete="postal-code"
                  id="configurator-postal-code"
                  inputMode="numeric"
                  maxLength={5}
                  onChange={(event) => setPostalCode(event.currentTarget.value)}
                  pattern="[0-9]{5}"
                  type="text"
                  value={postalCode}
                />
                <p id="configurator-postal-code-hint">
                  Wird nur der Anfrage beigefügt und nicht im Browser-Entwurf
                  gespeichert.
                </p>
                {!postalCodeIsValid ? (
                  <p
                    className="full-configurator__field-error"
                    id="configurator-postal-code-error"
                  >
                    Bitte geben Sie eine fünfstellige deutsche PLZ ein.
                  </p>
                ) : null}
              </div>

              <div className="full-configurator__step-actions full-configurator__step-actions--split">
                <button
                  className="button button--secondary"
                  disabled={submissionIsPending}
                  onClick={() => showStep(1)}
                  type="button"
                >
                  Zurück
                </button>
                <button
                  className="button button--primary"
                  disabled={!canContinue}
                  onClick={() => showStep(3)}
                  type="button"
                >
                  Preis & Projektanfrage
                </button>
              </div>
            </section>
          ) : null}

          {activeStep === 3 && calculationIsReady && submission ? (
            <section
              aria-labelledby="configurator-inquiry-title"
              className="full-configurator__step full-configurator__step--inquiry"
            >
              <div className="full-configurator__step-heading">
                <p>03 / Ergebnis</p>
                <h2
                  id="configurator-inquiry-title"
                  ref={activeStepHeadingRef}
                  tabIndex={-1}
                >
                  Preis & Projektanfrage
                </h2>
                <p>
                  Prüfen Sie die automatisch beigefügte Zusammenfassung und
                  senden Sie anschließend die gemeinsame Projektanfrage.
                </p>
              </div>

              <div className="full-configurator__summary-actions">
                <button
                  className="button button--secondary"
                  disabled={submissionIsPending}
                  onClick={() => showStep(1)}
                  type="button"
                >
                  Grunddaten ändern
                </button>
                <button
                  className="button button--secondary"
                  disabled={submissionIsPending}
                  onClick={() => showStep(2)}
                  type="button"
                >
                  Optionen ändern
                </button>
              </div>

              <PriceSummary
                calculation={calculationState.calculation}
                configuration={calculationState.configuration}
                postalCode={postalCode}
                services={services}
              />

              <div className="full-configurator__lead-form">
                <LeadForm
                  attachmentsEnabled={attachmentsEnabled}
                  configuratorProject={submission}
                  labelledById="configurator-inquiry-title"
                  onConfiguratorPricingConfirmed={(change) => {
                    calculatedConfigurationKeyRef.current =
                      currentConfigurationKey;
                    setCalculationState({
                      status: "ready",
                      configuration: calculationState.configuration,
                      calculation: change.calculation
                    });
                    setConfirmedPricingVersion(change.pricingVersion);
                  }}
                  onSubmissionPendingChange={setSubmissionIsPending}
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
