# Product–Market Decision

Status: `Proposed` — requires owner acceptance  
Decision candidate: `VALIDATE FIRST`  
Decision date: 2026-07-30  
Evidence cut-off: 2026-07-30  
Working brand: `LICHTSAUM`; company-name and trademark availability remain `TBD`

> This strategy remains evidence and a recommendation. Its former publication/scaffold/Ads gates
> are superseded by
> [`../architecture/publication-governance.md`](../architecture/publication-governance.md).
> Concrete public actions are `Спросить у пользователя`.

## Executive decision

**Decision: `VALIDATE FIRST`.**

LICHTSAUM should be tested as a narrow B2B retrofit service: a custom illuminated textile valance
(`beleuchteter Markisen-Volant`, светящийся волан маркизы) for an **existing compatible commercial
awning**. It should not yet be treated as a validated national product business or as a replacement
for the current company strategy.

The evidence supports technical feasibility and a small, real competitive category. It does not yet
prove German demand volume, an attractive repeatable margin, installation capacity, or that the
supplier and compliance chain is ready. The base model estimates about EUR 2.14 million of annual
German project revenue and about EUR 113,000 in the proposed Berlin/Brandenburg primary segment, but
both figures are dominated by unverified suitability and purchase-rate assumptions. They are
decision models, not forecasts.

| Decision field | Proposed choice |
| --- | --- |
| Product | Managed retrofit of the replaceable valance on an existing B2B awning; the awning itself is not sold |
| Primary segment | Independent restaurants and cafés with evening trade, a street-facing existing awning and visible brand frontage |
| Secondary segments | Selected bars; independent/boutique hotels; design-led retail after segment-specific proof |
| Channel segment | Awning installers, advertising/sign companies and façade/project partners |
| Deferred segment | Chains and multi-site rollouts until one-site delivery is repeatable |
| Pilot geography | Berlin and Brandenburg only, **conditional** on the owner confirming service capacity and partners |
| Flagship configuration | One 2400 × 200 mm illuminated zone in a 300 mm finished valance, delivered as a managed project and only where technically compatible |
| Supporting configurations | 1200 × 150 mm, 1200 × 300 mm and 1–3 illuminated zones; all engineering-led, not public tariff families |
| Positioning | An architecture-conscious brand-light retrofit for an existing commercial awning |
| Primary promise | `Markise wird Markenlicht.` — exact landing H1 locked by owner decision on 2026-08-10 |
| Category line | `Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen` |
| Primary CTA | `Projekt prüfen lassen` |
| Commercial offer | Photo/compatibility check → design proof → confirmed scope and quote → production → optional coordinated installation/electrical work |
| Public pricing at first release | No fixed `ab` or complete-project price; ADR-015 permits only the server-reproduced component subtotal + 0% on `/konfigurator` as restricted B2B-net validation output |
| Calculator | Implemented locally as a validation tool under ADR-015; production/B2C/Ads release remains gated |
| First acquisition channels | Local account-based outreach, installer/sign-partner referrals, then tightly matched exact/phrase Search |
| Explicit exclusions | New awnings, B2C terrace lighting, ambient LED strips, DIY/repair parts, generic signage, nationwide full-service claims |

This decision is based on the [market and competitor evidence](market-and-competitor-evidence.md)
and is translated into a testable [go-to-market and landing brief](go-to-market-and-landing-brief.md).

## What the product is

### Customer-visible product

LICHTSAUM is a project to replace the detachable textile valance at the front of an existing
commercial awning with a custom valance containing one or more thin illuminated fields behind a
logo or wordmark.

The standard project may contain:

1. photo-based pre-check;
2. on-site measurement where required;
3. artwork preparation and day/night design proof;
4. new textile valance, illuminated panel, driver/power supply and planned cable route;
5. delivery;
6. removal of the old valance and installation of the new one where offered;
7. electrical connection by an appropriately qualified contractor where required;
8. optional documentation support for a local advertising-system review.

Each service must remain a separate quoted line until the operating model is proven. “Turnkey,”
“full service,” installation coverage and permit support are not public claims until the owner has
confirmed who performs and warrants each step.

### Flagship

**Proposed flagship:** one 2400 × 200 mm illuminated field, a 300 mm finished valance and a
maximum letter height of 180 mm, as a managed one-site retrofit.

Reasoning:

