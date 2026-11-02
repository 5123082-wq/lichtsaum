# PROGRESS.md

<!-- AGENT_CONTEXT:START -->
## Context Beacon

- Last updated: 2026-11-02.
- Published product: https://www.lichtsaum.com/produkt. Owner explicitly authorised publication.
  Code commit `f91184edadb02acc60c1294fd08d3654b2e7cdac` was pushed directly to origin/main;
  Vercel `dpl_6n7efxFZV1KEgHjMP2DjMXwTGfZY` is READY and assigned to www/apex.
- Current page: five editorial chapters (video, textile/colour, shapes/configurator, questions,
  project/enquiry). Shared navigation opens `/produkt`; the review route remains production 404.
  Absolute self-canonical, own social metadata and one sitemap entry follow the existing search gate.
- Owner revision: original 6,070,629-byte silent 720p/240-frame video, no extra re-encoding;
  public product-page AI/concept captions removed, including equivalent alt/ARIA wording.
  Video resumes after offscreen/hidden pauses, respects manual pause and holds its illuminated ending.
  Header handles intermediate widths/enlarged text; copy explicitly explains valance replacement.
  Internal provenance belongs to `docs/content/product-media-provenance.md`.
- Final release export: unchanged package/lock; no legacy Three.js scenes, raw source media,
  promo, services prototype, local artifacts, secrets or environment files. Full lint, 226 unit tests,
  typecheck and production build pass; 26 production-build Chromium/WebKit scenarios pass.
  Earlier local runs cover 28 product and 48 shared header/hero scenarios.
- Live QA: Chromium at 390/1440px passes content/alt, no overflow, final-frame playback,
  configurator/enquiry links, full-page axe and zero JavaScript errors. Tracking query canonical,
  sitemap, prototype 404 and AdsBot user-agent 200 verified. Downloaded MP4 SHA-256 matches source.
  No optional Google request before consent or after rejection. No real lead/file/email was sent.
- Existing production flags, providers, database and Ads settings were not changed. Existing
  configurator v6 remains published; its contract belongs to `docs/architecture/configurator-calculation.md`.
  Lead persistence/notification/files continue through Neon/Resend/private Blob; IONOS handles mailbox reception.
- Local-only work remains: prior 3D/product studies, services HTML in
  `DesignPrototip/prototypes/leistungen/`, promo notes in `docs/marketing/product-promo-20s.md`
  and its editable/exported project under `output/`. These are not files of this release.
- Evidence limits: physical-device Safari, field CWV, actual lead delivery/deduplication and current
  Ads/Tag Assistant diagnostics remain untested. Earlier mobile lab results apply only to the rejected
  smaller video encode. Owner publication authority does not verify unknown third-party media rights.
- Next action: owner review of the live product page; additional Ads final-URL changes or diagnostics
  are separate tasks. The shared development watchdog on port 3000 remains available.
<!-- AGENT_CONTEXT:END -->

<!-- RECENT_CHANGES:START -->
## Recent changes — newest first, maximum three

### CHG-20261102-03 — Product page published and verified live

- Scope: editorial product page/media, shared navigation/header, search metadata/sitemap and release documentation.
- Outcome: owner-authorised code commit `f91184edadb02acc60c1294fd08d3654b2e7cdac` matches origin/main after
  direct push/fetch; Vercel `dpl_6n7efxFZV1KEgHjMP2DjMXwTGfZY` is READY on www.lichtsaum.com and lichtsaum.com.
  Original video and owner-requested caption removal are live. Existing flags/providers/Ads unchanged.
- Verification: exact release export passes full lint, 226 unit tests, typecheck/build and 26 Chromium/WebKit
  browser scenarios. Live Chromium 390/1440 checks pass: full-page axe, zero runtime errors/overflow,
  video ending, configurator/enquiry links, canonical/social/robots, sitemap, prototype 404, AdsBot 200,
  byte-identical downloaded video and no optional Google traffic before consent/after rejection.
  Screenshots reviewed; no real leads, uploads or emails sent. Shared dev server remains 200.
- Follow-up: physical-device Safari, field CWV and live conversion/Ads diagnostics remain separate.

### CHG-20261102-02 — Original product video restored and provenance captions removed

- Scope: original MP4 delivery, product media captions/alt/ARIA, related layout and owning documents.
- Outcome: original 6,070,629-byte silent video is restored without re-encoding. Product-page
  AI/concept/illustrative-study labels are removed; neutral German descriptions remain. No publication.
- Verification: byte-for-byte comparison and ffprobe confirm 1280 × 720, 240 frames and 10 seconds;
  all 28 Chromium/WebKit product scenarios, typecheck and scoped lint pass. Desktop/mobile
  screenshots reviewed; the user's browser was reloaded and the dev server remains available.
- Follow-up: owner publication decision; previous mobile lab measurements do not cover the restored file.

### CHG-20261102-01 — Product audit corrections and publication candidate

- Scope: responsive header, editorial copy, video delivery, product metadata/navigation/sitemap,
  tests and owning design/architecture/content/search contracts.
- Outcome: navigation no longer clips at 768px or enlarged text; replacement principle is explicit,
  three useful FAQs remain, internal arrows are clear. `/produkt` is production-ready in source
  behind the existing search gate; the prototype remains private. Video is 56% smaller. No publication.
- Verification: 235 unit tests; 28 product and 48 header/hero Chromium/WebKit scenarios pass across
  runs/reruns; optimized build/TypeScript, source/tests lint and rendered production SEO fixture pass.
  One mobile lab run: LCP 2312ms, CLS 0.0001, tested interaction 80ms; screenshots reviewed.
  Full-repository lint retains existing vendor/service-artifact issues outside this scope.
- Follow-up: owner publication decision; real-device/field CWV and live Ads/conversion diagnostics.

<!-- RECENT_CHANGES:END -->

<!-- CHANGE_HISTORY:START -->

### CHG-20261101-06 — Resume product video after scrolling back

- Scope: shared video hero, playback browser tests and DESIGN.md.
- Outcome: automatic offscreen/hidden pauses resume from the same frame; manual pause remains
  paused and the completed video holds its illuminated ending. Reduced-motion/failure fallback retained.
- Verification: 12 Chromium/WebKit scenarios pass, including manual pause, resumption and ending at
  390/1440px; screenshots reviewed, typecheck/scoped lint pass. Existing dev server still returns 200.
- Follow-up: physical-device Safari remains unverified; no publication.


### CHG-20261101-05 — Approved product fabric and colour images

- Scope: two local product media assets, image dimensions/alt/sizes, mobile framing and source record.
- Outcome: approved 3392 × 1248 originals appear as responsive WebP; warm palette colours and fabric roll
  remain visible on mobile. Existing carousel, typography and video preserved; no publication.
- Verification: typecheck/scoped lint and 14 final Chromium/WebKit scenarios pass at 320–1920px,
  including axe, keyboard/touch and noindex. Earlier motion/playback checks pass; screenshots reviewed.
- Follow-up: owner review of local rendering; physical-device Safari remains unverified.

### CHG-20261101-04 — Clearer first-contact section on the product page

- Scope: closing product copy/layout, navigation tests, DESIGN.md and content brief.
- Outcome: two clear roles replace three abstract process steps; optional preparation is explicit,
  the button opens the existing enquiry form, and services remain a secondary text link.
- Verification: all 24 Chromium/WebKit scenarios pass at 320–1920px, including axe and navigation;
  desktop/mobile screenshots inspected, scoped lint and diff check pass. No form submission.
- Follow-up: owner copy/visual review; no publication.

### CHG-20261101-03 — Product configurator invitation with atmospheric backdrop

- Scope: editorial invitation, shared desktop header CTA width, responsive browser checks and DESIGN.md.
- Outcome: larger copy explains configuration and preliminary price; existing concept image softly
  dissolves behind it. CTA aligns with the header's right edge and matches its dimensions. Mobile stacks.
- Verification: 24 product scenarios passed across main run and motion-test follow-up; 30 header
  scenarios passed. CTA bounds/dimensions checked, screenshots reviewed, typecheck and scoped lint pass.
  WebKit motion test now waits for the intermediate preference to render; three reruns passed.
- Follow-up: owner visual review; no publication or enquiry submission.

