"use client";

import { useId } from "react";

import {
  CONFIGURATOR_AWNING_COLORS,
  CONFIGURATOR_FONTS,
  CONFIGURATOR_LIGHT_COLORS
} from "@/features/configurator/options";
import type {
  ConfiguratorConfigurationV1,
  ConfiguratorGeometry,
  ConfiguratorTextMeasurement
} from "@/features/configurator/types";

type ConfiguratorPreviewProps = Readonly<{
  configuration: ConfiguratorConfigurationV1;
  geometry: ConfiguratorGeometry;
  measurement: ConfiguratorTextMeasurement;
  hasError?: boolean;
  statusText: string;
}>;

const SCENE_WIDTH = 1600;
const SCENE_HEIGHT = 357;
const MAX_VALANCE_WIDTH = 1320;
const MAX_VALANCE_HEIGHT = 190;
const DIMENSION_GAP = 46;
const DIMENSION_TICK_HALF = 9;

export function ConfiguratorPreview({
  configuration,
  geometry,
  measurement,
  hasError = false,
  statusText
}: ConfiguratorPreviewProps) {
  const uniqueId = useId().replaceAll(":", "");
  const awningColor =
    CONFIGURATOR_AWNING_COLORS.find(
      (option) => option.id === configuration.awningColorId
    ) ?? CONFIGURATOR_AWNING_COLORS[0];
  const lightColor =
    CONFIGURATOR_LIGHT_COLORS.find(
      (option) => option.id === configuration.lightColorId
    ) ?? CONFIGURATOR_LIGHT_COLORS[0];
  const selectedFont =
    CONFIGURATOR_FONTS.find(
      (option) => option.id === configuration.fontId
    ) ?? CONFIGURATOR_FONTS[0];
  const compositionDescription =
    configuration.compositionMode === "text-only"
      ? "mittig angeordnetem Leuchtschriftzug ohne Logo"
      : configuration.compositionMode === "logo-left"
        ? "mittig angeordnetem Leuchtschriftzug und einem schematischen Logo links"
        : "mittig angeordnetem Leuchtschriftzug und gleichen schematischen Logos links und rechts";
  const scale = Math.min(
    MAX_VALANCE_WIDTH / configuration.valanceWidthMm,
    MAX_VALANCE_HEIGHT / configuration.valanceHeightMm
  );
  const valanceWidth = configuration.valanceWidthMm * scale;
  const valanceHeight = configuration.valanceHeightMm * scale;
  const valanceX = (SCENE_WIDTH - valanceWidth) / 2;
  const valanceTop =
    (SCENE_HEIGHT - (valanceHeight + DIMENSION_GAP + DIMENSION_TICK_HALF)) / 2;
  const dimensionY = valanceTop + valanceHeight + DIMENSION_GAP;
  const dimensionEndX = Math.min(
    SCENE_WIDTH - 52,
    valanceX + valanceWidth + 34
  );
  const previewTitle = `${configuration.valanceWidthMm} × ${configuration.valanceHeightMm} Millimeter, ${configuration.text}`;
  const strokeWidthMm = Math.max(
    2,
    Math.min(configuration.valanceWidthMm, configuration.valanceHeightMm) /
      110
  );

  return (
    <div
      className="configurator-preview full-configurator-preview"
      data-error={hasError || undefined}
      data-mode="night"
    >
      <svg
        aria-label={`${previewTitle}. ${statusText}`}
        className="configurator-preview__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      >
        <title>{previewTitle}</title>
        <desc>
          Schematische Frontansicht eines anpassbaren Volants mit {compositionDescription}.
        </desc>
        <svg
          aria-hidden="true"
          className="configurator-preview__product"
          focusable="false"
          height={valanceHeight}
          overflow="visible"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${configuration.valanceWidthMm} ${configuration.valanceHeightMm}`}
          width={valanceWidth}
          x={valanceX}
          y={valanceTop}
        >
          <defs>
            <clipPath id={`${uniqueId}-valance-clip`}>
              <rect
                height={configuration.valanceHeightMm}
                width={configuration.valanceWidthMm}
              />
            </clipPath>
            <filter
              id={`${uniqueId}-light-glow`}
              colorInterpolationFilters="sRGB"
              height="240%"
              width="160%"
              x="-30%"
              y="-70%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                result="wide-blur"
                stdDeviation={Math.max(4, configuration.letterHeightMm * 0.12)}
              />
              <feComponentTransfer in="wide-blur" result="wide-glow">
                <feFuncA type="linear" slope="0.22" />
              </feComponentTransfer>
              <feGaussianBlur
                in="SourceGraphic"
                result="tight-glow"
                stdDeviation={Math.max(2, configuration.letterHeightMm * 0.04)}
              />
              <feMerge>
                <feMergeNode in="wide-glow" />
                <feMergeNode in="tight-glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`${uniqueId}-light-spill`}>
              <stop offset="0" stopColor={lightColor.value} stopOpacity="0.18" />
              <stop offset="0.52" stopColor={lightColor.value} stopOpacity="0.07" />
              <stop offset="1" stopColor={lightColor.value} stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect
            fill={awningColor.value}
            height={configuration.valanceHeightMm}
            stroke={hasError ? "#FFB4AB" : "#777675"}
            strokeWidth={strokeWidthMm}
            width={configuration.valanceWidthMm}
          />
          <rect
            fill="#000000"
            fillOpacity="0.08"
            height={configuration.valanceHeightMm}
            width={configuration.valanceWidthMm}
          />

          <rect
            className="configurator-preview__light-spill"
            fill={`url(#${uniqueId}-light-spill)`}
            height={Math.min(
              configuration.valanceHeightMm * 1.25,
              configuration.letterHeightMm * 2.5
            )}
            width={Math.min(
              configuration.valanceWidthMm,
              measurement.widthMm + configuration.letterHeightMm * 2.2
            )}
            x={Math.max(
              0,
              geometry.textStartMm - configuration.letterHeightMm * 1.1
            )}
            y={Math.max(
              -configuration.valanceHeightMm * 0.125,
              (configuration.valanceHeightMm -
                Math.min(
                  configuration.valanceHeightMm * 1.25,
                  configuration.letterHeightMm * 2.5
                )) /
                2
            )}
          />
          {geometry.logoCentersMm.map((logoCenterMm) => (
            <rect
              className="configurator-preview__light-spill"
              fill={`url(#${uniqueId}-light-spill)`}
              height={Math.min(
                configuration.valanceHeightMm * 1.25,
                configuration.letterHeightMm * 2.5
              )}
              key={`logo-spill-${logoCenterMm}`}
              width={Math.min(
                configuration.valanceWidthMm,
                geometry.logoSizeMm * 2.4
              )}
              x={Math.max(0, logoCenterMm - geometry.logoSizeMm * 1.2)}
              y={Math.max(
                -configuration.valanceHeightMm * 0.125,
                (configuration.valanceHeightMm -
                  Math.min(
                    configuration.valanceHeightMm * 1.25,
                    configuration.letterHeightMm * 2.5
                  )) /
                  2
              )}
            />
          ))}

          {geometry.logoCentersMm.map((logoCenterMm, logoIndex) => (
            <g
              className="configurator-preview__light"
              clipPath={`url(#${uniqueId}-valance-clip)`}
              data-configurator-logo=""
              data-position={logoIndex === 0 ? "left" : "right"}
              filter={`url(#${uniqueId}-light-glow)`}
              key={`logo-${configuration.lightColorId}-${logoCenterMm}`}
            >
              <rect
                fill="none"
                height={geometry.logoSizeMm * 0.72}
                stroke={lightColor.value}
                strokeWidth={Math.max(3, geometry.logoSizeMm * 0.055)}
                transform={`rotate(45 ${logoCenterMm} ${
                  configuration.valanceHeightMm / 2
                })`}
                width={geometry.logoSizeMm * 0.72}
                x={logoCenterMm - geometry.logoSizeMm * 0.36}
                y={configuration.valanceHeightMm / 2 - geometry.logoSizeMm * 0.36}
              />
              <circle
                cx={logoCenterMm}
                cy={configuration.valanceHeightMm / 2}
                fill={lightColor.value}
                r={geometry.logoSizeMm * 0.095}
              />
            </g>
          ))}

          <text
            className="configurator-preview__light"
            clipPath={`url(#${uniqueId}-valance-clip)`}
            data-configurator-text=""
            fill={lightColor.value}
            filter={`url(#${uniqueId}-light-glow)`}
            fontFamily={`"${selectedFont.family}"`}
            fontSize={measurement.svgFontSizeMm}
            fontWeight={selectedFont.weight}
            lengthAdjust="spacingAndGlyphs"
            style={{ whiteSpace: "pre" }}
            textLength={measurement.widthMm}
            xmlSpace="preserve"
            x={geometry.textStartMm}
            y={geometry.textBaselineMm}
          >
            {configuration.text}
          </text>
        </svg>

        <g className="configurator-preview__dimensions" aria-hidden="true">
          <line
            x1={valanceX}
            x2={valanceX + valanceWidth}
            y1={dimensionY}
            y2={dimensionY}
          />
          <line
            x1={valanceX}
            x2={valanceX}
            y1={dimensionY - DIMENSION_TICK_HALF}
            y2={dimensionY + DIMENSION_TICK_HALF}
          />
          <line
            x1={valanceX + valanceWidth}
            x2={valanceX + valanceWidth}
            y1={dimensionY - DIMENSION_TICK_HALF}
            y2={dimensionY + DIMENSION_TICK_HALF}
          />
          <text x={SCENE_WIDTH / 2} y={dimensionY - 12} textAnchor="middle">
            {configuration.valanceWidthMm} mm
          </text>

          <line
            x1={dimensionEndX}
            x2={dimensionEndX}
            y1={valanceTop}
            y2={valanceTop + valanceHeight}
          />
          <line
            x1={dimensionEndX - 9}
            x2={dimensionEndX + 9}
            y1={valanceTop}
            y2={valanceTop}
          />
          <line
            x1={dimensionEndX - 9}
            x2={dimensionEndX + 9}
            y1={valanceTop + valanceHeight}
            y2={valanceTop + valanceHeight}
          />
          <text
            textAnchor="middle"
            transform={`rotate(-90 ${dimensionEndX + 20} ${
              valanceTop + valanceHeight / 2
            })`}
            x={dimensionEndX + 20}
            y={valanceTop + valanceHeight / 2}
          >
            {configuration.valanceHeightMm} mm
          </text>
        </g>
      </svg>
    </div>
  );
}
