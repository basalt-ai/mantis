"use client";

/**
 * Org diagram wires — Figma `428:14926` (`get_design_context` MCP).
 * • Monster → Growth / Engineering / Operations + Founder → Pancake: static dashed paths;
 *   each wire gets an independent random “traffic” of balls (count, radius, speed, ease, direction, segment).
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

/** All wires that carry chaotic ball traffic (depts + human↔Pancake). */
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
const DEPT_BALL_COUNT_MIN = 4;
const DEPT_BALL_COUNT_MAX = 11;
const FOUNDER_BALL_COUNT_MIN = 2;
const FOUNDER_BALL_COUNT_MAX = 7;
const DURATION_MIN = 1.05;
const DURATION_MAX = 6.2;

const EASE_POOL = ["none", "power1.inOut", "power2.inOut", "sine.inOut", "power1.out", "power1.in", "power2.out"] as const;

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
  c.setAttribute("vectorEffect", "nonScalingStroke");
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

type BallMotionSpec = {
  r: number;
  duration: number;
  ease: string;
  yoyo: boolean;
  /** When false, progress 1→0 is used on the path (opposite sense to forward). */
  forward: boolean;
  delay: number;
  /** If true, oscillate only between segA and segB on the wire (shuttle). */
  shuttle: boolean;
  segA: number;
  segB: number;
  /** Initial normalized position along active segment. */
  startU: number;
};

function buildRandomSpecs(rng: () => number, count: number): BallMotionSpec[] {
  const specs: BallMotionSpec[] = [];
  for (let i = 0; i < count; i++) {
    const shuttle = rng() < 0.38;
    let segA = 0;
    let segB = 1;
    if (shuttle) {
      segA = rand(rng, 0, 0.55);
      segB = Math.min(1, segA + rand(rng, 0.22, 0.75));
      if (segB - segA < 0.12) segB = Math.min(1, segA + 0.35);
    }
    specs.push({
      r: rand(rng, BALL_R_MIN, BALL_R_MAX),
      duration: rand(rng, DURATION_MIN, DURATION_MAX),
      ease: pickEase(rng),
      yoyo: rng() < 0.62,
      forward: rng() < 0.52,
      delay: rand(rng, 0, 2.4),
      shuttle,
      segA,
      segB,
      startU: rand(rng, 0, 1),
    });
  }
  return specs;
}

function placeBallOnPath(
  path: SVGPathElement,
  pathLen: number,
  u: number,
  forward: boolean,
  shuttle: boolean,
  segA: number,
  segB: number,
  circle: SVGCircleElement,
): void {
  let t = u;
  if (shuttle) {
    t = segA + (segB - segA) * t;
  }
  t = gsap.utils.clamp(0, 1, t);
  const along = forward ? t : 1 - t;
  const pt = path.getPointAtLength(along * pathLen);
  circle.setAttribute("cx", String(pt.x));
  circle.setAttribute("cy", String(pt.y));
}

function startChaoticWire(path: SVGPathElement, ballRoot: SVGGElement, wireId: string, rng: () => number): gsap.core.Tween[] {
  const pathLen = path.getTotalLength();
  const isFounder = wireId === ORG_WIRE_FOUNDER_PANCAKE.dataNodeId;
  const nMin = isFounder ? FOUNDER_BALL_COUNT_MIN : DEPT_BALL_COUNT_MIN;
  const nMax = isFounder ? FOUNDER_BALL_COUNT_MAX : DEPT_BALL_COUNT_MAX;
  const count = randInt(rng, nMin, nMax);
  const specs = buildRandomSpecs(rng, count);
  const tweens: gsap.core.Tween[] = [];

  clearBallRoot(ballRoot);

  specs.forEach((spec) => {
    const circle = createTrailCircle(spec.r);
    ballRoot.appendChild(circle);
    gsap.set(circle, { opacity: rand(rng, 0.75, 1) });

    const proxy = { u: spec.startU };
    const tick = () => {
      placeBallOnPath(path, pathLen, proxy.u, spec.forward, spec.shuttle, spec.segA, spec.segB, circle);
    };

    const tw = gsap.fromTo(
      proxy,
      { u: spec.startU },
      {
        u: 1,
        duration: spec.duration,
        ease: spec.ease,
        repeat: -1,
        yoyo: spec.yoyo,
        delay: spec.delay,
        immediateRender: true,
        onUpdate: tick,
      },
    );

    tick();

    if (rng() < 0.32) {
      const breathe = gsap.to(circle, {
        opacity: rand(rng, 0.45, 0.92),
        duration: rand(rng, 0.55, 1.9),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: rand(rng, 0, 1.2),
      });
      tweens.push(breathe);
    }

    tweens.push(tw);
  });

  return tweens;
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
    circle.setAttribute("cx", String(loc.x));
    circle.setAttribute("cy", String(loc.y));
    ballRoot.appendChild(circle);
  });
}

export function OrgConnections() {
  const rootRef = useRef<SVGSVGElement>(null);
  const ballTweensRef = useRef<gsap.core.Tween[]>([]);

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
        ballTweensRef.current.forEach((t) => t.kill());
        ballTweensRef.current = [];
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
          ballTweensRef.current.forEach((t) => t.kill());
          ballTweensRef.current = [];
          const rng = () => Math.random();

          wireCtx.forEach(({ path, ballRoot, wireId }) => {
            const tweens = startChaoticWire(path, ballRoot, wireId, rng);
            ballTweensRef.current.push(...tweens);
          });
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