- it can present one continuous restaurant or café wordmark more coherently than two small fields;
- the 300 mm finished height is a more restrained architectural default than the 380 mm alternative;
- one illuminated field keeps design, cabling and commissioning simpler than a multi-zone project;
- the underlying supplier format is already standardised in a current professional catalogue.

This is an internal product hypothesis. It does **not** mean that every 1.3–6 m awning accepts the
format or that every logo is legible at 180 mm. A real sample, supplier approval and compatibility
check are required before this becomes a public standard.

### Supporting line

| Working offer | Use | Commercial treatment |
| --- | --- | --- |
| Standard one-zone retrofit | One venue, one existing awning, simple wordmark/logo | Flagship after compatibility review |
| Compact/tall one-zone retrofit | 1200 × 150 or 1200 × 300 mm panel where geometry or artwork requires it | Quoted alternative |
| Multi-zone/wide project | 2–3 illuminated fields, long name or several brand elements | Manual engineering and quote |
| Partner supply | Fabricated valance and technical pack for an approved installer/sign partner | Pilot only after responsibilities are contracted |
| Multi-site rollout | Repeatable CI package for a chain | Deferred until at least one-site delivery and service are repeatable |

The launch minimum order should be **one complete configured valance**, not an LED panel, loose
part, repair SKU or DIY kit. The minimum invoice value remains `TBD` until direct costs and the
target contribution are owner-approved.

### What LICHTSAUM is not

- not a new awning;
- not general patio or residential lighting;
- not a lightbox, façade sign or generic illuminated-letter service;
- not an unlit printed replacement valance;
- not a universal retrofit for every awning;
- not a permit-free or electrician-free product;
- not an online store or self-install kit at launch;
- not a promise of more footfall, revenue or a measurable visibility uplift.

## Compatibility and stop rules

A quote may be generated automatically only after all standard-case rules are evidenced. Until
then, every project is manually reviewed.

| Gate | Required evidence | Manual review / stop condition |
| --- | --- | --- |
| Existing awning | Serviceable commercial awning and replaceable valance | Damaged structure, unknown system or non-removable front element |
| Geometry | Overall width, finished valance height, attachment/Keder details and usable field | Curved/irregular geometry, insufficient height or unsupported attachment |
| Load and movement | Supplier/awning confirmation that the added assembly does not impair motion or wind behaviour | Added weight, folding or cable path may obstruct the mechanism |
| Artwork | Logo/text fits the verified illuminated field and letter-height limit | Fine detail, low contrast or required lettering outside limits |
| Cable route | Protected route with strain relief and no pinch point through the awning cycle | Route through arms/joints is unresolved |
| Power supply | Safe driver location and suitable protected enclosure | Outdoor driver protection is unresolved; current supplier catalogue says its standard driver is not waterproof |
| Electrical work | Scope and responsible qualified installer are named | Fixed connection or local work is assigned to no responsible contractor |
| Site rights | Tenant/owner authority and façade responsibility are known | Landlord/property consent unresolved |
| Local rules | Advertising-system, conservation and local design rules checked for the object | Approval status unknown where work would proceed |
| Access | Safe installation access included in scope | Lift/scaffold/traffic control not priced or feasible |
| Service | Warranty, maintenance and fault responsibility allocated | Supplier/installer/client responsibility remains ambiguous |

Automatic pricing must also exclude multi-site rollouts, heritage façades, special access,
unconfirmed power, damaged awnings, non-standard colours or controls, more than three illuminated
zones and any project lacking adequate photos and measurements.

## Segment decision

The following is a qualitative pilot-fit score, not measured demand. Each criterion is scored 1–5:
evening visibility need, physical product fit, budget tolerance, reachable decision maker and
manageable proof/procurement burden.

| Segment | Need | Fit | Budget | Reach | Pilot ease | Total | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Independent restaurants/cafés | 5 | 5 | 3 | 4 | 4 | 21 | **Primary** |
| Selected bars/pubs | 5 | 4 | 2 | 3 | 3 | 17 | Secondary, price-sensitive |
| Boutique/independent hotels | 4 | 4 | 4 | 2 | 2 | 16 | Secondary after a relevant case |
| Design-led shops/boutiques | 3 | 4 | 3 | 3 | 3 | 16 | Secondary after retail proof |
| Chains/multi-site operators | 5 | 4 | 5 | 1 | 1 | 16 | Defer; procurement and rollout risk |

### Primary ideal customer profile

