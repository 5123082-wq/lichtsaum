# LICHTSAUM landing design QA

Date: 2026-07-30  
Scope: local responsive landing and project-check journey  
Reference: `DesignPrototip/references/stitch-12ee44ad855e416db92641282c2f7629-2026-07-30.png`

## Comparison inputs

- Canonical Stitch reference: 2560 × 11712 px desktop export.
- Normalized hero reference: `artifacts/qa/reference-desktop-hero-normalized.jpg`, 1440 × 960 px.
- Final implementation hero: `artifacts/qa/final-desktop-1440-hero.jpg`, 1440 × 960 px at 1×
  browser density.
- Same-input hero comparison: `artifacts/qa/final-comparison-desktop.jpg`, reference left and
  implementation right.
- Focused implementation review: `artifacts/qa/final-desktop-contact-sheet.jpg`, six 1440 × 960 px
  viewport captures covering hero, transformation, compatibility, variants, cost and form.
- Responsive review: `artifacts/qa/final-responsive-contact-sheet.jpg`, captures at 320, 390, 768,
  1024, 1280, 1440 and 1920 px.
- Motion review: `artifacts/qa/hero-scroll-day.jpg`,
  `artifacts/qa/hero-scroll-transition.jpg`, `artifacts/qa/hero-scroll-night.jpg` and
  `artifacts/qa/hero-scroll-cover.jpg`; static mobile fallback:
  `artifacts/qa/parallax-mobile-static.jpg`.

## Current Eignung merge — 2026-08-01

- The former `#retrofit` and `#eignung` sections are now one `#eignung` block. It preserves the
  approved architectural dark surface, hairline rules, mono indices and orange CTA while reducing
  duplicate compatibility copy.
- The `EIGNUNG` eyebrow uses the same compact decorative marker loop and heading rhythm as
  `Engineered Precision`: eyebrow, display title, then concise introduction. The loop does not
  frame the title itself.
- The display title is now the concise two-line `Konstruktion prüfen. Volant erneuern.`; the
  left review step includes `Befestigung` to match the detailed right-hand explanation.
- The three cards retain the owner-approved order `Was wir prüfen`, `Was sich ändert`,
  `Was bleibt`. The redundant local sequence, button and first-review input row were removed so
  the section ends with the three cards.
- On desktop, the left sequence and the three right-hand cards now share one bounded grid: their
  outer rules align, the left rows divide the full height evenly, and every card reserves the same
  heading band before its body copy begins.
- The right-hand cards keep a consistent one-rem gap between the display heading and its body copy;
  the body-copy baseline remains aligned across all three cards.
- The numbered progression remains only on the left; the right-hand cards are explanatory labels,
  not steps, so their duplicate indices were removed.
- The final left sequence item has no local bottom divider; the single bottom rule belongs to the
  shared outer grid frame.
- Desktop evidence: `artifacts/design-qa/eignung-merged-desktop-1280.png`, captured at 1280 × 720
  px. Responsive overflow verification passed at 320, 390, 768, 1024, 1280, 1440 and 1920 px.
- Earlier screenshots and notes that mention the compact `RETROFIT` loop are historical evidence
  of the superseded section; the current compact treatment belongs only to `EIGNUNG`.

The reference and implementation hero were placed in one comparison image before judging visible
differences. The reference crop was normalized to the implementation viewport; it was not treated
as a pixel-identical clone because the owner required a different product, audience, CTA and
information architecture.

## Preserved visual character

- Near-black architectural base with tonal rather than shadow-based depth.
- Oversized uppercase Hanken Grotesk display type with one orange signal phrase.
- JetBrains Mono for compact system labels, indices and actions.
- Square controls and cards, hairline separators, sparse navigation and a single orange primary
  action.
- Editorial 8/4 and 5/7 compositions, large breathing room and intentionally uneven section
  rhythm.
- Photography used as a large compositional field, with generated imagery visibly labelled as
  concept material.

## Intentional differences

- The hero and all content describe the exact B2B retrofit category rather than generic premium
  awnings.
- Restaurant/café context replaces residential/pergola imagery.
- A functional CTA, compatibility logic, limitations, evidence status, FAQ and accessible form
  replace dead links, fabricated specifications and unverified projects.
- Mobile uses a two-row, horizontally scrollable navigation rather than hiding the primary journey.
- Section heights and type scale are fluid rather than copied as fixed desktop dimensions.

## Comparison history

| Severity | Finding | Resolution | Recheck |
| --- | --- | --- | --- |
| P1 | Initial mobile header placed brand, navigation and CTA on three rows | Brand and CTA share row one; scrollable navigation occupies row two | 320 and 390 px captures passed |
| P1 | Footer decorative wordmark failed automated contrast | Raised the tonal value while retaining the quiet architectural treatment | axe WCAG A/AA passed |
| P1 | Four alternative cards overflowed at 1024 px | Kept two columns until 1440 px and added safe German wrapping | 1024 px overflow check passed |
| P2 | `Nachrüstung` split mid-word in the desktop compatibility heading | Added a smaller split-layout display scale and normal word wrapping | Focused 1440 px capture passed |
| P2 | `Bestehenden` split mid-word at 320 px | Added a compact minimum-width hero scale | 320 px capture and overflow check passed |
| P2 | The first implementation preserved the Stitch hero composition but not its full scroll narrative | Added a sticky desktop scene with aligned day/night crossfade, illuminated-volant reveal, media translation and opaque next-section coverage; native scroll timelines have a small browser fallback | Day, transition, night, overlap, mobile and reduced-motion checks passed |
| P2 | Full-page browser capture repeated the fixed header while tiling | Rejected the faulty capture as evidence and used normalized same-viewport plus focused section captures | Comparison evidence replaced |

## Functional and accessibility review

- Semantic `lang="de"`, skip link, one banner, main landmark, content info and ordered heading
  hierarchy are present.
- All navigation targets resolve to real sections and the primary CTA reaches the form.
- Form labels, required/optional text, autocomplete, descriptions, field errors, error summary,
  focus movement and live result state are wired.
- Empty submission exposes eight linked validation errors.
- Complete synthetic input reaches only `prototype_validated` and explicitly states that nothing
  was stored or sent.
- Reduced motion, keyboard focus, 44 px-class targets, alt text and no page-level horizontal
  overflow were checked.
- Automated axe WCAG 2.2 A/AA scan reported no detectable violations.

## Technical checks

