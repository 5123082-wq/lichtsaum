"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const DESKTOP_MAX_PARALLAX_OFFSET = 192;
const MOBILE_MAX_PARALLAX_OFFSET = 112;
const NIGHT_FADE_START = 0.08;
const DESKTOP_NIGHT_FADE_END = 0.32;
const MOBILE_NIGHT_FADE_END = 0.42;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

export function HeroParallaxMedia() {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    const nightImage = media?.querySelector<HTMLElement>("[data-hero-night]");
    const hero = media?.closest<HTMLElement>(".hero");
    const content = hero?.querySelector<HTMLElement>(".hero__content");

    if (!media || !nightImage || !hero || !content) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const desktopViewport = window.matchMedia("(min-width: 48rem)");
    let animationFrame: number | null = null;

    const updatePosition = () => {
      animationFrame = null;

      if (reducedMotion.matches) {
        media.style.transform = "translate3d(0, 0, 0)";
        nightImage.style.opacity = "0";
        content.style.transform = "none";
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const scrollTravel = Math.max(1, heroRect.height - window.innerHeight);
      const maxParallaxOffset = desktopViewport.matches
        ? DESKTOP_MAX_PARALLAX_OFFSET
        : MOBILE_MAX_PARALLAX_OFFSET;
      const nightFadeEnd = desktopViewport.matches
        ? DESKTOP_NIGHT_FADE_END
        : MOBILE_NIGHT_FADE_END;

      if (heroRect.bottom <= 0) {
        media.style.transform = `translate3d(0, ${maxParallaxOffset}px, 0)`;
        nightImage.style.opacity = "1";
        content.style.transform = `translate3d(0, -${scrollTravel}px, 0)`;
        return;
      }

      if (heroRect.top >= window.innerHeight) {
        return;
      }

      const distanceScrolled = clamp(-heroRect.top, 0, scrollTravel);
      const sceneProgress = distanceScrolled / scrollTravel;
      const fadeProgress = clamp(
        (sceneProgress - NIGHT_FADE_START) /
          (nightFadeEnd - NIGHT_FADE_START),
        0,
        1
      );
      const offset = sceneProgress * maxParallaxOffset;

      media.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      nightImage.style.opacity = smoothstep(fadeProgress).toFixed(3);
      content.style.transform = `translate3d(0, -${distanceScrolled.toFixed(
        2
      )}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updatePosition);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    desktopViewport.addEventListener("change", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      desktopViewport.removeEventListener("change", scheduleUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div
      className="hero__media"
      ref={mediaRef}
      data-parallax-media
    >
      <Image
        className="hero__image hero__image--day"
        src="/images/lichtsaum-concept-cad-awning-off.webp"
        alt="Konzeptvisualisierung einer dunklen Gewerbemarkise an einer modernen Fassade, die rechts in eine technische Linienzeichnung übergeht; die Beschriftung LICHTSAUM ist unbeleuchtet."
        width={1672}
        height={941}
        preload
        sizes="100vw"
      />
      <Image
        className="hero__image hero__image--night"
        src="/images/lichtsaum-concept-cad-awning-on.webp"
        alt=""
        width={1672}
        height={941}
        preload
        sizes="100vw"
        data-hero-night
      />
    </div>
  );
}
