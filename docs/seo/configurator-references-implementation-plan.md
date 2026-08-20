# Configurator and References SEO Implementation Plan

Status: `Decision`  
Approved scope: 2026-08-17  
Evidence reviewed: 2026-08-19

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: approved implementation sequence and acceptance criteria for the next SEO iteration of
  `/konfigurator` and `/referenzen`.
- Current: `/konfigurator` K1–K4 are complete locally with the owner-approved copy, metadata option
  A and two contextual links; `/referenzen` remains second; no new search landing pages are
  justified by the available evidence.
- Open: begin `/referenzen` R1 research only on the owner's request; deployment and other external
  publication actions remain separate decisions.
- Read full when: drafting, implementing or reviewing either page iteration.
<!-- AGENT_BRIEF:END -->

## Final verdict

The next SEO milestone consists of exactly two page-level improvements:

1. strengthen `/konfigurator` with useful server-rendered explanation below the existing tool;
2. refine `/referenzen` as one concise, image-led gallery page.

Do not create additional search landing pages in this milestone. The available search and analytics
evidence supports consolidation around the existing routes, not route expansion.

Implementation order is fixed: complete and verify `/konfigurator` before starting `/referenzen`.

## Evidence behind the decision

The dated keyword evidence and route ownership are maintained in
[`search-intent-map.md`](search-intent-map.md). The relevant outcome is:

- Google Search Console does not yet contain a useful decision sample;
- the controlled German/Germany Keyword Planner run placed every approved seed in Google's lowest
  reported search band and returned no additional ideas;
- the verified GA4 sample is too small to justify splitting intent across more pages;
- production already has working crawl/index foundations, while `/konfigurator` has the clearest
  server-rendered content gap;
- `/referenzen` already has one canonical, server-rendered gallery route and does not need filters,
  pagination or per-object URLs.

These facts do not prove that demand is zero. They mean that a new route has no current evidence
advantage over improving the existing canonical page.

## Approved owner decisions

### `/konfigurator`

1. Add one compact server-rendered explanatory block after the existing configurator interface.
   Research and approve its final content before implementation.
2. Keep `/konfigurator` as the only destination for the current `Preis` / `Kosten` / `Angebot`
   intent. Do not create `/preise`.
3. Keep the first screen visual-only. Do not add an SEO introduction before the tool.
4. The lower explanatory block may link only to `/#eignung` and `/referenzen`. Keep the existing
   primary `Projekt prüfen lassen` journey; do not add an SEO link list.
5. Keep the current H1 `Leuchtvolant konfigurieren`. Research and then refine Title and Description
   for configuration plus preliminary-price intent.
6. Keep the route strictly B2B. The displayed result remains the restricted preliminary net amount
   governed by CLM-029.

### `/referenzen`

1. Keep `/referenzen` and use clear, subject-led positioning. This milestone adds no new disclaimer
   about image authorship or project ownership.
2. Keep one gallery URL. Create no individual object pages until an item has enough unique project
   material for a genuinely independent page.
3. Keep the current ending and CTA unchanged. Do not add a configurator link.
4. Add no filters, categories or alternate gallery states while the collection is small.
5. Add no long SEO text block. Each image needs only a concise title, a one- or two-sentence
   description, an accurate German alt and a stable descriptive filename.

## Phase 1 — `/konfigurator` research and copy approval

### K1. Build the copy brief

Research only the information needed for the approved lower block:

- what the configurator calculates;
- what the preliminary net result does not include;
- why a manual project check follows the calculation;
- how users should interpret configuration, price and project suitability as separate outcomes.

Use the current tool behavior, the calculation contract and approved claims as primary evidence.
External German sources may clarify terminology but may not introduce LICHTSAUM product facts.

### K2. Produce the approval pack

Approved and locally implemented package:
[`configurator-copy-approval-pack.md`](configurator-copy-approval-pack.md).

Prepare for owner review:

- one recommended three-part content structure;
- final German draft copy for all three parts;
- up to three Title/Description pairs;
- final anchor wording for `/#eignung` and `/referenzen`;
- a claim trace showing which existing approved statement supports each factual sentence.

Working section directions, not final copy:

1. `Was der Konfigurator berechnet`
2. `Was der vorläufige Nettopreis nicht umfasst`
3. `Warum der Projekt-Check folgt`

Stop after the approval pack. Do not implement copy that the owner has not reviewed.

## Phase 2 — `/konfigurator` implementation

### K3. Implement the approved block

- Populate the existing server-owned `technicalSections` content path instead of creating a new
  client-side content system.
- Render the block after the complete configurator/form flow.
- Preserve the visual-only first screen, H1, calculation flow, form behavior and primary CTA.
- Keep price limitations visible and consistent with the current calculation result.
- Add only the two approved contextual links.

