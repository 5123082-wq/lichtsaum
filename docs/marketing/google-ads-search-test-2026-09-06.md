# Google Ads — CPC cap and adjacent-demand test

Status: `Verified` external configuration; traffic and business outcome remain unproven.
Verified: 2026-09-06 20:53 Europe/Berlin.

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: owner-authorized CPC cap and three-keyword test applied after the September 6 audit.
- Current: campaign CPC ceiling €5, budget €20/day, Maximize Clicks; new enabled group with three Exact keywords and one RSA under review.
- Open: all three new keywords are now ELIGIBLE; RSA moderation is still in progress and traffic is zero. Review traffic quality after moderation; transaction-level deduplication remains unverified.
- Read full when: changing or assessing this test, its ad copy, bids or keyword statuses.
<!-- AGENT_BRIEF:END -->

## Authorization and scope

The owner said «делай» after the proposal to set a €5 CPC ceiling, preserve the €20/day budget,
test `[markisen werbung]`, `[markisenbeschriftung]`, `[markise beschriften]`, explicitly describe
the illuminated product and continue conversion diagnostics. The six-operation atomic mutation
implements that bounded test in the existing campaign. No new campaign budget is created.

The [earlier audit](google-ads-audit-2026-09-06.md) remains the historical pre-change baseline.
The same-day test lead LS-2026-000027 is an owner test, not a customer acquisition.

## Verified configuration

| Setting | Result |
| --- | --- |
| Account / campaign | `3638184039` / `24153758040`, campaign ENABLED |
| Bidding | Maximize Clicks (`TARGET_SPEND`); `target_spend.cpc_bid_ceiling_micros=5000000` |
| Campaign budget | `20000000` micros = €20/day |
| New ad group | `Markisenwerbung \| Exact Test \| 2026-09`, ID `200547384672`, ENABLED |
| New RSA | `823633352778`, ENABLED, REVIEW_IN_PROGRESS; approval not yet established |
| Destination | `https://www.lichtsaum.com/` |
| Display paths | `leuchtvolant/gewerbe` |
| Existing keywords | All prior 28 non-removed keyword statuses unchanged; 22 enabled, 6 paused |
| New total | 25 enabled keywords, 6 paused; four non-removed ad groups |

The ceiling is the configured maximum bid limit under this strategy, not a profitability estimate.
[Google TargetSpend reference](https://developers.google.com/google-ads/api/reference/rpc/v22/AccessibleBiddingStrategy.TargetSpend)
(checked 2026-09-06).

| New keyword | Match | First post-change diagnostic |
| --- | --- | --- |
| `markisen werbung` | Exact | PENDING / UNDER_REVIEW |
| `markisenbeschriftung` | Exact | NOT_ELIGIBLE / RARELY_SERVED and UNDER_REVIEW |
| `markise beschriften` | Exact | NOT_ELIGIBLE / RARELY_SERVED and UNDER_REVIEW |

The Planner's small historical estimates did not guarantee current eligibility. Two candidates
initially showed low-demand restrictions. A subsequent same-day API check found **all three
keywords ELIGIBLE**, with no primary-status reasons returned; RSA remained REVIEW_IN_PROGRESS.
Today's group totals at that follow-up were 0 impressions, 0 clicks, €0 spend and 0 conversions.
The initial diagnostic table above is historical and does not describe current keyword eligibility.

## RSA copy and product clarity

Headlines:

1. **Beleuchteter Markisen-Volant** — pinned to headline 1.
2. Leuchtvolant fürs Gewerbe
3. Markise wird Markenlicht
4. Projekt prüfen lassen
5. Bestehende Markise prüfen
6. Gestaltung im Konfigurator
7. Lichtsaum

Descriptions:

1. **Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen. Projekt prüfen lassen.** — pinned to description 1.
2. Markise wird Markenlicht. Prüfen Sie Ihr Projekt direkt bei LICHTSAUM.
3. Gestaltung im Konfigurator ansehen und eine Projektanfrage an LICHTSAUM senden.

The pinned product category qualifies adjacent searches which may otherwise imply ordinary
printed awning fabric. Core category and positioning use approved CLM-013 and CLM-019 from
the [claims register](../content/claims-and-evidence-register.md); configurator and inquiry wording
describes the existing live functions. No price, territory, performance or universal-fit claim added.
Pinning intentionally prioritizes product clarity over unrestricted asset combinations.
[Google RSA creation reference](https://developers.google.com/google-ads/api/docs/responsive-search-ads/create-responsive-search-ads)
(checked 2026-09-06).

## Verification and next decision

- [Pre-change state](evidence/google-ads-2026-09-06/search-test-before.json).
- [Exact mutation plan](evidence/google-ads-2026-09-06/search-test-plan.json).
- [Successful validate-only](evidence/google-ads-2026-09-06/search-test-validation.json).
- [Atomic mutation result](evidence/google-ads-2026-09-06/search-test-mutation.json).
- [Independent post-change API read](evidence/google-ads-2026-09-06/search-test-verified.json).

The read asserted the €5 cap, unchanged €20 budget and Maximize Clicks, group/ad enabled state,
exactly three Exact keywords, pinned product copy and unchanged pre-existing keyword statuses.

After moderation and sufficient traffic, assess disclosed search terms, spend/CPC, keyword
eligibility and qualified customer leads. The proposed first review is September 13, with a
decision September 20 if useful data exist; these are review dates, not a created automation or
an automatic promise to run/spend until those dates. Do not increase budget or expand match
types solely because traffic remains small.

## Conversion diagnostic follow-up

Verified in the Google Ads UI later on September 6: the goal now shows **Active**; the primary
action `Projektanfrage – serverbestätigt` shows **No recent conversions**, replacing **Tag inactive**.
Its last activity is **September 6 (today)**; the last recorded conversion remains **August 22**.
The earlier inactivity warning has cleared. This confirms fresh tag activity received by Google,
not a new attributed customer conversion or independently inspected transaction-ID deduplication.
No further form submission, simulated Ads click, conversion upload or GTM change was performed.
