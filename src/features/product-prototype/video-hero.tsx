"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const videoSource = "/videos/product/lichtsaum-orbit-v1.mp4";

export function VideoHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const pause = () => video.pause();
    const startOrResume = () => {
      if (!visible || document.hidden || reducedMotion.matches || pausedByUser.current ||
        video.ended || video.error || !video.paused) return;
      // Keep the source and current frame when resuming an offscreen pause.
      if (!video.getAttribute("src")) video.src = videoSource;
      video.muted = true;
      // Autoplay can be denied; the poster and explicit play control remain usable.
      void video.play().catch(() => {});
    };
    const onVisibility = () => document.hidden ? pause() : startOrResume();
    const onPreference = () => {
      if (reducedMotion.matches) {
        pause();
        setHasFrame(false);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      if (visible) startOrResume();
      else pause();
    }, { threshold: [0, 0.25] });
    observer.observe(hero);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onPreference);
      pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      pausedByUser.current = true;
      video.pause();
      return;
    }
    pausedByUser.current = false;
    if (!video.getAttribute("src")) video.src = videoSource;
    if (video.ended) video.currentTime = 0;
    video.muted = true;
    void video.play().catch(() => {});
  };

  return <header ref={heroRef} className="editorial-video-hero" id="licht" data-chapter="opening">
    <div className="editorial-video-hero__media" data-playing={hasFrame}>
      <Image className="editorial-video-hero__poster" src="/images/product/orbit-poster-v1.webp"
        alt="Caféfassade mit beleuchtetem LICHTSAUM-Schriftzug auf dem Markisenvolant."
        fill priority sizes="(max-width: 760px) 135vh, 100vw" />
      <video ref={videoRef} id="product-hero-video" className="editorial-video-hero__film"
        muted playsInline preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => { setPlaying(true); setHasFrame(true); setEnded(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setEnded(true); }}
        onError={() => { setFailed(true); setHasFrame(false); setPlaying(false); }}
        onTimeUpdate={(event) => {
          // Follow the inscription across the portrait crop without React frame updates.
          const progress = Math.min(1, event.currentTarget.currentTime / 9);
          event.currentTarget.style.setProperty("--inscription-position", `${65 - progress * 15}%`);
        }} />
    </div>
    <div className="editorial-video-hero__shade" aria-hidden="true" />
    <div className="editorial-video-hero__content editorial-width">
      <p className="editorial-caption">Das Produkt / Licht auf textilem Grund</p>
      <h1>LEUCHTVOLANT.<br /><span>FÜR IHRE MARKISE.</span></h1>
      <p className="editorial-video-hero__intro">Ein neuer textiler Volant mit beleuchtetem Schriftzug.
        Für bestehende, geeignete Gewerbemarkisen.</p>
    </div>
    <div className="editorial-video-hero__utility">
      {failed ? <span className="editorial-small" role="status">Video nicht verfügbar · Standbild</span> :
        <button type="button" onClick={togglePlayback} aria-controls="product-hero-video">
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          {playing ? "Video pausieren" : ended ? "Video erneut abspielen" : "Video abspielen"}
        </button>}
    </div>
  </header>;
}