### K4. Verify `/konfigurator`

Required checks:

- route returns `200` and the approved block is present in server HTML without JavaScript;
- one H1, unique Title/Description and absolute self-canonical remain correct;
- `/#eignung` and `/referenzen` are native crawlable links;
- B2B, VAT, excluded-services and non-binding-result boundaries remain accurate;
- no `/preise`, parameter/state index targets, `Product` or `Offer` Schema are introduced;
- keyboard, responsive layout, reduced motion and form behavior do not regress;
- targeted tests, typecheck, lint, production build and rendered-HTML inspection pass.

Implementation record, 2026-08-19: `Complete locally`.

- The three sections render through `technicalSections` immediately after `ConfiguratorWizard`;
  metadata option A is shared by standard, Open Graph and Twitter metadata.
- Built HTML contains all three H2s and both native links, has one H1, contains no Russian review
  copy and introduces no `Product` or `Offer` Schema.
- 164 unit tests, typecheck, lint and production build passed.
- Targeted Playwright passed the SSR/metadata/placement test and the 320 px accessibility plus
  horizontal-overflow test.
- A mistakenly broad 54-test Playwright invocation produced 49 passes, two configured skips and
  three failures. The stale hero-image expectation was synchronized with the current approved
  asset and its targeted test then passed. Two unrelated pre-existing configurator interaction
  assertions remain outside this copy milestone: one expects the removed native font select, and
  one intermittently reports the open color list below an overlapping action.
- No deployment, indexing submission or other external publication action was performed.

## Phase 3 — `/referenzen` research and copy approval

### R1. Build the gallery copy brief

Inventory the visible content of every approved image and prepare:

- one recommended Title, Description and H1 direction for the route;
- one concise German title per item;
- one factual one- or two-sentence caption per item;
- one contextual German alt per item;
- one stable descriptive filename per item when a rename is materially useful.

Do not infer location, customer, authorship, performance, project scope or technical result from an
image alone. Do not add new authorship/ownership disclaimers in this milestone.

### R2. Produce the approval pack

Show the complete route metadata and item-copy matrix to the owner before implementation. Preserve:

- the single `/referenzen` URL;
- the existing linear gallery composition;
- the existing final CTA;
- the absence of filters, categories and separate object routes.

## Phase 4 — `/referenzen` implementation

### R3. Implement the approved copy and image metadata

- Update only approved route metadata, heading/copy and item-level image fields.
- Keep every meaningful image in server-rendered HTML with intrinsic dimensions and responsive
  sizes.
- Preserve stable anchors used by homepage reference links.
- Do not add a configurator link, long SEO section, filter UI or new indexable state.

### R4. Verify `/referenzen`

Required checks:

- direct route and every existing anchor return the expected server-rendered item;
- one H1, unique Title/Description and absolute self-canonical remain correct;
- image `src`, dimensions, alt, nearby heading and caption are present in server HTML;
- filenames and copy are accurate, concise and non-duplicative;
- the existing CTA and homepage-to-gallery links still work;
- only `/referenzen` remains in the sitemap; fragments and UI state create no index targets;
- keyboard, responsive layout, image loading and accessibility checks pass.

## Explicitly outside this milestone

- new product, price, gastronomy, regional, FAQ or project-detail routes;
- homepage or hero changes;
- B2C price presentation;
- `Product`, `Offer`, `LocalBusiness`, rating or FAQ structured data;
- gallery filters, categories, pagination or per-image URLs;
- GA4 key-event changes, Google Ads verification, campaigns, billing or spend;
- deployment, Search Console submission or any other external publication action.

## Definition of done

This plan is complete only when:

1. the `/konfigurator` research pack is approved, implemented and verified;
2. the `/referenzen` research pack is then approved, implemented and verified;
3. both pages keep their existing canonical URLs and primary user journeys;
4. no new public claim or indexable route is introduced without its owning approval;
5. rendered production-like HTML confirms the intended content, metadata, links and images;
6. the owner receives the verification results and any remaining factual uncertainty.

## Source boundaries

- Search intent and dated keyword evidence: [`search-intent-map.md`](search-intent-map.md)
- Crawl, metadata and canonical rules: [`search-foundation.md`](search-foundation.md)
- Configurator calculation and public price limits:
  [`../architecture/configurator-calculation.md`](../architecture/configurator-calculation.md)
- Gallery route and image behavior:
  [`../architecture/landing-page-and-route-expansion.md`](../architecture/landing-page-and-route-expansion.md)
- Public factual claims:
  [`../content/claims-and-evidence-register.md`](../content/claims-and-evidence-register.md)
