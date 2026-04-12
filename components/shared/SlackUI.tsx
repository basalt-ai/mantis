import { slack } from "@/lib/copy";

const SLACK_PURPLE = "#4A154B";
const SLACK_ACTIVE = "rgba(255,255,255,0.14)";
const SLACK_MUTED = "rgba(255,255,255,0.55)";
const SLACK_TEXT = "#1d1c1d";
const PRESENCE = "#22C55E";

function SlackComposer() {
  return (
    <div className="border-t border-[#e8e8e8] bg-white px-4 pb-4 pt-3">
      <div className="rounded-lg border border-[#cccccc] bg-white px-3 py-2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]">
        <div className="min-h-[22px] text-[15px] leading-normal text-[#868686]">
          Message #sales
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

function BotAvatar() {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-base leading-none text-[#4A154B] ring-1 ring-[#e0e0e0]"
      style={{ width: 36, height: 36 }}
      aria-hidden
    >
      ⚡
    </div>
  );
}

function AppBadge() {
  return (
    <span className="inline-flex items-center rounded border border-[#dddddd] bg-[#f8f8f8] px-[5px] py-[1px] text-[10px] font-bold uppercase leading-none tracking-wide text-[#555555]">
      APP
    </span>
  );
}

function ThreadPreview() {
  return (
    <div className="ml-12 mt-2 flex flex-wrap items-center gap-2 text-[13px] leading-snug text-[#1264A3]">
      <span className="text-[#616061]">💬</span>
      <span className="font-medium">3 replies</span>
      <span className="text-[#616061]">· agents coordinating follow-up</span>
      <span className="ml-1 inline-flex items-center pl-1">
        <span
          className="inline-block h-6 w-6 rounded-full border-2 border-white bg-[#36C5F0] ring-1 ring-[#e0e0e0]"
          aria-hidden
        />
        <span
          className="-ml-2 inline-block h-6 w-6 rounded-full border-2 border-white bg-[#E01E5A] ring-1 ring-[#e0e0e0]"
          aria-hidden
        />
        <span
          className="-ml-2 inline-block h-6 w-6 rounded-full border-2 border-white bg-[#4A154B] ring-1 ring-[#e0e0e0]"
          aria-hidden
        />
      </span>
    </div>
  );
}

function SlackRow({ message }: { message: (typeof slack.messages)[number] }) {
  const isAgent = message.isAgent;

  return (
    <div>
      <div className="flex gap-3" style={{ gap: 12 }}>
        {isAgent ? (
          <BotAvatar />
        ) : (
          <UserAvatar initials="YO" className="bg-[#36C5F0]" />
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <span className="text-[15px] font-bold text-[#1d1c1d]">{message.sender}</span>
            {isAgent && <AppBadge />}
            <span className="text-[12px] font-normal text-[#616061]">{message.time}</span>
          </div>
          <p className="mt-1 text-[15px] font-normal leading-[1.46668]" style={{ color: SLACK_TEXT }}>
            {message.text}
          </p>
          {"thread" in message && message.thread && <ThreadPreview />}
          {"taskDone" in message && message.taskDone && (
            <p className="mt-2 text-[13px] font-normal leading-snug" style={{ color: PRESENCE }}>
              Task completed · deploy pipeline
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SlackUI() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          {slack.title}
        </h2>

        {/* Outer: brutalist frame only */}
        <div className="mt-12 overflow-hidden rounded-theme brut-border bg-white">
          <div
            className="flex min-h-[520px] flex-col overflow-hidden border border-solid border-[#e0e0e0] shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:min-h-[560px] md:flex-row"
            style={{
              fontFamily: 'var(--font-lato), "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {/* Sidebar — Slack aubergine */}
            <aside
              className="flex w-full shrink-0 flex-col md:w-[220px]"
              style={{ backgroundColor: SLACK_PURPLE }}
            >
              <div className="px-3 pb-3 pt-4">
                <p
                  className="px-2 pb-2 text-[13px] font-bold uppercase tracking-wide"
                  style={{ color: SLACK_MUTED }}
                >
                  Channels
                </p>
                <ul className="space-y-0.5">
                  {slack.channels.map((ch) => {
                    const active = ch === slack.activeChannel;
                    return (
                      <li key={ch}>
                        <div
                          className={`flex cursor-default items-center rounded-md px-2 py-1.5 text-[15px] ${
                            active ? "text-white" : "text-white/95"
                          }`}
                          style={{
                            backgroundColor: active ? SLACK_ACTIVE : "transparent",
                          }}
                        >
                          <span className="mr-0.5 font-normal opacity-75">#</span>
                          <span className={active ? "font-bold" : "font-normal"}>
                            {ch.replace("#", "")}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <p
                  className="mt-5 px-2 pb-2 text-[13px] font-bold uppercase tracking-wide"
                  style={{ color: SLACK_MUTED }}
                >
                  Direct messages
                </p>
                <ul className="space-y-0.5">
                  {slack.directMessages.map((name) => (
                    <li key={name}>
                      <div className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[15px] text-white/95">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: PRESENCE }}
                          aria-hidden
                        />
                        <span className="truncate font-normal">{name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col bg-white">
              <header className="flex items-center border-b border-[#e8e8e8] bg-white px-4 py-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[22px] font-black leading-none text-[#1d1c1d]">#</span>
                  <h3 className="text-[18px] font-bold leading-tight text-[#1d1c1d]">
                    {slack.activeChannel.replace("#", "")}
                  </h3>
                </div>
              </header>

              <div className="flex flex-1 flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                  {slack.messages.map((m) => (
                    <SlackRow key={m.id} message={m} />
                  ))}
                </div>
                <SlackComposer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
