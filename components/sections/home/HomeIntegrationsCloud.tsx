/**
 * Home — “Endless integrations” floating cloud (Figma `428:15019`).
 *
 * Reproduces the static Figma artwork as a live, organic animation:
 *  - Each logo sits on a soft cream chip; the chip drifts slowly with its own
 *    randomised sin-wave wobble so no two chips move in lock-step.
 *  - Each chip is anchored to the central pancake monster by a dotted Bezier
 *    "tentacle". The tentacle's control point also wobbles, so the rope
 *    *waves* rather than pivoting rigidly with the chip.
 *  - A few decorative free-floating curves frame the cloud (taken loosely
 *    from the Figma sweeping paths).
 *
 * All positions are in the Figma inner-container coord space (1786 × 900);
 * the SVG `viewBox` does the responsive scaling.
 */

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

import { gsap } from "@/lib/gsap";

const VB_W = 1786;
const VB_H = 900;
/** Tentacle anchor — pancake-monster centre in Figma container coords. */
const ANCHOR_X = 960;
const ANCHOR_Y = 435;

type LogoDef = {
  id: string;
  src: string;
  alt: string;
  /** Chip background centre (rest position) in Figma coords. */
  cx: number;
  cy: number;
  /** Chip radius. */
  chipR: number;
  /** Rendered logo width / height inside the chip. */
  logoW: number;
  logoH: number;
  /** Optional in-chip rotation (degrees). */
  rotateDeg?: number;
};

/**
 * Logos pulled from Figma `428:15019`. Coordinates are chip-centre points
 * inside the 1786×900 cloud frame; sizes match the Figma exports.
 */
const LOGOS: LogoDef[] = [
  // top row
  { id: "gmail",    src: "/integrations/gmail.svg",       alt: "Gmail",    cx: 658,  cy: 254, chipR: 86,  logoW: 96,  logoH: 72,  rotateDeg: -8.59 },
  { id: "github",   src: "/integrations/github-fill.svg", alt: "GitHub",   cx: 1085, cy: 172, chipR: 94,  logoW: 76,  logoH: 75,  rotateDeg: 6.63 },
  { id: "claude",   src: "/integrations/claude.svg",      alt: "Claude",   cx: 1576, cy: 303, chipR: 42,  logoW: 36,  logoH: 36 },
  // middle row
  { id: "x",        src: "/integrations/x.svg",           alt: "X",        cx: 380,  cy: 470, chipR: 70,  logoW: 60,  logoH: 60,  rotateDeg: 8.22 },
  { id: "linkedin", src: "",                               alt: "LinkedIn", cx: 1180, cy: 480, chipR: 122, logoW: 130, logoH: 130 },
  // bottom row
  { id: "vercel",   src: "/integrations/vercel.svg",      alt: "Vercel",   cx: 556,  cy: 596, chipR: 86,  logoW: 64,  logoH: 56,  rotateDeg: -1.2 },
  { id: "slack",    src: "/integrations/slack.svg",       alt: "Slack",    cx: 870,  cy: 695, chipR: 117, logoW: 96,  logoH: 96,  rotateDeg: -9.15 },
  { id: "notion",   src: "/integrations/notion.svg",      alt: "Notion",   cx: 1242, cy: 720, chipR: 142, logoW: 132, logoH: 132, rotateDeg: 6.49 },
];

/**
 * Decorative scattered "pancake" dots. Pulled loosely from the Figma scattered
 * dot accents — kept small so they read as ambient texture, not signal.
 */