### CHG-20261101-02 — Unified product typography below the video

- Scope: product editorial CSS and typography contract in DESIGN.md.
- Outcome: one scale for section headings, body, lead text, FAQ and captions; original grid,
  media and animation retained. Owner-approved video hero type and colours remain unchanged.
- Verification: 23/24 Chromium/WebKit scenarios passed initially; live reduced-motion WebKit
  case passed on isolated rerun. Layouts 320–1920px, axe and navigation checked; screenshots reviewed.
- Follow-up: owner visual review; physical-device Safari remains unverified.


### CHG-20261101-01 — Latest editorial product integrated locally

- Scope: `/produkt`, shared editorial page, review route, route/browser tests and current documentation.
- Outcome: `/produkt` displays the latest prototype with the same video and styling; both routes
  share the presentation. Production remains blocked and noindex; no Git push or deployment.
- Verification: optimized build, typecheck, scoped lint, 11 unit tests and all 24 Chromium/WebKit
  scenarios passed across the main run and corrected navigation rerun. Responsive screenshots reviewed.
  The dev Fast Refresh loop was resolved by preserving/resetting its cache; Chromium/WebKit
  navigation reruns on port 3000 passed and the shared watchdog remains available.
- Follow-up: owner local review; physical-device Safari and publication remain separate.



### CHG-20261020-13 — Replacement keyframes and Gemini video attempt

- Scope: two concept PNG keyframes and external Gemini generation request, authorised by the owner.
- Outcome: matching plain/luminous valance views saved at 1672 × 941; Gemini returned errors on both
  the two-frame and simplified one-frame video requests. No video was produced; prototype stays static.
- Verification: both images visually inspected, dimensions checked, both uploads and Gemini errors
  observed in the browser; prompt and chat link saved in the keyframe README.
- Follow-up: retry video generation when available, assess motion, then decide on scroll integration.



### CHG-20261020-12 — Reference-informed awning and separated product chapters

- Scope: local `/prototyp/produkt` model, responsive framing, fallback and chapter order.
- Outcome: textile/colour now separates the hero from the awning; shapes and inscription follow it.
  An underside view reveals both articulated arms, fork joints, wall brackets, the support rail and
  roller. Woven warm grey cloth, flat seams, coated profiles and soft shadows replace the prior
  top view. The v2 transparent fallback matches the model; scroll animation remains deferred.
- Verification: 27/28 Chromium/WebKit scenarios passed initially and the live reduced-motion
  WebKit case passed on isolated rerun; 11 unit tests, scoped lint, typecheck and build passed.
  Static pixels, no overflow, no axe violations and no page errors at 320/390/1440px; fallback
  1920 × 898 alpha 0–255. Local server remains available. No publication.
- Follow-up: owner visual review and confirmation of the real valance attachment before animation.



### CHG-20261020-11 — Static awning material and lighting study

- Scope: local product exchange chapter, procedural model and transparent fallback asset.
- Outcome: one fixed three-quarter view replaces playback/rotation controls. Curved cloth panels,
  seams, hem edges, bevelled profiles and hardware share studio illumination on the page background.
  The existing inscription input and configurator transfer remain functional; the previous exchange
  renderer is retained for later work. This is a conceptual model, not verified construction.
- Verification: 28 Chromium/WebKit scenarios pass across the main run and one screenshot-failure
  rerun; nine unit tests, scoped lint, typecheck and production build pass. Static pixels, no overflow,
  no axe violations and no page errors verified at 320/390/1440px; transparent fallback alpha checked.
- Follow-up: owner visual assessment and reference photographs/CAD before technical animation.



### CHG-20261020-10 — Local 20-second HyperFrames product promo

- Scope: standalone German product promo, original score and local Studio review artifact.
- Outcome: 20-second 1920 × 1080 composition covers facade, material shapes, moving light reveal
  and configurator CTA. Existing concept imagery stays labelled; site and production are unchanged.
  See local-only `docs/marketing/product-promo-20s.md`; editable project is in local `output/lichtsaum-promo-20s/`.
- Verification: HyperFrames check passes with zero errors/warnings and 24/24 text contrast checks;
  five keyframes visually reviewed. Intentional scene-transition occlusions are informational only.
  Delivery-quality MP4 verified at 20 seconds, 1080p/30 fps with stereo audio; full decode passes
  and four exported frames were visually reviewed.
- Follow-up: owner review; any external publication remains a separate step.


### CHG-20261020-09 — Full-screen product video opening

- Scope: local `/prototyp/produkt` hero, media delivery, responsive styling and playback checks.
- Outcome: the Gemini orbit/light clip opens the page with the existing slogan and soft shading;
  the homepage header gains its backing on scroll. Silent one-pass playback holds the lit ending,
  with pause/replay, offscreen/hidden pause and reduced-motion/failure poster. The duplicate light
  chapter is removed; five chapters remain. A video-only copy and final-frame WebP preserve the source.
- Verification: 28 Chromium/WebKit scenarios pass across the main run and corrected scroll-test rerun;
  nine unit tests, typecheck, scoped lint and production build pass. Start/lit/end screenshots reviewed
  at 320/390/1440px, responsive checks cover 320–1920px, hero/header axe checks found no violations.
  Native export reports 10 seconds and zero audio tracks. Local route still returns 200.
- Follow-up: owner review; final 720p quality decision, physical-device Safari and field performance.

### CHG-20261020-08 — Gemini camera-arc video draft received and reviewed

- Scope: generated product-film source and visual review, following the owner's rejection of the planar substitute.
- Outcome: Gemini generated a camera arc from the first keyframe using the owner's authorised account;
  the owner downloaded `gemini_generated_video_2648993e.mp4`. The saved source is 10s, 1280 × 720,
  24fps with one audio track. Perspective changes towards a frontal view; letters illuminate mid-shot.
- Verification: local playback and native metadata extraction; seven frames at 0–9.7s visually inspected.
  LICHTSAUM remains legible on inspected frames, off at 3s and on at 4.5s through the ending.
  Exact scene geometry across every frame and audio content are unverified. No page integration or publication.
- Follow-up: owner assessment in the local light chapter, mobile composition and final media preparation.

### CHG-20261020-07 — Local light-motion animatic

- Scope: product-scene media draft, local interactive preview and reproducible rendering source.
- Outcome: owner-liked scene now has a 10-second 1280 × 720, 24fps silent WebM with camera
  approach/retreat and a 2.4–4.2s inscription light ramp. A single planar projection preserves
  letters and architecture; true 3D parallax is explicitly outside this draft. No product route changed.
- Verification: control frames inspected, scripts parse, encoded duration/resolution verified;
  full Chromium playback reports no errors or dropped frames. Preview play/pause works and
  the shared dev-server route still returns 200. No paid generation or production publication.
- Follow-up: owner assessment of timing/light, then real camera-parallax test via 3D or a linked
  generation service; the Weave tool currently reports that Figma/Weave accounts are not linked.


### CHG-20261020-06 — Three light-scene concept keyframes

- Scope: local product-film storyboard, generated source media and generation provenance.
- Outcome: three PNG frames show an unlit angled facade, a closer illuminated textile view and
  a wider lit ending. The storyboard proposes a ten-second shallow arc with a gentle approach;
  exact prompts and selected sources are saved with the assets. No application media changed.
- Verification: all three images visually inspected; PNG dimensions are 1672 × 941 each, saved
  copies match generated originals, and storyboard links resolve. Separate AI stills contain
  small geometry/detail differences; continuous motion and mobile framing remain unverified.
- Follow-up: owner review of scene/framing, then a rough camera test before final video.

### CHG-20261020-05 — Generated three-form textile comparison

- Scope: editorial prototype shape media, responsive presentation and asset provenance.
- Outcome: one generated graphite textile panorama replaces the SVG diagrams. Desktop shows
  all three forms together; mobile stacks cropped portions of the same image, with HTML labels.
  Original PNG and exact built-in image-generation prompt are saved with the product prototype;
  the 1920 × 819 WebP is 163660 bytes. The image is labelled as a concept.
- Verification: image and desktop/mobile screenshots inspected; all 12 relevant Chromium/WebKit
  route/responsive checks pass at 320–1920px, including image loading and axe. Typecheck and scoped
  lint pass. No final video or production publication; the local server remains available.
