# Canonical Stitch screen audit

Status: `Verified`  
Reviewed: 2026-07-30

- Project: `13581496807405121738`
- Screen: `12ee44ad855e416db92641282c2f7629`
- Reference: `stitch-12ee44ad855e416db92641282c2f7629-2026-07-30.png`
- Export inspected: `../exports/stitch-12ee44ad855e416db92641282c2f7629-2026-07-30.html`
- Reference dimensions: 2560 × 11712 px, desktop

## Verdict

The screen is a strong visual reference but not a production implementation. Its reusable
qualities are the restrained charcoal layers, sharp geometry, large display type, orange used as
a signal, editorial asymmetry, hairline separators and generous negative space. Its information
architecture, assets, claims, interaction model and responsive CSS are not suitable for direct
reuse.

## Composition to preserve

1. Fixed dark navigation with wordmark left and one orange primary action right.
2. Full-viewport hero with an oversized uppercase statement, one orange phrase and deliberate
   negative space.
3. Alternating 8/4 and 5/7 editorial grids instead of uniform card rows.
4. Numbered technical plates, compact mono labels and quiet hairline structure.
5. Tonal depth rather than shadows or rounded floating surfaces.
6. Strong scale changes followed by calmer reading sections and a sparse footer.

`DESIGN.md` remains authoritative for the implemented tokens: Hanken Grotesk, JetBrains Mono,
`#131313`/`#0F0F0F`/tonal surfaces, off-white text and `#FF5C00`.

## Required LICHTSAUM adaptation

- Replace the generic premium-awning/new-system story with the exact B2B retrofit category:
  illuminated replacement valance for a compatible existing commercial awning.
- Lead with restaurants and cafés; do not dilute the initial page with residential or unrelated
  pergola imagery.
- Make `Projekt prüfen lassen` the consistent primary CTA and describe it as manual suitability
  review, not an offer, delivery promise or confirmed lead.
- Replace invented specifications, worldwide projects, branding plaques and case names with
  compatibility inputs, stop factors, project boundaries and explicit `TBD` evidence states.
- Keep a public price number absent until the real delivery chain and cost model are confirmed.
- Label every generated image as a concept visualisation and never present it as a completed
  project.

## Prototype risks found and resolved in implementation

- Missing semantic navigation, skip link, main landmark, real form labels and focus treatment.
- Hover-only information, dead `href="#"` links and non-keyboard card interactions.
- Desktop-only header assumptions and fixed image/gallery heights.
- Fixed/parallax hero behavior that breaks full-page capture and is fragile on mobile.
- Small CTA targets, low-opacity footer text and unverified contrast.
- Long German compounds without a responsive wrapping strategy.
- External fonts, inaccessible CSS-background image semantics and missing alt text.
- Mixed Russian/English `lang`, heading-level gaps and JavaScript-dependent reveal content.
- Unverified product, engineering, geography, case, response-time and contact claims.

## Evidence limit

This audit validates the exact Stitch export as a visual/structural source. Compatibility,
keyboard behavior, responsive layout, contrast and indexing behavior are verified separately
against the coded prototype and recorded in `../../design-qa.md`.
