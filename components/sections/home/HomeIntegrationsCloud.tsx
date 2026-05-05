/**
 * Home — “Endless integrations” floating cloud (Figma `428:15019`).
 *
 * Reproduces the static Figma artwork as a live, organic animation:
 *  - Each logo sits on a tilted **pancake** chip (ellipse + 3D-side, layered
 *    via two stacked SVG paths). No more perfect circles — chips track the
 *    pancake design system used elsewhere on the page.
 *  - Each chip is anchored to the central pancake monster by a dotted Bezier
 *    "tentacle". The tentacle is split into two segments: an *inner* run
 *    from monster→chip (full opacity) and an *outer* run from chip→tail
 *    (faded), so the tendril clearly continues past the logo.
 *  - A small pancake sits at every outer-tail tip, plus a handful of
 *    decorative pancake "berries" scattered through negative space — same
 *    set used in the Figma decoration layer, just tinted from the palette.
 *  - All wobble math runs on the GSAP shared ticker (one rAF loop), with
 *    deterministic per-element seeds so SSR/CSR agree.
 *
 * Coordinates are the Figma inner-container space (1786 × 900); the SVG
 * `viewBox` does the responsive scaling.
 */

"use client";

import { useEffect, useMemo, useRef } from "react";

import { gsap } from "@/lib/gsap";

const VB_W = 1786;
const VB_H = 900;
/** Tentacle anchor — pancake-monster centre in Figma container coords. */
const ANCHOR_X = 960;
const ANCHOR_Y = 435;

/* ----------------------------------------------------------------------- */
/* Pancake — inline SVG, parameterised colours, used for chips + decoration */
/* ----------------------------------------------------------------------- */

/**
 * Path data lifted directly from `public/pancake-svgs/angled-1.svg` (project
 * design system). Side path is the lighter "edge" of the 3D pancake, top
 * path is the darker upper surface — together they form the layered look.
 */
const PANCAKE_VIEWBOX = "0 0 49 48";
const PANCAKE_SIDE_D =
  "M25.9537 42C33.3632 42 39.2879 37.7456 43.3461 33.4449C46.1317 30.4929 47.7828 26.7658 47.8255 22.5904C47.9308 12.2895 37.5877 4 24.9673 4C12.347 4 1.61512 11.2979 0.299682 22.5904C-0.498594 29.4427 3.49706 33.162 8.00699 36.2143C12.4861 39.2458 19.7274 42 25.9537 42Z";
const PANCAKE_TOP_D =
  "M25.8326 36C32.779 36 38.3334 32.4173 42.138 28.7957C44.7495 26.3098 46.2973 23.1712 46.3374 19.6551C46.4361 10.9807 36.7394 4 24.9078 4C13.0762 4 3.01515 10.1456 1.78193 19.6551C1.03355 25.4254 4.77947 28.5575 9.00753 31.1278C13.2067 33.6806 19.9955 36 25.8326 36Z";

/**
 * Decorative pancake palettes. Used for the small "berries" scattered through
 * negative space and the tail tips at the end of each tentacle. Convention:
 * `top` = darker visible upper surface; `side` = lighter underbelly peeking
 * at the lower edge — matches `pancake-svgs/angled-1.svg`.
 *
 * The chip backgrounds use external Figma ellipse SVGs (see `LOGOS[].chipSrc`),
 * NOT this layered pancake — chips are simple cream ellipses, not pancakes.
 */
const PANCAKE_PALETTE = {
  pink:   { top: "#F1809E", side: "#F4B0BF" },
  purple: { top: "#B89BE0", side: "#D7C4ED" },
  orange: { top: "#FF7F47", side: "#FFB48A" },
  yellow: { top: "#F2C94C", side: "#F7DE9C" },
  cream:  { top: "#FFD7A8", side: "#FFE9C8" },
} as const;
type PancakePaletteName = keyof typeof PANCAKE_PALETTE;

/* ----------------------------------------------------------------------- */
/* Logo definitions                                                         */
/* ----------------------------------------------------------------------- */