- `pnpm typecheck`: passed
- `pnpm lint`: passed
- `pnpm test:unit`: 7/7 passed
- `pnpm test:e2e`: 19/19 passed
- `pnpm build`: passed; all routes statically prerendered
- Local indexing boundary: `noindex`, `X-Robots-Tag`, disallowing `robots.txt`, no canonical,
  sitemap or JSON-LD

## Remaining release boundaries

This QA covers the local prototype, not production readiness. Real product evidence, service scope,
price, legal identity, privacy text, image approval, CRM/email, lead persistence, rate limiting,
consent, analytics and production indexing remain blocked until their source decisions and release
gates pass.

## Transformation grid correction — 2026-07-30

Status: `Superseded` by the owner-directed single-card comparison below.

- Source visual truth: Google Stitch project `13581496807405121738`, screen
  `12ee44ad855e416db92641282c2f7629`, 2560 × 11712 px; source HTML retrieved through Stitch MCP.
- Focused references: `/Users/macbookaleks/Yandex.Disk.localized/Скриншоты/2026-07-30_20-06-50.jpg`
  and `/Users/macbookaleks/Yandex.Disk.localized/Скриншоты/2026-07-30_20-07-08.jpg`, both
  2048 × 1026 px.
- Final implementation evidence:
  `artifacts/design-qa/transformation-stitch-exact.png`, 1159 × 863 px at 1× browser density.
- Stitch layout contract reproduced directly from its HTML: 12-column grid, 32 px row/column gap,
  desktop spans 8/4/12, media ratios 21:9 / 4:5 / 21:7, with all three items using the same grid
  flow rather than custom vertical margins.
- Comparison history: the first pass added invented 10–14 rem spacing and non-source aspect ratios
  (P1); the correction removed those values and restored the exact Stitch grid and ratios. Final
  geometry confirms aligned first-row tops and a 32 px gap from the taller right item to the wide
  lower item.
- Typography, dark/orange tokens and concept labelling remain consistent with the existing
  LICHTSAUM design system. The generated lower image is a real optimized WebP asset rather than a
  placeholder. Copy remains German and explicitly identifies concept imagery.
- Browser scroll/navigation was exercised, no page-level overflow was found at 320, 390, 768,
  1024, 1280, 1440 or 1920 px, and the focused section had no runtime console errors.

## Transformation comparison revision — 2026-07-30

- The owner selected the supplied night concept image as the only image in the vertical
  `Caféterrasse` card. The existing 21:9 day card and 21:7 panorama remain in place.
- The Stitch gallery contract remains exact: 12 desktop columns, a 32 px gap and spans 8/4/12.
- Each image has one short title line only: `Fassadenansicht`, `Caféterrasse` and
  `Straßenansicht`. The former explanatory paragraph beneath the vertical card was removed.
- The 1086 × 1448 night PNG is retained as the recorded source and used through its exact
  1080 × 1350 WebP derivative. The single image is monochrome by default and restores its original
  colour, including the warm illuminated lettering, on hover.
- The image surface is a real button: focus reveals colour for keyboard users, while activation
  pins or restores the colour state for keyboard and touch users. `aria-pressed` and the accessible
  label expose the current action. Reduced motion shortens the filter transition.
- Focused Playwright coverage verifies all three cards and their 21:9 / 4:5 / 21:7 ratios, the
  absence of the retired slider, the single night image, hover, keyboard activation and accessible
  state.
  Axe WCAG A/AA and page-overflow checks pass at 320, 390, 768, 1024, 1280, 1440 and 1920 px.
- Both images remain explicitly labelled as concept visualisations and are not customer-project or
  performance evidence. Production/public usage rights remain `TBD`.

## Calculator visual concept — 2026-07-31

- Scope was limited to the existing `Kosten` section. Hero, principles, transformation and all
  other landing sections remained unchanged.
- Source visual target: the established LICHTSAUM dark editorial system documented above, with a
  large real concept image, square controls, hairline borders, mono system labels and one orange
  action. No fabricated diagram, price or performance claim was introduced.
- The implementation was inspected in the local in-app browser at 1280 × 720 px in both the first
  and second visual-direction states. The preview, direction tabs, field-count buttons and width
  input all changed state as intended.
- The active direction is communicated with `aria-pressed` and visible `Aktiv` text, not colour
  alone. The cost result remains an explicit dash with `Ohne Berechnung`; no formula or pseudo-price
  is present.
- The inspected viewport had no horizontal overflow and the browser console contained no runtime
  errors attributable to the calculator. Responsive stacking is defined at the existing 48 rem and
  64 rem project breakpoints.
- `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` and `pnpm build` passed. Price logic and
  project-data transfer intentionally remain outside this visual-only iteration.

## Engineered Precision interaction — 2026-07-31

- Source visual truth:
  `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-6377dda4-647f-4cd6-af25-84656edfab0d.png`,
  3024 × 1498 px. It defines the desktop 5/7 editorial split, left-side technical narrative and
  right-side drawing surface; its Russian copy, CHISEL branding and unverified material/mechanical
  claims are reference-only.
- Final implementation evidence:
  `artifacts/design-qa/engineered-precision-section-1512.png`, 1319 × 857 px content crop assembled
  from two overlapping 1512 × 839 px in-app-browser captures at 1× density. State: `Lichtbild`
  active. The overlap was matched against the same page state before stitching; fixed browser chrome
  is excluded.
- Normalized full-view comparison:
  `artifacts/design-qa/engineered-precision-comparison.png`, 2870 × 852 px. Both source and
  implementation were normalized to an 800 px content height and placed in one comparison input.
  The source is wider, so the comparison judges composition and hierarchy rather than false
  pixel-level equality.
- Focused evidence:
  `artifacts/design-qa/engineered-precision-desktop-heading.png` and
  `artifacts/design-qa/engineered-precision-desktop-controls.png`, each 1512 × 839 px. These make
  typography, active controls, image crop, caption and object-specific connection note legible.
- Fonts and typography: Hanken Grotesk retains the reference's heavy architectural display scale;
  JetBrains Mono carries eyebrow, index and state labels. The final heading keeps `ENGINEERED` and
  `PRECISION` on two deliberate lines without mid-word wrapping.
- Spacing and layout: the desktop 5/7 split, central rule, large quiet fields and three horizontal
  controls preserve the source hierarchy. Mobile uses a single-column flow and a 4:3 visual crop;
  the technical image returns to 8:5 from 48 rem upward.
- Colours and tokens: only the established near-black tonal surfaces, off-white text, hairline
  borders and restrained orange active signal are used. There are no new gradients or shadows.
