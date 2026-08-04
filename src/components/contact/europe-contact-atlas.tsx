import Image from "next/image";

export function EuropeContactAtlas() {
  return (
    <figure className="contact-atlas">
      <Image
        alt=""
        aria-hidden="true"
        className="contact-atlas__image"
        fill
        priority
        sizes="100vw"
        src="/maps/lichtsaum-europe-countries-10m.svg"
      />
      <figcaption className="visually-hidden">
        Karte von West- und Mitteleuropa mit einheitlich hervorgehobenem Deutschland
        und einer schlichten Standortmarke für Berlin.
      </figcaption>
    </figure>
  );
}
