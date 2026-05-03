"use client";

/**
 * Org diagram wires — Figma `428:14926` (`get_design_context` MCP).
 * • Five “elements”: You, Pancake (hub), Growth, Engineering, Operations.
 * • Balls travel one full edge (u 0→1, no yoyo); on arrival they respawn from a random element’s departure
 *   (random outgoing directed leg). Stroke-free trail dots.
 */

import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const SVG_NS = "http://www.w3.org/2000/svg";

type OrgWireFrame = { x: number; y: number; w: number; h: number };

type OrgTransformedWire = {
  dataNodeId: string;
  pathIdSuffix: string;
  vbW: number;
  vbH: number;
  d: string;
  frame: OrgWireFrame;
  vectorStroke: boolean;
  transformMode?: "growth211" | "vector210";
};

const ORG_WIRE_GROWTH: OrgTransformedWire = {
  dataNodeId: "428:14927",
  pathIdSuffix: "growth",
  vbW: 174,
  vbH: 511.538,
  d: "M172.5 510C31.0004 520.5 169.5 46.5004 1.50037 1.50037",
  frame: { x: 206, y: 113, w: 508.672, h: 171 },
  vectorStroke: true,
  transformMode: "growth211",
};

const ORG_WIRE_OPERATIONS: OrgTransformedWire = {
  dataNodeId: "428:14928",
  pathIdSuffix: "operations",
  vbW: 160.501,
  vbH: 149.501,
  d: "M159 148C138.5 92.0004 46.0004 21.0004 1.50038 1.50038",
  frame: { x: 731, y: 91, w: 146.5, h: 157.5 },
  vectorStroke: false,
};

const ORG_WIRE_ENGINEERING: OrgTransformedWire = {
  dataNodeId: "428:14937",
  pathIdSuffix: "engineering",
  vbW: 177.412,
  vbH: 209,
  d: "M152.086 1.5C255.086 104.5 -9.91415 143.5 1.58568 207.5",
  frame: { x: 574.14, y: 102, w: 174.691, h: 206 },
  vectorStroke: true,
};

const ORG_DEPT_WIRES: readonly OrgTransformedWire[] = [ORG_WIRE_GROWTH, ORG_WIRE_OPERATIONS, ORG_WIRE_ENGINEERING];

const ORG_WIRE_FOUNDER_PANCAKE: OrgTransformedWire = {
  dataNodeId: "428:14936",
  pathIdSuffix: "founder-pancake",
  vbW: 18.134,
  vbH: 121.501,
  d: "M6.00034 1.50035C22.0003 35.5004 19.5003 83.0004 1.50034 120",
  frame: { x: 492.5, y: 21.87, w: 118.5, h: 15.135 },
  vectorStroke: true,
  transformMode: "vector210",
};

/** All wires that carry ball traffic (depts + human↔Pancake). */
const ORG_WIRES_WITH_BALLS: readonly OrgTransformedWire[] = [...ORG_DEPT_WIRES, ORG_WIRE_FOUNDER_PANCAKE];

function orgWireTransform(frame: OrgWireFrame, vbW: number, vbH: number): string {
  const sx = frame.w / vbW;
  const sy = frame.h / vbH;
  return `translate(${frame.x} ${frame.y}) scale(${sx} ${sy})`;
}

function orgWireTransformRotatedInner(
  frame: OrgWireFrame,
  vbW: number,
  vbH: number,
  innerW: number,
  innerH: number,
): string {
  const sx = innerW / vbW;
  const sy = innerH / vbH;
  const cx = frame.x + frame.w / 2;
  const cy = frame.y + frame.h / 2;
  return `translate(${cx} ${cy}) rotate(-90) translate(${-innerW / 2} ${-innerH / 2}) scale(${sx} ${sy})`;
}

