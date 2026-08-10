# PROGRESS.md

## Context Beacon

- Last updated: 2026-08-10
- Current stage: public production landing / product validation still pending
- Active track: local gallery review now contains three supplied real project photographs and one
  temporary concept visual; awaiting one more rights-cleared project photograph while validating
  the underlying offer
- Verified state:
  - a Next.js 16 App Router prototype is initialized with pinned dependencies and strict TypeScript;
  - the responsive German landing is implemented locally for the exact-category B2B retrofit offer,
    with restaurants/cafés as the primary segment and `Projekt prüfen lassen` as the CTA;
  - the final project-check uses one required email plus optional phone, short message and up to five
    JPG/PNG/WebP/PDF files of at most 15 MB each; in explicitly enabled environments it persists the
    lead in Neon, uploads files to Private Vercel Blob and sends an idempotent internal Resend
    notification; accepted leads now also have a separate idempotent customer receipt implemented
    locally with a public `LS-YYYY-NNNNNN` request number and no message/file content, while its
    production delivery test remains pending;
    the production form now reconciles the persisted lead status when the browser loses the final
    Server Action response, preventing a successfully accepted request from being reported as lost;
    confirmed submissions replace the form with an accessible animated acknowledgement, while a
    repeat action clears the previous fields/files and restores focus to the e-mail input;
  - the responsive hero uses an owner-supplied, aligned off/on concept pair: a close commercial
    awning and modern facade transition into technical linework, while only the `LICHTSAUM`
    lettering illuminates during the scroll scene; mobile preserves the same narrative with a shorter
    scroll distance and the following principle strip covering the sticky image from below, while
    `prefers-reduced-motion` remains static; owner-supplied or expressly approved
    visual assets are authorised for use on the site;
  - production canonical, sitemap, robots and security-header paths are implemented; no
    Schema, GTM, analytics, CMP or CRM integration is active; the production Resend notification
    path is active;
  - a Neon PostgreSQL database in `eu-central-1` has the versioned `leads` and `lead_files` schema;
    production intake was live-tested from browser submission through persistence and notification;
  - a private Vercel Blob store in `fra1` is integrated in code with server-authorized direct
    uploads, exact random paths, a 30-minute upload grant, limits of five files × 15 MB / 50 MB
    combined and a protected daily 90-day retention cleanup; a synthetic private Blob was uploaded,
    inspected and downloaded through a seven-day HMAC-signed server link; malware handling and
    final processor/privacy review remain open release risks;
  - Resend is configured in `eu-west-1` with verified `lichtsaum.com` DNS and a sending-only,
    domain-scoped API key; live tests confirmed `sent` and `delivered` events for both a browser lead
    without files and an integration lead with a private PNG, with `Reply-To` set to the requester;
  - all three `#wirkung` cards use owner-supplied night images, monochrome by default and colour
    on hover, focus or activation;
  - the new `#praezision` section presents three interactive, explicitly schematic views for
    `Lichtbild`, `Gestaltung` and `Aufmaß`; connection and cable routing are excluded from the
    drawings and remain object-specific;
  - `#kosten` is fully replaced by the homepage-only `#konfigurator` / `LICHTSAUM STUDIO` module:
    a responsive front-view SVG uses real valance and letter dimensions in millimetres, exact
    selected-font measurement, eight self-hosted fonts, three explicit composition modes, colour controls and a
    compact fixed night preview below a single horizontal rule with a softly fading gray atmosphere layer, explicit fit errors and a versioned non-personal `sessionStorage` transfer
    contract that starts writing only after user interaction; local validation now limits valance height to 200–300 mm and letter height to
    1–180 mm without silently changing entered values;
    no price, formula, upload, AI render or full configurator route is implemented; the
    owner-supplied component costs are documented as an internal future calculation contract only;
  - the accepted three-pass marker system is applied to the HTML/Caveat transformation slogan and
    individually approved compact section eyebrows, including the new `FAQ` treatment; the
    superseded `RETROFIT` loop is retired;
  - the homepage render is shortened to Hero → principles → transformation → precision → Eignung
    → configurator → hidden Referenzen position → FAQ → project check → footer; the source for
    `Varianten`, `Ablauf`, `Projektgrenzen`, `Nachweise` and `Alternatives` remains in the repo but
    is not rendered;
  - the reference registry is `review` with three real project photographs and one explicitly
    labelled concept visuals; local development shows the complete four-slot grid while production
    remains hidden until four real projects, verified captions and publication permissions exist;
    the supplied photos are stored as original PNG sources plus optimized WebP derivatives;
  - mobile navigation now uses a compact logo/menu header and an accessible modal right drawer;
    the approved information links are `Produkt`, `Konfigurator`, conditional `Referenzen` and
    `Kontakt`, while the project-check CTA remains separate; home destinations use absolute
    `/#…` anchors and route links remain canonical paths;
  - a dedicated `/kontakt` scene now uses a local, public-domain-derived Natural Earth 1:10m map
    of Western and Central Europe; Germany has one uniform fill without internal borders and Berlin
    is the only location marker, alongside owner-confirmed e-mail and telephone numbers, the
    existing project-check path and a link to `Impressum`; the street address stays on the legal
    page, while service cities, delivery, measurement, installation and electrical regions remain
    deliberately absent pending owner confirmation;
  - the footer closes with a restrained illuminated `LICHTSAUM` signature: it gently brightens once
    on viewport entry with a cold white-blue light, respects reduced motion, and sits above only the
    quiet `Impressum` and `Datenschutz` links;
  - a proposed compact `LICHTSAUM` mark now has one vector master plus local favicon, Apple icon and
    Instagram exports; the local prototype uses it as its browser icon, while identity acceptance
    and trademark availability remain pending owner review;
  - dedicated German `/impressum` and `/datenschutz` pages use the owner-confirmed Pixel-Ring
    provider facts for the same responsible business, identify LICHTSAUM as its offer and describe
    only the current prototype data flows; the obsolete EU ODR link and Pixel-Ring-specific
    chat/OpenAI processing were not copied; unresolved legal-review inputs remain documented for
    final professional review without exposing internal markers on the public pages;
  - unit, lint, type, build, WCAG, scroll-scene and seven-width responsive checks pass;
  - Google Stitch project `13581496807405121738` is accessible;
  - canonical visual reference is screen `12ee44ad855e416db92641282c2f7629`;
  - the Stitch screenshot/export and locally generated concept imagery are recorded under
    `DesignPrototip/`;
  - requested working brand is LICHTSAUM; legal/company-name/trademark availability is not checked;
  - the current supplier catalogue verifies standard illuminated-valance formats and trade prices,
    but no LICHTSAUM supplier contract or complete technical file has been provided;
  - current public evidence confirms a small German exact-retrofit category and a more developed
    French supply layer; exact German search volume/CPC is not available;
  - `temp/` contains legacy donor documents and is not a source of truth.
