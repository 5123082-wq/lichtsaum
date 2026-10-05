"use client";

import { ArrowsOut, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import Image from "next/image";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState
} from "react";

import type { TransformationCardContent } from "@/content/landing.de";

type TransformationComparisonProps = Readonly<{
  dayCard: TransformationCardContent & Readonly<{ label: string }>;
  comparisonCard: TransformationCardContent & Readonly<{ title: string }>;
  contextCard: TransformationCardContent & Readonly<{ label: string }>;
}>;

export function TransformationComparison({
  dayCard,
  comparisonCard,
  contextCard
}: TransformationComparisonProps) {
  const items = [
    { ...dayCard, label: dayCard.label, slot: "day", sizes: "(min-width: 768px) 66vw, 100vw" },
    { ...comparisonCard, label: comparisonCard.title, slot: "night", sizes: "(min-width: 768px) 32vw, 100vw" },
    { ...contextCard, label: contextCard.label, slot: "context", sizes: "100vw" }
  ];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || activeIndex === null || dialog.open) {
      return;
    }

    try {
      dialog.showModal();
      document.documentElement.classList.add("transformation-modal-open");
      closeRef.current?.focus({ preventScroll: true });
    } catch {
      const fallbackHref = triggerRef.current?.href;

      if (fallbackHref) {
        window.location.assign(fallbackHref);
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("transformation-modal-open");
    };
  }, []);

  function openModal(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      typeof dialogRef.current?.showModal !== "function"
    ) {
      return;
    }

    event.preventDefault();
    triggerRef.current = event.currentTarget;
    setActiveIndex(index);
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    document.documentElement.classList.remove("transformation-modal-open");
    setActiveIndex(null);
    const trigger = triggerRef.current;
    triggerRef.current = null;

    if (trigger?.isConnected) {
      trigger.focus({ preventScroll: true });
    }
  }

  function selectRelativeItem(offset: number) {
    setActiveIndex((current) => {
      return current === null ? null : (current + offset + items.length) % items.length;
    });
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === closeRef.current) {
        event.preventDefault();
        nextRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === nextRef.current) {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      selectRelativeItem(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  function renderCard(index: number) {
    const item = items[index];

    return (
      <figure className={`transformation__figure transformation__figure--${item.slot}`}>
        <a
          aria-haspopup="dialog"
          aria-label={`${item.label}: Bild vergrößern`}
          className="transformation__media"
          href={item.image}
          onClick={(event) => openModal(event, index)}
        >
          <Image
            alt={item.alt}
            className="transformation__image"
            fill
            sizes={item.sizes}
            src={item.image}
          />
          <span className="transformation__disclosure">Konzeptvisualisierung</span>
          <span className="transformation__marker">
            {String(index + 1).padStart(2, "0")} / {item.label}
          </span>
          <span aria-hidden="true" className="transformation__zoom">
            <ArrowsOut size={22} weight="light" />
          </span>
        </a>
      </figure>
    );
  }

  return (
    <>
      <div className="transformation__grid">
        {renderCard(0)}
        {renderCard(1)}
        <div className="transformation__slogan">
          <p className="transformation__slogan-copy">
            <span>Tagsüber Marke.</span>
            <span>Nachts Markenlicht.</span>
          </p>
        </div>
        {renderCard(2)}
      </div>

      <dialog
        aria-describedby={activeItem ? "transformation-modal-caption" : undefined}
        aria-labelledby={activeItem ? "transformation-modal-title" : undefined}
        className="reference-modal transformation-modal"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
        onClose={handleDialogClose}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
      >
        {activeItem ? (
          <div className="reference-modal__surface transformation-modal__surface">
            <header className="reference-modal__header">
              <p>Konzeptvisualisierung</p>
              <button
                aria-label="Bild schließen"
                autoFocus
                className="reference-modal__close"
                onClick={closeModal}
                ref={closeRef}
                type="button"
              >
                <X aria-hidden="true" size={28} weight="light" />
              </button>
            </header>
            <div className="reference-modal__media transformation-modal__media">
              <Image
                alt={activeItem.alt}
                className="reference-modal__image"
                height={activeItem.height}
                key={activeItem.image}
                loading="eager"
                sizes="(min-width: 1440px) 1440px, 100vw"
                src={activeItem.image}
                width={activeItem.width}
              />
            </div>
            <footer className="reference-modal__footer">
              <div>
                <h2 id="transformation-modal-title">{activeItem.label}</h2>
                <p id="transformation-modal-caption">
                  {activeItem.caption} Die konkrete Ausführung wird objektbezogen geprüft.
                </p>
              </div>
              <div className="reference-modal__navigation">
                <button
                  aria-label="Vorheriges Bild"
                  onClick={() => selectRelativeItem(-1)}
                  type="button"
                >
                  <CaretLeft aria-hidden="true" size={26} weight="light" />
                </button>
                <span>{String((activeIndex ?? 0) + 1).padStart(2, "0")} / 03</span>
                <button
                  aria-label="Nächstes Bild"
                  onClick={() => selectRelativeItem(1)}
                  ref={nextRef}
                  type="button"
                >
                  <CaretRight aria-hidden="true" size={26} weight="light" />
                </button>
              </div>
              <p aria-atomic="true" aria-live="polite" className="visually-hidden" role="status">
                Bild {(activeIndex ?? 0) + 1} von 3: {activeItem.label}
              </p>
            </footer>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
