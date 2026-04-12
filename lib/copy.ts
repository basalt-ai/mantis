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
  /** Visual clusters only — flat reporting to CEO */
  clusters: [
    {
      id: "growth",
      label: "GROWTH",
      tint: "#FFE4EC",
      agents: [
        "Content Writer",
        "Ad Manager",
        "Outbound SDR",
        "Lead Qualifier",
        "SEO Specialist",
        "Social Media Manager",
        "Email Marketer",
        "Copywriter",
        "PR Agent",
        "Partnership Outreach",
      ],
    },
    {
      id: "engineering",
      label: "ENGINEERING",
      tint: "#E4EEFF",
      agents: [
        "Full-stack Engineer",
        "Frontend Dev",
        "Backend Dev",
        "DevOps",
        "Security Auditor",
        "QA Tester",
        "Performance Monitor",
      ],
    },
    {
      id: "operations",
      label: "OPERATIONS",
      tint: "#FFF8E1",
      agents: [
        "Invoicing",
        "Scheduling",
        "Payroll",
        "Support Tier 1",
        "Support Tier 2",
        "Escalation Manager",
        "Data Analyst",
        "Compliance Officer",
        "Contract Reviewer",
        "Onboarding Specialist",
        "Customer Success",
        "Recruiting Screener",
        "Meeting Scheduler",
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
  title: "Operate your company from Slack.",
  channels: ["#general", "#sales", "#ops", "#engineering", "#support"] as const,
  activeChannel: "#sales",
  directMessages: ["sales-lead", "ops-manager", "engineering-bot"] as const,
  messages: [
    {
      id: "1",
      sender: "You",
      isAgent: false,
      text: "@sales-lead how many leads came in this week?",
      time: "9:14 AM",
    },
    {
      id: "2",
      sender: "sales-lead",
      isAgent: true,
      text: "47 qualified leads (+12% vs last week). Top source: inbound demo requests. I queued follow-ups for the hottest 9.",
      time: "9:14 AM",
      thread: true,
    },
    {
      id: "3",
      sender: "You",
      isAgent: false,
      text: "@ops-manager send invoices for last week's closed deals.",
      time: "9:18 AM",
    },
    {
      id: "4",
      sender: "ops-manager",
      isAgent: true,
      text: "Done — 6 invoices drafted in Stripe, 4 sent automatically, 2 awaiting your approval on payment terms.",
      time: "9:18 AM",
    },
    {
      id: "5",
      sender: "engineering-bot",
      isAgent: true,
      text: "✅ Deploy preview passed — ready to merge PR #184.",
      time: "9:21 AM",
      taskDone: true,
    },
  ],
} as const;

export const safeCompliant = {
  title: "Safe and compliant by design.",
  badges: [
    {
      title: "SOC 2",
      description: "audit-ready infrastructure",
    },
    {
      title: "Guardrails",
      description: "every agent action is bounded and logged",
    },
    {
      title: "Permissions",
      description: "granular access control per agent, per tool",
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
