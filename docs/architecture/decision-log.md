# Architecture Decision Log

Last reviewed: 2026-08-11

Этот файл хранит решения и причины, но не текущий статус выполнения.

| ID | Date | Status | Decision |
| --- | --- | --- | --- |
| ADR-001 | 2026-07-30 | Accepted | Build from scratch; Stitch is visual reference, not production code |
| ADR-002 | 2026-07-30 | Accepted | Google-first is an invariant, not a post-launch optimization |
| ADR-003 | 2026-07-30 | Accepted | Use Next.js App Router, TypeScript strict and static/server-first rendering |
| ADR-004 | 2026-07-30 | Accepted | Production is the only indexable environment |
| ADR-005 | 2026-07-30 | Accepted | Central config owns brand, company, SEO and structured-data facts |
| ADR-006 | 2026-07-30 | Accepted | One typed measurement contract; no ad-hoc DOM/text triggers |
| ADR-007 | 2026-07-30 | Accepted | Primary conversion is a server-confirmed valid lead |
| ADR-008 | 2026-07-30 | Accepted | Consent Mode v2 is built into the tag architecture |
| ADR-009 | 2026-07-30 | Accepted | Claims must be evidenced before use in copy, Ads or Schema |
| ADR-010 | 2026-07-30 | Accepted | Fonts are self-hosted by default |
| ADR-011 | 2026-07-30 | Accepted | Use one GTM web container as the managed Google-tag layer |
| ADR-012 | 2026-07-30 | Superseded for sequencing | Original validate-before-scaffold rule; product evidence questions remain |
| ADR-013 | 2026-07-30 | Superseded | Original local-prototype exception; production implementation now exists |
| ADR-014 | 2026-08-11 | Accepted | Use one lead system and one Primary Ads conversion across plain, configurator and calculator inquiries |
| ADR-015 | 2026-08-11 | Accepted; publication limits superseded | Implement `/konfigurator` with server-reproduced restricted B2B-net pricing |
| ADR-016 | 2026-08-11 | Accepted | Owner controls every publication decision; repository-imposed release blockers are cancelled |

## ADR-001 — Stitch boundary

The Stitch project defines visual direction, tokens and composition. Generated HTML, placeholder
copy and unverified assets are not production sources. This avoids inheriting inaccessible markup,
absolute layouts, runtime dependencies and unclear asset licensing.

## ADR-002 — Google-first foundation

URL design, server HTML, canonical policy, sitemap, Schema, consent ordering and event identity are
expensive to retrofit. They are established before component implementation. This does not mean
building speculative SEO pages.

## ADR-003 — Application architecture

The current stable Next.js 16 App Router line supports server-first rendering and built-in metadata,
robots and sitemap conventions. Exact versions are pinned at scaffold time after checking current
official documentation.

## ADR-006/007 — Measurement integrity

UI click selectors are unstable and can silently break reporting. Application-owned typed events
form the contract. A form view or thank-you URL is not a conversion; backend acceptance produces
one `generate_lead` with a non-personal deduplication ID.

## ADR-008 — Consent boundary

Germany/EEA tracking cannot be added safely as a late script. Consent state precedes measurement
behavior and remains replaceable until CMP/legal choices are final.

## ADR-012 — Product validation before scaffold

- Date: 2026-07-30
- Status: Superseded for implementation/publication sequencing by ADR-013 and ADR-016
- Retained decision: the product hypothesis is a B2B retrofit of the replaceable valance on an
  existing compatible commercial awning, with `Projekt prüfen lassen` as the CTA. Product,
  supplier, geography and unit-economics evidence remains incomplete.
- Verification: `../strategy/product-market-decision.md`,
  `../strategy/market-and-competitor-evidence.md` and
  `../strategy/go-to-market-and-landing-brief.md`.

## ADR-013 — Local prototype before product `GO`

- Date: 2026-07-30
- Status: Superseded by the implemented production lead flow and ADR-016
- Retained decision: Stitch is a visual reference and the application uses accessible responsive
  production code. The former prototype-only restrictions are retired and must not be reopened.
- Verification: `../../PROGRESS.md`, `../../design-qa.md` and the automated checks in
  `../../tests/`.

## ADR-014 — Unified lead form and conversion

- Date: 2026-08-11
- Status: Accepted by explicit owner request
- Context: the homepage mini-configurator already preserves a browser-local configuration, and a
  later full calculator will collect more inputs and may eventually show a preliminary estimate.
  Separate form pipelines or conversion actions would fragment the manager workflow, duplicate
  validation/security behavior and make Ads bidding count UI variants instead of the same business
  outcome.