- Proposed product decisions awaiting owner acceptance:
  - German-first B2B lead-generation product for a custom illuminated replacement valance on an
    existing compatible commercial awning;
  - primary segment: independent restaurants/cafés with evening trade;
  - proposed pilot: Berlin/Brandenburg only if delivery capacity is real;
  - flagship hypothesis: one 2400 × 200 mm illuminated field in a 300 mm finished valance;
  - category: `Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen`;
  - CTA: `Projekt prüfen lassen`;
  - decision status: `VALIDATE FIRST`; the local prototype is not a product `GO`, public calculator
    or production landing.
- Existing accepted technical decisions:
  - Stitch is a design reference, not production source code;
  - current Next.js 16 App Router line + TypeScript strict; exact patch will be pinned at scaffold;
  - server-rendered/static-first and production-only indexing;
  - Google Search, Ads, analytics, consent and Schema foundations are project invariants;
  - primary conversion is a server-confirmed valid lead.
  - Next action:
  - obtain one further original photograph tied to one real completed project, confirm
    client/owner publication permission and verify each factual German caption;
  - replace the remaining concept item inside the protected `review` registry, then repeat
    the Stitch comparison and desktop/mobile crop and focal-point review before changing it to
    `published`;
  - owner reviews and accepts or revises the first homepage mini-configurator before work begins on
    the separate full configurator route;
  - owner reviews the local prototype against the product strategy and confirms requested revisions;
  - owner accepts, revises or rejects `docs/strategy/product-market-decision.md`;
  - resolve supplier, technical, service, geography, margin, capacity and project-evidence inputs;
  - execute the first 30-day deliverability/customer/partner validation gate;
  - continue production monitoring while completing the remaining product, legal and operational
    validation gates.
- Blockers / owner inputs:
  - supplier identity/contract, purchase/logistics terms and complete-system technical documents;
  - ownership of design, measurement, removal, installation, electrical work, authority support,
    maintenance and warranty;
  - actual service geography and installation capacity;
  - target margin, minimum invoice and actual German direct costs;
  - physical sample plus one further completed real project with an original photo, verified facts
    and client/owner publication rights; the three supplied photos still need their publication-rights
    and project-fact confirmation;
  - retention periods, CMP decision and final legal review.
- Read next:
  - `docs/strategy/product-market-decision.md`
  - `docs/strategy/market-and-competitor-evidence.md`
  - `docs/strategy/go-to-market-and-landing-brief.md`
  - `docs/content/claims-and-evidence-register.md`

## Milestones

| Area | Status | Exit condition |
| --- | --- | --- |
| Repository rules | Complete | Root contracts and domain docs are consistent |
| Product discovery | Strategy drafted / decision pending | Owner accepts scope, segment, geography and validation gates |
| Product validation | Not started | Deliverability, paid demand, compatibility and contribution gates pass |
| Design system | Local prototype complete | Owner approves responsive visual implementation |
| Content | German draft complete | Claims, legal facts and final copy approved |
| Application | Public production landing active | Product validation gates pass |
| Lead flow | Production persistence, private file and delivered email verified | Malware handling and processor/privacy approval pass |
| Search foundation | Production metadata, canonical, robots and sitemap verified | Schema and Search Console validation complete |
| Analytics/consent | Planned | Consent matrix and conversion QA pass |
| Legal | Local pages implemented / production review pending | Final vendors, retention and business-specific legal review confirmed |
| Launch | Production active / validation ongoing | Remaining release risks are resolved |

## Latest material updates

### 2026-08-10 — Public request number and customer receipt implemented locally

- Added a stable public `LS-YYYY-NNNNNN` request number derived from the existing database ID and
  Berlin calendar year, without a schema migration; the random technical lead ID remains internal.
- Confirmed submissions show the public number in both the normal and recovered success paths.
- Added a separate idempotent Resend receipt to the requester after the lead reaches the accepted
  state. It contains only the public number and service copy; delivery failure is logged without
  contact data and does not reverse the accepted lead.
