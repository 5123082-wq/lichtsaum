"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ProductTopic } from "@/content/product.de";
import { ProductPicture } from "./product-picture";

export function MaterialStudy({ topic }: { topic: ProductTopic }) {
  const [current, setCurrent] = useState(0);
  const [requested, setRequested] = useState(0);
  const [nearby, setNearby] = useState(false);
  const [firstReady, setFirstReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retries, setRetries] = useState<Record<number, number>>({});
  const [interacted, setInteracted] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const desired = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = topic.slides[current];
  const reveal = useCallback(async (index: number, image: HTMLImageElement) => {
    const source = image.currentSrc;
    try { await image.decode(); } catch { return; }
    if (!image.isConnected || image.currentSrc !== source) return;
    if (index === 0) setFirstReady(true);
    // A slower previous request must not overwrite a more recent arrow/touch choice.
    if (desired.current === index) { setCurrent(index); setFailed(false); }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (container.current) observer.observe(container.current);
    const first = images.current[0];
    if (first?.complete && first.naturalWidth > 0) void reveal(0, first);
    return () => observer.disconnect();
  }, [reveal]);

  function choose(direction: number) {
    const index = (desired.current + direction + topic.slides.length) % topic.slides.length;
    desired.current = index;
    setRequested(index);
    setFailed(false);
    setInteracted(true);
    const image = images.current[index];
    if (image?.complete && image.naturalWidth > 0) void reveal(index, image);
    else if (image?.complete) setRetries(previous => ({ ...previous, [index]: (previous[index] ?? 0) + 1 }));
  }

  return <div className="editorial-material-study" ref={container}>
    <div className="editorial-image-card editorial-image-card--left" role="group" aria-roledescription="Karussell" aria-label="Tuch & Farbe" aria-busy={requested !== current}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch" || (event.target as Element).closest("button,a")) return;
        touchStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => { touchStart.current = null; }}
      onPointerUp={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(dx < 0 ? 1 : -1);
      }}>
      <div className="editorial-study-media">
        {topic.slides.map((item, index) => <ProductPicture key={`${item.id}-${retries[index] ?? 0}`} image={item.image}
          imageRef={image => { images.current[index] = image; }}
          loading={index !== 0 && ((nearby && firstReady) || index === requested) ? "eager" : "lazy"}
          fetchPriority={index === requested ? "auto" : "low"}
          onLoad={event => { void reveal(index, event.currentTarget); }}
          onError={() => {
            if (desired.current === index) {
              desired.current = current; setRequested(current); setFailed(true);
            }
          }}
          alt={item.alt} hidden={index !== current}
          className={interacted && index === current && requested === current ? "editorial-study-media__entering" : undefined} />)}
      </div>
      <div className="editorial-study-panel">
        <p className="editorial-caption">{topic.label}</p>
        <div className="editorial-study-copy" id="editorial-material-slide" role="group" aria-label={`${current + 1} von ${topic.slides.length}: ${slide.label}`}>
          <h3>{slide.title.map((line, index) => <Fragment key={line}>{index > 0 ? <><br />{" "}</> : null}{line}</Fragment>)}</h3>
          <p>{slide.copy}</p>
        </div>
        <div className="editorial-study-arrows">
          <button type="button" aria-controls="editorial-material-slide" aria-label="Tuch & Farbe: vorherige Ansicht" onClick={() => choose(-1)}>←</button>
          <button type="button" aria-controls="editorial-material-slide" aria-label="Tuch & Farbe: nächste Ansicht" onClick={() => choose(1)}>→</button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{interacted ? `${current + 1} von ${topic.slides.length}: ${slide.label}` : ""}</p>
    </div>
    {failed ? <p className="editorial-small" role="status">Die Ansicht konnte nicht geladen werden. Bitte versuchen Sie es über die Pfeile erneut.</p> : null}
    <p className="editorial-small editorial-material-note">{topic.note}</p>
  </div>;
}
