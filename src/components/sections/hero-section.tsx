import { HeroScrollScene } from "@/components/sections/hero-scroll-scene";

export function HeroSection() {
  return (
    <HeroScrollScene>
      <h1 className="hero__title" id="hero-title">
        <span className="hero__display">
          Markise wird <span className="text-accent">Markenlicht</span>
        </span>
      </h1>
    </HeroScrollScene>
  );
}