- Decision: all ordinary, mini-configurator, full-configurator and calculator inquiries extend one
  shared lead intake. UI instances may differ, but contact validation, persistence, notification,
  idempotency, accepted-result semantics and the sole Primary action
  `Projektanfrage – serverbestätigt` remain shared. Configuration/calculation data is attached as a
  visible, optional, versioned and server-validated request context. Before explicit form submit,
  only a stateless allowlisted calculation request may reach the application runtime; it creates no
  lead, persistence, notification or conversion. No context value enters analytics.
- Consequences: the compatible schema/form/notification extension is implemented. New form surfaces
  may add controlled analytics enums but do not create another Primary conversion unless a
  separately accepted ADR establishes a different business outcome and operational owner.
- Verification:
  [`unified-lead-form-contract.md`](unified-lead-form-contract.md),
  [`../marketing/measurement-plan.md`](../marketing/measurement-plan.md) and
  [`../legal/data-processing-and-consent.md`](../legal/data-processing-and-consent.md).

## ADR-015 — Full configurator and restricted preliminary price

- Date: 2026-08-11
- Status: Accepted by explicit owner implementation plan; pricing terms superseded by ADR-017
- Context: the owner approved showing the current component subtotal with `markupPercent = 0` as a
  preliminary net result for commercial projects. The same plan requires an indexable full tool,
  server-authoritative font measurement/geometry/pricing and the already accepted unified inquiry
  boundary.
- Decision: implement canonical `/konfigurator` with three UI steps, WOFF2 metrics reproduced by
  `fontkit`, integer-cent component pricing and unlimited panel selection ordered by cost, unused
  length and panel count. Services remain manual and outside the displayed amount. The result is
  always labelled net plus statutory VAT, services excluded and non-binding under restricted claim
  CLM-029. A changed pricing version must be shown and confirmed again before persistence.
- Consequences: the route and narrowly scoped calculation are implemented. This does not establish
  technical compatibility, a general tariff, consumer Gesamtpreis or margin strategy. B2C/PAngV,
  Ads, Search and deployment choices follow ADR-016 and are owner questions.
- Verification: [`configurator-calculation.md`](configurator-calculation.md),
  [`landing-page-and-route-expansion.md`](landing-page-and-route-expansion.md),
  [`../content/claims-and-evidence-register.md`](../content/claims-and-evidence-register.md) and
  [`../legal/compliance-plan.md`](../legal/compliance-plan.md).

## ADR-016 — Owner-controlled publication decisions

- Date: 2026-08-11
- Status: Accepted by explicit owner directive
- Context: publication restrictions, deferred actions and release blockers had accumulated across
  architecture, SEO, marketing, legal and progress documents. The owner cancelled those defaults
  and directed agents never to decide publication restrictions without consultation.
- Decision: no repository document may autonomously forbid, defer or authorize a concrete public
  action. Known technical, legal, privacy, security and accessibility facts are reported with the
  status `Спросить у пользователя`. Feature flags remain technical controls, not owner policy.
  Retired audit/handoff content is not an active work queue.
- Consequences: before a concrete deployment, indexing, Search Console/DNS, GTM/Ads, form,
  attachment, spend or new-data-flow action, ask the owner unless that exact action is already
  requested in the current task. Do not invent facts, conceal risk or treat owner acceptance as
  independent legal confirmation.
- Verification: [`publication-governance.md`](publication-governance.md), `../../PROGRESS.md` and
  the consistency audit across active documentation.

## ADR-017 — Server-controlled commercial coefficient

- Date: 2026-08-12
- Status: Accepted by explicit owner request
- Context: the owner changed the configurator commercial model from a component subtotal with no
  markup to a 100% increase over the internal component basis. The customer should receive only
  the resulting preliminary net price; internal component inputs and the coefficient are not
  customer-facing information.
- Decision: keep the coefficient in the server-only pricing module, apply it uniformly to the
  authoritative internal subtotal and bump the pricing version to `2026-08-12.v2`. Do not include
  the coefficient or individual component costs in the client-facing calculation result. Any
  future coefficient change must create a new pricing version and require reconfirmation.
- Consequences: a configuration that was open before this change cannot silently submit against the
  old price. The restricted configurator wording continues to show a preliminary net amount plus
  VAT, services excluded and non-binding; it does not disclose internal cost structure.
- Verification: `configurator-calculation.md`, `claims-and-evidence-register.md`,
  `src/features/configurator/pricing.ts` and the configurator/lead unit tests.

## New decision template

```markdown
## ADR-XXX — Title

- Date:
- Status: Proposed / Accepted / Superseded
- Context:
- Decision:
- Consequences:
- Verification:
```