- Follow-up: owner review of the image; light-scene keyframes/video remain open.


### CHG-20261020-04 — Six-chapter product prototype with a temporary light poster

- Scope: isolated editorial route, composition/styles, continuation placement, copy and regression checks.
- Outcome: early facade poster, compact exchange, combined textile/shape chapter ending in
  `Jetzt konfigurieren`, practical questions and three project steps. Shaded panels and local
  fonts remain; pinned facade and separate price section are absent. Shapes use a temporary
  schematic plate. The services note links to contact. Existing product and production are unchanged.
- Verification: 22 Chromium/WebKit checks at 320–1920px, nine unit tests, typecheck, scoped lint
  and production build pass. Desktop/mobile screenshots inspected; runtime logs clean and axe
  reports no violations in the checked main content. Draft preservation, invalid text, blocked
  storage, no-WebGL fallback and reduced motion pass. Dev server remains available.
- Follow-up: owner review, then final light-scene keyframes/video and shape imagery; real-device Safari and field CWV remain unverified.


### CHG-20261020-03 — Product refinement structure and media brief

- Scope: product-page content plan, scoped visual direction and media preparation.
- Outcome: a six-part proposed sequence brings light forward, groups material/colour/shapes,
  and closes the design chapter with a configurator link instead of a separate price section,
  as agreed by the owner. Owner preference for camera motion and one
  multi-shape image is recorded; a prerendered clip is recommended, with inputs and fallback defined.
  See `docs/content/product-page-refinement-brief.md`. No application or media implementation changed.
- Verification: inspected the markilux reference in the browser, existing product content/design
  and the current v6 calculation contract; checked document links and rolling-history preservation.
- Follow-up: prototype composition with a poster, three scene keyframes and one shape study.


### CHG-20261020-02 — Agreed three-panel prices and included electrical set

- Scope: server tariff/allocation, summary/page/notification scope, regression tests and pricing contract.
- Outcome: v6 selects only 600/1000/1200 mm panels at EUR 450/600/750; valance rates
  EUR 45/50/55 per metre and one EUR 150 electrical set produce EUR 1080 for the owner's
  example. Equal-panel allocation and height/lettering rules remain. Historical notifications
  preserve their original scope and panel sizes. Old pricing requires reconfirmation.
- Verification: the isolated release passes all 216 unit tests, full lint and production build
  with TypeScript checks; the full local workspace previously passed 227 tests.
  Four Chromium/WebKit checks at 390/1440px verify limits, keyboard controls, panel selection,
  total and electrical inclusion. Summary screenshots reviewed at both widths. Dev server remains available.
  All four functional checks also pass on production. Four further Chromium/WebKit checks
  confirm the EUR 1080 summary, zero detected WCAG violations/runtime errors, correct canonical
  and unchanged navigation at 390/1440px. Screenshots reviewed. No real inquiry was sent.
- Follow-up: physical assembly/electrical capacity remain subject to project review.




### CHG-20261020-01 — Supplier pricing and dependent lettering limits

- Scope: mini/full configurators, server pricing/validation, summary/notification scope,
  FAQ, calculation contract and claims.
- Outcome: one dropdown with heights 200/250/300 mm resets lettering to 70/120/170 mm; smaller values remain
  editable. Five supplier panel widths, height-based fabric rates and +50% markup replace
  the legacy inputs. Electrical equipment and services are excluded explicitly. Equal-panel
  selection, text geometry and separate logo segments remain; old notification scope is preserved.
- Verification: the isolated release passes all 212 unit tests, full lint and production build
  including TypeScript checks. Six Chromium/WebKit checks against that production build cover
  the dropdown, keyboard/Escape, 390/1440px views, dependent limits, EUR 1264.58 example,
  mini-configurator and FAQ. Earlier local deck/a11y checks cover 320–1920px.
  Unrelated product prototypes, navigation and dependency changes are excluded.
  After publication all six live functional checks pass; four Chromium/WebKit production
  checks at 390/1440px confirm HTTP 200, self-canonical, unchanged product navigation,
  no runtime errors and no detected WCAG violations. No real inquiry or email was sent.
- Follow-up: Supplier panel useful
  dimensions, electrical package and physical assembly still require project review.




### CHG-20261011-03 — Shaded image panels and grouped textile views

- Scope: isolated editorial prototype light/material composition, interaction and visual QA.
- Outcome: at the owner's request, the previous MVP's translucent side shading returns with
  alternating text sides and unequal, staggered image widths. One textile card switches fabric,
  edge construction and palette using shared source assets/copy, arrows or touch; no autoplay.
  Mobile copy follows the image with a shaded overlap. `/produkt` remains unchanged.
- Verification: 24 Chromium/WebKit checks and 11 relevant unit tests pass, including wrapping,
  keyboard/touch selection, retained light state, 320–1920px, reduced motion, a11y and existing
  3D/configurator behavior. Typecheck, scoped lint and production build pass. Desktop/mobile
  screenshots reviewed; the running user dev-server remains available. Full lint's pre-existing
  artifact/vendor failures are unchanged.
- Follow-up: owner visual review; the experiment is not an approved production replacement.



### CHG-20261011-02 — Separate editorial product-story prototype

- Scope: `/prototyp/produkt`, isolated editorial components/styles/3D renderer, continuation and QA.
- Outcome: typography-led story, light comparison, textiles and three frontal hem studies; a real
  facade stays pinned before the following story covers it. Own text updates 3D and transfers to
  the existing configurator while retaining its other settings. `/produkt` and production remain
  unchanged; the experiment has no menu/sitemap entry and returns 404 in production.
- Verification: 207 unit tests, 24 Chromium/WebKit checks, typecheck, scoped lint and build pass.
  Tests cover 320–1920px, pinned/reverse scroll, reduced motion, a11y, text/replay/draft retention,
  storage/WebGL fallback and homepage continuation. Early input before hydration is guarded.
  Desktop/mobile screenshots reviewed. Full lint remains blocked by pre-existing local scripts
  and vendored Three.js files. The user dev-server remained running.
- Follow-up: owner composition/copy review and a separate integration decision. Physical-device
  Safari/mobile keyboard and field performance remain unverified; no public release or real lead.



### CHG-20261011-01 — Product page integrated into the local application

- Scope: `/produkt`, product components/media, shared navigation target and route documentation.
- Outcome: shared site shell/buttons, responsive concept chapters, lazy 3D scene with lifecycle
  cleanup, real local configurator/contact/project-form links. No demo enquiry or external live-site
  links remain. Non-production/noindex boundary preserves the current production site.
- Verification: 198 unit tests, typecheck, scoped lint and application build pass. Browser checks
  cover independent selectors, light retention, mobile menu, route return and resumed 3D rendering;
  no overflow at 320/390/768/1440/1920px. Desktop/mobile screenshots reviewed.
- Follow-up: owner visual/content review. No real inquiry sent; device Safari, field performance
  and production publication remain unverified/unperformed.



### CHG-20261010-04 — Distinct product imagery and light comparison

- Scope: isolated product prototype, local generated assets and visual notes.
- Outcome: textile roll/cutting-table/sample scenes, a separate daylight hem angle and nighttime
  lettering replace repeated product close-ups. Shorter copy and neutral translucent panels remain.
  Independent on/off control preserves the chosen light tone; all imagery is labelled as concept.
- Verification: desktop/390px visuals inspected; 320px has no overflow or broken loaded images.
  Keyboard on/off and retained hue, independent topic choices, 43 HTML references, JS syntax and
  diff whitespace checked. Production/application files unchanged.
- Follow-up: owner visual review; real textile, construction and light specifications remain open.

### CHG-20261010-03 — Independent product presentation chapters

- Scope: local product prototype, generated concept assets and visual documentation.
- Outcome: facade introduction, fabric/colour, hem shapes and lighting are separate vertical
  sections with translucent image overlays. Each of the three variant sections has independent
  manual controls. Owner keeps supplier/material and light specifications open for later.
- Verification: keyboard selections preserve other sections; wraparound arrows and loaded images
  checked in the browser. JavaScript syntax and local reference checks pass. Mobile/desktop inspected.
- Follow-up: owner composition review; confirm real fabrics, light options and product imagery
  before public integration. Physical-device touch/accessibility/performance remain open.

