import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  eyebrowTreatment?: "plain" | "marker-loop";
  headingId?: string;
  title: ReactNode;
  introduction?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  eyebrow,
  eyebrowTreatment = "plain",
  headingId,
  title,
  introduction,
  align = "start"
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow ? (
        <p
          className={`eyebrow${
            eyebrowTreatment === "marker-loop" ? " eyebrow--marker-loop" : ""
          }`}
        >
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <h2 id={headingId}>{title}</h2>
      {introduction ? <p className="section-heading__intro">{introduction}</p> : null}
    </header>
  );
}
