# Configurator Calculation Contract

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: размерные ограничения, закупочные inputs, серверный pricing version и состав предварительной цены.
- Current: `2026-10-20.v5`: закупка волана и пяти размеров панелей из Excel поставщика +50%; электрика и услуги исключены. Автоподбор одинаковых панелей на каждый участок сохранён.
- Current: высота волана 200/250/300 мм; буквы максимум 70/120/170 мм соответственно. Выбор высоты автоматически подставляет максимум, который можно уменьшить.
- Open: полезная высота/ширина панелей, стыки, комплектность электрики и техническая совместимость требуют проверки поставщика. Публикация только калькулятора разрешена владельцем 2026-10-20; проверка выпуска выполняется.
- Read full when: меняются inputs, формула, версия цены, границы результата или persistence contract.
<!-- AGENT_BRIEF:END -->

Status: `Decision`; local implementation under restricted public claim CLM-029.
Last reviewed: 2026-10-20.

Publication choices follow [`publication-governance.md`](publication-governance.md).
This document owns the current calculation contract. Earlier v4 inputs and the flat 180 mm
letter cap are superseded by the owner's 2026-10-20 instructions.

## Implemented local constraints

| Input | Allowed value | Runtime behavior |
| --- | --- | --- |
| Volantbreite (ширина волана) | Positive integer millimetres | Existing horizontal text/composition fit remains authoritative |
| Volanthöhe (высота волана) | 200, 250 or 300 mm | One popup listbox with 200, 250 and 300 mm, matching the existing font picker |
| Buchstabenhöhe (высота букв) | Integer 1 through valance height minus 130 mm | Default/reset to 70, 120 or 170 mm when the selected height changes; smaller values allowed |

`Decision`: the owner relayed the supplier's 300 → 170 mm limit and explicitly requested the
same 130 mm difference for all three heights. The reason for the difference is `TBD`; do not
describe it as a verified cutting allowance or assume 65 mm physical margins on each edge.

Invalid typed letter sizes remain visible with an error and block price continuation.
Server validation enforces the same dependent limit. Existing storage keys remain
`lichtsaum:mini-configurator:v2` and `lichtsaum:configurator:v1`; valid saved smaller lettering
is retained, unsupported heights/oversized lettering are rejected rather than silently resized.
PLZ, contacts and files are not stored in browser drafts.

## Internal component cost inputs

`Verified`: read from owner-supplied `Volant_LED_Kalkulation.xlsx`, `Preisdaten!A1:G6`,
on 2026-10-20. The source workbook is held by the owner outside the repository.
The owner identified its final EK/net totals as purchase prices. Panel EK is the supplier VK
less a 45% dealer discount, applied once. No extra discount applies to the listed valance rates.

| Component | Internal net purchase input |
| --- | ---: |
| Volant height 200 mm | EUR 25 / running metre |
| Volant height 250 mm | EUR 30 / running metre |
| Volant height 300 mm | EUR 35 / running metre |
| Panel width 600 mm | EUR 535.15 |
| Panel width 1000 mm | EUR 633.05 |
| Panel width 1200 mm | EUR 694.10 |
| Panel width 1600 mm | EUR 790.90 |
| Panel width 2000 mm | EUR 855.25 |

The workbook does not specify panel height, useful illuminated area, manufacturing margins,
lettering-production scope or electrical package contents. No panel height is asserted here.

## Implemented pricing version

- `pricingVersion`: `2026-10-20.v5`.
- Valance purchase cents: round(full width in mm × selected rate in cents per metre / 1000).
- Panel purchase cents: sum(count × the matching panel purchase cents).
- Displayed net cents: round((valance purchase cents + panel purchase cents) × 1.50).
- Round the combined marked-up amount once; purchase inputs and returned totals use integer cents.
- `Decision`: no fixed EUR 100 electrical set. Electrical equipment and connection require
  project review and separate calculation; the automatic total does not promise a complete
  electrically operational system.
- Design, delivery, measurement, removal and installation remain recorded for manual pricing.

Purchase costs and markup remain server-only. The browser receives only the authoritative
total and geometry/allocation. Subsequent tariff changes must update the pricing version.
The result, inquiry summary and new-version manager notification explicitly identify the
included valance/LED panels and excluded electrics/services. Historical notification snapshots
retain the scope appropriate to their saved pricing version.

Verification example: 6000 × 300 mm, CÄCILIE / Montserrat at 170 mm, 773.8 mm measured light
length → 1 × 1000 mm. Purchase EUR 210 + EUR 633.05 = EUR 843.05;
displayed preliminary net price EUR 1264.58.

## Panel allocation

The owner explicitly retained the existing automatic geometry and equal-panel rule.
Each logo and the inscription have separate illuminated segments; empty gaps are not priced.
For each segment, first find the minimum panel count, then the smallest equal panel width
from 600/1000/1200/1600/2000 mm that covers that segment.
Examples: 1500 mm → 1 × 1600; 2001 mm → 2 × 1200; 4001 mm → 3 × 1600.
This is deterministic coverage, not a claim of globally lowest cost across mixed sizes.

Maximum panel count, physical joints, cable routing, mounting gaps and actual useful panel
dimensions remain `TBD`. Current validation checks lettering/composition fit, not physical
panel placement. Project review remains necessary. The mini-configurator does not price panels.
Old persisted allocations may omit the new 1600/2000 count keys; readers treat those as zero.

## Authoritative font and geometry boundary

The full configurator opens the same local WOFF2 asset selected for the SVG through `fontkit`
2.0.4, applies the configured variable-font weight where available and uses shaped glyph layout,
kerning and visible bounds. The returned width, SVG font size and baseline offset drive the preview
geometry; the measured inscription width and logo sizes drive the separate panel segments.

Unsupported glyphs, missing/unreadable fonts, non-finite metrics, invalid dimensions and a
composition crossing the existing safe area fail closed: no price and no configurator submit are
available. Client-calculated hidden totals are never accepted.

## Version and persistence boundary

Live calculation is a stateless server request. It does not create a lead, notification or
conversion and the application does not log its body. On explicit shared-form submit the server
validates the raw configuration again, repeats measurement/geometry/pricing and persists only its
own result in the optional versioned `leads.request_context` snapshot.

If the submitted confirmation version differs from `2026-10-20.v5`, the server returns the current
authoritative calculation before any lead insert. The UI replaces the displayed result and requires
an explicit new confirmation.

## Public presentation evidence

Every total on `/konfigurator` is labelled `Vorläufiger Nettopreis` and is adjacent to all three
limitations: `zzgl. gesetzlicher Umsatzsteuer`, electrical equipment, connection and selected services are excluded, and the result is
not a `verbindliches Angebot` (обязательное предложение). The page explicitly addresses
`gewerbliche Projekte`.

CLM-029 records approval for this exact surface. A general price, `Ab` claim, B2C presentation,
`Product`/`Offer` Schema, Ads price promise or use on another route has no recorded approval.
Present the PAngV/B2C, compatibility and claim context and use `Спросить у пользователя` for the
concrete production/Ads publication decision.

The attached preliminary calculation uses the shared intake, server-reproduced calculation version
and single Google Ads conversion defined in
[`unified-lead-form-contract.md`](unified-lead-form-contract.md). A calculator result does not
create a lead or conversion before the visitor explicitly submits the shared contact form.