The first customer is an owner-operated restaurant or café that:

- trades after dusk or wants the frontage to remain legible in evening conditions;
- already has a street-facing awning with a replaceable valance;
- is opening, rebranding, refurbishing or replacing a worn/incorrect valance;
- values controlled brand presentation rather than the lowest-cost replacement fabric;
- can provide façade/awning photos and identify the owner/landlord decision path;
- is within the confirmed pilot service radius.

Bars can exhibit stronger evening need but weaker budget stability. Hotels have more budget but a
longer technical and brand approval chain. Retail is a large but heterogeneous universe, and much
of its search intent is adequately served by unlit printing. Chains offer repeatability only after
the one-site process, documentation and service model are proven.

### Partner channel

Awning installers and advertising/sign companies are not merely referral sources. They already
have the installed-base trigger, measurement competence, local access and client trust that this
low-volume category lacks. The partner offer should define:

- who owns measurement accuracy;
- who approves artwork and technical compatibility;
- who supplies and warrants each component;
- who installs and electrically connects it;
- who handles local authority and landlord questions;
- referral/reseller margin and non-circumvention terms;
- fault diagnosis, rework and replacement responsibility.

No partner programme should be advertised before these boundaries are contractual.

## Positioning decision

### Category

Use the precise working category:

> `Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen`

`LED-Markisenvolant`, `Leuchtvolant für Markisen` and natural hyphen variants may support the copy.
Do not lead with `LED Markise`, `Markise mit Licht` or `Leuchtmarkise`: current result samples
predominantly mean a new B2C awning, ambient lighting or camper accessories.

### Positioning statement

For independent hospitality businesses that want a more legible, controlled brand presence after
dark without replacing a serviceable awning, LICHTSAUM is a managed illuminated-valance retrofit.
It combines compatibility review, brand design and a coordinated physical installation instead of
selling an isolated light panel or a complete new awning.

### Message hierarchy

1. **What:** a custom illuminated valance for an existing commercial awning.
2. **Why:** the brand remains visually present when an unlit textile valance disappears into the
   evening frontage.
3. **Why this offer:** one coherent design and delivery process for the new illuminated valance.
4. **Proof:** a real day/night sample, technical limits, transparent inclusions and completed
   projects.
5. **Project process:** collect the object data needed to prepare the final execution.
6. **Action:** `Projekt prüfen lassen`.

The hero line `Markise wird Markenlicht.` is the owner-approved, locked landing H1. Do not rewrite
it for SEO, expand it to the earlier proposed variant or add any category/supporting copy to the
current hero. The approved lower-page product explanation is
`Der textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt.` It remains in
the existing `Eignung` section; measurements and execution checks belong to the project process.

### Positioning alternatives rejected for launch

| Alternative | Reason not to lead with it |
| --- | --- |
| “More customers / more turnover” | No measured causal evidence |
| “Cheaper than a new sign/awning” | Total installed comparison varies by object and approval path |
| “Permit-free branding” | Local advertising and conservation rules are object-specific |
| “Waterproof / weatherproof system” | Complete-system rating and driver enclosure are not verified |
| “Premium illuminated awnings” | Too broad; implies a full awning and mixed B2C outdoor-living intent |
| “Germany-wide full service” | Installation and electrical coverage are not confirmed |

## Market and economic decision

### Market model summary

