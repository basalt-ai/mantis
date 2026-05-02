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

export function HomeOrgDiagram() {
  return (
    <div className="home-org-diagram">
      <div className="home-org-diagram__stage">
        <svg
          className="home-org-diagram__svg"
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

        <div className="home-org-diagram__you-chip home-org-diagram__abs" data-node-id="596:1685">
          <svg
            className="home-org-diagram__chip-svg"
            viewBox="0 0 101 55"
            width={101}
            height={55}
            role="img"
            aria-labelledby="home-org-diagram-you-svg-title"
          >
            <title id="home-org-diagram-you-svg-title">You, the founder</title>
            <rect className="home-org-diagram__chip-svg-bg" width="101" height="55" rx="12" />
            <text x="85" y="22" textAnchor="end" className="home-org-diagram__chip-svg-text">
              <tspan className="home-org-diagram__chip-svg-title">You</tspan>
              <tspan className="home-org-diagram__chip-svg-sub" x="85" dy="24">
                The founder
              </tspan>
            </text>
          </svg>
        </div>

        <div className="home-org-diagram__pancake-chip home-org-diagram__abs" data-node-id="428:14941">
          <p className="home-org-diagram__chip-title home-org-diagram__chip-title--inverted">Pancake</p>
          <p className="home-org-diagram__chip-sub home-org-diagram__chip-sub--inverted">Your co-founder</p>
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
