# Third-Party Notices

## Karpathy-inspired execution principles

This repository contains adapted and paraphrased behavioral guidance inspired by Andrej
Karpathy's observations on common LLM coding pitfalls.

Adaptation source:

- Repository: `multica-ai/andrej-karpathy-skills`
- Maintainer attribution shown by the source: forrestchang (Jiayuan Zhang) and contributors
- Reviewed revision: `2c606141936f1eeef17fa3043a72095b4765b9c2`
- Source files:
  - `README.md`
  - `CLAUDE.md`
  - `skills/karpathy-guidelines/SKILL.md`
  - `EXAMPLES.md`

The source README and skill frontmatter declare MIT licensing. At the reviewed revision, the
repository did not expose a standalone `LICENSE` file and GitHub did not detect a repository
license. For that reason, this project uses short principle names and its own paraphrased,
project-specific implementation instead of copying the source text wholesale.

This attribution does not imply endorsement of CHISEL Architectural by Andrej Karpathy, the
source repository, its maintainers, or contributors.

## Caveat slogan lettering

The semantic HTML slogan uses self-hosted Caveat Variable files distributed through
`@fontsource-variable/caveat` 5.3.0. The legacy outlined asset
`public/images/lichtsaum-slogan-handwritten.svg` was also generated from Caveat Regular but is not
used by the rendered page.

- Source: `https://github.com/googlefonts/caveat`
- Copyright: Copyright 2014 The Caveat Project Authors
- License: SIL Open Font License 1.1

The font is bundled locally with the website; no runtime request to Google Fonts is made. This
attribution does not imply endorsement of LICHTSAUM by the font authors or contributors.

## Mini-configurator typeface library

The homepage mini-configurator bundles WOFF2 web assets for Montserrat, Open Sans, Oswald,
PT Sans, Playfair Display, Rubik, Fira Sans and Source Sans 3. Each font is distributed under the
SIL Open Font License 1.1 and loaded locally; the browser makes no runtime request to Google Fonts
or another font CDN.

The source files were taken from the official `google/fonts` repository at reviewed revision
`389b770410cc0b7c21c85673bfa2077420fe7f65`. Copyright notices, conversion details and complete
license copies are stored in `public/fonts/lichtsaum-configurator/`.

This attribution does not imply endorsement of LICHTSAUM by the font authors or contributors.

## Europe contact-map geometry

The local map asset in `public/maps/lichtsaum-europe-countries-10m.svg` is derived from Natural
Earth's current `Admin 0 – Countries` dataset at 1:10m scale. Country geometries were projected,
clipped to the Western and Central Europe scene, scaled and styled specifically for LICHTSAUM.
Germany is rendered as one uniform country fill without internal administrative boundaries. The
Berlin label, marker and visual treatment are project-authored.

- Dataset: Natural Earth, `Admin 0 – Countries`
- Source page: `https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/`
- Geometry source: `https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson`
- Retrieved: 2026-08-04
- Natural Earth data status: public domain

This attribution does not imply endorsement of LICHTSAUM by Natural Earth or its contributors.