function orgWireGroupTransform(wire: OrgTransformedWire): string {
  if (wire.transformMode === "growth211") {
    return orgWireTransformRotatedInner(wire.frame, wire.vbW, wire.vbH, 171, 508.672);
  }
  if (wire.transformMode === "vector210") {
    return orgWireTransformRotatedInner(wire.frame, wire.vbW, wire.vbH, 15.135, 118.5);
  }
  return orgWireTransform(wire.frame, wire.vbW, wire.vbH);
}

/** Figma stage coords for reduced-motion fallback (approx. along each wire). */
const REDUCED_FALLBACK_BY_WIRE: Record<string, readonly { cx: number; cy: number }[]> = {
  "428:14927": [{ cx: 330, cy: 201 }],
  "428:14937": [
    { cx: 526, cy: 187 },
    { cx: 656, cy: 173 },
    { cx: 602, cy: 266 },
  ],
  "428:14928": [
    { cx: 724, cy: 192 },
    { cx: 828, cy: 173 },
  ],
  "428:14936": [{ cx: 506, cy: 28 }],
};

const BALL_R_MIN = 3.2;
const BALL_R_MAX = 7.8;
const TOTAL_BALL_MIN = 18;
const TOTAL_BALL_MAX = 26;
/** One-way leg duration (s); no return tween — next leg respawns from a random element. */
const DURATION_MIN = 1.1;
const DURATION_MAX = 2.85;
const LEG_DELAY_MAX = 0.35;

const EASE_POOL = ["none", "power1.inOut", "power2.inOut", "sine.inOut", "power1.out", "power2.out"] as const;

/** Diagram centres in stage / viewBox space (1136×706) — nearest path end picks semantic node. */
const ANCHOR_IDS = ["you", "pancake", "growth", "engineering", "operations"] as const;
type AnchorId = (typeof ANCHOR_IDS)[number];

const ANCHORS: Record<AnchorId, { x: number; y: number }> = {
  you: { x: 263, y: 98 },
  pancake: { x: 672, y: 88 },
  growth: { x: 184, y: 448 },
  engineering: { x: 568, y: 486 },
  operations: { x: 952, y: 430 },
};

type DirectedLeg = {
  wireId: string;
  path: SVGPathElement;
  ballRoot: SVGGElement;
  forward: boolean;
  from: AnchorId;
  to: AnchorId;
};

function readDashPatternFromDom(path: SVGPathElement): string {
  return getComputedStyle(path).strokeDasharray || "1 12";
}

function stagePointToPathLocal(path: SVGPathElement, root: SVGSVGElement, x: number, y: number): { x: number; y: number } {
  const p = root.createSVGPoint();
  p.x = x;
  p.y = y;
  const pathCtm = path.getCTM();
  const rootCtm = root.getCTM();
  if (!pathCtm || !rootCtm) return { x, y };
  return p.matrixTransform(pathCtm.inverse().multiply(rootCtm));
}

function clearBallRoot(root: SVGGElement): void {
  while (root.firstChild) root.removeChild(root.firstChild);
}

function createTrailCircle(r: number): SVGCircleElement {
  const c = document.createElementNS(SVG_NS, "circle");
  c.setAttribute("class", "home-org-diagram__flow-node home-org-diagram__flow-node--trail");
  c.setAttribute("data-org-trail-ball", "1");
  c.setAttribute("r", String(r));
  c.setAttribute("cx", "0");
  c.setAttribute("cy", "0");
  return c;
}