The detailed assumptions and sources are in
[Market sizing](market-and-competitor-evidence.md#tamsamsom-model).

| Scenario | German suitable sites | Annual projects | Annual TAM revenue | Berlin/Brandenburg annual projects | Pilot SAM revenue |
| --- | ---: | ---: | ---: | ---: | ---: |
| Low | 11,267 | 56 | EUR 141k | 3 | EUR 8k |
| Base | 27,414 | 411 | EUR 2.14m | 22 | EUR 113k |
| High | 53,480 | 1,604 | EUR 12.84m | 72 | EUR 578k |

The input universe is 369,968 German enterprises across the selected gastronomy, hotel and
stationary-retail proxies. It is not a count of compatible awnings. Suitability, annual activation
and average project value are explicit analyst assumptions because no reliable installed-awning
share, category purchase rate or replacement cadence was found.

The base case is too small and uncertain to support a national direct-sales organisation on its
own. It is sufficient to justify a low-cost pilot and a partner-led product line if the margin and
delivery chain validate.

### First-year SOM test

Because service capacity and qualified pipeline are unknown, SOM is shown as a test envelope, not
a forecast.

| Scenario | Paid projects | Assumed average net project | First-year net revenue |
| --- | ---: | ---: | ---: |
| Low | 2 | EUR 2,500 | EUR 5,000 |
| Base | 8 | EUR 5,200 | EUR 41,600 |
| High | 18 | EUR 8,000 | EUR 144,000 |

Actual SOM must be recalculated as:

`minimum(confirmed delivery capacity, annual SAM projects, qualified opportunities × close rate)`.

The owner must supply monthly installation capacity before this becomes a business forecast.

### Pricing and unit economics

These are internal Low/Base/High scenarios, not approved public prices. They include illustrative
direct work and a reserve but exclude company overhead, taxes, financing and unallocated founder
time.

| Scenario | Direct cost | Target direct gross margin | Model net price | Gross incl. 19% VAT | Contribution before overhead |
| --- | ---: | ---: | ---: | ---: | ---: |
| Low/simple | EUR 1,735 | 30% | EUR 2,479 | EUR 2,950 | EUR 744 |
| Base/flagship | EUR 3,101 | 40% | EUR 5,168 | EUR 6,150 | EUR 2,067 |
| High/custom | EUR 7,908 | 45% | EUR 14,378 | EUR 17,110 | EUR 6,470 |

The catalogue product is only one part of direct cost. The model also includes freight, artwork,
measurement, removal, installation, electrical work, access/permit coordination where applicable
and a rework/warranty reserve. Every value except the current supplier catalogue line is an
assumption requiring owner or vendor evidence.

At assumed qualified-lead-to-order rates of 10% / 20% / 25%, contribution-only break-even CPL is
approximately EUR 74 / EUR 413 / EUR 1,618. A safer test cap of 30% of contribution would imply
planning CAC of about EUR 223 / EUR 620 / EUR 1,941 and CPL of EUR 22 / EUR 124 / EUR 485. These
are calculation outputs, not campaign budgets. Real labour, close rate, cancellation and rework
data must replace them.

### Public pricing decision

1. Before publishing supplier component values as customer prices or a general LICHTSAUM tariff,
   show the scope mismatch and use `Спросить у пользователя`. ADR-015 records the currently
   implemented server-reproduced combined subtotal with 0% markup and CLM-029 limitations.
2. Before a universal `ab EUR …` claim, show that a product-only case and a managed installed
   project are materially different scopes and use `Спросить у пользователя`.
3. On the first landing, explain price drivers and promise only a project-specific range after the
   compatibility check, if the owner confirms that workflow.
4. Use the locally implemented component calculator to collect validation evidence. A later
   complete-project range still requires at least 10 complete estimates and 3 installed paid
   projects and must show product, design, delivery, installation, electrical work and special
   access as separate inclusions/exclusions.
5. The estimator must visibly say `vorläufig`, state net/gross and VAT treatment, never guarantee
   compatibility or approval, and route non-standard cases to manual review.

## Route to market

Search proves category existence but not enough demand to make paid search the only launch channel.
The first three channels are:

1. **Local visual account outreach:** identify suitable existing awnings and approach the operator
   with a restrained day/night concept, without using façade imagery publicly without permission.
2. **Installer/sign partner channel:** reach the installed base at replacement, rebrand and repair
   moments.
3. **Search capture:** exact/phrase product and tightly qualified retrofit terms, after the landing,
   claims, destination and conversion gate are ready.

Broad generic awning campaigns, Performance Max and remarketing are deferred. Remarketing also
requires the approved consent path. Detailed channel, search and landing requirements are in the
[GTM brief](go-to-market-and-landing-brief.md).

## 30/60/90 validation gates

### Days 0–30 — prove deliverability

- obtain a written supplier offer, purchasing terms and German delivery conditions;
- obtain the full technical file relevant to the supplied assembly: component declarations,
  electrical diagram, ratings, driver enclosure requirement, installation constraints and warranty;
- build and inspect one physical flagship sample;
- confirm who owns design, measurement, removal, installation, electrical connection, authority
  documentation, rework and warranty;
- confirm the actual pilot geography and monthly service capacity;
- complete at least 10 primary-customer interviews and 5 installer/sign-partner interviews;
- record objections, replacement triggers and acceptable buying process without leading questions.

**Gate:** no paid installation or public technical claim while the electrical/outdoor responsibility
is unresolved.

### Days 31–60 — prove willingness to pay

- run at least 10 real compatibility reviews;
- issue at least 5 itemised formal quotes at margin-protecting prices;
- secure at least 2 paid pilot orders or document the exact rejection reasons;
- test local account outreach and at least 2 potential partner relationships;
- collect actual time and direct cost for design, measurement, logistics and installation;
- create permission-cleared day/night material from the sample or first project.

**Owner question:** if most quotes require manual exceptions or the standard-case price spread
remains wider than ±15%, show that evidence and use `Спросить у пользователя` before presenting the
calculator as a complete-project estimator.

### Days 61–90 — prove repeatability

- target at least 3 completed paid installations and 10 total formal quotes;
- verify at least 35% direct gross margin after real rework and delivery cost in the proposed base
  package;
- obtain at least one partner-sourced qualified opportunity;
- document compatibility acceptance/rejection and every non-standard cost;
- confirm a safe, repeatable electrical and local-rule workflow;
- secure rights for at least one complete day/night case.

**Advance to `GO`** only if there is a repeatable standard case, no unresolved safety/compliance
blocker, real contribution margin, owner-confirmed capacity and evidence that buyers accept the
project price.

**Revise or stop** if there are no paid orders after at least 15 qualified reviews at approved
pricing, if more than 70% of the intended installed base is incompatible, if standard-case direct
margin stays below 30%, or if no party will own installation/electrical/warranty risk.

These thresholds are proposed management rules. The owner may change them before the pilot, but
should not change them retrospectively to make an unsuccessful test appear successful.

## Risks and mitigations

| Risk | Current status | Mitigation / evidence needed |
| --- | --- | --- |
| Category demand too small | High uncertainty | Manual discovery, paid pilots and qualified Search test before scale |
| Existing-awning compatibility | High | Photo checklist, measurement protocol, approved-system rules and stop list |
| Outdoor/electrical safety | Blocking | Supplier technical file, enclosure design and qualified electrical contractor |
| Local advertising/heritage permission | Object-specific | Local check; clear client/partner responsibility; no permit-free claim |
| Margin consumed by access/rework | High | Itemised scope, separate special-access line, reserve and actual-job costing |
| Supplier concentration | High | Contract, service levels, spare/replacement path and second-source study later |
| Weak visual proof | Blocking for premium launch | Physical sample and rights-cleared day/night cases |
| Confusion with ambient LED/new awning | High | Exact category wording and strict search exclusions |
| Hospitality price sensitivity | Medium–high | Lead with compatibility and design value; qualify budget before field visit |
| Brand/name conflict | Open | Company-name and trademark search; do not infer availability from web use |

## Owner decisions required

The following inputs cannot be inferred from market research:

1. **Answered 2026-08-04:** LICHTSAUM is an offer/brand of the existing NVKV Werbeagentur Inh.
   Ivan Novikov; final brand/trademark clearance remains separate.
2. Is Matussière the intended supplier, and are current purchasing terms available?
3. Which technical declarations, ratings, warranty and installation instructions have actually
   been received?
4. Who owns artwork, measurement, removal, installation, electrical connection, permit support,
   maintenance and warranty?
5. Is Berlin/Brandenburg a real service area, and what travel/access radius is economic?
6. What installation capacity exists per month?
7. What target direct gross margin and minimum invoice are required?
8. What are actual freight, customs/handling, lead time, cancellation and replacement terms?
9. Is there a qualified electrical and installation partner?
10. Are there a physical sample, completed projects, day/night photos and publication rights?
11. **Partly answered:** the legal entity and provider contact data are confirmed; the domain,
    production hosting, email/CRM processors and retention remain open.
12. May the current Google Ads account be used for a read-only Keyword Planner query with the
    listed non-confidential seed phrases?

## Landing/build authority

The product decision is sufficiently clear to begin **information architecture, German copy
prototyping and a low-fidelity landing design** after the owner accepts this document.

The former prohibition on a production scaffold or lead-generating landing is superseded. Before a
concrete publication, show the owner these open facts:

- supplier and complete-system technical evidence;
- actual operating scope, geography and responsibility;
- approved pricing/margin policy;
- real sample/case imagery and rights;
- production domain, vendor, retention and final privacy-review inputs;
- claims-register approval.

Application implementation/publication authority follows the user's current request and
`../architecture/publication-governance.md`, not this historical strategy gate.
