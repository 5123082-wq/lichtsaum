# Architecture Decision Log

Last reviewed: 2026-07-30

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
| ADR-012 | 2026-07-30 | Proposed | Validate the LICHTSAUM B2B illuminated-valance retrofit before application scaffolding |
| ADR-013 | 2026-07-30 | Accepted | Allow an explicitly local, non-indexable review prototype before product `GO` |

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
- Status: Proposed; requires owner acceptance
- Context: the available evidence confirms a technically feasible but early and narrow category.
  Search volume, installed-base compatibility, supplier/installation responsibility and realised
  German unit economics are not yet verified.
- Decision: scope LICHTSAUM to a B2B retrofit of the replaceable valance on an existing compatible
  commercial awning. Prioritise independent restaurants/cafés, test Berlin/Brandenburg only if
  operations are confirmed, and use `Projekt prüfen lassen` as the compatibility-led CTA. Do not
  initialise the application or publish a landing until the product decision, technical chain,
  operating scope, claims and legal inputs pass their gates.
- Consequences: product/market validation precedes the existing application roadmap. One canonical
  exact-category landing is planned; B2C/new-awning scope, generic ambient-light keywords,
  nationwide full service and a public calculator are deferred.
- Verification: `../strategy/product-market-decision.md`,
  `../strategy/market-and-competitor-evidence.md` and
  `../strategy/go-to-market-and-landing-brief.md`.

## ADR-013 — Local prototype before product `GO`

- Date: 2026-07-30
- Status: Accepted by explicit owner request
- Context: ADR-012 intentionally deferred application scaffolding until product validation. The
  owner later explicitly requested a complete responsive implementation in order to evaluate the
  product story, UX and Stitch adaptation, while also prohibiting publication without separate
  approval.
- Decision: implement a local Next.js prototype with the full German landing journey and a
  validation-only form. Keep every environment non-indexable unless production release is
  separately configured and approved. Do not connect persistence, email, CRM, uploads, analytics,
  advertising tags or a server-confirmed lead event.
- Consequences: the prototype can be reviewed and tested before product `GO`, but it does not
  supersede the `VALIDATE FIRST` decision or satisfy supplier, operational, evidence, legal,
  privacy, measurement or launch gates. Production activation remains a separate decision.
- Verification: `../../PROGRESS.md`, `../../design-qa.md` and the automated checks in
  `../../tests/`.

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