function rand(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pickEase(rng: () => number): string {
  return EASE_POOL[Math.floor(rng() * EASE_POOL.length)] ?? "sine.inOut";
}

function closestAnchorToPathPoint(path: SVGPathElement, svg: SVGSVGElement, px: number, py: number): AnchorId {
  let best: AnchorId = "you";
  let bestD = Infinity;
  for (const id of ANCHOR_IDS) {
    const a = ANCHORS[id];
    const loc = stagePointToPathLocal(path, svg, a.x, a.y);
    const d = (loc.x - px) ** 2 + (loc.y - py) ** 2;
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

function buildDirectedLegs(
  svg: SVGSVGElement,
  wireCtx: readonly { wireId: string; path: SVGPathElement; ballRoot: SVGGElement }[],
): DirectedLeg[] {
  const legs: DirectedLeg[] = [];
  for (const w of wireCtx) {
    const len = w.path.getTotalLength();
    const p0 = w.path.getPointAtLength(0);
    const p1 = w.path.getPointAtLength(len);
    const a0 = closestAnchorToPathPoint(w.path, svg, p0.x, p0.y);
    const a1 = closestAnchorToPathPoint(w.path, svg, p1.x, p1.y);
    legs.push({ wireId: w.wireId, path: w.path, ballRoot: w.ballRoot, forward: true, from: a0, to: a1 });
    legs.push({ wireId: w.wireId, path: w.path, ballRoot: w.ballRoot, forward: false, from: a1, to: a0 });
  }
  return legs;
}

function pickLegFromAnchor(legs: readonly DirectedLeg[], from: AnchorId, rng: () => number): DirectedLeg {
  const candidates = legs.filter((l) => l.from === from);
  if (candidates.length > 0) return candidates[randInt(rng, 0, candidates.length - 1)]!;
  return legs[randInt(rng, 0, legs.length - 1)]!;
}

function placeBallOnPath(
  path: SVGPathElement,
  pathLen: number,
  u: number,
  forward: boolean,
  circle: SVGCircleElement,
): void {
  const t = gsap.utils.clamp(0, 1, u);
  const along = forward ? t : 1 - t;
  const pt = path.getPointAtLength(along * pathLen);
  circle.setAttribute("cx", String(pt.x));
  circle.setAttribute("cy", String(pt.y));
}

function runBallLeg(circle: SVGCircleElement, legs: readonly DirectedLeg[], rng: () => number): void {
  const from = ANCHOR_IDS[randInt(rng, 0, ANCHOR_IDS.length - 1)];
  const leg = pickLegFromAnchor(legs, from, rng);
  leg.ballRoot.appendChild(circle);

  const pathLen = leg.path.getTotalLength();
  const duration = rand(rng, DURATION_MIN, DURATION_MAX);
  const ease = pickEase(rng);
  const delay = rand(rng, 0, LEG_DELAY_MAX);

  circle.setAttribute("r", String(rand(rng, BALL_R_MIN, BALL_R_MAX)));

  const proxy = { u: 0 };
  const tick = () => {
    placeBallOnPath(leg.path, pathLen, proxy.u, leg.forward, circle);
  };

  gsap.fromTo(
    proxy,
    { u: 0 },
    {
      u: 1,
      duration,
      ease,
      delay,
      immediateRender: true,
      onUpdate: tick,
      onComplete: () => runBallLeg(circle, legs, rng),
    },
  );

  tick();
}

function startBallTraffic(
  svg: SVGSVGElement,
  wireCtx: readonly { wireId: string; path: SVGPathElement; ballRoot: SVGGElement }[],
  rng: () => number,
): void {
  wireCtx.forEach(({ ballRoot }) => {
    gsap.killTweensOf(ballRoot.querySelectorAll("circle[data-org-trail-ball]"));
    clearBallRoot(ballRoot);
  });

  const legs = buildDirectedLegs(svg, wireCtx);
  if (legs.length === 0) return;

  const total = randInt(rng, TOTAL_BALL_MIN, TOTAL_BALL_MAX);
  for (let i = 0; i < total; i++) {
    const circle = createTrailCircle(rand(rng, BALL_R_MIN, BALL_R_MAX));
    circle.setAttribute("opacity", "1");
    runBallLeg(circle, legs, rng);
  }
}

function mountReducedMotionBalls(
  path: SVGPathElement,
  ballRoot: SVGGElement,
  svg: SVGSVGElement,
  wireId: string,
  dashRestore: string,
): void {
  clearBallRoot(ballRoot);
  path.setAttribute("stroke-dasharray", dashRestore);
  path.setAttribute("stroke-dashoffset", "0");

  const fallbacks = REDUCED_FALLBACK_BY_WIRE[wireId] ?? [{ cx: 0, cy: 0 }];
  const r = (BALL_R_MIN + BALL_R_MAX) / 2;

  fallbacks.forEach((pt) => {
    const loc = stagePointToPathLocal(path, svg, pt.cx, pt.cy);
    const circle = createTrailCircle(r);
    circle.setAttribute("opacity", "1");
    circle.setAttribute("cx", String(loc.x));
    circle.setAttribute("cy", String(loc.y));
    ballRoot.appendChild(circle);
  });
}

export function OrgConnections() {
  const rootRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = rootRef.current;
      if (!svg || typeof window === "undefined") return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const wireCtx = ORG_WIRES_WITH_BALLS.map((wire) => {
        const g = svg.querySelector<SVGGElement>(`g[data-node-id="${wire.dataNodeId}"]`);
        const path = g?.querySelector<SVGPathElement>("path.home-org-diagram__wire") ?? null;
        const ballRoot = g?.querySelector<SVGGElement>("[data-org-ball-root]") ?? null;
        return { wireId: wire.dataNodeId, path, ballRoot };
      }).filter((c): c is { wireId: string; path: SVGPathElement; ballRoot: SVGGElement } =>
        Boolean(c.path && c.ballRoot),
      );

      if (wireCtx.length === 0) return;

      const dashRestore = readDashPatternFromDom(wireCtx[0]!.path);

      const cleanup = () => {
        st?.kill();
        svg.querySelectorAll<SVGCircleElement>("circle[data-org-trail-ball]").forEach((c) => {
          gsap.killTweensOf(c);
        });
        wireCtx.forEach(({ ballRoot }) => {
          gsap.killTweensOf(ballRoot.querySelectorAll("circle"));
          clearBallRoot(ballRoot);
        });
      };

      let st: ScrollTrigger | undefined;

      if (reduced) {
        wireCtx.forEach(({ path, ballRoot, wireId }) => {
          mountReducedMotionBalls(path, ballRoot, svg, wireId, dashRestore);
        });
        return cleanup;
      }

      st = ScrollTrigger.create({
        trigger: svg,
        start: "top 80%",
        once: true,
        onEnter: () => {
          svg.querySelectorAll<SVGCircleElement>("circle[data-org-trail-ball]").forEach((c) => {
            gsap.killTweensOf(c);
          });
          wireCtx.forEach(({ ballRoot }) => {
            gsap.killTweensOf(ballRoot.querySelectorAll("circle"));
            clearBallRoot(ballRoot);
          });
          const rng = () => Math.random();
          startBallTraffic(svg, wireCtx, rng);
        },
      });

      return cleanup;
    },
    { scope: rootRef },
  );

  return (
    <svg
      ref={rootRef}
      className="home-org-diagram__svg home-org-diagram__svg--org-connections"
      viewBox="0 0 1136 706"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      {ORG_DEPT_WIRES.map((wire) => (
        <g key={wire.dataNodeId} data-node-id={wire.dataNodeId} data-org-anim="dept" transform={orgWireGroupTransform(wire)}>
          <path
            className="home-org-diagram__wire"
            d={wire.d}
            vectorEffect={wire.vectorStroke ? "nonScalingStroke" : undefined}
          />
          <g data-org-ball-root aria-hidden />
        </g>
      ))}
      <g data-node-id={ORG_WIRE_FOUNDER_PANCAKE.dataNodeId} transform={orgWireGroupTransform(ORG_WIRE_FOUNDER_PANCAKE)}>
        <path
          className="home-org-diagram__wire"
          d={ORG_WIRE_FOUNDER_PANCAKE.d}
          vectorEffect={ORG_WIRE_FOUNDER_PANCAKE.vectorStroke ? "nonScalingStroke" : undefined}
        />
        <g data-org-ball-root aria-hidden />
      </g>
    </svg>
  );
}
