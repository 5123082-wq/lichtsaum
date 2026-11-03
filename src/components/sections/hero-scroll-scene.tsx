"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

const INITIAL_NIGHT_OPACITY = 0.35;
const NIGHT_FADE_VIEWPORT_DISTANCE = 0.26;
const TITLE_FADE_START = 100;
const TITLE_FADE_END = 320;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

export function HeroScrollScene({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nightImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactCamera = window.matchMedia("(orientation: portrait), (max-width: 760px)");
    let target = compactCamera.matches ? "scale(1.04)" : "scale(1.06)";
    let animation: Animation | null = null;
    let disposed = false;
    let settled = false;

    const animateToRest = (from: string, duration: number) => {
      animation?.cancel();
      animation = camera.animate([{ transform: from }, { transform: target }], {
        duration,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        fill: "forwards"
      });
      animation.onfinish = () => {
        camera.style.transform = target;
        animation?.cancel();
        animation = null;
        settled = true;
      };
    };
    const settleImmediately = () => {
      settled = true;
      animation?.cancel();
      animation = null;
      camera.style.transform = reducedMotion.matches ? "none" : target;
    };
    const onScroll = () => {
      if (window.scrollY <= 1 || settled) return;
      settled = true;
      if (animation) animateToRest(getComputedStyle(camera).transform, 300);
      else settleImmediately();
    };
    const onVisibility = () => {
      if (document.hidden) settleImmediately();
    };
    const onFramingChange = () => {
      target = compactCamera.matches ? "scale(1.04)" : "scale(1.06)";
      settleImmediately();
    };

    // Never replay an entrance on an anchor/restored scroll position, or after a late image load.
    if (reducedMotion.matches || window.scrollY > 1 || window.location.hash || document.hidden) {
      settleImmediately();
    } else {
      void Promise.all(Array.from(camera.querySelectorAll("img"), image => image.decode()))
        .then(() => {
          if (!disposed && !settled) animateToRest("scale(1)", 1800);
        }).catch(() => { if (!disposed) settleImmediately(); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", settleImmediately);
    compactCamera.addEventListener("change", onFramingChange);
    return () => {
      disposed = true;
      animation?.cancel();
      camera.style.removeProperty("transform");
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", settleImmediately);
      compactCamera.removeEventListener("change", onFramingChange);
    };
  }, []);

  useEffect(() => {
    // Native timelines keep the media drift and fades synchronized with scrolling.
    // The headline always moves with the document, without position compensation.
    if (CSS.supports("animation-timeline: scroll(root block)")) {
      return;
    }

    const nightImage = nightImageRef.current;
    const hero = sceneRef.current;
    const stage = stageRef.current;
    const media = mediaRef.current;
    const content = contentRef.current;

    if (!nightImage || !hero || !stage || !media || !content) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let animationFrame: number | null = null;

    const updateScene = () => {
      animationFrame = null;

      if (reducedMotion.matches) {
        media.style.transform = "none";
        nightImage.style.opacity = "1";
        content.style.opacity = "1";
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const maxParallaxOffset = Number.parseFloat(
        getComputedStyle(media).getPropertyValue("--hero-parallax-offset")
      );
      if (heroRect.bottom <= 0) {
        media.style.transform = `translate3d(0, ${maxParallaxOffset}px, 0)`;
        nightImage.style.opacity = "1";
        content.style.opacity = "0";
        return;
      }

      if (heroRect.top >= stage.offsetHeight) {
        return;
      }

      const distanceScrolled = Math.max(0, -heroRect.top);
      const scrollTravel = Math.max(
        1,
        hero.offsetHeight - stage.offsetHeight -
          Number.parseFloat(getComputedStyle(stage).marginBottom)
      );
      const sceneProgress = clamp(
        distanceScrolled / scrollTravel,
        0,
        1
      );
      const fadeProgress = clamp(
        distanceScrolled / (stage.offsetHeight * NIGHT_FADE_VIEWPORT_DISTANCE),
        0,
        1
      );
      const titleFadeProgress = clamp(
        (distanceScrolled - TITLE_FADE_START) /
          (TITLE_FADE_END - TITLE_FADE_START),
        0,
        1
      );
      media.style.transform = `translate3d(0, ${(sceneProgress * maxParallaxOffset).toFixed(2)}px, 0)`;
      content.style.opacity = (1 - smoothstep(titleFadeProgress)).toFixed(3);
      nightImage.style.opacity = (
        INITIAL_NIGHT_OPACITY +
        (1 - INITIAL_NIGHT_OPACITY) * smoothstep(fadeProgress)
      ).toFixed(3);
    };

    const scheduleUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateScene);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section
      className="hero"
      id="produkt"
      aria-labelledby="hero-title"
      ref={sceneRef}
    >
      <div className="hero__stage" ref={stageRef}>
        <div className="hero__media" ref={mediaRef}>
          <div className="hero__camera" ref={cameraRef}>
            <Image
              className="hero__image hero__image--day"
              src="/images/lichtsaum-hero-clean-facade.webp"
              alt="Konzeptvisualisierung einer dunklen Gewerbemarkise an einer modernen Fassade, die rechts in eine technische Linienzeichnung übergeht; der Schriftzug LICHTSAUM leuchtet warm und wird beim Scrollen heller."
              width={1672}
              height={941}
              preload
              quality={90}
              sizes="(orientation: portrait) 160vw, (min-width: 48rem) max(263svh, 100vw), 128svh"
            />
            <Image
              className="hero__image hero__image--night"
              src="/images/lichtsaum-hero-lettering.svg"
              alt=""
              width={1672}
              height={941}
              loading="eager"
              unoptimized
              data-hero-night
              ref={nightImageRef}
            />
          </div>
        </div>
        <div className="hero__overlay" aria-hidden="true" />
      </div>
      <div className="container hero__content" ref={contentRef}>
        {children}
      </div>
    </section>
  );
}