### CHG-20261010-02 — Interactive 3D valance exchange

- Scope: isolated product prototype, local Three.js vendor modules and design notes.
- Outcome: procedural awning with old/new valance exchange, warm lettering, three chapters,
  a native timeline and rotatable perspective/front views. Existing app and production unchanged.
- Verification: scene rendered in Chromium; initial/installed/lit states, keyboard timeline,
  pointer rotation and playback checked. No horizontal overflow at 320/390/768/1440px.
  JavaScript syntax and local asset checks pass; reduced-motion/fallback branches reviewed in code.
- Follow-up: owner visual review; physical-device Safari/GPU and performance checks before integration.


### CHG-20261010-01 — Compact product presentation prototype

- Scope: isolated German product HTML/CSS/JS, local assets and design notes.
- Outcome: five product-led sections, a generated close-up, on/off light comparison and short
  contextual links to the services prototype are ready for owner review. No application route
  or production behaviour changed; enquiries are a non-sending demonstration.
- Verification: browser checks at 320–1920px show no horizontal overflow or broken images;
  desktop/mobile visuals, light switching, menu, dialog Escape/focus return and service navigation
  checked. All 28 static references resolve; JavaScript syntax passes; no recorded browser errors.
- Follow-up: owner composition/copy review and service-scope confirmation before app integration;
  real-device accessibility and production gates remain open.


### CHG-20261009-01 — Configurator release

- Scope: sequential configurator sheets, mini-configurator field order and regression checks.
- Outcome: owner-authorised configurator commit `33ba888` is on origin/main and live on both
  production domains; Vercel `dpl_2ZTJD77RujjcVFTWcpqCTDkpGmSB` is READY. Services excluded.
- Verification: typecheck and lint excluding old temporary artifacts pass; 195 unit tests passed
  initially and the SEO timeout passed separately. Browser suite: 60 passed, two WebKit failures
  passed on sequential rerun. Production build passed. Four production Chromium/WebKit runs
  at 390/1440px passed transitions, dialogs, canonicals, consent rejection, zero optional Google
  requests and zero detected accessibility/runtime errors. Routes/media/robots/sitemap passed.
- Follow-up: real-device Safari/mobile keyboard, field CWV and controlled delivery/conversion QA.
  No real lead, upload or email delivery was tested.


### CHG-20261007-02 — Editable services presentation prototype

- Scope: isolated HTML/CSS/JS prototype, local assets, generated service illustrations and design notes.
- Outcome: a German `Leistungen` presentation uses a dominant Leuchtvolant image, unequal staggered
  cards for planning/design and cleaning/fabric, secondary service disclosures and a project-check
  demonstration. All resources are local; concept imagery stays labelled. Existing application
  files, public routes and production behaviour are unchanged by this work.
- Verification: browser layouts at 320, 390, 768, 1024, 1280, 1440 and 1920px have no horizontal
  overflow. Desktop/mobile views, gallery navigation, Escape/focus return, mobile navigation and
  service context in the non-sending enquiry demo were checked. Asset/anchor checks and JavaScript
  syntax pass; the shared site remains separate on port 3000.
- Follow-up: owner visual/copy review and service-scope confirmation, then application integration;
  physical-device Safari and production gates remain unverified.


### CHG-20261007-01 — Compact sequential configurator sheets

- Scope: full configurator presentation, navigation, responsive styles and focused browser checks.
- Outcome: large introductions and separate progress navigation are replaced by labelled sheet
  edges on desktop and full-width stacked panels on mobile. Steps 01–02 have no duplicate bottom
  navigation; the next sheet has an orange border/label, filled arrow and 10% wider edge, with a
  10% narrower companion. Returning to step 01 always locks step 03 until step 02 is revisited.
  Steps 01–02 retain desktop height (including logo notes); 72px service cells and PLZ align.
  The preview stays above the deck;
  default steps 01–02 fit at 1440×900. Forward validation, keyboard focus and draft values persist;
  invalid postal codes can always be revisited for correction. Pointer transitions take 240ms;
  keyboard and reduced-motion navigation do not move the sheet. Implementation is local.
- Verification: 30 configurator Chromium/WebKit checks passed across 320, 390, 768, 1024, 1440 and
  1920px, including strict 01→02→03 progression after returning from step 03, edge widths, overflow,
  equal desktop panel heights, aligned PLZ/service cells, desktop fit, reduced motion and zero
  detected WCAG violations.
  Desktop/mobile screenshots reviewed; typecheck, scoped lint and production build passed.
  The shared dev server remains available. Physical-device Safari and mobile keyboard are unverified.
- Follow-up: real-device Safari/mobile keyboard and field CWV remain unverified.

### CHG-20261005-03 — Production release and live-site verification

- Scope: all accumulated site changes, generated media/provenance, regression checks and release.
- Outcome: site commit `a467515` was pushed to main; Vercel deployment
  `dpl_DKGhCFd6CP7THxtCBFXHNGuYcKvD` is READY on both production domains. Temporary output
  and tmp/ are ignored. Runtime flags/providers and GTM/Ads settings were unchanged.
- Verification: 196 unit tests, typecheck, full lint and production build passed. Full browser run
  had 151 passes and two consent skips; all three stale-expectation failures passed on focused rerun.
- Verification (production): four Chromium/WebKit desktop/mobile runs passed dialogs, canonical,
  consent rejection, zero optional Google traffic before consent/after rejection, zero runtime errors
  and zero detected WCAG violations. Public pages/media, robots and sitemap return 200; missing
  route returns 404 and apex redirects with 308. Screenshots reviewed; localhost remains available.
- Follow-up: real-device Safari/mobile keyboard, field CWV and real delivery/conversion checks remain open.



### CHG-20261005-02 — Straight, spaced hero lettering

- Scope: hero background cleanup, vector typography, visual contract and asset provenance.
- Outcome: old raster letters are removed; actual Hanken Grotesk 800 outlines use 0.12em tracking
  and one perspective transform. A crisp core retains the footer glow palette. Footer typography
  is unchanged. Source assets are retained; implementation remains local.
- Verification: 30 Chromium/WebKit hero checks across nine viewports passed; desktop screenshot
  reviewed. Typecheck, scoped lint and production build passed. Bounds checks reflect the new SVG.
- Follow-up: owner visual review and separately authorized release; real-device Safari and field
  CWV remain unverified.


### CHG-20261005-01 — Compact close-only inquiry confirmation

- Scope: shared mini/full inquiry success presentation, close lifecycle and focused regression checks.
- Outcome: accepted inquiries show a centered content-height receipt, maximum 36rem wide, with
  small check, confirmation, request number and Schließen. Hidden fields no longer contribute
  height. Repeat-send and bottom return actions are absent in the dialog; cross, close and Escape
  return focus to the configuration. Reopening preserves the receipt. Implementation is local.
- Verification: 15 unit tests and 10 Chromium/WebKit acceptance checks passed at 320, 390, 1135,
  1440 and 1920px, covering content height, centering, no overflow, accessibility and all closing
  methods. Desktop/mobile screenshots reviewed; typecheck, scoped ESLint and production build
  passed. Browser acceptance was simulated after local validation, without creating a real lead.
  The previously inactive dev server was started with dev:watch for local review.
- Follow-up: owner visual review and separately authorized release.

### CHG-20261004-07 — Visible inquiry submission feedback

- Scope: shared lead-form focus/scroll lifecycle, mini/full inquiry dialogs and regression checks.
- Outcome: validation errors, local test/unavailable results, pricing confirmation and accepted
  success become visible after pending settles; repeated responses regain focus on every retry.
  The focus race against the inert entry is removed. Localhost still validates without creating
  a lead; the owner reports live-site submission works. The change is local.
- Verification: reproduced the desktop full-dialog failure with a regression test before fixing
  it. All 21 focused unit tests and 22 Chromium/WebKit dialog checks passed, including mobile/desktop
  feedback, retries, drafts/files, focus, accessibility and consent diagnostics. Typecheck,
  scoped ESLint, production build and screenshot review passed; the existing dev server remains
  available. No real lead was submitted and no deployment was performed.
- Follow-up: none.


### CHG-20261004-06 — Original hero photograph with vector lettering light