- Updated the live privacy copy and processing register. Unit, type, lint and production-build
  checks pass; deployment and a controlled production delivery test remain pending.

### 2026-08-09 — Third real reference photo added

- Added the supplied 1448 × 1086 evening photo of a restaurant facade with a terrace and several
  illuminated awnings to the wide `center-top` gallery slot, replacing the former entrance detail
  concept.
- Renamed the asset to `lichtsaum-referenz-restaurant-garten-abend`, kept the original PNG in
  `DesignPrototip/assets/` and generated the optimized WebP used by the site in
  `public/images/referenzen/`.
- Added a factual German `alt` text and caption describing the visible restaurant facade, terrace,
  awnings and `GARTEN` lettering. The registry remains in local `review` until publication rights
  and the one remaining real project are confirmed.

### 2026-08-09 — Second real reference photo added

- Added the supplied 1254 × 1254 evening photo of a gastronomy facade with three illuminated
  awnings to the tall `left-tall` gallery slot, replacing the first temporary restaurant concept.
- Renamed the asset to `lichtsaum-referenz-gastronomie-bar-abend`, kept the original PNG in
  `DesignPrototip/assets/` and generated the optimized WebP used by the site in
  `public/images/referenzen/`.
- Added a factual German `alt` text and caption describing the visible facade, awnings and
  lettering only. The registry remains in local `review` until publication rights and the two
  remaining real projects are confirmed.

### 2026-08-09 — First real reference photo added

- Added the supplied 1457 × 1080 photo of a commercial facade with two illuminated awnings to the
  wide `center-bottom` gallery slot, replacing the temporary terrace concept.
- Renamed the asset to `lichtsaum-referenz-gewerbefassade-ahouse-abend`, kept the original PNG in
  `DesignPrototip/assets/` and generated the optimized WebP used by the site in
  `public/images/referenzen/`.
- Added the German `alt` text and factual caption without naming a client, city, manufacturer,
  installation scope or unverified LICHTSAUM project relationship. The registry stays in local
  `review` until publication rights and the remaining three real projects are confirmed.

### 2026-08-09 — Animated lead acknowledgement implemented

- Replaced the small inline submitted notice with the owner-selected full-width confirmation state:
  the contact/file controls leave the stage, a restrained check and acknowledgement enter, and the
  original submit action is no longer present after a confirmed server result.
- Added a `Weitere Anfrage senden` action that revokes local file previews, clears the form and
  returns keyboard focus to the required e-mail field. The acknowledgement copy mentions files only
  when the visitor actually attached them.
- Kept every motion segment at 160–240 ms with strong project easing, transform/opacity-only
  transitions, a 40 ms content stagger, pointer-gated hover feedback and a no-movement reduced-motion
  state. Desktop/mobile browser captures, the reset interaction, focused E2E, unit suite, lint,
  typecheck and production build pass.

### 2026-08-08 — Production lead file flow repaired and reverified

- Reproduced the production attachment failure and added bounded structured diagnostics that log
  only the Vercel Blob request phase and a redacted error classification, never contact fields,
  filenames, request payloads or credentials.
- Replaced malformed production Blob and Resend credentials with the already verified local
  server-only values, normalized the Blob read-write token at the application boundary and kept
  direct browser-to-Private-Blob uploads for the documented 15 MB per-file limit.
- Fixed the callback/client-confirmation race: a Vercel completion callback may mark a file as
  uploaded before the browser confirms it, and that repeated confirmation is now idempotent while
  still requiring the active random upload token.
- Reverified the current production deployment through browser submission with a JPEG: the private
  upload completed, the lead reached the accepted state, Resend accepted the operational
  notification and the visitor received the successful confirmation. Malware handling remains the
  separate open release risk.

### 2026-08-06 — Production lead-confirmation recovery

- Verified that the reported production submission was persisted with its private file and reached
  status `new`; no contact fields or message content were read during diagnosis.
- Fixed the false-negative browser state: after a lost final Server Action response, the form now
  checks the random non-personal lead ID and restores the successful confirmation when persistence
  already completed. The failure card no longer labels a runtime failure as a completed prototype
  check.
- Added the production sitemap implementation and baseline response security headers. Deployed
  commit `ae9b875` to the existing Vercel production project and verified the deployment as `Ready`.
- Confirmed in the Vercel account that Hobby is active and the dashboard shows no publication
  restriction; the earlier internal assumption that Pro was required is withdrawn.

### 2026-08-06 — Evidence-backed legal marker reduction

- Closed seven release markers from existing owner-confirmed facts and verified code: provider
  designation, current absence of editorial publishing and optional tracking, user-initiated
  configurator storage, absence of automated decisions/profiling, and an explicit Art. 21 DSGVO
  objection notice.
- Closed the remaining company-specific prompts after the owner confirmed no register entry and no
  separately appointed data-protection officer; employee count is neither requested nor published,
  because the existing VSBG statement already records the confirmed participation position.
- Filled the vendor register with the known legal entities, regions, transfer mechanisms and
  retention criteria; closed the email-provider and retention markers.
- Kept four deployment/security-specific legal inputs open; production indexing remains
  fail-closed until they are resolved.

### 2026-08-06 — Mini-configurator physical limits and internal cost contract

- Centralized the local mini-configurator limits at 200–300 mm inclusive for valance height and
  1–180 mm inclusive for letter height; out-of-range values remain visible, receive an accessible
  German error and block continuation without automatic clamping.
