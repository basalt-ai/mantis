"use client";

import type { CSSProperties } from "react";

import { HOME_HERO_ORBIT_LAYERS_OUTER_TO_INNER } from "@/components/sections/home/home-hero-orbit-layers";
import {
  HOME_HERO_MONSTER_FIGMA_PX,
  HOME_HERO_ORBIT_SATELLITES,
  homeHeroOrbitSatelliteCssRotationDeg,
  homeHeroOrbitSatelliteSrc,
} from "@/components/sections/home/home-hero-orbit-satellites";

const ORBIT_WIDTH_MULT: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  1: 1.0,
  2: 1.338,
  3: 1.692,
  4: 2.108,
  5: 2.681,
  6: 3.484,
};

const ORBIT_ANGLE_DEG: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  1: 27.159,
  2: 31.503,
  3: 39.230,
  4: 42.572,
  5: 54.456,
  6: 49.647,
};

const ORBITS_TO_RENDER: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6> = [2, 3, 4, 5, 6];

type Props = {
  baseSize: string;
};

export function EndcardOrbits({ baseSize }: Props) {
  return (
    <div
      aria-hidden
      className="endcard-orbits pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
      }}
    >
      {HOME_HERO_ORBIT_LAYERS_OUTER_TO_INNER.filter((layer) =>
        ORBITS_TO_RENDER.includes(layer.orbit),
      ).map((layer) => (
        <svg
          key={layer.orbit}
          viewBox={layer.viewBox}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="endcard-orbit-ring"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `calc(${baseSize} * ${ORBIT_WIDTH_MULT[layer.orbit]})`,
            height: "auto",
            transform: `translate(-50%, -50%) rotate(${ORBIT_ANGLE_DEG[layer.orbit]}deg)`,
            overflow: "visible",
          }}
        >
          <path
            d={layer.pathD}
            stroke="var(--text)"
            strokeWidth={1}
            strokeDasharray="0.578125 6.9375"
            strokeLinecap="round"
            {...(layer.pathOpacity !== undefined
              ? { opacity: layer.pathOpacity }
              : {})}
          />
        </svg>
      ))}

      {HOME_HERO_ORBIT_SATELLITES.map((sat) => {
        const dx = sat.dxFigma / HOME_HERO_MONSTER_FIGMA_PX;
        const dy = sat.dyFigma / HOME_HERO_MONSTER_FIGMA_PX;
        const w = sat.widthFigma / HOME_HERO_MONSTER_FIGMA_PX;
        const h = sat.heightFigma / HOME_HERO_MONSTER_FIGMA_PX;
        const rot = homeHeroOrbitSatelliteCssRotationDeg(
          sat.rotationFigmaPluginDeg,
        );
        const wrapperStyle: CSSProperties = {
          position: "absolute",
          left: 0,
          top: 0,
          width: `calc(${baseSize} * ${w})`,
          height: `calc(${baseSize} * ${h})`,
          transform: `translate(calc(-50% + ${baseSize} * ${dx}), calc(-50% + ${baseSize} * ${dy}))`,
        };
        return (
          <div
            key={sat.figmaNode}
            className="endcard-orbit-satellite"
            style={wrapperStyle}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${rot}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Figma PNG @2x bundled raster */}
              <img
                src={homeHeroOrbitSatelliteSrc(sat.figmaNode)}
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                decoding="async"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
