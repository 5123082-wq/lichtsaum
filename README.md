# LICHTSAUM

Working product brand for a proposed German B2B service: an illuminated replacement valance for an
existing compatible commercial awning. Legal/company-name/trademark availability remains `TBD`.

Status: product/market decision remains `VALIDATE FIRST`. A complete responsive landing exists as a
local, explicitly non-indexable review prototype; it is not approved for production publication.

## Project outcome

After product validation, build a fast, accessible and conversion-focused German landing that:

- follows the approved Google Stitch visual direction;
- exposes useful content in server-rendered HTML;
- is ready for Google Search and Google Ads release checks;
- collects and validates inquiries safely;
- measures only server-confirmed leads;
- respects German/EU privacy, consent and provider-information requirements;
- publishes only verified product and business claims.

Google-first means that indexing, metadata, consent and measurement boundaries are designed into
the application. It does not guarantee Google indexing, ad approval or rankings.

## Read first

1. [`PROGRESS.md`](PROGRESS.md) — current state, next action and blockers.
2. [`AGENTS.md`](AGENTS.md) — mandatory repository rules.
3. [`docs/README.md`](docs/README.md) — documentation map.
4. [`docs/architecture/implementation-roadmap.md`](docs/architecture/implementation-roadmap.md) —
   build sequence and exit gates.
5. [`DESIGN.md`](DESIGN.md) — visual source of truth.

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
| `src/` | Local Next.js landing, typed content and validation-only project-check form |
| `public/images/` | Optimized concept imagery for the local prototype |
| `tests/` | Unit, accessibility, responsive, form and indexing checks |
| `temp/` | Ignored local quarantine; never a source of truth |

## Foundation decisions

- Google Stitch defines visual direction, not production markup.
- Next.js App Router, strict TypeScript and static/server-first rendering.
- Tailwind CSS with project-owned tokens and custom accessible components.
- German is the first public language; production is the only indexable environment.
- Google Tag Manager is the managed tag layer; Consent Mode v2 is an architectural boundary.
- A primary conversion exists only after the backend has accepted a valid lead.
- Metadata, canonical URLs, sitemap, Schema and claims use centralized verified facts.
- Hosting, CRM/email, CMP, domain and business/legal facts remain explicit release blockers.

## Local review

Requirements: Node.js 22+ and pnpm 9.15.9.

```bash
pnpm install
pnpm dev:watch
```

Open `http://127.0.0.1:3000`. The local prototype is `noindex`; form inputs are validated but not
stored or sent. `pnpm dev:watch` restarts the local server after an unexpected exit; use
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

Review the local prototype, accept/revise/reject the product/market decision, and validate
supplier/technical readiness, paid demand and unit economics. Do not connect a real lead flow,
enable indexing or publish until the corresponding product, technical, legal and release gates
pass.
