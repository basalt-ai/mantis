export type OrgSurface = "growth" | "engineering" | "operations";

export type OrgDotTone = "positive" | "warning" | "negative";

/** Initial rows match the static Figma org (dot tones unchanged from the pre-live diagram). */
export const LIVE_INITIAL_DEPTS: readonly {
  title: string;
  surface: OrgSurface;
  rows: readonly { label: string; dot: OrgDotTone }[];
}[] = [
  {
    title: "Growth",
    surface: "growth",
    rows: [
      { label: "Copywriter", dot: "positive" },
      { label: "Ad Manager", dot: "warning" },
      { label: "Social Media Manager", dot: "negative" },
      { label: "Email Marketer", dot: "positive" },
    ],
  },
  {
    title: "Engineering",
    surface: "engineering",
    rows: [
      { label: "Full-stack Engineer", dot: "positive" },
      { label: "DevOps", dot: "positive" },
      { label: "Performance Monitor", dot: "negative" },
      { label: "QA Tester", dot: "positive" },
    ],
  },
  {
    title: "Operations",
    surface: "operations",
    rows: [
      { label: "Scheduling", dot: "positive" },
      { label: "Recruiting Screener", dot: "warning" },
      { label: "Invoicing", dot: "positive" },
      { label: "Customer Support", dot: "positive" },
    ],
  },
] as const;

export const ROLE_POOLS: Record<OrgSurface, readonly string[]> = {
  engineering: [
    "Full-stack Engineer",
    "DevOps",
    "Performance Monitor",
    "QA Tester",
    "Security Auditor",
    "Database Architect",
    "Code Reviewer",
    "Bug Triager",
    "Bug Whisperer",
    "Console.log Detective",
    "Merge Conflict Mediator",
  ],
  growth: [
    "Copywriter",
    "SEO Analyst",
    "Paid Ads Manager",
    "Email Marketer",
    "Conversion Optimizer",
    "Social Media Strategist",
    "Affiliate Manager",
    "Growth Hacker",
    "A/B Test Gambler",
    "Hook Engineer",
    "Cold DM Specialist",
  ],
  operations: [
    "Scheduling",
    "Recruiting Screener",
    "Vendor Coordinator",
    "Compliance Reviewer",
    "Expense Auditor",
    "Procurement Analyst",
    "IT Support",
    "Onboarding Specialist",
    "Calendar Tetris Master",
    "Slack Status Inspector",
    "Standup Saver",
  ],
};
