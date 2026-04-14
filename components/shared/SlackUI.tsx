"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { slack } from "@/lib/copy";

const SLACK_PURPLE = "#4A154B";
const SLACK_MUTED = "rgba(255,255,255,0.55)";
const SLACK_TEXT = "#1d1c1d";

const AGENT_DISPLAY_NAME = "CEO Agent";

type Channel = (typeof slack.channels)[number];

type PreviewRow = { lead: string; body: string };

type AgentMessage = {
  id: string;
  kind: "agent";
  agentHandle: string;
  time: string;
  text: string;
  actions?: string[];
  taskTag?: string;
  actionLink?: { label: string };
  previewBlock?: { rows: PreviewRow[]; moreLabel: string };
  errorRateBar?: { before: string; after: string };
  /** Decorative Slack-style reactions (non-interactive) */
  reactions?: readonly { emoji: string; count: number }[];
};

type UserMessage = {
  id: string;
  kind: "user";
  time: string;
  text: string;
};

type SlackMsg = AgentMessage | UserMessage;

const CHANNEL_MESSAGES: Record<Channel, SlackMsg[]> = {
  "#briefing": [
    {
      id: "b1",
      kind: "agent",
      agentHandle: "aria",
      time: "8:00 AM",
      text: `Good morning. Here's Your Company overnight:

· MRR: $4,280 → $4,620 (+$340, 2 new customers from LinkedIn outbound)
· Outbound: 131 connection requests sent Monday → 34 accepted → 6 demo calls booked this week
· Content: Your X thread hit 847K impressions. +1,200 followers in 48h
· Product: 0 incidents. Hotfix PR #294 auto-shipped at 3AM. Webhook error rate → 0%

One thing needs you today:
Demo call with Ramp (Series B fintech, $80K potential ACV) at 2pm.
Prep doc ready →`,
      actionLink: { label: "Open prep doc in Notion →" },
    },
  ],
  "#outbound": [
    {
      id: "o1",
      kind: "agent",
      agentHandle: "scout",
      time: "9:15 AM",
      text: `Signal detected: 23 companies on your ICP posted "Senior AI Engineer"
job listings on LinkedIn in the past 72h. Teams hiring for AI = teams
that need code review tooling.

I cross-referenced with your CRM — 19 are net-new prospects.
Built a list of 147 decision-makers (VP Eng, CTO, Head of Platform).

Each connection request is personalized using their latest LinkedIn
post or company news. Here are 3 previews:`,
      previewBlock: {
        rows: [
          {
            lead: "→ Sarah Chen, VP Eng @ Raycast",
            body: `"Saw your post about scaling code reviews across 12 repos. We built an API that plugs into your existing PR flow — mind if I share a 2-min demo?"`,
          },
          {
            lead: "→ Priya Sharma, Head of Platform @ Vercel",
            body: `"Loved your talk at Next.js Conf on CI pipelines. We just shipped an API that drops review time by 60%. Thought you'd find it interesting."`,
          },
        ],
        moreLabel: "⋯ 145 more",
      },
      actions: ["Send 147 invites", "Edit list", "Skip"],
    },
    {
      id: "o2",
      kind: "user",
      time: "9:18 AM",
      text: "Send. But skip companies under Series A.",
    },
    {
      id: "o3",
      kind: "agent",
      agentHandle: "scout",
      time: "9:18 AM",
      text: `Done. 131 invites sent (removed 16 profiles from 4 pre-seed
companies). Follow-up messages drip to acceptors over 5 days.
I'll report conversions daily in #briefing.`,
      taskTag: "✅ Task completed · outbound pipeline",
      reactions: [{ emoji: "🚀", count: 1 }],
    },
  ],
  "#content": [
    {
      id: "c1",
      kind: "agent",
      agentHandle: "ghostwriter",
      time: "7:45 AM",
      text: `Your X thread just crossed 847K impressions in 48 hours.
Here's the breakdown:

📊 2,340 likes · 412 reposts · 89 replies · 4.2x your avg engagement

Notable replies:
  · @guillaumepalayer (22K followers) — "This is the future of code review"
  · @swyx (178K followers) — quoted your thread with "underrated tool"
  · 2 partners at a16z liked it

I already replied to the top 8 high-follower accounts to keep
momentum going. Also:

→ Repurposed the thread into a LinkedIn post (scheduled tomorrow 8AM EST)
→ Extracted 3 pull-quotes for your landing page testimonials section
→ Added 14 new followers who match your ICP to the outbound list in #outbound`,
    },
  ],
  "#product": [
    {
      id: "p1",
      kind: "agent",
      agentHandle: "shipwright",
      time: "3:47 AM",
      text: `🔴 Incident auto-resolved.

3:12 AM — Sentry flagged 340 TypeError exceptions on /api/v2/webhooks.
Traced to PR #291 (merged yesterday): payload.metadata is null when
webhook source is Stripe.

Here's what I did:
  1. Isolated root cause in webhook_handler.ts:L142
  2. Pushed fix → PR #294 (added null coalescing + fallback)
  3. Tests: 14/14 passing, including new edge case coverage
  4. Deployed to staging → error rate dropped to 0
  5. Deployed to prod at 3:41 AM → confirmed fix

23 affected webhook deliveries have been auto-retried. All succeeded.`,
      errorRateBar: { before: "12.4%", after: "0.02%" },
      reactions: [{ emoji: "🫡", count: 1 }],
    },
    {
      id: "p2",
      kind: "agent",
      agentHandle: "shipwright",
      time: "3:48 AM",
      text: `Incident postmortem drafted in Notion. I've also added a pre-merge
check so nullable fields from payment providers get caught before
deploy next time.`,
      taskTag: "✅ Incident resolved · 28 min from detection to fix",
    },
    {
      id: "p3",
      kind: "user",
      time: "9:30 AM",
      text: "Good bot.",
    },
  ],
};