- Image quality: `Lichtbild` uses the recorded 1672 × 941 CAD-hybrid concept. `Gestaltung` and
  `Aufmaß` use dedicated 1586 × 992 raster concepts and optimized 65 KB / 55 KB WebP derivatives.
  All are explicitly labelled `Schema / Konzept`; no HTML, CSS or handcrafted SVG drawing replaces
  a visible asset.
- The current `Aufmaß` asset is a new geometry-first front/isometric technical drawing with
  restrained colour. The owner-defined semantics are explicit in drawing and alt text: A is width,
  B measures only the fabric valance between the profile underside and its lower edge, and C is
  absent. Connection and cable routing remain excluded from the drawing.
- Copy and claims: visible copy is German. No wind class, material, performance, mounting,
  electrical or universal-fit statement is made. `Anschluss und Kabelweg` are explicitly excluded
  from the drawings and remain object-specific.
- Interaction and accessibility: all three controls update their image, alt text, caption and
  visible `Aktiv` state. Each exposes `aria-pressed`; the selected state is not colour-only. The
  active 1512 px viewport has no horizontal overflow and no runtime console errors.
- Comparison history: the first desktop pass split `ENGINEERED` and `PRECISION` inside the words
  (P1). The display scale was reduced and each word received a deliberate non-breaking line; the
  post-fix combined comparison shows both words intact. A potential small-screen overcrop from a
  fixed 20 rem media height (P2) was removed; mobile now uses its aspect ratio without a forced
  minimum height.
- `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` and `pnpm build` passed. Production/public image
  rights and any future technical assertions remain `TBD`.

## Marker-loop design-system adoption — 2026-07-31

Status: superseded by the owner-approved dual application below. The earlier evidence captured the
compact `RETROFIT` treatment before the slogan was converted from an image to HTML.

- Source visual truth:
  `/Users/macbookaleks/Downloads/Red Marker Scribble Circle, Marker Circle, Red Scribble, Highlight Shape PNG Transparent Image and Clipart for Free Download.jpg`,
  768 × 768 px. The unknown-license stock image defines gesture only and is not shipped.
- Implementation evidence: `artifacts/design-qa/marker-loop-desktop-1440.png`, 1440 × 1024 px at
  1× browser density, and `artifacts/design-qa/marker-loop-mobile-320.png`, 320 × 800 px at 1×.
  State: the `#retrofit` section in the default dark theme.
- Same-input comparison: `artifacts/design-qa/marker-loop-reference-vs-implementation.png`,
  1440 × 720 px. The reference and 1440 px implementation are normalized into equal 720 px
  panels. Because the source is an isolated gesture rather than a page mock, the comparison judges
  the marker form and its integration, not false pixel-level page equality.
- Full-view evidence: the desktop capture confirms that the compact marker remains subordinate to
  the section heading and does not disturb the existing three-column scope grid. The 320 px capture
  confirms normal text reflow and no page-level horizontal overflow.
- Focused evidence: the marker around `RETROFIT` preserves three imperfect passes, the right-side
  crossing and loose tail. It stays fully visible at 320 px with an estimated visual left edge of
  8 px.
- Fonts and typography: the accessible label remains JetBrains Mono and the H2 remains Hanken
  Grotesk. Neither the label nor heading was converted into an image.
- Spacing and layout rhythm: the opt-in treatment adds a deliberate pause above the H2 without
  changing section, card or photography geometry. Existing mobile and desktop gutters remain the
  governing layout system.
- Colours and tokens: the new `marker-loop` token is `#A33A31`; action and focus continue to use
  `architectural-orange` (`#FF5C00`).
- Image quality and asset fidelity: the shipped 640 × 320 transparent PNG is an original generated
  mask. CSS supplies the token colour, so no chroma fringe or stock watermark is visible.
- Copy and semantics: public German copy is unchanged. The marker is a decorative pseudo-element;
  the `Retrofit` paragraph and the H2 remain unchanged in the accessibility tree.
- Runtime verification: 320, 390 and 1440 px captures have no horizontal overflow. The mask URL
  resolves in computed styles, and the inspected page reported no runtime console warnings or
  errors attributable to the change.
- Comparison history: the first production pass already had no actionable P0/P1/P2 mismatch. The
  restrained line weight is intentional at section-label scale; the heavier stock-reference stroke
  would compete with the headline.
- Remaining P3: future large statement usage needs a separate responsive size treatment before it
  is enabled. It is documented but not implemented speculatively.

## Final result

passed

## Kontakt Europe atlas — 2026-08-04

### Comparison inputs

- Source visual truth:
  `/Users/macbookaleks/.codex/generated_images/019fcd8e-bc17-7cd1-a0d3-72c0c7cd8ace/exec-39af9104-fce5-48ea-aa1f-9cd83375a119.png`.
  A retained project copy is
  `artifacts/design-qa/contact-atlas/source-option-1-1487x1058.png`.
- Browser-rendered implementation:
  `artifacts/design-qa/contact-atlas/implementation-1487x1058.png`, captured from
  `http://127.0.0.1:3000/kontakt` in the Codex in-app browser.
- Full-view same-input comparison:
  `artifacts/design-qa/contact-atlas/comparison-source-left-implementation-right.png`, with the
  source on the left and implementation on the right.
- Focused copy/typography comparison:
  `artifacts/design-qa/contact-atlas/comparison-focus-copy.png`.
- Focused map/Germany/Berlin comparison:
  `artifacts/design-qa/contact-atlas/comparison-focus-map.png`.
- Responsive implementation evidence:
  `artifacts/design-qa/contact-atlas/implementation-mobile-390x844.png`.

### Normalization and state

- Source pixels: 1487 × 1058.
- Desktop implementation pixels and CSS viewport: 1487 × 1058 at 1× browser density.
- Mobile implementation pixels and CSS viewport: 390 × 844 at 1× browser density.
- No density downsampling or stretching was used. The comparison combines equal desktop pixel
  dimensions with a 32 px neutral separator.
- State: dark theme, `/kontakt`, closed desktop/mobile navigation, page at scroll position 0,
  contact CTA idle, map reveal animation complete.
- The small circular Next.js development control visible at the lower left of local captures is a
  development-only browser overlay and is excluded from visual fidelity findings.

### Findings

- No actionable P0, P1 or P2 findings remain.
- Typography: the final display heading uses the established LICHTSAUM sans family, weight and
  tight uppercase spacing at a scale matching the reference hierarchy. Mono eyebrows, field labels
  and CTAs preserve the source's technical rhythm without truncation.
