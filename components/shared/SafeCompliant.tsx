import { HiOutlineLockOpen } from "react-icons/hi2";

import { safeCompliant } from "@/lib/copy";

/** Same purple as the Slack mockup’s left column (`SlackUI` sidebar). */
const iconClass = "h-8 w-8 text-[#4A154B]";

function HumanApprovalIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        opacity={0.9}
      />
    </svg>
  );
}

function AuditLogIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
      <path
        fill="currentColor"
        d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
        opacity={0.9}
      />
    </svg>
  );
}

function ScopedAccessIcon() {
  return <HiOutlineLockOpen className={`${iconClass} opacity-90`} aria-hidden />;
}

function SafeCompliantIcon({ kind }: { kind: "check" | "list" | "lock" }) {
  switch (kind) {
    case "check":
      return <HumanApprovalIcon />;
    case "list":
      return <AuditLogIcon />;
    case "lock":
      return <ScopedAccessIcon />;
  }
}

export function SafeCompliant() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          {safeCompliant.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {safeCompliant.badges.map((b) => (
            <div key={b.title} className="rounded-theme brut-border bg-[#c9b8ff] p-6 text-center">
              <div className="flex justify-center">
                <SafeCompliantIcon kind={b.icon} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-[var(--text)]">
                {b.title}
              </h3>
              <p className="mt-2 text-[0.7rem] leading-snug text-[var(--text-muted)] sm:text-[0.75rem]">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
