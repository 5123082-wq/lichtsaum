# LICHTSAUM

Working product brand for a proposed German B2B service: an illuminated replacement valance for an
existing compatible commercial awning. Legal/company-name/trademark availability remains `TBD`.

Status: a responsive landing and lead flow are publicly deployed, while newer work exists locally.
Previous repository-imposed publication restrictions were cancelled by the owner on 2026-08-11.
For every concrete deployment, indexing, Search Console, GTM/Ads, form or attachment action, show
the current facts and use `Спросить у пользователя`; see
[`docs/architecture/publication-governance.md`](docs/architecture/publication-governance.md).

## Project outcome

Build and validate a fast, accessible and conversion-focused German landing that:

- follows the approved Google Stitch visual direction;
- exposes useful content in server-rendered HTML;
- is ready for Google Search and Google Ads release checks;
- collects and validates inquiries safely;
- measures only server-confirmed leads;
- respects German/EU privacy, consent and provider-information requirements;
- distinguishes verified claims from unresolved ones and asks the user before publishing an
  unresolved factual claim.

Google-first means that indexing, metadata, consent and measurement boundaries are designed into
the application. It does not guarantee Google indexing, ad approval or rankings.

## Read first

1. [`AGENTS.md`](AGENTS.md) — mandatory repository rules and shallow-context protocol.
2. [`PROGRESS.md`](PROGRESS.md) — read only `AGENT_CONTEXT` and the three `RECENT_CHANGES` entries
   by default.
3. [`docs/README.md`](docs/README.md) — read its `AGENT_BRIEF` and `Reading map` first.
4. [`docs/architecture/publication-governance.md`](docs/architecture/publication-governance.md) —
   read its brief when publication or an external action is in scope.
5. [`DESIGN.md`](DESIGN.md) — visual source of truth; start from the relevant section.

For substantial implementation or review work, also use [`SKILL.md`](SKILL.md).

## Repository map

| Path | Purpose |
| --- | --- |
| `DesignPrototip/` | Approved Stitch references, exports and licensed assets |
| `docs/strategy/` | Product/market decision, evidence ledger, GTM and landing brief |
| `docs/architecture/` | Stack, system boundaries, roadmap and decisions |
| `docs/content/` | German content strategy and evidence-controlled claims |
| `docs/seo/` | Search intent, crawl/index policy and structured data |
| `docs/marketing/` | Google Ads destination and measurement contract |
| `docs/legal/` | Germany/EU compliance and data/consent inventory |
| `src/` | Next.js landing, typed content, production lead flow and release safeguards |
| `public/images/` | Production-consumed public media only; review assets stay outside this tree |
| `tests/` | Unit, accessibility, responsive, form and indexing checks |
| `temp/` | Ignored local quarantine; never a source of truth |

## Foundation decisions

- Google Stitch defines visual direction, not production markup.
- Next.js App Router, strict TypeScript and static/server-first rendering.
- Tailwind CSS with project-owned tokens and custom accessible components.
- German is the first public language; production is the only indexable environment.
- Google Tag Manager is the managed tag layer; Consent Mode v2 is an architectural boundary.
- A primary conversion exists only after the backend has accepted a valid lead.
- Plain, configurator and calculator inquiries share one lead intake and the same Primary Ads
  conversion; see
  [`docs/architecture/unified-lead-form-contract.md`](docs/architecture/unified-lead-form-contract.md).
- Metadata, canonical URLs, sitemap, Schema and claims use centralized verified facts.
- Hosting, persistence, email and domain are implemented. Remaining business, legal, privacy and
  technical uncertainties are reported as `Спросить у пользователя`, not autonomous release
  blockers.

## Local review

Requirements: Node.js 22+ and pnpm 9.15.9.

```bash
pnpm install
pnpm dev:watch
```

Open `http://127.0.0.1:3000`. The local environment is not a Search release target; form inputs are
validated but not stored or sent. `pnpm dev:watch` restarts the local server after an unexpected exit; use
`pnpm dev` only when an intentionally short-lived foreground process is preferred. A running
development server does not need to be stopped for `pnpm build`.

Checks:

```bash
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm build
```

## Current next step

Continue the requested site work from the current-only roadmap. Before a concrete public action,
present the current deployment, claims, media-rights, malware/processor, consent and measurement
facts and ask the user which state to publish. Do not reopen archived O10/Search/Ads plans.