- Kept the version-2 non-personal `sessionStorage` shape and key unchanged while rejecting stored
  configurations outside the new limits on restore.
- Recorded the owner-supplied electrical, running-metre and 600/1000/1200 mm panel inputs as
  internal net component costs only. No price or panel allocation appears in the UI; public
  pricing, maximum panel count and mounting gaps remain gated.

### 2026-08-04 — Approved compact navigation and Kontakt entry

- Applied the owner-approved header sequence `Produkt · Konfigurator · Referenzen · Kontakt` plus
  the separate `Projekt prüfen lassen` CTA; removed `Eignung` and `FAQ` from the global menu while
  keeping both sections in the homepage flow.
- Pointed `Produkt` to `Eine Fassade. Zwei Ansichten.` at `/#wirkung` and centralized gallery
  visibility so every route receives the same navigation state. Local/protected review shows the
  disclosed gallery route; production remains fail-closed until four real projects are published.
- Reworked `/kontakt` into a full responsive architectural map scene based on the public-domain
  Natural Earth 1:10m countries dataset. The local SVG shows accurate country outlines across
  Western and Central Europe, keeps Germany as one uniform highlighted fill without internal
  administrative lines and uses Berlin as the only orange geographic focus. It adds no external
  map request, tracking or consent dependency.
- Kept only confirmed e-mail and telephone contacts, the existing project-check CTA and a link to
  the exact provider details in `Impressum`; removed the street address from the contact view. No
  unverified service, delivery, installation, electrical or response-time claim was introduced;
  those content decisions remain the next owner step.

### 2026-08-04 — Concise object-specific FAQ

- Applied the owner-approved marker loop to the short `FAQ` eyebrow and implemented the documented
  visible heading `Fragen.` without circling the large typeset H2.
- Removed the internal concept-status introduction and reduced the accordion from six entries to
  five remaining objections: compatibility, optional review material, permission, power/electrical
  responsibility and cases where a light valance is not the appropriate solution.
- Kept the first contact low-friction by stating that email is sufficient and all supporting
  material is optional. No timing, warranty, waterproofing, nationwide-service or universal-fit
  claim was introduced; production claim approval remains pending.
- Added focused browser coverage for the heading, marker, exact question set, removed prototype
  copy and native disclosure interaction.

### 2026-08-04 — Contextual legal release markers

- Removed the large prototype-status disclaimer from the Datenschutzerklärung intro.
- Added 16 bright yellow `Intern / vor Livegang` markers directly beside every unresolved input in
  Impressum and Datenschutz: provider/register/regulated-activity/VSBG checks plus DPO, hosting,
  logs, `sessionStorage`, optional tags, email/CRM, production form/files, recipients/transfers,
  retention, Art. 21 objection wording, automated decisions and transport security.
- The annotations use `data-legal-review="required"`, appear only while the site is non-indexable
  and are not public legal copy. A fail-closed release assertion blocks production indexing while
  any marker remains unresolved.
- Removed the previously asserted § 25(2)(2) TDDDG conclusion for `sessionStorage`; the current
  automatic write behavior is now explicitly marked for a later legal/technical decision.

### 2026-08-04 — LICHTSAUM Impressum and Datenschutzerklärung

- Replaced the two legal placeholders with dedicated German pages in the shared LICHTSAUM visual
  system, including the global header/footer, skip links, responsive long-form typography, contact
  links and route-specific production metadata.
- Centralized the owner-confirmed responsible provider facts from the supplied Pixel-Ring legal
  pages: NVKV Werbeagentur Inh. Ivan Novikov, Berlin address, generic NVKV email, telephone numbers
  and VAT ID. LICHTSAUM is identified transparently as an offer of that provider.
- Adapted the privacy copy to the repository rather than copying unrelated Pixel-Ring flows:
  documented server access logs, direct contact, transient prototype-form validation, local file
  previews and browser-session configurator storage; explicitly recorded that analytics, ads, GTM,
  CRM, chat, AI and external media are inactive.
- Preserved the VSBG participation statement but excluded the obsolete EU ODR/OS-platform link.
  Production hosting, processors and concrete retention remain a release blocker and are visibly
  marked for completion before public activation.
- Corrected prototype-form messaging to distinguish transient server-side validation from
  persistent storage or forwarding as a real project request.

### 2026-08-04 — Restrained illuminated footer

- Replaced the earlier oversized footer brand treatment with a wordmark approximately one third of
  that display scale and a single gentle `1600ms` opacity illumination on viewport entry.
- Removed the directional wipe, bright lamp-like glow and background light pool; reduced motion
  receives the illuminated end state without animation.
- Owner review changed the illuminated state to a slightly brighter cold white-blue light and
  removed the boxed utility navigation plus the prototype-status copy. Only the crawlable
  `Impressum` and `Datenschutz` links remain below the wordmark.
- Verified strict TypeScript, the focused footer interaction, automated WCAG 2.2 A/AA checks and all
  seven responsive overflow widths. Repository-wide lint currently stops on a separate concurrent
  `react-hooks/set-state-in-effect` error in `src/features/lead-form/lead-form.tsx`; two earlier
  production-build attempts were externally terminated during Turbopack with `SIGTERM` / exit
  `143`, without a reported compilation error.

### 2026-08-04 — Minimal final project-check CTA

- Replaced the long technical questionnaire with the documented low-friction first-contact shape:
  required email, optional phone, optional short message and one optional file selector.