const COMPOSER_TEMPLATE: Record<Channel, string> = {
  "#briefing": "What needs me today?",
  "#outbound": "Send. But skip companies under Series A.",
  "#content": "Repurpose this into a LinkedIn carousel too.",
  "#product": "Good bot.",
};

const PICKER_EMOJIS = ["🤖", "🫡", "🚀", "👀"] as const;

type ComposerState = { revealed: number; started: boolean; suffix: string };

function emptyComposerState(): Record<Channel, ComposerState> {
  return {
    "#briefing": { revealed: 0, started: false, suffix: "" },
    "#outbound": { revealed: 0, started: false, suffix: "" },
    "#content": { revealed: 0, started: false, suffix: "" },
    "#product": { revealed: 0, started: false, suffix: "" },
  };
}

function SlackComposer({ activeChannel }: { activeChannel: Channel }) {
  const [byChannel, setByChannel] = useState(emptyComposerState);
  const [clipTipVisible, setClipTipVisible] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const clipTipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  const template = COMPOSER_TEMPLATE[activeChannel];
  const state = byChannel[activeChannel];
  const fullTemplateLen = template.length;
  const typed = template.slice(0, Math.min(state.revealed, fullTemplateLen));
  const display = typed + state.suffix;
  const templateComplete = state.revealed >= fullTemplateLen;
  const showPlaceholder = !state.started && state.revealed === 0;
  const showCaret = state.started && !templateComplete;

  useEffect(() => {
    if (!state.started || state.revealed >= fullTemplateLen) return;
    const id = window.setTimeout(() => {
      setByChannel((prev) => {
        const s = prev[activeChannel];
        const len = COMPOSER_TEMPLATE[activeChannel].length;
        return {
          ...prev,
          [activeChannel]: {
            ...s,
            revealed: Math.min(s.revealed + 1, len),
          },
        };
      });
    }, 50);
    return () => window.clearTimeout(id);
  }, [activeChannel, state.started, state.revealed, fullTemplateLen]);

  useEffect(() => {
    return () => {
      if (clipTipTimer.current) clearTimeout(clipTipTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!emojiOpen) return;
    const close = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [emojiOpen]);

  useEffect(() => {
    if (!clipTipVisible) return;
    const close = (e: MouseEvent) => {
      if (clipRef.current && !clipRef.current.contains(e.target as Node)) {
        if (clipTipTimer.current) {
          clearTimeout(clipTipTimer.current);
          clipTipTimer.current = null;
        }
        setClipTipVisible(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [clipTipVisible]);

  useEffect(() => {
    if (!linkPopoverOpen) return;
    const close = (e: MouseEvent) => {
      if (linkRef.current && !linkRef.current.contains(e.target as Node)) {
        setLinkPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [linkPopoverOpen]);

  const bumpOnKey = useCallback(() => {
    setByChannel((prev) => {
      const s = prev[activeChannel];
      const len = COMPOSER_TEMPLATE[activeChannel].length;
      return {
        ...prev,
        [activeChannel]: {
          ...s,
          started: true,
          revealed: Math.min(s.revealed + 4, len),
        },
      };
    });
  }, [activeChannel]);

  const onComposerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      return;
    }
    if (e.key === "Tab") return;
    e.preventDefault();
    bumpOnKey();
  };

  const onComposerFocus = () => {
    setByChannel((prev) => ({
      ...prev,
      [activeChannel]: { ...prev[activeChannel], started: true },
    }));
  };

  const channelName = activeChannel.replace(/^#/, "");

  /** Shared Slack-style mini tooltip (link + paperclip) */
  const slackTooltipWrap =
    "absolute bottom-full left-1/2 z-30 mb-1.5 flex -translate-x-1/2 flex-col items-center";
  const slackTooltipCard =
    "w-fit max-w-[min(18rem,calc(100vw-2rem))] rounded-lg bg-[#1a1d21] px-2.5 py-1.5 text-center shadow-[0_3px_10px_rgba(0,0,0,0.2)]";
  const slackTooltipCaret =
    "-mt-px h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1a1d21]";

  const onPaperclipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (clipTipTimer.current) {
      clearTimeout(clipTipTimer.current);
      clipTipTimer.current = null;
    }
    if (clipTipVisible) {
      setClipTipVisible(false);
      return;
    }
    setClipTipVisible(true);
    clipTipTimer.current = setTimeout(() => {
      setClipTipVisible(false);
      clipTipTimer.current = null;
    }, 2600);
  };

  const insertEmoji = (ch: string) => {
    setByChannel((prev) => ({
      ...prev,
      [activeChannel]: {
        ...prev[activeChannel],
        started: true,
        revealed: Math.max(prev[activeChannel].revealed, COMPOSER_TEMPLATE[activeChannel].length),
        suffix: prev[activeChannel].suffix + ch,
      },
    }));
    setEmojiOpen(false);
  };

  return (
    <div className="border-t border-[#e8e8e8] bg-white px-4 pb-4 pt-3">
      <div className="rounded-lg border border-[#cccccc] bg-white px-3 py-2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]">
        <div
          role="textbox"
          tabIndex={0}
          aria-label={`Message ${activeChannel}`}
          onFocus={onComposerFocus}
          onKeyDown={onComposerKeyDown}
          className="min-h-[22px] cursor-text select-none text-left text-[15px] leading-normal outline-none ring-0 focus:outline-none"
          style={{ color: showPlaceholder ? "#868686" : SLACK_TEXT }}
        >
          {showPlaceholder ? (
            <span className="text-[#868686]">Message #{channelName}</span>
          ) : (
            <span className="whitespace-pre-wrap break-words">
              {display}
              {showCaret ? (
                <span
                  className="ml-px inline-block w-px animate-pulse bg-[#1d1c1d]"
                  style={{ height: "1.15em", verticalAlign: "text-bottom" }}
                  aria-hidden
                />
              ) : null}
            </span>
          )}
        </div>
        <div className="relative mt-2 flex items-center gap-3 border-t border-[#f0f0f0] pt-2 text-[13px] font-semibold text-[#868686]">
          <button
            type="button"
            title="Bold"
            tabIndex={-1}
            className="-mx-0.5 cursor-pointer select-none rounded px-1.5 py-0.5 font-semibold not-italic text-[#868686] transition-[color,background-color,transform] duration-150 ease-out hover:bg-[#ececec] hover:text-[#1d1c1d] active:scale-[0.96]"
          >
            B
          </button>
          <button
            type="button"
            title="Italic"
            tabIndex={-1}
            className="-mx-0.5 cursor-pointer select-none rounded px-1.5 py-0.5 italic text-[#868686] transition-[color,background-color,transform] duration-150 ease-out hover:bg-[#ececec] hover:text-[#1d1c1d] active:scale-[0.96]"
          >
            I
          </button>
          <div className="relative" ref={linkRef}>
            <button
              type="button"
              title="Link"
              className="cursor-pointer select-none border-0 bg-transparent p-0 text-[inherit]"
              onClick={(e) => {
                e.preventDefault();
                setLinkPopoverOpen((o) => !o);
              }}
            >
              🔗
            </button>
            {linkPopoverOpen ? (
              <div className={slackTooltipWrap} role="dialog" aria-label="flappybird.io">
                <div className={slackTooltipCard}>
                  <a
                    href="https://flappybird.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-medium leading-tight text-[#36C5F0] underline decoration-[#36C5F0]/70 underline-offset-2 hover:text-[#70d4f7]"
                  >
                    flappybird.io
                  </a>
                </div>
                <div className={slackTooltipCaret} aria-hidden />
              </div>
            ) : null}
          </div>
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              title="Emoji"
              className="cursor-pointer select-none border-0 bg-transparent p-0 text-[inherit]"
              onClick={(e) => {
                e.preventDefault();
                setEmojiOpen((o) => !o);
              }}
            >
              😊
            </button>
            {emojiOpen ? (
              <div
                className="absolute bottom-full left-1/2 z-30 mb-1 flex -translate-x-1/2 gap-1 rounded-md border border-[#e0e0e0] bg-white px-2 py-1.5 shadow-md"
                role="listbox"
              >
                {PICKER_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    className="rounded px-1.5 py-0.5 text-lg leading-none hover:bg-[#f0f0f0]"
                    onClick={() => insertEmoji(em)}
                  >
                    {em}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative" ref={clipRef}>
            <button
              type="button"
              title="Attach"
              className="cursor-pointer select-none border-0 bg-transparent p-0 text-[inherit]"
              onClick={onPaperclipClick}
            >
              📎
            </button>
            {clipTipVisible ? (
              <div className={slackTooltipWrap} role="tooltip">
                <div className={slackTooltipCard}>
                  <p className="whitespace-nowrap text-[12px] font-medium leading-tight text-white/95">
                    Nice try — no upload yet 😅
                  </p>
                </div>
                <div className={slackTooltipCaret} aria-hidden />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${className ?? ""}`}
      style={{ width: 36, height: 36, fontSize: 13 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function TeammateAvatar({ initials, backgroundColor }: { initials: string; backgroundColor: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)]"
      style={{ backgroundColor }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function agentByHandle(handle: string) {
  return slack.agents.find((a) => a.handle === handle);
}

function InlineActionRow({ actions }: { actions: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {actions.map((a) => (
        <span
          key={a}
          className="cursor-default select-none rounded border border-[#cccccc] bg-[#f8f8f8] px-2.5 py-1 text-[12px] font-semibold text-[#1d1c1d] shadow-sm"
        >
          {a}
        </span>
      ))}
    </div>
  );
}

function PreviewQuoteBlock({ rows, moreLabel }: { rows: PreviewRow[]; moreLabel: string }) {
  return (
    <div className="mt-3 rounded-md border border-[#e0e0e0] bg-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`px-3 py-2.5 ${i > 0 ? "border-t border-[#e8e8e8]" : ""}`}
        >
          <p className="text-[13px] font-semibold leading-snug text-[#1d1c1d]">{row.lead}</p>
          <p className="mt-1 whitespace-pre-line text-[14px] font-normal leading-[1.45] text-[#1d1c1d]">
            {row.body}
          </p>
        </div>
      ))}
      <div className="border-t border-[#e8e8e8] px-3 py-2 text-right text-[13px] text-[#616061]">
        {moreLabel}
      </div>
    </div>
  );
}

function ErrorRateMiniBar({ before, after }: { before: string; after: string }) {
  return (
    <p className="mt-3 font-mono text-[12px] leading-relaxed tracking-tight text-[#1d1c1d]">
      Error rate: <span className="text-[#b91c1c]">████████░░ {before}</span>
      {"  →  "}
      <span className="text-[#15803d]">░░░░░░░░░░ {after}</span>
    </p>
  );
}

function StaticReactions({ reactions }: { reactions: readonly { emoji: string; count: number }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-hidden>
      {reactions.map((r) => (
        <span
          key={`${r.emoji}-${r.count}`}
          className="inline-flex cursor-default items-center gap-1 rounded-full bg-[#f0f0f0] px-2 py-1 text-[13px] leading-none text-[#1d1c1d]"
        >
          <span className="text-[15px] leading-none">{r.emoji}</span>
          <span className="tabular-nums text-[12px] font-normal text-[#1d1c1d]">{r.count}</span>
        </span>
      ))}
    </div>
  );
}

function SlackMessageBlock({ message }: { message: SlackMsg }) {
  if (message.kind === "user") {
    return (
      <div className="flex gap-3" style={{ gap: 12 }}>
        <UserAvatar initials="YO" className="bg-[#36C5F0]" />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <span className="text-[15px] font-bold text-[#1d1c1d]">You</span>
            <span className="text-[12px] font-normal text-[#616061]">{message.time}</span>
          </div>
          <p className="mt-1 whitespace-pre-line text-[15px] font-normal leading-[1.46668]" style={{ color: SLACK_TEXT }}>
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  const tm = agentByHandle(message.agentHandle);
  const initials = tm?.initials ?? "??";
  const bg = tm?.avatarColor ?? "#4A154B";

  return (
    <div className="flex gap-3" style={{ gap: 12 }}>
      <TeammateAvatar initials={initials} backgroundColor={bg} />
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className="text-[15px] font-bold text-[#1d1c1d]">{AGENT_DISPLAY_NAME}</span>
          <span className="text-[12px] font-normal text-[#616061]">{message.time}</span>
        </div>
        <p className="mt-1 whitespace-pre-line text-[15px] font-normal leading-[1.46668]" style={{ color: SLACK_TEXT }}>
          {message.text}
        </p>
        {message.previewBlock ? (
          <PreviewQuoteBlock rows={message.previewBlock.rows} moreLabel={message.previewBlock.moreLabel} />
        ) : null}
        {message.errorRateBar ? (
          <ErrorRateMiniBar before={message.errorRateBar.before} after={message.errorRateBar.after} />
        ) : null}
        {message.reactions && message.reactions.length > 0 ? (
          <StaticReactions reactions={message.reactions} />
        ) : null}
        {message.actions && message.actions.length > 0 ? (
          <InlineActionRow actions={message.actions} />
        ) : null}
        {message.actionLink ? (
          <p className="mt-2 text-[13px] font-medium leading-snug text-[#1264A3]">
            <span className="cursor-default select-none hover:underline">{message.actionLink.label}</span>
          </p>
        ) : null}
        {message.taskTag ? (
          <p className="mt-2 text-[13px] font-normal leading-snug text-[#616061]">{message.taskTag}</p>
        ) : null}
      </div>
    </div>
  );
}

export function SlackUI() {
  const [activeChannel, setActiveChannel] = useState<Channel>(slack.defaultChannel);

  const messages = CHANNEL_MESSAGES[activeChannel];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          <span className="block">{slack.titleLine1}</span>
          <span className="mt-2 block text-[1.35rem] font-medium leading-snug text-[#3d3d3d] sm:text-[1.5rem]">
            {slack.titleLine2}
          </span>
        </h2>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="rounded-theme brut-border bg-white">
            <div
              className="relative flex min-h-[520px] flex-col border border-solid border-[#e0e0e0] shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:min-h-[580px] md:flex-row"
              style={{
                fontFamily:
                  'var(--font-lato), "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              <aside
                className="flex w-full shrink-0 flex-col md:w-[240px]"
                style={{ backgroundColor: SLACK_PURPLE }}
              >
                <div className="flex flex-1 flex-col px-3 pb-6 pt-4">
                  <div className="mb-4 flex items-center gap-2 px-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-[15px] text-white ring-1 ring-white/15"
                      aria-hidden
                    >
                      ✦
                    </span>
                    <span className="truncate text-[17px] font-bold tracking-tight text-white">
                      {slack.workspaceName}
                    </span>
                  </div>

                  <p
                    className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: SLACK_MUTED }}
                  >
                    Channels
                  </p>
                  <ul className="space-y-0.5">
                    {slack.channels.map((ch) => {
                      const isActive = ch === activeChannel;
                      const unread = slack.channelUnread[ch];
                      return (
                        <li key={ch}>
                          <button
                            type="button"
                            onClick={() => setActiveChannel(ch)}
                            className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[15px] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.99] ${
                              isActive
                                ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.2]"
                                : "bg-transparent text-white/95 hover:bg-white/[0.12] hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                            }`}
                          >
                            <span className="min-w-0 truncate">
                              <span className="mr-0.5 font-normal opacity-75">#</span>
                              <span className={isActive ? "font-bold" : "font-normal"}>
                                {ch.replace("#", "")}
                              </span>
                            </span>
                            {unread > 0 ? (
                              <span
                                className="shrink-0 rounded-full bg-[#e01e5a] px-1.5 py-0.5 text-[11px] font-bold tabular-nums leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                                aria-label={`${unread} unread`}
                              >
                                {unread}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col bg-white">
                <header className="flex items-center border-b border-[#e8e8e8] bg-white px-4 py-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-black leading-none text-[#1d1c1d]">#</span>
                    <h3 className="text-[18px] font-bold leading-tight text-[#1d1c1d]">
                      {activeChannel.replace("#", "")}
                    </h3>
                  </div>
                </header>

                <div className="flex flex-1 flex-col">
                  <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                    {messages.map((m) => (
                      <SlackMessageBlock key={m.id} message={m} />
                    ))}
                  </div>
                  <SlackComposer activeChannel={activeChannel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
