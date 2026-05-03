/**
 * Org diagram wires — Figma `428:14926` (`get_design_context` MCP).
 * • Monster → Growth / Engineering / Operations (Vectors 211, 215, 213).
 * • Founder avatar → Pancake (Vector `428:14936` — path `d` + viewBox from MCP SVG export `edc0ef0d-43db-4bd5-ac41-ff981381a5c8`).
 * Static only. Rotated-inner wrappers match Figma `-rotate-90` + inner `w×h` boxes.
 */

type OrgWireFrame = { x: number; y: number; w: number; h: number };

type OrgTransformedWire = {
  dataNodeId: string;
  pathIdSuffix: string;
  vbW: number;
  vbH: number;
  d: string;
  frame: OrgWireFrame;
  vectorStroke: boolean;
  /**
   * Default: `translate(frame) scale(frame.w/vbW, frame.h/vbH)`.
   * `growth211`: outer `508.672×171` @ `(206,113)`, inner `171×508.672`, `rotate(-90)` (`428:14927`).
   * `vector210`: outer `118.5×15.135` @ `(492.5,21.87)`, inner `15.135×118.5`, `rotate(-90)` (`428:14936`).
   */
  transformMode?: "growth211" | "vector210";
};

/** Vector 211 — Figma `428:14927`. */
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

/** Vector 215 — Figma `428:14928`. */
const ORG_WIRE_OPERATIONS: OrgTransformedWire = {
  dataNodeId: "428:14928",
  pathIdSuffix: "operations",
  vbW: 160.501,
  vbH: 149.501,
  d: "M159 148C138.5 92.0004 46.0004 21.0004 1.50038 1.50038",
  frame: { x: 731, y: 91, w: 146.5, h: 157.5 },
  vectorStroke: false,
};

/** Vector 213 — Figma `428:14937`. */
const ORG_WIRE_ENGINEERING: OrgTransformedWire = {
  dataNodeId: "428:14937",
  pathIdSuffix: "engineering",
  vbW: 177.412,
  vbH: 209,
  d: "M152.086 1.5C255.086 104.5 -9.91415 143.5 1.58568 207.5",
  frame: { x: 574.14, y: 102, w: 174.691, h: 206 },
  vectorStroke: true,
};

/**
 * Vector 210 — Figma `428:14936`; outer `left-[492.5px] top-[21.87px] w-[118.5px] h-[15.135px]`, inner `w-[15.135px] h-[118.5px]`.
 * Path + viewBox from MCP SVG asset (stroke color uses `.home-org-diagram__wire` token, not export `#9A818F`).
 */
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

/** Paint order: dept wires (Figma stack), then founder → Pancake on top (`428:14926` DOM order). */
const ORG_WIRES_PAINT_ORDER: readonly OrgTransformedWire[] = [
  ORG_WIRE_GROWTH,
  ORG_WIRE_OPERATIONS,
  ORG_WIRE_ENGINEERING,
  ORG_WIRE_FOUNDER_PANCAKE,
];

function orgWireTransform(frame: OrgWireFrame, vbW: number, vbH: number): string {
  const sx = frame.w / vbW;
  const sy = frame.h / vbH;
  return `translate(${frame.x} ${frame.y}) scale(${sx} ${sy})`;
}

/** Figma `-rotate-90` wrapper: map viewBox into `innerW×innerH`, center, rotate −90°, place in `frame`. */
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

/** Figma `428:16765` — `left-[500px] top-[22px] size-[12px]` (Vector 210 flow node). */
const DOT_FOUNDER_PANCAKE = { "data-node-id": "428:16765" as const, cx: 506, cy: 28, r: 6 };

/** Figma `428:16779` — `left-[324px] top-[195px] size-[12px]`. */
const DOT_GROWTH = { "data-node-id": "428:16779" as const, cx: 330, cy: 201, r: 6 };

/** Figma `428:16781` / `428:16787` / `428:16789`. */
const DOTS_ENGINEERING = [
  { "data-node-id": "428:16781" as const, cx: 526, cy: 187, r: 3 },
  { "data-node-id": "428:16787" as const, cx: 656, cy: 173, r: 4 },
  { "data-node-id": "428:16789" as const, cx: 602, cy: 266, r: 4 },
] as const;

/** Figma `428:16783` / `428:16793`. */
const DOTS_OPERATIONS = [
  { "data-node-id": "428:16783" as const, cx: 724, cy: 192, r: 3 },
  { "data-node-id": "428:16793" as const, cx: 828, cy: 173, r: 6 },
] as const;

export function OrgConnections() {
  return (
    <svg
      className="home-org-diagram__svg home-org-diagram__svg--org-connections"
      viewBox="0 0 1136 706"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      {ORG_WIRES_PAINT_ORDER.map((wire) => (
        <g key={wire.dataNodeId} data-node-id={wire.dataNodeId} transform={orgWireGroupTransform(wire)}>
          <path
            className="home-org-diagram__wire"
            d={wire.d}
            vectorEffect={wire.vectorStroke ? "nonScalingStroke" : undefined}
          />
        </g>
      ))}
      <g className="home-org-diagram__flow-nodes" aria-hidden>
        <circle className="home-org-diagram__flow-node" {...DOT_FOUNDER_PANCAKE} />
        <circle className="home-org-diagram__flow-node" {...DOT_GROWTH} />
        {DOTS_ENGINEERING.map((d) => (
          <circle key={d["data-node-id"]} className="home-org-diagram__flow-node" {...d} />
        ))}
        {DOTS_OPERATIONS.map((d) => (
          <circle key={d["data-node-id"]} className="home-org-diagram__flow-node" {...d} />
        ))}
      </g>
    </svg>
  );
}
