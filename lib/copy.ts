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
  youLabel: "You",
  ceoLabel: "CEO AGENT",
  /** Shown once under each cluster’s agent grid */
  moreComingSoon: "+ build your own",
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
  workspaceName: "Spectra",
  channels: ["#briefing", "#outbound", "#content", "#product"] as const,
  defaultChannel: "#briefing" as const,
  /** Unread counts shown on channel rows (Slack-style badges) */
  channelUnread: {
    "#briefing": 1,
    "#outbound": 3,
    "#content": 1,
    "#product": 2,
  } as const,
  /** Agents that post in channels — sidebar DMs removed; used for avatars in the thread */
  agents: [
    {
      handle: "ceo",
      displayName: "CEO Agent",
      initials: "CA",
      avatarColor: "#FF7B9C",
    },
  ] as const,
  /** Per-channel floating badge text (typewriter / receipt style, punchy caps) */
  channelBadges: {
    "#briefing": "YOUR COMPANY WHILE YOU SLEPT. ALL CLEAR.",
    "#outbound": "131 LEADS CONTACTED WHILE YOU WERE CODING",
    "#content": "847K IMPRESSIONS ON AUTOPILOT",
    "#product": "1 BUG CAUGHT & FIXED AT 3:12 AM",
  } as const,
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
  title: "Plug in your stack. Agents do the rest.",
  subtitle:
    "Connect your tools. Your agents read, write, ship, and sell through them — like an employee would.",
  integrations: [
    {
      id: "github",
      name: "GitHub",
      description: "Opens PRs, writes tests, ships hotfixes at 3 AM.",
    },
    {
      id: "vercel",
      name: "Vercel",
      description: "Deploys previews, promotes to prod, rolls back.",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Tracks MRR, flags churn risk, invoices new deals.",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Reads inbox, drafts replies, labels and routes mail.",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      description: "Sources leads, sends personalized outreach.",
    },
    {
      id: "x",
      name: "X (Twitter)",
      description: "Posts threads, engages replies, grows audience.",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Writes postmortems, specs, changelogs, CRM updates.",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Reports progress, asks approvals, briefs you daily.",
    },
  ],
  mcpRow: "+ Any MCP server",
} as const;

export const finalCta = {
  title: "Build your autonomous company.",
  subtitle: "Open source. Deploy in minutes. Scale without hiring.",
  cta: "Start building",
} as const;

export const pricing = {
  title: "Simple pricing.",
  subtitle: "One plan. Everything included.",
  priceLine: "€49 / month",
  cardLine: "Your full agent workforce",
  cta: "Start building",
} as const;

export const signup = {
  title: "Join the waitlist",
  subtitle: "Welcome — you're on the list. We'll be in touch soon.",
  emailPlaceholder: "you@company.com",
  submit: "Request access",
  success: "You're in. Watch your inbox for next steps.",
} as const;