- Spacing and layout rhythm: the implementation preserves the reference split between a quiet
  left content field and the dominant cartographic layer. Existing project gutters are retained;
  the extra verified telephone number and quiet `Impressum` link extend the content block without
  creating a card, overlap or desktop/mobile overflow.
- Colors and tokens: the near-black background, low-contrast country field, single brighter Germany
  fill and architectural orange marker/CTA follow the selected direction. Mobile deliberately
  reduces the map to 0.48 opacity for text contrast.
- Image quality and asset fidelity: the production asset is a local 1:10m vector map derived from
  Natural Earth `Admin 0 – Countries`, not the generated reference's approximate borders. It
  contains 35 country paths, exactly one Germany path, no internal administrative lines and one
  Berlin label/marker. Germany is therefore one uniform fill as explicitly requested by the owner.
- Copy/content: the final copy remains concise and uses only owner-confirmed e-mail and telephone
  data. Berlin is described as the starting point, not as a delivery or service-area claim. The
  street address stays in `Impressum`.
- Icons and decorative marks: no unrelated icons or target/crosshair motif were introduced. The
  Berlin treatment is a simple orange tab, line and point as requested.
- Responsiveness/accessibility: no horizontal overflow occurs at the checked 1487 and 390 px
  viewports; the mobile Berlin label remains inside the frame; the CTA is 44 px high; semantic
  heading, region, figure description, contact terms/definitions and ordinary crawlable links are
  present. Reduced motion disables the atlas reveal.

### Intentional differences from the generated reference

- The generated source visually merges or mis-colors neighboring country areas around Germany.
  The implementation replaces that cartographic artifact with accurate Natural Earth geometry and
  highlights Germany only, per the owner's explicit correction.
- The implementation includes the second owner-confirmed telephone number, a quiet link to exact
  provider details and a small Natural Earth source credit. These are factual/product constraints,
  not unverified marketing additions.

### Comparison history

| Severity | Earlier finding | Fix | Post-fix evidence |
| --- | --- | --- | --- |
| P2 | Initial desktop heading scale was materially larger than the selected reference hierarchy. | Reduced the contact H1 from `clamp(4rem, 7.5vw, 6.75rem)` to `clamp(4rem, 5vw, 5rem)`. | Final full-view and focused copy comparisons show the corrected hierarchy. |
| P2 | At 390 px, the Berlin tab was clipped at the right edge. | Shifted the mobile atlas crop from 72% to 80% horizontal position. | `implementation-mobile-390x844.png` shows the complete `BERLIN` tab, line and point. |
| P2 | The reveal keyframe forced the desktop 0.96 opacity after animation on mobile, defeating the intended 0.48 mobile treatment. | Introduced `--contact-atlas-opacity` and animated to the responsive variable value. | Browser-computed final mobile opacity is 0.48 and the saved mobile capture retains readable foreground copy. |

### Functional and technical checks

- Primary CTA: the unique contact-scene `Projekt prüfen lassen` link was activated and reached
  `/#projekt-pruefen`.
- Console: no application error entries. The final local run exposed Next.js's
  `missing-data-scroll-behavior` framework warning; `data-scroll-behavior="smooth"` was added to
  the root `<html>` element and its rendered presence was verified from the live `/kontakt` HTML.
- `pnpm test`: 32/32 passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed after rerunning outside the restricted sandbox so Turbopack could bind its
  internal local PostCSS worker port; `/kontakt` is statically prerendered.

### Implementation checklist

- [x] Accurate local vector country map with recorded public-domain source.
- [x] Germany rendered once with one uniform fill and no internal subdivisions.
- [x] Berlin rendered as a simple tab marker without target imagery.
- [x] Verified contacts, project-check CTA and provider-details link retained.
- [x] Desktop/mobile visual comparison, interaction, overflow, console and build checks passed.

final result: passed

## References gallery concept review — 2026-08-04

- Four independent built-in image-generation runs produced one temporary visual for each gallery
  slot: left tall restaurant facade, centre-top entrance detail, centre-bottom terrace and right
  tall corner location after rain. Original PNGs, optimized WebP derivatives and the exact prompt
  ledger are stored under `DesignPrototip/assets/` and `public/images/referenzen/`.
- Desktop evidence:
  `artifacts/design-qa/references-concept-desktop-1440.png` (1440 × 1228 px) and
  `artifacts/design-qa/references-concept-desktop-hover-1440.png` (1440 × 1228 px). The final
  layout follows the Stitch 3 × 2 composition: two high outer cards and two stacked centre cards;
  the hover capture confirms image zoom, dimming and the lower caption reveal.
- Mobile evidence: `artifacts/design-qa/references-concept-mobile-390.png` (390 × 1921 px). Cards
  become one column without page overflow; tablet keeps the documented two-column intermediate
  layout.
- Dialog evidence: `artifacts/design-qa/references-concept-modal-desktop-1440.png`
  (1440 × 1200 px). Close, Previous/Next, Escape, keyboard arrows, native focus containment and
  focus restoration are covered by component/E2E checks; the homepage URL stays unchanged.
- Disclosure is persistent rather than hover-dependent: every card says `Konzeptvisualisierung`,
  the section and `/referenzen` introduction identify the set as AI-generated, and every caption
  states that it is not a completed LICHTSAUM project. Concept items are constrained to
  `review-only`; they cannot satisfy the `published` registry contract.
- Fine pointers get the intended hover/focus reveal. Touch keeps the overlay available without
  hover, while `prefers-reduced-motion` removes zoom and translated movement.
- A mobile `min-height`/aspect-ratio conflict found during visual review was corrected. Automated
  responsive checks now pass at 320, 390, 768, 1024, 1280, 1440 and 1920 px.
- Technical verification: `pnpm typecheck`, `pnpm lint`, 27 unit/component tests, all 32 Playwright
  tests, Axe WCAG 2.2 A/AA checks and the production build pass. A temporary production server
  returned `200` for `/`, `404` for `/referenzen`, and emitted none of the gallery-specific concept
  ids or copy on the production homepage. The shared local server remained available on port 3000.
- Final crop and focal-point review is deliberately repeated after the four concept images are
  replaced with original, rights-cleared photographs from real completed projects.

## Final result

passed

## Compact controls and text cell revision — 2026-08-04

