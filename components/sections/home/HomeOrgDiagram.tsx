/**
 * Org diagram under “An entire org working for you” — Figma `428:14926` (1136×706).
 * Built from semantic tokens + MCP `get_design_context` / `get_variable_defs` (no raster for this block).
 */

import { useId } from "react";

type OrgRowStatus = "positive" | "warning" | "negative";

type OrgRow = { label: string; status: OrgRowStatus };

type OrgDept = {
  title: string;
  surface: "growth" | "engineering" | "operations";
  rows: OrgRow[];
};

const ORG_DEPTS: OrgDept[] = [
  {
    title: "Growth",
    surface: "growth",
    rows: [
      { label: "Copywriter", status: "positive" },
      { label: "Ad Manager", status: "warning" },
      { label: "Social Media Manager", status: "negative" },
      { label: "Email Marketer", status: "positive" },
    ],
  },
  {
    title: "Engineering",
    surface: "engineering",
    rows: [
      { label: "Full-stack Engineer", status: "positive" },
      { label: "DevOps", status: "positive" },
      { label: "Performance Monitor", status: "negative" },
      { label: "QA Tester", status: "positive" },
    ],
  },
  {
    title: "Operations",
    surface: "operations",
    rows: [
      { label: "Scheduling", status: "positive" },
      { label: "Recruiting Screener", status: "warning" },
      { label: "Invoicing", status: "positive" },
      { label: "Customer Support", status: "positive" },
    ],
  },
];

/** Figma `428:14929` / `428:14930` — path `d` from MCP SVG asset (same geometry; placement + rotation per node). */
const CHIP_CONNECTOR_PATH_D =
  "M55.8696 1.00009C34.5611 3.32492 13.6236 11.213 1 22.0334M14.2597 23.8502C9.07792 22.3178 6.17345 22.206 1 22.0334C2.96911 16.9411 4.3971 14.3004 7.21321 9.75729";

const CHIP_ARROW_VB_W = 56.8697;
const CHIP_ARROW_VB_H = 24.8505;
const CHIP_ARROW_CX = CHIP_ARROW_VB_W / 2;
const CHIP_ARROW_CY = CHIP_ARROW_VB_H / 2;

/** Figma `get_design_context` wrapper frames (Vector 264 / 265), not Dev metadata bbox. */
const V264_WRAPPER = { x: 744, y: 22.53125, w: 58.07, h: 32.288 };
const V265_WRAPPER = { x: 312.96, y: 77.82, w: 54.87, h: 22.85 };
const V_PATH_INNER_W = 54.86962890625;
const V_PATH_INNER_H = 22.850130081176758;
const V264_INNER_OFFSET_X = (V264_WRAPPER.w - V_PATH_INNER_W) / 2;
const V264_INNER_OFFSET_Y = (V264_WRAPPER.h - V_PATH_INNER_H) / 2;
const CHIP_ARROW_SX = V_PATH_INNER_W / CHIP_ARROW_VB_W;
const CHIP_ARROW_SY = V_PATH_INNER_H / CHIP_ARROW_VB_H;

/**
 * Curved dotted wires — Figma Frame `428:14926`, MCP SVG `d` + `get_metadata` frame x/y/w/h.
 * `vectorEffect="nonScalingStroke"` keeps round caps / dash rhythm readable under anisotropic `scale`.
 * Chip→chip link stays a simple stage-space segment (Vector 210 in Figma is a vertical curve squashed
 * into a short strip — rendering it with that bbox makes an unreadable smear).
 * Flow-node `cx`/`cy` are in **stage** space so circles stay round.
 */
type OrgWireFrame = { x: number; y: number; w: number; h: number };

type OrgMonsterWire = {
  dataNodeId: string;
  pathIdSuffix: string;
  vbW: number;
  vbH: number;
  d: string;
  frame: OrgWireFrame;
  /** Local viewBox coords along the curve — mapped to stage on render for round flow nodes. */
  flowLocal: ReadonlyArray<{ lx: number; ly: number }>;
};

function orgWireTransform(frame: OrgWireFrame, vbW: number, vbH: number): string {
  const sx = frame.w / vbW;
  const sy = frame.h / vbH;
  return `translate(${frame.x} ${frame.y}) scale(${sx} ${sy})`;
}

function orgWireStagePoint(frame: OrgWireFrame, vbW: number, vbH: number, lx: number, ly: number): { cx: number; cy: number } {
  return {
    cx: frame.x + (lx / vbW) * frame.w,
    cy: frame.y + (ly / vbH) * frame.h,
  };
}

