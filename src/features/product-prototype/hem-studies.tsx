import Image from "next/image";

const studies = [
  { id: "straight", label: "Gerade", position: "0%" },
  { id: "wave", label: "Gewellt", position: "-100%" },
  { id: "scallop", label: "Bogenförmig", position: "-200%" }
];
const image = "/images/product/hem-comparison-v1.webp";

export function HemStudies() {
  return <div className="editorial-hems" id="formen" role="group" aria-label="Drei Volantformen">
    <Image className="editorial-hem-panorama" src={image} width={1920} height={819}
      sizes="(max-width: 760px) 100vw, (max-width: 1600px) 92vw, 1500px"
      alt="Drei graphitfarbene textile Volants mit geradem, gewelltem und bogenförmigem Abschluss, nebeneinander im weichen Seitenlicht." />
    <div className="editorial-hem-labels">
      {studies.map((study) => <figure key={study.id}>
        <div className="editorial-hem-crop">
          <Image src={image} width={1920} height={819} style={{ left: study.position }}
            sizes="(max-width: 760px) 300vw, 1px"
            alt={`${study.label}: graphitfarbener textiler Volant.`} />
        </div>
        <figcaption><h3>{study.label}</h3></figcaption>
      </figure>)}
    </div>
  </div>;
}
