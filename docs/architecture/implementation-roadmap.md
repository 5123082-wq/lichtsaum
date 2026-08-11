# Current Implementation Roadmap

Status: `Decision / current work only`
Last reviewed: 2026-08-11

This file lists only unfinished work. Completed implementation history was removed so future agents
do not repeat closed phases. Current state is in `../../PROGRESS.md`; publication authority is in
[`publication-governance.md`](publication-governance.md).

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: только незавершённые междоменные workstreams, не историю реализации.
- Current: пять активных направлений — content scope, release state, lead hardening, Search and
  measurement verification, product/legal facts.
- Open: точный следующий workstream выбирается последним запросом владельца.
- Read full when: задача планирует несколько workstreams; иначе читать только выбранный раздел.
<!-- AGENT_BRIEF:END -->

## Working rule

- Start from the owner's latest concrete request.
- Read only the relevant domain source and code.
- Do not reopen completed components unless the owner requests a change or a regression is
  reproduced.
- Treat QA results as evidence. Use `Спросить у пользователя` for concrete external/public actions.

## Workstream 1 — Remaining site content

Status: `Спросить у пользователя`

- Confirm which routes or page sections are still intended for the next release.
- Add only content backed by owner facts or the claims register.
- Preserve the current approved hero, category, CTA, gallery and canonical intent unless the owner
  requests a revision.
- Re-run responsive, accessibility, metadata and build checks for touched surfaces.

Done when: the owner-selected page scope is implemented and directly verified.

## Workstream 2 — Production release state

Status: `Спросить у пользователя`

For the exact candidate commit/environment, present and ask the owner to choose:

- deployment target/version;
- `SEARCH_INDEXING_ENABLED`;
- `LEAD_INTAKE_ENABLED`;
- `LEAD_ATTACHMENTS_ENABLED`;
- consent UI and GTM publication/activation;
- Search Console/DNS and advertiser-verification actions.

Before execution, report current build/QA, runtime dependencies, consent behavior, form delivery,
malware/processor questions and rollback target. Do not infer values from old O7/O10/O12 plans.

Done when: the user-selected state is deployed and its public HTTP/UI/form/tag behavior is verified.

## Workstream 3 — Lead-flow hardening

Status: `Open`

- Replace the current honeypot plus case-insensitive per-email limiter with an atomic
  multi-dimensional abuse limiter and documented global circuit breaker before relying on the
  expanded form at scale.
- Re-run accepted/recovered/failure/idempotency paths against the selected production state.
- If attachments are selected for publication, present and resolve the malware-handling and
  processor/DPA questions with the owner.

Done when: the selected intake state has bounded abuse behavior, safe logging and verified delivery.

## Workstream 4 — Search and measurement verification

Status: `Open / external actions are Спросить у пользователя`

- Revalidate production canonical, robots, sitemap, 404 and JSON-LD for the selected indexing state.
- If authorized, perform Search Console ownership/sitemap/URL Inspection.
- If authorized, complete advertiser identity verification and controlled synthetic-lead QA.
- Verify Tag Assistant, GA4 DebugView, Ads Diagnostics and Transaction-ID deduplication without real
  customer data.

Done when: evidence for the owner-selected Search/measurement state is recorded without secrets or
PII.

## Workstream 5 — Product and legal facts

Status: `Owner input required`

- Supplier identity/contract and complete technical documentation.
- Service geography and ownership of measurement, installation, electrical work, maintenance and
  warranty.
- Capacity, target margin, minimum invoice and actual direct costs.
- Vercel Hobby/DPA handling, upload-malware path and final processor onboarding.
- B2C access to `/konfigurator` and PAngV/Gesamtpreis presentation.

These facts must be reported accurately; publication decisions remain with the owner.

## Verification baseline for any material change

Run only what is relevant, then expand in proportion to risk:

```bash
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm build
```

Add focused Playwright/accessibility/form/tag checks when the changed surface requires them. Keep
the user's existing `127.0.0.1:3000` process running unless explicitly authorized otherwise.
