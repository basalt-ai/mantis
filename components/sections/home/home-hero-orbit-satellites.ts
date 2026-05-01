/**
 * Hero orbit “satellite” pancake instances — Figma `428:14900` (`hero`).
 *
 * Positions are **center offsets from the `pancake monster` frame** (`428:14920`, 160×160 in Figma),
 * in the same px space as `--size-home-hero-monster-max-width` (160 at default scale).
 * `dx`/`dy` = satellite bounding-box center minus monster frame center (from `absoluteBoundingBox`).
 * `rotationDeg` = INSTANCE `rotation` from Figma (Plugin API).
 *
 * Orbit assignment follows Figma layer order + distance check: there is **no** satellite on orbit 5 in this file.
 * SVGs: `public/home-hero-orbit-satellite-{figmaNode}.svg` — exported via Plugin `exportAsync({ format: 'SVG' })`.
 */
export type HomeHeroOrbitSatelliteLayer = "behindMascot" | "frontOfMascot";

export type HomeHeroOrbitSatellite = {
  readonly figmaNode: "428:14904" | "428:14907" | "428:14911" | "428:14921" | "428:16755";
  /** Which dotted orbit this instance sits on (for `data-orbit` / QA only). */
  readonly orbit: 1 | 2 | 3 | 4 | 6;
  readonly dxFigma: number;
  readonly dyFigma: number;
  readonly rotationDeg: number;
  readonly widthFigma: number;
  readonly heightFigma: number;
  readonly layer: HomeHeroOrbitSatelliteLayer;
};

/** Figma `428:14920` monster frame = 160px — same basis as `--size-home-hero-monster-max-width`. */
export const HOME_HERO_MONSTER_FIGMA_PX = 160;

export const HOME_HERO_ORBIT_SATELLITES: readonly HomeHeroOrbitSatellite[] = [
  {
    figmaNode: "428:14904",
    orbit: 1,
    dxFigma: -156,
    dyFigma: -139,
    rotationDeg: 0,
    widthFigma: 32,
    heightFigma: 32,
    layer: "behindMascot",
  },
  {
    figmaNode: "428:14907",
    orbit: 4,
    dxFigma: 415.2674874448248,
    dyFigma: -138.73253554179826,
    rotationDeg: 111.2654685992506,
    widthFigma: 34,
    heightFigma: 34,
    layer: "behindMascot",
  },
  {
    figmaNode: "428:14911",
    orbit: 6,
    dxFigma: -615.5639871583408,
    dyFigma: 358.4359562268801,
    rotationDeg: -32.467800351709045,
    widthFigma: 67,
    heightFigma: 41,
    layer: "behindMascot",
  },
  {
    figmaNode: "428:14921",
    orbit: 3,
    dxFigma: -287.0000338554382,
    dyFigma: 199.99997282028202,
    rotationDeg: -19.975237597657962,
    widthFigma: 41,
    heightFigma: 41,
    layer: "frontOfMascot",
  },
  {
    figmaNode: "428:16755",
    orbit: 2,
    dxFigma: 197.12269846466364,
    dyFigma: 176.8178436716553,
    rotationDeg: -122.48285820384838,
    widthFigma: 88,
    heightFigma: 88,
    layer: "frontOfMascot",
  },
] as const;

export function homeHeroOrbitSatelliteSrc(figmaNode: HomeHeroOrbitSatellite["figmaNode"]): string {
  return `/home-hero-orbit-satellite-${figmaNode}.svg`;
}
