# 002 — Soften the mobile menu drawer

- **Status**: DONE
- **Commit**: ef02838
- **Severity**: HIGH
- **Category**: Interruptibility, easing & duration, performance
- **Estimated scope**: 3 files, roughly 80 lines

## Execution result

Implemented and reviewed on 2026-08-12. Typecheck, lint and `git diff --check`
passed. Live in-app verification at 393×852 confirmed stable logo and content
bounds, one brand instance, two-way drawer state, animated exit and focus
return. The targeted Playwright process did not obtain a valid hydration run
because the shared development server's HMR connection returned
`ERR_INVALID_HTTP_RESPONSE`; the server was deliberately not restarted.

## Problem

The mobile drawer replays an entry-only keyframe every time it opens and the
native dialog closes immediately. The motion therefore cannot reverse or
animate out, which makes the panel feel as if it suddenly jumps onto and off
the page.

```css
/* src/app/globals.css:589 — current */
.mobile-menu__panel {
  display: grid;
  grid-template-rows: var(--header-height) minmax(0, 1fr) auto;
  width: 77%;
  min-height: 100dvh;
  margin-left: auto;
  border-left: 1px solid var(--border);
  background: var(--charcoal-deep);
  animation: mobile-menu-enter 240ms var(--ease-out) both;
}
```

```tsx
/* src/components/layout/site-header.tsx:33 — current */
if (isMenuOpen && !dialog.open) {
  dialog.showModal();
  document.documentElement.classList.add("mobile-menu-open");
} else if (!isMenuOpen && dialog.open) {
  dialog.close();
  document.documentElement.classList.remove("mobile-menu-open");
}
```

Opening the menu also changes the real header wordmark size and renders a
second, smaller copy of the brand above the backdrop. That visible substitution
looks like a logo jump rather than part of the drawer transition.

```css
/* src/app/globals.css:74 — current */
html.mobile-menu-open .brand-link {
  font-size: 0.85rem;
}
```

```tsx
/* src/components/layout/site-header.tsx:123 — current */
<span aria-hidden="true" className="mobile-menu__brand">
  <Image ... />
  <span>LICHTSAUM</span>
</span>
```

## Target

Keep one unchanged header wordmark. Let the drawer and backdrop cover or dim
that existing wordmark naturally; do not render a duplicate inside the dialog
and do not change `.brand-link` typography while open.

Use an interruptible transform transition for both entry and exit:

```css
/* target shared token */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

/* target panel states */
.mobile-menu__panel {
  transform: translate3d(100%, 0, 0);
  transition: transform 260ms var(--ease-drawer);
}

.mobile-menu[data-state="open"] .mobile-menu__panel {
  transform: translate3d(0, 0, 0);
}
```

Transition the backdrop from transparent to `rgb(0 0 0 / 66%)` in 220ms with
`var(--ease-out)`. Keep the dialog in the top layer until the panel's closing
`transform` transition ends, with a short fallback timeout for browsers that
do not emit `transitionend`. Escape must call `preventDefault()` on the native
`cancel` event so the browser does not bypass the exit transition.

When `prefers-reduced-motion: reduce` is active, keep a 160ms opacity/backdrop
transition but remove panel translation. Closing must not wait for a visible
movement that no longer occurs.

Preserve the underlying document's inline geometry while scroll is locked by
adding `scrollbar-gutter: stable` to `html.mobile-menu-open`. Do not introduce
body positioning or scroll restoration logic.

## Repo conventions to follow

- Shared motion curves already live in the `:root` token block at
  `src/app/globals.css:22`; add `--ease-drawer` beside `--ease-out` and
  `--ease-in-out`.
- `src/components/layout/site-header.tsx` already owns the dialog state, focus
  return, Escape handling and desktop-breakpoint cleanup. Extend that component
  without adding a dependency.
- `tests/e2e/landing.spec.ts:1070` already verifies the mobile dialog,
  navigation links, backdrop click, Escape close and focus return.

## Steps

1. In `src/app/globals.css`, add `--ease-drawer`, preserve the scrollbar gutter
   while `.mobile-menu-open` is present, and delete the rule that changes
   `.brand-link` font size.
2. Remove `.mobile-menu__brand` from the component and delete its unused CSS.
   Keep the original `.brand-link` markup and dimensions unchanged.
3. Replace `mobile-menu-enter` and its `@keyframes` with a transform transition
   driven by `data-state="open"` / `data-state="closed"` on the dialog. Animate
   only `transform` on the panel and background color/opacity on the backdrop.
4. In `site-header.tsx`, open the native dialog in the closed visual state,
   then change to the open state on the next animation frame. Store and cancel
   the pending frame if necessary.
5. On close intent, set the closed visual state first. Call `dialog.close()`
   after the panel's transform transition ends; include a fallback timeout and
   clear it on completion/unmount. For reduced motion, allow the effectively
   immediate transition end or close without a movement delay.
6. Prevent the native `cancel` default before initiating the animated close.
   Preserve backdrop-click close, close-button behavior, link behavior, focus
   containment, focus return and the desktop breakpoint cleanup.
7. Extend the existing mobile-menu e2e test to assert the wordmark has the same
   bounding box before and during the open state, only one `LICHTSAUM` brand
   link/copy exists, the panel uses the open data state, and closing reaches the
   hidden state after the exit transition.

## Boundaries

- Do not change drawer width, navigation copy, item spacing, CTA styling,
  routes, header height or desktop navigation.
- Do not add a motion library, keyframes, animated layout properties or
  `transition: all`.
- Do not stop or restart the shared development server.
- Do not touch hero, configurator, consent-dialog or gallery motion.
- If the cited code has drifted since commit `ef02838`, stop and report rather
  than broadening the change.

## Verification

- **Mechanical**: `pnpm typecheck`, `pnpm lint`, `git diff --check`, and
  `pnpm exec playwright test tests/e2e/landing.spec.ts --grep "mobile navigation drawer"`
  pass.
- **Feel check**: at 390×844, open and close the menu with the trigger, close
  button, backdrop and Escape. The panel must travel smoothly from the right,
  reverse without a hard disappearance, and never resize or replace the
  header wordmark. The underlying content must retain its horizontal position.
- **Slow-motion check**: at 10% playback, the panel starts fully outside its own
  right edge, uses one uninterrupted transform transition, and the backdrop
  darkens separately without double-exposed logo copies.
- **Reduced-motion check**: emulate `prefers-reduced-motion: reduce`; the menu
  becomes available without lateral travel, retains a brief backdrop fade and
  closes without a perceptible delay.
- **Done when**: there is one stable brand rendering, no underlying layout
  shift, both entry and exit are visually continuous, and all existing mobile
  menu accessibility behavior still passes.
