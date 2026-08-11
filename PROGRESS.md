# PROGRESS.md

<!-- AGENT_CONTEXT:START -->
## Context Beacon

- Last updated: 2026-08-11
- Current stage: public LICHTSAUM site exists; newer application and documentation work remains in
  the local working tree and has not been published as one verified release.
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
<!-- RECENT_CHANGES:END -->

<!-- CHANGE_HISTORY:START -->
## Earlier material changes — read only when required

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
  full route uses server-reproduced font metrics, geometry and pricing version `2026-08-11.v1`.
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
