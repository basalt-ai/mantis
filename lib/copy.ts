/** Locked marketing copy — do not change without explicit approval */

export const hero = {
  /** H1 line 1 (break before autonomous) */
  h1Before: "Let OpenClaw run your",
  /** H1 line 2: autonomous + ref marker SVG + h1After */
  h1After: " company.",
  h2: "Instantly deploy an army of open source agents to run your company.",
  h3: "Human board. AI execution.",
  /** Hero + navbar primary CTA */
  cta: "Start building",
  /** Hero autonomous + ref markers + CTA fill (sync themes/neo-brutalism --accent) */
  autonomousAccent: "#FF8FA3",
  humanBoardAnchorId: "human-board-execution",
} as const;

export const orgChart = {
  title: "An entire organization working for you while you sleep.",
  ceoLabel: "CEO AGENT",
  /** Shown once under each cluster’s agent grid */
  moreComingSoon: "More coming soon.",
  /** Visual clusters only — flat reporting to CEO */
  clusters: [
    {
      id: "growth",
      label: "GROWTH",
      tint: "#FFE4EC",
      agents: [
        "Outbound SDR",
        "Email Marketer",
        "Ad Manager",
        "Copywriter",
        "Social Media Manager",
        "Partnership Outreach",
      ],
    },
    {
      id: "engineering",
      label: "ENGINEERING",
      tint: "#E4EEFF",
      agents: [
        "Full-stack Engineer",
        "DevOps",
        "QA Tester",
        "Performance Monitor",
        "Security Auditor",
      ],
    },
    {
      id: "operations",
      label: "OPERATIONS",
      tint: "#FFF8E1",
      agents: [
        "Scheduling",
        "Customer Support",
        "Recruiting Screener",
        "Contract Reviewer",
        "Invoicing",
        "Onboarding Specialist",
      ],
    },
  ],
  features: [
    {
      title: "Markdown-configured",
      description:
        "Every agent, role, and workflow defined in .md files you control",
    },
    {
      title: "Open source",
      description: "Audit the code. Fork the repo. No black box.",
    },
    {
      title: "Always on",
      description: "Your agent org runs 24/7 — no downtime, no sick days",
    },
  ],
} as const;

export const slack = {
  titleLine1: "Your agents live in Slack.",
  titleLine2: "They don't wait to be asked.",
  channels: ["#aria-updates", "#outbound", "#deploys", "#support-queue"] as const,
  activeChannel: "#outbound" as const,
  /** Sidebar DMs — teammates with distinct avatar colors */
  teammates: [
    { handle: "sales-lead", initials: "SL", avatarColor: "#E01E5A" },
    { handle: "ops-manager", initials: "OM", avatarColor: "#1264A3" },
    { handle: "engineering-bot", initials: "EB", avatarColor: "#2EB67D" },
  ] as const,
  valuePropBadge: "3 agents acted while you were in meetings",
  messages: [
    {
      id: "1",
      kind: "agent" as const,
      agentHandle: "sales-lead",
      time: "8:47 AM",
      text: 'Morning. 3 high-intent leads went cold this week — I drafted re-engagement emails for all 3 and scheduled sends for 2pm. Flagging one for you: Acme Corp, $40K deal, last touched 9 days ago. Want me to call or keep it async?',
      actions: ["approve", "edit", "skip"] as const,
    },
    {
      id: "2",
      kind: "user" as const,
      time: "9:18 AM",
      text: "Close out last week and send invoices.",
    },
    {
      id: "3",
      kind: "agent" as const,
      agentHandle: "ops-manager",
      time: "9:18 AM",
      text: "On it. 6 invoices drafted in Stripe, 4 sent. 2 flagged — unusual payment terms, need your sign-off before sending.",
      taskTag: "Task completed · 4 sent automatically",
    },
    {
      id: "4",
      kind: "agent" as const,
      agentHandle: "engineering-bot",
      time: "9:21 AM",
      text: "PR #184 passed all checks. Deployed to staging. Notified the team in #deploys. Ready to merge on your go.",
      showDeployButton: true,
    },
  ],
} as const;

export const safeCompliant = {
  title: "You're always in control.",
  badges: [
    {
      icon: "check" as const,
      title: "Human approval",
      description:
        "Sensitive actions pause and wait for your go-ahead.\nAgents never send, delete, or charge without permission.",
    },
    {
      icon: "list" as const,
      title: "Full audit log",
      description:
        "Every action every agent takes is recorded.\nSee exactly what ran, when, and why.",
    },
    {
      icon: "lock" as const,
      title: "Scoped access",
      description:
        "Each agent only sees what it needs.\nYou decide which tools, channels, and data each one can touch.",
    },
  ],
} as const;

export const stackIntegrations = {
  title: "Plug in your stack for full agency.",
  subtitle: "Basalt integrates with Slack and your entire stack.",
  contextColumn: {
    title: "Context",
    subtitle: "Agents read your tools to understand your business.",
    items: [
      { name: "Gmail", description: "Inbox and thread context for outreach." },
      { name: "Slack", description: "Decisions and updates where your team lives." },
      { name: "Granola", description: "Meeting notes feed agent memory." },
      { name: "Notion", description: "Specs, wikis, and CRM-style pages." },
    ],
  },
  executionColumn: {
    title: "Execution",
    subtitle: "Agents act on your tools to ship, charge, and deliver.",
    items: [
      { name: "Vercel", description: "Ship previews and production deploys." },
      { name: "Stripe", description: "Invoices, subscriptions, and revenue ops." },
      { name: "Lemlist", description: "Sequences and reply handling." },
      { name: "Gong", description: "Call insights for coaching and follow-up." },
    ],
  },
  mcpRow: "+ Any MCP server",
} as const;

export const finalCta = {
  title: "Build your autonomous company.",
  subtitle: "Open source. Deploy in minutes. Scale without hiring.",
  cta: "Start building",
} as const;

export const signup = {
  title: "Join the waitlist",
  subtitle: "Welcome — you're on the list. We'll be in touch soon.",
  emailPlaceholder: "you@company.com",
  submit: "Request access",
  success: "You're in. Watch your inbox for next steps.",
} as const;
