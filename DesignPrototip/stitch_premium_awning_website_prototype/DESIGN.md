---
name: Architectural Solstice
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab897d'
  outline-variant: '#5b4137'
  surface-tint: '#ffb59a'
  primary: '#ffb59a'
  on-primary: '#5a1b00'
  primary-container: '#ff5c00'
  on-primary-container: '#521800'
  inverse-primary: '#a73a00'
  secondary: '#c7c6c5'
  on-secondary: '#2f3130'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b7'
  tertiary: '#a0c9ff'
  on-tertiary: '#00325a'
  tertiary-container: '#0096fd'
  on-tertiary-container: '#002d51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb59a'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#802a00'
  secondary-fixed: '#e3e2e1'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#a0c9ff'
  on-tertiary-fixed: '#001c37'
  on-tertiary-fixed-variant: '#00497f'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 110px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-narrow:
    fontFamily: Archivo Narrow
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style

The design system is engineered to evoke a sense of architectural precision and high-end luxury. Targeting homeowners and architects who value structural elegance, the UI functions as a sophisticated gallery for premium awning solutions.

The design style is **High-Contrast / Minimalist**. It utilizes dramatic scale shifts in typography and expansive whitespace to mirror the openness of outdoor living spaces. Every element is intentional, avoiding unnecessary ornamentation to allow high-resolution architectural photography to serve as the primary visual driver. The interface should feel expensive, solid, and exceptionally curated.

## Colors

This design system utilizes a "Dark Mode by Default" philosophy to emphasize luxury and focus. 

- **Primary (Architectural Orange):** Used sparingly for call-to-actions, status indicators, and micro-interactions. It represents the warmth of the sun and technical precision.
- **Neutral (Deep Charcoal & Slate):** These form the structural layers of the interface. `#171717` is the base canvas, while `#2A2A2A` is used for subtle container differentiation.
- **Secondary (Off-White):** Reserved exclusively for high-contrast typography and critical iconography to ensure maximum legibility and a crisp, clean aesthetic.

## Typography

Typography is used as a structural element. **Hanken Grotesk** provides a modern, sharp sans-serif foundation that feels engineered yet approachable. Large display sizes should use tight kerning to create a "block-like" visual impact.

**Archivo Narrow** is introduced for technical data, dimensions, and labels. Its condensed proportions reinforce the "industrial design" and "custom-built" nature of the products while maintaining a sleek, modern profile. 

Use `display-xl` for hero sections and major transition points. Ensure high-contrast ratios between the off-white text and dark backgrounds.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns) and a fluid model on mobile. 

The "Architectural" feel is achieved through exaggerated vertical spacing (`section-gap`). Content should breathe; do not crowd imagery. Use asymmetric alignments where text might span 5 columns while leaving 7 columns of whitespace or a full-bleed image. 

- **Desktop:** 64px outer margins with 32px gutters.
- **Tablet:** 40px outer margins with 24px gutters.
- **Mobile:** 24px outer margins with 16px gutters.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Tonal Layers** and **Sharp Borders**. 

Depth is communicated through stacking shades of charcoal. The base background is the darkest tier, while interactive cards or modals use a slightly lighter slate gray. 

Use 1px solid borders in a low-opacity off-white (e.g., `rgba(253, 252, 251, 0.1)`) to define boundaries without adding visual weight. Transitions between states should be "surgical"—fast, linear, and precise (e.g., 200ms ease-out).

## Shapes

The shape language is strictly **Sharp (0px roundedness)**. This reinforces the architectural and structural theme, mimicking the clean lines of high-end metal awnings and modern construction. 

Avoid all rounded corners on buttons, cards, and input fields. Every element should feel like it was cut from stone or steel.

## Components

### Buttons
Primary buttons are solid Architectural Orange with black text (Archivo Narrow). Secondary buttons are transparent with a 1px off-white border. Hover states should involve a color invert or a slight shift in background tone—never a shadow.

### Input Fields
Inputs are bottom-border only, using `label-narrow` for placeholders. Upon focus, the bottom border changes to Architectural Orange.

### Cards
Cards are defined by their 1px low-contrast borders. There is no background color change unless the card is hovered. Imagery within cards must be high-aspect-ratio (e.g., 16:9 or 21:9) to emphasize horizontal spans.

### Lists & Technical Specs
Use `label-narrow` for all technical specifications. List items should be separated by thin, full-width horizontal rules to maintain the "blueprint" aesthetic.

### Navigation
The navigation should be minimal, utilizing a hidden "Menu" toggle on mobile and a spacious, top-aligned bar on desktop with `label-narrow` links. Use an Architectural Orange dot to indicate the active page.