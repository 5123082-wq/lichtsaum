import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function EditorialExchange({ material }: { material: ReactNode }) {
  return <section className="editorial-material editorial-width" id="gestaltung" aria-labelledby="editorial-material-title" data-chapter="design">
    {material}
    <div className="editorial-personalize">
      <div className="editorial-personalize__backdrop" aria-hidden="true">
        <Image src="/images/product/leuchtvolant-detail.webp" alt="" fill sizes="(max-width: 760px) 100vw, 75vw" />
      </div>
      <div>
        <h3>Ihre Idee.<br /><span>Ihr Leuchtvolant.</span></h3>
        <p className="editorial-personalize-intro">Maße festlegen, Schrift und Farben wählen: Sehen Sie Ihren Entwurf und den vorläufigen Preis im Konfigurator.</p>
      </div>
      <div className="editorial-personalize__action">
        <Link className="button button--primary editorial-configure" href="/konfigurator">Jetzt konfigurieren</Link>
      </div>
    </div>
  </section>;
}
