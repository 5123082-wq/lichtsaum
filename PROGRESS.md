# PROGRESS.md

<!-- AGENT_CONTEXT:START -->
## Context Beacon

- Last updated: 2026-10-05
- Active release: owner explicitly authorised publishing all current site changes and production
  deployment on 2026-10-05. Candidate includes the illuminated hero/header, Wirkung concept
  viewer and revised images, shared ten-colour palette, mini price/inquiry actions and compact
  inquiry receipt with visible submission feedback. Existing production flags and providers
  remain unchanged. GTM/Ads publication and real synthetic inquiries are separate actions.
- Verification: 196 unit tests, typecheck, full lint and production build passed. Chromium/WebKit
  suite passed 151 checks; all three stale colour/delay expectation failures passed on rerun. Two local consent tests skipped because optional tags are dormant locally.
- Publication: preparing a scoped commit on the current checkout, then direct Git push to fresh
  origin/main and production deployment verification. Local screenshots, unrelated agent output,
  tmp/, secrets and environment files are excluded. No database migration is needed.
- Evidence boundaries: generated images are concepts, not customer projects. Owner publication
  authority is recorded separately from documentary verification of underlying media rights.
  Real-device Safari, mobile keyboard, field CWV and conversion deduplication remain unverified.
- Existing production: LICHTSAUM on Vercel; lead persistence/notifications use Neon/Resend, files
  use private Blob. Mail for info@lichtsaum.com is received/stored by IONOS. Google Ads remains
  under its separately approved settings; see docs/marketing/google-ads-search-test-2026-09-06.md.
- Other tracks: /konfigurator SEO K1–K4 is implemented; /referenzen research/copy remains open.
  Keyword Planner evidence does not justify additional landing pages.
- Next action: push the verified candidate, confirm Vercel READY for its SHA and domain assignment,
  then check production pages, media, dialogs, consent and canonical/robots/sitemap without
  creating a real lead. Keep the shared localhost server available.
<!-- AGENT_CONTEXT:END -->

<!-- RECENT_CHANGES:START -->
## Recent changes — newest first, maximum three

### CHG-20261005-03 — Authorised production release candidate

- Scope: all accumulated site changes, generated media/provenance, regression checks and release.
- Outcome: owner authorised Git publication and production deployment. Temporary agent output
  and tmp/ are ignored. Two stale browser expectations now match the accepted palette and timing.
  Production deployment is pending; runtime flags/providers and GTM/Ads settings are unchanged.
- Verification: 196 unit tests, typecheck, full lint and production build passed. Full browser run
  had 151 passes and two consent skips; all three stale-expectation failures passed on focused rerun.
- Follow-up: confirm Git/Vercel release and production smoke checks; real-device/field checks remain open.

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

<!-- RECENT_CHANGES:END -->

<!-- CHANGE_HISTORY:START -->

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
