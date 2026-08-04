import { CompatibilitySection } from "@/components/sections/compatibility-section";
import { ConfiguratorSection } from "@/components/sections/configurator-section";
import { EngineeredPrecisionSection } from "@/components/sections/engineered-precision-section";
import { FaqSection } from "@/components/sections/faq-section";
import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectCheckSection } from "@/components/sections/project-check-section";
import { ReferencesSection } from "@/components/sections/references-section";
import { TransformationSection } from "@/components/sections/transformation-section";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main id="main-content">
        <HeroSection />
        <section className="signal-strip" aria-label="Projektgrundsätze">
          <div className="container signal-strip__grid">
            <p>
              <span>01</span>
              Bestehendes weiterdenken
            </p>
            <p>
              <span>02</span>
              Markenlicht gestalten
            </p>
            <p>
              <span>03</span>
              Objektbezogen prüfen
            </p>
          </div>
        </section>
        <TransformationSection />
        <EngineeredPrecisionSection />
        <CompatibilitySection />
        <ConfiguratorSection />
        <ReferencesSection />
        <FaqSection />
        <ProjectCheckSection />
      </main>
      <SiteFooter />
    </>
  );
}
