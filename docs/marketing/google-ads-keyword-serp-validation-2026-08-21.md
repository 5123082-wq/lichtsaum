# Google Ads Keyword SERP Validation — 2026-08-21

Status: `Verified` for live SERP relevance; search volume, CPC and conversion performance remain
unverified
Last reviewed: 2026-08-21

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: dated Google.de SERP evidence for the first LICHTSAUM Search campaign keyword set.
- Current: the validated cleanup is applied: 22 criteria are enabled, 7 rejected criteria remain
  paused for traceability, and the campaign remains enabled by explicit owner instruction.
- Open: Keyword Planner and live campaign data are still needed for demand, CPC, search-term and
  conversion decisions.
- Read full when: editing the first campaign's keyword set or interpreting competitor evidence.
<!-- AGENT_BRIEF:END -->

## Scope and method

- Market and language: Germany, German.
- Audience and goal: B2B project inquiry for an illuminated/branded valance on an existing awning.
- Surface: visible Google Search results in the in-app browser with `hl=de`, `gl=de` and `pws=0`.
- Sample: 18 unique existing queries plus 20 additional candidates, checked in five parallel tabs.
- Evidence captured: first-page domains, product competitors, ads and obvious intent drift.
- Control competitor: `luminard.com`; peers included `retrosun.eu`, `displaylight.fr` and
  `vana-deutschland.de`.
- Reliability: no CAPTCHA occurred. SERPs are dated, location-sensitive and can change.

This check validates query context, not demand. A competitor appearing in the SERP does not prove
monthly volume, affordable CPC or qualified lead potential.

## Executive decision

| Signal | Result |
| --- | ---: |
| Existing Ads criteria | 22 |
| Unique existing search phrases | 18 |
| Unique phrases to keep | 11 |
| Unique phrases to restrict | 1 |
| Unique phrases with wrong intent | 6 |
| Existing criteria to keep | 14 |
| Existing criteria to restrict | 1 |
| Existing criteria to pause | 7 |
| Existing SERPs containing Luminard | 12 of 18 |
| Existing SERPs containing ads | 16 of 18 |
| Existing SERPs containing LICHTSAUM organically | 6 of 18 |

The original 22-keyword set was not launch-ready without cleanup; the validated cleanup was applied
through the Google Ads API later on 2026-08-21.

## Existing keyword validation

| Ad group | Unique query | Decision | Observed first-page evidence |
| --- | --- | --- | --- |
| Leuchtvolant | `beleuchteten volant nachrüsten` | Keep | Luminard, Retrosun, Display Light |
| Leuchtvolant | `beleuchteter markisenvolant` | Keep | Luminard, LICHTSAUM, Retrosun, Display Light |
| Leuchtvolant | `beleuchtete markisen-volants` | Keep | Luminard, Retrosun, Display Light |
| Leuchtvolant | `beleuchteter werbevolant` | Pause | Generic illuminated signs and pylons; no Luminard |
| Leuchtvolant | `bestehende markise led volant` | Keep | Luminard and Retrosun lead; some Vario-Volant noise |
| Leuchtvolant | `led markisenvolant` | Keep | Luminard, Retrosun, Display Light |
| Leuchtvolant | `leuchtvolant markise` | Keep | Luminard, Retrosun, LICHTSAUM, Display Light |
| Leuchtvolant | `markisenvolant beleuchtung nachrüsten` | Exact only | Luminard appears, but camper/DIY results dominate |
| Gastronomie | `beleuchteter markisenvolant gastronomie` | Keep | Luminard, LICHTSAUM, Retrosun, Display Light |
| Gastronomie | `beleuchteter werbevolant gastronomie` | Pause | Generic gastronomy signs and light boxes; no Luminard |
| Gastronomie | `led markisenvolant café` | Keep | Luminard, LICHTSAUM, Display Light, Retrosun |
| Gastronomie | `leuchtvolant restaurant` | Pause | Restaurant lighting and venue results; no product competitors |
| Branding | `beleuchteter volant schriftzug` | Keep | Luminard, Display Light, LICHTSAUM, printing specialists |
| Branding | `led volant logo` | Pause | Automotive logos, generic LED logos and Etsy products |
| Branding | `leuchtvolant werbetechnik` | Pause | Generic sign-making companies; no product competitors |
| Branding | `leuchtvolant werbung` | Pause | Generic illuminated advertising; no product competitors |
| Branding | `markisenbeschriftung beleuchtet` | Keep | Luminard, Display Light and awning-print specialists |
| Branding | `markisenvolant mit logo beleuchtet` | Keep | Luminard, LICHTSAUM, Retrosun and printing specialists |

