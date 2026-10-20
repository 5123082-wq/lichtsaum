# Configurator Calculation Contract

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: размерные ограничения, закупочные inputs, серверный pricing version и состав предварительной цены.
- Current: `2026-10-20.v6`: три панели 600/1000/1200 мм по EUR 450/600/750; волан по EUR 45/50/55 за метр; один электрокомплект EUR 150 включён. Автоподбор одинаковых панелей на каждый участок сохранён.
- Current: высота волана 200/250/300 мм; буквы максимум 70/120/170 мм соответственно. Выбор высоты автоматически подставляет максимум, который можно уменьшить.
- Open: полезная высота/ширина панелей, стыки, комплектность электрики и техническая совместимость требуют проверки поставщика. Публикация v6 разрешена владельцем 2026-10-20; проверка выпуска выполняется.
- Read full when: меняются inputs, формула, версия цены, границы результата или persistence contract.
<!-- AGENT_BRIEF:END -->

Status: `Decision`; owner-approved v6 implementation under restricted public claim CLM-029. Owner authorised v6 publication on 2026-10-20.
Last reviewed: 2026-10-20.

Publication choices follow [`publication-governance.md`](publication-governance.md).
This document owns the current calculation contract. Earlier v4 inputs and the flat 180 mm
letter cap are superseded by the owner's 2026-10-20 instructions.

## Implemented constraints

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

## Approved tariff and source reconciliation

`Decision` — 2026-10-20: the owner corrected the original Excel-based price assumptions
using supplier screenshots and a later message, then approved these explicit selling prices
for publication after local review. The original workbook's panel EK values are superseded for v6.
Valance purchase rates remain the owner's selected EUR 25/30/35 per metre, including EUR 35
for 300 mm rather than the EUR 40 in the video. Supplier evidence is held outside the repository.

| Component | Net purchase input | Owner adjustment | Net selling price |
| --- | ---: | --- | ---: |
| Volant height 200 mm, per running metre | EUR 25 | + EUR 20 per metre | EUR 45 |
| Volant height 250 mm, per running metre | EUR 30 | + EUR 20 per metre | EUR 50 |
| Volant height 300 mm, per running metre | EUR 35 | + EUR 20 per metre | EUR 55 |
| Panel width 600 mm, each | EUR 150 | × 3 | EUR 450 |
| Panel width 1000 mm, each | EUR 200 | × 3 | EUR 600 |
| Panel width 1200 mm, each | EUR 250 | × 3 | EUR 750 |
| One electrical set per configuration | EUR 100 | × 1.5 | EUR 150 |

The electrical set includes power supply, dimmer, remote and cable per the owner's supplier
message. The later EUR 100 input supersedes the video's EUR 80 transformer/dimmer subtotal.
Installation, connection work and other requested services are not included.
No purchase price is confirmed for 1600/2000 mm panels; they are excluded from v6 allocation.
Panel height, useful illuminated area, manufacturing margins and the electrical set's capacity
for a particular multi-panel assembly remain subject to project review.

## Implemented pricing version

- `pricingVersion`: `2026-10-20.v6` (owner-approved production release).
- Valance selling cents: round(full width in mm × selected selling cents per metre / 1000).
- Panel selling cents: sum(count × matching panel selling cents).
- Displayed net cents: valance selling cents + panel selling cents + 15000.
- One electrical set is added once to the entire configuration, regardless of segment/panel count.
- No additional percentage is applied to these already marked-up selling prices.
- Tariffs and returned totals use integer cents; fractional metres are billed proportionally.
- Design, delivery, measurement, removal, installation and electrical connection remain manual.

Tariff calculation stays server-only. The browser receives the authoritative total and
geometry/allocation. Subsequent tariff changes must update the pricing version.
The result, inquiry summary and v6 manager notification identify the included electrical set
and excluded connection/installation/services. Historical v5 notifications retain their
exclusion of electrical equipment; earlier snapshots retain their original scope.

Verification example: 6000 × 300 mm, CÄCILIE / Montserrat at 170 mm, 773.8 mm measured light
length → 1 × 1000 mm. Purchase EUR 210 + EUR 200 + EUR 100 = EUR 510;
selling total EUR 330 + EUR 600 + EUR 150 = EUR 1080 net.

## Panel allocation

The owner explicitly retained the existing automatic geometry and equal-panel rule.
Each logo and the inscription have separate illuminated segments; empty gaps are not priced.
For each segment, first find the minimum panel count, then the smallest equal panel width
from 600/1000/1200 mm that covers that segment.
Examples: 1500 mm → 2 × 1000; 2001 mm → 2 × 1200; 4001 mm → 4 × 1200.
This is deterministic coverage, not a claim of globally lowest cost across mixed sizes.

Maximum panel count, physical joints, cable routing, mounting gaps and actual useful panel
dimensions remain `TBD`. Current validation checks lettering/composition fit, not physical
panel placement. Project review remains necessary. The mini-configurator does not price panels.
Historical v5 snapshots may contain 1600/2000 count keys, which remain readable in notifications.
New calculations never select those sizes. Older snapshots may omit those optional keys.

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

If the submitted confirmation version differs from `2026-10-20.v6`, the server returns the current
authoritative calculation before any lead insert. The UI replaces the displayed result and requires
an explicit new confirmation.

## Public presentation evidence

Every total on `/konfigurator` is labelled `Vorläufiger Nettopreis` and is adjacent to all three
limitations: `zzgl. gesetzlicher Umsatzsteuer`, electrical connection and selected services are excluded (one electrical set is included), and the result is
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