- Source visual truth: the owner's three browser comments at the `#konfigurator` desktop viewport
  (1159 × 863 CSS px): remove the separate `Schriftvorschau`; make the closed `Komposition` control
  align to the physical-size fields; and turn `Text auf dem Volant` into a boxed cell instead of an
  underline. The comment screenshots are the requested behavioural target, not a replacement for
  the existing LICHTSAUM visual system.
- Before/after focused evidence:
  `artifacts/design-qa/mini-configurator-compact-controls/comparison-before-left-after-right-1159x863.jpg`.
  The left panel is the immediately preceding 1159 × 863 implementation state; the right panel is
  the revised state. It isolates the exact visual changes requested by the owner.
- Final implementation evidence:
  `artifacts/design-qa/mini-configurator-compact-controls/implementation-desktop-text-cell-1159x863.jpg`
  at 1159 × 863 CSS px and 1× density, plus
  `artifacts/design-qa/mini-configurator-compact-controls/implementation-mobile-text-cell-390x844.jpg`
  at 390 × 844 CSS px and 1× density. Both captures use the closed composition state.
- Typography: the redundant font sample is absent. The selected font remains represented by the
  live SVG inscription, while the selector keeps its compact label and direction.
- Spacing and layout: the closed composition trigger, the text field and the numeric inputs each
  measure 54 CSS px high. On mobile, the text and composition cells both occupy the available 358
  CSS px width with no horizontal overflow.
- Colours and tokens: the new text cell uses `--surface` (`rgb(32, 31, 31)`), while numeric fields
  retain `--surface-low` (`rgb(28, 27, 27)`). This creates the requested distinction without
  introducing a new visual token.
- Image/assets and copy: no image, icon or product copy changed. The compact closed trigger keeps
  only the schematic placement diagram and the selected label; all three explanatory sentences
  remain in the open composition listbox.
- Interaction and runtime: keyboard Arrow Down opens the listbox with all three descriptions;
  the fresh desktop browser run reported no warnings or errors. Strict TypeScript, lint and 18 unit
  tests pass. No actionable P0/P1/P2 finding remains.

## Final result

passed

## Homepage LICHTSAUM STUDIO mini-configurator — 2026-08-04

- Source visual truth: the saved Google Stitch module in
  `DesignPrototip/stitch_premium_awning_website_prototype/code.html`, specifically its
  `LICHTSAUM STUDIO` section. The exported `screen.png` contains only the recorded Stitch fetch
  failure, so the source HTML was rendered locally rather than treated as an image.
- Source evidence: `artifacts/design-qa/configurator-stitch-source-clean-1440.png`
  (1440 × 1388 px) and `artifacts/design-qa/configurator-stitch-source-clean-390.png`
  (390 × 1625 px), both at 1× browser density with the unrelated fixed navigation hidden.
- Implementation evidence: `artifacts/design-qa/configurator-implementation-clean-1440.png`
  (1440 × 1841 px) and `artifacts/design-qa/configurator-implementation-clean-390.png`
  (390 × 2422 px), both at 1× density with the unrelated fixed site header hidden.
- Same-input comparisons: `artifacts/design-qa/configurator-comparison-desktop.png` and
  `artifacts/design-qa/configurator-comparison-mobile.png`. Each pair places source left and
  implementation right at the same CSS viewport, state and 1× density. The desktop panels are
  downsampled equally to 720 px each; the mobile panels remain at their native 390 px width.
- State: `Wortmarke`, text `RESTAURANT NAME`, deep-black awning, warm-white light. The Stitch
  source has no day/night interaction; the implementation uses its default `Nacht` state and real
  physical values 3000 × 300 mm with 120 mm letters.
- Focused-region decision: the selected target is already one isolated page section, and the
  original-resolution source/implementation captures keep the preview, controls, status and CTA
  readable. No additional crop was needed; the paired full-section desktop and mobile evidence
  covers both the visual hierarchy and control detail.

### Required fidelity surfaces

- Fonts and typography: Hanken Grotesk retains the source's structural display hierarchy and
  JetBrains Mono retains the technical labels/actions. The implementation adds eight locally
  hosted OFL WOFF2 choices only inside the product preview; browser QA loaded every font and each
  returned the valid `ready` state.
- Spacing and layout rhythm: the source contract—wide visual field, three desktop control columns,
  hairline divisions, status and final action—is preserved. Mobile becomes one real column with no
  horizontal overflow. The implementation is intentionally taller because the accepted scope adds
  three physical measurements, font selection, labelled colour choices and day/night state.
- Colours and visual tokens: near-black surfaces, warm-white text, low-contrast rules and the
  architectural-orange focus/action signal map directly to the established LICHTSAUM tokens.
  Controls remain square with no shadow-based elevation.
- Image quality and asset fidelity: the fixed Stitch facade photograph is intentionally replaced by
  the owner-requested compact parametric front-view SVG. It shows only the physical valance,
  illumination and dimensions, without an upper canopy or any implication of a completed facade or
  customer project. The nested physical SVG
  remains sharp at every checked width and is not stretched to a decorative raster crop.
- Copy and content: `LICHTSAUM STUDIO`, `Wie könnte es an Ihrer Fassade aussehen?`, the two CTA
  labels and the ready-state wording follow the owner-confirmed German copy. No price, timing,
  compatibility, AI-render or production-approval claim was introduced.

### Comparison history

| Severity | Finding | Fix | Post-fix evidence |
| --- | --- | --- | --- |
| P2 | A 15 rem minimum preview height forced 427 px width and page overflow at 320/390 px | Removed the aspect-ratio-derived minimum and constrained preview width to its container | All seven responsive overflow checks pass from 320 to 1920 px; mobile comparison is 390 px wide |
| P2 | The nested physical SVG exposed a second `img` role inside the already labelled outer scene | Marked only the nested implementation SVG `aria-hidden`/unfocusable while keeping the outer SVG title, description and label | Focused interaction test resolves one accessible preview image; axe WCAG 2.2 A/AA passes |
| P1 | `min=1` plus `step=10` made normal values such as 320 mm fail native form validity and blocked continuation | Changed millimetre inputs to exact one-millimetre steps | Focused Playwright path saves the full version-1 state and shows the continuation confirmation |
| P2 | The dynamic disabled-to-ready CTA transition briefly passed through a low-contrast colour blend | Kept only the transform transition for this CTA so semantic colours switch atomically | Automated axe WCAG 2.2 A/AA reports no detectable violations |

