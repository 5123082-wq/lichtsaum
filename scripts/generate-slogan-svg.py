#!/usr/bin/env python3

from __future__ import annotations

import argparse
import math
from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


LINES = (
    ("Tagsüber Marke.", "#E5E2E1"),
    ("Nachts Markenlicht.", "#FF5C00"),
)
SCALE = 0.2
TRACKING = -12
BASELINES = (245, 430)
PADDING_X = 8
PADDING_Y = 4


def format_number(value: float) -> str:
    return str(round(value))


def line_paths(
    font: TTFont,
    text: str,
    baseline: float,
) -> tuple[list[str], float, tuple[float, float, float, float]]:
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    metrics = font["hmtx"].metrics
    cursor = 0.0
    paths: list[str] = []
    bounds: list[tuple[float, float, float, float]] = []

    for character in text:
        glyph_name = cmap[ord(character)]
        pen = SVGPathPen(glyph_set, ntos=format_number)
        bounds_pen = BoundsPen(glyph_set)
        transform = Transform(
            SCALE,
            0,
            0,
            -SCALE,
            PADDING_X + cursor,
            baseline,
        )
        glyph_set[glyph_name].draw(TransformPen(pen, transform))
        glyph_set[glyph_name].draw(TransformPen(bounds_pen, transform))
        commands = pen.getCommands()

        if commands:
            paths.append(commands)
            if bounds_pen.bounds is not None:
                bounds.append(bounds_pen.bounds)

        advance_width, _ = metrics[glyph_name]
        cursor += (advance_width + TRACKING) * SCALE

    min_x = min(bound[0] for bound in bounds)
    min_y = min(bound[1] for bound in bounds)
    max_x = max(bound[2] for bound in bounds)
    max_y = max(bound[3] for bound in bounds)

    return paths, cursor, (min_x, min_y, max_x, max_y)


def generate_svg(font_path: Path, output_path: Path) -> None:
    font = TTFont(font_path)
    rendered_lines: list[tuple[list[str], str]] = []
    widths: list[float] = []
    bounds: list[tuple[float, float, float, float]] = []

    for (text, color), baseline in zip(LINES, BASELINES):
        paths, width, line_bounds = line_paths(font, text, baseline)
        rendered_lines.append((paths, color))
        widths.append(width)
        bounds.append(line_bounds)

    canvas_width = math.ceil(max(widths) + PADDING_X * 2)
    viewbox_min_y = math.floor(min(bound[1] for bound in bounds) - PADDING_Y)
    viewbox_max_y = math.ceil(max(bound[3] for bound in bounds) + PADDING_Y)
    canvas_height = viewbox_max_y - viewbox_min_y
    groups = []

    for paths, color in rendered_lines:
        groups.append(f'  <path fill="{color}" d="{" ".join(paths)}" />')

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {viewbox_min_y} {canvas_width} {canvas_height}">
  <!--
    Lettering generated from Caveat Regular by Pablo Impallari.
    Source: https://github.com/googlefonts/caveat
    License: SIL Open Font License 1.1.
  -->
{chr(10).join(groups)}
</svg>
"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(svg, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("font", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    generate_svg(arguments.font, arguments.output)


if __name__ == "__main__":
    main()
