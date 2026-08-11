"use client";

import Image from "next/image";
import { useState } from "react";

import { engineeredPrecision } from "@/content/landing.de";
import { SectionHeading } from "@/components/ui/section-heading";

type PrecisionViewId = (typeof engineeredPrecision.views)[number]["id"];

export function EngineeredPrecisionSection() {
  const [activeViewId, setActiveViewId] =
    useState<PrecisionViewId>("lichtbild");

  function selectView(viewId: PrecisionViewId) {
    setActiveViewId(viewId);
  }

  return (
    <section
      className="section engineered-precision"
      id="praezision"
      aria-labelledby="engineered-precision-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow={engineeredPrecision.intro.eyebrow}
          eyebrowTreatment="marker-loop"
          headingId="engineered-precision-title"
          title={engineeredPrecision.intro.title}
          introduction={engineeredPrecision.intro.body}
        />

        <div className="engineered-precision__layout">
          <div className="engineered-precision__copy">
            <div
              className="engineered-precision__controls"
              role="group"
              aria-label="Schematische Ansicht wählen"
            >
              {engineeredPrecision.views.map((view, index) => {
                const isActive = view.id === activeViewId;

                return (
                  <div
                    className="engineered-precision__control-item"
                    data-active={isActive || undefined}
                    key={view.id}
                  >
                    <button
                      className="engineered-precision__control"
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`precision-description-${view.id}`}
                      onClick={() => selectView(view.id)}
                    >
                      <span className="engineered-precision__control-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="engineered-precision__control-copy">
                        <strong>{view.label}</strong>
                        <small>{view.title}</small>
                      </span>
                      <span className="engineered-precision__control-status">
                        {isActive ? "Aktiv" : "Wählen"}
                      </span>
                    </button>
                    <div
                      className="engineered-precision__control-description"
                      id={`precision-description-${view.id}`}
                      aria-hidden={!isActive}
                    >
                      <div className="engineered-precision__control-description-inner">
                        <p>{view.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <figure className="engineered-precision__figure" aria-live="polite">
            <div className="engineered-precision__media">
              {engineeredPrecision.views.map((view) => {
                const isActive = view.id === activeViewId;

                return (
                  <Image
                    className="engineered-precision__image"
                    data-state={isActive ? "active" : "inactive"}
                    src={view.image}
                    alt={isActive ? view.alt : ""}
                    aria-hidden={!isActive || undefined}
                    fill
                    key={view.id}
                    sizes="(min-width: 64rem) 58vw, 100vw"
                  />
                );
              })}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
