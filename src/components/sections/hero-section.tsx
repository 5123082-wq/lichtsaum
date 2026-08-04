import { HeroParallaxMedia } from "@/components/sections/hero-parallax-media";

export function HeroSection() {
  return (
    <section className="hero" id="produkt" aria-labelledby="hero-title">
      <div className="hero__stage">
        <HeroParallaxMedia />
        <div className="hero__overlay" aria-hidden="true" />

        <div className="container hero__content">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__display">
              Markise wird <span className="text-accent">Markenlicht.</span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