type LogoDef = {
  id: string;
  src: string;
  alt: string;
  /** Chip centre in Figma coords. */
  cx: number;
  cy: number;
  /**
   * Chip ellipse asset (a Figma export — simple cream ellipse path with
   * `fill="var(--fill-0, #FFF7EC)"`). Sized to its native viewBox below.
   */
  chipSrc: string;
  /** Chip ellipse intrinsic dimensions (match the asset's viewBox). */
  chipW: number;
  chipH: number;
  /** Tilt (deg) applied around the chip centre — matches Figma per-chip rotations. */
  chipRotateDeg: number;
  /** Logo dimensions and any in-chip rotation. */
  logoW: number;
  logoH: number;
  logoRotateDeg?: number;
  /** Outer tail point in Figma coords — the tentacle continues from chip→tail past the logo. */
  tailX: number;
  tailY: number;
  /** Pancake at the tail tip — size + colour. */
  tailSize: number;
  tailPalette: PancakePaletteName;
  /** Outer-segment perpendicular curl (px) — sets which side the outer Bezier sweeps. */
  outerCurl: number;
};

const LOGOS: LogoDef[] = [
  // Gmail (Figma Ellipse 4 — un-rotated 172×169 cream ellipse).
  {
    id: "gmail", src: "/integrations/gmail.svg", alt: "Gmail",
    cx: 658, cy: 254,
    chipSrc: "/integrations/ellipse-gmail.svg", chipW: 172, chipH: 169, chipRotateDeg: 0,
    logoW: 96, logoH: 72, logoRotateDeg: -8.59,
    tailX: 270, tailY: 90, tailSize: 22, tailPalette: "orange", outerCurl: -90,
  },
  // GitHub (Ellipse 9 — 137×135, tilted 58.71° in Figma).
  {
    id: "github", src: "/integrations/github-fill.svg", alt: "GitHub",
    cx: 1085, cy: 172,
    chipSrc: "/integrations/ellipse-github.svg", chipW: 137.52, chipH: 135.29, chipRotateDeg: 58.71,
    logoW: 76, logoH: 75, logoRotateDeg: 6.63,
    tailX: 1340, tailY: 30, tailSize: 24, tailPalette: "yellow", outerCurl: 80,
  },
  // Claude (Ellipse 13 — 63×55, tilt -149.23°).
  {
    id: "claude", src: "/integrations/claude.svg", alt: "Claude",
    cx: 1576, cy: 303,
    chipSrc: "/integrations/ellipse-claude.svg", chipW: 63.27, chipH: 54.9, chipRotateDeg: -149.23,
    logoW: 36, logoH: 36,
    tailX: 1820, tailY: 250, tailSize: 16, tailPalette: "orange", outerCurl: -50,
  },
  // X (Ellipse 12 — 113×98, tilt -109.95°).
  {
    id: "x", src: "/integrations/x.svg", alt: "X",
    cx: 380, cy: 470,
    chipSrc: "/integrations/ellipse-x.svg", chipW: 113.65, chipH: 98.61, chipRotateDeg: -109.95,
    logoW: 60, logoH: 55,
    tailX: 90, tailY: 530, tailSize: 18, tailPalette: "pink", outerCurl: -70,
  },
  // LinkedIn (Ellipse 8 — 206×203, tilt 58.71°).
  {
    id: "linkedin", src: "", alt: "LinkedIn",
    cx: 1180, cy: 480,
    chipSrc: "/integrations/ellipse-linkedin.svg", chipW: 206.38, chipH: 203.03, chipRotateDeg: 58.71,
    logoW: 130, logoH: 130,
    tailX: 1690, tailY: 540, tailSize: 24, tailPalette: "orange", outerCurl: 70,
  },
  // Vercel (Ellipse 5 — same cream ellipse asset as Gmail; un-rotated 172×169).
  {
    id: "vercel", src: "/integrations/vercel.svg", alt: "Vercel",
    cx: 556, cy: 596,
    chipSrc: "/integrations/ellipse-gmail.svg", chipW: 172, chipH: 169, chipRotateDeg: 0,
    logoW: 64, logoH: 56,
    tailX: 280, tailY: 720, tailSize: 24, tailPalette: "yellow", outerCurl: -80,
  },
  // Slack (Ellipse 6 — 172×169, tilt 58.71°).
  {
    id: "slack", src: "/integrations/slack.svg", alt: "Slack",
    cx: 870, cy: 695,
    chipSrc: "/integrations/ellipse-slack.svg", chipW: 172.13, chipH: 169.34, chipRotateDeg: 58.71,
    logoW: 96, logoH: 96, logoRotateDeg: -9.15,
    tailX: 770, tailY: 880, tailSize: 28, tailPalette: "purple", outerCurl: 60,
  },
  // Notion (Ellipse 7 — 215×212, tilt 58.71°).
  {
    id: "notion", src: "/integrations/notion.svg", alt: "Notion",
    cx: 1242, cy: 720,
    chipSrc: "/integrations/ellipse-notion.svg", chipW: 215.57, chipH: 212.07, chipRotateDeg: 58.71,
    logoW: 132, logoH: 132, logoRotateDeg: 6.49,
    tailX: 1640, tailY: 800, tailSize: 20, tailPalette: "orange", outerCurl: 90,
  },
];

