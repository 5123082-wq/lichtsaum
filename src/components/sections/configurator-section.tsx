import { MiniConfigurator } from "@/features/mini-configurator/mini-configurator";

export function ConfiguratorSection() {
  return (
    <section
      aria-labelledby="configurator-title"
      className="section configurator-section"
      id="konfigurator"
    >
      <div className="container">
        <header className="configurator-section__header">
          <p className="configurator-section__eyebrow eyebrow--marker-loop">
            <span>Visueller Mini-Konfigurator</span>
          </p>
          <h2 id="configurator-title">LICHTSAUM STUDIO</h2>
          <div>
            <p>Wie könnte es an Ihrer Fassade aussehen?</p>
            <span>
              Schriftzug, Farbe und Proportionen direkt in einer schematischen
              Frontansicht vergleichen.
            </span>
          </div>
        </header>

        <MiniConfigurator />
      </div>
    </section>
  );
}
