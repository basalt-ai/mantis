"use client";

/**
 * Org diagram wires — Figma `428:14926` (`get_design_context` MCP).
 * • Monster → Growth / Engineering / Operations: scroll draw + looping dot motion (GSAP).
 * • Founder → Pancake (Vector 210): static.
 */

import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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

const DOT_FOUNDER_PANCAKE = { "data-node-id": "428:16765" as const, cx: 506, cy: 28, r: 6 };

type DeptDotDef = { readonly "data-node-id": string; readonly r: number; readonly figmaCx: number; readonly figmaCy: number };

const DEPT_DOTS: Record<string, readonly DeptDotDef[]> = {
  "428:14927": [{ "data-node-id": "428:16779", r: 6, figmaCx: 330, figmaCy: 201 }],
  "428:14937": [
    { "data-node-id": "428:16781", r: 3, figmaCx: 526, figmaCy: 187 },
    { "data-node-id": "428:16787", r: 4, figmaCx: 656, figmaCy: 173 },
    { "data-node-id": "428:16789", r: 4, figmaCx: 602, figmaCy: 266 },
  ],
  "428:14928": [
    { "data-node-id": "428:16783", r: 3, figmaCx: 724, figmaCy: 192 },
    { "data-node-id": "428:16793", r: 6, figmaCx: 828, figmaCy: 173 },
  ],
};

const STAGE_DRAW_DURATION = 1.25;
const STAGE_PATH_STAGGER = 0.15;
const DOT_CLUSTER_GAP = 0.05;
const TRIP_DURATION = 2.5;
const PAUSE_AT_BLOCK = 0.35;
const PAUSE_AT_MONSTER = 0.3;
const FADE_IN = 0.2;
const FADE_OUT = 0.25;
const CYCLE_STAGGER = 0.5;

function stagePointToPathLocal(path: SVGPathElement, root: SVGSVGElement, x: number, y: number): { x: number; y: number } {
  const p = root.createSVGPoint();
  p.x = x;
  p.y = y;
  const pathCtm = path.getCTM();
  const rootCtm = root.getCTM();
  if (!pathCtm || !rootCtm) return { x, y };
  return p.matrixTransform(pathCtm.inverse().multiply(rootCtm));
}

function setDotsAlongPath(
  path: SVGPathElement,
  circles: SVGCircleElement[],
  pathLen: number,
  progress: number,
  clusterGap: number,
): void {
  circles.forEach((dot, i) => {
    const localP = gsap.utils.clamp(0, 1, progress - i * clusterGap);
    const pt = path.getPointAtLength(localP * pathLen);
    dot.setAttribute("cx", String(pt.x));
    dot.setAttribute("cy", String(pt.y));
  });
}

function applyFigmaDotPositionsLocal(
  path: SVGPathElement,
  root: SVGSVGElement,
  circles: SVGCircleElement[],
  defs: readonly DeptDotDef[],
): void {
  defs.forEach((d, i) => {
    const loc = stagePointToPathLocal(path, root, d.figmaCx, d.figmaCy);
    circles[i]?.setAttribute("cx", String(loc.x));
    circles[i]?.setAttribute("cy", String(loc.y));
  });
}

function readDashPatternFromDom(path: SVGPathElement): string {
  return getComputedStyle(path).strokeDasharray || "1 12";
}

function buildDeptLoopTimeline(path: SVGPathElement, circles: SVGCircleElement[]): gsap.core.Timeline {
  const len = path.getTotalLength();
  const forward = { p: 0 };
  const back = { p: 1 };
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });

  tl.call(() => setDotsAlongPath(path, circles, len, 0, DOT_CLUSTER_GAP));
  tl.set(circles, { opacity: 0 });
  tl.to(circles, { opacity: 1, duration: FADE_IN, stagger: 0.03 });
  tl.fromTo(
    forward,
    { p: 0 },
    {
      p: 1,
      duration: TRIP_DURATION,
      onUpdate: () => setDotsAlongPath(path, circles, len, forward.p, DOT_CLUSTER_GAP),
    },
  );
  tl.to(circles, { opacity: 0, duration: FADE_OUT, stagger: 0.02 });
  tl.to({}, { duration: PAUSE_AT_BLOCK });
  tl.call(() => setDotsAlongPath(path, circles, len, 1, DOT_CLUSTER_GAP));
  tl.set(circles, { opacity: 0 });
  tl.to(circles, { opacity: 1, duration: FADE_IN, stagger: 0.03 });
  tl.fromTo(
    back,
    { p: 1 },
    {
      p: 0,
      duration: TRIP_DURATION,
      onUpdate: () => setDotsAlongPath(path, circles, len, back.p, DOT_CLUSTER_GAP),
    },
  );
  tl.to(circles, { opacity: 0, duration: FADE_OUT, stagger: 0.02 });
  tl.to({}, { duration: PAUSE_AT_MONSTER });

  return tl;
}