/* ----------------------------------------------------------------------- */
/* Background sweeping curves                                               */
/* ----------------------------------------------------------------------- */

type BgCurve = { id: string; from: [number, number]; ctrl: [number, number]; to: [number, number]; ctrlAmp: number };
const BG_CURVES: BgCurve[] = [
  { id: "bgL", from: [-50,  100], ctrl: [350,  -40],  to: [780,  500], ctrlAmp: 18 },
  { id: "bgR", from: [1820, 80],  ctrl: [1500, 380],  to: [1900, 720], ctrlAmp: 22 },
  { id: "bgB", from: [40,   880], ctrl: [820,  1080], to: [1700, 880], ctrlAmp: 16 },
];

/* ----------------------------------------------------------------------- */
/* Per-element wobble seed                                                  */
/* ----------------------------------------------------------------------- */

type Wobble = {
  freqX: number; freqY: number;
  ampX: number;  ampY: number;
  phaseX: number; phaseY: number;
  /** Bezier control point wobble — independent of chip wobble so the rope undulates. */
  ctrlFreqA: number; ctrlAmpA: number; ctrlPhaseA: number;
  ctrlFreqP: number; ctrlAmpP: number; ctrlPhaseP: number;
  /** Outer-tail wobble (a bit larger than chip drift — tail tips drift further). */
  tailFreqX: number; tailFreqY: number;
  tailAmpX: number;  tailAmpY: number;
  tailPhaseX: number; tailPhaseY: number;
  /** Outer-segment Bezier control wobble. */
  outerCtrlFreq: number; outerCtrlAmp: number; outerCtrlPhase: number;
};

/** Deterministic per-id wobble (stable string hash). */
function wobbleFor(id: string): Wobble {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const r = (mul: number) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return ((h >>> 0) / 0x1_0000_0000) * mul;
  };
  return {
    freqX: 0.18 + r(0.22),
    freqY: 0.16 + r(0.24),
    ampX:  14 + r(12),
    ampY:  12 + r(12),
    phaseX: r(Math.PI * 2),
    phaseY: r(Math.PI * 2),
    ctrlFreqA: 0.22 + r(0.26),
    ctrlAmpA:  60 + r(70),
    ctrlPhaseA: r(Math.PI * 2),
    ctrlFreqP: 0.14 + r(0.2),
    ctrlAmpP:  18 + r(28),
    ctrlPhaseP: r(Math.PI * 2),
    tailFreqX: 0.22 + r(0.24),
    tailFreqY: 0.2 + r(0.22),
    tailAmpX:  18 + r(16),
    tailAmpY:  16 + r(16),
    tailPhaseX: r(Math.PI * 2),
    tailPhaseY: r(Math.PI * 2),
    outerCtrlFreq: 0.18 + r(0.22),
    outerCtrlAmp:  40 + r(60),
    outerCtrlPhase: r(Math.PI * 2),
  };
}

/* ----------------------------------------------------------------------- */
/* Inline pancake — used as a primitive everywhere                         */
/* ----------------------------------------------------------------------- */

function PancakePaths({ palette }: { palette: PancakePaletteName }) {
  const p = PANCAKE_PALETTE[palette];
  return (
    <>
      <path d={PANCAKE_SIDE_D} fill={p.side} />
      <path d={PANCAKE_TOP_D} fill={p.top} />
    </>
  );
}

/* ----------------------------------------------------------------------- */
/* Main component                                                           */
/* ----------------------------------------------------------------------- */