- Rebuilt the section as an open architectural two-part composition, `01 / Kontakt` and
  `02 / Datei`, with a full-width display heading and no sticky explanatory sidebar or enclosed
  form card. Mobile keeps the same semantic sequence in one column.
- Compressed the section intro to the owner-approved marker eyebrow `PROJEKT-CHECK`, H2
  `Ihr Projekt.` and one support line, `E-Mail genügt. Dateien optional.`; removed the
  redundant marketing-facing `Prototyp` label and repeated CTA wording.
- Reduced the attachment column to `02 / DATEIEN`, the concise H3 `DATEIEN ANHÄNGEN.` and the
  selector; removed its explanatory paragraph, shortened the local prototype notice and aligned
  the selector with the first contact field.
- Removed development/prototype disclaimers from the visible form surface. The submit row now
  contains only a concise neutral `Datenschutzerklärung` link and the CTA; the verified backend
  state remains validation-only until a production lead provider, storage and retention are approved.
- Added local-only validation for at most five JPG, PNG, WebP or PDF files of 15 MB each. Images
  receive local blob thumbnails, PDFs receive labelled icon tiles, and every attachment remains
  inside the selector as a square responsive tile with independent removal; an unused slot becomes
  `Weitere Dateien`. Rejected oversized or unsupported files never enter the submitted FileList.
  The prototype does not store or transmit the files or any form values; production upload remains
  blocked on the documented vendor, retention, access-control, malware and privacy decisions.
- Updated the architecture, privacy and visual sources of truth. Strict TypeScript, lint, all 31
  unit/component tests, all 33 Playwright scenarios and the Webpack production build pass;
  desktop/mobile attachment render review shows no overflow.

### 2026-08-04 — Four-image local gallery review

- At the owner's explicit request, four independent image-generation agents created one temporary
  concept photograph for each Stitch slot: tall restaurant facade, wide entrance detail, wide café
  terrace and tall urban entrance after rain.
- Preserved the four original PNG sources under `DesignPrototip/assets/` and generated optimized
  156–258 KB WebP derivatives under `public/images/referenzen/`; prompts, dimensions and mappings
  are recorded in `DesignPrototip/assets/lichtsaum-concept-prompts.md`.
- Changed the registry from empty `awaiting-assets` to local `review`. Concept items are permitted
  only as `concept-visual + review-only`; `published` still requires four `real-project +
  public-approved` items and fails closed for concepts.
- Activated `So wirkt die Galerie.` between the configurator and FAQ, the anchored noindex
  `/referenzen` preview and the native dialog. Every card carries a persistent
  `Konzeptvisualisierung` badge, and section/page copy states that the images are AI-generated and
  not completed LICHTSAUM projects.
- Recorded desktop 1440 px and mobile 390 px QA screenshots in `artifacts/design-qa/`; corrected a
  mobile `min-height`/aspect-ratio conflict so the gallery no longer creates horizontal overflow.
- Final verification passes: strict TypeScript, lint, 27 unit/component tests, all 32 Playwright
  scenarios including Axe and seven responsive widths, and the optimized production build. A
  temporary production server returned `200` for `/` and `404` for `/referenzen`; the production
  homepage contains none of the gallery-specific concept ids or copy, while the shared local server
  remained available on `127.0.0.1:3000`.

### 2026-08-04 — Short homepage and hidden Referenzen scaffold

- Shortened the rendered homepage to the accepted marketing sequence and moved the existing
  `LICHTSAUM STUDIO` configurator directly after Eignung. Removed `Varianten`, `Ablauf`,
  `Projektgrenzen`, `Nachweise` and `Alternatives` from render without deleting their source.
- Reduced desktop and mobile navigation to `Produkt · Eignung · Konfigurator · FAQ` with absolute
  home anchors. The conditional `Referenzen` item is inserted only for a valid published registry.
- Added a fail-closed German reference registry with `awaiting-assets`, `review` and `published`
  states. The current empty state produces no homepage heading or spacing and returns `404` for
  `/referenzen`; review is limited to local/protected preview with `noindex`, while publication
  requires exactly four complete real-project slots and public permissions.
- Prepared the Stitch-shaped responsive four-card grid, crawlable anchored links, one
  server-rendered gallery page and a native modal dialog with Close, Previous/Next, Escape,
  keyboard arrows, native focus containment, focus return and reduced-motion behavior.
- Added no photographs or concept assets. AI generation and the earlier mixed B2B concept set are
  cancelled for Referenzen; visual/crop QA remains deferred until the four original projects exist.
- Verified strict TypeScript, lint, 27 unit/component tests, all 32 Playwright scenarios, Axe,
  keyboard navigation, local SEO behavior and page overflow at 320, 390, 768, 1024, 1280,
  1440 and 1920 px. The production build passes; a temporary production server returned `200` for
  `/` and `404` for `/referenzen`. The shared `pnpm dev:watch` server is available again on
  `127.0.0.1:3000`.

### 2026-08-04 — Open preview treatment for LICHTSAUM STUDIO

- Owner rejected a separate photographic or illustrated backdrop and the enclosed preview-card
  treatment.
- Removed the raster scene, solid preview background and vertical frame edges. The compact preview
  now reads as part of the section below one horizontal rule, with a neutral gray blurred atmosphere
  band that fades fully into the page background at both sides; owner review removed the lower rule
  and reduced the scene height by 15% from `420` to `357`.
- Kept the physical valance, illuminated composition and dimension lines as the live accessible SVG
  foreground without changing configurator geometry or behavior.