const ORG_MONSTER_WIRES: readonly OrgMonsterWire[] = [
  {
    dataNodeId: "428:14927",
    pathIdSuffix: "growth",
    vbW: 174,
    vbH: 511.538,
    d: "M172.5 510C31.0004 520.5 169.5 46.5004 1.50037 1.50037",
    frame: { x: 206, y: 284, w: 508.67185943172194, h: 171.00009024587575 },
    flowLocal: [
      { lx: 150, ly: 430 },
      { lx: 72, ly: 210 },
      { lx: 18, ly: 40 },
    ],
  },
  {
    dataNodeId: "428:14937",
    pathIdSuffix: "engineering",
    vbW: 177.412,
    vbH: 209,
    d: "M152.086 1.5C255.086 104.5 -9.91415 143.5 1.58568 207.5",
    frame: { x: 574.1351928710938, y: 102, w: 174.69086593814586, h: 206.0001297062929 },
    flowLocal: [
      { lx: 138, ly: 28 },
      { lx: 78, ly: 108 },
      { lx: 12, ly: 198 },
    ],
  },
  {
    dataNodeId: "428:14928",
    pathIdSuffix: "operations",
    vbW: 160.501,
    vbH: 149.501,
    d: "M159 148C138.5 92.0004 46.0004 21.0004 1.50038 1.50038",
    frame: { x: 877.5, y: 248.5, w: 146.49999851030066, h: 157.50002806622547 },
    flowLocal: [
      { lx: 132, ly: 118 },
      { lx: 72, ly: 52 },
      { lx: 14, ly: 14 },
    ],
  },
];