- Scope: hero image source, crop-aware responsive delivery, SVG illumination, provenance and QA.
- Outcome: one quality-95 derivative from the exact-viewpoint PNG remains the constant background.
  The source is 1672 × 941; matching smoothed SVG letters and warm glow alone brighten on scroll.
  A warm-white gradient and blurred light core remove the traced pixel steps, with a gradual halo.
  Quality 90 and sizes based on full cropped width restore available detail on Retina phones.
  Existing headline, header, parallax and shorter mobile transition remain. Old sources and
  derivatives are retained; unrelated local work is preserved. No deployment or Git publication.
- Verification: 30 Chromium/WebKit hero/header checks including 2× Retina source decoding,
  nine viewports, SVG-only content and native/fallback motion; 7 existing hero/menu checks plus
  12 responsive/accessibility checks passed (49 total). Typecheck, full lint and production build
  passed; desktop/mobile Retina screenshots were inspected. Source/asset links resolve and the
  shared dev server remains available on port 3000. After the glow revision, all 30 hero/header
  checks passed again; entry/full light were inspected at 5× enlargement in both browser engines
  and in desktop/Retina phone page previews.
- Follow-up: owner visual review and separately authorized release. The original source resolution
  and rights boundary are recorded in the asset provenance; real-device Safari and field CWV
  remain unverified.


### CHG-20261004-05 — Shared fabric-inspired configurator palette

- Scope: canonical colour registry, legacy white compatibility, mini/full pickers and previews,
  design documentation and regression checks.
- Outcome: ten owner-approved plain screen colours use generic German names in both configurators.
  Existing colour IDs remain stable; retired white maps to Naturweiß on draft restoration and both
  server submission boundaries. Graphit remains the default. No supplier identities or copied
  fabric/stripe images were added. Implementation is local, with no deployment or Git publication.
- Verification: 196 unit tests, typecheck, scoped ESLint and production build passed. Eight
  Chromium/WebKit checks verify all ten swatches, trigger colours and SVG fills at 320, 390, 1440
  and 1920 px; the existing mini selection/continuation browser scenario also passed. Desktop
  picker visually inspected. Build completed with local process access after the sandbox attempt
  was stopped; the shared dev server remains available.
- Follow-up: owner visual review; actual supplier fabric samples remain unconfirmed.

### CHG-20261004-04 — Clear price and inquiry actions below the mini configurator

- Scope: homepage mini footer, responsive button layout, supporting copy and visual-system documentation.
- Outcome: outlined `Entwurf anfragen` sits left of orange `Preis berechnen` on desktop; both are
  44px high and the price button shares the header CTA's right edge. Mobile stacks price first.
  Both routine footer sentences were removed at the owner's request; schematic context remains
  in the section intro and technical review information remains in the inquiry dialog.
  Price continuation, draft transfer, incomplete inquiries and the existing route remain intact.
- Verification: 15 focused Chromium/WebKit checks passed for transfer, storage failure, input limits,
  inquiry drafts/focus/files and consent diagnostics. In-app browser review at 320–1920px confirms
  button size, stacking/row layout, common right edge and no horizontal overflow. Desktop/mobile
  screenshots reviewed; typecheck, scoped ESLint, production build and diff whitespace checks passed.
  The existing dev server remains accessible; sandbox-only port failures were resolved by running
  checks with local access, without restarting the server.
  After caption removal, direct desktop/mobile review confirms both texts are absent, the button
  layout and inquiry dialog work, and no dangling ARIA references remain; typecheck and scoped lint passed again.
- Follow-up: owner visual review and separately authorized production release; real-device Safari
  and the effect on visitor behaviour were not tested.

### CHG-20261004-03 — Fabric-inspired palette proposal

- Scope: shared mini/full configurator colours, manufacturer visual references and design ownership.
- Outcome: eight plain colours plus two optional extensions are proposed with our generic German
  names. Owner decisions permit plain-colour references but exclude copying third-party fabric
  photographs or striped designs and presenting selections as a supplier's named fabric.
  No supplier, material availability or exact fabric match is promised; the option registry is unchanged.
- Verification: checked the shared colour registry and both SVG previews; reviewed the manufacturer's
  live gallery and sampled eleven web photographs for approximate screen colours. Research visuals
  contain colour fields only and no copied fabric photographs or stripe images; all ten colour
  comparisons and selection-state restoration passed direct DOM checks.
- Follow-up: review palette for local implementation; actual supplier samples and any later striped
  assortment remain unconfirmed.

### CHG-20261004-02 — Overlay navigation and a brighter homepage hero

- Scope: homepage header surface, hero crop/light/headline motion, responsive and accessibility QA;
  visual-system documentation.
- Outcome: entry navigation overlays the image; its dark surface fades in over 160px. The raised
  lettering starts softly lit and reaches full warm brightness on scroll. H1 scrolls upward,
  stays fully visible through 100px and fades by 320px; the background drifts more slowly downward
  until fully covered. The sticky stage stays pinned through that overlap, removing the visible
  reversal without adding scroll distance or a background fade.
  CSS scroll timelines own supported-browser motion; the fallback never compensates headline
  position. Phones use a shorter scene: the following block enters after about 10svh of scroll,
  half the earlier entry distance, while the slower background drift stays consistent.
  The following block enters before the headline finishes fading instead of
  leaving a long empty scroll. Other routes retain their header surface. Reduced motion stays illuminated
  without parallax. Existing image assets are reused and other local work is preserved.
- Verification: 28 Chromium/WebKit hero/header checks across nine viewports from 320–1920px,
  including immediate/next-frame position consistency, scroll reversal and downward image motion
  through the entire section overlap in native/fallback modes,
  7 existing Chromium hero/menu checks and 12 responsive/accessibility checks passed (47 total).
  Typecheck, full lint and production build passed; final desktop/mobile WebKit screenshots were
  reviewed. The existing dev server still responds on port 3000.
- Follow-up: owner visual review and separately authorized production release; real-device Safari
  and production field Core Web Vitals were not exercised.


### CHG-20261004-01 — Wirkung image viewer and revised concept series

- Scope: three Wirkung images, enlargement controls, native modal, captions, image provenance
  and design documentation; existing photo/slogan grid retained.
- Outcome: rich original scenes guide the revised classical, modern and high-tech concepts after
  the sparse first series was rejected. Cards show concept disclosure and enlargement affordance;
  full images open with captions, cyclic buttons/arrows, Escape/backdrop close and focus return.
  Native links remain usable without JavaScript/dialog API and with modified clicks. Original
  assets are preserved; new images remain local visual review. The original section heading
  is restored per owner instruction. No deployment/push.
- Verification: 24 Chromium/WebKit checks at 320–1920 px plus 200% text/short viewport, axe,
  keyboard/focus, no-JS/no-API/new-tab fallback and reduced motion; four existing grid/gallery/homepage
  accessibility checks passed. Typecheck, lint and production build passed. Screenshots inspected;
  optimized WebP assets total about 630 KB. The local dev server remains available on port 3000.
- Follow-up: owner visual review of the revised series; separate approval before release.
  Real-device Safari and public production behavior were not exercised.

### CHG-20260925-01 — Shared configurator inquiry dialogs

- Scope: mini/full UI, shared lead contract/server validation, emails, idempotency, analytics and
  GTM recipe; privacy and design documentation.
- Outcome: incomplete sketches can be requested without price or invented dimensions. Full step 03
  opens the same persistent form. Close/edit preserves contacts/files; success requires explicit
  reset. Homepage plain form remains independent. New diagnostics are consent-gated and carry no
  configuration/contact data; one server-confirmed Primary conversion remains.
- Verification: 189 unit tests across the suite and added upload-failure check; typecheck/lint and
  production build passed. Full Playwright run plus focused rerun resolved affected selectors:
  Chromium/WebKit dialog checks cover 320/390/768/1440 px, axe, focus, Escape, files, detach,
  200% text, shortened keyboard viewport and event/no-replay semantics. 36 final focused browser
  checks passed; two environment-gated Google-tag tests remain skipped in local development.
  Deliveries/database writes were mocked; the local dev server remains available on port 3000.
- Follow-up: review interface, separately authorize deployment/GTM publication and production test;
  real mobile keyboard and live Tag Assistant were not exercised.