### 2026-08-04 — Logical mini-configurator controls and logo placement

- Owner accepted the control-chain revision: desktop now aligns `01 Gestaltung`, `02 Maße` and
  `03 Farbe & Licht`, while mobile preserves the same semantic order in one column.
- Replaced the three ambiguous branding cards with one accessible `Komposition` popup for
  `Nur Schrift`, `Logo links` and `Logo beidseitig`; the inscription remains geometrically centred
  while one or two equal placeholder signs occupy protected edge zones.
- Removed `Segmentiert` because the former mode only drew dividers without independent segment
  text fields or a verified construction model; any return is deferred to the full configurator.
- Kept text and font selection in `Gestaltung`, removed the redundant font-sample block and reduced
  the closed composition trigger to the numeric-field height; option descriptions now appear only
  in the open popup. `Maße` remains exclusively for dimensions and fit errors, while the third
  group is `Farbe & Licht`.
- Made `Text auf dem Volant` a full-height rectangular input cell with a distinct `surface`
  background, aligned to the numeric-field rhythm instead of a standalone underline.
- Unified the desktop control rhythm: all three columns now align repeated `label → 54px control →
  0.8rem gap` rows, with less dead space between the numbered group heading and its first control.
  The third row of `Farbe & Licht` is intentionally empty until there is a real parameter for it.
- Added the owner-approved decorative marker-loop to the `VISUELLER MINI-KONFIGURATOR` eyebrow,
  matching the established editorial accent while retaining normal HTML text and accessibility.
- Replaced the six permanently visible awning-colour tiles with an accessible `Markisenfarbe`
  dropdown; the selected swatch stays visible in the closed state and the eleven options appear in
  a two-column popup, including white, cream white, light grey, night blue and terracotta.
- Replaced the two inline `Lichtwirkung` buttons with a matching accessible dropdown. Its palette
  now includes warm/neutral white plus red, green, blue, yellow, cyan and violet RGB lighting;
  the selected swatch and the preview update together.
- Bumped the non-personal transfer contract to `lichtsaum:mini-configurator:v2` and added geometry,
  storage, keyboard, open-popup accessibility and 320/390px overflow coverage.
- Verified the final state with strict TypeScript, lint, 18 unit tests, a production build, the
  focused composition E2E, open/closed Axe checks, clean browser console and overflow checks from
  320 through 1920 px; desktop and mobile design-QA evidence is recorded in `design-qa.md`.

### 2026-08-04 — Simplified night preview and restored dev interaction

- Owner review rejected the fabric simulation and architectural sketch background. The final
  preview now uses a flat selected-colour valance on an even blue-black night gradient without
  grid, hatching, folds, seams or decorative facade lines.
- Kept the exact physical SVG boundary, millimetre geometry and restrained layered glow around a
  crisp inscription; size and light transitions still respect `prefers-reduced-motion`.
- Confirmed the shared dev process had lost client-side hydration: text stayed in the loading state
  and native controls no longer updated React state. Restarted only the identified Next.js dev
  process under `pnpm dev:watch` and left it available on `127.0.0.1:3000`.
- Verified live on the shared dev server that text, valance width, selected valance colour and light
  colour all update the SVG, then restored the visible defaults `CAFÉ LICHT`, `3000`, `Anthrazit`
  and `Warmweiß`.
- Strict TypeScript, lint, 13 unit tests, the focused configurator E2E and the production build pass;
  the shared `pnpm dev:watch` server remains available after verification.
- Replaced the platform-native light font dropdown with a dark LICHTSAUM listbox, preserving all
  eight options, keyboard navigation, visible selection and live font measurement.

### 2026-08-04 — Homepage LICHTSAUM STUDIO mini-configurator

- Fully replaced the former `Kosten` concept with `#konfigurator`; desktop and mobile navigation
  now use the `Konfigurator` label and target.
- Owner review removed the `Tag` / `Nacht` selector; the preview is always shown at night,
  including when an older saved state is restored.
- Preserved the owner-approved Stitch structure while replacing the fixed facade photograph with a
  compact responsive front-view SVG: only the physical valance, illuminated inscription and
  dimension lines; owner review removed the upper sloped canopy from the preview.
- The initial implementation used `Wortmarke`, placeholder `Logo + Name` and fixed `Segmentiert`
  modes; the later owner-approved composition revision above supersedes those controls. Eight local
  OFL WOFF2 fonts, six awning colours, two light colours and the fixed night preview remain.
- Added real valance width/height and letter height in millimetres. Canvas measures the selected
  font's visible text bounds before pure geometry centres the composition; invalid height/width is
  reported explicitly and never silently auto-fitted.
- Added a versioned, non-personal `sessionStorage` state contract for the later full configurator.
  The current continuation action saves that state and explicitly states that the separate tool is
  not implemented yet.
- Kept AI rendering, customer photography, real logo upload, price and calculation out of phase 1.
- Verified strict TypeScript, lint, 13 unit tests, static production build, the focused interactive
  path, WCAG 2.2 A/AA and no horizontal overflow at 320, 390, 768, 1024, 1280, 1440 and 1920 px.

### 2026-08-03 — Mobile navigation drawer

- Replaced the clipped two-row mobile header with a compact `LICHTSAUM` + menu-control row.
- Implemented the owner-selected right drawer: six indexed hash links, a bottom project-check CTA,
  dimmed page context and the existing black/orange/mono visual language.
