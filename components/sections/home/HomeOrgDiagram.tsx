/**
 * Org diagram under “An entire org working for you” — Figma `428:14926` (1136×706).
 * Built from semantic tokens + MCP `get_design_context` / `get_variable_defs` (no raster for this block).
 */

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

export function HomeOrgDiagram() {
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
          <path
            className="home-org-diagram__wire"
            d="M 488 64 L 608 64"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            className="home-org-diagram__wire"
            d="M 672 118 C 672 200 520 240 184 290"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            className="home-org-diagram__wire"
            d="M 672 118 C 672 210 672 260 568 320"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            className="home-org-diagram__wire"
            d="M 672 118 C 672 200 820 230 952 264"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="home-org-diagram__svg home-org-diagram__svg--chip-arrows"
          viewBox="0 0 1136 706"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          {/* Figma Vector 264 / 265 — path `d` from MCP SVG asset; placement from get_metadata. */}
          <g transform="translate(748.08349609375 22.53125)">
            <g
              transform={`scale(${58.069882756178686 / CHIP_ARROW_VB_W} ${32.28807110419939 / CHIP_ARROW_VB_H}) rotate(10.29 ${CHIP_ARROW_CX} ${CHIP_ARROW_CY})`}
            >
              <path className="home-org-diagram__chip-arrow-path" d={CHIP_CONNECTOR_PATH_D} />
            </g>
          </g>
          <g transform="translate(367.83245849609375 100.675048828125)">
            <g
              transform={`scale(${54.86962890625 / CHIP_ARROW_VB_W} ${22.850130081176758 / CHIP_ARROW_VB_H}) rotate(180 ${CHIP_ARROW_CX} ${CHIP_ARROW_CY})`}
            >
              <path className="home-org-diagram__chip-arrow-path" d={CHIP_CONNECTOR_PATH_D} />
            </g>
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
          <div className="home-org-diagram__you-chip-copy">
            <p className="home-org-diagram__chip-title home-org-diagram__chip-title--inverted">You</p>
            <p className="home-org-diagram__chip-sub home-org-diagram__chip-sub--inverted">The founder</p>
          </div>
        </div>

        <div className="home-org-diagram__pancake-chip home-org-diagram__abs" data-node-id="428:14941">
          <p className="home-org-diagram__chip-title home-org-diagram__chip-title--inverted">Pancake</p>
          <p className="home-org-diagram__chip-sub home-org-diagram__chip-sub--inverted home-org-diagram__chip-sub--nowrap">
            Your co-founder
          </p>
        </div>

        <div className="home-org-diagram__you-avatar home-org-diagram__abs" aria-hidden>
          <span className="home-org-diagram__you-eye" />
          <span className="home-org-diagram__you-eye" />
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
