# LICHTSAUM configurator fonts

The mini-configurator bundles the following fonts locally. No runtime request is made to Google
Fonts or another font CDN.

| Font | Copyright notice | License copy |
| --- | --- | --- |
| Montserrat | Copyright 2024 The Montserrat.Git Project Authors | `licenses/montserrat-OFL.txt` |
| Open Sans | Copyright 2020 The Open Sans Project Authors | `licenses/opensans-OFL.txt` |
| Oswald | Copyright 2016 The Oswald Project Authors | `licenses/oswald-OFL.txt` |
| PT Sans | Copyright 2010 ParaType Ltd. | `licenses/ptsans-OFL.txt` |
| Playfair Display | Copyright 2017 The Playfair Display Project Authors | `licenses/playfairdisplay-OFL.txt` |
| Rubik | Copyright 2015 The Rubik Project Authors | `licenses/rubik-OFL.txt` |
| Fira Sans | Copyright 2012–2015 The Mozilla Foundation and Telefónica S.A. | `licenses/firasans-OFL.txt` |
| Source Sans 3 | Copyright 2010–2020 Adobe | `licenses/sourcesans3-OFL.txt` |

All eight fonts are licensed under the SIL Open Font License 1.1. The source TTF files were taken
from the official `google/fonts` repository at revision
`389b770410cc0b7c21c85673bfa2077420fe7f65`, reviewed on 2026-07-17. The locally served WOFF2
files were generated from those sources for web delivery and subset to the character ranges used
by the configurator (Latin, Cyrillic, common punctuation, currency symbols and selected marks).

The CSS/runtime family names are scoped with a `LICHTSAUM` prefix to avoid collisions with other
font installations. This attribution does not imply endorsement of LICHTSAUM by the font authors
or contributors.