const ACCENT_DOTS = [
  { cx: 295,  cy: 132, r: 8,  fill: "var(--palette-orange-30)", driftAmp: 8 },
  { cx: 478,  cy: 245, r: 16, fill: "var(--palette-purple-20)", driftAmp: 12 },
  { cx: 800,  cy: 165, r: 18, fill: "var(--palette-orange-30)", driftAmp: 10 },
  { cx: 1530, cy: 615, r: 11, fill: "var(--palette-orange-30)", driftAmp: 9 },
  { cx: 376,  cy: 770, r: 14, fill: "var(--palette-yellow-30)", driftAmp: 12 },
  { cx: 564,  cy: 778, r: 18, fill: "var(--palette-pink-30)",   driftAmp: 11 },
  { cx: 805,  cy: 870, r: 14, fill: "var(--palette-purple-20)", driftAmp: 13 },
] as const;

/**
 * Decorative sweeping background paths (Figma vectors 240/243/249 & friends).
 * Drawn as long dashed curves with their own slow control-point wobble so the
 * empty space around the cloud still feels alive.
 */
type BgCurve = { id: string; from: [number, number]; ctrl: [number, number]; to: [number, number]; ctrlAmp: number };
const BG_CURVES: BgCurve[] = [
  { id: "bgL", from: [-50,  100], ctrl: [350,  -40], to: [780,  500], ctrlAmp: 18 },
  { id: "bgR", from: [1820, 80],  ctrl: [1500, 380], to: [1900, 720], ctrlAmp: 22 },
  { id: "bgB", from: [40,   880], ctrl: [820,  1080], to: [1700, 880], ctrlAmp: 16 },
];

/** Shape of the per-chip wobble parameters (drives the GSAP ticker). */
type Wobble = {
  freqX: number; freqY: number;
  ampX: number;  ampY: number;
  phaseX: number; phaseY: number;
  /** Bezier control point wobble — independent of chip wobble so the rope undulates. */
  ctrlFreqA: number; ctrlAmpA: number; ctrlPhaseA: number;
  ctrlFreqP: number; ctrlAmpP: number; ctrlPhaseP: number;
};

/** Deterministic per-chip wobble seed, keyed on logo id, so SSR/CSR don't disagree. */
function wobbleFor(id: string): Wobble {
  // Tiny string-hash → 0..1 for each parameter.
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const r = (mul: number) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return ((h >>> 0) / 0x1_0000_0000) * mul;
  };
  return {
    freqX: 0.18 + r(0.22),
    freqY: 0.16 + r(0.24),
    ampX:  16 + r(14),
    ampY:  14 + r(14),
    phaseX: r(Math.PI * 2),
    phaseY: r(Math.PI * 2),
    ctrlFreqA: 0.22 + r(0.26),
    ctrlAmpA:  60 + r(70),
    ctrlPhaseA: r(Math.PI * 2),
    ctrlFreqP: 0.14 + r(0.2),
    ctrlAmpP:  18 + r(28),
    ctrlPhaseP: r(Math.PI * 2),
  };
}

