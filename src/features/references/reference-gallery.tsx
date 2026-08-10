"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import Image from "next/image";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState
} from "react";

import type { ReferenceProject } from "./types";

type ReferenceGalleryProps = Readonly<{
  items: readonly ReferenceProject[];
}>;

function shouldOpenModal(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.currentTarget.target !== "_blank" &&
    !event.currentTarget.hasAttribute("download")
  );
}

export function ReferenceGallery({ items }: ReferenceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || activeIndex === null || dialog.open) {
      return;
    }

    try {
      dialog.showModal();
      document.documentElement.classList.add("reference-modal-open");
    } catch {
      const fallbackHref = triggerRef.current?.href;

      if (fallbackHref) {
        window.location.assign(fallbackHref);
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("reference-modal-open");
    };
  }, []);

  function openModal(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      !shouldOpenModal(event) ||
      typeof dialogRef.current?.showModal !== "function"
    ) {
      return;
    }

    event.preventDefault();
    triggerRef.current = event.currentTarget;
    setActiveIndex(index);
  }

  function closeModal() {
    const dialog = dialogRef.current;

    if (dialog?.open) {
      dialog.close();
    }
  }

  function handleDialogClose() {
    const trigger = triggerRef.current;

    document.documentElement.classList.remove("reference-modal-open");
    setActiveIndex(null);
    triggerRef.current = null;

    if (trigger?.isConnected) {
      trigger.focus();
    }
  }

  function selectRelativeItem(offset: number) {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) {
        return current;
      }

      return (current + offset + items.length) % items.length;
    });
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectRelativeItem(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectRelativeItem(1);
    }
  }

  return (
    <>
      <div className="reference-gallery">
        {items.map((item, index) => (
          <a
            className={`reference-card reference-card--${item.slot}`}
            href={`/referenzen#${item.id}`}
            key={item.id}
            onClick={(event) => openModal(event, index)}
          >
            <Image
              alt={item.image.alt}
              className="reference-card__image"
              height={item.image.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              src={item.image.src}
              style={{
                objectPosition: `${item.image.focalPoint.x}% ${item.image.focalPoint.y}%`
              }}
              width={item.image.width}
            />
            {item.assetKind === "concept-visual" ? (
              <span className="reference-card__badge">
                Konzeptvisualisierung
              </span>
            ) : null}
            <span className="reference-card__overlay">
              <span className="reference-card__context">{item.context}</span>
              <span className="reference-card__title">{item.title}</span>
            </span>
          </a>
        ))}
      </div>

      <dialog
        aria-describedby={activeItem ? "reference-modal-caption" : undefined}
        aria-labelledby={activeItem ? "reference-modal-title" : undefined}
        className="reference-modal"
        onCancel={(event) => {
          event.preventDefault();
          closeModal();
        }}
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
          <div
            className="reference-modal__surface"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="reference-modal__header">
              <p>
                {activeItem.context}
                {activeItem.assetKind === "concept-visual"
                  ? " · Konzeptvisualisierung"
                  : ""}
              </p>
              <button
                aria-label="Galeriebild schließen"
                autoFocus
                className="reference-modal__close"
                onClick={closeModal}
                type="button"
              >
                <X aria-hidden="true" size={28} weight="light" />
              </button>
            </header>

            <div className="reference-modal__media">
              <Image
                alt={activeItem.image.alt}
                className="reference-modal__image"
                height={activeItem.image.height}
                sizes="100vw"
                src={activeItem.image.src}
                style={{
                  objectPosition: `${activeItem.image.focalPoint.x}% ${activeItem.image.focalPoint.y}%`
                }}
                width={activeItem.image.width}
              />
            </div>

            <footer className="reference-modal__footer">
              <div>
                <h2 id="reference-modal-title">{activeItem.title}</h2>
                <p id="reference-modal-caption">{activeItem.caption}</p>
              </div>

              <div className="reference-modal__navigation">
                <button
                  aria-label="Vorheriges Galeriebild"
                  onClick={() => selectRelativeItem(-1)}
                  type="button"
                >
                  <CaretLeft aria-hidden="true" size={26} weight="light" />
                </button>
                <span>
                  {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(items.length).padStart(2, "0")}
                </span>
                <button
                  aria-label="Nächstes Galeriebild"
                  onClick={() => selectRelativeItem(1)}
                  type="button"
                >
                  <CaretRight aria-hidden="true" size={26} weight="light" />
                </button>
              </div>
              <p
                aria-atomic="true"
                aria-live="polite"
                className="visually-hidden"
                role="status"
              >
                Galeriebild {(activeIndex ?? 0) + 1} von {items.length}:{" "}
                {activeItem.title}
              </p>
            </footer>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
