"use client";

import Image from "next/image";
import { useState } from "react";

type TransformationComparisonProps = Readonly<{
  dayCard: Readonly<{
    label: string;
    alt: string;
    showColorLabel: string;
    showMonochromeLabel: string;
  }>;
  comparisonCard: Readonly<{
    title: string;
    alt: string;
    showColorLabel: string;
    showMonochromeLabel: string;
  }>;
  contextCard: Readonly<{
    label: string;
    alt: string;
    showColorLabel: string;
    showMonochromeLabel: string;
  }>;
}>;

const nightImage = "/images/lichtsaum-concept-cafe-terrace-night.webp";
const classicImage =
  "/images/lichtsaum-konzept-klassische-restaurantfassade-beleuchtete-markisenvolants-nacht.webp";
const contextImage =
  "/images/lichtsaum-konzept-beleuchteter-markisenvolant-cafe-bistro-stadt-abend.webp";

export function TransformationComparison({
  dayCard,
  comparisonCard,
  contextCard
}: TransformationComparisonProps) {
  const [isDayColorPinned, setIsDayColorPinned] = useState(false);
  const [isComparisonColorPinned, setIsComparisonColorPinned] = useState(false);
  const [isContextColorPinned, setIsContextColorPinned] = useState(false);
  const dayInteractionLabel = isDayColorPinned
    ? dayCard.showMonochromeLabel
    : dayCard.showColorLabel;
  const comparisonInteractionLabel = isComparisonColorPinned
    ? comparisonCard.showMonochromeLabel
    : comparisonCard.showColorLabel;
  const contextInteractionLabel = isContextColorPinned
    ? contextCard.showMonochromeLabel
    : contextCard.showColorLabel;

  return (
    <div className="transformation__grid">
      <figure className="transformation__figure transformation__figure--day">
        <button
          aria-label={`${dayCard.alt} ${dayInteractionLabel}`}
          aria-pressed={isDayColorPinned}
          className="transformation__media transformation__media--interactive"
          data-color-active={isDayColorPinned ? "true" : "false"}
          onClick={() => setIsDayColorPinned((current) => !current)}
          type="button"
        >
          <Image
            alt={dayCard.alt}
            className="transformation__image transformation__image--reveal"
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            src={classicImage}
          />
          <span className="transformation__marker">
            01 / {dayCard.label}
          </span>
        </button>
      </figure>

      <figure className="transformation__figure transformation__figure--night">
        <button
          aria-label={`${comparisonCard.alt} ${comparisonInteractionLabel}`}
          aria-pressed={isComparisonColorPinned}
          className="transformation__media transformation__media--interactive"
          data-color-active={isComparisonColorPinned ? "true" : "false"}
          onClick={() =>
            setIsComparisonColorPinned((current) => !current)
          }
          type="button"
        >
          <Image
            alt={comparisonCard.alt}
            className="transformation__image transformation__image--reveal"
            fill
            sizes="(min-width: 768px) 32vw, 100vw"
            src={nightImage}
          />
          <span className="transformation__marker">
            02 / {comparisonCard.title}
          </span>
        </button>
      </figure>

      <div className="transformation__slogan">
        <p className="transformation__slogan-copy">
          <span>Tagsüber Marke.</span>
          <span>Nachts Markenlicht.</span>
        </p>
      </div>

      <figure className="transformation__figure transformation__figure--context">
        <button
          aria-label={`${contextCard.alt} ${contextInteractionLabel}`}
          aria-pressed={isContextColorPinned}
          className="transformation__media transformation__media--interactive"
          data-color-active={isContextColorPinned ? "true" : "false"}
          onClick={() => setIsContextColorPinned((current) => !current)}
          type="button"
        >
          <Image
            alt={contextCard.alt}
            className="transformation__image transformation__image--reveal"
            fill
            sizes="100vw"
            src={contextImage}
          />
          <span className="transformation__marker">
            03 / {contextCard.label}
          </span>
        </button>
      </figure>
    </div>
  );
}