export function HomeOrgDiagram() {
  const founderClipId = useId().replace(/:/g, "");
  const orgWireUid = useId().replace(/:/g, "");

  return (
    <div className="home-org-diagram">
      <div className="home-org-diagram__stage">
        <svg
          className="home-org-diagram__svg home-org-diagram__svg--wires"
          viewBox="0 0 1136 706"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          {/* Figma Vector 210 is authored in a tall local box then squashed; draw a flat dotted link in stage space instead. */}
          <path
            id={`${orgWireUid}-chip`}
            className="home-org-diagram__wire"
            d="M 488 64 L 608 64"
            data-node-id="428:14936"
            vectorEffect="nonScalingStroke"
          />
          {ORG_MONSTER_WIRES.map((wire) => (
            <g key={wire.dataNodeId} data-node-id={wire.dataNodeId} transform={orgWireTransform(wire.frame, wire.vbW, wire.vbH)}>
              <path
                id={`${orgWireUid}-${wire.pathIdSuffix}`}
                className="home-org-diagram__wire"
                d={wire.d}
                vectorEffect="nonScalingStroke"
              />
            </g>
          ))}
          <g className="home-org-diagram__flow-nodes" aria-hidden>
            {ORG_MONSTER_WIRES.flatMap((wire) =>
              wire.flowLocal.map((pt, i) => {
                const { cx, cy } = orgWireStagePoint(wire.frame, wire.vbW, wire.vbH, pt.lx, pt.ly);
                return (
                  <circle
                    key={`${wire.dataNodeId}-${i}`}
                    className="home-org-diagram__flow-node"
                    data-wire={wire.pathIdSuffix}
                    cx={cx}
                    cy={cy}
                    r={4}
                  />
                );
              }),
            )}
          </g>
        </svg>

        <div
          className="home-org-diagram__you-chip home-org-diagram__abs"
          data-node-id="596:1685"
          aria-label="You, the founder"
        >
          <svg
            className="home-org-diagram__chip-svg--bg"
            viewBox="0 0 101 55"
            width={101}
            height={55}
            aria-hidden
            focusable="false"
          >
            <rect className="home-org-diagram__chip-svg-bg" width="101" height="55" rx="12" />
          </svg>
          <div className="home-org-diagram__chip-copy">
            <p className="home-org-diagram__chip-title home-org-diagram__chip-title--inverted">You</p>
            <p className="home-org-diagram__chip-sub home-org-diagram__chip-sub--inverted">The founder</p>
          </div>
        </div>

        <div className="home-org-diagram__pancake-chip home-org-diagram__abs" data-node-id="428:14941">
          <div className="home-org-diagram__chip-copy">
            <p className="home-org-diagram__chip-title home-org-diagram__chip-title--inverted">Pancake</p>
            <p className="home-org-diagram__chip-sub home-org-diagram__chip-sub--inverted home-org-diagram__chip-sub--nowrap">
              Your co-founder
            </p>
          </div>
        </div>

        <svg
          className="home-org-diagram__svg home-org-diagram__svg--chip-arrows"
          viewBox="0 0 1136 706"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          {/* Vector 264 / 265 — `d` from MCP SVG; wrapper x/y from get_design_context (not metadata bbox). */}
          <g transform={`translate(${V264_WRAPPER.x} ${V264_WRAPPER.y}) translate(${V264_INNER_OFFSET_X} ${V264_INNER_OFFSET_Y})`}>
            <g transform={`scale(${CHIP_ARROW_SX} ${CHIP_ARROW_SY}) rotate(10.29 ${CHIP_ARROW_CX} ${CHIP_ARROW_CY})`}>
              <path className="home-org-diagram__chip-arrow-path" d={CHIP_CONNECTOR_PATH_D} />
            </g>
          </g>
          <g transform={`translate(${V265_WRAPPER.x} ${V265_WRAPPER.y})`}>
            <g transform={`scale(${CHIP_ARROW_SX} ${CHIP_ARROW_SY}) rotate(180 ${CHIP_ARROW_CX} ${CHIP_ARROW_CY})`}>
              <path className="home-org-diagram__chip-arrow-path" d={CHIP_CONNECTOR_PATH_D} />
            </g>
          </g>
        </svg>

        <div className="home-org-diagram__you-avatar home-org-diagram__abs" aria-hidden data-node-id="428:14931">
          {/* Figma Frame 109 — vector group from MCP SVG asset (`get_design_context`); fills → palette tokens. */}
          <svg
            className="home-org-diagram__founder-avatar-svg"
            viewBox="0 0 108 108"
            preserveAspectRatio="xMidYMid meet"
            width={108}
            height={108}
          >
            <title>You</title>
            <g clipPath={`url(#${founderClipId})`}>
              <rect width="108" height="108" rx="54" fill="var(--palette-purple-10)" />
              <path
                d="M70.7992 43.5975C72.1483 59.1754 65.1894 74.0014 49.5981 75.4872C33.9421 76.979 24.4667 63.8761 23.1042 48.1425C21.7417 32.4089 28.8112 17.7294 44.4672 16.2375C60.0585 14.7517 69.4502 28.0197 70.7992 43.5975Z"
                fill="var(--palette-purple-30)"
              />
              <path
                d="M59.8224 148.311C38.4258 154.044 16.024 148.002 10.0967 126.621C4.14489 105.151 20.08 88.6935 41.6905 82.903C63.301 77.1125 85.5258 83.3447 91.4776 104.815C97.4049 126.196 81.2189 142.578 59.8224 148.311Z"
                fill="var(--palette-purple-30)"
              />
              <path
                d="M47.6222 46.0657C47.9529 49.8841 46.5381 53.4905 43.2713 53.8018C39.991 54.1144 37.9628 50.8745 37.6288 47.018C37.2949 43.1614 38.7333 39.5912 42.0136 39.2786C45.2805 38.9673 47.2916 42.2472 47.6222 46.0657Z"
                fill="var(--palette-chrome-100)"
              />
              <path
                d="M64.9917 43.682C65.2504 46.6698 64.1434 49.4918 61.5872 49.7354C59.0204 49.98 57.4334 47.4449 57.1721 44.4272C56.9107 41.4095 58.0363 38.6159 60.6031 38.3713C63.1593 38.1277 64.7329 40.6942 64.9917 43.682Z"
                fill="var(--palette-chrome-100)"
              />
            </g>
            <defs>
              <clipPath id={founderClipId}>
                <rect width="108" height="108" rx="54" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="home-org-diagram__monster home-org-diagram__abs" data-node-id="428:15009">
          {/* eslint-disable-next-line @next/next/no-img-element -- static mascot asset; sized to Figma 128² */}
          <img className="home-org-diagram__monster-img" src="/pancake-monster.png" alt="" width={128} height={128} decoding="async" />
        </div>

        {ORG_DEPTS.map((dept) => (
          <article
            key={dept.title}
            className={`home-org-diagram__dept home-org-diagram__dept--${dept.surface} home-org-diagram__abs`}
          >
            <h3 className="home-org-diagram__dept-title">{dept.title}</h3>
            <div className="home-org-diagram__rows">
              {dept.rows.map((row) => (
                <div key={row.label} className="home-org-diagram__row">
                  <span className={`home-org-diagram__dot home-org-diagram__dot--${row.status}`} aria-hidden />
                  <span className="home-org-diagram__row-label">{row.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
