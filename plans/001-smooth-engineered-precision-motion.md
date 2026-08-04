# 001 — Smooth the Engineered Precision transitions

- **Status**: DONE
- **Commit**: N/A — this workspace has no Git worktree
- **Severity**: HIGH
- **Category**: Interruptibility, easing & duration, accessibility
- **Estimated scope**: 3 files, roughly 90 lines

## Problem

The `#praezision` interaction changes its active accordion item and image
instantly. The description is removed from layout with `hidden`, so the left
column changes height with no spatial explanation. The image uses a keyframe on
an element that is remounted on every selection; a rapid change restarts that
keyframe from zero rather than retargeting from its current visual state.

```css
/* src/app/globals.css:718 — current */
.engineered-precision__image {
  object-fit: cover;
  animation: engineered-precision-image-in 280ms ease-out both;
}
```

```tsx
/* src/components/sections/engineered-precision-section.tsx:84 — current */
<Image
  key={activeView.id}
  className="engineered-precision__image"
  src={activeView.image}
  alt={activeView.alt}
  fill
  sizes="(min-width: 64rem) 58vw, 100vw"
/>
```

```tsx
/* src/components/sections/engineered-precision-section.tsx:68 — current */
<div
  className="engineered-precision__control-description"
  id={`precision-description-${view.id}`}
  hidden={!isActive}
>
  <p>{view.text}</p>
</div>
```

The global reduced-motion rule also sets every transition and animation to
`0.01ms`, which removes useful opacity feedback rather than removing only
movement.

```css
/* src/app/globals.css:1900 — current */
*,
*::before,
*::after {
  scroll-behavior: auto !important;
  transition-duration: 0.01ms !important;
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
}
```

## Target

Use interruptible CSS transitions, not restartable keyframes, for the
high-frequency view selection:

```css
/* target shared tokens in src/app/globals.css */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--duration-accordion: 220ms;
--duration-image-swap: 240ms;
```

```css
/* target accordion behavior */
.engineered-precision__control-description {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(-0.35rem);
  transition:
    grid-template-rows var(--duration-accordion) var(--ease-out),
    opacity 160ms ease,
    transform var(--duration-accordion) var(--ease-out);
}

.engineered-precision__control-item[data-active]
  .engineered-precision__control-description {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}
```

Use two absolutely positioned images in a fixed-aspect media frame during a
selection. The outgoing image transitions from `opacity: 1` to `opacity: 0`;
the incoming image from `opacity: 0; transform: scale(0.995)` to
`opacity: 1; transform: scale(1)`. Both transitions use
`var(--duration-image-swap) var(--ease-out)`. Keep the outgoing image until
the transition completes. A further click must replace the incoming state and
retarget the same opacity/transform transitions rather than replay a keyframe.

Under `prefers-reduced-motion: reduce`, keep the opacity transition at 160ms
with `ease`, but set all image and description transforms to `none` and avoid
the accordion's spatial translation.

## Repo conventions to follow

- Motion lives in `src/app/globals.css`; the current precision rules begin at
  `src/app/globals.css:599`.
- The app uses client state in
  `src/components/sections/engineered-precision-section.tsx`; retain the
  existing keyboard-operable buttons, `aria-expanded` and `aria-controls`.
- Existing image rendering uses Next `Image` with `fill` and a fixed
  `aspect-ratio`; retain this to prevent layout shift.

## Steps

1. In `src/app/globals.css`, add the four motion tokens to the existing root
   token block. Do not create a second motion-token location.
2. In `src/components/sections/engineered-precision-section.tsx`, preserve the
   selected `activeViewId` for the accordion. Add a separate displayed/incoming
   image state so an outgoing image remains mounted until a 240ms CSS opacity
   transition completes. Cancel and retarget a pending cleanup if the user
   selects another view before completion.
3. Replace the single keyed image with a media stack containing at most two
   absolutely positioned Next `Image` elements. Add explicit data attributes
   for `incoming` and `outgoing`; never use the
   `engineered-precision-image-in` keyframe for this interaction.
4. Replace `hidden={!isActive}` on the description with a persistent,
   labelled region that uses `aria-hidden={!isActive}` and a CSS
   `data-active` parent selector. Its inner wrapper must use `overflow: hidden`
   so the collapsed description neither paints nor remains focusable. Retain
   `aria-expanded` on the matching button.
5. In `src/app/globals.css`, animate only the small description's opacity and
   transform plus the bounded accordion grid track. Do not animate
   `width`, `margin`, `padding`, `top`, `left`, or `transition: all`.
6. Replace the image keyframe rule with opacity/transform transitions on the
   media-stack layers, using the target values above. Keep image scaling subtle
   (`0.995` to `1`), never `scale(0)`.
7. Scope the reduced-motion override to this component: retain a 160ms opacity
   transition but remove the vertical translation and scale. Do not change the
   existing hero's approved reduced-motion behavior.
8. Extend `tests/e2e/landing.spec.ts` to verify: the active description is
   exposed after selection; a previously active description is unavailable to
   the accessibility tree; two images are only simultaneously mounted during
   a swap; and reduced motion applies no transform to the precision media
   layers.

## Boundaries

- Do not change the three view images, their copy, claims, layout columns,
  header, marker loop, hero scene, or unrelated site animations.
- Do not add animation dependencies, requestAnimationFrame loops, or a motion
  library.
- Do not use keyframes for the rapidly reversible image selection.
- If the current component has drifted from the excerpts above, stop and
  reassess before editing.

## Verification

- **Mechanical**: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and
  `pnpm exec playwright test tests/e2e/landing.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts` all pass.
- **Feel check**: on `http://127.0.0.1:3000/#praezision`, rapidly select
  `01`, `02`, `03`, then reverse the order. The left description should open
  from its row without a hard height jump, and the photograph should crossfade
  without flashing, blanking, or a repeated full keyframe bounce.
- **Slow-motion check**: in the browser Animations panel at 10% playback, the
  incoming photograph begins from `scale(0.995)`, never from zero, and the
  outgoing photograph fades from its current state.
- **Reduced-motion check**: emulate `prefers-reduced-motion: reduce`; changing
  views has a brief opacity change only, no spatial shift or scale.
- **Done when**: repeated pointer and keyboard selection remains responsive,
  the layout never visibly jumps, and the seven responsive widths have no
  horizontal overflow.