export function OrgConnections() {
  const rootRef = useRef<SVGSVGElement>(null);
  const loopTimelinesRef = useRef<gsap.core.Timeline[]>([]);

  useGSAP(
    () => {
      const svg = rootRef.current;
      if (!svg || typeof window === "undefined") return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const deptCtx = ORG_DEPT_WIRES.map((wire) => {
        const g = svg.querySelector<SVGGElement>(`g[data-node-id="${wire.dataNodeId}"]`);
        const path = g?.querySelector<SVGPathElement>("path.home-org-diagram__wire") ?? null;
        const defs = DEPT_DOTS[wire.dataNodeId] ?? [];
        const circles = defs
          .map((d) => g?.querySelector<SVGCircleElement>(`circle[data-node-id="${d["data-node-id"]}"]`) ?? null)
          .filter(Boolean) as SVGCircleElement[];
        return { path, circles, defs };
      }).filter((c): c is { path: SVGPathElement; circles: SVGCircleElement[]; defs: readonly DeptDotDef[] } => Boolean(c.path && c.circles.length > 0));

      if (deptCtx.length === 0) return;

      const dashRestore = readDashPatternFromDom(deptCtx[0]!.path);

      if (reduced) {
        deptCtx.forEach(({ path, circles, defs }) => {
          applyFigmaDotPositionsLocal(path, svg, circles, defs);
          gsap.set(circles, { opacity: 1 });
          path.setAttribute("stroke-dasharray", dashRestore);
          path.setAttribute("stroke-dashoffset", "0");
        });
        return;
      }

      gsap.set(
        deptCtx.flatMap((c) => c.circles),
        { opacity: 0 },
      );

      const st = ScrollTrigger.create({
        trigger: svg,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const drawTl = gsap.timeline();

          deptCtx.forEach(({ path }, index) => {
            const pl = path.getTotalLength();
            const pos = index * STAGE_PATH_STAGGER;

            drawTl.fromTo(
              path,
              { strokeDashoffset: pl },
              {
                strokeDashoffset: 0,
                duration: STAGE_DRAW_DURATION,
                ease: "none",
                immediateRender: false,
                onStart: () => {
                  path.setAttribute("stroke-dasharray", `${pl} ${pl}`);
                  path.setAttribute("stroke-dashoffset", String(pl));
                },
                onComplete: () => {
                  path.setAttribute("stroke-dasharray", dashRestore);
                  path.setAttribute("stroke-dashoffset", "0");
                },
              },
              pos,
            );
          });

          drawTl.eventCallback("onComplete", () => {
            loopTimelinesRef.current.forEach((t) => t.kill());
            loopTimelinesRef.current = [];
            deptCtx.forEach(({ path, circles }, i) => {
              const lt = buildDeptLoopTimeline(path, circles);
              lt.delay(i * CYCLE_STAGGER);
              loopTimelinesRef.current.push(lt);
              lt.play(0);
            });
          });

          drawTl.play(0);
        },
      });

      return () => {
        st.kill();
        loopTimelinesRef.current.forEach((t) => t.kill());
        loopTimelinesRef.current = [];
      };
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
          {(DEPT_DOTS[wire.dataNodeId] ?? []).map((d) => (
            <circle
              key={d["data-node-id"]}
              className="home-org-diagram__flow-node"
              data-node-id={d["data-node-id"]}
              r={d.r}
              cx={0}
              cy={0}
            />
          ))}
        </g>
      ))}
      <g data-node-id={ORG_WIRE_FOUNDER_PANCAKE.dataNodeId} transform={orgWireGroupTransform(ORG_WIRE_FOUNDER_PANCAKE)}>
        <path
          className="home-org-diagram__wire"
          d={ORG_WIRE_FOUNDER_PANCAKE.d}
          vectorEffect={ORG_WIRE_FOUNDER_PANCAKE.vectorStroke ? "nonScalingStroke" : undefined}
        />
      </g>
      <g className="home-org-diagram__flow-nodes" aria-hidden>
        <circle className="home-org-diagram__flow-node" {...DOT_FOUNDER_PANCAKE} />
      </g>
    </svg>
  );
}
