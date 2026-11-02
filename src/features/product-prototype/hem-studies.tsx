import { ProductPicture } from "./product-picture";

const studies = [
  { id: "straight", label: "Gerade" },
  { id: "wave", label: "Gewellt" },
  { id: "scallop", label: "Bogenförmig" }
] as const;
const image = "/images/product/hem-comparison-v1.webp";

export function HemStudies() {
  return <div className="editorial-hems" id="formen" role="group" aria-label="Drei Volantformen">
    <ProductPicture className="editorial-hem-panorama" image={image} loading="lazy"
      alt="Drei graphitfarbene textile Volants mit geradem, gewelltem und bogenförmigem Abschluss, nebeneinander im weichen Seitenlicht." />
    <div className="editorial-hem-labels">
      {studies.map((study) => <figure key={study.id}>
        <div className="editorial-hem-crop">
          <ProductPicture image={image} mobileVariant={study.id} loading="lazy"
            alt={`${study.label}: graphitfarbener textiler Volant.`} />
        </div>
        <figcaption><h3>{study.label}</h3></figcaption>
      </figure>)}
    </div>
  </div>;
}
