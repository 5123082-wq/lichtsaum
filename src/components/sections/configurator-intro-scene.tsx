"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ConfiguratorIntroSceneProps = Readonly<{
  eyebrow: string;
  explanation: string;
  intro: string;
  title: string;
}>;

export function ConfiguratorIntroScene({
  eyebrow,
  explanation,
  intro,
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
            alt="Technische Konzeptvisualisierung einer Gewerbemarkise mit Leuchtvolant; orange Maßlinien markieren Höhe und Länge des Volants."
            className="configurator-intro__image"
            fill
            priority
            sizes="(min-width: 64rem) 78vw, 100vw"
            src="/images/lichtsaum-engineered-aufmass-volant.webp"
          />
          <figcaption className="configurator-intro__visual-label">
            Konzeptvisualisierung / Aufmaß
          </figcaption>
        </figure>
        <div className="configurator-intro__scrim" aria-hidden="true" />

        <div className="configurator-intro__content container">
          <div className="configurator-intro__copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <div className="configurator-page__intro-copy">
              <p>{intro}</p>
              <p>{explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
