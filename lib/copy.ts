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
 * Pricing — radically honest. Two costs: a small fixed $29 for the always-on
 * machine (the "kitchen") plus tokens passed through at lab rates. One plan,
 * one slider, one total. Numbers are the single source of truth for the page.
 */
export const pricing = {
  // Hard pricing numbers — source of truth.
  infrastructureDollars: 29,
  /** 4 discrete slider stops. Total includes the $29 infrastructure cost. */
  tiers: [
    { totalDollars: 49,  tokens: 5_000_000,  pancakes: 1 },
    { totalDollars: 129, tokens: 25_000_000, pancakes: 2 },
    { totalDollars: 229, tokens: 50_000_000, pancakes: 3 },
    { totalDollars: 329, tokens: 75_000_000, pancakes: 4 },
  ],
  defaultTierIndex: 0,
  trial: {
    days: 7,
    freeTokensDollars: 20,
  },
  currency: "USD" as const,
  currencySymbol: "$",
  // Hero copy.
  title: "No tiers. No tricks.",
  subtitle: "$29 for the always-on setup. Tokens at cost.",
  breakdownPrefix: "kitchen",
  breakdownTokens: "tokens",
  perMonth: "/ month",
  // Slider labels for the 4 stops.
  sliderStopLabels: ["5M", "25M", "50M", "75M"],
  sliderTokensLabel: "tokens / month",
  // Trial CTA below the widget.
  trialCta: "Start your free trial",
  trialCaption: "7 days free. No card required.",
  trialHref: "/signup",
  // 3-column manifesto (shown BEFORE the buys cards — trust before value:
  // the user needs to believe the price is fair before they care what it
  // gets them). Title doubles as the page's main headline since the hero
  // section above runs without an H1/H2.
  manifesto: {
    title: "No tiers. No tricks.",
    items: [
      {
        title: "Lab rates on tokens.",
        body:
          "Most AI tools mark up tokens 3x or 5x. We charge what OpenAI and Anthropic publish. Our margin is the $29 kitchen, not your usage.",
      },
      {
        title: "Your kitchen, always on.",
        body:
          "$29 buys a cloud based computer. Always on, always yours, never shared.",
      },
      {
        title: "No surprises.",
        body:
          "Tokens reset monthly. Hit the limit, bump the slider. Cancel anytime, takes effect immediately.",
      },
    ],
  },
  // "What your tokens buy" — asymmetric cards with Slack-style exchanges.
  // Layout: 2 cards top row, 1 wide card bottom.
  buys: {
    title: "What your tokens buy",
    cards: [
      {
        kicker: "QUICK TASKS",
        tokenRange: "100K – 300K tokens",
        tag: "An hour of work, done in 5 minutes.",
        wide: false,
        user: {
          name: "Sarah",
          initial: "S",
          accent: "#E8E0F2",
          accentInk: "#4A3C7B",
          time: "8:14am",
          text: "@pancake — write me an X thread about why we pivoted last month. Use the framing from my last 3 threads. Schedule it for 2pm today.",
        },
        agent: {
          time: "8:19am",
          text: "Drafted, edited, scheduled in Typefully for 2pm — pancake.dev/t/9f2. 6 posts, opens with a hook on the \"we were wrong\" angle you used in your March 12 thread. Want me to draft a LinkedIn version too?",
        },
      },
      {
        kicker: "WORKFLOWS",
        tokenRange: "500K – 1.5M tokens",
        tag: "Half a day of ops, done while you focus on something else.",
        wide: false,
        user: {
          name: "Mike",
          initial: "M",
          accent: "#D5E4EB",
          accentInk: "#1F4660",
          time: "10:04am",
          text: "@pancake — 27 demo requests came in over the weekend. Qualify each against our ICP (B2B SaaS, 20+ employees, US/EU). Reject the bottom half politely, book the top half on my Cal.com with a 1-pager prep doc for each.",
        },
        agent: {
          time: "1:47pm",
          text: "Done. 14 disqualified with a polite \"not a fit right now\" reply (drafts in your Gmail, awaiting your send). 13 qualified — 11 booked themselves on Cal, 2 pending. Prep docs in pancake.dev/inbound. Three look like fast closers — flagged at the top.",
        },
      },
      {
        kicker: "FULL PROJECTS",
        tokenRange: "2M – 5M tokens",
        tag: "A week of outbound a BDR would do.",
        wide: true,
        user: {
          name: "Tom",
          initial: "T",
          accent: "#EAE2D2",
          accentInk: "#6E5520",
          time: "Monday 9:02am",
          text: "@pancake — I want 30 sales calls booked by Friday. ICP is mid-market e-commerce, 50-500 employees, hiring growth or marketing roles. Find them, write personalized outbound, send from my Apollo, book demos on my Cal.com when they reply. Check in with me Wednesday.",
        },
        agent: {
          time: "Wednesday 4:18pm",
          text: "Day 3 update. 184 prospects sourced, 142 emails sent, 38 replies, 19 demos booked so far. 4 hot conversations need you (in #pancake-hot in Slack). Disqualified 8 that didn't match ICP on closer look. Tracking to ~32 demos by Friday — want me to push harder on the LinkedIn channel to hit 35?",
          artifact: "outbound-tracker",
        },
      },
    ],
  },
  // FAQ accordion.
  faq: {
    title: "Questions",
    items: [
      {
        q: "What counts as a token?",
        a: "The same unit the labs use. Roughly 3 or 4 characters of text. We don't transform or repackage.",
      },
      {
        q: "Do tokens roll over?",
        a: "No. They reset on your billing day. Leftovers don't carry into next month.",
      },
      {
        q: "How do seats work?",
        a: "Unlimited. Your whole team shares one workspace and one pool of tokens.",
      },
      {
        q: "What if I run out mid-month?",
        a: "Bump the slider from your settings. The new tier takes effect immediately and you only pay the difference, prorated.",
      },
      {
        q: "What is the $29 for?",
        a: "The kitchen your agents live in. A small always-on machine that holds your context, runs your jobs, and reports back. Think Mac mini in the cloud.",
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