Because Exact and Phrase entries share the same visible Google query, the account-level operation
mapping is:

- keep 14 current criteria;
- replace Phrase `markisenvolant beleuchtung nachrüsten` with Exact if the owner approves;
- pause 7 criteria: Phrase `beleuchteter werbevolant`, Phrase
  `beleuchteter werbevolant gastronomie`, Exact and Phrase `leuchtvolant restaurant`, Phrase
  `led volant logo`, Phrase `leuchtvolant werbetechnik`, and Phrase `leuchtvolant werbung`.

## Additional candidates

### Priority A — controlled Exact tests

| Proposed Exact keyword | Observed evidence |
| --- | --- |
| `[markisenvolant mit led beleuchtung]` | Luminard, Retrosun, VANA, Display Light |
| `[beleuchteter markisenvolant nachrüsten]` | Luminard, Retrosun, Display Light |
| `[beleuchteter markisenvolant gewerbe]` | LICHTSAUM, Luminard, Retrosun, Display Light |
| `[beleuchteter markisenvolant restaurant]` | LICHTSAUM, Luminard, Display Light, Retrosun |
| `[markisenvolant beleuchtet logo]` | Luminard and LICHTSAUM lead the relevant results |
| `[markisenvolant beleuchtet schriftzug]` | Luminard, LICHTSAUM, Display Light |
| `[beleuchteter markisenvolant anbieter]` | Luminard, LICHTSAUM, Retrosun, Display Light, VANA |

### Priority B — test only after first search-term data

| Proposed Exact keyword | Reason to defer |
| --- | --- |
| `[beleuchteter markisenvolant geschäft]` | Strong competitor match, but likely narrow volume |
| `[beleuchtete markisen-volants gastronomie]` | Strong match, overlaps the existing gastronomy query |
| `[beleuchteter markisenvolant kaufen]` | Strong commercial SERP, but the current offer is quote-only |

### Do not add now

- `beleuchteter markisenvolant preis`: price/replacement-valance intent; Luminard absent.
- `leuchtvolant gastronomie`: generic gastronomy lighting; Luminard absent.
- `markisenvolant lichtwerbung`: printing dominates despite a lower Luminard result.
- `led markisenvolant nachrüsten`: camper and Vario-Volant noise.
- `beleuchtete markisen-volants nach maß`: replacement-valance noise.
- `led volant markise kaufen`: whole-awning, marketplace and Vario-Volant noise.

## Applied account state

After reviewing this evidence, the owner explicitly instructed that campaign `24153758040` remain
enabled and authorized the recommended keyword changes. The Google Ads API validated and then
applied one atomic operation set:

- 7 wrong-intent criteria changed from Enabled to Paused;
- Phrase `markisenvolant beleuchtung nachrüsten` removed;
- the same text recreated as Exact;
- 7 Priority A Exact candidates created as Enabled.

The post-mutation API read confirmed 22 Enabled and 7 Paused non-removed criteria. Campaign status
remained `ENABLED`; impressions, clicks and spend were still zero at verification time.

Use Keyword Planner and controlled live data next to evaluate volume, CPC, search terms and
qualified leads. SERP relevance alone does not predict campaign performance.