### CHG-20260910-01 — Migrated operational mailbox to IONOS

- Scope: IONOS mailbox provisioning, Apple Mail, mail DNS, form mail-flow audit and
  privacy disclosure.
- Outcome: `info@lichtsaum.com` receives and stores mail directly in IONOS Mail Basic. Resend still
  delivers form notifications to the same address, and the local public disclosure now names
  IONOS.
- Verification: outgoing delivery from the new mailbox and incoming delivery from Yandex passed;
  public DNS returns both IONOS MX records, the IONOS SPF policy and all three IONOS DKIM CNAMEs.
  Controlled Resend notifications arrived in the IONOS inbox, and the existing Resend subdomain
  records remain intact. All 40 relevant form tests and targeted ESLint checks passed. Production
  `/datenschutz` contains the new minimal Resend/IONOS wording and no reference to the former
  forwarding arrangement.
- Follow-up: none.


### CHG-20260906-02 — Applied CPC cap and adjacent-demand test

- Scope: campaign CPC ceiling, three Exact keywords, one RSA and conversion diagnostic follow-up.
- Outcome: CPC €5, budget €20/day and Maximize Clicks; new group 200547384672 enabled with ad
  823633352778 under review. Follow-up confirms all three new keys ELIGIBLE and zero traffic. Google Ads tag inactivity warning
  cleared; latest activity is September 6, while last attributed conversion remains August 22.
- Verification: validate-only and atomic six-operation mutation succeeded; independent API read
  confirms cap, budget, three Exact keys, pinned product copy and unchanged existing keyword statuses.
  Google Ads UI confirms Active goal and No recent conversions with today's tag activity.
- Follow-up: review moderation, disclosed search terms, CPC and qualified leads; transaction-ID
  deduplication remains unverified. Proposed first review September 13; no automation created.


### CHG-20260906-01 — Audited Google Ads demand and recommendations

- Scope: read-only campaign, keyword, conversion, recommendation and Keyword Planner audit.
- Outcome: 17/22 enabled keywords rarely served; 38 impressions, 4 clicks, €12.90 and 1 owner-confirmed
  test conversion through September 5, with 0 confirmed customer leads. Google flags the tag inactive; no CPC cap is set.
- Verification: API totals reconcile across days, keywords, groups and devices; live UI confirms
  totals, eight recommendations, CPC settings, tag warning and German Keyword Planner estimates.
  Production DOM checks confirm consent-dependent GTM/Ads/GA4 insertion and removal.
- Follow-up: CPC, keyword test and tag-activity follow-up are recorded in CHG-20260906-02;
  transaction-level deduplication and broader landing/ad improvements remain open. Do not resubmit test LS-2026-000027.


### CHG-20260823-01 — Added three Google Ads sitelinks

- Scope: campaign-level sitelink assets for campaign `24153758040`.
- Outcome: `Konfigurator`, `Referenzen` and `Eignung prüfen` are associated with the campaign and
  enabled; no other campaign setting was changed.
- Verification: Google Ads API validate-only passed; the six-operation atomic mutation succeeded;
  an independent read confirmed exactly three enabled sitelinks and campaign status `ENABLED`.
- Follow-up: monitor asset-level clicks and qualified leads after sufficient traffic accumulates.

### CHG-20260821-02 — Applied Google Ads keyword cleanup

- Scope: live campaign keyword statuses, Phrase-to-Exact replacement and validated Exact additions.
- Outcome: the owner explicitly kept campaign `24153758040` enabled; 7 wrong-intent criteria are
  paused, the mixed Phrase criterion was removed and recreated as Exact, and 7 validated Exact
  candidates were added; the final set contains 22 enabled and 7 paused criteria.
- Verification: Google Ads API validate-only passed; the atomic mutation succeeded; an independent
  post-mutation read and assertions confirmed campaign `ENABLED`, 22 enabled keywords, 7 paused
  keywords and 0 impressions, clicks or spend.
- Follow-up: monitor search terms, CPC and qualified leads; do not expand without evidence.


### CHG-20260821-01 — Live SERP validation of Google Ads keywords

- Scope: all 18 unique existing Google Ads queries, 20 additional candidates, direct competitors
  and current campaign state.
- Outcome: 11 existing queries are product-aligned, 1 is mixed and 6 have wrong intent; across the
  22 Ads criteria this maps to 14 keep, 1 restrict and 7 pause decisions. Seven controlled Exact
  candidates are prioritized, but no Ads keyword was changed.
- Verification: five parallel in-app Google Search tabs checked 38 German/Germany, non-personalized
  SERPs without CAPTCHA; Luminard appeared for 12/18 existing queries and 18/20 candidates. A Google
  Ads API read reported the campaign enabled, all three ads approved, and 0 impressions/€0 spend.
- Follow-up: owner authorization is required to pause the campaign and approve keyword cleanup;
  SERP relevance does not replace volume, CPC or conversion validation.


## Earlier material changes — read only when required

### CHG-20260820-03 — Segment-based light-panel allocation

- Scope: configurator geometry, panel allocation, pricing version and calculation fixtures.
- Outcome: each logo now receives one minimum panel; inscription length is allocated independently
  using one fitting panel or equal-panel sequences; the fixed electrical set remains one per valance.
  Pricing version is now `2026-08-20.v4`.
- Verification: the 9500 mm / `TSOMI` / two-logo case resolves to 2 × 600 mm + 1 × 1000 mm;
  targeted 39-test verification, full 165-test suite, typecheck, lint and `git diff --check` passed.
- Follow-up: none.

### CHG-20260820-02 — Paused B2B Google Ads campaign

- Scope: first LICHTSAUM Search campaign, B2B keyword structure, exclusions, ads, targeting and
  conversion verification.
- Outcome: campaign `24153758040` is paused at €20/day with Germany presence-only targeting,
  German language, Google Search only, three ad groups, 22 exact/phrase keywords, 32 negatives and
  three responsive search ads pointing to `https://www.lichtsaum.com/`; AI Max and automatically created
  assets are off.
- Verification: Google Ads UI confirmed the complete campaign structure and the sole Primary
  conversion `Projektanfrage – serverbestätigt`; a later Google Ads API read confirmed paused
  state, 0 impressions, €0 spend, all three homepage URLs and `REVIEW_IN_PROGRESS` for each
  replacement ad.
- Follow-up: keep paused until policy review, production destination/consent/conversion checks and
  separate owner authorization to enable.

### CHG-20260820-01 — Component-specific configurator pricing

- Scope: server-authoritative configurator pricing, calculation contract, pricing version and
  regression fixtures.
- Outcome: the former uniform +100% coefficient is replaced by electrical +25%, finished Volant
  +25% and LED-panel +100% coefficients; pricing version is now `2026-08-20.v3`.
- Verification: targeted pricing/lead tests passed (38 tests); full typecheck, lint and test suite
  passed (164 tests); `git diff --check` passed.
- Follow-up: none.

### CHG-20260819-02 — Server-rendered configurator explanation

- Scope: `/konfigurator` lower content, metadata option A, contextual links, responsive styling and
  SEO verification.
- Outcome: three owner-approved German sections now render on the server immediately after the
  wizard; two native links preserve the approved route journey, and Title/Description now qualify
  configuration with preliminary B2B-price intent. Russian review translations remain internal.
- Verification: 164 unit tests, typecheck, lint and production build passed; built HTML confirmed
  all content, one H1, two native links, no Russian copy and no `Product`/`Offer` Schema; targeted
  Playwright passed SSR/metadata/placement and 320 px accessibility/overflow checks. A broader
  accidental run exposed two unrelated pre-existing configurator interaction assertions recorded
  in the implementation plan.
- Follow-up: start `/referenzen` R1 only on owner request; no deployment was performed.

### CHG-20260819-01 — Configurator copy approval pack

- Scope: Phase K1/K2 research, German lower-block copy, metadata and contextual anchors for
  `/konfigurator`.
- Outcome: one proposed owner-review package now separates configuration, the restricted
  preliminary B2B-net calculation and manual object suitability; every factual sentence has an
  internal evidence trace, and no production copy or metadata was changed.
- Verification: cross-checked current configurator behavior, the calculation contract, CLM-029,
  route intent and metadata rules; checked German configurator/price terminology without importing
  external product claims; SEO/claims self-review completed.