Post-fix production-browser QA confirmed all eight fonts, both preview modes, explicit over-height
error, an empty error console and exact 1440 px document width. The focused interaction test,
seven responsive widths and two accessibility/landmark checks pass. No actionable P0/P1/P2 visual
or interaction finding remains. A possible P3 follow-up for the later full configurator is a
dedicated mobile preview zoom; the current mini-configurator remains legible and complete without
it.

## Final result

passed

## Marker-loop spacing correction — 2026-07-31

- Source visual truth:
  `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-92d329d7-d268-4188-a4d5-0a76b842e1da.png`,
  3010 × 1562 px, together with the owner's explicit correction: preserve all three photo
  positions, center the slogan against photo `01` and vertically between photos `01` and `03`,
  reduce the type and marker, keep the loop clear of the photos, and allow its left edge to pass
  outside the content boundary.
- Final desktop implementation evidence:
  `artifacts/design-qa/marker-loop-spacing-final-1505.png`, 1505 × 781 px at 1× browser density.
  Final mobile evidence: `artifacts/design-qa/marker-loop-spacing-mobile-390.png`, 390 × 844 px at
  1×. State: default monochrome gallery, slogan visible between the image rows.
- Same-input comparison:
  `artifacts/design-qa/marker-loop-spacing-comparison.png`, 3010 × 821 px. The source was
  normalized from 3010 × 1562 to 1505 × 781 and placed beside the equally sized implementation.
  Because the supplied screenshot and current browser rendering use different captured scroll
  positions, the comparison judges the requested slogan correction and unchanged code-level photo
  grid rather than false page-coordinate equality.
- Focused evidence was necessary because the issue concerns exact placement. At 1505 px the photo
  `01` and slogan-copy horizontal centres differ by less than 0.01 px. The slogan occupies the
  existing second grid row, with 32 px gaps above and below, and photo `02` still spans the original
  first and second rows. The existing 8/4/12 photo selectors and media ratios were not changed.
- Fonts and typography: semantic Caveat HTML remains at weight 400. Its desktop computed size is
  73.6 px, below the previous 80 px maximum; mobile is 38.4 px. The two lines remain left-aligned
  within a block centred on photo `01`.
- Spacing and layout: the slogan wrapper preserves the former content-derived row height through a
  matching fluid minimum block size, so reducing the internal treatment does not pull photo `03`
  upward or shorten photo `02`. The loop's desktop pseudo-element begins 6% left of the photo-01
  content edge and ends before photo `02`.
- Colours and tokens: the established `marker-loop` token remains unchanged. Only the decorative
  layer receives `0.8` opacity; text retains its original warm-white/orange colours.
- Image quality: no photo or marker asset was replaced. The existing real marker mask now renders
  at `100% 100%` instead of the cropped `120% 240%`, which exposes all three passes and materially
  reduces apparent stroke weight.
- Copy and semantics are unchanged. The marker remains a decorative pseudo-element outside the
  accessibility tree.
- Comparison history: the supplied before state cropped the loop at the left, top and bottom and
  let the heavy gesture dominate the copy (P1). The first correction removed mask overscaling,
  reduced and centred the copy, and preserved row height. The final pass shifted the compact loop
  farther left so its free edge can clear the content boundary while still ending before photo
  `02`. The post-fix desktop/mobile captures show no remaining actionable P0/P1/P2 mismatch.
- Browser verification found no page-level horizontal overflow at 320, 390, 768, 1024, 1280,
  1440 or 1920 px and no runtime warnings or errors in the inspected desktop/mobile states. The
  focused geometry test, lint, strict TypeScript, unit tests and production build pass.

## Final result

passed

## Dual marker-loop application — 2026-07-31

- Source visual truth: the owner-selected three-pass marker reference at
  `/Users/macbookaleks/Downloads/Red Marker Scribble Circle, Marker Circle, Red Scribble, Highlight Shape PNG Transparent Image and Clipart for Free Download.jpg` plus the owner's explicit copy,
  font and colour specification in the implementation task.
- Desktop evidence: `artifacts/design-qa/marker-loop-dual-desktop-1159.png` and
  `artifacts/design-qa/marker-loop-retrofit-desktop-1159.png`, both captured at 1159 × 863 px.
- Mobile evidence: `artifacts/design-qa/marker-loop-dual-mobile-390.png` and
  `artifacts/design-qa/marker-loop-retrofit-mobile-390.png`, both captured at 390 × 844 px.
- The transformation slogan is semantic HTML with the exact two-line copy. Computed typography is
  `Caveat Variable`, weight 400; the first line uses warm white and the second uses
  `architectural-orange`.
- The large oxide-red marker loop encloses both lines without entering photo `02`. The text block
  stays in its existing grid row, and the three photo elements keep their existing selectors and
  geometry rules.
- `RETROFIT` remains an uppercase JetBrains Mono HTML eyebrow and receives its own compact loop.
  The H2 and section copy are unchanged.
- At both checked widths, `documentElement.scrollWidth === clientWidth`; neither treatment creates
  horizontal page overflow. Both loops are decorative pseudo-elements and stay outside the
  accessibility tree.
- `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` and `pnpm build` pass. The focused Playwright run
  adds seven overflow widths from 320 through 1920 px and two WCAG/landmark checks; all nine pass.

## Final result

passed

## Owner-selected Retrofit marker variant — 2026-07-31

- Source visual truth:
  `/Users/macbookaleks/.codex/generated_images/019fb830-15d3-7c42-bfe6-14ec03f0e5da/exec-c5dd7cff-4d7f-4753-b538-ccda347ef638.png`,
  1536 × 1024 px. The owner selected this exact attached generated preview rather than relying on
  its ordinal position in the earlier ideation set.
- Final desktop implementation evidence:
  `artifacts/design-qa/marker-loop-selected-final-1505.png`, 1505 × 781 px at 1× browser density.
  Final mobile evidence: `artifacts/design-qa/marker-loop-selected-mobile-390.png`, 390 × 844 px at
  1×. State: default monochrome gallery at `#wirkung`.
- Same-input focused comparison:
  `artifacts/design-qa/marker-loop-selected-comparison.png`, 1800 × 658 px. The source left-side
  concept region and implementation right-side region were cropped around photo/rectangle `01` and
  the slogan, then normalized to equal 900 × 618 panels. The generated preview uses abstract
  placeholders, while production retains the existing real photographs and exact 8/4/12 grid.
