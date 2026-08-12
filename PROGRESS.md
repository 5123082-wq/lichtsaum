# PROGRESS.md

<!-- AGENT_CONTEXT:START -->
## Context Beacon

- Last updated: 2026-08-12
- Current stage: public LICHTSAUM site exists; the full configurator now has a locally verified
  fixed technical intro background and a sequential calculator layout: the schematic preview spans
  the width, step 01 repeats the homepage three-group control layout, step 02 exposes all services,
  and price plus specification remain hidden until step 03. The server-authoritative configurator
  pricing is version `2026-08-12.v2` with a server-only 100% commercial coefficient; the SEO
  canonical guard, apex redirect contract and route social metadata remain local and unpublished.
- Active track: complete only the site work requested by the owner. Before any concrete deployment,
  indexing, Search Console/DNS, GTM/Ads, production-form or attachment action, show the current
  evidence and use `Спросить у пользователя` under
  `docs/architecture/publication-governance.md`.
- Working tree: intentionally dirty with owner/previous-agent changes. Do not reset, overwrite or
  broadly reformat unrelated work.
- Default context protocol: read this block and the three `RECENT_CHANGES` entries only. Read the
  detailed sections below when the current task needs their domain.
- Next action: continue the owner's latest concrete site request; ask before a concrete external or
  production action under `docs/architecture/publication-governance.md`.
<!-- AGENT_CONTEXT:END -->

<!-- RECENT_CHANGES:START -->
## Recent changes — newest first, maximum three

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

<!-- RECENT_CHANGES:END -->

<!-- CHANGE_HISTORY:START -->
## Earlier material changes — read only when required

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
