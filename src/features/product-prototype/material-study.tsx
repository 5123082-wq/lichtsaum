"use client";

import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import type { ProductTopic } from "@/content/product.de";

export function MaterialStudy({ topic }: { topic: ProductTopic }) {
  const [current, setCurrent] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = topic.slides[current];
  function choose(direction: number) {
    setCurrent((previous) => (previous + direction + topic.slides.length) % topic.slides.length);
    setInteracted(true);
  }

  return <div className="editorial-material-study">
    <div className="editorial-image-card editorial-image-card--left" role="group" aria-roledescription="Karussell" aria-label="Tuch & Farbe"
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
        {topic.slides.map((item, index) => <Image key={item.id} src={item.image} width={item.imageWidth ?? 1536} height={item.imageHeight ?? 1024}
          sizes={item.imageWidth ? "(max-width: 760px) 250vw, (max-width: 1000px) 185vw, 95vw" : "(max-width: 760px) 100vw, 90vw"}
          quality={item.imageWidth ? 90 : 75} data-panoramic={item.imageWidth ? true : undefined}
          alt={item.alt} hidden={index !== current}
          className={interacted && index === current ? "editorial-study-media__entering" : undefined} />)}
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
    <p className="editorial-small editorial-material-note">{topic.note}</p>
  </div>;
}
