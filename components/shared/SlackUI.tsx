import { slack } from "@/lib/copy";

const SLACK_PURPLE = "#4A154B";
const SLACK_ACTIVE = "rgba(255,255,255,0.14)";
const SLACK_MUTED = "rgba(255,255,255,0.55)";
const SLACK_TEXT = "#1d1c1d";
const PRESENCE = "#22C55E";

function SlackComposer({ channelLabel }: { channelLabel: string }) {
  const name = channelLabel.replace(/^#/, "");
  return (
    <div className="border-t border-[#e8e8e8] bg-white px-4 pb-4 pt-3">
      <div className="rounded-lg border border-[#cccccc] bg-white px-3 py-2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]">
        <div className="min-h-[22px] text-[15px] leading-normal text-[#868686]">
          Message #{name}
        </div>
        <div className="mt-2 flex items-center gap-4 border-t border-[#f0f0f0] pt-2 text-[13px] font-semibold text-[#868686]">
          <span title="Bold" className="cursor-default select-none">
            B
          </span>
          <span title="Italic" className="cursor-default italic select-none">
            I
          </span>
          <span title="Link" className="cursor-default select-none">
            🔗
          </span>
          <span title="Emoji" className="cursor-default select-none">
            😊
          </span>
          <span title="Attach" className="cursor-default select-none">
            📎
          </span>
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

function TeammateAvatar({
  initials,
  backgroundColor,
  size = "md",
}: {
  initials: string;
  backgroundColor: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? 44 : 36;
  const fs = size === "lg" ? 14 : 13;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)]"
      style={{
        width: dim,
        height: dim,
        fontSize: fs,
        backgroundColor,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function teammateByHandle(handle: string) {
  return slack.teammates.find((t) => t.handle === handle);
}

type SlackMsg = (typeof slack.messages)[number];

function InlineActionRow({ actions }: { actions: readonly string[] }) {
  const labels: Record<string, string> = {
    approve: "Approve",
    edit: "Edit",
    skip: "Skip",
  };
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {actions.map((a) => (
        <span
          key={a}
          className="cursor-default select-none rounded border border-[#cccccc] bg-[#f8f8f8] px-2.5 py-1 text-[12px] font-semibold text-[#1d1c1d] shadow-sm"
        >
          {labels[a] ?? a}
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
          <p className="mt-1 text-[15px] font-normal leading-[1.46668]" style={{ color: SLACK_TEXT }}>
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  const tm = teammateByHandle(message.agentHandle);
  const initials = tm?.initials ?? "??";
  const bg = tm?.avatarColor ?? "#4A154B";

  return (
    <div className="flex gap-3" style={{ gap: 12 }}>
      <TeammateAvatar initials={initials} backgroundColor={bg} />
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className="text-[15px] font-bold text-[#1d1c1d]">{message.agentHandle}</span>
          <span className="text-[12px] font-normal text-[#616061]">{message.time}</span>
        </div>
        <p className="mt-1 text-[15px] font-normal leading-[1.46668]" style={{ color: SLACK_TEXT }}>
          {message.text}
        </p>
        {"actions" in message && message.actions ? (
          <InlineActionRow actions={message.actions} />
        ) : null}
        {"taskTag" in message && message.taskTag ? (
          <p className="mt-2 text-[13px] font-medium leading-snug text-[#1264A3]">{message.taskTag}</p>
        ) : null}
        {"showDeployButton" in message && message.showDeployButton ? (
          <div className="mt-2">
            <span className="inline-flex cursor-default select-none items-center rounded border border-[#0a0a0a] bg-[#007A5A] px-3 py-1.5 text-[13px] font-bold text-white shadow-[2px_2px_0_0_#0a0a0a]">
              Deploy
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SlackUI() {
  const active = slack.activeChannel;

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
              {/* Value prop — floating callout on the mock */}
              <div
                className="pointer-events-none absolute right-2 top-2 z-20 max-w-[min(14rem,calc(100vw-3rem))] rotate-[0.5deg] border-[3px] border-black bg-[#fffef8] px-2.5 py-1.5 text-center font-mono text-[9px] font-bold uppercase leading-snug tracking-wide text-black shadow-[4px_4px_0_0_#0a0a0a] sm:right-4 sm:top-4 sm:max-w-[15rem] sm:px-3 sm:py-2 sm:text-[11px]"
                role="note"
              >
                {slack.valuePropBadge}
              </div>
              {/* Sidebar — Slack aubergine */}
              <aside
                className="flex w-full shrink-0 flex-col md:w-[240px]"
                style={{ backgroundColor: SLACK_PURPLE }}
              >
                <div className="flex flex-1 flex-col px-3 pb-4 pt-4">
                  <p
                    className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: SLACK_MUTED }}
                  >
                    Channels
                  </p>
                  <ul className="space-y-0.5">
                    {slack.channels.map((ch) => {
                      const isActive = ch === slack.activeChannel;
                      return (
                        <li key={ch}>
                          <div
                            className={`flex cursor-default items-center rounded-md px-2 py-1.5 text-[15px] ${
                              isActive ? "text-white" : "text-white/95"
                            }`}
                            style={{
                              backgroundColor: isActive ? SLACK_ACTIVE : "transparent",
                            }}
                          >
                            <span className="mr-0.5 font-normal opacity-75">#</span>
                            <span className={isActive ? "font-bold" : "font-normal"}>
                              {ch.replace("#", "")}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p
                      className="px-2 pb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
                      style={{ textShadow: "0 1px 0 rgba(0,0,0,0.2)" }}
                    >
                      Direct messages
                    </p>
                    <ul className="space-y-2">
                      {slack.teammates.map((t) => (
                        <li key={t.handle}>
                          <div className="flex cursor-default items-center gap-3 rounded-lg bg-white/[0.07] px-2 py-2.5 pr-3 text-white ring-1 ring-white/10">
                            <TeammateAvatar
                              initials={t.initials}
                              backgroundColor={t.avatarColor}
                              size="lg"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: PRESENCE }}
                                  aria-hidden
                                />
                                <span className="truncate text-[15px] font-semibold tracking-tight">
                                  {t.handle}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* Main */}
              <div className="flex min-w-0 flex-1 flex-col bg-white">
                <header className="flex items-center border-b border-[#e8e8e8] bg-white px-4 py-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-black leading-none text-[#1d1c1d]">#</span>
                    <h3 className="text-[18px] font-bold leading-tight text-[#1d1c1d]">
                      {active.replace("#", "")}
                    </h3>
                  </div>
                </header>

                <div className="flex flex-1 flex-col">
                  <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                    {slack.messages.map((m) => (
                      <SlackMessageBlock key={m.id} message={m} />
                    ))}
                  </div>
                  <SlackComposer channelLabel={active} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
