"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode
} from "react";
import { CaretDown, Check, Diamond } from "@phosphor-icons/react";

export type ConfiguratorPickerKind = "composition" | "font" | "color";

export type ConfiguratorPickerOption = Readonly<{
  id: string;
  label: string;
  description?: string;
  direction?: string;
  value?: string;
}>;

type ConfiguratorPickerGroupContextValue = Readonly<{
  openPickerId: string | null;
  setOpenPickerId: (id: string | null) => void;
}>;

type ConfiguratorPickerProps = Readonly<{
  ariaLabel: string;
  describedBy?: string;
  id: string;
  kind: ConfiguratorPickerKind;
  listboxLabel?: string;
  onChange: (value: string) => void;
  options: readonly ConfiguratorPickerOption[];
  value: string;
}>;

const ConfiguratorPickerGroupContext = createContext<
  ConfiguratorPickerGroupContextValue | undefined
>(undefined);

export function ConfiguratorPickerGroup({
  children
}: Readonly<{ children: ReactNode }>) {
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  return (
    <ConfiguratorPickerGroupContext.Provider
      value={{ openPickerId, setOpenPickerId }}
    >
      {children}
    </ConfiguratorPickerGroupContext.Provider>
  );
}

function useConfiguratorPickerGroup() {
  const context = useContext(ConfiguratorPickerGroupContext);

  if (!context) {
    throw new Error(
      "ConfiguratorPicker must be rendered inside ConfiguratorPickerGroup."
    );
  }

  return context;
}

function CompositionDiagram({ mode }: Readonly<{ mode: string }>) {
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

function PickerOptionContent({
  kind,
  option
}: Readonly<{
  kind: ConfiguratorPickerKind;
  option: ConfiguratorPickerOption;
}>) {
  if (kind === "composition") {
    return (
      <>
        <CompositionDiagram mode={option.id} />
        <span className="configurator-composition-copy">
          <strong>{option.label}</strong>
          {option.description ? <span>{option.description}</span> : null}
        </span>
      </>
    );
  }

  if (kind === "font") {
    return (
      <>
        <strong>{option.label}</strong>
        {option.direction ? <span>{option.direction}</span> : null}
      </>
    );
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="configurator-color-swatch"
        style={{ backgroundColor: option.value }}
      />
      <span>{option.label}</span>
    </>
  );
}

function pickerClassName(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "configurator-composition-picker";
  }

  if (kind === "font") {
    return "configurator-font-picker";
  }

  return "configurator-color-picker";
}

function listboxClassName(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "configurator-composition-listbox";
  }

  if (kind === "font") {
    return "configurator-font-listbox";
  }

  return "configurator-color-listbox";
}

function triggerClassName(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "configurator-composition-trigger";
  }

  if (kind === "font") {
    return "configurator-font-trigger";
  }

  return "configurator-color-trigger";
}

function optionClassName(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "configurator-composition-option";
  }

  if (kind === "font") {
    return "configurator-font-option";
  }

  return "configurator-color-option";
}

function checkClassName(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "configurator-composition-check";
  }

  if (kind === "color") {
    return "configurator-color-check";
  }

  return undefined;
}

function optionLabel(kind: ConfiguratorPickerKind) {
  if (kind === "composition") {
    return "Komposition auswählen";
  }

  if (kind === "font") {
    return "Schriftstil auswählen";
  }

  return "Option auswählen";
}

function isInsideConfiguratorPicker(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-configurator-picker]"))
  );
}

export function ConfiguratorPicker({
  ariaLabel,
  describedBy,
  id,
  kind,
  listboxLabel,
  onChange,
  options,
  value
}: ConfiguratorPickerProps) {
  const { openPickerId, setOpenPickerId } = useConfiguratorPickerGroup();
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isOpen = openPickerId === id;
  const selectedOption =
    options.find((option) => option.id === value) ?? options[0];
  const listboxId = `${id}-listbox`;
  const checkClass = checkClassName(kind);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    pickerRef.current
      ?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
      ?.focus();

    function closeOnOutsidePointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !isInsideConfiguratorPicker(event.target) &&
        !pickerRef.current?.contains(event.target)
      ) {
        setOpenPickerId(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPickerId(null);
        triggerRef.current?.focus({ preventScroll: true });
      }
    }

    function closeOnFocusOutside(event: FocusEvent) {
      if (!isInsideConfiguratorPicker(event.target)) {
        setOpenPickerId(null);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("focusin", closeOnFocusOutside);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("focusin", closeOnFocusOutside);
    };
  }, [isOpen, setOpenPickerId]);

  function moveListboxOptionFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (
      !options.length ||
      !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
    ) {
      return;
    }

    const optionElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')
    );
    const currentIndex = optionElements.indexOf(
      document.activeElement as HTMLElement
    );
    let nextIndex = currentIndex;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = optionElements.length - 1;
    } else if (event.key === "ArrowDown") {
      nextIndex = Math.min(
        optionElements.length - 1,
        Math.max(0, currentIndex + 1)
      );
    } else if (event.key === "ArrowUp") {
      nextIndex = Math.max(0, currentIndex <= 0 ? 0 : currentIndex - 1);
    }

    event.preventDefault();
    optionElements[nextIndex]?.focus();
  }

  if (!selectedOption) {
    return null;
  }

  return (
    <div
      className={pickerClassName(kind)}
      data-open={isOpen || undefined}
      data-configurator-picker=""
      ref={pickerRef}
    >
      <button
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={triggerClassName(kind)}
        onClick={() => {
          if (isOpen) {
            setOpenPickerId(null);
            triggerRef.current?.focus({ preventScroll: true });
            return;
          }

          setOpenPickerId(id);
        }}
        onMouseDown={(event) => {
          if (isOpen) {
            event.preventDefault();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpenPickerId(id);
          }
        }}
        ref={triggerRef}
        type="button"
      >
        {kind === "composition" ? (
          <CompositionDiagram mode={selectedOption.id} />
        ) : kind === "font" ? (
          <span>
            {selectedOption.label}
            {selectedOption.direction ? ` · ${selectedOption.direction}` : ""}
          </span>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="configurator-color-swatch"
              style={{ backgroundColor: selectedOption.value }}
            />
            <span>{selectedOption.label}</span>
          </>
        )}
        {kind === "composition" ? (
          <span className="configurator-composition-copy">
            <strong>{selectedOption.label}</strong>
          </span>
        ) : null}
        <CaretDown aria-hidden="true" size={18} weight="bold" />
      </button>

      <div
        aria-label={listboxLabel ?? optionLabel(kind)}
        className={listboxClassName(kind)}
        hidden={!isOpen}
        id={listboxId}
        onKeyDown={moveListboxOptionFocus}
        role="listbox"
      >
        {options.map((option) => (
          <button
            aria-selected={value === option.id}
            className={optionClassName(kind)}
            key={option.id}
            onClick={() => {
              onChange(option.id);
              setOpenPickerId(null);
              triggerRef.current?.focus({ preventScroll: true });
            }}
            onMouseDown={(event) => event.preventDefault()}
            role="option"
            tabIndex={value === option.id ? 0 : -1}
            type="button"
          >
            <PickerOptionContent kind={kind} option={option} />
            {kind !== "font" ? (
              <Check
                aria-hidden="true"
                className={checkClass}
                size={18}
                weight="bold"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