- Used a native modal dialog with scroll locking, focus restoration, resize cleanup and close-on-link
  behaviour; desktop navigation remains unchanged.
- Added Phosphor Icons `2.1.10` for the menu and close controls instead of custom-drawn icons.
- Verified the 390 × 844 open and closed states in the in-app browser, including open/close,
  six crawlable links, navigation to the configurator section, scroll locking and an empty error
  console.

### 2026-08-03 — Short mobile hero scroll scene

- Extended the existing day-to-night hero crossfade, media movement and heading exit to mobile.
- Kept the mobile scene deliberately shorter: about `80vh` of active scroll versus about `150vh`
  on desktop. The image is reduced to `64svh`, positioned so the embedded lettering begins near the
  viewport's horizontal midpoint, and uses a 112 px maximum media offset.
- Pulled the following three-item principle strip upward by `80svh`, matching the desktop cover
  mechanic: the sticky hero remains in place until the opaque strip has covered the visible image.
- Preserved the static day image and normal document flow for `prefers-reduced-motion`.
- Kept the shared day/night focal point and intrinsic image alignment unchanged.
- Verification is tracked against the mobile scene at `390 × 844`, where the expected active travel
  is about 675 px and the principle strip moves from just below the viewport across the image.

### 2026-08-02 — Proposed landing and route expansion brief

- Recorded the proposed short homepage architecture after the accepted Hero, principle strip,
  `Eine Fassade. Zwei Ansichten.`, Engineered Precision and merged Eignung sections.
- Defined how a visual mini-configurator on the homepage can lead to a separate full configurator
  without publishing an unverified price, formula or compatibility result.
- Defined the future `Referenzen` direction as one indexable gallery of real publishable object
  photographs, with a small homepage preview. Brand-consistent editorial styling may be applied
  without changing the factual meaning of an object or project.
- Proposed a Google-first in-place modal pattern: homepage cards remain native links to anchored
  sections of `/referenzen`; JavaScript may open the matching photo in a modal, but indexing relies
  only on the one server-rendered gallery page.
- Proposed replacing the current `Varianten`, `Ablauf` and `Kosten` header links with a shorter
  product navigation that adds `Konfigurator` and, when real cases exist, `Referenzen`; no code or production route was
  changed.
- Owner revision: removed the proposed three-step process from the target homepage; shortened the
  FAQ heading to `Fragen.`; defined a minimal project-contact block; required dedicated branding
  mockups for the mini-configurator; and defined the proposed two-part illuminated `LICHTSAUM`
  footer. No code or production route was changed.

### 2026-08-01 — Retrofit and compatibility merged

- Replaced the separate `#retrofit` and `#eignung` sections with one `#eignung` section directly
  after Engineered Precision.
- The new section follows the owner-approved hierarchy: `Was wir prüfen`, `Was sich ändert`,
  `Was bleibt`. Its redundant local sequence, CTA and first-review input row were removed; the
  page-level project-check CTA and form remain the conversion path.
- The copy keeps the essential suitability qualifier: the existing awning remains only when its
  construction and mechanism are suitable for the retrofit. No cable-path, installation,
  electrical-responsibility or universal-fit claim was added.
- Removed the obsolete Retrofit component. The compact marker loop now frames `EIGNUNG`, matching
  the approved Engineered Precision heading hierarchy. Desktop visual evidence is recorded in
  `artifacts/design-qa/eignung-merged-desktop-1280.png`.
- Refined the remaining Eignung grid: one aligned outer frame, equal-height sequence rows and a
  dedicated heading band in each right-hand card keep body copy aligned under variable headlines.
- Added a consistent gap between each right-hand display heading and its body copy without changing
  their shared alignment.
- Kept the numbered three-step flow only in the left sequence; removed duplicate indices from the
  right-hand explanatory categories.
- Removed the duplicate bottom divider from the third left sequence item; the shared grid frame
  now supplies the sole lower boundary.
- Shortened the Eignung display title to `Konstruktion prüfen. Volant erneuern.` and aligned the
  left review-step wording with its detailed right-hand explanation by including `Befestigung`.
- `pnpm lint`, `pnpm typecheck`, the focused Eignung Playwright check and all seven responsive
  overflow widths from 320 to 1920 px pass.

### 2026-07-31 — Engineered Precision image series

- Replaced the three disparate interactive visuals with a coherent owner-directed sequence from one architectural perspective: illuminated appearance, the bounded light field and the technical valance measurement view.
- `Gestaltung` now identifies only the illuminated lettering with an orange dotted contour; `Aufmaß` uses the same perspective as a CAD drawing and identifies valance length and height.
- Moved each view explanation into the matching left-side accordion item and removed duplicate right-side captions; the owner-confirmed cost-driver statement is recorded in the claims register without publishing a price or range.
- Replaced the abrupt interactive view swap with an interruptible two-layer crossfade and short accordion transition; reduced-motion keeps a brief opacity transition without movement.
- Recorded the generated source PNGs and optimized WebP derivatives in the visual asset ledger; lint, strict TypeScript, production build, focused WCAG and seven-width responsive checks pass.

### 2026-07-31 — Owner visual-asset authorisation

- The owner confirmed that visual assets they provide or expressly approve may be used on the site.
  They do not require a public `Konzeptvisualisierung` label or a separate rights-record blocker.

### 2026-07-31 — Marker-loop design standard

- Adopted the owner-selected three-pass marker gesture in two explicit variants: a large signature
  loop around the transformation slogan and a compact loop around the `RETROFIT` eyebrow.
