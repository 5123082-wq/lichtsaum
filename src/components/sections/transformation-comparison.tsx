import Image from "next/image";

type TransformationCard = Readonly<{
  alt: string;
}>;

type TransformationComparisonProps = Readonly<{
  dayCard: TransformationCard & Readonly<{ label: string }>;
  comparisonCard: TransformationCard & Readonly<{ title: string }>;
  contextCard: TransformationCard & Readonly<{ label: string }>;
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
  return (
    <div className="transformation__grid">
      <figure className="transformation__figure transformation__figure--day">
        <div className="transformation__media">
          <Image
            alt={dayCard.alt}
            className="transformation__image"
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            src={classicImage}
          />
          <span className="transformation__marker">01 / {dayCard.label}</span>
        </div>
      </figure>

      <figure className="transformation__figure transformation__figure--night">
        <div className="transformation__media">
          <Image
            alt={comparisonCard.alt}
            className="transformation__image"
            fill
            sizes="(min-width: 768px) 32vw, 100vw"
            src={nightImage}
          />
          <span className="transformation__marker">
            02 / {comparisonCard.title}
          </span>
        </div>
      </figure>

      <div className="transformation__slogan">
        <p className="transformation__slogan-copy">
          <span>Tagsüber Marke.</span>
          <span>Nachts Markenlicht.</span>
        </p>
      </div>

      <figure className="transformation__figure transformation__figure--context">
        <div className="transformation__media">
          <Image
            alt={contextCard.alt}
            className="transformation__image"
            fill
            sizes="100vw"
            src={contextImage}
          />
          <span className="transformation__marker">03 / {contextCard.label}</span>
        </div>
      </figure>
    </div>
  );
}
