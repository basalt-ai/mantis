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
  ceoLabel: "AI Co-Founder",
  /** Shown once under each cluster’s agent grid */
  moreComingSoon: "+ build your own",
  /** Visual clusters only — flat reporting to your AI cofounder */
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
      title: "Plugged into your brain",
      description:
        "Agents pull context from your Notion, docs, and meeting notes. They know your business.",
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
  workspaceName: "Your Company",
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
    { handle: "aria", initials: "AR", avatarColor: "#E9738E" },
    { handle: "scout", initials: "SC", avatarColor: "#1264A3" },
    { handle: "ghostwriter", initials: "GW", avatarColor: "#5B2C83" },
    { handle: "shipwright", initials: "SW", avatarColor: "#2EB67D" },
  ] as const,
} as const;

export const itLearns = {
  headlineBefore: "Give feedback. It gets ",
  headlineAccent: "sharper",
  subhead: "Correct it once. It remembers forever.",
} as const;

export const safeCompliant = {
  title: "You're always in control.",
  badges: [
    {
      icon: "check" as const,
      title: "Human guardrails",
      description: "Sensitive actions pause and wait for your go-ahead.",
    },
    {
      icon: "list" as const,
      title: "Full audit trail",
      description: "Every action every agent takes is recorded.",
    },
    {
      icon: "lock" as const,
      title: "Scoped access",
      description: "Each agent only sees what it needs.",
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
      id: "granola",
      name: "Granola",
      description: "Meeting notes and call context feed agent memory.",
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
      name: "X",
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
  mcpRow: "+ Any tool with an API",
} as const;

export const finalCta = {
  title: "Build your autonomous company.",
  subtitle: "Deploy in minutes. Scale without hiring.",
  cta: "Start building",
} as const;

export const talkToHuman = {
  title: "Or talk to a human",
  subtitle: "Let's put your company on autopilot",
} as const;

/**
 * Pricing — radically honest. Two costs: a small fixed €29 for the always-on
 * machine (the "kitchen") plus tokens passed through at lab rates. One plan,
 * one slider, one total. Numbers are the single source of truth for the page.
 */
export const pricing = {
  // Hard pricing numbers — source of truth.
  infrastructureEuros: 29,
  /** 4 discrete slider stops. Total includes the €29 infrastructure cost. */
  tiers: [
    { totalEuros: 49,  tokens: 5_000_000,  pancakes: 2 },
    { totalEuros: 129, tokens: 25_000_000, pancakes: 3 },
    { totalEuros: 229, tokens: 50_000_000, pancakes: 4 },
    { totalEuros: 329, tokens: 75_000_000, pancakes: 5 },
  ],
  defaultTierIndex: 0,
  trial: {
    days: 7,
    freeTokensEuros: 20,
  },
  currency: "EUR" as const,
  currencySymbol: "€",
  // Hero copy.
  eyebrow: "PRICING",
  title: "no markup. one slider.",
  subtitle:
    "we buy tokens in bulk from the labs and pass through the rate. plus a small fixed cost for your always-on kitchen.",
  totalLabel: "your monthly bill",
  breakdownPrefix: "kitchen",
  breakdownTokens: "tokens",
  perMonth: "/ month",
  // Slider labels for the 4 stops.
  sliderStopLabels: ["5M", "25M", "50M", "75M"],
  sliderTokensLabel: "tokens per month",
  sliderHelper: "tokens reset monthly. no rollover. unlimited seats.",
  // Trial CTA below the widget.
  trialCta: "start your 7-day trial",
  trialNote: "€20 in tokens to play with. no card required.",
  trialHref: "/signup",
  // "what your tokens buy" cards.
  buys: {
    title: "what your tokens buy",
    cards: [
      {
        name: "quick task",
        budget: "~50k tokens",
        examples: [
          "draft a Slack reply",
          "summarize a thread",
          "label and triage your inbox",
        ],
      },
      {
        name: "workflow",
        budget: "~500k tokens",
        examples: [
          "research a prospect end-to-end",
          "brief your week from your calendar",
          "file a weekly report from raw data",
        ],
      },
      {
        name: "full project",
        budget: "~5M tokens",
        examples: [
          "ship a small feature, PR included",
          "audit a codebase and write the cleanup plan",
          "draft a launch playbook with assets",
        ],
      },
    ],
  },
  // "how this works" 3-column manifesto.
  manifesto: {
    title: "how this works",
    items: [
      {
        title: "no markup.",
        body:
          "the labs sell us tokens. we sell them to you at the same rate. no creative bookkeeping.",
      },
      {
        title: "your kitchen, always on.",
        body:
          "€29 keeps a machine running 24/7 just for you. think a Mac mini in the cloud — always on, always yours.",
      },
      {
        title: "no surprises.",
        body:
          "tokens reset every month. no rollover, no overage. if you run out, bump the slider — takes effect immediately.",
      },
    ],
  },
  // "above €329 → talk to sales" banner.
  talkToSales: {
    title: "running heavier?",
    body: "above 75M tokens or want a custom invoice? we'll set you up.",
    cta: "talk to sales",
    href: "mailto:hello@getpancake.ai?subject=Custom%20pricing",
  },
  // FAQ accordion.
  faq: {
    title: "questions",
    items: [
      {
        q: "what counts as a token?",
        a: "the same unit the labs use. roughly 3 or 4 characters of text. we don't transform or repackage.",
      },
      {
        q: "do tokens roll over?",
        a: "no. they reset on your billing day. leftovers don't carry into next month.",
      },
      {
        q: "how do seats work?",
        a: "unlimited. your whole team shares one workspace and one pool of tokens.",
      },
      {
        q: "what if I run out mid-month?",
        a: "bump the slider from your settings. the new tier takes effect immediately and you only pay the difference, prorated.",
      },
      {
        q: "what is the €29 for?",
        a: "the kitchen your agents live in. a small always-on machine that holds your context, runs your jobs, and reports back. think Mac mini in the cloud.",
      },
      {
        q: "what about contracts?",
        a: "monthly. cancel any time. for bigger volumes or annual invoicing, talk to sales.",
      },
    ],
  },
} as const;

export const signup = {
  title: "Join the waitlist",
  subtitle: "Welcome — you're on the list. We'll be in touch soon.",
  emailPlaceholder: "you@company.com",
  submit: "Request access",
  success: "You're in. Watch your inbox for next steps.",
  successTitle: "You're on the list.",
  successBody:
    "We're releasing Pancake to more people each day and we can't wait for you to try it.",
  referralTitle: "Skip the waitlist.",
  referralBody:
    "Refer 2 people. When they sign up, you get immediate access to the early version of Pancake — and so do they.",
  referralCta: "Get your referral link →",
  discordLabel: "Or join our Discord",
  discordBody: "Connect with other Autonomous Company founders sharing best practices.",
  discordCta: "Join the community →",
  discordUrl: "https://discord.gg/brJ99Up6ym",
} as const;