- Fonts and typography: the semantic Caveat HTML remains weight 400 and grows by exactly 20% on
  tablet/desktop, reaching 88.32 px at the inspected 1505 px viewport. The two-line block remains
  centred on photo `01`; the measured horizontal-centre difference is below 0.01 px. Mobile keeps
  the accepted compact 38.4 px scale to avoid overflow.
- Spacing and layout: the slogan remains in the existing second grid row, so photos `01`, `02` and
  `03` keep their selectors, dimensions and positions. The marker width remains 96% of the photo-01
  track. Only its desktop height changes, using a 1.6× pseudo-element box and a dedicated tall mask.
- Colours and visual tokens remain unchanged: warm-white first line, architectural-orange second
  line and the established oxide-red marker token at 0.8 opacity.
- Image quality and asset fidelity: the final pass reuses the exact base mask from the `RETROFIT`
  eyebrow (`public/images/lichtsaum-marker-loop-mask.png`) for the slogan as requested. The desktop
  pseudo-element is now 20% larger in both dimensions while its centre, marker gesture and stroke
  source stay aligned with `RETROFIT`, without replacing the accessible HTML text.
- Copy and semantics are unchanged. The decorative marker remains outside the accessibility tree.
- Responsive and runtime evidence: the focused geometry test and all seven overflow widths from
  320 through 1920 px pass. Desktop and mobile inspection found no runtime errors. Direct hash
  navigation produced the existing Next.js development-only LCP suggestion for photo `03`; it is
  unrelated to this marker treatment and does not occur as a new code error.
- `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, the eight focused/responsive Playwright checks and
  `pnpm build` pass.

## Final result

passed

## Owner revision — marker size +20% — 2026-07-31

- The desktop slogan keeps the exact `RETROFIT` mask and grows its pseudo-element from 96% to
  115.2% width and from 1.6× to 1.92× slogan height, centred on the same anchor.
- The photo grid, HTML copy and mobile treatment are unchanged.
- The slogan container explicitly keeps overflow visible, so the enlarged loop may leave the
  content column and lightly overlap the photos without being clipped.
- Lint and strict TypeScript checks pass; a fresh browser screenshot/overflow pass remains to be
  captured after this latest owner revision.

## Final result

pending browser verification

## Hero LICHTSAUM focal-point alignment — 2026-08-03

- Source visual truth: the owner-approved aligned hero pair
  `public/images/lichtsaum-concept-cad-awning-off.webp` and
  `public/images/lichtsaum-concept-cad-awning-on.webp`, both 1672 × 941 px, plus the owner browser
  annotation at a 393 × 852 px viewport requiring the embedded `LICHTSAUM` lettering to remain
  horizontally centred at every responsive width.
- Implementation evidence: `artifacts/design-qa/hero-focal-mobile-393x852.png`, 393 × 852 px at
  1× browser density, and `artifacts/design-qa/hero-focal-desktop-1440x900.png`, 1440 × 900 px at
  1×. State: hero at the top of the page; the mobile capture shows the static day image and the
  desktop capture shows the initial day state.
- Same-input full-view comparison:
  `artifacts/design-qa/hero-focal-mobile-comparison.png`, 810 × 896 px. The left panel is the
  mathematically normalized 393 × 852 target crop from the source image; the right panel is the
  browser-rendered 393 × 852 implementation with the existing header, overlay and semantic H1.
- Focused comparison: `artifacts/design-qa/hero-focal-mobile-word-comparison.png`, 810 × 200 px,
  isolates the embedded word in both panels and confirms that its centre shares the viewport centre.
- Fonts and typography: no typography changed. The embedded word remains part of the raster asset;
  the existing Hanken Grotesk H1 and JetBrains Mono navigation retain their prior sizes and wrapping.
- Spacing and layout rhythm: header, hero height, content alignment, gradients and H1 geometry are
  unchanged. Only the raster positioning model changed from breakpoint-specific edge alignment to
  one intrinsic focal-point transform.
- Colours and visual tokens: no colours, opacity tokens or overlay gradients changed.
- Image quality and asset fidelity: the original approved WebP pair is reused without regeneration,
  stretching or duplicated text. Both images use their intrinsic 1672:941 ratio and the same 36.4%
  horizontal focal coordinate, so the crossfade remains pixel-aligned.
- Copy and content: no visible or accessible copy changed.
- Responsive evidence: browser geometry measured the focal centre at 160 px for 320 px, 196.5 px
  for 393 px, 384 px for 768 px, 720 px for 1440 px and 960 px for 1920 px viewports. The maximum
  measured delta from the viewport centre was below 0.001 px.
- Interaction evidence: at a 1440 × 900 px viewport and 408 px scroll position, the night image
  reached opacity 1; day and night bounds remained identical and the focal-centre delta stayed below
  0.001 px. The in-app browser reported no warning or error console entries.
- Comparison history: the annotated pre-fix mobile state cropped the embedded word out of view (P1).
  The fix replaced `object-position` overrides with an intrinsic-ratio image box whose 36.4% source
  point is translated to the viewport centre. Post-fix mobile, desktop and five-width geometry
  evidence resolves the finding; no actionable P0/P1/P2 differences remain.
- Technical verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` (7/7) and the production
  `pnpm build` pass. The first sandboxed build attempt was blocked by Turbopack's local-process port
  restriction; the permitted production build completed and statically prerendered all routes.

## Final result

passed

## Mobile navigation drawer — 2026-08-03

- Source visual truth: `artifacts/design-qa/mobile-menu/reference-selected-option-2.png`, the second
  displayed owner-selected mobile-menu concept, 852 × 1844 px.
- Implementation evidence: `artifacts/design-qa/mobile-menu/implementation-closed-final.jpg` and
  `artifacts/design-qa/mobile-menu/implementation-open-final.jpg`, both browser-rendered at a
  390 × 844 CSS viewport and 1× density.
- Density normalization: the source was downsampled to 390 × 844 and placed on the left of
  `artifacts/design-qa/mobile-menu/comparison-final-source-left-implementation-right.jpg`; the
  390 × 844 implementation is on the right. The full open state was compared in one image.
- State: mobile header at page start, menu open. The closed state was reviewed separately to confirm
  the compact one-row logo/menu architecture. A focused crop was unnecessary because the full-view
  comparison renders the wordmark, close control, link typography, separators and CTA legibly.
- Fonts and typography: the implementation reuses the project's self-hosted Hanken Grotesk wordmark
  and JetBrains Mono navigation/CTA. Link sizes, weights, tracking and uppercase hierarchy match the
  selected concept within normal raster-generation variation.