- Follow-up: owner approval or revisions are required before K3 implementation.

### CHG-20260817-01 — Approved configurator and references SEO plan

- Scope: dated keyword evidence, route ownership and the next SEO iteration for `/konfigurator`
  and `/referenzen`.
- Outcome: a single decision document now fixes the sequence, owner-approved page boundaries,
  research/approval checkpoints, implementation steps, acceptance criteria and explicit
  exclusions. The 2026-08-17 Keyword Planner sample records all eight B2B seeds in the `0–10`
  range with no additional ideas, so no new landing page is planned.
- Verification: cross-checked the plan against the search-intent map, calculation contract,
  gallery route contract, claims register and the owner decisions in this task; documentation
  links and rolling context were updated; `git diff --check` passed.
- Follow-up: start Phase K1 only on the owner's request and stop for copy approval before code.

### CHG-20260814-02 — Canonical configurator pickers

- Scope: homepage mini-configurator and `/konfigurator` step 01 option controls.
- Outcome: composition, font, awning-color and light-color menus now use one shared accessible
  picker implementation with the homepage's diagrams, descriptions, swatches, selection states
  and keyboard behavior; native full-route `<select>` controls were removed. Routine selection
  changes no longer insert a transient calculation message into the controls layout, and picker
  option clicks do not trigger browser focus scrolling. The full-route preview now keeps the last
  valid SVG mounted during recalculation, matching the mini-configurator's stable preview model.
  Trigger clicks now prevent the focus/blur race that could reopen an already closed menu, and
  full-route dropdowns retain the overlay design while their triggers stay clickable above the
  list layer. An open full-route picker now also owns a stacking context above the step action,
  so a downward menu cannot be painted underneath the `Weitere Optionen` button.
- Verification: typecheck, lint, `git diff --check`, 163 unit tests and live in-app verification
  on both routes passed; the four picker menus opened and closed without selection, the full-route
  preview remained mounted during a normal selection, an actual arrow-coordinate click closed the
  open menu, and the color list remained topmost where it overlapped the step action. Targeted
  Playwright could not launch Chromium because of the sandbox's macOS process restriction.
- Follow-up: rerun the targeted Playwright interaction suite when the local runner is permitted.

### CHG-20260814-01 — Harden mobile drawer for Safari focus and anchoring

- Scope: mobile header drawer positioning, opening synchronization and pointer-close focus state.
- Outcome: the panel is fixed to the dialog's right edge, starts closed synchronously before a
  two-frame open transition, and a global pointer-versus-keyboard input modality prevents false
  orange focus styling across menus and controls. Keyboard focus indication and focus return remain
  available.
- Verification: targeted TypeScript lint and `git diff --check` passed. Full typecheck/lint are
  blocked by pre-existing errors in `mini-configurator.tsx`; Playwright is blocked by the shared
  port and macOS Chromium process restrictions. Real Safari verification remains open.
- Follow-up: verify open/close and focus behavior on the owner's Safari device.

### CHG-20260812-09 — Stable mobile menu drawer

- Scope: mobile header wordmark, drawer entry/exit motion, scroll locking and accessibility.
- Outcome: the drawer now opens and closes through an interruptible 260ms transform transition;
  the native dialog remains mounted through exit, the backdrop fades separately, and the original
  header logo keeps one unchanged rendering and geometry. Reduced motion removes lateral travel.
- Verification: typecheck, lint and `git diff --check` passed. Live in-app review at 393×852
  confirmed identical logo/content bounds before and during open, one brand instance, zero
  horizontal shift, the two-way `open`/`closed` state, animated close and focus return. The
  targeted Playwright run was inconclusive because the shared dev server's HMR connection left
  that runner unhydrated; the shared server was not restarted.
- Follow-up: rerun the targeted mobile-navigation Playwright test when the shared dev runtime is
  healthy; no product-code follow-up is currently identified.

### CHG-20260812-08 — Sequential full-width configurator

- Scope: `/konfigurator` calculator composition, responsive step flow and result visibility.
- Outcome: one full-width schematic preview now precedes a compact three-step control area on
  desktop and mobile. Step 01 repeats the homepage `Gestaltung / Maße / Farbe & Licht` layout;
  step 02 shows all six services without disclosures; trailing actions keep a stable position, and
  specification plus preliminary net price are not rendered until step 03.
- Verification: typecheck, lint, `git diff --check`, 163 unit tests and production build passed;
  production SSR returned 200. Live in-app review at 1159×863 and 390×844 confirmed the three
  desktop columns, ordered mobile stack, two-column/one-column services, no disclosures, no early
  price and no horizontal overflow.
- Follow-up: none.

### CHG-20260812-07 — Server-controlled configurator coefficient

- Scope: `/konfigurator` pricing, client-facing calculation contract and pricing documentation.
- Outcome: the displayed preliminary net price now applies a server-only 100% commercial
  coefficient to the internal component subtotal; pricing version `2026-08-12.v2` invalidates
  stale confirmations, and the browser no longer receives the coefficient field.
- Verification: 163 unit tests, typecheck, lint, `git diff --check` and production build passed;
  the SSR configurator e2e passed. The remaining parallel/interactive e2e scenarios timed out
  in the shared local dev-server/font-storage hydration path and had no pricing assertion failure.
- Follow-up: none for the pricing change; the unrelated local e2e hydration timeouts remain
  unverified.

### CHG-20260812-06 — Compact fixed scene height

- Scope: `/konfigurator` fixed-background scene height across desktop and mobile.
- Outcome: the current intro was reduced by another 30%; the stage now uses a responsive compact
  height while preserving the full copy, fixed technical background and lower-content overlap.
- Verification: typecheck, lint, `git diff --check`, production build, targeted configurator e2e
  8/8, in-app browser review at 1440×900 and 390×844, static-media checks and zero overflow passed.
- Follow-up: none.

### CHG-20260812-05 — Fixed configurator background

- Scope: `/konfigurator` intro scroll mechanics and upper-block height.
- Outcome: the technical visual and scrim remain fixed as the intro background; normal-flow copy
  and calculator content move over it, the calculator covers it from below, and the background is
  hidden once the intro fully leaves the viewport. The intro is now one viewport tall, roughly 40%
  shorter than the previous desktop scene.
- Verification: typecheck, lint, `git diff --check`, production build, targeted configurator e2e
  8/8, in-app browser desktop/mobile fixed-position checks, overlap checks and zero mobile overflow
  passed.
- Follow-up: none.

### CHG-20260812-04 — Sticky scene crop refinement

- Scope: `/konfigurator` intro scene height, technical-image placement and edge treatment.
- Outcome: the sticky stage is slightly shorter; the technical visual is statically positioned a
  little higher and farther right; layered vignette gradients hide crop edges across responsive
  widths while the calculator still rises over the scene from below.
- Verification: typecheck, lint, `git diff --check`, production build, targeted configurator e2e
  8/8, in-app browser review at 1508×938 and 390×844, static-media checks, overlap checks and
  zero mobile overflow passed.
- Follow-up: none.

### CHG-20260812-03 — Sticky configurator concept scene

- Scope: `/konfigurator` intro visual, image treatment and scroll behavior.
- Outcome: the rejected inline SVG was replaced by the existing technical concept visual on the
  right; a left fade, sticky stage, upward-moving copy and calculator-surface overlap now mirror
  the main-page scroll language.
- Verification: 162 unit tests, typecheck, lint, production build, targeted configurator e2e 8/8,
  in-app browser desktop/mobile review, mid-scroll sticky checks, end-of-scene overlap checks and
  no horizontal overflow at 390px passed.
- Follow-up: none.

### CHG-20260812-02 — SEO canonical and social metadata hardening

- Scope: canonical-origin validation, apex-host redirect contract, route-specific Twitter metadata
  and favicon asset.
- Outcome: production indexing fails closed for noncanonical `SITE_URL` values, Vercel redirects
  `lichtsaum.com` to `www.lichtsaum.com`, and public inner routes no longer inherit homepage
  Twitter cards.
- Verification: targeted SEO suite passed 162 tests, typecheck and lint passed; production deploy
  and one-hop external redirect remain unverified.
