# Header navigation audit — 2026-08-04

## Scope

Read-only review of how a visitor discovers the local `/referenzen` gallery from the homepage,
desktop header and mobile menu. No application code was changed.

## Flow evidence

1. **Homepage header — healthy, but no gallery entry.**
   `01-home-header.png` shows the fixed desktop header with `Produkt · Eignung · Konfigurator ·
   FAQ` and the separate `Projekt prüfen lassen` CTA.
2. **Homepage gallery section — functional but low discoverability.**
   `02-gallery-entry.png` shows the first explicit route link, `Galerie-Vorschau öffnen`, which is
   available only after the visitor reaches the gallery section.
3. **Gallery route — healthy page, incomplete global orientation.**
   `03-references-page.png` confirms `/referenzen` works in local review. Its header still omits the
   current gallery route because the registry is not published.
4. **Mobile drawer — healthy, same omission.**
   `04-mobile-menu.png` confirms the accessible drawer mirrors the same four links and keeps the CTA
   separate. A fifth row fits at the captured 390 × 844 px viewport.

## Recommendation

- Keep `Produkt`, `Eignung`, `Konfigurator` and `FAQ`; add the gallery between `Konfigurator` and
  `FAQ`. The current header is already pruned, and each item answers a different visitor question.
- In local/protected `review`, label the link `Galerie-Vorschau` and point it to `/referenzen`.
  Do not call concept visuals `Referenzen`.
- In valid `published`, change the same item to `Referenzen`; keep it as a direct link, not a
  dropdown item.
- Keep `Projekt prüfen lassen` as the visually separate primary CTA.
- Do not remove a useful destination just to solve a breakpoint. If four text links become a hard
  product constraint, `Produkt` is the first candidate because the brand link already returns to
  the homepage; retain the product content itself.
- Five items do not safely fit at the current 48 rem desktop transition: the estimated link row is
  about 46 px wider than its 768 px nav track. Keep the mobile drawer until a header-only breakpoint
  around 56 rem, then show the desktop navigation.
- Make the mobile navigation track vertically scrollable for short landscape viewports. Move
  initial dialog focus from the visually unmarked panel to the close button or first navigation
  link.
- Mirror the conditional gallery link in the footer and expose `aria-current="page"` plus a visible
  current-page treatment on `/referenzen`.
- Keep `Varianten`, `Kosten`, `Ablauf`, `Kontakt` and legal links out of the main navigation:
  configurator, CTA and footer already own those jobs.

## Evidence limits

This review covers captured desktop/mobile layouts, DOM semantics and current implementation code.
It does not claim a full assistive-technology audit. The final five-item layout still needs
implementation captures at the revised desktop transition and a short landscape viewport before
acceptance.