- Replaced the slogan image with exact semantic HTML copy: `Tagsüber Marke.` in warm white and
  `Nachts Markenlicht.` in orange, rendered with self-hosted `Caveat Variable` at weight 400. The
  owner-selected desktop treatment enlarges this copy by 20% and reuses the exact marker mask from
  `RETROFIT`, with a taller desktop container but no photo-grid change; mobile keeps the accepted
  compact scale.
- Kept `RETROFIT` as the existing JetBrains Mono uppercase HTML label and added the reusable,
  opt-in compact `SectionHeading` treatment without changing its heading or section copy.
- Kept the stock JPG with unknown rights out of the shipped site; it remains reference-only.
- Verified the current implementation from 320 through 1920 px with no page overflow; the slogan
  no longer uses SVG in the rendered page and the transformation photo geometry remains unchanged.
- Latest owner revision enlarges the desktop slogan loop by 20% around its centre while continuing
  to reuse the exact `RETROFIT` marker mask; responsive overflow and final visual spacing require a
  fresh browser pass.
- Latest micro-adjustment shifts only the desktop slogan copy 3% left inside the unchanged loop;
  photo geometry remains untouched.
- Latest owner revision shifts the desktop loop 3% right and increases its height by 10%; width,
  text and photo geometry remain unchanged.
- Lint, strict TypeScript, unit tests and the production build pass after the implementation. The
  focused WCAG checks and seven responsive overflow tests from 320 through 1920 px also pass.

### 2026-07-31 — Engineered Precision interaction

- Added the separate `Engineered Precision` section after the day/night transformation and before
  the retrofit scope, without changing the hero, principle strip or `Eine Fassade. Zwei Ansichten.`
  section.
- Implemented three accessible German-labelled views: `Lichtbild`, `Gestaltung` and `Aufmaß`, with
  a visible active state and dedicated concept imagery.
- Explicitly kept `Anschluss und Kabelweg` out of the drawings because they require an
  object-specific check; no technical performance or universal-fit claim was introduced.
- Recorded source and optimized assets in the local ledger; owner-supplied or expressly approved
  assets are authorised for the site and need no public concept label.
- Verified lint, strict TypeScript, unit tests, production build, browser interaction, overflow and
  runtime-console state.

### 2026-07-31 — CAD-hybrid LICHTSAUM hero pair

- Replaced the local hero media with the owner-supplied aligned off/on concept pair.
- Preserved the existing desktop scroll crossfade, mobile/reduced-motion static fallback and LCP
  preload behavior.
- Recorded the original PNG sources and optimized WebP derivatives in the asset ledger; the
  owner-supplied pair is authorised for use on the site.

### 2026-07-31 — Local dev-server continuity

- Fixed `scripts/dev-watch.sh` so `set -e` no longer prevents its documented restart path after an
  unexpected `next dev` exit.
- Made `pnpm dev:watch` the documented long-running local-review command.
- Added the repository invariant that an existing user dev-server is not stopped for build or test
  work; verified a successful production build while the same local server remained available.

### 2026-07-30 — Project contract and Google-first baseline

- Adopted an adapted version of the four Karpathy-inspired execution principles.
- Established documentation ownership and project authority boundaries.
- Defined Google Search/Ads, consent and conversion infrastructure as early invariants.
- Added initial architecture, SEO, marketing, content and legal documentation.
- Added the implementation roadmap and repository entry point.

Detailed decisions belong in `docs/architecture/decision-log.md`.

### 2026-07-30 — LICHTSAUM product/market decision package

- Narrowed the proposed product from general illuminated awnings to an illuminated replacement
  valance for existing B2B awnings.
- Selected independent restaurants/cafés as the proposed first segment and Berlin/Brandenburg as a
  conditional pilot, not a public service claim.
- Created a dated market/competitor/source ledger, transparent TAM/SAM/SOM and unit-economics
  scenarios.
- Defined a compatibility-led offer, exact search cluster, 30/60/90 validation gates and one
  canonical landing brief.
- Recorded `VALIDATE FIRST`; this remains the product/release decision after the later local
  prototype implementation.

### 2026-07-30 — Local responsive landing prototype

- Implemented the complete German landing and project-check journey as an explicitly authorised
  local, non-indexable prototype.
- Preserved the canonical Stitch screen's dark architectural palette, scale, asymmetric grids,
  square geometry and orange action signal while replacing its generic/new-awning story and
  unverified evidence.
- Added compatibility, scope, variants, process, cost drivers, limitations, evidence status,
  alternatives, FAQ and a validation-only form with explicit `TBD` boundaries.
- Revised all three `#wirkung` cards in the canonical 8/4/12 Stitch gallery. They
  use owner-supplied night images, monochrome by default and restored to colour on hover,
  focus or activation, without a range control.
- Extended the Stitch hero's scroll-parallax character into a desktop scroll scene: the recorded
  day concept crossfades into its illuminated evening state while the media shifts, then the next
  opaque content layer moves over and fully covers the hero.
- Kept the scene static and compact on mobile and under `prefers-reduced-motion`; the implementation
  uses only transform/opacity, native scroll timelines where supported and a small browser fallback.
- Verified static rendering, local indexing controls, responsive behavior at 320–1920 px,
  automated WCAG 2.2 A/AA checks, day/night motion, full next-block coverage, form states and a
  production build.
- No deployment, external message, provider integration, tracking or production data flow was
  created.