- Follow-up: deploy owner-approved release, then verify production redirects, CWV and Search Console.

### CHG-20260812-01 — Compact configurator introduction

- Scope: `/konfigurator` server-rendered introduction, German copy and technical SVG example.
- Outcome: the oversized hero became a compact responsive composition with a two-line H1, shorter
  explanation, accessible front-view dimensions and an example `Montserrat` label.
- Verification: 156 unit tests, typecheck, lint, targeted configurator e2e 8/8, in-app browser
  desktop/mobile review and no horizontal overflow at 390px passed.
- Follow-up: none.

### CHG-20260811-05 — Unit suite is smaller and domain-correct

- Scope: Vitest environments, duplicated tests, live integration routing and obsolete legal gate.
- Outcome: unit tests run in Node by default, browser suites opt into jsdom, duplicate tests were
  consolidated, and the live lead flow has a separate explicit integration command.
- Verification: 156 unit tests, typecheck, lint, integration discovery and production build passed.
- Follow-up: run `pnpm test:integration:live` only with owner-approved synthetic credentials.

### CHG-20260811-04 — Progress history is preserved

- Scope: agent context retention rules.
- Outcome: only the three newest records are read by default; older material records remain in
  `CHANGE_HISTORY` and are read on demand.
- Verification: recent-count, marker pairing and record preservation checks passed.
- Follow-up: none.

### CHG-20260811-03 — Shallow agent context protocol

- Scope: repository rules, progress routing and core architecture documents.
- Outcome: default startup reading is limited to marked briefs and the three newest changes.
- Verification: marker uniqueness, record count, relative links and diff whitespace checked.
- Follow-up: add or refresh `AGENT_BRIEF` when a material domain document is next changed.

### CHG-20260811-02 — Current-only documentation cleanup

- Scope: progress, roadmap, decision log and retired Search/Ads handoff documents.
- Outcome: closed phases were removed from active reading paths; old handoffs are tombstones only.
- Verification: all Markdown relative links passed and `git diff --check` was clean.
- Follow-up: none.

### CHG-20260811-01 — Publication decisions returned to the owner

- Scope: repository publication, indexing, Ads, form and attachment governance below `AGENTS.md`.
- Outcome: older automatic publication blockers were retired; concrete choices use
  `Спросить у пользователя`.
- Verification: active documentation was checked for superseded O7/O10/O12 restrictions.
- Follow-up: ask for the selected state before an external or production action.
<!-- CHANGE_HISTORY:END -->

## Detailed current state — read only when the task needs it

### Application and UI

- Next.js 16 App Router, strict TypeScript, pnpm and Tailwind CSS are configured.
- The responsive German homepage currently follows this rendered order:
  Hero → principles → transformation → precision → Eignung → LICHTSAUM STUDIO → Referenzen → FAQ
  → project check → footer.
- The owner-approved hero H1 is `Markise wird Markenlicht.`; the current hero composition remains
  owner-locked until the owner requests a change.
- Responsive navigation, `/kontakt`, `/referenzen`, `/impressum` and `/datenschutz` are implemented.
- The current reference registry contains three real-object photographs and one labelled concept
  visual approved by the owner for public use. Public copy does not describe them as completed
  LICHTSAUM projects.
- The homepage mini-configurator and the full `/konfigurator` route are implemented locally. The
  full route uses server-reproduced font metrics, geometry and pricing version `2026-08-12.v2`; its
  server-rendered intro now uses a fixed technical concept background before the calculator.
- The configurator displays the restricted commercial-project `Vorläufiger Nettopreis` defined by
  CLM-029; B2C/PAngV and Ads price use remain legal questions to show the owner.

### Unified inquiry flow

- Plain and configurator inquiries use one validation, persistence, notification, idempotency and
  conversion path under `docs/architecture/unified-lead-form-contract.md`.
- The form requires email and supports optional phone, message and up to five JPG/PNG/WebP/PDF
  files, at most 15 MB each and 50 MB combined, when attachments are enabled.
- Neon PostgreSQL stores leads/file metadata in `eu-central-1`; Private Vercel Blob stores enabled
  files in `fra1`; Resend sends the internal notification and customer receipt.
- The nullable `leads.request_context` migration is applied to the production Neon database.
- Accepted inquiries have a public `LS-YYYY-NNNNNN` request number. Customer receipts contain no
  message or file content.
- `LEAD_INTAKE_ENABLED` and `LEAD_ATTACHMENTS_ENABLED` are independent production controls. Their
  absent/false behavior is a code default, not a publication decision. Ask the owner which state to
  publish after showing runtime, abuse, malware and processor evidence.

### Search, consent and measurement

- Metadata, canonical, robots, sitemap, truthful 404 handling and minimal verified
  `Organization`/`WebSite` JSON-LD are implemented behind the production Search boundary.
- The custom first-party consent manager and Basic Consent Mode v2/GTM loader are implemented.
  Analytics and Marketing choices are independent; `ad_personalization` remains denied.
- The typed event adapter sends sanitized GA4 lead data and keeps the server-created `lead_id` only
  for the direct Google Ads Transaction ID.
- Existing owner-controlled resources:
  - GTM container `GTM-TNW2DDMZ`;
  - GA4 stream `G-DHZHKSXMVT` with two-month retention;
  - Google Ads account `363-818-4039`;
  - Primary action `Projektanfrage – serverbestätigt`, ID `18383141630`, label
    `oUIGCLrozN8cEP714b1E`.
- The GTM workspace remains unpublished in the last recorded state. No campaign/spend activation is
  recorded in the repository.

### Legal and operational state

- German `Impressum` and `Datenschutzerklärung` are implemented from owner-confirmed provider
  facts. Compliance documents are engineering assessments, not legal advice.
- Lead/private-file retention is 90 days; signed download links expire after seven days. Operational
  mailbox deletion remains owner-managed.
- Known questions remain: Vercel Hobby commercial/DPA coverage, malware handling for uploads,
  final production cookie/network evidence, consumer-facing configurator/PAngV treatment and
  processor onboarding.
- Product operations are still unverified for supplier contract, full technical file, service
  geography, installation/electrical responsibility, capacity, target margin and warranty.

### Last recorded verification

- The latest implementation milestone recorded passing unit, typecheck, lint, production build,
  accessibility and responsive browser checks.
- The latest configurator-intro revision passed 162 unit tests, typecheck, lint, production build,
  targeted e2e 8/8, and in-app browser desktop/mobile and scroll checks; these results describe the
  local state only.
- These results describe the local state at the time they were run. Re-run checks proportional to
  any new change and revalidate the actual production deployment before relying on it.

## Do not reopen completed work by default

Unless the owner requests a change or a regression is reproduced, do not reimplement:

- the hero scroll scene, mobile navigation, reference gallery, contact map or footer wordmark;
- the mini/full configurator geometry, font measurement and pricing solver;
- the unified lead persistence/receipt/request-context contract;
- the consent manager, destination-scoped event adapter or existing Google resource model;
- the current legal-page structure, canonical identity or approved gallery registry.

Read the owning domain document only when the current task touches that area.

## Open owner questions

- Which remaining site pages/content should be completed next?
- Should the next production release enable indexing, lead intake and attachments?
- Should Search Console/DNS, advertiser verification and controlled synthetic-lead diagnostics be
  performed now?
- Should the current GTM workspace and Google measurement boundary be published/activated?
- What are the confirmed supplier, service geography, installation/electrical ownership, capacity,
  warranty and commercial terms?
- How should the known Vercel Hobby/DPA, upload-malware and configurator B2C/PAngV risks be handled?
- Should the expanded form first receive the planned atomic multi-dimensional abuse limiter and
  global circuit breaker?

## Next action

1. Follow the owner's latest concrete request; do not restart completed milestones.
2. Inspect only the relevant source-of-truth document and code.
3. Before an external/public action, present the exact proposed state and ask the owner.
4. Update this file only when the current state, next action or open questions materially change.

## Read next

- Publication/external actions: `docs/architecture/publication-governance.md`
- Application/forms/environments: `docs/architecture/system-architecture.md`
- Unified inquiry/configurator context: `docs/architecture/unified-lead-form-contract.md`
- Current work only: `docs/architecture/implementation-roadmap.md`
- Domain routing: `docs/README.md`