export function HomeIntegrationsCloud() {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const chipRefs = useRef<Map<string, SVGGElement>>(new Map());
  const innerPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const outerPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const tailRefs = useRef<Map<string, SVGGElement>>(new Map());
  const bgPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const monsterRef = useRef<HTMLDivElement | null>(null);

  const wobbles = useMemo(() => {
    const m = new Map<string, Wobble>();
    for (const l of LOGOS) m.set(l.id, wobbleFor(l.id));
    return m;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const start = performance.now() / 1000;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const t = performance.now() / 1000 - start;

      for (const logo of LOGOS) {
        const w = wobbles.get(logo.id)!;

        // Chip drift (its own tilt is baked into the SVG transform; we just translate)
        const dx = Math.sin(t * w.freqX * Math.PI + w.phaseX) * w.ampX;
        const dy = Math.sin(t * w.freqY * Math.PI + w.phaseY) * w.ampY;
        const tipX = logo.cx + dx;
        const tipY = logo.cy + dy;

        const chipEl = chipRefs.current.get(logo.id);
        if (chipEl) {
          // Outer `<g>` only translates — chip and logo rotations live on inner `<g>`s.
          chipEl.setAttribute(
            "transform",
            `translate(${tipX.toFixed(2)} ${tipY.toFixed(2)})`,
          );
        }

        // Inner tentacle — anchor → chip
        const inner = innerPathRefs.current.get(logo.id);
        if (inner) {
          const vx = tipX - ANCHOR_X;
          const vy = tipY - ANCHOR_Y;
          const len = Math.hypot(vx, vy) || 1;
          const nx = -vy / len;
          const ny = vx / len;
          const mx = (ANCHOR_X + tipX) / 2;
          const my = (ANCHOR_Y + tipY) / 2;
          const perp = Math.sin(t * w.ctrlFreqA * Math.PI + w.ctrlPhaseA) * w.ctrlAmpA;
          const along = Math.sin(t * w.ctrlFreqP * Math.PI + w.ctrlPhaseP) * w.ctrlAmpP;
          const cx = mx + nx * perp + (vx / len) * along;
          const cy = my + ny * perp + (vy / len) * along;
          inner.setAttribute("d", `M ${ANCHOR_X.toFixed(1)} ${ANCHOR_Y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`);
        }

        // Tail wobble + outer tentacle (chip → tail)
        const tdx = Math.sin(t * w.tailFreqX * Math.PI + w.tailPhaseX) * w.tailAmpX;
        const tdy = Math.sin(t * w.tailFreqY * Math.PI + w.tailPhaseY) * w.tailAmpY;
        const tlX = logo.tailX + tdx;
        const tlY = logo.tailY + tdy;

        const tailEl = tailRefs.current.get(logo.id);
        if (tailEl) {
          tailEl.setAttribute("transform", `translate(${tlX.toFixed(2)} ${tlY.toFixed(2)})`);
        }

        const outer = outerPathRefs.current.get(logo.id);
        if (outer) {
          // Mid-point between chip and tail with curl perpendicular to direction
          const vx2 = tlX - tipX;
          const vy2 = tlY - tipY;
          const len2 = Math.hypot(vx2, vy2) || 1;
          const nx2 = -vy2 / len2;
          const ny2 = vx2 / len2;
          const mx2 = (tipX + tlX) / 2;
          const my2 = (tipY + tlY) / 2;
          const curl = logo.outerCurl + Math.sin(t * w.outerCtrlFreq * Math.PI + w.outerCtrlPhase) * w.outerCtrlAmp;
          const cx2 = mx2 + nx2 * curl;
          const cy2 = my2 + ny2 * curl;
          outer.setAttribute("d", `M ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${cx2.toFixed(1)} ${cy2.toFixed(1)} ${tlX.toFixed(1)} ${tlY.toFixed(1)}`);
        }
      }

      // Background sweeping curves
      for (const c of BG_CURVES) {
        const pathEl = bgPathRefs.current.get(c.id);
        if (!pathEl) continue;
        const phaseX = c.id.charCodeAt(0) * 1.3;
        const phaseY = c.id.charCodeAt(2) * 0.7;
        const dCx = Math.sin(t * 0.3 + phaseX) * c.ctrlAmp;
        const dCy = Math.cos(t * 0.27 + phaseY) * c.ctrlAmp * 0.8;
        const cx = c.ctrl[0] + dCx;
        const cy = c.ctrl[1] + dCy;
        pathEl.setAttribute("d", `M ${c.from[0]} ${c.from[1]} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${c.to[0]} ${c.to[1]}`);
      }

      // Monster idle bob
      if (monsterRef.current) {
        const mb = Math.sin(t * 0.9) * 4;
        const mx = Math.sin(t * 0.6 + 1.2) * 3;
        monsterRef.current.style.transform = `translate(-50%, -50%) translate(${mx.toFixed(2)}px, ${mb.toFixed(2)}px)`;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
    };
  }, [reducedMotion, wobbles]);

  return (
    <div className="home-integrations-cloud" data-node-id="428:15019">
      <svg
        className="home-integrations-cloud__svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        focusable="false"
      >
        {/* Sweeping background curves */}
        {BG_CURVES.map((c) => (
          <path
            key={c.id}
            ref={(el) => {
              if (el) bgPathRefs.current.set(c.id, el);
              else bgPathRefs.current.delete(c.id);
            }}
            className="home-integrations-cloud__bg-path"
            d={`M ${c.from[0]} ${c.from[1]} Q ${c.ctrl[0]} ${c.ctrl[1]} ${c.to[0]} ${c.to[1]}`}
          />
        ))}

        {/* Outer tentacle segments (chip → tail) — drawn first / under chips, faded */}
        {LOGOS.map((logo) => (
          <path
            key={`${logo.id}-outer`}
            ref={(el) => {
              if (el) outerPathRefs.current.set(logo.id, el);
              else outerPathRefs.current.delete(logo.id);
            }}
            className="home-integrations-cloud__tentacle home-integrations-cloud__tentacle--outer"
            d={`M ${logo.cx} ${logo.cy} Q ${(logo.cx + logo.tailX) / 2} ${(logo.cy + logo.tailY) / 2} ${logo.tailX} ${logo.tailY}`}
          />
        ))}

        {/* Inner tentacle segments (anchor → chip) — full opacity */}
        {LOGOS.map((logo) => (
          <path
            key={`${logo.id}-inner`}
            ref={(el) => {
              if (el) innerPathRefs.current.set(logo.id, el);
              else innerPathRefs.current.delete(logo.id);
            }}
            className="home-integrations-cloud__tentacle home-integrations-cloud__tentacle--inner"
            d={`M ${ANCHOR_X} ${ANCHOR_Y} Q ${(ANCHOR_X + logo.cx) / 2} ${(ANCHOR_Y + logo.cy) / 2} ${logo.cx} ${logo.cy}`}
          />
        ))}

        {/* Tail pancakes (small, decorative, sit at outer tentacle tips) */}
        {LOGOS.map((logo) => (
          <g
            key={`${logo.id}-tail`}
            ref={(el) => {
              if (el) tailRefs.current.set(logo.id, el);
              else tailRefs.current.delete(logo.id);
            }}
            transform={`translate(${logo.tailX} ${logo.tailY})`}
          >
            <g transform={`scale(${logo.tailSize / 49}) translate(${-49 / 2} ${-48 / 2})`}>
              <PancakePaths palette={logo.tailPalette} />
            </g>
          </g>
        ))}

        {/*
         * Logo chips. Each chip is composed of two stacked images at the same
         * `(cx, cy)` centre:
         *  1. The **chip ellipse SVG** (Figma export, cream `#FFF7EC`) rotated
         *     by `chipRotateDeg` — this gives the tilted-oval pancake silhouette.
         *  2. The **brand logo SVG** rotated by its own `logoRotateDeg` — drift
         *     wobble is applied to the outer `<g>` so chip + logo move together.
         */}
        {LOGOS.map((logo) => (
          <g
            key={logo.id}
            ref={(el) => {
              if (el) chipRefs.current.set(logo.id, el);
              else chipRefs.current.delete(logo.id);
            }}
            transform={`translate(${logo.cx} ${logo.cy})`}
            data-logo={logo.id}
          >
            {/* Chip ellipse — tilted */}
            <g transform={`rotate(${logo.chipRotateDeg})`}>
              <image
                href={logo.chipSrc}
                width={logo.chipW}
                height={logo.chipH}
                x={-logo.chipW / 2}
                y={-logo.chipH / 2}
                preserveAspectRatio="none"
              />
            </g>
            {/* Logo — independent rotation, sits on top */}
            <g transform={`rotate(${logo.logoRotateDeg ?? 0})`}>
              {logo.id === "linkedin" ? (
                <svg
                  viewBox="0 0 24 24"
                  width={logo.logoW}
                  height={logo.logoH}
                  x={-logo.logoW / 2}
                  y={-logo.logoH / 2}
                  overflow="visible"
                >
                  <rect width="24" height="24" rx="3" fill="#0A66C2" />
                  <path
                    fill="#FFFFFF"
                    d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z"
                  />
                </svg>
              ) : (
                <image
                  href={logo.src}
                  width={logo.logoW}
                  height={logo.logoH}
                  x={-logo.logoW / 2}
                  y={-logo.logoH / 2}
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>
          </g>
        ))}
      </svg>

      {/* Pancake monster centred on the anchor (raster — not vector) */}
      <div
        ref={monsterRef}
        className="home-integrations-cloud__monster"
        style={{
          left: `${(ANCHOR_X / VB_W) * 100}%`,
          top: `${(ANCHOR_Y / VB_H) * 100}%`,
        }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- raster mascot, sized 1:1 */}
        <img
          src="/pancake-monster.png"
          alt=""
          className="home-integrations-cloud__monster-img"
          width={224}
          height={224}
          decoding="async"
        />
      </div>
    </div>
  );
}
