"use client";

import { useEffect, useRef, useState } from "react";

export function FooterWordmark() {
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const [isIlluminated, setIsIlluminated] = useState(false);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      !wordmark ||
      reducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      setIsIlluminated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsIlluminated(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.25
      }
    );

    observer.observe(wordmark);

    return () => observer.disconnect();
  }, []);

  return (
    <p
      aria-hidden="true"
      className="site-footer__brand"
      data-illuminated={isIlluminated}
      data-label="LICHTSAUM"
      ref={wordmarkRef}
    >
      LICHTSAUM
    </p>
  );
}
