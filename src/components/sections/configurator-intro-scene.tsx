"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ConfiguratorIntroSceneProps = Readonly<{
  eyebrow: string;
  title: string;
}>;

export function ConfiguratorIntroScene({
  eyebrow,
  title
}: ConfiguratorIntroSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      scene.toggleAttribute(
        "data-configurator-intro-complete",
        !entry.isIntersecting
      );
    });

    observer.observe(scene);

    return () => observer.disconnect();
  }, []);

  return (
    <header className="configurator-page__intro" ref={sceneRef}>
      <div className="configurator-intro__stage">
        <figure className="configurator-intro__media">
          <Image
            alt="Dunkle technische Konzeptzeichnung einer Markise mit Maßangaben für Volanthöhe und Volantlänge."
            className="configurator-intro__image"
            fill
            priority
            sizes="(min-width: 64rem) 78vw, 100vw"
            src="/images/lichtsaum-konfigurator-header-technical.png"
            unoptimized
          />
          <figcaption className="configurator-intro__visual-label">
            Konzeptvisualisierung / Leuchtvolant
          </figcaption>
        </figure>
        <div className="configurator-intro__edge-fade" aria-hidden="true" />
        <div className="configurator-intro__content container">
          <div className="configurator-intro__copy">
            <p className="eyebrow eyebrow--marker-loop">
              <span>{eyebrow}</span>
            </p>
            <h1>{title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