- Spacing and layout rhythm: the right panel starts at 23% of the viewport, matching the selected
  reference. Its six 88 px rows begin below a 72 px header and leave the same deliberate lower void;
  the CTA occupies the final 85.6 px.
- Colours and visual tokens: the existing `charcoal-deep`, architectural orange, warm-white text and
  hairline border tokens are reused. No new gradient, radius or shadow language was introduced.
- Image quality and asset fidelity: the narrow uncovered strip shows the existing approved hero
  asset under the modal backdrop. Menu and close controls use Phosphor Icons rather than CSS,
  handcrafted SVG, emoji or text-glyph approximations.
- Copy and content: all six existing German navigation labels and hash targets are preserved; the
  established `Projekt prüfen lassen` CTA remains unchanged and moves inside the mobile drawer only.
- Interaction evidence: the in-app browser confirmed one trigger, one modal dialog, six navigation
  links, document scroll locking, close-button focus restoration and successful `Kosten` navigation
  to `#kosten`. The final production capture reported no console errors.
- Comparison history: pass 1 found two P2 mismatches—navigation rows filled almost the entire panel
  and the underlying wordmark was clipped. Pass 2 fixed the row rhythm, CTA height and wordmark scale.
  The final pass added a non-interactive top-layer wordmark and moved initial focus to the dialog
  panel, resolving both the clipping and unwanted auto-focus ring. No actionable P0/P1/P2 mismatch
  remains. The source's obsolete underlying mobile link is intentionally absent because the selected
  closed-header architecture contains only the logo and menu control.
- Technical verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` (7/7) and the production
  `pnpm build` pass. The open-state browser console is clean.

## Final result

passed

## Mini-configurator composition flow — 2026-08-04

- Source visual truth: the owner reference
  `/var/folders/sw/wqxr8fzn2z9d0ht64tglhf3m0000gn/T/codex-clipboard-ede52582-a092-4e14-92a0-79c25cfd2082.png`,
  2740 × 1300 px, establishes only the requested placement behaviour: no logo, one logo on the
  left, or equal logos on both sides. `DESIGN.md` remains authoritative for the LICHTSAUM dark
  architectural styling, control hierarchy and responsive rules.
- Final implementation evidence:
  `artifacts/design-qa/mini-configurator-composition/implementation-desktop-1440x1000.png`,
  1440 × 1000 px, and
  `artifacts/design-qa/mini-configurator-composition/implementation-mobile-390x844.png`,
  390 × 844 px. Both are browser captures at 1× density in the `Logo beidseitig` state, with the
  composition menu closed.
- Open-state evidence:
  `artifacts/design-qa/mini-configurator-composition/implementation-desktop-popup-1440x1000.png`
  and `artifacts/design-qa/mini-configurator-composition/implementation-mobile-popup-390x844.png`
  show the same 1440 × 1000 and 390 × 844 CSS viewports with the composition listbox open.
- Same-input full-view comparison:
  `artifacts/design-qa/mini-configurator-composition/comparison-full-reference-left-implementation-right.jpg`.
  The owner reference is on the left and the final LICHTSAUM implementation is on the right,
  normalized into equal 1000 × 650 panels.
- Focused comparison:
  `artifacts/design-qa/mini-configurator-composition/comparison-focused-reference-left-popup-right.jpg`
  isolates the reference logo-placement controls on the left and the final composition popup on
  the right, normalized into equal 900 × 600 panels.
- Typography: compact JetBrains Mono labels retain the established technical character, option
  names remain legible at both target widths, and the selected font is demonstrated in a labelled
  sample directly beneath the composition control.
- Spacing and layout: desktop follows one top alignment and the accepted logical chain
  `01 Gestaltung` → `02 Maße` → `03 Farbe & Licht`; mobile preserves that semantic order in one
  column. The preview stays above the controls and uses the available width without page overflow.
- Colours and tokens: the existing near-black, warm-white, hairline and architectural-orange
  tokens are preserved. The selected popup row now uses dark copy on solid orange, resolving the
  initial 4.16:1 automated contrast finding.
- Image and asset fidelity: the implementation does not copy the light reference skin or its
  price/calculation UI. Phosphor `Diamond` and `Check` icons express schematic logo positions and
  selection; the real customer logo file remains deliberately outside this mini-configurator.
- Copy and information architecture: `Wortmarke`, `Logo + Name` and the non-functional
  `Segmentiert` card set are replaced by one `Komposition` listbox with `Nur Schrift`, `Logo links`
  and `Logo beidseitig`. The inscription stays mathematically centred in every mode while logos use
  protected, symmetric edge zones. A visible note explains that logo marks are schematic and the
  final file will be checked separately.
- Accessibility and interaction: the popup exposes a labelled trigger, `aria-expanded`, listbox
  and selected-option semantics. Pointer selection, Enter/Space, Arrow Up/Down, Home/End, Escape,
  outside click, focus restoration and reload persistence were checked. Colour and light choices
  expose named radio groups, and focus remains visible in normal and forced-colour modes.
- Comparison history: the first pass retained three unrelated branding cards and a misleading
  segmented preview (P1 information-architecture issue). The redesign consolidated them into the
  popup and removed false segment functionality. A later automated pass found selected-option
  contrast at 4.16:1 and the mobile live-preview label obscuring the left logo (both P1); the copy
  colour and mobile label treatment were corrected. Post-fix desktop/mobile captures, Axe and
  overflow checks leave no actionable P0, P1 or P2 finding.
- Runtime and technical evidence: a fresh in-app-browser load at `#konfigurator` produced no warning
  or error console entries. `pnpm typecheck`, `pnpm lint`, 18 unit tests, the production build, the
  focused composition E2E, both open/closed Axe checks and responsive checks at 320, 390, 768, 1024,
  1280, 1440 and 1920 px pass.

## Final result

passed

## Current mini-configurator status — 2026-08-04

The later `Compact controls and text cell revision` entry is the current visual state: the font
sample is removed; the closed composition control, text field and numeric fields are all 54 CSS px
high; composition descriptions appear only in the open listbox; and the text cell uses the distinct
`--surface` background. Its desktop/mobile evidence and before/after focused comparison are recorded
under `artifacts/design-qa/mini-configurator-compact-controls/`.

## Final result

passed

## Current handoff target — Kontakt Europe atlas, 2026-08-04

The complete current comparison inputs, required fidelity review, responsive evidence, comparison
history, interaction checks and technical checks are recorded above under `Kontakt Europe atlas —
2026-08-04`.

final result: passed
