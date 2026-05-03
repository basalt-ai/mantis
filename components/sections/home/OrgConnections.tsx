/**
 * Monster → Growth / Engineering / Operations dotted Béziers — Figma `428:14926` (`get_design_context` MCP).
 * Static only. Frame positions + flow-dot centers from latest MCP codegen (node ids on circles).
 * Path `d` / viewBoxes / `vectorEffect` match prior MCP SVG exports baked in `HomeOrgDiagram` (asset fetch 500 in-session).
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
   * `growth211`: Figma wraps Vector 211 in `-rotate-90` with inner box `171×508.672` inside outer `508.672×171` (`428:14927`).
   */
  transformMode?: "growth211";
};

/** Vector 211 — Figma `428:14927`; wrapper from MCP Frame 76 (`left-[206px] top-[113px] w-[508.672px] h-[171px]`). */
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

/** Vector 215 — Figma `428:14928`; wrapper `left-[731px] top-[91px] w-[146.5px] h-[157.5px]`. */
const ORG_WIRE_OPERATIONS: OrgTransformedWire = {
  dataNodeId: "428:14928",
  pathIdSuffix: "operations",
  vbW: 160.501,
  vbH: 149.501,
  d: "M159 148C138.5 92.0004 46.0004 21.0004 1.50038 1.50038",
  frame: { x: 731, y: 91, w: 146.5, h: 157.5 },
  vectorStroke: false,
};

/** Vector 213 — Figma `428:14937`; wrapper `left-[574.14px] top-[102px] w-[174.691px] h-[206px]`. */
const ORG_WIRE_ENGINEERING: OrgTransformedWire = {
  dataNodeId: "428:14937",
  pathIdSuffix: "engineering",
  vbW: 177.412,
  vbH: 209,
  d: "M152.086 1.5C255.086 104.5 -9.91415 143.5 1.58568 207.5",
  frame: { x: 574.14, y: 102, w: 174.691, h: 206 },
  vectorStroke: true,
};

const ORG_WIRES_PAINT_ORDER: readonly OrgTransformedWire[] = [ORG_WIRE_GROWTH, ORG_WIRE_OPERATIONS, ORG_WIRE_ENGINEERING];

function orgWireTransform(frame: OrgWireFrame, vbW: number, vbH: number): string {
  const sx = frame.w / vbW;
  const sy = frame.h / vbH;
  return `translate(${frame.x} ${frame.y}) scale(${sx} ${sy})`;
}

/**
 * Vector 211 — Figma MCP Frame `428:14926`: outer `left-[206px] top-[113px] w-[508.672px] h-[171px]`,
 * child `-rotate-90`, inner `w-[171px] h-[508.672px]` (`428:14927`). Maps vb `174×511.538` → inner, centers, rotates −90°, places in outer.
 */
function orgWireTransformGrowth211(wire: OrgTransformedWire): string {
  const { frame, vbW, vbH } = wire;
  const innerW = 171;
  const innerH = 508.672;
  const sx = innerW / vbW;
  const sy = innerH / vbH;
  const cx = frame.x + frame.w / 2;
  const cy = frame.y + frame.h / 2;
  return `translate(${cx} ${cy}) rotate(-90) translate(${-innerW / 2} ${-innerH / 2}) scale(${sx} ${sy})`;
}

function orgWireGroupTransform(wire: OrgTransformedWire): string {
  if (wire.transformMode === "growth211") return orgWireTransformGrowth211(wire);
  return orgWireTransform(wire.frame, wire.vbW, wire.vbH);
}

/** Figma `428:16779` — `left-[324px] top-[195px] size-[12px]` → center + r. */
const DOT_GROWTH = { "data-node-id": "428:16779" as const, cx: 330, cy: 201, r: 6 };

/** Figma `428:16781` / `428:16787` / `428:16789` — engineering path markers (6px / 8px / 8px squares). */
const DOTS_ENGINEERING = [
  { "data-node-id": "428:16781" as const, cx: 526, cy: 187, r: 3 },
  { "data-node-id": "428:16787" as const, cx: 656, cy: 173, r: 4 },
  { "data-node-id": "428:16789" as const, cx: 602, cy: 266, r: 4 },
] as const;

/** Figma `428:16783` / `428:16793` — operations path markers (6px / 12px). */
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