export function HomeIntegrationsCloud() {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const chipRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const tentacleRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const bgPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const monsterRef = useRef<HTMLDivElement | null>(null);

  /** Keep the `wobble` table stable across renders. */
  const wobbles = useMemo(() => {
    const m = new Map<string, Wobble>();
    for (const l of LOGOS) m.set(l.id, wobbleFor(l.id));
    return m;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const start = performance.now() / 1000;
    let disposed = false;

    /**
     * Per-frame update — all wobble math happens here. Cheap (~24 sin calls
     * + 8 path string updates), runs on GSAP's shared ticker.
     */
    const tick = () => {
      if (disposed) return;
      const t = performance.now() / 1000 - start;

      // Chips + their tentacles
      for (const logo of LOGOS) {
        const w = wobbles.get(logo.id)!;
        const dx = Math.sin(t * w.freqX * Math.PI + w.phaseX) * w.ampX;
        const dy = Math.sin(t * w.freqY * Math.PI + w.phaseY) * w.ampY;

        const chipEl = chipRefs.current.get(logo.id);
        if (chipEl) chipEl.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;

        const pathEl = tentacleRefs.current.get(logo.id);
        if (pathEl) {
          const tipX = logo.cx + dx;
          const tipY = logo.cy + dy;
          // Direction from anchor to tip (for perpendicular control-point offset).
          const vx = tipX - ANCHOR_X;
          const vy = tipY - ANCHOR_Y;
          const len = Math.hypot(vx, vy) || 1;
          const nx = -vy / len; // perpendicular
          const ny = vx / len;
          // Mid-point base + perpendicular wobble + small along-axis wobble.
          const mx = (ANCHOR_X + tipX) / 2;
          const my = (ANCHOR_Y + tipY) / 2;
          const perp = Math.sin(t * w.ctrlFreqA * Math.PI + w.ctrlPhaseA) * w.ctrlAmpA;
          const along = Math.sin(t * w.ctrlFreqP * Math.PI + w.ctrlPhaseP) * w.ctrlAmpP;
          const cx = mx + nx * perp + (vx / len) * along;
          const cy = my + ny * perp + (vy / len) * along;
          pathEl.setAttribute("d", `M ${ANCHOR_X.toFixed(1)} ${ANCHOR_Y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`);
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

        {/* Tentacles — anchor at monster centre, tip at chip centre */}
        {LOGOS.map((logo) => (
          <path
            key={logo.id}
            ref={(el) => {
              if (el) tentacleRefs.current.set(logo.id, el);
              else tentacleRefs.current.delete(logo.id);
            }}
            className="home-integrations-cloud__tentacle"
            d={`M ${ANCHOR_X} ${ANCHOR_Y} Q ${(ANCHOR_X + logo.cx) / 2} ${(ANCHOR_Y + logo.cy) / 2} ${logo.cx} ${logo.cy}`}
          />
        ))}

        {/* Accent dots */}
        {ACCENT_DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={d.fill}
            className="home-integrations-cloud__accent"
          />
        ))}
      </svg>

      {/* Chips (logos on cream circles), positioned via percentages of the SVG box */}
      {LOGOS.map((logo) => (
        <div
          key={logo.id}
          ref={(el) => {
            if (el) chipRefs.current.set(logo.id, el);
            else chipRefs.current.delete(logo.id);
          }}
          className="home-integrations-cloud__chip"
          style={{
            left: `${(logo.cx / VB_W) * 100}%`,
            top: `${(logo.cy / VB_H) * 100}%`,
            width: `${(logo.chipR * 2 / VB_W) * 100}%`,
            aspectRatio: "1 / 1",
          }}
          data-logo={logo.id}
        >
          <div
            className="home-integrations-cloud__logo"
            style={{
              width: `${(logo.logoW / (logo.chipR * 2)) * 100}%`,
              height: `${(logo.logoH / (logo.chipR * 2)) * 100}%`,
              transform: logo.rotateDeg ? `rotate(${logo.rotateDeg}deg)` : undefined,
            }}
          >
            {logo.id === "linkedin" ? (
              <svg viewBox="0 0 24 24" className="home-integrations-cloud__logo-svg" aria-hidden>
                <rect width="24" height="24" rx="3" fill="#0A66C2" />
                <path
                  fill="#FFFFFF"
                  d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z"
                />
              </svg>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- raster from Figma export
              <img
                src={logo.src}
                alt={logo.alt}
                className="home-integrations-cloud__logo-img"
                width={logo.logoW * 2}
                height={logo.logoH * 2}
                decoding="async"
                loading="lazy"
              />
            )}
          </div>
        </div>
      ))}

      {/* Pancake monster centred on the anchor */}
      <div
        ref={monsterRef}
        className="home-integrations-cloud__monster"
        style={{
          left: `${(ANCHOR_X / VB_W) * 100}%`,
          top: `${(ANCHOR_Y / VB_H) * 100}%`,
        }}
        aria-hidden
      >
        <Image
          src="/pancake-monster.png"
          alt=""
          width={224}
          height={224}
          priority={false}
          className="home-integrations-cloud__monster-img"
        />
      </div>
    </div>
  );
}
